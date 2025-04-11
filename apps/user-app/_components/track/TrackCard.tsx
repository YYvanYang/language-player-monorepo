// apps/user-app/_components/track/TrackCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import type { AudioTrackResponseDTO } from '@repo/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@repo/ui'; // Use Card parts
import { formatDuration, cn } from '@repo/utils';
import { PlayTrackButton } from './PlayTrackButton';
import { Badge } from '@repo/ui';
import { WifiOff, MusicNote } from 'lucide-react'; // Example icons

interface TrackCardProps {
  track: AudioTrackResponseDTO;
  className?: string;
}

export function TrackCard({ track, className }: TrackCardProps) {
  return (
    <Card className={cn("flex flex-col overflow-hidden h-full shadow hover:shadow-md transition-shadow duration-200", className)}>
      {/* Image/Link Area */}
      <Link href={`/tracks/${track.id}`} className="block group relative aspect-[16/10] bg-slate-200 dark:bg-slate-700 overflow-hidden">
        {track.coverImageUrl ? (
           <Image
               src={track.coverImageUrl}
               alt={`Cover art for ${track.title}`}
               fill
               sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 23vw"
               className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
               priority={false} // Lower priority unless critical
               onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-image.svg'; /* Fallback image */ }}
            />
         ) : (
           <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500">
                 <MusicNote size={32}/>
                 <span className="mt-1 text-xs">{track.languageCode}</span>
           </div>
        )}
         {!track.isPublic && (
            <TooltipProvider delayDuration={100}>
                 <Tooltip>
                     <TooltipTrigger asChild>
                         <div className="absolute top-2 right-2 bg-slate-800/70 text-white p-1 rounded-full backdrop-blur-sm">
                              <WifiOff size={14} aria-label="Private Track"/>
                          </div>
                      </TooltipTrigger>
                      <TooltipContent side="left"><p>Private Track</p></TooltipContent>
                  </Tooltip>
              </TooltipProvider>
         )}
      </Link>

      {/* Content Area */}
      <CardContent className="p-3 flex-grow flex flex-col"> {/* Reduced padding, allow grow */}
         <Link href={`/tracks/${track.id}`} className="block mb-1">
           <CardTitle className="text-base font-semibold line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400" title={track.title}>
            {track.title}
           </CardTitle>
         </Link>
         <CardDescription className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 flex-grow mb-2">
           {track.description || ''}
         </CardDescription>

         {/* Tags */}
         {track.tags && track.tags.length > 0 && (
             <div className="mb-2 flex flex-wrap gap-1">
                 {track.tags.slice(0, 3).map(tag => (
                     <Badge key={tag} variant="secondary">{tag}</Badge>
                 ))}
             </div>
         )}
        {/* Metadata Footer */}
         <div className="text-xs text-slate-500 dark:text-slate-400 flex justify-between items-center mt-auto pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="truncate">
                {track.languageCode}
                {track.level && <Badge variant="outline" className="ml-1 px-1 py-0 text-xs">{track.level}</Badge>}
            </span>
            <span>{formatDuration(track.durationMs)}</span>
        </div>
      </CardContent>

      {/* Play Button Area */}
      <div className="p-2 border-t border-slate-100 dark:border-slate-800">
         <PlayTrackButton trackId={track.id} trackTitle={track.title} />
      </div>
    </Card>
  );
}