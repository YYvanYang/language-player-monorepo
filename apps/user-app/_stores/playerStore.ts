// apps/user-app/_stores/playerStore.ts
import { create, StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { AudioTrackDetailsResponseDTO } from '@repo/types';
import { PlaybackState } from '@/_lib/constants';
import { getTrackDetails } from '@/_services/trackService';
import { debounce } from '@repo/utils';
import { recordProgressAction } from '@/_actions/userActivityActions';

// --- Helper Functions (Private to the module) ---
const log = (message: string, ...args: any[]) => console.log(`[PlayerStore] ${message}`, ...args);
const warn = (message: string, ...args: any[]) => console.warn(`[PlayerStore] ${message}`, ...args);
const errorLog = (message: string, ...args: any[]) => console.error(`[PlayerStore] ${message}`, ...args);

// Debounced Progress Recording (Shared across slices via get())
const debouncedRecordProgress = debounce((trackId: string, progressMs: number) => {
    // console.log(`Debounced: Recording progress ${progressMs}ms for track ${trackId}`);
    if (trackId && progressMs >= 0) {
        recordProgressAction(trackId, Math.round(progressMs))
            .then(result => { if (!result.success) warn("Failed to record progress via action:", result.message); })
            .catch(err => { errorLog("Error calling recordProgressAction:", err); });
    }
}, 3000);


// --- Slice Interfaces ---

// 1. Core State Slice
interface StateSlice {
    playbackState: PlaybackState;
    currentTrackDetails: AudioTrackDetailsResponseDTO | null;
    duration: number; // seconds
    currentTime: number; // seconds
    error: string | null;
    _isSeeking: boolean; // Flag during seek operations
    _currentTrackIdLoading: string | null; // Track ID being loaded
    _loadTimeoutId: NodeJS.Timeout | null; // Loading timeout

    // Actions primarily modifying this slice's state
    setPlaybackState: (state: PlaybackState) => void;
    setError: (message: string | null, trackId?: string | null) => void;
    setCurrentTime: (time: number) => void;
    setDuration: (duration: number) => void;
    setTrackDetails: (details: AudioTrackDetailsResponseDTO | null) => void;
    setIsSeeking: (isSeeking: boolean) => void;
    _setLoadTimeout: (timeoutId: NodeJS.Timeout | null) => void;
    _setCurrentTrackIdLoading: (trackId: string | null) => void;
    _clearLoadTimeout: () => void;
}

// 2. Audio Engine Slice (Refs and Listeners)
interface AudioEngineSlice {
    _audioContext: AudioContext | null;
    _gainNode: GainNode | null;
    _mediaElementSourceNode: MediaElementAudioSourceNode | null;
    _htmlAudioElement: HTMLAudioElement | null;

    // Actions
    _setHtmlAudioElementRef: (element: HTMLAudioElement | null) => void;
    _initAudioContextIfNeeded: () => AudioContext | null;
    _connectMediaElementSource: () => void;
    _disconnectMediaElementSource: () => void;
    _applyVolumeAndMute: () => void; // Moved here as it uses gainNode
    cleanupAudioEngine: () => void; // Specific cleanup for audio nodes/context
}

// 3. Volume Slice
interface VolumeSlice {
    volume: number; // 0 to 1
    isMuted: boolean;
    // Actions
    setVolume: (volume: number) => void;
    toggleMute: () => void;
}

// 4. Playback Control Slice
interface PlaybackControlSlice {
    // Actions
    play: () => void;
    pause: () => void;
    togglePlayPause: () => void;
    seek: (timeSeconds: number) => void;
    stop: () => void; // Full stop and unload
}

// 5. Track Loading Slice
interface TrackLoadingSlice {
    // Actions
    loadAndPlayTrack: (trackId: string) => Promise<void>;
}

// Combined Type for the Store
type PlayerStore = StateSlice & AudioEngineSlice & VolumeSlice & PlaybackControlSlice & TrackLoadingSlice;

// --- Slice Creators ---

// 1. State Slice Creator
const createStateSlice: StateCreator<PlayerStore, [["zustand/immer", never]], [], StateSlice> = (set, get) => ({
    playbackState: PlaybackState.IDLE,
    currentTrackDetails: null,
    duration: 0,
    currentTime: 0,
    error: null,
    _isSeeking: false,
    _currentTrackIdLoading: null,
    _loadTimeoutId: null,

    setPlaybackState: (state) => set(draft => { draft.playbackState = state; }),
    setError: (message, trackId) => set(draft => {
        get()._clearLoadTimeout(); // Clear timeout on error
        // Only set error if it pertains to the track currently being loaded/played
        const currentTrackId = draft.currentTrackDetails?.id;
        const loadingTrackId = draft._currentTrackIdLoading;
        if (!trackId || loadingTrackId === trackId || currentTrackId === trackId) {
            errorLog("Error set:", message, trackId ? `(Track: ${trackId})` : '');
            draft.playbackState = PlaybackState.ERROR;
            draft.error = message;
            draft._currentTrackIdLoading = null; // Clear loading state on error
        } else {
            warn(`Error for track ${trackId} ignored, current loading/playing is ${loadingTrackId ?? currentTrackId}`);
        }
    }),
    setCurrentTime: (time) => set(draft => { draft.currentTime = time; }),
    setDuration: (duration) => set(draft => { draft.duration = duration; }),
    setTrackDetails: (details) => set(draft => { draft.currentTrackDetails = details; }),
    setIsSeeking: (isSeeking) => set(draft => { draft._isSeeking = isSeeking; }),
    _setLoadTimeout: (timeoutId) => set(draft => { draft._loadTimeoutId = timeoutId; }),
    _setCurrentTrackIdLoading: (trackId) => set(draft => { draft._currentTrackIdLoading = trackId; }),
    _clearLoadTimeout: () => {
        const timeoutId = get()._loadTimeoutId;
        if (timeoutId) {
            clearTimeout(timeoutId);
            set({ _loadTimeoutId: null });
        }
    },
});

// 2. Audio Engine Slice Creator
const createAudioEngineSlice: StateCreator<PlayerStore, [["zustand/immer", never]], [], AudioEngineSlice> = (set, get) => {

    // --- HTML Audio Element Event Handlers ---
    const handlePlay = () => { if (!get()._isSeeking) { log("Event: play -> PLAYING"); get().setPlaybackState(PlaybackState.PLAYING); get().setError(null); }};
    const handlePause = () => { if (get().playbackState !== PlaybackState.ENDED && get().playbackState !== PlaybackState.IDLE && get().playbackState !== PlaybackState.ERROR && !get()._isSeeking) { log("Event: pause -> PAUSED"); get().setPlaybackState(PlaybackState.PAUSED); }};
    const handleEnded = () => {
        log("Event: ended -> ENDED");
        const finalDuration = get().duration;
        get().setPlaybackState(PlaybackState.ENDED);
        get().setCurrentTime(finalDuration);
        get().setIsSeeking(false);
        // Record final progress
        const endedTrackId = get().currentTrackDetails?.id;
        if (endedTrackId) {
            debouncedRecordProgress.cancel(); // Cancel any pending debounced calls
            recordProgressAction(endedTrackId, Math.floor(finalDuration * 1000))
                .catch(err => errorLog("Error recording final progress on end:", err));
        }
    };
    const handleWaiting = () => { if (get().playbackState === PlaybackState.PLAYING) { log("Event: waiting -> BUFFERING"); get().setPlaybackState(PlaybackState.BUFFERING); }};
    const handlePlaying = () => { if (get().playbackState === PlaybackState.BUFFERING || get()._isSeeking) { log("Event: playing -> PLAYING"); get().setPlaybackState(PlaybackState.PLAYING); get().setIsSeeking(false); }};
    const handleLoadedMetadata = () => {
        const audioEl = get()._htmlAudioElement;
        if (audioEl) {
            log("Event: loadedmetadata");
            get().setDuration(audioEl.duration || 0);
        }
    };
    const handleCanPlay = () => {
        log("Event: canplay");
        get()._clearLoadTimeout(); // Clear loading timeout
        const state = get();
        // If we were loading this specific track, move to ready state if not already playing/paused
        if (state._currentTrackIdLoading === state.currentTrackDetails?.id) {
            if (state.playbackState !== PlaybackState.PLAYING && state.playbackState !== PlaybackState.PAUSED) {
                state.setPlaybackState(PlaybackState.READY);
            }
            state._setCurrentTrackIdLoading(null); // Mark loading complete
        }
        // If seeking, transition back to previous state (or let 'playing' handle it)
        if (state._isSeeking) {
            // state.setIsSeeking(false); // Handled by seeked event now
        }
    };
    const handleTimeUpdate = () => {
        const state = get();
        if (!state._htmlAudioElement || state._isSeeking || state.playbackState === PlaybackState.IDLE) return;
        const htmlCurrentTime = state._htmlAudioElement.currentTime;
        if (Math.abs(state.currentTime - htmlCurrentTime) > 0.05) {
            state.setCurrentTime(htmlCurrentTime);
            if (state.currentTrackDetails?.id && state.playbackState === PlaybackState.PLAYING) {
                debouncedRecordProgress(state.currentTrackDetails.id, Math.floor(htmlCurrentTime * 1000));
            }
        }
    };
    const handleError = (e: Event) => {
        const audioEl = e.target as HTMLAudioElement;
        const error = audioEl.error;
        errorLog("HTMLAudioElement error:", error?.code, error?.message);
        get().setError(`Audio error: ${error?.message || `Code ${error?.code}` || 'Unknown'}`, get().currentTrackDetails?.id);
    };
    const handleSeeked = () => {
        if (get()._isSeeking) {
            log("Event: seeked");
            get().setIsSeeking(false);
            // Restore state based on paused status AFTER seek completes
            const isPaused = get()._htmlAudioElement?.paused ?? true;
            get().setPlaybackState(isPaused ? PlaybackState.PAUSED : PlaybackState.PLAYING);
        }
    };

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
        element.addEventListener('seeked', handleSeeked);
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
        element.removeEventListener('seeked', handleSeeked);
    };

    const internalInitAudioContext = (): AudioContext | null => {
        let state = get();
        let ctx = state._audioContext;
        if (!ctx || ctx.state === 'closed') {
            log("Initializing AudioContext");
            try {
                ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                const gainNode = ctx.createGain();
                gainNode.connect(ctx.destination);
                set(draft => { draft._audioContext = ctx; draft._gainNode = gainNode; });
                get()._applyVolumeAndMute(); // Apply initial volume/mute after creation
                ctx = get()._audioContext; // Get updated ref
            } catch (e) {
                 errorLog("Failed to initialize AudioContext", e);
                 get().setError("Audio playback not supported.");
                 return null;
            }
        }
         if (ctx && ctx.state === 'suspended') {
            ctx.resume().catch(e => warn("Could not resume AudioContext (may require user gesture):", e));
         }
        return ctx;
    };

    const internalConnectSource = () => {
         const state = get();
        if (!state._audioContext || !state._htmlAudioElement || !state._gainNode) {
             warn("Cannot connect MediaElementSource: Context, Element, or GainNode missing."); return;
        }
        if (state._mediaElementSourceNode) { return; } // Already connected

        log("Creating and connecting MediaElementAudioSourceNode");
        try {
            const sourceNode = state._audioContext.createMediaElementSource(state._htmlAudioElement);
            sourceNode.connect(state._gainNode);
            set(draft => { draft._mediaElementSourceNode = sourceNode; });
        } catch (err: any) {
            errorLog("Failed to create MediaElementAudioSourceNode:", err);
            get().setError(`Audio source connection error: ${err.message}`);
        }
    };

    const internalDisconnectSource = () => {
        const sourceNode = get()._mediaElementSourceNode;
        if (sourceNode) {
            log("Disconnecting MediaElementAudioSourceNode");
            try { sourceNode.disconnect(); } catch(e) { warn("Error disconnecting source node", e); }
            set(draft => { draft._mediaElementSourceNode = null; });
        }
    };

    const internalApplyVolumeAndMute = () => {
        const state = get();
        if (state._gainNode && state._audioContext && state._audioContext.state === 'running') {
            state._gainNode.gain.setTargetAtTime(state.isMuted ? 0 : state.volume, state._audioContext.currentTime, 0.01);
        }
        if (state._htmlAudioElement) {
            state._htmlAudioElement.volume = state.volume; // Keep element volume sync'd for potential direct control/fallback
            state._htmlAudioElement.muted = state.isMuted;
        }
    };

    return {
        _audioContext: null,
        _gainNode: null,
        _mediaElementSourceNode: null,
        _htmlAudioElement: null,

        _setHtmlAudioElementRef: (element) => {
            const previousElement = get()._htmlAudioElement;
            if (previousElement && previousElement !== element) {
                removeAudioElementListeners(previousElement);
                get()._disconnectMediaElementSource();
            }
             set(draft => { draft._htmlAudioElement = element; });
             if (element && previousElement !== element) {
                setupAudioElementListeners(element);
                get()._applyVolumeAndMute(); // Apply current volume/mute to new element
                get()._connectMediaElementSource(); // Attempt connection if context exists
             }
        },
        _initAudioContextIfNeeded: internalInitAudioContext,
        _connectMediaElementSource: internalConnectSource,
        _disconnectMediaElementSource: internalDisconnectSource,
        _applyVolumeAndMute: internalApplyVolumeAndMute,
        cleanupAudioEngine: () => {
            log("Cleaning up Audio Engine");
            get()._disconnectMediaElementSource();
            const ctx = get()._audioContext;
            if (ctx && ctx.state !== 'closed') {
                ctx.close().then(()=>log("AudioContext closed.")).catch(e => warn("Error closing AudioContext:", e));
            }
             // Remove listeners from element if it exists
             const el = get()._htmlAudioElement;
             if (el) {
                  removeAudioElementListeners(el);
             }
            set(draft => {
                draft._audioContext = null;
                draft._gainNode = null;
                draft._mediaElementSourceNode = null;
                // Keep HTMLAudioElement ref, let component unmount handle it if needed
            });
        },
    };
};

