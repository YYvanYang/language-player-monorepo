// apps/user-app/_stores/playerStore.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { AudioTrackDetailsResponseDTO } from '@repo/types';
// Corrected import path assuming constants are moved or accessible
import { PlaybackState } from '@/_lib/constants'; // Use constants
import { getTrackDetails } from '@/_services/trackService';
// Corrected import path assuming utils structure
import { debounce } from '@repo/utils';
import { recordProgressAction } from '@/_actions/userActivityActions';

// --- State Interface ---
interface PlayerState {
  playbackState: PlaybackState;
  currentTrackDetails: AudioTrackDetailsResponseDTO | null;
  duration: number; // seconds, from audio element metadata
  currentTime: number; // seconds, from audio element timeupdate
  volume: number; // 0 to 1
  isMuted: boolean;
  error: string | null;
  // Internal state (prefixed with _)
  _audioContext: AudioContext | null;
  _gainNode: GainNode | null;
  _mediaElementSourceNode: MediaElementAudioSourceNode | null; // Source connected to the <audio> element
  _htmlAudioElement: HTMLAudioElement | null; // Ref to the <audio> element
  _currentTrackIdLoading: string | null; // Track which track ID is currently being loaded/processed
  _loadTimeoutId: NodeJS.Timeout | null; // Timeout for loading state
  _isSeeking: boolean; // Flag to manage state during seek operations
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
  cleanup: () => void; // Cleanup audio resources on component unmount
  _setHtmlAudioElementRef: (element: HTMLAudioElement | null) => void; // Internal action to set ref
}

// --- Initial State ---
const initialState: PlayerState = {
  playbackState: PlaybackState.IDLE,
  currentTrackDetails: null,
  duration: 0,
  currentTime: 0,
  volume: 0.8,
  isMuted: false,
  error: null,
  _audioContext: null,
  _gainNode: null,
  _mediaElementSourceNode: null,
  _htmlAudioElement: null,
  _currentTrackIdLoading: null,
  _loadTimeoutId: null,
  _isSeeking: false,
};

// --- Debounced Progress Recording ---
const debouncedRecordProgress = debounce((trackId: string, progressMs: number) => {
    // console.log(`Debounced: Recording progress ${progressMs}ms for track ${trackId}`);
    if (trackId && progressMs >= 0) {
        recordProgressAction(trackId, Math.round(progressMs))
            .then(result => { if (!result.success) console.warn("[PlayerStore] Failed to record progress via action:", result.message); })
            .catch(err => { console.error("[PlayerStore] Error calling recordProgressAction:", err); });
    }
}, 3000);

