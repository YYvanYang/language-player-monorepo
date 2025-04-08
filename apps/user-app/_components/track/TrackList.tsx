// apps/user-app/_components/track/TrackList.tsx
import type { AudioTrackResponseDTO } from '@repo/types';
import { TrackCard } from './TrackCard';

interface TrackListProps {
  tracks: AudioTrackResponseDTO[];
}

export function TrackList({ tracks }: TrackListProps) {
  if (!tracks || tracks.length === 0) {
    return <p className="text-center text-gray-500">No tracks found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {tracks.map((track) => (
        <TrackCard key={track.id} track={track} />
      ))}
    </div>
  );
}