// 3. Volume Slice Creator
const createVolumeSlice: StateCreator<PlayerStore, [["zustand/immer", never]], [], VolumeSlice> = (set, get) => ({
    volume: 0.8,
    isMuted: false,
    setVolume: (volume) => {
        const newVolume = Math.max(0, Math.min(1, volume));
        set(state => {
            state.volume = newVolume;
            if (newVolume > 0 && state.isMuted) { state.isMuted = false; } // Unmute if volume > 0
        });
        get()._applyVolumeAndMute(); // Apply changes
    },
    toggleMute: () => {
        set(state => { state.isMuted = !state.isMuted; });
        get()._applyVolumeAndMute(); // Apply changes
    },
});

// 4. Playback Control Slice Creator
const createPlaybackControlSlice: StateCreator<PlayerStore, [["zustand/immer", never]], [], PlaybackControlSlice> = (set, get) => ({
    play: () => {
        const { playbackState, _htmlAudioElement } = get();
        log(`Play action called. State: ${playbackState}`);
        if (![PlaybackState.READY, PlaybackState.PAUSED, PlaybackState.ENDED].includes(playbackState)) {
            warn(`Cannot play from state: ${playbackState}`); return;
        }
        if (!_htmlAudioElement) { get().setError("Audio element not available."); return; }
        const ctx = get()._initAudioContextIfNeeded(); // Ensure context is running
        if (!ctx) return;

        get().setError(null); // Clear previous errors
        const playPromise = _htmlAudioElement.play();
        if (playPromise !== undefined) {
             playPromise.catch(err => {
                 errorLog("Error starting playback:", err);
                 get().setError(`Playback failed: ${err.message}`, get().currentTrackDetails?.id);
             });
        }
    },
    pause: () => {
        const state = get();
        log(`Pause action called. State: ${state.playbackState}`);
        if (![PlaybackState.PLAYING, PlaybackState.BUFFERING].includes(state.playbackState)) return;
        if (!state._htmlAudioElement) { warn("Cannot pause: HTML element not available."); return; }

        // Flush and record progress *before* pausing
        debouncedRecordProgress.flush();
        if (state.currentTrackDetails?.id) {
            recordProgressAction(state.currentTrackDetails.id, Math.floor(state.currentTime * 1000))
                 .catch(err => errorLog("Error recording progress on pause:", err));
        }
        state._htmlAudioElement.pause();
    },
    togglePlayPause: () => {
         const { playbackState } = get();
         log(`Toggle Play/Pause. Current State: ${playbackState}`);
         if ([PlaybackState.PLAYING, PlaybackState.BUFFERING].includes(playbackState)) {
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
        get().setIsSeeking(true); // Set seeking flag
        get().setCurrentTime(seekTime); // Update UI time immediately
        get().setPlaybackState(PlaybackState.SEEKING); // Enter seeking state

        _htmlAudioElement!.currentTime = seekTime; // Set the element's time

        // Flush any pending progress before seek starts
        debouncedRecordProgress.flush();
        // Schedule recording for the new position (will be updated/flushed by timeupdate/pause/stop)
        if (get().currentTrackDetails?.id) {
            debouncedRecordProgress(get().currentTrackDetails!.id, Math.floor(seekTime * 1000));
        }
    },
    stop: () => {
        log("Stop action called - unloading track");
        const state = get();
        const currentTrackId = state.currentTrackDetails?.id;
        const currentTimeMs = state.currentTime * 1000;

        // Force immediate progress recording before unloading
        debouncedRecordProgress.cancel(); // Cancel any pending debounced calls
        if (currentTrackId && currentTimeMs >= 0) {
            log(`Recording final progress ${Math.round(currentTimeMs)}ms on stop`);
            recordProgressAction(currentTrackId, Math.round(currentTimeMs))
                .catch(err => errorLog("Error recording final progress on stop:", err));
        }

        get()._clearLoadTimeout();

        set(draft => {
            const audioEl = draft._htmlAudioElement; // Cache ref before resetting

            // Reset core state properties (excluding audio engine refs for now)
            draft.playbackState = PlaybackState.IDLE;
            draft.currentTrackDetails = null;
            draft.duration = 0;
            draft.currentTime = 0;
            draft.error = null;
            draft._isSeeking = false;
            draft._currentTrackIdLoading = null;
            draft._loadTimeoutId = null; // Ensure timeout ID is cleared in state

            // Reset HTML element state
            if (audioEl) {
                try {
                    if (!audioEl.paused) audioEl.pause();
                    audioEl.removeAttribute("src");
                    audioEl.load(); // Force browser to release resources
                    log("HTMLAudioElement reset on stop.");
                } catch (e) { warn("Error resetting HTMLAudioElement on stop:", e); }
            }
        });
        // Note: AudioContext and nodes are not reset here, handled by cleanupAudioEngine if component unmounts
    },
});

// 5. Track Loading Slice Creator
const createTrackLoadingSlice: StateCreator<PlayerStore, [["zustand/immer", never]], [], TrackLoadingSlice> = (set, get) => ({
    loadAndPlayTrack: async (trackId) => {
        const state = get();
        const currentLoadingId = state._currentTrackIdLoading;
        const currentPlayingId = state.currentTrackDetails?.id;

        if (currentLoadingId === trackId) { log(`Track ${trackId} is already loading.`); return; }
        if (currentPlayingId === trackId && [PlaybackState.READY, PlaybackState.PAUSED, PlaybackState.ENDED].includes(state.playbackState)) {
            log(`Track ${trackId} is loaded, calling play().`);
            get().play(); return;
        }
        if (currentPlayingId === trackId && state.playbackState === PlaybackState.PLAYING) {
            log(`Track ${trackId} is already playing.`); return;
        }

        log(`Loading track: ${trackId}`);
        get().stop(); // Stop previous track & save progress

        get()._setCurrentTrackIdLoading(trackId);
        get().setPlaybackState(PlaybackState.LOADING);
        get().setError(null);
        get().setTrackDetails(null);
        get().setDuration(0);
        get().setCurrentTime(0);

        get()._clearLoadTimeout(); // Clear any previous timeout
        const timeoutId = setTimeout(() => {
            warn(`Loading timed out for track ${trackId}`);
            get().setError("Loading timed out.", trackId);
        }, 30000); // 30 second timeout
        get()._setLoadTimeout(timeoutId);

        try {
            const trackDetails = await getTrackDetails(trackId);
            // Check if the load wasn't cancelled while fetching
            if (get()._currentTrackIdLoading !== trackId) { log(`Load cancelled for ${trackId} during fetch.`); return; }
            if (!trackDetails?.playUrl) throw new Error("Track details or play URL missing.");

            const trackDurationSec = trackDetails.durationMs / 1000;
            let initialSeekTime = trackDetails.userProgressMs != null && trackDetails.userProgressMs > 0
                                ? Math.min(trackDetails.userProgressMs / 1000, trackDurationSec) : 0;

            log(`Details loaded for ${trackId}. Duration: ${trackDurationSec}s. Initial Seek: ${initialSeekTime}s`);

            get()._initAudioContextIfNeeded(); // Ensure context is ready
            const audioEl = get()._htmlAudioElement;
            if (!audioEl) throw new Error("HTMLAudioElement ref not available.");

            // Update state with details
            get().setTrackDetails(trackDetails);
            get().setDuration(trackDurationSec);
            get().setCurrentTime(initialSeekTime);
            get()._connectMediaElementSource(); // Ensure connection

            // Set src and load
            audioEl.src = trackDetails.playUrl;
            audioEl.load();

            // Handler to attempt play once ready
            const playWhenReady = () => {
                // Double check if we are still supposed to play *this* track
                if (get().currentTrackDetails?.id === trackId) {
                    log(`Stream can play. Setting currentTime: ${initialSeekTime}`);
                    audioEl.currentTime = initialSeekTime; // Set time now
                    audioEl.play()
                       .then(() => log("Playback started via loadAndPlayTrack."))
                       .catch(err => {
                           warn(`Autoplay likely blocked for track ${trackId}:`, err);
                           if (get().currentTrackDetails?.id === trackId) {
                               get().setPlaybackState(PlaybackState.READY); // Update state to READY
                               get()._setCurrentTrackIdLoading(null); // Clear loading state
                           }
                       });
                } else {
                     log(`Skipping play for ${trackId}, another track is active.`);
                }
                 get()._clearLoadTimeout(); // Clear timeout once playable
                 audioEl.removeEventListener('canplay', playWhenReady);
                 audioEl.removeEventListener('loadeddata', playWhenReady); // Also remove fallback listener
            };
            // Use 'canplay' as the primary trigger
            audioEl.addEventListener('canplay', playWhenReady, { once: true });
            // Add 'loadeddata' as a fallback trigger
            audioEl.addEventListener('loadeddata', playWhenReady, { once: true });

        } catch (err: any) {
            get().setError(`Failed to load track ${trackId}: ${err.message}`, trackId);
        }
    },
});


// --- Create Store ---
export const usePlayerStore = create<PlayerStore>()(
    immer((...a) => ({
        ...createStateSlice(...a),
        ...createAudioEngineSlice(...a),
        ...createVolumeSlice(...a),
        ...createPlaybackControlSlice(...a),
        ...createTrackLoadingSlice(...a),
    }))
);

// --- Cleanup Hook (Optional but recommended if used in specific components) ---
/*
import { useEffect } from 'react';
export const usePlayerCleanup = () => {
  const cleanup = usePlayerStore((state) => state.cleanupAudioEngine);
  useEffect(() => {
    // Cleanup on component unmount where the hook is used
    return () => {
      cleanup();
    };
  }, [cleanup]);
};
// Usage in your main layout or player component:
// usePlayerCleanup();
*/

// Initial check if AudioContext is available (run once)
if (typeof window !== 'undefined' && !window.AudioContext && !(window as any).webkitAudioContext) {
    console.error("This browser does not support the Web Audio API, playback might be limited.");
}