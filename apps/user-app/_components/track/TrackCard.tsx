// apps/user-app/_components/track/TrackCard.tsx
// Can be a Server Component if no client interaction needed directly
import Image from 'next/image';
import Link from 'next/link';
import type { AudioTrackResponseDTO } from '@repo/types';
import { Card } from '@repo/ui'; // Use shared UI
import { formatDuration } from '@repo/utils'; // Use shared util
import { Play } from 'lucide-react';
// Import a client component button if play action needs client context
import { PlayTrackButton } from './PlayTrackButton';

interface TrackCardProps {
  track: AudioTrackResponseDTO;
}

export function TrackCard({ track }: TrackCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <Link href={`/tracks/${track.id}`} className="block hover:opacity-90 transition-opacity">
        {/* Basic Placeholder or next/image */}
        <div className="aspect-video bg-gray-200 flex items-center justify-center text-gray-400">
          {track.coverImageUrl ? (
             <Image src={track.coverImageUrl} alt={track.title} width={320} height={180} className="object-cover w-full h-full" />
           ) : (
             <span>No Cover</span>
          )}
        </div>
      </Link>
      <div className="p-4 flex-grow flex flex-col">
        <Link href={`/tracks/${track.id}`}>
          <h3 className="font-semibold text-lg mb-1 truncate hover:text-blue-600">{track.title}</h3>
        </Link>
        <p className="text-sm text-gray-600 line-clamp-2 flex-grow mb-2">{track.description || 'No description available.'}</p>
        <div className="text-xs text-gray-500 flex justify-between items-center mt-auto pt-2 border-t border-gray-100">
          <span>{track.languageCode} {track.level ? `(${track.level})` : ''}</span>
          <span>{formatDuration(track.durationMs)}</span>
        </div>
      </div>
      <div className="p-2 border-t">
        {/* This button likely needs client context to trigger the player */}
         <PlayTrackButton trackId={track.id} trackTitle={track.title} />
      </div>
    </Card>
  );
}