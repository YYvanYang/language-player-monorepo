// apps/user-app/_components/track/PlayTrackButton.tsx
'use client';
import { usePlayerStore } from '@/../_stores/playerStore'; // Adjust path
import { Button } from '@repo/ui';
import { Play } from 'lucide-react';

interface PlayTrackButtonProps {
  trackId: string;
  trackTitle: string; // For accessibility/tooltip
}

export function PlayTrackButton({ trackId, trackTitle }: PlayTrackButtonProps) {
  const loadAndPlay = usePlayerStore((state) => state.loadAndPlayTrack);
  // Could also get current track/playing state to show Pause icon etc.

  const handleClick = () => {
    loadAndPlay(trackId);
  };

  return (
    <Button onClick={handleClick} variant="secondary" size="sm" className="w-full" title={`Play ${trackTitle}`}>
      <Play className="h-4 w-4 mr-2" /> Play
    </Button>
  );
}