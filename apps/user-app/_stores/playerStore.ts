// apps/user-app/_stores/playerStore.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { AudioTrackDetailsResponseDTO } from '@repo/types';
import { AUDIO_DURATION_THRESHOLD_MS, PlaybackState } from '@/_lib/constants';
import { getTrackDetails } from '@/_services/trackService';
import { debounce } from '@repo/utils';
import { recordProgressAction } from '@/_actions/userActivityActions';

// --- State Interface ---
interface PlayerState {
  playbackState: PlaybackState;
  currentTrackDetails: AudioTrackDetailsResponseDTO | null;
  isStreamingMode: boolean;
  duration: number; // seconds
  currentTime: number; // seconds
  // bufferedTime: number; // Removed for simplicity, rely on native buffering indicators if needed
  volume: number;
  isMuted: boolean;
  error: string | null;
  _audioContext: AudioContext | null;
  _gainNode: GainNode | null;
  _audioBuffer: AudioBuffer | null;
  _sourceNode: AudioBufferSourceNode | MediaElementAudioSourceNode | null;
  _htmlAudioElement: HTMLAudioElement | null; // Ref to the <audio> element
  _playbackStartTime: number; // WAAPI: context time when playback started
  _playbackStartOffset: number; // WAAPI: time in audio buffer where playback started
  _animationFrameId: number | null; // WAAPI: ID for time update loop
  _currentTrackIdLoading: string | null; // Track which track ID is currently being loaded/processed
}

