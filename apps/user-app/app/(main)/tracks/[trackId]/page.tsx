// apps/user-app/app/(main)/tracks/[trackId]/page.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getTrackDetails } from '@/_services/trackService'; // Adjust alias
import { formatDuration } from '@repo/utils'; // Adjust alias
import { PlayTrackButton } from '@/_components/track/PlayTrackButton'; // Adjust alias
import { TrackActivityClient } from '@/_components/track/TrackActivityClient'; // Client component for bookmarks/progress
import { Badge } from '@repo/ui'; // Assuming shared badge
import { WifiOff, Clock, Tag, UserCircle, Languages, Activity } from 'lucide-react'; // More icons
import Image from 'next/image';
import Link from 'next/link';
import { APIError } from '@repo/api-client';

interface TrackDetailPageProps {
  params: { trackId: string };
}

// Generate Metadata server-side
export async function generateMetadata({ params }: TrackDetailPageProps): Promise<Metadata> {
    try {
        const trackDetails = await getTrackDetails(params.trackId);
        return {
             title: `${trackDetails?.title || 'Track'} - AudioLang Player`,
             description: trackDetails?.description || 'Listen and learn with this audio track.',
             // OpenGraph metadata
             openGraph: {
                 title: trackDetails?.title || 'Audio Track',
                 description: trackDetails?.description || '',
                 images: trackDetails?.coverImageUrl ? [{ url: trackDetails.coverImageUrl }] : [],
                 type: 'music.song', // or 'article' depending on content
             },
        };
    } catch (error) {
         if (error instanceof APIError && (error.status === 404 || error.status === 403)) {
             return { title: 'Track Not Found' };
         }
         console.error("Error generating metadata for track:", params.trackId, error);
        return { title: 'Error Loading Track' };
    }
}

// Main Page Component (Server Component)
export default async function TrackDetailPage({ params }: TrackDetailPageProps) {
  const trackId = params.trackId;
  let trackDetails;

  try {
     trackDetails = await getTrackDetails(trackId);
     // Service should throw APIError for 404/403, which we catch below
  } catch (error: any) {
     console.error(`Error fetching track details server-side for ${trackId}:`, error);
     if (error instanceof APIError && (error.status === 404 || error.status === 403)) {
          notFound(); // Trigger Next.js 404 page
     }
     // For other errors, show a generic error message
     // Consider creating a dedicated error display component
     return (
         <div className="container mx-auto py-10 text-center text-red-600 dark:text-red-400">
             Error loading track details. Please try again later.
         </div>
     );
  }

  // If fetch somehow succeeded but returned null/undefined (unlikely with apiClient setup)
  if (!trackDetails) notFound();

  return (
    <div className="max-w-4xl mx-auto py-6 md:py-8">
      {/* Header Section with Image and Core Info */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-6 md:mb-8">
         {/* Cover Image */}
         <div className="w-full md:w-1/3 flex-shrink-0">
              <div className="aspect-square bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden relative shadow">
                 {trackDetails.coverImageUrl ? (
                     <Image
                         src={trackDetails.coverImageUrl}
                         alt={`Cover for ${trackDetails.title}`}
                         fill
                         sizes="(max-width: 768px) 100vw, 33vw"
                         className="object-cover"
                         priority // Prioritize loading cover image
                         onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; /* Hide img on error, placeholder below shows */ }}
                      />
                  ) : (
                     <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-500 text-4xl">
                         <MusicNote/> {/* Placeholder Icon */}
                     </div>
                  )}
                   {!trackDetails.isPublic && (
                      <span title="Private Track" className="absolute top-2 right-2 bg-slate-800/70 text-white p-1.5 rounded-full backdrop-blur-sm">
                          <WifiOff size={16} />
                      </span>
                  )}
              </div>
         </div>

         {/* Title, Metadata, Play Button */}
         <div className="flex-grow">
             <h1 className="text-3xl md:text-4xl font-bold mb-2">{trackDetails.title}</h1>
             {/* Metadata row */}
             <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600 dark:text-slate-400 mb-4">
                <span className="flex items-center"><Languages size={14} className="mr-1"/> {trackDetails.languageCode}</span>
                {trackDetails.level && <span><Badge variant="outline">{trackDetails.level}</Badge></span>}
                <span className="flex items-center"><Clock size={14} className="mr-1"/> {formatDuration(trackDetails.durationMs)}</span>
                {/* Optionally display uploader - requires backend to provide name */}
                 {/* {trackDetails.uploaderName && <span className="flex items-center"><UserCircle size={14} className="mr-1"/> {trackDetails.uploaderName}</span>} */}
             </div>

             {/* Play Button */}
             <div className="my-4">
                 <PlayTrackButton trackId={trackDetails.id} trackTitle={trackDetails.title} size="lg" showLabel={true} />
                 {/* Note: Player UI itself is likely fixed in the layout */}
             </div>

             {/* Description */}
             {trackDetails.description && (
                 <div className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                     <p>{trackDetails.description}</p>
                 </div>
             )}

             {/* Tags */}
             {trackDetails.tags && trackDetails.tags.length > 0 && (
                 <div className="mt-4 flex flex-wrap gap-2">
                      <Tag size={14} className="text-slate-500 dark:text-slate-400 mt-0.5"/>
                      {trackDetails.tags.map(tag => (
                          <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                 </div>
             )}
         </div>
      </div>


      {/* Activity Section (Bookmarks, Progress) - Client Component */}
      <div className="mt-8 pt-6 border-t dark:border-slate-700">
         <h2 className="text-xl font-semibold mb-3 flex items-center gap-2"><Activity size={20}/> Your Activity</h2>
         <Suspense fallback={<div className="mt-6"><Loader className="h-5 w-5 animate-spin text-slate-400"/> Loading activity...</div>}>
            <TrackActivityClient trackId={trackDetails.id} />
         </Suspense>
      </div>

       {/* Optional Debug Info (Remove in Production) */}
       {/* <details className="mt-10 text-xs opacity-50">
           <summary>Debug Info</summary>
           <pre className="bg-slate-100 dark:bg-slate-800 p-2 rounded overflow-x-auto">{JSON.stringify(trackDetails, null, 2)}</pre>
       </details> */}
    </div>
  );
}