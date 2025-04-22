// apps/user-app/_stores/playerStore.ts
import { create, StateCreator } from 'zustand'; // Import create from base zustand
import { immer } from 'zustand/middleware/immer';
import type { AudioTrackDetailsResponseDTO } from '@repo/types';
import { PlaybackState } from '@/_lib/constants';
import { getTrackDetails } from '@/_services/trackService';
import { debounce } from '@repo/utils';
import { recordProgressAction } from '@/_actions/userActivityActions';

// --- Helper Functions ---
const log = (message: string, ...args: any[]) => console.log(`[PlayerStore] ${message}`, ...args);
const warn = (message: string, ...args: any[]) => console.warn(`[PlayerStore] ${message}`, ...args);
const errorLog = (message: string, ...args: any[]) => console.error(`[PlayerStore] ${message}`, ...args);

// Debounced Progress Recording
const debouncedRecordProgress = debounce((trackId: string, progressMs: number) => {
    if (trackId && progressMs >= 0) {
        // Fire and forget progress recording
        recordProgressAction(trackId, Math.round(progressMs))
            .then(result => { if (!result.success) warn("Failed to record progress via action:", result.message); })
            .catch(err => { errorLog("Error calling recordProgressAction:", err); });
    }
}, 3000); // 3 second debounce time

// --- Constants for Visualization ---
const VISUALIZATION_BARS = 5; // Number of bars
const FFT_SIZE = 32; // Power of 2 for AnalyserNode (min 32). Affects frequencyBinCount.

// --- Slice Interfaces ---

interface StateSlice {
    playbackState: PlaybackState;
    currentTrackDetails: AudioTrackDetailsResponseDTO | null;
    duration: number; // seconds
    currentTime: number; // seconds
    error: string | null;
    _isSeeking: boolean; // Internal flag during seek operations
    _currentTrackIdLoading: string | null; // Track ID currently being loaded
    _loadTimeoutId: NodeJS.Timeout | null; // Timeout for loading process
    amplitudeLevels: number[]; // State for visualization bars (0-1 values)

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
    _setAmplitudeLevels: (levels: number[]) => void;
}

interface AudioEngineSlice {
    _audioContext: AudioContext | null;
    _gainNode: GainNode | null;
    _analyserNode: AnalyserNode | null; // Node for visualization data
    _mediaElementSourceNode: MediaElementAudioSourceNode | null; // Connects <audio> to context
    _htmlAudioElement: HTMLAudioElement | null; // Reference to the UI's <audio> element
    _animationFrameId: number | null; // ID for the visualization animation loop

    // Actions for managing the audio engine
    _setHtmlAudioElementRef: (element: HTMLAudioElement | null) => void;
    _initAudioContextIfNeeded: () => AudioContext | null;
    _connectMediaElementSource: () => boolean; // Returns true on success
    _disconnectMediaElementSource: () => void;
    _applyVolumeAndMute: () => void; // Applies volume/mute to GainNode and element
    _startAmplitudeSampling: () => void; // Starts the visualization loop
    _stopAmplitudeSampling: () => void; // Stops the visualization loop
    cleanupAudioEngine: () => void; // Cleans up all audio resources
}

interface VolumeSlice {
    volume: number; // 0 to 1
    isMuted: boolean;
    // Actions
    setVolume: (volume: number) => void;
    toggleMute: () => void;
}

interface PlaybackControlSlice {
    // Actions
    play: () => Promise<void>; // Make async to handle promise rejection
    pause: () => void;
    togglePlayPause: () => void;
    seek: (timeSeconds: number) => void;
    stop: () => void; // Full stop and unload
}

interface TrackLoadingSlice {
    // Action
    loadAndPlayTrack: (trackId: string) => Promise<void>;
}

// Combined Type for the Store
type PlayerStore = StateSlice & AudioEngineSlice & VolumeSlice & PlaybackControlSlice & TrackLoadingSlice;

// --- Slice Creators ---

