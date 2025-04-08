// apps/user-app/_components/track/PlayTrackButton.tsx
'use client';
import { usePlayerStore } from '@/../_stores/playerStore'; // Adjust path
import { Button } from '@repo/ui';
import { Play, Pause, Loader } from 'lucide-react';
import { PlaybackState } from '@/../_lib/constants'; // Adjust path

interface PlayTrackButtonProps {
  trackId: string;
  trackTitle: string;
}

export function PlayTrackButton({ trackId, trackTitle }: PlayTrackButtonProps) {
  // Select needed state and actions
  const { loadAndPlay, togglePlayPause, currentTrackId, playbackState, isLoading } = usePlayerStore(
    (state) => ({
        loadAndPlay: state.loadAndPlayTrack,
        togglePlayPause: state.togglePlayPause,
        currentTrackId: state.currentTrackDetails?.id,
        playbackState: state.playbackState,
        isLoading: state.isLoading && state.currentTrackDetails?.id === trackId, // Show loading only for this track
    })
  );

  const isCurrentTrack = currentTrackId === trackId;
  const isPlayingThisTrack = isCurrentTrack && (playbackState === PlaybackState.PLAYING || playbackState === PlaybackState.BUFFERING);

  const handleClick = () => {
    if (isCurrentTrack) {
      togglePlayPause(); // Toggle play/pause if it's already the loaded track
    } else {
      loadAndPlay(trackId); // Load and play if it's a different track
    }
  };

  // Determine button icon and text
  let Icon = Play;
  let label = "Play";
  let isDisabled = false;
  if(isLoading) {
      Icon = Loader;
      label = "Loading..."
      isDisabled = true;
  } else if (isPlayingThisTrack) {
      Icon = Pause;
      label = "Pause";
  }

  return (
    <Button
      onClick={handleClick}
      variant="secondary"
      size="sm"
      className="w-full"
      title={`${label} ${trackTitle}`}
      disabled={isDisabled}
      aria-label={`${label} ${trackTitle}`}
    >
      <Icon className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} /> {label}
    </Button>
  );
}