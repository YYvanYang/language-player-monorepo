// apps/user-app/_components/player/PlayerUI.tsx
'use client';

import { useEffect, useRef } from 'react';
import { usePlayerStore } from '@/_stores/playerStore'; // Use the hook from create
import { PlaybackState } from '@/_lib/constants';
import { formatDuration } from '@repo/utils';
import { Button, Progress } from '@repo/ui';
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack, Loader, AlertTriangle, Rewind, FastForward } from 'lucide-react';
import { AddBookmarkButton } from './AddBookmarkButton';
import Link from 'next/link';
import Image from 'next/image';
import { useAudioClip } from '@repo/utils';
import { AudioVisualizer } from './AudioVisualizer';

export function PlayerUI() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const playClickSound = useAudioClip('/sounds/click.wav', 0.3);
  const playSeekSound = useAudioClip('/sounds/seek.wav', 0.15);

  // --- GRANULAR SELECTION ---
  // Select each piece of state individually.
  // Zustand's default equality check (Object.is) handles primitives perfectly.
  // For objects/arrays, it correctly re-renders only when the reference changes.
  const playbackState = usePlayerStore((state) => state.playbackState);
  const currentTrackDetails = usePlayerStore((state) => state.currentTrackDetails); // Object ref
  const duration = usePlayerStore((state) => state.duration);
  const currentTime = usePlayerStore((state) => state.currentTime);
  const volume = usePlayerStore((state) => state.volume);
  const isMuted = usePlayerStore((state) => state.isMuted);
  const error = usePlayerStore((state) => state.error);
  const amplitudeLevels = usePlayerStore((state) => state.amplitudeLevels); // Array ref

  // Select actions (references are stable, get them once)
  // Alternatively, use usePlayerStore.getState() as before if preferred, both work.
  const togglePlayPause = usePlayerStore((state) => state.togglePlayPause);
  const seek = usePlayerStore((state) => state.seek);
  const setVolume = usePlayerStore((state) => state.setVolume);
  const toggleMute = usePlayerStore((state) => state.toggleMute);
  const _setHtmlAudioElementRef = usePlayerStore((state) => state._setHtmlAudioElementRef);
  const stop = usePlayerStore((state) => state.stop);
  // --- END GRANULAR SELECTION ---

  // --- Derive isLoading from the selected playbackState ---
  const isLoading = playbackState === PlaybackState.LOADING ||
                    playbackState === PlaybackState.DECODING ||
                    playbackState === PlaybackState.BUFFERING;

  // Pass the audio element ref to the store when it mounts/unmounts
  useEffect(() => {
    _setHtmlAudioElementRef(audioRef.current);
    return () => _setHtmlAudioElementRef(null);
  }, [_setHtmlAudioElementRef]); // Dependency is stable function reference

  // --- Event Handlers (use actions obtained above) ---
  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    seek(parseFloat(event.target.value));
  };
  const handleSeekComplete = () => { playSeekSound(); };
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => { setVolume(parseFloat(event.target.value)); };
  const handleTogglePlayPause = () => { playClickSound(); togglePlayPause(); };
  const handleToggleMute = () => { playClickSound(); toggleMute(); };
  const handleSeekRelative = (deltaSeconds: number) => { seek(currentTime + deltaSeconds); };

  // --- Render Logic (remains the same) ---
  if (playbackState === PlaybackState.IDLE && !isLoading) { return null; }
  const isPlaying = playbackState === PlaybackState.PLAYING;
  const canInteract = playbackState !== PlaybackState.LOADING && playbackState !== PlaybackState.DECODING && playbackState !== PlaybackState.ERROR;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-800 text-slate-100 p-3 shadow-lg border-t border-slate-700 z-50">
      <audio ref={audioRef} preload="metadata" />
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Left: Track Info */}
        <div className="flex items-center gap-3 flex-shrink min-w-0 w-full sm:w-1/4">
          {currentTrackDetails?.coverImageUrl ? ( <Image src={currentTrackDetails.coverImageUrl} alt={currentTrackDetails.title ?? 'Track cover'} width={40} height={40} className="h-10 w-10 rounded object-cover flex-shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}/> ) : ( <div className="h-10 w-10 rounded bg-slate-700 flex-shrink-0"></div> )}
          <div className="truncate">
            {currentTrackDetails ? ( <Link href={`/tracks/${currentTrackDetails.id}`} className="font-semibold text-sm truncate hover:underline" title={currentTrackDetails.title}>{currentTrackDetails.title}</Link> ) : ( <span className="font-semibold text-sm truncate italic text-slate-400">Loading...</span> )}
          </div>
        </div>

        {/* Center: Controls & Progress */}
        <div className="flex flex-col items-center flex-grow w-full sm:w-1/2 max-w-xl">
          <div className="flex items-center justify-center gap-2 mb-1 w-full">
            <div className="flex-grow flex items-center justify-center h-10"><AudioVisualizer levels={amplitudeLevels} isPlaying={isPlaying} /></div>
            <Button variant="ghost" size="icon" className="text-white hover:bg-slate-700 w-10 h-10" onClick={handleTogglePlayPause} disabled={!canInteract || isLoading} title={isPlaying ? "Pause" : "Play"}>{isLoading ? <Loader className="h-6 w-6 animate-spin" /> : (isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />)}</Button>
            <div className="flex-grow"></div>
            <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-slate-700" onClick={() => handleSeekRelative(-10)} disabled={!canInteract} title="Rewind 10s"><Rewind className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-slate-700" onClick={() => handleSeekRelative(30)} disabled={!canInteract} title="Forward 30s"><FastForward className="h-5 w-5" /></Button>
            <div className="ml-auto"><AddBookmarkButton /></div>
          </div>
          <div className="w-full flex items-center gap-2 text-xs">
            <span className="font-mono tabular-nums w-[45px] text-right">{formatDuration(currentTime * 1000)}</span>
            <input type="range" min="0" max={duration || 1} value={currentTime} onChange={handleSeek} onMouseUp={handleSeekComplete} onTouchEnd={handleSeekComplete} disabled={!canInteract} className="w-full h-1.5 bg-slate-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 accent-blue-500 disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Seek slider"/>
            <span className="font-mono tabular-nums w-[45px]">{formatDuration(duration * 1000)}</span>
          </div>
          {playbackState === PlaybackState.ERROR && error && ( <span className="text-xs text-red-400 mt-1 flex items-center justify-center"><AlertTriangle className="h-3 w-3 mr-1" /> {error}<Button variant="ghost" size="sm" onClick={stop} className="ml-2 text-red-400 hover:text-red-300 h-auto p-0 underline">Clear</Button></span> )}
        </div>

        {/* Right: Volume Control */}
        <div className="flex items-center gap-2 w-full justify-center sm:w-1/4 sm:justify-end">
          <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-slate-700" onClick={handleToggleMute} title={isMuted ? "Unmute" : "Mute"}>{isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}</Button>
          <input type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume} onChange={handleVolumeChange} className="w-20 h-1.5 bg-slate-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 accent-blue-500" aria-label="Volume slider"/>
        </div>
      </div>
    </div>
  );
}