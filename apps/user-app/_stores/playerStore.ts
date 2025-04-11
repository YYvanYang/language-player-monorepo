// apps/user-app/_stores/playerStore.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { AudioTrackDetailsResponseDTO } from '@repo/types';
import { AUDIO_DURATION_THRESHOLD_MS, PlaybackState } from '@/_lib/constants';
import { getTrackDetails } from '@/_services/trackService';
import { debounce } from '@repo/utils';
import { recordProgressAction } from '@/_actions/userActivityActions';

// Debounce progress recording (5 seconds)
const debouncedRecordProgress = debounce((trackId: string, progressMs: number) => {
    if (trackId && progressMs > 0) {
        // console.log(`Debounced: Recording progress ${Math.round(progressMs)}ms for track ${trackId}`);
        recordProgressAction(trackId, Math.round(progressMs)) // Ensure integer ms
            .then(result => { if (!result.success) console.warn("Failed to record progress via action:", result.message); })
            .catch(err => { console.error("Error calling recordProgressAction:", err); });
    }
}, 5000);

// --- State Interface ---
interface PlayerState {
  playbackState: PlaybackState;
  currentTrackDetails: AudioTrackDetailsResponseDTO | null;
  isStreamingMode: boolean;
  duration: number; // seconds
  currentTime: number; // seconds
  bufferedTime: number; // seconds
  volume: number;
  isMuted: boolean;
  isLoading: boolean;
  error: string | null;
  _audioContext: AudioContext | null;
  _gainNode: GainNode | null;
  _audioBuffer: AudioBuffer | null;
  _sourceNode: AudioBufferSourceNode | MediaElementAudioSourceNode | null;
  _htmlAudioElement: HTMLAudioElement | null;
  _playbackStartTime: number;
  _playbackStartOffset: number;
  _animationFrameId: number | null;
  _currentTrackIdLoading: string | null; // Track which track ID is currently being loaded
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
  stop: () => void;
  cleanup: () => void;
  _setHtmlAudioElementRef: (element: HTMLAudioElement | null) => void;
  _initAudioContext: () => AudioContext;
}

// --- Initial State ---
const initialState: Omit<PlayerState, '_audioContext' | '_gainNode' | '_audioBuffer' | '_sourceNode' | '_htmlAudioElement' | '_playbackStartTime' | '_playbackStartOffset' | '_animationFrameId'> = {
  playbackState: PlaybackState.IDLE,
  currentTrackDetails: null,
  isStreamingMode: false,
  duration: 0,
  currentTime: 0,
  bufferedTime: 0,
  volume: 0.8,
  isMuted: false,
  isLoading: false,
  error: null,
  _currentTrackIdLoading: null,
};