// --- Store Implementation ---
export const usePlayerStore = create(
  immer<PlayerState & PlayerActions>((set, get) => {

    // --- Internal Helper Functions ---
    const log = (message: string, ...args: any[]) => console.log(`[PlayerStore] ${message}`, ...args);
    const warn = (message: string, ...args: any[]) => console.warn(`[PlayerStore] ${message}`, ...args);
    const errorLog = (message: string, ...args: any[]) => console.error(`[PlayerStore] ${message}`, ...args);

    const clearLoadTimeout = () => {
        const loadTimeoutId = get()._loadTimeoutId;
        if (loadTimeoutId) {
            clearTimeout(loadTimeoutId);
            set({ _loadTimeoutId: null });
        }
    };

    const setError = (message: string, trackId?: string | null) => {
        clearLoadTimeout();
        errorLog("Error set:", message, trackId ? `(Track: ${trackId})` : '');
        set((state) => {
            // Only set error if it pertains to the track currently being loaded/played
            if (!trackId || state._currentTrackIdLoading === trackId || state.currentTrackDetails?.id === trackId) {
                state.playbackState = PlaybackState.ERROR;
                state.error = message;
                // Don't necessarily stop here, error might be recoverable or user might want to retry load
                state._currentTrackIdLoading = null;
            } else {
                warn(`Error for track ${trackId} ignored, current loading/playing is ${state._currentTrackIdLoading ?? state.currentTrackDetails?.id}`);
            }
        });
    };

    // Initializes AudioContext and GainNode if needed
    const initAudioContextIfNeeded = (): AudioContext | null => {
        let state = get();
        let ctx = state._audioContext;
        if (!ctx || ctx.state === 'closed') {
            log("Initializing AudioContext");
            try {
                ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                const gainNode = ctx.createGain();
                gainNode.connect(ctx.destination);
                gainNode.gain.setValueAtTime(state.isMuted ? 0 : state.volume, ctx.currentTime);
                set({ _audioContext: ctx, _gainNode: gainNode });
                ctx = get()._audioContext; // Get updated ref
            } catch (e) {
                 errorLog("Failed to initialize AudioContext", e);
                 setError("Audio playback not supported.");
                 return null;
            }
        }
        if (ctx && ctx.state === 'suspended') {
             ctx.resume().catch(e => warn("Could not resume AudioContext (may require user gesture):", e));
        }
        return ctx;
    };

    // Connects the HTMLAudioElement to the WAAPI graph (Context -> Gain -> Destination)
    const connectMediaElementSource = (state: PlayerState): MediaElementAudioSourceNode | null => {
        if (!state._audioContext || !state._htmlAudioElement || !state._gainNode) {
            warn("Cannot connect MediaElementSource: Context, Element, or GainNode missing.");
            return null;
        }
        if (state._mediaElementSourceNode) {
            // Already connected (or attempt was made)
            return state._mediaElementSourceNode;
        }
        log("Creating and connecting MediaElementAudioSourceNode");
        try {
            const sourceNode = state._audioContext.createMediaElementSource(state._htmlAudioElement);
            sourceNode.connect(state._gainNode);
            return sourceNode; // Return the created node
        } catch (err: any) {
            errorLog("Failed to create MediaElementAudioSourceNode:", err);
            // This can happen if the element's src is cross-origin without CORS headers
            setError(`Audio source connection error: ${err.message}`);
            return null;
        }
    };

     // Apply volume/mute to both GainNode and HTML element
     const applyVolumeAndMute = (state: PlayerState) => {
         if (state._gainNode && state._audioContext && state._audioContext.state === 'running') {
              state._gainNode.gain.setTargetAtTime(state.isMuted ? 0 : state.volume, state._audioContext.currentTime, 0.01);
         }
         if (state._htmlAudioElement) {
            state._htmlAudioElement.volume = state.volume;
            state._htmlAudioElement.muted = state.isMuted;
         }
    };

    // --- HTML Audio Element Event Handlers ---
    // These update the Zustand state based on the audio element's events
    const handlePlay = () => set(state => { if (!state._isSeeking) { log("Event: play -> PLAYING"); state.playbackState = PlaybackState.PLAYING; state.error = null; } });
    const handlePause = () => set(state => { if (state.playbackState !== PlaybackState.ENDED && state.playbackState !== PlaybackState.IDLE && state.playbackState !== PlaybackState.ERROR && !state._isSeeking) { log("Event: pause -> PAUSED"); state.playbackState = PlaybackState.PAUSED; }});
    const handleEnded = () => {
        log("Event: ended -> ENDED");
        const endedState = get();
        const finalDuration = endedState.duration;
        set(state => {
            state.playbackState = PlaybackState.ENDED;
            state.currentTime = finalDuration;
            state._isSeeking = false;
        });
        // Record final progress
        if (endedState.currentTrackDetails?.id) {
            debouncedRecordProgress.cancel();
            recordProgressAction(endedState.currentTrackDetails.id, Math.floor(finalDuration * 1000))
                .catch(err => errorLog("Error recording final progress on end:", err));
        }
    };
    const handleWaiting = () => set(state => { if (state.playbackState === PlaybackState.PLAYING) { log("Event: waiting -> BUFFERING"); state.playbackState = PlaybackState.BUFFERING; }});
    const handlePlaying = () => set(state => { if (state.playbackState === PlaybackState.BUFFERING || state._isSeeking) { log("Event: playing -> PLAYING"); state.playbackState = PlaybackState.PLAYING; state._isSeeking = false; }});
    const handleLoadedMetadata = () => {
        const audioEl = get()._htmlAudioElement;
        if (audioEl) {
            log("Event: loadedmetadata");
            set(state => { state.duration = audioEl.duration || 0; });
        }
    };
    const handleCanPlay = () => {
        log("Event: canplay");
        clearLoadTimeout();
        set(state => {
            // If we were loading this specific track, move to ready state if not already playing/paused
            if (state._currentTrackIdLoading === state.currentTrackDetails?.id) {
                if (state.playbackState !== PlaybackState.PLAYING && state.playbackState !== PlaybackState.PAUSED) {
                    state.playbackState = PlaybackState.READY;
                }
                state._currentTrackIdLoading = null; // Mark loading complete
            }
            // If seeking, transition back to previous state (usually PAUSED or PLAYING via 'playing' event)
             if (state._isSeeking) {
                state.playbackState = state._htmlAudioElement?.paused ? PlaybackState.PAUSED : PlaybackState.PLAYING;
                state._isSeeking = false;
             }
        });
    };
    const handleTimeUpdate = () => {
        const state = get();
        const audioEl = state._htmlAudioElement;
        if (!audioEl || state._isSeeking || state.playbackState === PlaybackState.IDLE) return; // Ignore during seek or if idle

        const htmlCurrentTime = audioEl.currentTime;
        // Update only if time changed significantly to avoid excessive re-renders
        if (Math.abs(state.currentTime - htmlCurrentTime) > 0.05) {
            set(draft => { draft.currentTime = htmlCurrentTime; });
            // Debounce progress recording only when actually playing
            if (state.currentTrackDetails?.id && state.playbackState === PlaybackState.PLAYING) {
                debouncedRecordProgress(state.currentTrackDetails.id, Math.floor(htmlCurrentTime * 1000));
            }
        }
    };
    const handleError = (e: Event) => {
        const audioEl = e.target as HTMLAudioElement;
        const error = audioEl.error;
        errorLog("HTMLAudioElement error:", error?.code, error?.message);
        setError(`Audio error: ${error?.message || `Code ${error?.code}` || 'Unknown'}`, get().currentTrackDetails?.id);
    };

    // --- Attach/Detach Listeners ---
    const setupAudioElementListeners = (element: HTMLAudioElement) => {
        log("Setting up HTMLAudioElement listeners");
        element.addEventListener('play', handlePlay);
        element.addEventListener('pause', handlePause);
        element.addEventListener('ended', handleEnded);
        element.addEventListener('waiting', handleWaiting);
        element.addEventListener('playing', handlePlaying);
        element.addEventListener('loadedmetadata', handleLoadedMetadata);
        element.addEventListener('canplay', handleCanPlay);
        element.addEventListener('timeupdate', handleTimeUpdate);
        element.addEventListener('error', handleError);
        // Add seeked listener to reliably exit seeking state
        element.addEventListener('seeked', () => set(state => {
            if (state._isSeeking) {
                log("Event: seeked");
                state._isSeeking = false;
                // Restore state based on paused status AFTER seek completes
                state.playbackState = state._htmlAudioElement?.paused ? PlaybackState.PAUSED : PlaybackState.PLAYING;
            }
        }));
    };
    const removeAudioElementListeners = (element: HTMLAudioElement) => {
        log("Removing HTMLAudioElement listeners");
        element.removeEventListener('play', handlePlay);
        element.removeEventListener('pause', handlePause);
        element.removeEventListener('ended', handleEnded);
        element.removeEventListener('waiting', handleWaiting);
        element.removeEventListener('playing', handlePlaying);
        element.removeEventListener('loadedmetadata', handleLoadedMetadata);
        element.removeEventListener('canplay', handleCanPlay);
        element.removeEventListener('timeupdate', handleTimeUpdate);
        element.removeEventListener('error', handleError);
        element.removeEventListener('seeked', () => set(state => { state._isSeeking = false; }));
    };

    // --- Public Actions ---
    return {
      ...initialState,

      _setHtmlAudioElementRef: (element) => {
         set(state => {
             const previousElement = state._htmlAudioElement;
             if (previousElement && previousElement !== element) {
                 removeAudioElementListeners(previousElement);
                 // Optionally disconnect source node if element changes drastically
                 if (state._mediaElementSourceNode) {
                      try { state._mediaElementSourceNode.disconnect(); } catch (e) {}
                      state._mediaElementSourceNode = null;
                 }
             }
             state._htmlAudioElement = element;
             if (element && previousElement !== element) {
                setupAudioElementListeners(element);
                applyVolumeAndMute(state);
                // Attempt connection immediately if context exists
                 state._mediaElementSourceNode = connectMediaElementSource(state);
             }
        });
      },

      loadAndPlayTrack: async (trackId) => {
        const state = get();
        const currentLoadingId = state._currentTrackIdLoading;
        const currentPlayingId = state.currentTrackDetails?.id;

        if (currentLoadingId === trackId) { log(`Track ${trackId} is already loading.`); return; }
        // If track is already loaded and ready/paused/ended, just play it
        if (currentPlayingId === trackId && [PlaybackState.READY, PlaybackState.PAUSED, PlaybackState.ENDED].includes(state.playbackState)) {
            log(`Track ${trackId} is loaded, calling play().`);
            get().play();
            return;
        }
        // If it's already playing, do nothing (or maybe seek to start? TBD)
        if (currentPlayingId === trackId && state.playbackState === PlaybackState.PLAYING) {
            log(`Track ${trackId} is already playing.`);
            // Optionally seek to 0: get().seek(0);
            return;
        }

        log(`Loading track: ${trackId}`);
        get().stop(); // Stop previous track & save progress

        set({
            _currentTrackIdLoading: trackId,
            playbackState: PlaybackState.LOADING,
            error: null, currentTrackDetails: null, duration: 0, currentTime: 0,
            isStreamingMode: true, // Simplified: always streaming mode now
        });
        clearLoadTimeout();
        set(draft => { draft._loadTimeoutId = setTimeout(() => { /* ... loading timeout logic ... */ }, 30000); });

        try {
          const trackDetails = await getTrackDetails(trackId);
          if (get()._currentTrackIdLoading !== trackId) { log(`Load cancelled for ${trackId} during fetch.`); return; }
          if (!trackDetails?.playUrl) throw new Error("Track details or play URL missing.");

          const trackDurationSec = trackDetails.durationMs / 1000;
          let initialSeekTime = trackDetails.userProgressMs != null && trackDetails.userProgressMs > 0
                                ? Math.min(trackDetails.userProgressMs / 1000, trackDurationSec) : 0;

          log(`Details loaded for ${trackId}. Duration: ${trackDurationSec}s. Initial Seek: ${initialSeekTime}s`);

          const audioContext = initAudioContextIfNeeded(); // Ensure context is ready
          const audioEl = get()._htmlAudioElement;
          if (!audioEl) throw new Error("HTMLAudioElement ref not available.");

          set(state => {
              state.currentTrackDetails = trackDetails;
              state.duration = trackDurationSec; // Initial duration from metadata
              state.currentTime = initialSeekTime; // Set initial time state
              // Connect MediaElementSourceNode if needed
              if (!state._mediaElementSourceNode && audioContext && state._gainNode) {
                  state._mediaElementSourceNode = connectMediaElementSource(state);
              }
          });

          // Set src, load, and handle initial seek & play
          audioEl.src = trackDetails.playUrl;
          audioEl.load();

          // Handler to set currentTime and attempt play once ready
          const playWhenReady = () => {
              const currentState = get();
              if (currentState.currentTrackDetails?.id === trackId) { // Only act if this is still the target track
                  log(`Stream can play. Setting currentTime: ${initialSeekTime}`);
                  audioEl.currentTime = initialSeekTime; // Set time now
                  audioEl.play()
                     .then(() => log("Playback started via loadAndPlayTrack."))
                     .catch(err => {
                         warn(`Autoplay likely blocked for track ${trackId}:`, err);
                         // Update state to READY, user must click play
                         set(s => { if (s.currentTrackDetails?.id === trackId) s.playbackState = PlaybackState.READY; s._currentTrackIdLoading = null; });
                     });
              } else {
                   log(`Skipping play for ${trackId}, another track is active.`);
              }
              clearLoadTimeout(); // Clear timeout once playable
              audioEl.removeEventListener('canplay', playWhenReady);
              audioEl.removeEventListener('loadeddata', playWhenReady); // Use loadeddata as another trigger
          };
          // Use 'canplay' as the trigger, it usually fires after enough data to start
          audioEl.addEventListener('canplay', playWhenReady, { once: true });
          audioEl.addEventListener('loadeddata', playWhenReady, { once: true }); // Fallback

        } catch (err: any) {
          setError(`Failed to load track ${trackId}: ${err.message}`, trackId);
        }
      },

      play: () => {
        const { playbackState, _htmlAudioElement } = get();
        log(`Play action called. State: ${playbackState}`);

        if (playbackState !== PlaybackState.READY && playbackState !== PlaybackState.PAUSED && playbackState !== PlaybackState.ENDED) {
            warn(`Cannot play from state: ${playbackState}`); return;
        }
        if (!_htmlAudioElement) { setError("Audio element not available."); return; }

        // Ensure AudioContext is running (user gesture likely needed initially)
        const ctx = initAudioContextIfNeeded();
        if (!ctx) return; // Stop if context failed

        set(state => { state.error = null; }); // Clear previous errors

        const playPromise = _htmlAudioElement.play();
        if (playPromise !== undefined) {
             playPromise.catch(err => {
                 errorLog("Error starting playback:", err);
                 setError(`Playback failed: ${err.message}`, get().currentTrackDetails?.id);
             });
        }
        // State change to PLAYING/BUFFERING is handled by element events
      },

      pause: () => {
         const state = get();
         log(`Pause action called. State: ${state.playbackState}`);
         if (state.playbackState !== PlaybackState.PLAYING && state.playbackState !== PlaybackState.BUFFERING) return;
         if (!state._htmlAudioElement) { warn("Cannot pause: HTML element not available."); return; }

          // Flush and record progress *before* pausing
          debouncedRecordProgress.flush();
          if (state.currentTrackDetails?.id) {
              recordProgressAction(state.currentTrackDetails.id, Math.floor(state.currentTime * 1000))
                   .catch(err => errorLog("Error recording progress on pause:", err));
          }

          state._htmlAudioElement.pause();
          // State change to PAUSED is handled by element 'onpause' event
      },

      togglePlayPause: () => {
         const { playbackState, _htmlAudioElement } = get();
         log(`Toggle Play/Pause. Current State: ${playbackState}`);
         if (!_htmlAudioElement) return;

         if (playbackState === PlaybackState.PLAYING || playbackState === PlaybackState.BUFFERING) {
             get().pause();
         } else if ([PlaybackState.PAUSED, PlaybackState.READY, PlaybackState.ENDED].includes(playbackState)) {
             get().play();
         } else {
             warn(`Toggle Play/Pause ignored in state: ${playbackState}`);
         }
      },

      seek: (timeSeconds) => {
          const { duration, playbackState, _htmlAudioElement } = get();
          log(`Seek action called. Time: ${timeSeconds}s, State: ${playbackState}`);
          const canSeek = duration > 0 && _htmlAudioElement && playbackState !== PlaybackState.IDLE && playbackState !== PlaybackState.LOADING && playbackState !== PlaybackState.ERROR;

          if (!canSeek) { warn(`Seek ignored in state: ${playbackState} or duration=${duration}`); return; }

          const seekTime = Math.max(0, Math.min(timeSeconds, duration));

          // Set seeking flag, update UI time immediately
          set(state => { state.currentTime = seekTime; state._isSeeking = true; state.playbackState = PlaybackState.SEEKING; });

           _htmlAudioElement!.currentTime = seekTime; // Set the element's time

           // Final progress recorded after seek completes via 'seeked' event triggering 'timeupdate' or pause/stop
           // Flush any pending progress before seek starts
           debouncedRecordProgress.flush();
           // Schedule recording for the new position
           if (get().currentTrackDetails?.id) {
               debouncedRecordProgress(get().currentTrackDetails!.id, Math.floor(seekTime * 1000));
           }
           // The 'seeked' event listener will reset _isSeeking and update playbackState
      },

      setVolume: (volume) => {
        const newVolume = Math.max(0, Math.min(1, volume));
         set(state => {
             state.volume = newVolume;
             if (newVolume > 0 && state.isMuted) { state.isMuted = false; }
             applyVolumeAndMute(state);
         });
      },

      toggleMute: () => {
         set(state => {
            state.isMuted = !state.isMuted;
            applyVolumeAndMute(state);
         });
      },

      stop: () => {
          log("Stop action called - unloading track");
          const state = get();
          const currentTrackId = state.currentTrackDetails?.id;
          const currentTimeMs = state.currentTime * 1000;

          // Force immediate progress recording before unloading
          debouncedRecordProgress.cancel();
          if (currentTrackId && currentTimeMs >= 0) {
               log(`Recording final progress ${Math.round(currentTimeMs)}ms on stop`);
               recordProgressAction(currentTrackId, Math.round(currentTimeMs))
                   .catch(err => errorLog("Error recording final progress on stop:", err));
          }

          clearLoadTimeout();

          set(draft => {
              const audioEl = draft._htmlAudioElement; // Cache ref before resetting
              const audioCtx = draft._audioContext;
              const gainNode = draft._gainNode;
              const sourceNode = draft._mediaElementSourceNode;

              // Reset state to initial
              Object.assign(draft, initialState);

              // Keep essential refs if they exist
              draft._htmlAudioElement = audioEl;
              draft._audioContext = audioCtx;
              draft._gainNode = gainNode;
              draft._mediaElementSourceNode = sourceNode; // Keep source node if element ref persists

               // Reset HTML element state
               if (audioEl) {
                   try {
                       if (!audioEl.paused) audioEl.pause();
                       audioEl.removeAttribute("src");
                       // Force browser to release resources
                       audioEl.load();
                       log("HTMLAudioElement reset on stop.");
                   } catch (e) { warn("Error resetting HTMLAudioElement on stop:", e); }
               }
          });
      },

      cleanup: () => {
         log("Cleanup action called");
         get().stop(); // Ensure stop logic runs

         set(state => {
              // Close AudioContext
              if (state._audioContext && state._audioContext.state !== 'closed') {
                 state._audioContext.close().then(()=>log("AudioContext closed.")).catch(e => warn("Error closing AudioContext:", e));
              }
              // Remove listeners from element if it exists
              if (state._htmlAudioElement) {
                   removeAudioElementListeners(state._htmlAudioElement);
              }
              // Nullify all internal refs completely
              Object.assign(state, initialState);
         });
      }
    };
  }, {
      name: 'player-storage-v2', // Use a different name if migrating
  })
);