// apps/user-app/_components/track/TrackList.tsx
import type { AudioTrackResponseDTO } from '@repo/types';
import { TrackCard } from './TrackCard';

interface TrackListProps {
  tracks: AudioTrackResponseDTO[];
  isLoading?: boolean; // Optional loading state for skeleton UI
}

export function TrackList({ tracks, isLoading }: TrackListProps) {
  if (isLoading) {
      // Optional: Render skeleton loaders
      return (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
               {Array.from({ length: 8 }).map((_, i) => (
                   <div key={i} className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded-lg aspect-[16/13]"></div> // Placeholder aspect ratio
               ))}
           </div>
      );
  }

  if (!tracks || tracks.length === 0) {
    return <p className="text-center text-gray-500 my-10">No tracks found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {tracks.map((track) => (
        <TrackCard key={track.id} track={track} />
      ))}
    </div>
  );
}