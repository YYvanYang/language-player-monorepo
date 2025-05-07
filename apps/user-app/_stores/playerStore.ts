// apps/user-app/_stores/playerStore.ts
import { create, StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { AudioTrackDetailsResponseDTO } from '@repo/types';
import { PlaybackState } from '@/_lib/constants';
import { getTrackDetails } from '@/_services/trackService';
import { debounce } from '@repo/utils';
import { recordProgressAction } from '@/_actions/userActivityActions';

// --- Helper Functions & Constants ---
const log = (message: string, ...args: any[]) => console.log(`[PlayerStore] ${message}`, ...args);
const warn = (message: string, ...args: any[]) => console.warn(`[PlayerStore] ${message}`, ...args);
const errorLog = (message: string, ...args: any[]) => console.error(`[PlayerStore] ${message}`, ...args);

const LOAD_TIMEOUT_DURATION = 30000; // 30 seconds for track loading
const PROGRESS_DEBOUNCE_MS = 3000; // Debounce progress recording by 3 seconds

// Visualization Constants
const VISUALIZATION_BARS = 5; // Number of bars for visualization
const FFT_SIZE = 32;          // AnalyserNode FFT size (power of 2, min 32)

const debouncedRecordProgress = debounce(
    (trackId: string, progressMs: number) => {
        if (trackId && progressMs >= 0) {
            recordProgressAction(trackId, Math.round(progressMs))
                .then(result => { if (!result.success) warn("Failed to record progress (debounced):", result.message); })
                .catch(err => { errorLog("Error in debouncedRecordProgress:", err); });
        }
    }, PROGRESS_DEBOUNCE_MS
);

// --- Slice Interfaces ---

interface BaseState {
    playbackState: PlaybackState;
    currentTrackDetails: AudioTrackDetailsResponseDTO | null;
    duration: number; // in seconds
    currentTime: number; // in seconds
    error: string | null;
    _isSeeking: boolean;
    _currentTrackIdLoading: string | null;
    _loadTimeoutId: NodeJS.Timeout | null;
}

interface StateSliceActions {
    setPlaybackState: (state: PlaybackState) => void;
    setError: (message: string | null, trackIdContext?: string | null) => void;
    setCurrentTime: (time: number, internalUpdate?: boolean) => void;
    setDuration: (duration: number) => void;
    setTrackDetails: (details: AudioTrackDetailsResponseDTO | null) => void;
    _setIsSeeking: (isSeeking: boolean) => void;
    _setLoadTimeout: (timeoutId: NodeJS.Timeout | null) => void;
    _setCurrentTrackIdLoading: (trackId: string | null) => void;
    _clearLoadTimeout: () => void;
}

interface AudioEngineState {
    _audioContext: AudioContext | null;
    _gainNode: GainNode | null;
    _analyserNode: AnalyserNode | null;
    _mediaElementSourceNode: MediaElementAudioSourceNode | null;
    _htmlAudioElement: HTMLAudioElement | null;
    _isAudioEngineInitialized: boolean;
    amplitudeLevels: number[];
    _animationFrameId: number | null;
}

interface AudioEngineSliceActions {
    _setHtmlAudioElementRef: (element: HTMLAudioElement | null) => void;
    _initAudioEngine: () => Promise<boolean>;
    _connectMediaElementToGraph: () => boolean;
    _disconnectMediaElementFromGraph: () => void;
    _applyVolumeAndMuteToNodes: () => void;
    _startAmplitudeSampling: () => void;
    _stopAmplitudeSampling: () => void;
    _setAmplitudeLevels: (levels: number[]) => void;
    cleanupAudioEngine: () => void;
}

interface VolumeState {
    volume: number;
    isMuted: boolean;
}

interface VolumeSliceActions {
    setVolume: (volume: number) => void;
    toggleMute: () => void;
}

interface PlaybackControlSlice {
    play: () => Promise<void>;
    pause: () => void;
    togglePlayPause: () => void;
    seek: (timeSeconds: number) => void;
    stop: (options?: { recordFinalProgress?: boolean }) => void;
}

interface TrackLoadingSlice {
    loadAndPlayTrack: (trackId: string) => Promise<void>;
}

type PlayerStore = BaseState & AudioEngineState & VolumeState &
                   StateSliceActions & AudioEngineSliceActions & VolumeSliceActions &
                   PlaybackControlSlice & TrackLoadingSlice;


// --- Slice Creators ---

const createStateSlice: StateCreator<PlayerStore, [["zustand/immer", never]], [], BaseState & StateSliceActions> = (set, get) => ({
    playbackState: PlaybackState.IDLE,
    currentTrackDetails: null,
    duration: 0,
    currentTime: 0,
    error: null,
    _isSeeking: false,
    _currentTrackIdLoading: null,
    _loadTimeoutId: null,

    setPlaybackState: (state) => set(draft => { draft.playbackState = state; }),
    setError: (message, trackIdContext) => set(draft => {
        get()._clearLoadTimeout();
        get()._stopAmplitudeSampling();
        const isLoadingThisTrack = draft._currentTrackIdLoading === trackIdContext;
        const isPlayingThisTrack = draft.currentTrackDetails?.id === trackIdContext;
        if (trackIdContext && !isLoadingThisTrack && !isPlayingThisTrack && draft.playbackState !== PlaybackState.LOADING) {
            warn(`Error for track ${trackIdContext} ignored, current context: loading=${draft._currentTrackIdLoading}, playing=${draft.currentTrackDetails?.id}`);
            return;
        }
        errorLog("Error set:", message ?? 'Unknown error', trackIdContext ? `(Track: ${trackIdContext})` : '(Global)');
        draft.playbackState = PlaybackState.ERROR;
        draft.error = message ?? 'An unknown error occurred.';
        draft._currentTrackIdLoading = null;
    }),
    setCurrentTime: (time, internalUpdate = false) => set(draft => {
        draft.currentTime = time;
        if (!internalUpdate && draft.currentTrackDetails?.id && draft.playbackState === PlaybackState.PLAYING) {
            debouncedRecordProgress(draft.currentTrackDetails.id, Math.floor(time * 1000));
        }
    }),
    setDuration: (duration) => set(draft => { draft.duration = duration; }),
    setTrackDetails: (details) => set(draft => { draft.currentTrackDetails = details; }),
    _setIsSeeking: (isSeeking) => set(draft => { draft._isSeeking = isSeeking; }),
    _setLoadTimeout: (timeoutId) => set(draft => { draft._loadTimeoutId = timeoutId; }),
    _setCurrentTrackIdLoading: (trackId) => set(draft => { draft._currentTrackIdLoading = trackId; }),
    _clearLoadTimeout: () => {
        const timeoutId = get()._loadTimeoutId;
        if (timeoutId) {
            clearTimeout(timeoutId);
            // Update state within set if get() was used to retrieve the value
            set(draft => { draft._loadTimeoutId = null; });
        }
    },
});

const createAudioEngineSlice: StateCreator<PlayerStore, [["zustand/immer", never]], [], AudioEngineState & AudioEngineSliceActions> = (set, get) => {
    const _handleEvent = {
        onPlay: () => { if (!get()._isSeeking) { log("Event: play -> PLAYING"); get().setPlaybackState(PlaybackState.PLAYING); get().setError(null); get()._startAmplitudeSampling(); }},
        onPause: () => { if (![PlaybackState.ENDED, PlaybackState.IDLE, PlaybackState.ERROR, PlaybackState.LOADING].includes(get().playbackState) && !get()._isSeeking) { log("Event: pause -> PAUSED"); get().setPlaybackState(PlaybackState.PAUSED); get()._stopAmplitudeSampling(); }},
        onEnded: () => {
            log("Event: ended -> ENDED");
            const { duration: finalDuration, currentTrackDetails: track, setCurrentTime, setPlaybackState, _setIsSeeking, _stopAmplitudeSampling } = get();
            setPlaybackState(PlaybackState.ENDED);
            setCurrentTime(finalDuration, true);
            _setIsSeeking(false);
            _stopAmplitudeSampling();
            if (track?.id) {
                debouncedRecordProgress.cancel();
                recordProgressAction(track.id, Math.floor(finalDuration * 1000))
                    .catch(err => errorLog("Error recording final progress on ended:", err));
            }
        },
        onWaiting: () => { if (get().playbackState === PlaybackState.PLAYING && !get()._isSeeking) { log("Event: waiting -> BUFFERING"); get().setPlaybackState(PlaybackState.BUFFERING); get()._stopAmplitudeSampling(); }},
        onPlaying: () => { if (get().playbackState === PlaybackState.BUFFERING || get()._isSeeking) { log("Event: playing (after buffer/seek) -> PLAYING"); get().setPlaybackState(PlaybackState.PLAYING); get()._setIsSeeking(false); get().setError(null); get()._startAmplitudeSampling(); }},
        onLoadedMetadata: () => { if (get()._htmlAudioElement) { log("Event: loadedmetadata"); get().setDuration(get()._htmlAudioElement!.duration || 0); }},
        onCanPlay: () => {
            log("Event: canplay");
            get()._clearLoadTimeout();
            const { _currentTrackIdLoading, currentTrackDetails, playbackState, setPlaybackState, _setCurrentTrackIdLoading } = get();
            if (_currentTrackIdLoading === currentTrackDetails?.id) {
                if (![PlaybackState.PLAYING, PlaybackState.PAUSED, PlaybackState.ERROR].includes(playbackState)) {
                    setPlaybackState(PlaybackState.READY);
                }
                _setCurrentTrackIdLoading(null);
            }
        },
        onTimeUpdate: () => {
            const { _htmlAudioElement, _isSeeking, playbackState, currentTime, setCurrentTime } = get();
            if (!_htmlAudioElement || _isSeeking || playbackState === PlaybackState.IDLE || playbackState === PlaybackState.LOADING) return;
            const htmlTime = _htmlAudioElement.currentTime;
            if (Math.abs(currentTime - htmlTime) > 0.1) {
                setCurrentTime(htmlTime);
            }
        },
        onErrorMediaElement: (e: Event) => {
            const audioEl = e.target as HTMLAudioElement;
            const error = audioEl.error;
            const errorMsg = `HTMLAudioElement Error: ${error?.message || `Code ${error?.code}` || 'Unknown Source Error'}`;
            errorLog(errorMsg, audioEl.src?.substring(0,100) + "...");
            get().setError(errorMsg, get().currentTrackDetails?.id);
        },
        onSeeked: () => {
            log("Event: seeked");
            const { _htmlAudioElement, _isSeeking, _setIsSeeking, playbackState, setPlaybackState, _startAmplitudeSampling, _stopAmplitudeSampling } = get();
            if (!_isSeeking) return; // Ignore if not initiated by store's seek action
            _setIsSeeking(false);
            if (_htmlAudioElement) {
                if (_htmlAudioElement.paused && playbackState !== PlaybackState.PAUSED) {
                    setPlaybackState(PlaybackState.PAUSED);
                    _stopAmplitudeSampling();
                } else if (!_htmlAudioElement.paused && playbackState !== PlaybackState.PLAYING) {
                    // This scenario should be handled by the 'onPlaying' event which usually fires after 'seeked'
                    // if the element continues playing. Explicitly setting to PLAYING here might be redundant
                    // or could conflict if 'onPlaying' has slightly different logic.
                    // For robustness, we can ensure the state matches the element's actual playing status.
                    setPlaybackState(PlaybackState.PLAYING);
                    _startAmplitudeSampling();
                }
            }
        },
    };

    const _attachListeners = (el: HTMLAudioElement) => {
        log("Attaching listeners to HTMLAudioElement");
        Object.entries(_handleEvent).forEach(([eventName, handler]) => {
            const htmlEventName = eventName.replace(/^on/, '').toLowerCase();
            el.addEventListener(htmlEventName, handler as EventListener);
        });
    };
    const _detachListeners = (el: HTMLAudioElement) => {
        log("Detaching listeners from HTMLAudioElement");
         Object.entries(_handleEvent).forEach(([eventName, handler]) => {
            const htmlEventName = eventName.replace(/^on/, '').toLowerCase();
            el.removeEventListener(htmlEventName, handler as EventListener);
        });
    };

    return {
        _audioContext: null, _gainNode: null, _analyserNode: null,
        _mediaElementSourceNode: null, _htmlAudioElement: null, _isAudioEngineInitialized: false,
        amplitudeLevels: new Array(VISUALIZATION_BARS).fill(0), _animationFrameId: null,

        _setHtmlAudioElementRef: (element) => {
            const oldElement = get()._htmlAudioElement;
            if (oldElement && oldElement !== element) {
                _detachListeners(oldElement);
                get()._disconnectMediaElementFromGraph();
            }
            // Immer will handle this reference assignment correctly.
            set(draft => { draft._htmlAudioElement = element; });
            if (element && element !== oldElement) {
                _attachListeners(element);
                get()._applyVolumeAndMuteToNodes();
            } else if (!element && oldElement) {
                 get()._disconnectMediaElementFromGraph();
            }
        },
        _initAudioEngine: async () => {
            if (get()._isAudioEngineInitialized && get()._audioContext?.state === 'running') return true;
            if (typeof window === 'undefined') { errorLog("Cannot init AudioEngine: not in browser environment."); return false; }

            try {
                let audioCtx = get()._audioContext;
                if (!audioCtx || audioCtx.state === 'closed') {
                    log("Initializing new AudioContext and audio graph nodes.");
                    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                    const gainNode = audioCtx.createGain();
                    const analyserNode = audioCtx.createAnalyser();
                    analyserNode.fftSize = FFT_SIZE * 2;
                    analyserNode.minDecibels = -90;
                    analyserNode.maxDecibels = -10;
                    analyserNode.smoothingTimeConstant = 0.85;
                    gainNode.connect(analyserNode);
                    analyserNode.connect(audioCtx.destination);
                    // Assign new instances. Cast to `any` to bypass Immer's strict WritableDraft typing
                    // for these complex browser-native objects. Immer handles reference changes.
                    set(draft => {
                        draft._audioContext = audioCtx as any;
                        draft._gainNode = gainNode as any;
                        draft._analyserNode = analyserNode as any;
                    });
                }

                if (audioCtx.state === 'suspended') {
                    log("AudioContext is suspended. Attempting to resume...");
                    await audioCtx.resume();
                    log(`AudioContext resumed. New state: ${audioCtx.state}`);
                }
                
                if (audioCtx.state === 'running') {
                    set(draft => { draft._isAudioEngineInitialized = true; });
                    get()._applyVolumeAndMuteToNodes();
                    return true;
                } else {
                     warn(`AudioContext could not be started/resumed. Final State: ${audioCtx.state}. User interaction might be needed.`);
                     set(draft => { draft._isAudioEngineInitialized = false; });
                     return false;
                }
            } catch (e: any) {
                errorLog("Failed to initialize/resume AudioContext:", e);
                get().setError(`Audio engine initialization error: ${e.message}`, null);
                set(draft => { draft._isAudioEngineInitialized = false; });
                return false;
            }
        },
        _connectMediaElementToGraph: () => {
            const { _audioContext, _htmlAudioElement, _gainNode, _mediaElementSourceNode: existingSource, _isAudioEngineInitialized } = get();
            if (!_audioContext || !_htmlAudioElement || !_gainNode || !_isAudioEngineInitialized) {
                warn("Cannot connect media element: audio engine not fully ready or HTML element missing.");
                return false;
            }
            if (existingSource) {
                log("Disconnecting existing MediaElementSourceNode before creating a new one.");
                get()._disconnectMediaElementFromGraph();
            }
            try {
                log("Creating and connecting new MediaElementAudioSourceNode.");
                const sourceNode = _audioContext.createMediaElementSource(_htmlAudioElement);
                sourceNode.connect(_gainNode);
                // Assign new instance. Cast to `any` for Immer.
                set(draft => { draft._mediaElementSourceNode = sourceNode as any; });
                return true;
            } catch (err: any) {
                errorLog("Failed to create/connect MediaElementSourceNode:", err);
                if (!err.message?.includes("InvalidStateNode")) {
                    get().setError(`Audio graph connection error: ${err.message}`, get().currentTrackDetails?.id);
                } else {
                    warn("Caught InvalidStateNode creating source, likely due to HTMLMediaElement state (e.g. no src).");
                }
                return false;
            }
        },
        _disconnectMediaElementFromGraph: () => {
            const sourceNode = get()._mediaElementSourceNode;
            if (sourceNode) {
                try {
                    sourceNode.disconnect(); // Disconnects from all outputs
                    log("MediaElementSourceNode disconnected.");
                } catch (e) { warn("Error disconnecting MediaElementSourceNode:", e); }
                set(draft => { draft._mediaElementSourceNode = null; });
            }
        },
        _applyVolumeAndMuteToNodes: () => {
            const { _gainNode, _audioContext, volume, isMuted, _htmlAudioElement } = get();
            if (_gainNode && _audioContext?.state === 'running') {
                const targetGain = isMuted ? 0 : volume;
                _gainNode.gain.setTargetAtTime(targetGain, _audioContext.currentTime, 0.015);
            }
            if (_htmlAudioElement) {
                _htmlAudioElement.volume = volume;
                _htmlAudioElement.muted = isMuted;
            }
        },
        _startAmplitudeSampling: () => {
            const { _animationFrameId, _analyserNode, _audioContext, playbackState, _setAmplitudeLevels } = get();
            if (_animationFrameId !== null || !_analyserNode || _audioContext?.state !== 'running' || playbackState !== PlaybackState.PLAYING) {
                return;
            }
            log("Starting amplitude sampling loop.");
            const dataArray = new Uint8Array(_analyserNode.frequencyBinCount);
            const sampleLoop = () => {
                const currentStore = get();
                if (currentStore._animationFrameId === null || currentStore.playbackState !== PlaybackState.PLAYING || !currentStore._analyserNode) {
                    log("Stopping sampling loop from within due to state change or missing analyser.");
                    get()._stopAmplitudeSampling(); // Call the actual stop action if conditions change
                    return;
                }
                currentStore._analyserNode.getByteFrequencyData(dataArray);
                const levels = [];
                const segmentSize = Math.floor(dataArray.length / VISUALIZATION_BARS);
                for (let i = 0; i < VISUALIZATION_BARS; i++) {
                    let sum = 0;
                    for (let j = 0; j < segmentSize; j++) { sum += dataArray[i * segmentSize + j]; }
                    levels.push(Math.min(1, (sum / segmentSize) / 255 + 0.02)); // Normalize and add base
                }
                _setAmplitudeLevels(levels);
                set(draft => { draft._animationFrameId = requestAnimationFrame(sampleLoop); });
            };
            set(draft => { draft._animationFrameId = requestAnimationFrame(sampleLoop); });
        },
        _stopAmplitudeSampling: () => {
            const animFrameId = get()._animationFrameId;
            if (animFrameId !== null) {
                log("Stopping amplitude sampling loop.");
                cancelAnimationFrame(animFrameId);
                set(draft => {
                    draft._animationFrameId = null;
                    draft.amplitudeLevels = new Array(VISUALIZATION_BARS).fill(0);
                });
            }
        },
        _setAmplitudeLevels: (levels) => set(draft => { draft.amplitudeLevels = levels; }),
        cleanupAudioEngine: () => {
            log("Cleaning up AudioEngine resources...");
            get()._stopAmplitudeSampling();
            get()._disconnectMediaElementFromGraph();
            const audioCtx = get()._audioContext;
            if (audioCtx && audioCtx.state !== 'closed') {
                const analyser = get()._analyserNode;
                const gain = get()._gainNode;
                if (analyser) analyser.disconnect();
                if (gain) gain.disconnect();
                audioCtx.close().then(() => log("AudioContext closed successfully.")).catch(e => warn("Error closing AudioContext:", e));
            }
            const el = get()._htmlAudioElement;
            if (el) { _detachListeners(el); } // Detach listeners during cleanup
            set(draft => {
                draft._audioContext = null; draft._gainNode = null; draft._analyserNode = null;
                draft._mediaElementSourceNode = null; draft._animationFrameId = null;
                draft._isAudioEngineInitialized = false;
                // Note: _htmlAudioElement is not nulled here as its lifecycle is tied to the React component's ref.
                // _setHtmlAudioElementRef(null) should be called by the component on unmount.
            });
        },
    };
};

const createVolumeSlice: StateCreator<PlayerStore, [["zustand/immer", never]], [], VolumeState & VolumeSliceActions> = (set, get) => ({
    volume: 0.75,
    isMuted: false,
    setVolume: (newVolume) => {
        const clampedVolume = Math.max(0, Math.min(1, newVolume));
        set(draft => {
            draft.volume = clampedVolume;
            if (clampedVolume > 0 && draft.isMuted) draft.isMuted = false;
        });
        get()._applyVolumeAndMuteToNodes();
    },
    toggleMute: () => {
        set(draft => { draft.isMuted = !draft.isMuted; });
        get()._applyVolumeAndMuteToNodes();
    },
});

const createPlaybackControlSlice: StateCreator<PlayerStore, [["zustand/immer", never]], [], PlaybackControlSlice> = (set, get) => ({
    play: async () => {
        const { playbackState, _htmlAudioElement, _isAudioEngineInitialized, _initAudioEngine, setError, currentTrackDetails, _audioContext } = get();
        log(`Play action called. Current state: ${playbackState}`);
        if (!_isAudioEngineInitialized || _audioContext?.state !== 'running') {
            log("Audio engine not ready or context not running, attempting to initialize/resume...");
            const engineReady = await _initAudioEngine();
            if (!engineReady) {
                warn("Play aborted: Audio engine failed to initialize/resume. User interaction might be required.");
                return;
            }
        }
        if (!_htmlAudioElement || !_htmlAudioElement.src) {
            warn("Play aborted: No HTMLAudioElement or src is set.");
            setError("No track loaded to play.", null);
            return;
        }
        if (![PlaybackState.READY, PlaybackState.PAUSED, PlaybackState.ENDED].includes(playbackState)) {
            warn(`Cannot play from current state: ${playbackState}.`);
            return;
        }
        setError(null);
        try {
            await _htmlAudioElement.play();
            log("HTMLAudioElement.play() command issued successfully.");
        } catch (err: any) {
            errorLog("Error attempting HTMLAudioElement.play():", err);
            let userMessage = `Playback failed: ${err.message}`;
            if (err.name === 'NotAllowedError') {
                userMessage = "Playback was prevented. This can happen if you haven't interacted with the page yet. Click play again.";
            }
            setError(userMessage, currentTrackDetails?.id);
            get()._stopAmplitudeSampling();
        }
    },
    pause: () => {
        const { playbackState, _htmlAudioElement, currentTrackDetails, currentTime } = get();
        log(`Pause action called. Current state: ${playbackState}`);
        if (![PlaybackState.PLAYING, PlaybackState.BUFFERING].includes(playbackState)) {
            warn(`Cannot pause from current state: ${playbackState}.`);
            return;
        }
        if (!_htmlAudioElement) { warn("Cannot pause: HTMLAudioElement is not available."); return; }
        debouncedRecordProgress.flush();
        if (currentTrackDetails?.id) {
            recordProgressAction(currentTrackDetails.id, Math.floor(currentTime * 1000))
                .catch(err => errorLog("Error recording progress on explicit pause:", err));
        }
        _htmlAudioElement.pause();
    },
    togglePlayPause: () => {
        const { playbackState, play, pause } = get();
        log(`TogglePlayPause action. Current State: ${playbackState}`);
        if ([PlaybackState.PLAYING, PlaybackState.BUFFERING].includes(playbackState)) {
            pause();
        } else if ([PlaybackState.PAUSED, PlaybackState.READY, PlaybackState.ENDED].includes(playbackState)) {
            play();
        } else {
            warn(`TogglePlayPause ignored due to current state: ${playbackState}`);
        }
    },
    seek: (timeSeconds) => {
        const { duration, playbackState, _htmlAudioElement, setCurrentTime, _setIsSeeking, _stopAmplitudeSampling } = get();
        log(`Seek action. Target time: ${timeSeconds}s, Current state: ${playbackState}`);
        const canSeek = duration > 0 && _htmlAudioElement &&
                        ![PlaybackState.IDLE, PlaybackState.LOADING, PlaybackState.ERROR].includes(playbackState);
        if (!canSeek) {
            warn(`Seek ignored: State=${playbackState}, Duration=${duration}, Element=${!!_htmlAudioElement}`);
            return;
        }
        _stopAmplitudeSampling();
        const seekTime = Math.max(0, Math.min(timeSeconds, duration));
        _setIsSeeking(true);
        setCurrentTime(seekTime); // This also handles debounced progress if was playing
        _htmlAudioElement.currentTime = seekTime;
    },
    stop: (options = { recordFinalProgress: true }) => {
        log(`Stop action called. Record final progress: ${options.recordFinalProgress}`);
        const { currentTrackDetails, currentTime, _htmlAudioElement, _clearLoadTimeout, _stopAmplitudeSampling, _disconnectMediaElementFromGraph } = get();
        const trackIdToRecord = currentTrackDetails?.id;
        const progressMsToRecord = Math.round(currentTime * 1000);
        _clearLoadTimeout();
        _stopAmplitudeSampling();
        _disconnectMediaElementFromGraph();
        if (options.recordFinalProgress && trackIdToRecord && progressMsToRecord >= 0) {
            debouncedRecordProgress.cancel();
            log(`Recording final progress on stop for track ${trackIdToRecord}: ${progressMsToRecord}ms`);
            recordProgressAction(trackIdToRecord, progressMsToRecord)
                .catch(err => errorLog("Error recording final progress on stop action:", err));
        }
        set(draft => {
            draft.playbackState = PlaybackState.IDLE;
            draft.currentTrackDetails = null;
            draft.duration = 0;
            draft.currentTime = 0;
            draft.error = null;
            draft._isSeeking = false;
            draft._currentTrackIdLoading = null;
            // _loadTimeoutId is cleared by _clearLoadTimeout
            draft.amplitudeLevels = new Array(VISUALIZATION_BARS).fill(0);
            if (draft._htmlAudioElement) {
                try {
                    if (!draft._htmlAudioElement.paused) draft._htmlAudioElement.pause();
                    draft._htmlAudioElement.removeAttribute("src");
                    draft._htmlAudioElement.load();
                    log("HTMLAudioElement source removed and element reset on stop.");
                } catch (e) { warn("Error resetting HTMLAudioElement on stop:", e); }
            }
        });
    },
});

const createTrackLoadingSlice: StateCreator<PlayerStore, [["zustand/immer", never]], [], TrackLoadingSlice> = (set, get) => ({
    loadAndPlayTrack: async (trackId) => {
        const { _currentTrackIdLoading, currentTrackDetails, playbackState, stop, _setCurrentTrackIdLoading, setPlaybackState, setError, setTrackDetails, setDuration, setCurrentTime, _setAmplitudeLevels, _clearLoadTimeout, _setLoadTimeout, _initAudioEngine, _htmlAudioElement, _connectMediaElementToGraph, play } = get();

        if (_currentTrackIdLoading === trackId) { log(`Track ${trackId} is already being loaded.`); return; }
        if (currentTrackDetails?.id === trackId) {
            if ([PlaybackState.READY, PlaybackState.PAUSED, PlaybackState.ENDED].includes(playbackState)) {
                log(`Track ${trackId} is already loaded and in a playable state. Attempting to play.`);
                await play(); return;
            }
            if (playbackState === PlaybackState.PLAYING || playbackState === PlaybackState.BUFFERING) { log(`Track ${trackId} is already playing or buffering.`); return; }
        }
        log(`Loading new track: ${trackId}`);
        stop({ recordFinalProgress: true });
        _setCurrentTrackIdLoading(trackId);
        setPlaybackState(PlaybackState.LOADING);
        setError(null);
        setTrackDetails(null);
        setDuration(0);
        setCurrentTime(0, true);
        _setAmplitudeLevels(new Array(VISUALIZATION_BARS).fill(0));
        _clearLoadTimeout();
        const timeoutId = setTimeout(() => {
            if (get()._currentTrackIdLoading === trackId) {
                warn(`Loading timed out for track ${trackId}.`);
                setError("Track loading timed out.", trackId);
            }
        }, LOAD_TIMEOUT_DURATION);
        _setLoadTimeout(timeoutId);

        try {
            const engineReady = await _initAudioEngine();
            if (!engineReady || !_htmlAudioElement) {
                throw new Error("Audio engine or HTML element not available for loading track.");
            }
            const newTrackDetails = await getTrackDetails(trackId);
            if (get()._currentTrackIdLoading !== trackId) {
                log(`Load operation for ${trackId} was cancelled.`);
                _clearLoadTimeout(); return;
            }
            if (!newTrackDetails?.playUrl) {
                throw new Error("Track details or play URL missing from API response.");
            }
            setTrackDetails(newTrackDetails);
            const trackDurationSec = newTrackDetails.durationMs / 1000;
            setDuration(trackDurationSec);
            let initialSeekTime = 0;
            if (newTrackDetails.userProgressMs != null && newTrackDetails.userProgressMs > 0) {
                initialSeekTime = Math.min(newTrackDetails.userProgressMs / 1000, trackDurationSec > 0.1 ? trackDurationSec - 0.1 : 0);
                initialSeekTime = Math.max(0, initialSeekTime);
            }
            setCurrentTime(initialSeekTime, true);
            log(`Track details loaded for ${trackId}. Duration: ${trackDurationSec}s. Initial seek target: ${initialSeekTime}s.`);
            _htmlAudioElement.src = newTrackDetails.playUrl;
            const connectedToGraph = _connectMediaElementToGraph();
            if (!connectedToGraph) {
                warn("MediaElementSourceNode connection failed during track load.");
            }
            _htmlAudioElement.load();
            log(`HTMLAudioElement src set and load() command issued for ${trackId}.`);
            
            const attemptPlayWhenReady = () => {
                const currentStore = get();
                if (currentStore.currentTrackDetails?.id === trackId && currentStore.playbackState === PlaybackState.READY) {
                    log(`Track ${trackId} is now READY. Attempting to play (from initial time: ${initialSeekTime}s).`);
                    if (_htmlAudioElement.currentTime.toFixed(3) !== initialSeekTime.toFixed(3)) { // Compare with tolerance
                         _htmlAudioElement.currentTime = initialSeekTime;
                    }
                    currentStore.play().catch(err => {
                        warn(`Autoplay for track ${trackId} was likely prevented or play() failed:`, err);
                    });
                } else {
                     log(`Skipping auto-play for ${trackId}: state is ${currentStore.playbackState} or track changed to ${currentStore.currentTrackDetails?.id}`);
                }
                _htmlAudioElement.removeEventListener('canplay', playListenerForThisLoad);
            };
            const playListenerForThisLoad = () => attemptPlayWhenReady();
            _htmlAudioElement.addEventListener('canplay', playListenerForThisLoad, { once: true });

        } catch (err: any) {
            errorLog(`Error during loadAndPlayTrack process for ${trackId}:`, err);
            setError(`Failed to load track: ${err.message}`, trackId);
            _clearLoadTimeout(); // Also clear loading flag via setError
        }
    },
});

const playerStoreApi = create<PlayerStore>()(
    immer((...a) => ({
        ...createStateSlice(...a),
        ...createAudioEngineSlice(...a),
        ...createVolumeSlice(...a),
        ...createPlaybackControlSlice(...a),
        ...createTrackLoadingSlice(...a),
    }))
);

export const usePlayerStore = playerStoreApi;

if (typeof window !== 'undefined') {
    log("PlayerStore initialized for client environment.");
    if (!window.AudioContext && !(window as any).webkitAudioContext) {
        errorLog("CRITICAL: Web Audio API is not supported by this browser. Advanced audio features will be severely limited or non-functional.");
    }
}