const createStateSlice: StateCreator<PlayerStore, [["zustand/immer", never]], [], StateSlice> = (set, get) => ({
    playbackState: PlaybackState.IDLE,
    currentTrackDetails: null,
    duration: 0,
    currentTime: 0,
    error: null,
    _isSeeking: false,
    _currentTrackIdLoading: null,
    _loadTimeoutId: null,
    amplitudeLevels: new Array(VISUALIZATION_BARS).fill(0),

    setPlaybackState: (state) => set(draft => { draft.playbackState = state; }),
    setError: (message, trackId) => set(draft => {
        get()._clearLoadTimeout();
        get()._stopAmplitudeSampling(); // Stop sampling on any error
        const currentTrackId = draft.currentTrackDetails?.id;
        const loadingTrackId = draft._currentTrackIdLoading;
        // Only set error if it pertains to the track currently being loaded/played
        if (!trackId || loadingTrackId === trackId || currentTrackId === trackId) {
            errorLog("Error set:", message ?? 'Unknown error', trackId ? `(Track: ${trackId})` : '');
            draft.playbackState = PlaybackState.ERROR;
            draft.error = message ?? 'An unknown error occurred.';
            draft._currentTrackIdLoading = null; // Clear loading state
        } else {
            warn(`Error for track ${trackId} ignored, current loading/playing is ${loadingTrackId ?? currentTrackId ?? 'none'}`);
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
        if (timeoutId) { clearTimeout(timeoutId); set({ _loadTimeoutId: null }); }
    },
    _setAmplitudeLevels: (levels) => set(draft => { draft.amplitudeLevels = levels; }),
});


const createAudioEngineSlice: StateCreator<PlayerStore, [["zustand/immer", never]], [], AudioEngineSlice> = (set, get) => {

    // --- HTML Audio Element Event Handlers ---
    // These handlers are attached/detached in _setHtmlAudioElementRef
    // They call store actions (get().actionName()) to update state
    const handlePlay = () => { if (!get()._isSeeking) { log("Event: play -> PLAYING"); get().setPlaybackState(PlaybackState.PLAYING); get().setError(null); get()._startAmplitudeSampling(); }};
    const handlePause = () => { if (![PlaybackState.ENDED, PlaybackState.IDLE, PlaybackState.ERROR].includes(get().playbackState) && !get()._isSeeking) { log("Event: pause -> PAUSED"); get().setPlaybackState(PlaybackState.PAUSED); get()._stopAmplitudeSampling(); }};
    const handleEnded = () => {
        log("Event: ended -> ENDED");
        const state = get();
        const finalDuration = state.duration;
        state.setPlaybackState(PlaybackState.ENDED);
        state.setCurrentTime(finalDuration);
        state.setIsSeeking(false);
        state._stopAmplitudeSampling();
        const endedTrackId = state.currentTrackDetails?.id;
        if (endedTrackId) {
            debouncedRecordProgress.cancel();
            recordProgressAction(endedTrackId, Math.floor(finalDuration * 1000)).catch(err => errorLog("Error recording final progress on end:", err));
        }
    };
    const handleWaiting = () => { if (get().playbackState === PlaybackState.PLAYING) { log("Event: waiting -> BUFFERING"); get().setPlaybackState(PlaybackState.BUFFERING); get()._stopAmplitudeSampling(); }};
    const handlePlaying = () => { if ([PlaybackState.BUFFERING, PlaybackState.SEEKING].includes(get().playbackState) || get()._isSeeking) { log("Event: playing -> PLAYING (after buffer/seek)"); get().setPlaybackState(PlaybackState.PLAYING); get().setIsSeeking(false); get()._startAmplitudeSampling(); }};
    const handleLoadedMetadata = () => { if (get()._htmlAudioElement) { log("Event: loadedmetadata"); get().setDuration(get()._htmlAudioElement.duration || 0); } };
    const handleCanPlay = () => {
        log("Event: canplay");
        get()._clearLoadTimeout();
        const state = get();
        if (state._currentTrackIdLoading === state.currentTrackDetails?.id) {
            if (![PlaybackState.PLAYING, PlaybackState.PAUSED].includes(state.playbackState)) {
                state.setPlaybackState(PlaybackState.READY);
            }
            state._setCurrentTrackIdLoading(null);
        }
    };
    const handleTimeUpdate = () => {
        const state = get();
        if (!state._htmlAudioElement || state._isSeeking || state.playbackState === PlaybackState.IDLE) return;
        const htmlCurrentTime = state._htmlAudioElement.currentTime;
        if (Math.abs(state.currentTime - htmlCurrentTime) > 0.05) { // Avoid excessive updates
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
        const state = get();
        if (state._isSeeking) {
            log("Event: seeked");
            state.setIsSeeking(false);
            // Restore state based on paused status AFTER seek completes
            const isPaused = state._htmlAudioElement?.paused ?? true;
            const targetState = isPaused ? PlaybackState.PAUSED : PlaybackState.PLAYING;
            state.setPlaybackState(targetState);
            if (targetState === PlaybackState.PLAYING) {
                 state._startAmplitudeSampling(); // Restart sampling after seek if playing
            }
        }
    };

    const setupAudioElementListeners = (element: HTMLAudioElement) => {
        log("Setting up HTMLAudioElement listeners");
        element.addEventListener('play', handlePlay); element.addEventListener('pause', handlePause); element.addEventListener('ended', handleEnded);
        element.addEventListener('waiting', handleWaiting); element.addEventListener('playing', handlePlaying); element.addEventListener('loadedmetadata', handleLoadedMetadata);
        element.addEventListener('canplay', handleCanPlay); element.addEventListener('timeupdate', handleTimeUpdate); element.addEventListener('error', handleError);
        element.addEventListener('seeked', handleSeeked);
    };
    const removeAudioElementListeners = (element: HTMLAudioElement) => {
        log("Removing HTMLAudioElement listeners");
        element.removeEventListener('play', handlePlay); element.removeEventListener('pause', handlePause); element.removeEventListener('ended', handleEnded);
        element.removeEventListener('waiting', handleWaiting); element.removeEventListener('playing', handlePlaying); element.removeEventListener('loadedmetadata', handleLoadedMetadata);
        element.removeEventListener('canplay', handleCanPlay); element.removeEventListener('timeupdate', handleTimeUpdate); element.removeEventListener('error', handleError);
        element.removeEventListener('seeked', handleSeeked);
    };

    // --- Web Audio API Setup ---
    const internalInitAudioContext = (): AudioContext | null => {
        let state = get();
        let ctx = state._audioContext;
        if (!ctx || ctx.state === 'closed') {
            log("Initializing AudioContext");
            if (typeof window === 'undefined' || (!window.AudioContext && !(window as any).webkitAudioContext)) {
                errorLog("Web Audio API not supported.");
                get().setError("Web Audio API not supported."); return null;
            }
            try {
                ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                const gainNode = ctx.createGain();
                const analyserNode = ctx.createAnalyser();
                analyserNode.fftSize = FFT_SIZE * 2; // e.g., 64

                // Connect nodes: Source -> Gain -> Analyser -> Destination
                gainNode.connect(analyserNode);
                analyserNode.connect(ctx.destination);

                set(draft => {
                    draft._audioContext = ctx;
                    draft._gainNode = gainNode;
                    draft._analyserNode = analyserNode;
                });
                get()._applyVolumeAndMute(); // Apply initial volume/mute state
                ctx = get()._audioContext; // Get updated ref
            } catch (e) {
                 errorLog("Failed to initialize AudioContext", e);
                 get().setError(`Audio context init error: ${e instanceof Error ? e.message : 'Unknown'}`); return null;
            }
        }
         // Resume context if suspended
         if (ctx && ctx.state === 'suspended') {
            log("AudioContext is suspended, attempting resume...");
            ctx.resume().then(() => log("AudioContext resumed.")).catch(e => warn("Could not resume AudioContext:", e));
         }
        return ctx;
    };

    // Connects the HTMLAudioElement to the Web Audio graph
    const internalConnectSource = (): boolean => {
         const state = get();
         if (!state._audioContext || !state._htmlAudioElement || !state._gainNode) {
             warn("Cannot connect MediaElementSource: Context, Element, or GainNode missing."); return false;
         }
         // Disconnect previous source if it exists - essential to avoid errors
         if (state._mediaElementSourceNode) {
             log("Disconnecting previous MediaElementSourceNode before reconnecting.");
             get()._disconnectMediaElementSource();
         }

         log("Creating and connecting MediaElementAudioSourceNode (Source -> Gain)");
         try {
            const sourceNode = state._audioContext.createMediaElementSource(state._htmlAudioElement);
            sourceNode.connect(state._gainNode); // Connect source to the gain node
            set(draft => { draft._mediaElementSourceNode = sourceNode; });
            log("Connection successful: Source -> Gain -> Analyser -> Destination");
            return true;
         } catch (err: any) {
            // This error often happens if createMediaElementSource is called multiple times on the same element.
            errorLog("Failed to create/connect MediaElementSourceNode:", err);
            // Only set a general error if it's not the common "InvalidStateNode" error which might resolve on retry/reload
            if (!err.message?.includes("InvalidStateNode")) {
                get().setError(`Audio source connection error: ${err.message}`);
            } else {
                 warn("Caught InvalidStateNode error, likely due to re-connection attempt. Ignoring for now.");
            }
            set(draft => { draft._mediaElementSourceNode = null; }); // Ensure state reflects failure
            return false;
         }
    };

    // Disconnects the MediaElementSourceNode from the GainNode
    const internalDisconnectSource = () => {
        const sourceNode = get()._mediaElementSourceNode;
        const gainNode = get()._gainNode;
        if (sourceNode && gainNode) {
            log("Disconnecting MediaElementSourceNode from GainNode");
            try { sourceNode.disconnect(gainNode); } catch(e) { warn("Error disconnecting source node", e); }
            set(draft => { draft._mediaElementSourceNode = null; });
        } else if (sourceNode) {
            // Fallback disconnect if gain node somehow missing
             try { sourceNode.disconnect(); } catch(e) { warn("Error disconnecting source node (fallback)", e); }
             set(draft => { draft._mediaElementSourceNode = null; });
        }
    };

    // Applies volume/mute state to GainNode and the HTML element
    const internalApplyVolumeAndMute = () => {
        const state = get();
        if (state._gainNode && state._audioContext && state._audioContext.state === 'running') {
            const targetVolume = state.isMuted ? 0 : state.volume;
            state._gainNode.gain.setTargetAtTime(targetVolume, state._audioContext.currentTime, 0.015);
        }
         if (state._htmlAudioElement) {
             state._htmlAudioElement.volume = state.volume;
             state._htmlAudioElement.muted = state.isMuted;
         }
    };

    // --- Visualization Sampling Logic ---
     const startSampling = () => {
        if (get()._animationFrameId !== null || !get()._analyserNode) return;
        log("Starting amplitude sampling loop");
        const analyser = get()._analyserNode!;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const sampleLoop = () => {
             // Check playback state within the loop
             if (get().playbackState !== PlaybackState.PLAYING) {
                 get()._stopAmplitudeSampling(); // Stop if no longer playing
                 return;
             }
             if (get()._animationFrameId === null) return; // Check if loop was stopped externally

             try {
                 analyser.getByteTimeDomainData(dataArray); // Use time domain data for volume-like levels

                 // Calculate average absolute deviation from midpoint (128)
                 let sumAbsDev = 0;
                 for (const amplitude of dataArray) { sumAbsDev += Math.abs(amplitude - 128); }
                 const avgAbsDev = sumAbsDev / dataArray.length;
                 // Map deviation (0-128) to level (0-1) - adjust multiplier for sensitivity
                 const level = Math.min(1, avgAbsDev / 64); // Example mapping

                 // Distribute level across bars (simple distribution)
                 const newLevels = new Array(VISUALIZATION_BARS).fill(0).map((_, i) =>
                     Math.max(0.02, Math.min(1, level * (1 - i / (VISUALIZATION_BARS * 1.5)) + Math.random() * 0.1 * level))
                 );
                 get()._setAmplitudeLevels(newLevels);
             } catch (sampleError) {
                 errorLog("Error during audio sampling:", sampleError);
                 get()._stopAmplitudeSampling(); return; // Stop on error
             }

            // Continue the loop
            set({ _animationFrameId: requestAnimationFrame(sampleLoop) }); // Update state with new frame ID
        };
        set({ _animationFrameId: requestAnimationFrame(sampleLoop) }); // Start loop and store ID
    };

     const stopSampling = () => {
         const animFrameId = get()._animationFrameId;
         if (animFrameId !== null) {
            log("Stopping amplitude sampling loop");
            cancelAnimationFrame(animFrameId);
            set(draft => {
                draft._animationFrameId = null;
                draft.amplitudeLevels = new Array(VISUALIZATION_BARS).fill(0);
            });
         }
     };

    return {
        // State properties
        _audioContext: null, _gainNode: null, _analyserNode: null,
        _mediaElementSourceNode: null, _htmlAudioElement: null, _animationFrameId: null,

        // Actions
        _setHtmlAudioElementRef: (element) => {
            const previousElement = get()._htmlAudioElement;
            if (previousElement && previousElement !== element) {
                log("Previous HTML element detected, disconnecting and removing listeners.");
                get()._disconnectMediaElementSource();
                removeAudioElementListeners(previousElement);
            }
            set(draft => { draft._htmlAudioElement = element; });
            if (element && previousElement !== element) {
                log("New HTML element set, setting up listeners and applying volume.");
                setupAudioElementListeners(element);
                get()._applyVolumeAndMute();
                // Connection happens in loadAndPlayTrack after src is set
            } else if (!element) {
                 log("HTML element reference cleared.");
                 get()._disconnectMediaElementSource(); // Disconnect if element is removed
            }
        },
        _initAudioContextIfNeeded: internalInitAudioContext,
        _connectMediaElementSource: internalConnectSource,
        _disconnectMediaElementSource: internalDisconnectSource,
        _applyVolumeAndMute: internalApplyVolumeAndMute,
        _startAmplitudeSampling: startSampling,
        _stopAmplitudeSampling: stopSampling,
        cleanupAudioEngine: () => {
            log("Cleaning up Audio Engine");
            get()._stopAmplitudeSampling();
            get()._disconnectMediaElementSource();
            const ctx = get()._audioContext;
            if (ctx && ctx.state !== 'closed') {
                // Disconnect remaining nodes before closing context
                 const analyser = get()._analyserNode;
                 const gain = get()._gainNode;
                 if (analyser) analyser.disconnect();
                 if (gain) gain.disconnect();
                ctx.close().then(()=>log("AudioContext closed.")).catch(e => warn("Error closing AudioContext:", e));
            }
             const el = get()._htmlAudioElement;
             if (el) { removeAudioElementListeners(el); }
            set(draft => {
                draft._audioContext = null; draft._gainNode = null; draft._analyserNode = null;
                draft._mediaElementSourceNode = null; draft._animationFrameId = null;
                // Don't nullify _htmlAudioElement here, let the UI component manage its ref
            });
        },
    };
};

const createVolumeSlice: StateCreator<PlayerStore, [["zustand/immer", never]], [], VolumeSlice> = (set, get) => ({
    volume: 0.8, isMuted: false,
    setVolume: (volume) => {
        const newVolume = Math.max(0, Math.min(1, volume));
        set(state => { state.volume = newVolume; if (newVolume > 0 && state.isMuted) state.isMuted = false; });
        get()._applyVolumeAndMute();
    },
    toggleMute: () => { set(state => { state.isMuted = !state.isMuted; }); get()._applyVolumeAndMute(); },
});

const createPlaybackControlSlice: StateCreator<PlayerStore, [["zustand/immer", never]], [], PlaybackControlSlice> = (set, get) => ({
    play: async () => {
        const { playbackState, _htmlAudioElement } = get();
        log(`Play action called. State: ${playbackState}`);
        if (![PlaybackState.READY, PlaybackState.PAUSED, PlaybackState.ENDED].includes(playbackState)) {
            warn(`Cannot play from state: ${playbackState}`); return;
        }
        const ctx = get()._initAudioContextIfNeeded(); // Ensure context is resumed/ready
        if (!ctx || !_htmlAudioElement) { get().setError("Audio engine not ready."); return; }
        if (ctx.state === 'suspended') {
             warn("AudioContext suspended, likely needs user gesture to resume.");
             // Try resuming again, although it might fail without interaction
             await ctx.resume().catch(e => warn("Could not resume AudioContext on play:", e));
             if (ctx.state !== 'running') {
                 get().setError("AudioContext interaction needed."); return;
             }
        }

        get().setError(null);
        try {
            // The play event listener will handle state changes and start sampling
            await _htmlAudioElement.play();
            log("HTMLAudioElement play() called successfully.");
        } catch (err: any) {
            errorLog("Error starting playback:", err);
            get().setError(`Playback failed: ${err.message}`, get().currentTrackDetails?.id);
            get()._stopAmplitudeSampling();
        }
    },
    pause: () => {
        const state = get();
        log(`Pause action called. State: ${state.playbackState}`);
        if (![PlaybackState.PLAYING, PlaybackState.BUFFERING].includes(state.playbackState)) { warn(`Cannot pause from state: ${state.playbackState}`); return; }
        if (!state._htmlAudioElement) { warn("Cannot pause: HTML element not available."); return; }

        debouncedRecordProgress.flush(); // Save progress immediately before pause
        if (state.currentTrackDetails?.id) { recordProgressAction(state.currentTrackDetails.id, Math.floor(state.currentTime * 1000)).catch(err => errorLog("Error recording progress on pause:", err)); }
        // The pause event listener will handle state changes and stop sampling
        state._htmlAudioElement.pause();
    },
    togglePlayPause: () => {
         const { playbackState } = get();
         log(`Toggle Play/Pause. Current State: ${playbackState}`);
         if ([PlaybackState.PLAYING, PlaybackState.BUFFERING].includes(playbackState)) get().pause();
         else if ([PlaybackState.PAUSED, PlaybackState.READY, PlaybackState.ENDED].includes(playbackState)) get().play();
         else warn(`Toggle Play/Pause ignored in state: ${playbackState}`);
    },
    seek: (timeSeconds) => {
        const { duration, playbackState, _htmlAudioElement } = get();
        log(`Seek action called. Time: ${timeSeconds}s, State: ${playbackState}`);
        const canSeek = duration > 0 && _htmlAudioElement && ![PlaybackState.IDLE, PlaybackState.LOADING, PlaybackState.ERROR].includes(playbackState);
        if (!canSeek) { warn(`Seek ignored in state: ${playbackState} or duration=${duration}`); return; }

        get()._stopAmplitudeSampling(); // Stop sampling during seek process
        const seekTime = Math.max(0, Math.min(timeSeconds, duration));
        get().setIsSeeking(true);
        get().setCurrentTime(seekTime); // Optimistic UI update
        // Consider a distinct SEEKING state if needed, though buffering/playing transitions handle it
        // get().setPlaybackState(PlaybackState.BUFFERING); // Indicate loading during seek

        _htmlAudioElement!.currentTime = seekTime; // Set the element's time

        debouncedRecordProgress.flush(); // Save progress before seek
        if (get().currentTrackDetails?.id) debouncedRecordProgress(get().currentTrackDetails!.id, Math.floor(seekTime * 1000));
        // The 'seeked' event listener will set _isSeeking=false and restart sampling if needed
    },
    stop: () => {
        log("Stop action called - unloading track");
        const state = get();
        const currentTrackId = state.currentTrackDetails?.id;
        const currentTimeMs = state.currentTime * 1000;

        debouncedRecordProgress.cancel(); // Cancel any pending debounced calls
        if (currentTrackId && currentTimeMs >= 0) {
            log(`Recording final progress ${Math.round(currentTimeMs)}ms on stop`);
            recordProgressAction(currentTrackId, Math.round(currentTimeMs)).catch(err => errorLog("Error recording final progress on stop:", err));
        }

        get()._clearLoadTimeout();
        get()._stopAmplitudeSampling();
        get()._disconnectMediaElementSource();

        set(draft => {
            const audioEl = draft._htmlAudioElement;
            draft.playbackState = PlaybackState.IDLE;
            draft.currentTrackDetails = null;
            draft.duration = 0;
            draft.currentTime = 0;
            draft.error = null;
            draft._isSeeking = false;
            draft._currentTrackIdLoading = null;
            draft._loadTimeoutId = null;
            draft.amplitudeLevels = new Array(VISUALIZATION_BARS).fill(0);

            if (audioEl) {
                try {
                    if (!audioEl.paused) audioEl.pause();
                    audioEl.removeAttribute("src"); // Clear src
                    // Setting src="" or src=null is often better than removeAttribute
                    // audioEl.src = "";
                    audioEl.load(); // Reset the element
                    log("HTMLAudioElement reset on stop.");
                } catch (e) { warn("Error resetting HTMLAudioElement on stop:", e); }
            }
        });
    },
});

const createTrackLoadingSlice: StateCreator<PlayerStore, [["zustand/immer", never]], [], TrackLoadingSlice> = (set, get) => ({
    loadAndPlayTrack: async (trackId) => {
        const state = get();
        // Prevent re-loading same track or loading while already loading
        if (state._currentTrackIdLoading === trackId) { log(`Track ${trackId} is already loading.`); return; }
        if (state.currentTrackDetails?.id === trackId) {
            if ([PlaybackState.READY, PlaybackState.PAUSED, PlaybackState.ENDED].includes(state.playbackState)) { log(`Track ${trackId} is loaded, calling play().`); get().play(); return; }
            if (state.playbackState === PlaybackState.PLAYING) { log(`Track ${trackId} is already playing.`); return; }
            // Handle buffering state? Maybe just let it continue.
        }

        log(`Loading track: ${trackId}`);
        get().stop(); // Stop previous track (this also disconnects source)

        // Set initial loading state
        get()._setCurrentTrackIdLoading(trackId);
        get().setPlaybackState(PlaybackState.LOADING);
        get().setError(null);
        get().setTrackDetails(null);
        get().setDuration(0);
        get().setCurrentTime(0);
        get()._setAmplitudeLevels(new Array(VISUALIZATION_BARS).fill(0));

        // Setup loading timeout
        get()._clearLoadTimeout();
        const timeoutId = setTimeout(() => { warn(`Loading timed out for track ${trackId}`); get().setError("Loading timed out.", trackId); }, 30000); // 30s timeout
        get()._setLoadTimeout(timeoutId);

        try {
            // Fetch track details (including playUrl)
            const trackDetails = await getTrackDetails(trackId);
            // Check if the load wasn't cancelled while fetching
            if (get()._currentTrackIdLoading !== trackId) { log(`Load cancelled for ${trackId} during fetch.`); get()._clearLoadTimeout(); return; }
            if (!trackDetails?.playUrl) throw new Error("Track details or play URL missing.");

            const trackDurationSec = trackDetails.durationMs / 1000;
            let initialSeekTime = trackDetails.userProgressMs != null && trackDetails.userProgressMs > 0 ? Math.min(trackDetails.userProgressMs / 1000, trackDurationSec) : 0;

            log(`Details loaded for ${trackId}. Duration: ${trackDurationSec}s. Initial Seek: ${initialSeekTime}s`);

            // Ensure AudioContext is ready
            const audioEl = get()._htmlAudioElement;
            if (!audioEl) throw new Error("HTMLAudioElement ref not available.");
            const ctx = get()._initAudioContextIfNeeded();
            if (!ctx) throw new Error("AudioContext not available."); // Error should be set by init function

            // Update state with details
            get().setTrackDetails(trackDetails);
            get().setDuration(trackDurationSec);
            get().setCurrentTime(initialSeekTime); // Set initial time for UI

            // --- Critical Order for Web Audio API with HTMLMediaElement ---
            // 1. Set the new source URL on the audio element
            audioEl.src = trackDetails.playUrl;

            // 2. Connect the element to the Web Audio graph *after* src is set.
            //    This ensures the context knows about the element's source.
            //    Re-connecting is crucial if the source node was disconnected by stop().
            const connected = get()._connectMediaElementSource();
            if (!connected) {
                 warn("Media element source connection failed. Visualization/WAAPI volume might not work.");
                 // Continue without Web Audio features if connection failed? Or setError?
                 // Let's proceed but log the warning. Error handling might need refinement.
            }

            // 3. Call load() to make the browser fetch the new media resource.
            audioEl.load();
            log(`HTMLAudioElement src set to ${trackDetails.playUrl.substring(0, 60)}... and load() called.`);

            // 4. Setup listener to play when ready
            const playWhenReady = () => {
                const currentState = get(); // Get fresh state inside listener
                if (currentState.currentTrackDetails?.id === trackId) {
                    log(`Stream ready for ${trackId}. Seeking to: ${initialSeekTime}s and attempting play.`);
                    // Setting currentTime might trigger 'seeked', which handles state/sampling
                    audioEl.currentTime = initialSeekTime;
                    currentState.play().catch(err => { // Use store's play action
                        warn(`Autoplay likely blocked or failed for track ${trackId}:`, err);
                        // If play fails, ensure state reflects readiness
                        if (get().currentTrackDetails?.id === trackId && get().playbackState !== PlaybackState.PLAYING) {
                             get().setPlaybackState(PlaybackState.READY);
                             get()._setCurrentTrackIdLoading(null); // Clear loading marker
                        }
                    });
                } else { log(`Skipping play for ${trackId}, another track (${currentState.currentTrackDetails?.id}) is active.`); }
                // Clear timeout and remove listeners regardless of play success/failure
                get()._clearLoadTimeout();
                audioEl.removeEventListener('canplaythrough', playWhenReady); // Use canplaythrough
                audioEl.removeEventListener('loadeddata', playWhenReadyFallback);
            };
            // Fallback listener in case 'canplaythrough' doesn't fire reliably
            const playWhenReadyFallback = () => {
                warn("'loadeddata' fired before 'canplaythrough', attempting play.");
                playWhenReady();
            };

            audioEl.addEventListener('canplaythrough', playWhenReady, { once: true });
            audioEl.addEventListener('loadeddata', playWhenReadyFallback, { once: true });

        } catch (err: any) {
            errorLog(`Error during loadAndPlayTrack for ${trackId}:`, err);
            get().setError(`Failed to load track: ${err.message}`, trackId);
        }
    },
});


// --- Create Store ---
const playerStoreApi = create<PlayerStore>()( 
    immer((...a) => ({
        ...createStateSlice(...a),
        ...createAudioEngineSlice(...a),
        ...createVolumeSlice(...a),
        ...createPlaybackControlSlice(...a),
        ...createTrackLoadingSlice(...a),
    }))
);

// Export the hook and the api object
export const usePlayerStore = playerStoreApi;


// Initial check if AudioContext is available (run once on module load)
if (typeof window !== 'undefined' && !window.AudioContext && !(window as any).webkitAudioContext) {
    console.error("This browser does not support the Web Audio API, playback visualization and advanced volume control may be limited.");
}