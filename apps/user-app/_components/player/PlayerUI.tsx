// apps/user-app/_components/player/PlayerUI.tsx
'use client';

import { useEffect, useRef } from 'react';
import { usePlayerStore } from '@/_stores/playerStore'; // Adjust alias
import { PlaybackState } from '@/_lib/constants'; // Adjust alias
import { formatDuration } from '@repo/utils'; // Adjust alias
import { Button } from '@repo/ui'; // Adjust alias
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack, Loader, AlertTriangle } from 'lucide-react';

export function PlayerUI() {
  // Select needed state and actions from store
  const {
    playbackState,
    currentTrackDetails,
    duration,
    currentTime,
    bufferedTime,
    volume,
    isMuted,
    isLoading,
    error,
    togglePlayPause,
    seek,
    setVolume,
    toggleMute,
    _setHtmlAudioElementRef, // Action to pass the ref
  } = usePlayerStore(state => ({
    playbackState: state.playbackState,
    currentTrackDetails: state.currentTrackDetails,
    duration: state.duration,
    currentTime: state.currentTime,
    bufferedTime: state.bufferedTime,
    volume: state.volume,
    isMuted: state.isMuted,
    isLoading: state.isLoading,
    error: state.error,
    togglePlayPause: state.togglePlayPause,
    seek: state.seek,
    setVolume: state.setVolume,
    toggleMute: state.toggleMute,
    _setHtmlAudioElementRef: state._setHtmlAudioElementRef,
  }));

  const audioRef = useRef<HTMLAudioElement>(null);

  // Pass the audio element ref to the store when it mounts/unmounts
  useEffect(() => {
    _setHtmlAudioElementRef(audioRef.current);
    // Cleanup function to nullify ref in store when component unmounts
    return () => _setHtmlAudioElementRef(null);
  }, [_setHtmlAudioElementRef]);


  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    seek(parseFloat(event.target.value));
  };

   const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(event.target.value));
  };

  // --- Conditional Rendering based on state ---
  if (playbackState === PlaybackState.IDLE && !isLoading) {
    return null; // Don't render player if nothing is loaded or loading
  }

  const isPlaying = playbackState === PlaybackState.PLAYING || playbackState === PlaybackState.BUFFERING;
  const showLoading = isLoading || playbackState === PlaybackState.LOADING || playbackState === PlaybackState.DECODING;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-3 shadow-lg z-50">
       {/* Hidden Audio Element for Streaming */}
       <audio ref={audioRef} preload="metadata" />

       <div className="container mx-auto flex items-center justify-between gap-4">
            {/* Track Info */}
            <div className="flex items-center gap-3 flex-shrink min-w-0">
                {currentTrackDetails?.coverImageUrl && (
                    <img src={currentTrackDetails.coverImageUrl} alt={currentTrackDetails.title} className="h-10 w-10 rounded object-cover" />
                )}
                <div className="truncate">
                    <p className="font-semibold text-sm truncate">{currentTrackDetails?.title ?? 'Loading...'}</p>
                    {/* <p className="text-xs text-gray-400 truncate">{currentTrackDetails?.artist ?? ''}</p> */}
                </div>
            </div>

            {/* Main Controls & Progress */}
             <div className="flex flex-col items-center flex-grow max-w-xl">
                 {/* Control Buttons */}
                <div className="flex items-center gap-3 mb-1">
                     {/* <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700" title="Previous">
                       <SkipBack className="h-5 w-5" />
                     </Button> */}
                     <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700" onClick={togglePlayPause} disabled={showLoading || playbackState === PlaybackState.ERROR || playbackState === PlaybackState.IDLE || playbackState === PlaybackState.DECODING } title={isPlaying ? "Pause" : "Play"}>
                         {showLoading ? <Loader className="h-6 w-6 animate-spin" /> : (isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />)}
                     </Button>
                    {/* <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700" title="Next">
                        <SkipForward className="h-5 w-5" />
                     </Button> */}
                </div>
                 {/* Progress Bar */}
                 <div className="w-full flex items-center gap-2 text-xs">
                     <span>{formatDuration(currentTime * 1000)}</span>
                     <input
                        type="range"
                        min="0"
                        max={duration || 1} // Use 1 if duration is 0 to avoid errors
                        value={currentTime}
                        onChange={handleSeek}
                        disabled={showLoading || duration <= 0 || playbackState === PlaybackState.ERROR}
                        className="w-full h-1 bg-gray-700 rounded-full appearance-none cursor-pointer accent-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Seek slider"
                     />
                     <span>{formatDuration(duration * 1000)}</span>
                </div>
                 {/* Display Buffering state */}
                 {playbackState === PlaybackState.BUFFERING && <span className="text-xs text-yellow-400 mt-1">Buffering...</span>}
                 {/* Display Error state */}
                 {playbackState === PlaybackState.ERROR && error && <span className="text-xs text-red-400 mt-1 flex items-center"><AlertTriangle className="h-3 w-3 mr-1" /> {error}</span>}

             </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
                 <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700" onClick={toggleMute} title={isMuted ? "Unmute" : "Mute"}>
                     {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                 </Button>
                 <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer accent-blue-500"
                    aria-label="Volume slider"
                 />
            </div>
       </div>
    </div>
  );
}