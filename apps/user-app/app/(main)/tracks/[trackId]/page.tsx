// apps/user-app/app/(main)/tracks/[trackId]/page.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getTrackDetails } from '@/../_services/trackService'; // Adjust alias
import { formatDuration } from '@repo/utils'; // Adjust alias
import { PlayTrackButton } from '@/../_components/track/PlayTrackButton'; // Adjust alias
import { TrackActivityClient } from '@/../_components/track/TrackActivityClient'; // Client component for bookmarks/progress
import { Badge } from '@repo/ui'; // Assuming shared badge
import { WifiOff } from 'lucide-react'; // Private icon

interface TrackDetailPageProps {
  params: { trackId: string };
}

// Generate Metadata server-side
export async function generateMetadata({ params }: TrackDetailPageProps): Promise<Metadata> {
    try {
        const track = await getTrackDetails(params.trackId);
        return { title: track?.title || 'Track Not Found', description: track?.description };
    } catch (error) { return { title: 'Error' }; }
}

export default async function TrackDetailPage({ params }: TrackDetailPageProps) {
  const trackId = params.trackId;
  let trackDetails;

  try {
     trackDetails = await getTrackDetails(trackId);
     // Note: getTrackDetails service already uses apiClient which should map 404 to APIError
  } catch (error: any) {
     console.error(`Error fetching track details for ${trackId}:`, error);
     // Check if it's an APIError with status 404
     if (error instanceof APIError && error.status === 404) {
          notFound(); // Trigger Next.js 404 page
     }
     // For other errors, show a generic error message or component
     return <div className="text-center p-10 text-red-600">Error loading track details. Please try again later.</div>;
  }

  // If trackDetails is somehow null/undefined after try-catch (shouldn't happen if service throws)
  if (!trackDetails) notFound();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="mb-6 border-b pb-4">
          {!trackDetails.isPublic && (
             <span className="inline-flex items-center bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-0.5 rounded-full mb-2">
                 <WifiOff className="w-3 h-3 mr-1" /> Private
             </span>
         )}
        <h1 className="text-3xl md:text-4xl font-bold mb-1">{trackDetails.title}</h1>
        <div className="text-sm text-slate-500 dark:text-slate-400 flex flex-wrap gap-x-3 items-center">
          <span>{trackDetails.languageCode}</span>
          {trackDetails.level && <span><Badge variant="outline">{trackDetails.level}</Badge></span>}
          <span>Duration: {formatDuration(trackDetails.durationMs)}</span>
          {/* Optionally display uploader info if available and needed */}
          {/* {trackDetails.uploaderId && <span>Uploaded by: {trackDetails.uploaderId}</span>} */}
        </div>
      </div>

      {/* Play Button / Player Integration */}
      <div className="my-5 flex justify-center md:justify-start">
          <PlayTrackButton trackId={trackDetails.id} trackTitle={trackDetails.title} />
          {/* Note: The main PlayerUI is likely fixed in the layout */}
      </div>

      {/* Description */}
      {trackDetails.description && (
        <div className="prose dark:prose-invert max-w-none my-6">
          <p>{trackDetails.description}</p>
        </div>
      )}

       {/* Tags */}
      {trackDetails.tags && trackDetails.tags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
              {trackDetails.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
          </div>
      )}

      {/* Client Component for Bookmarks/Progress */}
      <Suspense fallback={<div className="mt-6">Loading activity...</div>}>
         <TrackActivityClient trackId={trackDetails.id} />
      </Suspense>

       {/* Debug Info (Remove) */}
       {/* <details className="mt-10 text-xs opacity-50">
           <summary>Debug Info</summary>
           <pre>{JSON.stringify(trackDetails, null, 2)}</pre>
       </details> */}
    </div>
  );
}