// apps/user-app/_stores/playerStore.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { AudioTrackDetailsResponseDTO } from '@repo/types';
import { AUDIO_DURATION_THRESHOLD_MS, PlaybackState } from '@/../_lib/constants';
import { getTrackDetails } from '@/../_services/trackService';
import { formatDuration, debounce } from '@repo/utils'; // Import debounce
import { recordProgressAction } from '@/../_actions/userActivityActions'; // Import the action

// Debounce the progress recording function (e.g., update every 5 seconds)
const debouncedRecordProgress = debounce((trackId: string, progressMs: number) => {
    if (trackId && progressMs > 0) {
        console.log(`Debounced: Recording progress ${progressMs}ms for track ${trackId}`);
        recordProgressAction(trackId, progressMs)
            .then(result => {
                if (!result.success) {
                    console.warn("Failed to record progress via action:", result.message);
                }
            })
            .catch(err => {
                 console.error("Error calling recordProgressAction:", err);
            });
    }
}, 5000); // 5 seconds delay

// --- State Interface ---
interface PlayerState {
  playbackState: PlaybackState;
  currentTrackDetails: AudioTrackDetailsResponseDTO | null;
  isStreamingMode: boolean; // True if using <audio> element
  duration: number; // seconds
  currentTime: number; // seconds
  bufferedTime: number; // seconds (for streaming)
  volume: number; // 0.0 to 1.0
  isMuted: boolean;
  isLoading: boolean;
  error: string | null;

  // Internal WAAPI/HTML references (not directly exposed typically)
  // These are managed internally by actions
  _audioContext: AudioContext | null;
  _gainNode: GainNode | null;
  _audioBuffer: AudioBuffer | null; // For WAAPI mode
  _sourceNode: AudioBufferSourceNode | MediaElementAudioSourceNode | null; // Can be either type
  _htmlAudioElement: HTMLAudioElement | null; // Ref to hidden <audio>
  _playbackStartTime: number; // AudioContext time when playback started (WAAPI)
  _playbackStartOffset: number; // Offset within buffer where playback started (WAAPI)
  _animationFrameId: number | null; // For WAAPI time updates
}

