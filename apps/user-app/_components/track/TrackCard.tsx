// apps/user-app/_components/track/TrackCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import type { AudioTrackResponseDTO } from '@repo/types';
import { Card } from '@repo/ui';
import { formatDuration, cn } from '@repo/utils';
import { PlayTrackButton } from './PlayTrackButton'; // Client Component
import { Badge } from '@repo/ui'; // Assuming a Badge component exists
import { WifiOff } from 'lucide-react'; // Example icon for private

interface TrackCardProps {
  track: AudioTrackResponseDTO;
  className?: string;
}

export function TrackCard({ track, className }: TrackCardProps) {
  return (
    <Card className={cn("flex flex-col overflow-hidden h-full", className)}>
      <Link href={`/tracks/${track.id}`} className="block group relative aspect-video bg-slate-200 dark:bg-slate-700">
        {track.coverImageUrl ? (
           <Image
               src={track.coverImageUrl}
               alt={`Cover for ${track.title}`}
               fill // Use fill for responsive aspect ratio
               sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 23vw" // Example sizes
               className="object-cover transition-opacity group-hover:opacity-90"
               priority={false} // Set true only for above-the-fold images maybe
               onError={(e) => { e.currentTarget.style.display = 'none'; /* Hide img on error */ }}
            />
         ) : (
           <div className="flex items-center justify-center h-full text-slate-500 text-sm">
                <span>{track.languageCode}</span> {/* Show lang code as placeholder */}
           </div>
        )}
         {!track.isPublic && (
            <div className="absolute top-2 right-2 bg-slate-800/70 text-white p-1 rounded-full">
                 <WifiOff size={16} aria-label="Private Track" title="Private Track"/>
             </div>
         )}
      </Link>
      <div className="p-3 md:p-4 flex-grow flex flex-col">
        <Link href={`/tracks/${track.id}`}>
          <h3 className="font-semibold text-base md:text-lg mb-1 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400" title={track.title}>
            {track.title}
          </h3>
        </Link>
        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 flex-grow mb-2">
          {track.description || ''}
        </p>
         {/* Tags */}
         {track.tags && track.tags.length > 0 && (
             <div className="mb-2 flex flex-wrap gap-1">
                 {track.tags.slice(0, 3).map(tag => ( // Show limited tags
                     <Badge key={tag} variant="secondary">{tag}</Badge>
                 ))}
             </div>
         )}
        <div className="text-xs text-slate-500 dark:text-slate-400 flex justify-between items-center mt-auto pt-2 border-t border-slate-100 dark:border-slate-800">
          <span>{track.languageCode}{track.level ? ` (${track.level})` : ''}</span>
          <span>{formatDuration(track.durationMs)}</span>
        </div>
      </div>
      <div className="p-2 border-t border-slate-100 dark:border-slate-800">
         {/* Client component to handle play logic */}
         <PlayTrackButton trackId={track.id} trackTitle={track.title} />
      </div>
    </Card>
  );
}