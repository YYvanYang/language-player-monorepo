// apps/user-app/_components/track/PlayTrackButton.tsx
'use client';
import { usePlayerStore } from '@/_stores/playerStore'; // Adjust path
import { Button } from '@repo/ui';
import { Play, Pause, Loader } from 'lucide-react';
import { PlaybackState } from '@/_lib/constants'; // Adjust path
import { cn } from '@repo/utils';
import { useAudioClip } from '@repo/utils';

interface PlayTrackButtonProps {
  trackId: string;
  trackTitle: string;
  size?: 'sm' | 'default' | 'lg' | 'icon'; // Allow different sizes
  className?: string; // Allow custom classes
  showLabel?: boolean; // Option to show/hide label text
}

export function PlayTrackButton({
    trackId,
    trackTitle,
    size = 'sm',
    className,
    showLabel = true,
}: PlayTrackButtonProps) {
  const playClickSound = useAudioClip('/sounds/click.wav', 0.3); // Use the hook

  // Select needed state and actions
  const { loadAndPlayTrack, togglePlayPause, currentTrackId, playbackState } = usePlayerStore(
    (state) => ({
        loadAndPlayTrack: state.loadAndPlayTrack,
        togglePlayPause: state.togglePlayPause,
        currentTrackId: state.currentTrackDetails?.id,
        playbackState: state.playbackState,
    })
  );

  const isCurrentTrack = currentTrackId === trackId;
  // Consider LOADING/DECODING/BUFFERING as intermediate states before playing/pausing
  const isPlaying = isCurrentTrack && playbackState === PlaybackState.PLAYING;
  const isPaused = isCurrentTrack && playbackState === PlaybackState.PAUSED;
  const isLoading = isCurrentTrack && (
        playbackState === PlaybackState.LOADING ||
        playbackState === PlaybackState.DECODING ||
        playbackState === PlaybackState.BUFFERING
  );
  const isReady = isCurrentTrack && (playbackState === PlaybackState.READY || playbackState === PlaybackState.ENDED);


  const handleClick = () => {
    playClickSound(); // Play sound on click
    if (isCurrentTrack) {
      togglePlayPause(); // Toggle play/pause if it's already the loaded track
    } else {
      loadAndPlayTrack(trackId); // Load and play if it's a different track
    }
  };

  // Determine button icon and text
  let Icon = Play;
  let label = "Play";
  let title = `Play ${trackTitle}`;
  let variant: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive" | null | undefined = "secondary"; // Default variant

  if (isLoading) {
      Icon = Loader;
      label = "Loading...";
      title = `Loading ${trackTitle}`;
      variant = "ghost"; // Use ghost variant while loading
  } else if (isPlaying) {
      Icon = Pause;
      label = "Pause";
      title = `Pause ${trackTitle}`;
      variant = "default"; // Use primary variant when playing
  } else if (isPaused || isReady) {
      Icon = Play; // Show Play icon if paused or ready/ended
      label = "Play";
      title = `Play ${trackTitle}`;
  }

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={cn("w-full justify-center", className)} // Default to full width, allow override
      title={title}
      disabled={isLoading} // Disable only while loading this specific track
      aria-label={title}
    >
      <Icon className={cn("h-4 w-4", showLabel && "mr-2", isLoading && 'animate-spin')} />
      {showLabel && label}
    </Button>
  );
}