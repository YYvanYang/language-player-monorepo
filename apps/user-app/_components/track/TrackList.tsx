// apps/user-app/_components/track/TrackList.tsx
import type { AudioTrackResponseDTO } from '@repo/types';
import { TrackCard } from './TrackCard';
import { cn } from '@repo/utils'; // Import cn

interface TrackListProps {
  tracks: AudioTrackResponseDTO[];
  isLoading?: boolean;
  className?: string; // Allow passing custom classes to the grid
}

export function TrackList({ tracks, isLoading, className }: TrackListProps) {
  if (isLoading) {
      // Grid for skeleton loaders
      return (
           <div className={cn("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", className)}>
               {Array.from({ length: 8 }).map((_, i) => ( // Render a fixed number of skeletons
                   <div key={i} className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded-lg aspect-[16/13]"></div>
               ))}
           </div>
      );
  }

  if (!tracks || tracks.length === 0) {
    return <p className="text-center text-slate-500 dark:text-slate-400 my-10">No tracks found matching your criteria.</p>;
  }

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", className)}>
      {tracks.map((track) => (
        <TrackCard key={track.id} track={track} />
      ))}
    </div>
  );
}