// --- Actions Interface ---
interface PlayerActions {
  // Core Controls
  loadAndPlayTrack: (trackId: string) => Promise<void>;
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  seek: (timeSeconds: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  stop: () => void; // Stops playback and unloads track
  cleanup: () => void; // Clean up resources on unmount

  // Internal / Setup
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
  volume: 0.8, // Default volume
  isMuted: false,
  isLoading: false,
  error: null,
};

// --- Store Implementation ---
export const usePlayerStore = create(
  immer<PlayerState & PlayerActions>((set, get) => {

    // --- Internal Helper Functions ---
    const setError = (message: string) => {
      console.error("Player Error:", message);
      set((state) => {
        state.playbackState = PlaybackState.ERROR;
        state.error = message;
        state.isLoading = false;
        internalStop(state); // Stop playback on error
      });
    };

    const initAudioContextIfNeeded = (): AudioContext => {
       let ctx = get()._audioContext;
       if (!ctx) {
            console.log("Initializing AudioContext");
            ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const gainNode = ctx.createGain();
            gainNode.connect(ctx.destination);
            set(state => {
                state._audioContext = ctx;
                state._gainNode = gainNode;
                state._updateVolumeGain(); // Apply initial volume
            });
       }
       return ctx;
    };

     const updateTimeWAAPI = () => {
        const state = get();
        if (state.playbackState !== PlaybackState.PLAYING || !state._audioContext || state.isStreamingMode) {
            if (state._animationFrameId) cancelAnimationFrame(state._animationFrameId);
            set(draft => { draft._animationFrameId = null; });
            return;
        }
        const elapsed = state._audioContext.currentTime - state._playbackStartTime;
        const newTime = state._playbackStartOffset + elapsed;
        set(draft => {
            draft.currentTime = Math.min(newTime, draft.duration);
            if (draft.currentTime >= draft.duration) {
                draft.playbackState = PlaybackState.ENDED;
                internalStop(draft);
                // Record final progress when ended
                if (state.currentTrackDetails?.id) {
                    debouncedRecordProgress(state.currentTrackDetails.id, Math.floor(state.duration * 1000));
                }
            } else {
                draft._animationFrameId = requestAnimationFrame(updateTimeWAAPI);
                // --- Record progress periodically ---
                if (state.currentTrackDetails?.id) {
                    debouncedRecordProgress(state.currentTrackDetails.id, Math.floor(draft.currentTime * 1000));
                }
                // --- End Record progress ---
            }
        });
    };

    const internalStop = (state: PlayerState) => {
        console.log("Internal Stop Called. Streaming:", state.isStreamingMode, "State:", state.playbackState);
        if (state._animationFrameId) {
            cancelAnimationFrame(state._animationFrameId);
            state._animationFrameId = null;
        }
        if (state._sourceNode) {
            try {
                if (state.isStreamingMode && state._htmlAudioElement) {
                   state._htmlAudioElement.pause(); // Pause element
                   // Detach? Maybe not needed if element persists
                } else if (!state.isStreamingMode && state._sourceNode instanceof AudioBufferSourceNode) {
                    state._sourceNode.stop(); // Stop WAAPI source
                    state._sourceNode.disconnect();
                }
            } catch (e) { console.warn("Error stopping/disconnecting source node:", e); }
             state._sourceNode = null;
        }
         state._playbackStartTime = 0;
         state._playbackStartOffset = 0;
         // Don't reset currentTrackDetails or duration here, only on explicit stop() action
         // Update playback state if not already ERROR or ENDED
         if (state.playbackState !== PlaybackState.ERROR && state.playbackState !== PlaybackState.ENDED) {
             state.playbackState = PlaybackState.READY; // Ready to play again from currentTime
             // Or should it be IDLE? READY seems better if seeking is possible.
             // If stop() action called, it might reset further.
         }
    };

    // --- Public Actions ---
    return {
      ...initialState,
      _audioContext: null,
      _gainNode: null,
      _audioBuffer: null,
      _sourceNode: null,
      _htmlAudioElement: null,
      _playbackStartTime: 0,
      _playbackStartOffset: 0,
      _animationFrameId: null,

      _initAudioContext: initAudioContextIfNeeded, // Expose for potential pre-warming

      _setHtmlAudioElementRef: (element) => {
         set(state => {
            // Remove old listeners if element changes
             if (state._htmlAudioElement) {
                // Remove event listeners... (see below)
             }
             state._htmlAudioElement = element;
            // Add new listeners if element is set
             if (element) {
                // --- HTML Audio Event Listeners ---
                element.onplay = () => set(s => { if(s.isStreamingMode) s.playbackState = PlaybackState.PLAYING; });
                element.onpause = () => set(s => { if(s.isStreamingMode && s.playbackState !== PlaybackState.ENDED) s.playbackState = PlaybackState.PAUSED; }); // Don't set paused if ended
                
                // Record final progress on ended event for streaming too
                element.onended = () => {
                    set(s => {
                       if(s.isStreamingMode) {
                           s.playbackState = PlaybackState.ENDED;
                           // Record final progress
                           if (s.currentTrackDetails?.id) {
                               debouncedRecordProgress(s.currentTrackDetails.id, Math.floor(s.duration * 1000));
                           }
                       }
                    });
                    internalStop(get()); // Call internal stop
                };
                
                element.onwaiting = () => set(s => { if(s.isStreamingMode) s.playbackState = PlaybackState.BUFFERING; });
                element.onplaying = () => set(s => { if(s.isStreamingMode) s.playbackState = PlaybackState.PLAYING; }); // From waiting to playing
                element.onloadedmetadata = () => set(s => { if(s.isStreamingMode) s.duration = element.duration; });
                element.ontimeupdate = () => {
                    const currentTime = element.currentTime;
                    set(s => {
                        if(s.isStreamingMode) {
                            s.currentTime = currentTime;
                            // --- Record progress periodically ---
                            if (s.currentTrackDetails?.id) {
                                 debouncedRecordProgress(s.currentTrackDetails.id, Math.floor(currentTime * 1000));
                            }
                            // --- End Record progress ---
                        }
                    });
                 };
                element.onprogress = () => { // Update buffered time
                    if(element.buffered.length > 0) {
                       set(s => { if(s.isStreamingMode) s.bufferedTime = element.buffered.end(element.buffered.length - 1); });
                    }
                };
                element.onerror = (e) => {
                     console.error("HTMLAudioElement error:", element.error);
                     setError(`Audio playback error: ${element.error?.message || 'Unknown error'}`);
                };
                // Apply initial volume/mute state to new element
                const currentState = get();
                element.volume = currentState.isMuted ? 0 : currentState.volume;
                element.muted = currentState.isMuted; // Sync muted property too
             }
        });
      },

      _updateVolumeGain: () => { // Internal helper to apply volume/mute
         const state = get();
         if (state._gainNode) {
            state._gainNode.gain.setValueAtTime(state.isMuted ? 0 : state.volume, state._audioContext?.currentTime ?? 0);
         }
          // Also update HTML element volume/mute if in streaming mode
         if (state.isStreamingMode && state._htmlAudioElement) {
            state._htmlAudioElement.volume = state.isMuted ? 0 : state.volume;
            state._htmlAudioElement.muted = state.isMuted;
         }
      },


      loadAndPlayTrack: async (trackId) => {
        const currentTrackId = get().currentTrackDetails?.id;
        if (get().isLoading || currentTrackId === trackId) {
            // If already loading this track, do nothing
            // If this track is already loaded, maybe just call play()? Or restart?
            // For now, if same track, just ensure it plays if paused
            if(currentTrackId === trackId && get().playbackState === PlaybackState.PAUSED) {
                get().play();
            } else if (currentTrackId === trackId && (get().playbackState === PlaybackState.READY || get().playbackState === PlaybackState.ENDED)) {
                get().seek(0); // Restart from beginning
                get().play();
            }
            return;
        }

        // Stop previous track first
        get().stop();

        set({ isLoading: true, error: null, playbackState: PlaybackState.LOADING });

        try {
          // Fetch track details from backend using the service
          // Assuming getTrackDetails returns the full DTO including durationMs and playUrl
          const trackDetails = await getTrackDetails(trackId);
          if (!trackDetails || !trackDetails.playUrl) {
            throw new Error("Track details or play URL missing.");
          }

          const useStreaming = trackDetails.durationMs > AUDIO_DURATION_THRESHOLD_MS;
          const trackDurationSec = trackDetails.durationMs / 1000;

          set(state => {
              state.currentTrackDetails = trackDetails;
              state.duration = trackDurationSec;
              state.isStreamingMode = useStreaming;
              state.currentTime = 0; // Reset time
              state.bufferedTime = 0;
              state._audioBuffer = null; // Clear old buffer if any
          });

           const audioContext = initAudioContextIfNeeded(); // Ensure context is ready


          if (useStreaming) {
             console.log("Using Streaming Mode");
              set({ playbackState: PlaybackState.BUFFERING }); // Initial state before loading starts
              const audioEl = get()._htmlAudioElement;
              if (!audioEl) { throw new Error("HTMLAudioElement ref not set."); }

              // Create source node if it doesn't exist or context was reset
              let source = get()._sourceNode;
              if(!source || !(source instanceof MediaElementAudioSourceNode)) {
                  try {
                       source = audioContext.createMediaElementSource(audioEl);
                       source.connect(get()._gainNode!); // Connect to gain
                       set(state => { state._sourceNode = source; });
                  } catch (err) {
                      // This can happen if context was recreated and element already had a source
                      console.warn("Could not create media element source (maybe context recreated?), trying to proceed.", err);
                      // Attempt to connect existing node if possible? Complex. For now, log and hope element works.
                       if(get()._sourceNode && get()._sourceNode instanceof MediaElementAudioSourceNode) {
                           try { get()._sourceNode.connect(get()._gainNode!);} catch{} // Try reconnecting
                       }
                  }
              }

              audioEl.src = trackDetails.playUrl; // Set src to start loading
              audioEl.load(); // Explicitly call load
              // Set playbackState to playing immediately? Or wait for 'canplay'?
              // Let's rely on event handlers to set PLAYING state.
               // Attempt to play immediately after setting src
               // Browsers often require user interaction for first play.
               // This might fail silently or throw a DOMException.
               audioEl.play().catch(err => {
                    console.warn("Auto-play blocked or failed:", err);
                    // Keep state as BUFFERING/READY, user needs to click play manually.
                    set(s => { if(s.playbackState === PlaybackState.PLAYING) s.playbackState = PlaybackState.READY; });
               });


          } else {
            console.log("Using WAAPI Buffer Mode");
            set({ playbackState: PlaybackState.LOADING }); // Explicit loading state for fetch
            // --- WAAPI Path ---
            const response = await fetch(trackDetails.playUrl);
            if (!response.ok) {
              throw new Error(`Failed to fetch audio file: ${response.statusText}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            set({ playbackState: PlaybackState.DECODING });
            // Decode audio data
             audioContext.decodeAudioData(arrayBuffer,
                (decodedBuffer) => {
                  set(state => {
                      state._audioBuffer = decodedBuffer;
                      state.duration = decodedBuffer.duration; // Update duration from buffer
                      state.playbackState = PlaybackState.READY;
                      state.isLoading = false;
                      get().play(); // Auto-play after decoding
                  });
                },
                (decodeErr) => {
                  console.error("Error decoding audio data:", decodeErr);
                  setError(`Failed to decode audio: ${decodeErr.message}`);
                }
            );
          }
          // isLoading should be set to false once decoding is done or streaming starts playing
          // Handled within decode callback or play event for streaming
        } catch (err: any) {
          setError(`Failed to load track ${trackId}: ${err.message}`);
        } finally {
             // Set loading false here ONLY if not waiting for async decode
             if (!get().isStreamingMode && get().playbackState !== PlaybackState.DECODING) {
                 set({ isLoading: false });
             }
             // For streaming, loading ends when playing starts or error occurs
        }
      },

      play: () => {
        const { playbackState, isStreamingMode, _htmlAudioElement, _audioContext, _audioBuffer, currentTime } = get();
        if (playbackState !== PlaybackState.READY && playbackState !== PlaybackState.PAUSED && playbackState !== PlaybackState.ENDED) {
            return; // Can only play if ready/paused/ended
        }
        if (!_audioContext || !_gainNode) {
             console.warn("Audio context not ready for play");
             return;
        }

        // Ensure context is running (might be suspended after user interaction rules)
         if(_audioContext.state === 'suspended') {
             _audioContext.resume();
         }


        if (isStreamingMode) {
          if (_htmlAudioElement) {
             _htmlAudioElement.play().catch(err => setError(`Failed to play: ${err.message}`));
             // State update handled by 'onplay' event
          } else { setError("HTML audio element not available."); }
        } else {
          // WAAPI Play
          if (!_audioBuffer) { setError("Audio buffer not loaded."); return; }
          // Stop existing source if any (e.g., playing again after ended)
          if (get()._sourceNode) { internalStop(get()); }

          const source = _audioContext.createBufferSource();
          source.buffer = _audioBuffer;
          const gainNode = get()._gainNode!;
          source.connect(gainNode);

          // Handle seeking: start from currentTime
          const offset = currentTime % _audioBuffer.duration; // Loop if currentTime > duration
          const startOffset = Math.max(0, offset); // Ensure non-negative

          set(state => {
              state._sourceNode = source;
              state._playbackStartTime = _audioContext.currentTime; // Record context time
              state._playbackStartOffset = startOffset; // Record where we started in buffer
              state.playbackState = PlaybackState.PLAYING;
              state.error = null; // Clear previous errors
          });

           source.onended = () => {
                // Only set to ENDED if it wasn't stopped manually or by error
                // The animation frame loop will also detect end based on time
                if (get().playbackState === PlaybackState.PLAYING) {
                    set(s => { s.playbackState = PlaybackState.ENDED; });
                    internalStop(get());
                }
           };

          source.start(0, startOffset); // Start playback (0=now, startOffset=where in buffer)
          requestAnimationFrame(updateTimeWAAPI); // Start time updates
        }
      },

      pause: () => {
         const { playbackState, isStreamingMode, _htmlAudioElement, _sourceNode, _animationFrameId } = get();
         if (playbackState !== PlaybackState.PLAYING && playbackState !== PlaybackState.BUFFERING) return;

         internalStop(get()); // Use internal stop to handle cleanup for both modes
         // internalStop sets state to READY, override to PAUSED if we were playing/buffering
          set(state => { state.playbackState = PlaybackState.PAUSED; });
      },

      togglePlayPause: () => {
         const { playbackState } = get();
         if (playbackState === PlaybackState.PLAYING || playbackState === PlaybackState.BUFFERING) {
             get().pause();
         } else if (playbackState === PlaybackState.PAUSED || playbackState === PlaybackState.READY || playbackState === PlaybackState.ENDED) {
             // If ended, seek to start before playing
             if(playbackState === PlaybackState.ENDED) { get().seek(0); }
             get().play();
         }
      },

      seek: (timeSeconds) => {
          const { duration, playbackState, isStreamingMode, _htmlAudioElement, _audioBuffer, _audioContext } = get();
          if (duration <= 0 || playbackState === PlaybackState.LOADING || playbackState === PlaybackState.DECODING) return; // Cannot seek if not ready or no duration

          const seekTime = Math.max(0, Math.min(timeSeconds, duration)); // Clamp time

          set(state => { state.currentTime = seekTime; }); // Optimistically update currentTime

          if (isStreamingMode) {
              if (_htmlAudioElement) { _htmlAudioElement.currentTime = seekTime; }
          } else {
              // WAAPI Seek: Stop current source and start a new one at the seek time
               if (playbackState === PlaybackState.PLAYING) {
                    // Need to stop, then start again at new offset
                    internalStop(get());
                    set(state => { state.currentTime = seekTime; }); // Ensure time is set before play
                    get().play(); // Restart playback from the new seekTime
               } else {
                   // If paused/ready/ended, just update the time. Play will start from here.
                    set(state => {
                       state._playbackStartOffset = seekTime; // Update where next play should start
                    });
               }
          }
      },

      setVolume: (volume) => {
        const newVolume = Math.max(0, Math.min(1, volume)); // Clamp 0-1
         set(state => {
             state.volume = newVolume;
             // If setting volume while muted, unmute
             if (newVolume > 0 && state.isMuted) {
                 state.isMuted = false;
             }
             get()._updateVolumeGain(); // Apply changes
         });
      },

      toggleMute: () => {
         set(state => {
            state.isMuted = !state.isMuted;
            get()._updateVolumeGain(); // Apply changes
         });
      },

      stop: () => { // Full stop, unload track
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
               // Reset HTML audio element src?
               if (state._htmlAudioElement) {
                   state._htmlAudioElement.src = "";
                   state._htmlAudioElement.removeAttribute("src"); // Force unload
                   state._htmlAudioElement.load(); // Reset state
               }
           });
      },

      cleanup: () => {
         console.log("Cleaning up player store resources");
         internalStop(get()); // Stop playback and nodes
         const ctx = get()._audioContext;
          if (ctx && ctx.state !== 'closed') {
             ctx.close().catch(e => console.warn("Error closing AudioContext:", e)); // Close context
         }
          set(state => { // Reset internal references
            state._audioContext = null;
            state._gainNode = null;
            state._audioBuffer = null;
            state._sourceNode = null;
            // Don't nullify _htmlAudioElement ref here, component manages its lifecycle
          });
      }
    };
  }),
  {
    name: 'player-storage', // Optional: Name for Zustand devtools
  }
);

// Optional: Subscribe to state changes for debugging
// usePlayerStore.subscribe(newState => console.log("Player State Change:", newState));