// --- Actions Interface ---
interface PlayerActions {
  loadAndPlayTrack: (trackId: string) => Promise<void>;
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  seek: (timeSeconds: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  stop: () => void; // Full stop and unload
  cleanup: () => void; // Cleanup audio resources
  _setHtmlAudioElementRef: (element: HTMLAudioElement | null) => void; // Internal action to set ref
  _initAudioContext: () => AudioContext | null; // Internal action
}

// --- Initial State ---
const initialState: PlayerState = {
  playbackState: PlaybackState.IDLE,
  currentTrackDetails: null,
  isStreamingMode: false,
  duration: 0,
  currentTime: 0,
  // bufferedTime: 0,
  volume: 0.8,
  isMuted: false,
  error: null,
  _audioContext: null,
  _gainNode: null,
  _audioBuffer: null,
  _sourceNode: null,
  _htmlAudioElement: null,
  _playbackStartTime: 0,
  _playbackStartOffset: 0,
  _animationFrameId: null,
  _currentTrackIdLoading: null,
};

// --- Debounced Progress Recording ---
const debouncedRecordProgress = debounce((trackId: string, progressMs: number) => {
    if (trackId && progressMs >= 0) { // Allow recording 0 progress
        recordProgressAction(trackId, Math.round(progressMs))
            .then(result => { if (!result.success) console.warn("Failed to record progress via action:", result.message); })
            .catch(err => { console.error("Error calling recordProgressAction:", err); });
    }
}, 3000); // Record every 3 seconds of playback

// --- Store Implementation ---
export const usePlayerStore = create(
  immer<PlayerState & PlayerActions>((set, get) => {

    // --- Internal Helper Functions ---
    const log = (message: string, ...args: any[]) => console.log(`[PlayerStore] ${message}`, ...args);
    const warn = (message: string, ...args: any[]) => console.warn(`[PlayerStore] ${message}`, ...args);
    const errorLog = (message: string, ...args: any[]) => console.error(`[PlayerStore] ${message}`, ...args);

    const setError = (message: string, trackId?: string) => {
      errorLog("Error set:", message, trackId ? `(Track: ${trackId})` : '');
      set((state) => {
        // Only set error if it pertains to the track currently being loaded/played
        if (!trackId || state._currentTrackIdLoading === trackId || state.currentTrackDetails?.id === trackId) {
            state.playbackState = PlaybackState.ERROR;
            state.error = message;
            state._currentTrackIdLoading = null; // Clear loading state on error
            internalStop(state); // Stop any ongoing playback/loops on error
        } else {
            warn(`Error for track ${trackId} ignored, current loading/playing is ${state._currentTrackIdLoading ?? state.currentTrackDetails?.id}`);
        }
      });
    };

    const initAudioContextIfNeeded = (): AudioContext | null => {
        let state = get();
        let ctx = state._audioContext;
        if (!ctx || ctx.state === 'closed') {
            log("Initializing AudioContext");
            try {
                ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                const gainNode = ctx.createGain();
                gainNode.connect(ctx.destination);
                set({ _audioContext: ctx, _gainNode: gainNode }); // Update store state
                // Re-get state after update
                const updatedState = get();
                ctx = updatedState._audioContext; // Use potentially updated context
                if (updatedState._gainNode) {
                    updatedState._gainNode.gain.setValueAtTime(updatedState.isMuted ? 0 : updatedState.volume, ctx!.currentTime);
                }
            } catch (e) {
                 errorLog("Failed to initialize AudioContext", e);
                 setError("Audio playback not supported by this browser.");
                 return null;
            }
        }
        // Resume context if suspended
        if (ctx && ctx.state === 'suspended') {
             ctx.resume().catch(e => warn("Could not resume AudioContext:", e));
        }
        return ctx;
    };

    const updateTimeWAAPI = () => {
      set(state => {
          if (state.playbackState !== PlaybackState.PLAYING || !state._audioContext || state.isStreamingMode || !state._gainNode) {
              if (state._animationFrameId) cancelAnimationFrame(state._animationFrameId);
              state._animationFrameId = null;
              return;
          }

          const elapsed = state._audioContext.currentTime - state._playbackStartTime;
          let newTime = state._playbackStartOffset + elapsed;

          // Clamp time to duration, prevent negative values
          newTime = Math.max(0, Math.min(newTime, state.duration));

          // Only update state if time actually changed significantly
          if (Math.abs(newTime - state.currentTime) > 0.05) {
              state.currentTime = newTime;
              if (state.currentTrackDetails?.id) {
                  debouncedRecordProgress(state.currentTrackDetails.id, Math.floor(newTime * 1000));
              }
          }

          if (newTime >= state.duration) {
              // End of track reached
              state.playbackState = PlaybackState.ENDED;
              state.currentTime = state.duration; // Ensure final time is exactly duration
              if (state.currentTrackDetails?.id) {
                  debouncedRecordProgress(state.currentTrackDetails.id, Math.floor(state.duration * 1000));
              }
              internalStop(state); // Stop source node and animation frame
          } else {
              // Continue animation loop
              state._animationFrameId = requestAnimationFrame(updateTimeWAAPI);
          }
      });
    };


    const internalStop = (state: PlayerState) => {
        log("Internal Stop Called. Streaming:", state.isStreamingMode, "State:", state.playbackState);
        if (state._animationFrameId) {
            cancelAnimationFrame(state._animationFrameId);
            state._animationFrameId = null;
        }
        // Stop Web Audio API source node
        if (state._sourceNode && state._sourceNode instanceof AudioBufferSourceNode) {
            try {
                state._sourceNode.stop();
                state._sourceNode.disconnect(); // Disconnect to allow garbage collection
            } catch (e) { warn("Error stopping/disconnecting AudioBufferSourceNode:", e); }
        }
        // For streaming mode, pause the HTML element
        if (state._htmlAudioElement && state.isStreamingMode && !state._htmlAudioElement.paused) {
           try { state._htmlAudioElement.pause(); } catch (e) { warn("Error pausing HTMLAudioElement:", e); }
        }
        // Don't nullify _sourceNode here if it's MediaElementSourceNode, might be reused.
        // Let loadAndPlayTrack manage disconnecting/reconnecting MediaElementSourceNode if needed.

         state._playbackStartTime = 0;
         // Keep _playbackStartOffset to represent the paused position for WAAPI
         if (state.playbackState !== PlaybackState.PAUSED && state.playbackState !== PlaybackState.SEEKING) {
             state._playbackStartOffset = state.currentTime; // Update offset when stopping, unless paused/seeking
         }
    };

    const applyVolumeAndMute = (state: PlayerState) => {
         if (state._gainNode && state._audioContext) {
             state._gainNode.gain.setValueAtTime(state.isMuted ? 0 : state.volume, state._audioContext.currentTime);
         }
         if (state._htmlAudioElement) {
            state._htmlAudioElement.volume = state.volume; // HTML volume handles mute separately
            state._htmlAudioElement.muted = state.isMuted;
         }
    };

    // HTML Audio Element Listeners Setup/Cleanup
    const setupAudioElementListeners = (element: HTMLAudioElement) => {
        const s = get(); // Get current state reference inside listener setup

        element.onplay = () => set(state => { if (state.isStreamingMode && state.playbackState !== PlaybackState.PLAYING) state.playbackState = PlaybackState.PLAYING; });
        element.onpause = () => set(state => { if (state.isStreamingMode && state.playbackState !== PlaybackState.ENDED && state.playbackState !== PlaybackState.IDLE && state.playbackState !== PlaybackState.ERROR) state.playbackState = PlaybackState.PAUSED; });
        element.onended = () => {
            log("HTMLAudioElement: ended");
            set(state => {
               if(state.isStreamingMode) {
                   state.playbackState = PlaybackState.ENDED;
                   state.currentTime = state.duration; // Ensure time is set to end
                   if (state.currentTrackDetails?.id) {
                       debouncedRecordProgress(state.currentTrackDetails.id, Math.floor(state.duration * 1000));
                   }
                   internalStop(state); // Stop any potential loops or resources
               }
            });
        };
        element.onwaiting = () => set(state => { if(state.isStreamingMode) state.playbackState = PlaybackState.BUFFERING; });
        element.onplaying = () => set(state => { if(state.isStreamingMode) state.playbackState = PlaybackState.PLAYING; }); // Playing implies buffering is done
        element.onloadedmetadata = () => {
            log("HTMLAudioElement: loadedmetadata");
            set(state => { if(state.isStreamingMode) state.duration = element.duration || 0; });
        };
        element.onloadeddata = () => { // Fired when current frame data loaded
             log("HTMLAudioElement: loadeddata");
             // Potentially move from BUFFERING to READY if paused? Or wait for 'canplay'/'playing'
        };
        element.oncanplay = () => { // Fired when enough data is buffered to start playing
            log("HTMLAudioElement: canplay");
             set(state => { if (state.isStreamingMode && state.playbackState === PlaybackState.BUFFERING) { /* Maybe move to READY if paused? */ }});
        };
        element.ontimeupdate = () => {
            const htmlCurrentTime = element.currentTime;
            const state = get(); // Get fresh state inside event handler
            if (state.isStreamingMode && Math.abs(state.currentTime - htmlCurrentTime) > 0.05) { // Only update if changed significantly
                set(draft => {
                    draft.currentTime = htmlCurrentTime;
                    if (draft.currentTrackDetails?.id) {
                        debouncedRecordProgress(draft.currentTrackDetails.id, Math.floor(htmlCurrentTime * 1000));
                    }
                });
            }
         };
        // element.onprogress = () => { /* Buffered time - removed for simplicity */ };
        element.onerror = (e) => {
             errorLog("HTMLAudioElement error:", element.error);
             setError(`Audio playback error: ${element.error?.message || 'Unknown error'}`, get().currentTrackDetails?.id);
        };
    };
    const removeAudioElementListeners = (element: HTMLAudioElement) => { /* ... set all listeners to null ... */ };


    // --- Public Actions ---
    return {
      ...initialState,

      _initAudioContext: initAudioContextIfNeeded,

      _setHtmlAudioElementRef: (element) => {
         set(state => {
             if (state._htmlAudioElement && state._htmlAudioElement !== element) { removeAudioElementListeners(state._htmlAudioElement); }
             state._htmlAudioElement = element;
             if (element) {
                setupAudioElementListeners(element);
                applyVolumeAndMute(state); // Apply current volume/mute
                // Disconnect old MediaElementSourceNode if context/element changes
                 if (state._sourceNode instanceof MediaElementAudioSourceNode && (state._sourceNode.context !== state._audioContext || state._sourceNode.mediaElement !== element)) {
                     try { state._sourceNode.disconnect(); } catch (e) { warn("Error disconnecting old MediaElementSourceNode", e)}
                     state._sourceNode = null;
                 }
             }
        });
      },

      loadAndPlayTrack: async (trackId) => {
        const currentLoadingId = get()._currentTrackIdLoading;
        const currentPlayingId = get().currentTrackDetails?.id;

        if (currentLoadingId === trackId) { log(`Track ${trackId} is already loading.`); return; }
        if (currentPlayingId === trackId && get().playbackState !== PlaybackState.IDLE && get().playbackState !== PlaybackState.ERROR) {
            log(`Track ${trackId} is already loaded. Toggling play/pause.`);
            get().togglePlayPause(); // Just play/pause if already loaded
            return;
        }

        log(`Loading track: ${trackId}`);
        get().stop(); // Stop previous track completely

        set({
            _currentTrackIdLoading: trackId, // Mark this track as loading
            isLoading: true, // Use combined loading state
            playbackState: PlaybackState.LOADING,
            error: null,
            currentTrackDetails: null, duration: 0, currentTime: 0, _playbackStartOffset: 0,
            isStreamingMode: false, _audioBuffer: null,
        });

        try {
          // Fetch details (includes playURL and potentially user progress)
          const trackDetails = await getTrackDetails(trackId);

          // Check if load was cancelled while fetching details
          if (get()._currentTrackIdLoading !== trackId) { log(`Load cancelled for ${trackId} during fetch.`); return; }

          if (!trackDetails?.playUrl) throw new Error("Track details or play URL missing.");

          const useStreaming = trackDetails.durationMs > AUDIO_DURATION_THRESHOLD_MS;
          const trackDurationSec = trackDetails.durationMs / 1000;
          // Load initial progress if available (user must be logged in for this)
          let initialSeekTime = trackDetails.userProgressMs != null && trackDetails.userProgressMs > 0
                                ? Math.min(trackDetails.userProgressMs / 1000, trackDurationSec) // Use progress, clamp to duration
                                : 0;

          log(`Track details loaded for ${trackId}. Duration: ${trackDurationSec}s. Streaming: ${useStreaming}. Initial Seek: ${initialSeekTime}s`);

          set(state => {
              state.currentTrackDetails = trackDetails;
              state.duration = trackDurationSec;
              state.isStreamingMode = useStreaming;
              state.currentTime = initialSeekTime; // Set current time
              state._playbackStartOffset = initialSeekTime; // Important for WAAPI restart
          });

          const audioContext = initAudioContextIfNeeded();
          if (!audioContext) { throw new Error("AudioContext initialization failed."); } // Stop if context failed

          // --- Mode-Specific Loading ---
          if (useStreaming) {
             log("Using Streaming Mode for", trackId);
              set({ playbackState: PlaybackState.LOADING }); // Still loading until data flows
              const audioEl = get()._htmlAudioElement;
              if (!audioEl) throw new Error("HTMLAudioElement ref not available.");

              // Connect MediaElementSource if not already done for this context/element
               let sourceNode = get()._sourceNode;
               if (!sourceNode || !(sourceNode instanceof MediaElementAudioSourceNode) || sourceNode.context !== audioContext || sourceNode.mediaElement !== audioEl) {
                   if (sourceNode) { try { sourceNode.disconnect(); } catch(e){ warn("Disconnect error", e); } } // Disconnect old
                    try {
                        log("Creating and connecting MediaElementAudioSourceNode");
                        sourceNode = audioContext.createMediaElementSource(audioEl);
                        sourceNode.connect(get()._gainNode!);
                        set(state => { state._sourceNode = sourceNode; });
                    } catch (err: any) {
                        warn("Could not create/connect media element source. Playback might work directly via element.", err);
                        setError(`Audio connection error: ${err.message}`, trackId); // Set error if connection fails
                        return; // Stop further processing
                    }
               }

              audioEl.src = trackDetails.playUrl;
              audioEl.load(); // Important: load() after setting src
              // Apply initial seek time AFTER load() is called
              if (initialSeekTime > 0) {
                  // Need to wait for 'loadedmetadata' or 'canplay' before setting currentTime effectively
                   const setInitialTime = () => {
                       if (get()._currentTrackIdLoading === trackId) { // Check if still loading this track
                           log(`Setting initial currentTime for streaming: ${initialSeekTime}`);
                           audioEl.currentTime = initialSeekTime;
                       }
                       audioEl.removeEventListener('loadedmetadata', setInitialTime);
                       audioEl.removeEventListener('canplay', setInitialTime);
                   };
                   audioEl.addEventListener('loadedmetadata', setInitialTime, { once: true });
                   audioEl.addEventListener('canplay', setInitialTime, { once: true }); // Fallback
              }
              // Attempt to play
              audioEl.play().catch(err => {
                    warn(`Auto-play likely blocked for streaming track ${trackId}:`, err);
                    // Don't auto-set error here, browser block is expected. Move to READY state.
                    set(s => {
                        if (s._currentTrackIdLoading === trackId) { // Ensure we only update state for the correct track
                             s.playbackState = PlaybackState.READY;
                             s._currentTrackIdLoading = null;
                        }
                    });
               });
               // State will move to PLAYING/BUFFERING via element events if play succeeds

          } else { // --- WAAPI Buffer Mode ---
            log("Using WAAPI Buffer Mode for", trackId);
            set({ playbackState: PlaybackState.LOADING }); // Explicitly loading
            const response = await fetch(trackDetails.playUrl);
            if (!response.ok) throw new Error(`Failed to fetch audio: ${response.status} ${response.statusText}`);
            const arrayBuffer = await response.arrayBuffer();

             if (get()._currentTrackIdLoading !== trackId) { log(`Load cancelled for ${trackId} during fetch/decode.`); return; } // Check again

            set({ playbackState: PlaybackState.DECODING });
            log("Decoding audio buffer...");
            audioContext.decodeAudioData(arrayBuffer,
                (decodedBuffer) => {
                    log("Audio decoded successfully.");
                    if (get()._currentTrackIdLoading !== trackId) { log(`Load cancelled for ${trackId} after decode.`); return; } // Final check

                    set(state => {
                        state._audioBuffer = decodedBuffer;
                        state.duration = decodedBuffer.duration; // Update duration from decoded buffer
                        // Re-clamp initial seek time based on actual decoded duration
                        state.currentTime = Math.max(0, Math.min(state.currentTime, state.duration));
                        state._playbackStartOffset = state.currentTime;
                        state.playbackState = PlaybackState.READY; // Ready to play
                        state._currentTrackIdLoading = null; // Loading complete
                    });
                    get().play(); // Auto-play after decoding
                },
                (decodeErr: DOMException) => { throw new Error(`Failed to decode audio: ${decodeErr.message}`); } // Throw to be caught below
            );
          }
        } catch (err: any) {
          setError(`Failed to load track ${trackId}: ${err.message}`, trackId);
        }
      },

      play: () => {
        const { playbackState, isStreamingMode, _htmlAudioElement, _audioContext, _audioBuffer, currentTime, duration, _gainNode } = get();
        log(`Play action called. State: ${playbackState}, Streaming: ${isStreamingMode}`);

        if (playbackState !== PlaybackState.READY && playbackState !== PlaybackState.PAUSED && playbackState !== PlaybackState.ENDED) {
            warn(`Cannot play from state: ${playbackState}`);
            return;
        }
        if (!_audioContext || !_gainNode) { warn("Audio context/gain node not ready."); return; }
        if (_audioContext.state === 'suspended') { _audioContext.resume().catch(e => warn("Resume context failed", e)); }

        const startTime = (playbackState === PlaybackState.ENDED) ? 0 : currentTime; // Restart if ended

        if (isStreamingMode) {
          if (_htmlAudioElement) {
              log(`Playing HTMLAudioElement from ${startTime}`);
              _htmlAudioElement.currentTime = startTime; // Ensure correct start time
              _htmlAudioElement.play().catch(err => setError(`Play command failed: ${err.message}`, get().currentTrackDetails?.id));
          } else { setError("HTML audio element not available."); }
        } else { // WAAPI Mode
          if (!_audioBuffer) { setError("Audio buffer not loaded."); return; }
          internalStop(get()); // Stop existing source if any

          log(`Playing WAAPI from ${startTime}`);
          const source = _audioContext.createBufferSource();
          source.buffer = _audioBuffer;
          source.connect(_gainNode);

          const offset = Math.max(0, startTime % _audioBuffer.duration); // Use modulo for looping? Or just clamp? Clamp for now.
          const clampedOffset = Math.max(0, Math.min(startTime, _audioBuffer.duration));

          set(state => {
              state._sourceNode = source;
              state._playbackStartTime = _audioContext.currentTime; // Record context time
              state._playbackStartOffset = clampedOffset; // Record audio buffer time
              state.currentTime = clampedOffset; // Update current time display immediately
              state.playbackState = PlaybackState.PLAYING;
              state.error = null;
              state._currentTrackIdLoading = null; // Ensure loading state is cleared
              if (state._animationFrameId === null) { // Start update loop if not already running
                  state._animationFrameId = requestAnimationFrame(updateTimeWAAPI);
              }
          });

           source.onended = () => { // Let update loop handle ENDED state via duration check
               log("WAAPI source ended.");
               // Only update state if it was supposed to be playing (prevent setting ENDED if paused/stopped manually)
               const finalState = get();
               if (finalState.playbackState === PlaybackState.PLAYING && finalState._sourceNode === source) {
                    // If it ended naturally, updateTimeWAAPI should handle setting state to ENDED
                    // If stopped manually, internalStop handles it.
                    // This handler mainly prevents dangling states.
               }
           };

          try {
              source.start(0, clampedOffset);
          } catch (e) {
              setError(`Failed to start WAAPI source: ${e instanceof Error ? e.message : String(e)}`);
          }
        }
      },

      pause: () => {
         const state = get();
         log(`Pause action called. State: ${state.playbackState}`);
         if (state.playbackState !== PlaybackState.PLAYING && state.playbackState !== PlaybackState.BUFFERING) return;

          // Update internal offset before stopping source
          if (!state.isStreamingMode && state._audioContext) {
               const elapsed = state._audioContext.currentTime - state._playbackStartTime;
               state._playbackStartOffset = Math.max(0, Math.min(state._playbackStartOffset + elapsed, state.duration));
               state.currentTime = state._playbackStartOffset; // Ensure currentTime reflects paused position accurately
          }

          internalStop(state); // Handles stopping source/audio and cancelling animation frame
         set(s => { s.playbackState = PlaybackState.PAUSED; });
      },

      togglePlayPause: () => {
         const { playbackState } = get();
         log(`Toggle Play/Pause. Current State: ${playbackState}`);
         if (playbackState === PlaybackState.PLAYING || playbackState === PlaybackState.BUFFERING) {
             get().pause();
         } else if (playbackState === PlaybackState.PAUSED || playbackState === PlaybackState.READY || playbackState === PlaybackState.ENDED) {
             get().play();
         } else {
             warn(`Toggle Play/Pause ignored in state: ${playbackState}`);
         }
      },

      seek: (timeSeconds) => {
          const { duration, playbackState, isStreamingMode, _htmlAudioElement, _audioContext, _audioBuffer, _sourceNode } = get();
          log(`Seek action called. Time: ${timeSeconds}s, State: ${playbackState}`);

          if (duration <= 0 || playbackState === PlaybackState.LOADING || playbackState === PlaybackState.DECODING || playbackState === PlaybackState.IDLE) {
              warn(`Seek ignored in state: ${playbackState} or duration <= 0`);
              return;
          }

          const seekTime = Math.max(0, Math.min(timeSeconds, duration)); // Clamp seek time

          // Update current time immediately for responsive UI
          set(state => { state.currentTime = seekTime; });

           // Record progress on seek end (debounced)
           if (get().currentTrackDetails?.id) {
                debouncedRecordProgress(get().currentTrackDetails!.id, Math.floor(seekTime * 1000));
           }

           const wasPlaying = playbackState === PlaybackState.PLAYING;

          if (isStreamingMode) {
              if (_htmlAudioElement) {
                  log(`Seeking HTMLAudioElement to ${seekTime}`);
                  _htmlAudioElement.currentTime = seekTime;
                  // If it was playing, HTML element might pause briefly on seek, resume if needed
                  if (wasPlaying && _htmlAudioElement.paused) {
                      _htmlAudioElement.play().catch(e => warn("Error resuming play after seek (HTML)", e));
                  }
              } else { warn("Seek failed: HTML element not available."); }
          } else { // WAAPI Mode
              log(`Seeking WAAPI to ${seekTime}`);
              // Update the offset for the *next* play command
              set(state => { state._playbackStartOffset = seekTime; });
              if (wasPlaying) {
                  // Stop current source and immediately restart from new offset
                   internalStop(state); // Stop current source node
                   get().play(); // Will use the updated _playbackStartOffset
              }
              // If paused/ready/ended, the updated offset will be used on the next play() call.
          }
      },

      setVolume: (volume) => {
        const newVolume = Math.max(0, Math.min(1, volume));
         set(state => {
             state.volume = newVolume;
             if (newVolume > 0 && state.isMuted) { state.isMuted = false; } // Unmute if volume > 0
             applyVolumeAndMute(state);
         });
      },

      toggleMute: () => {
         set(state => {
            state.isMuted = !state.isMuted;
            applyVolumeAndMute(state);
         });
      },

      stop: () => { // Full stop, unload track
          log("Stop action called - unloading track");
          const state = get(); // Get current state for cleanup
          const currentTrackId = state.currentTrackDetails?.id;
          const currentTimeMs = state.currentTime * 1000;

          // Force immediate progress recording before unloading
          if (currentTrackId && currentTimeMs >= 0) {
               log(`Recording final progress ${Math.round(currentTimeMs)}ms on stop`);
               // Call directly, bypassing debounce for immediate final save
               recordProgressAction(currentTrackId, Math.round(currentTimeMs))
                   .catch(err => errorLog("Error recording final progress on stop:", err));
          }
          debouncedRecordProgress.cancel(); // Cancel any pending debounced calls

          internalStop(state); // Stop audio sources, animation frames

          set(draft => { // Reset state
              draft.playbackState = PlaybackState.IDLE;
              draft.currentTrackDetails = null;
              draft.duration = 0;
              draft.currentTime = 0;
              draft.error = null;
              draft.isStreamingMode = false;
              draft._audioBuffer = null;
              draft._currentTrackIdLoading = null;
              draft._playbackStartOffset = 0;
              draft._playbackStartTime = 0;
              if (draft._htmlAudioElement) {
                  // Fully reset HTML element
                   try {
                       draft._htmlAudioElement.pause();
                       draft._htmlAudioElement.removeAttribute("src");
                       draft._htmlAudioElement.load(); // Request unload
                       log("HTMLAudioElement reset.");
                   } catch (e) { warn("Error resetting HTMLAudioElement:", e); }
              }
              // Keep _audioContext and _gainNode alive, but disconnect source
              if (draft._sourceNode) {
                  try { draft._sourceNode.disconnect(); } catch(e) {}
                  draft._sourceNode = null;
              }
          });
      },

      cleanup: () => {
         log("Cleanup action called");
         get().stop(); // Ensure everything is stopped and progress potentially saved

         set(state => {
              // Close AudioContext
              if (state._audioContext && state._audioContext.state !== 'closed') {
                 state._audioContext.close().catch(e => warn("Error closing AudioContext:", e));
              }
              // Nullify all internal refs
              state._audioContext = null;
              state._gainNode = null;
              state._audioBuffer = null;
              state._sourceNode = null;
              // Keep _htmlAudioElement ref if managed externally, or nullify if store controls it
              // state._htmlAudioElement = null; // If store owns it
         });
      }
    };
  })
);