// --- Store Implementation ---
export const usePlayerStore = create(
  immer<PlayerState & PlayerActions>((set, get) => {

    // --- Internal Helper Functions ---
    const setError = (message: string, trackId?: string) => {
      console.error("Player Error:", message, trackId ? `(Track: ${trackId})` : '');
      set((state) => {
        // Only set error if it pertains to the track currently being loaded/played
        if (!trackId || state._currentTrackIdLoading === trackId || state.currentTrackDetails?.id === trackId) {
            state.playbackState = PlaybackState.ERROR;
            state.error = message;
            state.isLoading = false;
            state._currentTrackIdLoading = null;
            internalStop(state);
        }
      });
    };

    const initAudioContextIfNeeded = (): AudioContext => {
        let state = get();
        if (!state._audioContext || state._audioContext.state === 'closed') {
            console.log("Initializing AudioContext");
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const gainNode = ctx.createGain();
            gainNode.connect(ctx.destination);
            // Use set directly here, as we're outside the main immer wrapper temporarily
            set({ _audioContext: ctx, _gainNode: gainNode });
            // Manually apply volume AFTER setting the state
            const updatedState = get();
            if (updatedState._gainNode) {
                updatedState._gainNode.gain.setValueAtTime(updatedState.isMuted ? 0 : updatedState.volume, ctx.currentTime);
            }
             // Resume context if needed (might start suspended)
             if (ctx.state === 'suspended') {
                ctx.resume().catch(e => console.warn("Could not resume initial AudioContext:", e));
             }
            return ctx;
        }
        // Resume context if suspended but not closed
        if(state._audioContext.state === 'suspended') {
             state._audioContext.resume().catch(e => console.warn("Could not resume existing AudioContext:", e));
        }
        return state._audioContext;
    };


    const updateTimeWAAPI = () => {
      const state = get();
      if (state.playbackState !== PlaybackState.PLAYING || !state._audioContext || state.isStreamingMode) {
        if (state._animationFrameId) cancelAnimationFrame(state._animationFrameId);
        set(draft => { draft._animationFrameId = null; });
        return;
      }

      const elapsed = state._audioContext.currentTime - state._playbackStartTime;
      const newTime = Math.max(0, state._playbackStartOffset + elapsed); // Ensure time doesn't go negative
      const newCurrentTime = Math.min(newTime, state.duration); // Clamp to duration

      // Only update state if time actually changed significantly (avoid excessive updates)
      if (Math.abs(newCurrentTime - state.currentTime) > 0.05) { // ~50ms threshold
          set(draft => {
            draft.currentTime = newCurrentTime;
            // Record progress periodically
            if (draft.currentTrackDetails?.id) {
                debouncedRecordProgress(draft.currentTrackDetails.id, Math.floor(draft.currentTime * 1000));
            }
          });
      }

      if (newCurrentTime >= state.duration) {
        // End of track reached
        set(draft => {
            draft.playbackState = PlaybackState.ENDED;
            draft.currentTime = draft.duration; // Ensure final time is exactly duration
             // Record final progress
             if (draft.currentTrackDetails?.id) {
                 debouncedRecordProgress(draft.currentTrackDetails.id, Math.floor(draft.duration * 1000));
             }
        });
        internalStop(get()); // Cleanup after state update
      } else {
        // Continue animation loop
        set(draft => { draft._animationFrameId = requestAnimationFrame(updateTimeWAAPI); });
      }
    };


    const internalStop = (state: PlayerState) => {
        // console.log("Internal Stop Called. Streaming:", state.isStreamingMode, "State:", state.playbackState);
        if (state._animationFrameId) {
            cancelAnimationFrame(state._animationFrameId);
            state._animationFrameId = null;
        }
        if (state._sourceNode) {
            try {
                if (state.isStreamingMode && state._htmlAudioElement && !state._htmlAudioElement.paused) {
                   state._htmlAudioElement.pause();
                } else if (!state.isStreamingMode && state._sourceNode instanceof AudioBufferSourceNode) {
                    state._sourceNode.stop();
                    state._sourceNode.disconnect();
                }
            } catch (e) { console.warn("Error stopping/disconnecting source node:", e); }
             state._sourceNode = null;
        }
         state._playbackStartTime = 0;
         state._playbackStartOffset = 0;
    };

    const applyVolumeAndMute = (state: PlayerState) => {
         if (state._gainNode) {
             state._gainNode.gain.setValueAtTime(state.isMuted ? 0 : state.volume, state._audioContext?.currentTime ?? 0);
         }
         if (state._htmlAudioElement) {
            state._htmlAudioElement.volume = state.isMuted ? 0 : state.volume;
            state._htmlAudioElement.muted = state.isMuted;
         }
    };

    // HTML Audio Element Listeners (defined once)
    const setupAudioElementListeners = (element: HTMLAudioElement) => {
        element.onplay = () => set(s => { if (s.isStreamingMode && s.playbackState !== PlaybackState.PLAYING) { s.playbackState = PlaybackState.PLAYING; s.isLoading = false; s._currentTrackIdLoading = null;} });
        element.onpause = () => set(s => { if (s.isStreamingMode && s.playbackState !== PlaybackState.ENDED && s.playbackState !== PlaybackState.IDLE && s.playbackState !== PlaybackState.ERROR) s.playbackState = PlaybackState.PAUSED; });
        element.onended = () => {
            set(s => {
               if(s.isStreamingMode) {
                   s.playbackState = PlaybackState.ENDED;
                   s.currentTime = s.duration; // Ensure time is set to end
                   if (s.currentTrackDetails?.id) {
                       debouncedRecordProgress(s.currentTrackDetails.id, Math.floor(s.duration * 1000));
                   }
               }
            });
            internalStop(get());
        };
        element.onwaiting = () => set(s => { if(s.isStreamingMode) s.playbackState = PlaybackState.BUFFERING; });
        element.onplaying = () => set(s => { if(s.isStreamingMode) s.playbackState = PlaybackState.PLAYING; s.isLoading = false; s._currentTrackIdLoading = null; }); // Playing implies loading finished
        element.onloadedmetadata = () => set(s => { if(s.isStreamingMode) s.duration = element.duration; });
        element.ontimeupdate = () => {
            const htmlCurrentTime = element.currentTime;
            set(s => {
                if(s.isStreamingMode && Math.abs(s.currentTime - htmlCurrentTime) > 0.05) { // Update only if changed significantly
                    s.currentTime = htmlCurrentTime;
                    if (s.currentTrackDetails?.id) {
                         debouncedRecordProgress(s.currentTrackDetails.id, Math.floor(htmlCurrentTime * 1000));
                    }
                }
            });
         };
        element.onprogress = () => {
            if(element.buffered.length > 0) {
               set(s => { if(s.isStreamingMode) s.bufferedTime = element.buffered.end(element.buffered.length - 1); });
            }
        };
        element.onerror = (e) => {
             console.error("HTMLAudioElement error:", element.error);
             setError(`Audio playback error: ${element.error?.message || 'Unknown error'}`, get().currentTrackDetails?.id);
        };
    };
    const removeAudioElementListeners = (element: HTMLAudioElement) => {
         element.onplay = null;
         element.onpause = null;
         element.onended = null;
         element.onwaiting = null;
         element.onplaying = null;
         element.onloadedmetadata = null;
         element.ontimeupdate = null;
         element.onprogress = null;
         element.onerror = null;
    };


    // --- Public Actions ---
    return {
      ...initialState,
      // Initialize internal state properties
      _audioContext: null,
      _gainNode: null,
      _audioBuffer: null,
      _sourceNode: null,
      _htmlAudioElement: null,
      _playbackStartTime: 0,
      _playbackStartOffset: 0,
      _animationFrameId: null,

      _initAudioContext: initAudioContextIfNeeded,

      _setHtmlAudioElementRef: (element) => {
         set(state => {
             if (state._htmlAudioElement) { removeAudioElementListeners(state._htmlAudioElement); }
             state._htmlAudioElement = element;
             if (element) {
                setupAudioElementListeners(element);
                applyVolumeAndMute(state); // Apply current volume/mute to new element
             }
        });
      },

      loadAndPlayTrack: async (trackId) => {
        const currentTrackId = get().currentTrackDetails?.id;
        if (get()._currentTrackIdLoading === trackId) return; // Already loading this track

        // If same track is loaded but paused/ended, just play/restart
        if (currentTrackId === trackId) {
            const currentState = get().playbackState;
             if (currentState === PlaybackState.PAUSED || currentState === PlaybackState.READY) {
                get().play();
                return;
             } else if (currentState === PlaybackState.ENDED) {
                 get().seek(0);
                 get().play();
                 return;
             } else if (currentState === PlaybackState.PLAYING || currentState === PlaybackState.BUFFERING) {
                 return; // Already playing/buffering this track
             }
             // If IDLE or ERROR for the current track, proceed to reload
        }

        console.log(`Loading track: ${trackId}`);
        get().stop(); // Stop previous track fully

        set({
            isLoading: true,
            error: null,
            playbackState: PlaybackState.LOADING,
            currentTrackDetails: null, // Clear previous details
            duration: 0,
            currentTime: 0,
            bufferedTime: 0,
            isStreamingMode: false,
            _audioBuffer: null,
            _currentTrackIdLoading: trackId, // Mark this track as loading
        });

        try {
          const trackDetails = await getTrackDetails(trackId);
          // Check if we are still supposed to be loading *this* track
          if (get()._currentTrackIdLoading !== trackId) {
               console.log(`Load cancelled for ${trackId}, another track load started.`);
               return; // Abort if another track started loading
          }

          if (!trackDetails || !trackDetails.playUrl) {
            throw new Error("Track details or play URL missing.");
          }

          const useStreaming = trackDetails.durationMs > AUDIO_DURATION_THRESHOLD_MS;
          const trackDurationSec = trackDetails.durationMs / 1000;

          set(state => {
              state.currentTrackDetails = trackDetails;
              state.duration = trackDurationSec;
              state.isStreamingMode = useStreaming;
              // Pre-fill progress if available from track details
              if(trackDetails.userProgressMs != null && trackDetails.userProgressMs > 0) {
                  const progressSec = Math.min(trackDetails.userProgressMs / 1000, trackDurationSec); // Clamp
                  state.currentTime = progressSec;
                  state._playbackStartOffset = progressSec; // Set initial offset for WAAPI
                  console.log(`Loaded initial progress for ${trackId}: ${progressSec}s`);
              } else {
                   state.currentTime = 0;
                   state._playbackStartOffset = 0;
              }
          });

          const audioContext = initAudioContextIfNeeded();

          if (useStreaming) {
             console.log("Using Streaming Mode for", trackId);
              set({ playbackState: PlaybackState.BUFFERING });
              const audioEl = get()._htmlAudioElement;
              if (!audioEl) { throw new Error("HTMLAudioElement ref not set."); }

              let source = get()._sourceNode;
              // Only create source node if needed. It might persist across track loads if element doesn't change.
              if(!source || !(source instanceof MediaElementAudioSourceNode) || get()._audioContext !== source.context) {
                  try {
                       // Disconnect old source if context changed
                       if (source && source.context !== get()._audioContext) source.disconnect();
                       source = audioContext.createMediaElementSource(audioEl);
                       source.connect(get()._gainNode!);
                       set(state => { state._sourceNode = source; });
                  } catch (err) {
                      console.warn("Could not create/connect media element source. Proceeding with element directly.", err);
                      set(state => { state._sourceNode = null; }); // Ensure source node state is clean
                  }
              }

              audioEl.src = trackDetails.playUrl;
              audioEl.load();
              // Set current time AFTER src and load
              if (get().currentTime > 0) {
                  audioEl.currentTime = get().currentTime;
                  console.log(`Streaming: Set initial currentTime to ${get().currentTime}`);
              }
              // Attempt to play - might be blocked by browser
              audioEl.play().catch(err => {
                    console.warn(`Auto-play blocked for streaming track ${trackId}:`, err);
                    set(s => {
                        // If play failed, move to READY state instead of staying in BUFFERING/PLAYING
                        if (s.playbackState === PlaybackState.PLAYING || s.playbackState === PlaybackState.BUFFERING) {
                             s.playbackState = PlaybackState.READY;
                             s.isLoading = false; // Ready, not loading
                             s._currentTrackIdLoading = null;
                        }
                    });
               });

          } else {
            console.log("Using WAAPI Buffer Mode for", trackId);
            set({ playbackState: PlaybackState.LOADING });
            const response = await fetch(trackDetails.playUrl);
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            const arrayBuffer = await response.arrayBuffer();

             // Check again if load was cancelled
             if (get()._currentTrackIdLoading !== trackId) {
                 console.log(`Load cancelled for ${trackId} during fetch/decode.`);
                 return;
             }

            set({ playbackState: PlaybackState.DECODING });
            audioContext.decodeAudioData(arrayBuffer,
                (decodedBuffer) => {
                    // Final check if load was cancelled during decode
                    if (get()._currentTrackIdLoading !== trackId) {
                        console.log(`Load cancelled for ${trackId} after decode.`);
                        return;
                    }
                    set(state => {
                        state._audioBuffer = decodedBuffer;
                        // Use actual decoded duration for accuracy
                        state.duration = decodedBuffer.duration;
                        // If initial progress was loaded, ensure it's not beyond actual duration
                        if (state.currentTime > state.duration) {
                            state.currentTime = 0;
                            state._playbackStartOffset = 0;
                        }
                        state.playbackState = PlaybackState.READY;
                        state.isLoading = false;
                        state._currentTrackIdLoading = null;
                    });
                    get().play(); // Auto-play after decoding
                },
                (decodeErr: DOMException) => {
                  setError(`Failed to decode audio: ${decodeErr.message}`, trackId);
                }
            );
          }
        } catch (err: any) {
          setError(`Failed to load track ${trackId}: ${err.message}`, trackId);
        }
      },

      play: () => {
        const { playbackState, isStreamingMode, _htmlAudioElement, _audioContext, _audioBuffer, currentTime } = get();
        if (playbackState !== PlaybackState.READY && playbackState !== PlaybackState.PAUSED && playbackState !== PlaybackState.ENDED) return;
        if (!_audioContext || !get()._gainNode) { initAudioContextIfNeeded(); console.warn("Audio context not ready, attempted init."); return; }
        if (_audioContext.state === 'suspended') { _audioContext.resume(); }

        if (isStreamingMode) {
          if (_htmlAudioElement) { _htmlAudioElement.play().catch(err => setError(`Play command failed: ${err.message}`, get().currentTrackDetails?.id)); }
          else { setError("HTML audio element not available."); }
        } else {
          if (!_audioBuffer) { setError("Audio buffer not loaded."); return; }
          internalStop(get()); // Stop existing source if any

          const source = _audioContext.createBufferSource();
          source.buffer = _audioBuffer;
          source.connect(get()._gainNode!);

          const offset = Math.max(0, currentTime % _audioBuffer.duration);

          set(state => {
              state._sourceNode = source;
              state._playbackStartTime = _audioContext.currentTime;
              state._playbackStartOffset = offset;
              state.playbackState = PlaybackState.PLAYING;
              state.error = null;
              state.isLoading = false; // Ensure loading is false
              state._currentTrackIdLoading = null;
          });

           source.onended = () => { if (get().playbackState === PlaybackState.PLAYING) { get().seek(get().duration); /* Trigger ended state via seek */ } }; // Let update loop handle ENDED state

          source.start(0, offset);
          if (get()._animationFrameId === null) requestAnimationFrame(updateTimeWAAPI);
        }
      },

      pause: () => {
         const state = get();
         if (state.playbackState !== PlaybackState.PLAYING && state.playbackState !== PlaybackState.BUFFERING) return;
         internalStop(state); // Handles stopping source/audio and cancelling animation frame
         set(s => { s.playbackState = PlaybackState.PAUSED; });
      },

      togglePlayPause: () => {
         const { playbackState } = get();
         if (playbackState === PlaybackState.PLAYING || playbackState === PlaybackState.BUFFERING) {
             get().pause();
         } else if (playbackState === PlaybackState.PAUSED || playbackState === PlaybackState.READY || playbackState === PlaybackState.ENDED) {
             if(playbackState === PlaybackState.ENDED) { get().seek(0); }
             get().play();
         }
      },

      seek: (timeSeconds) => {
          const { duration, playbackState, isStreamingMode, _htmlAudioElement, _audioBuffer } = get();
          if (duration <= 0 || playbackState === PlaybackState.LOADING || playbackState === PlaybackState.DECODING || playbackState === PlaybackState.IDLE) return;

          const seekTime = Math.max(0, Math.min(timeSeconds, duration));

          set(state => { state.currentTime = seekTime; }); // Optimistic update

          if (isStreamingMode) {
              if (_htmlAudioElement) { _htmlAudioElement.currentTime = seekTime; }
          } else {
              if (playbackState === PlaybackState.PLAYING) {
                    internalStop(get()); // Stop current playback
                    set(state => { state.currentTime = seekTime; }); // Update time for restart
                    get().play(); // Restart from new time
              } else {
                    // If paused/ready/ended, just update the offset for next play
                    set(state => { state._playbackStartOffset = seekTime; });
              }
          }
            // Record progress immediately on seek? Or let periodic update handle it?
           // Let periodic handle it to avoid spamming on slider drag.
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

      stop: () => { // Full stop, unload track
          console.log("Stop action called");
          const currentTrackId = get().currentTrackDetails?.id;
          const currentTimeMs = get().currentTime * 1000;
          // Record final progress before stopping
          if (currentTrackId && currentTimeMs > 0) {
               console.log(`Recording final progress ${currentTimeMs}ms on stop`);
               recordProgressAction(currentTrackId, Math.round(currentTimeMs)).catch(err => console.error("Error recording final progress on stop:", err));
          }

          internalStop(get());
           set(state => {
               state.playbackState = PlaybackState.IDLE;
               state.currentTrackDetails = null;
               state.duration = 0;
               state.currentTime = 0;
               state.bufferedTime = 0;
               state.isLoading = false;
               state.error = null;
               state.isStreamingMode = false;
               state._audioBuffer = null;
               state._currentTrackIdLoading = null;
               if (state._htmlAudioElement) {
                   state._htmlAudioElement.pause();
                   state._htmlAudioElement.removeAttribute("src"); // Force unload
                   state._htmlAudioElement.load();
               }
           });
      },

      cleanup: () => {
         console.log("Cleaning up player store resources");
         get().stop(); // Ensure everything is stopped and possibly progress recorded
         const ctx = get()._audioContext;
          if (ctx && ctx.state !== 'closed') {
             ctx.close().catch(e => console.warn("Error closing AudioContext:", e));
         }
         // Reset all internal refs except the HTML element itself
          set({ _audioContext: null, _gainNode: null, _audioBuffer: null, _sourceNode: null });
      }
    };
  })
);