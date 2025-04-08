// apps/user-app/app/tracks/[trackId]/page.tsx
import { notFound } from 'next/navigation';
import { getTrackDetails } from '@/../_services/trackService'; // Adjust alias
import { formatDuration } from '@repo/utils'; // Adjust alias
import { Metadata } from 'next';
// Import Play button / trigger component if needed here
import { PlayTrackButton } from '@/../_components/track/PlayTrackButton'; // Adjust alias
import { TrackActivityClient } from '@/../_components/track/TrackActivityClient'; // NEW Client component

interface TrackDetailPageProps {
  params: { trackId: string };
}

// Optional: Generate Metadata server-side
export async function generateMetadata({ params }: TrackDetailPageProps): Promise<Metadata> {
    try {
        const { track } = await getTrackDetails(params.trackId); // Destructure if service returns object
        if (!track) { return { title: 'Track Not Found' }; }
        return {
            title: track.title,
            description: track.description,
        };
    } catch (error) {
        console.error("Error fetching metadata for track:", params.trackId, error);
        return { title: 'Error' };
    }
}

export default async function TrackDetailPage({ params }: TrackDetailPageProps) {
  const trackId = params.trackId;
  let trackDetails;

  try {
     // Fetch details including the playUrl server-side
     trackDetails = await getTrackDetails(trackId);
     if (!trackDetails) {
         notFound(); // Trigger 404 page if track not found by service
     }
  } catch (error: any) {
     console.error("Error fetching track details:", trackId, error);
     if (error.code === 'NOT_FOUND') { // Check for specific error code if api client throws it
          notFound();
     }
     // Handle other errors - maybe show an error component?
     return <div>Error loading track details. Please try again later.</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{trackDetails.title}</h1>
      <div className="text-sm text-gray-500 mb-4">
        <span>{trackDetails.languageCode}</span> |
        {trackDetails.level && <span> Level: {trackDetails.level} |</span>}
        <span> Duration: {formatDuration(trackDetails.durationMs)}</span>
      </div>
      {/* Render Play Button which uses context */}
      <div className="my-4">
          <PlayTrackButton trackId={trackDetails.id} trackTitle={trackDetails.title} />
          {/* Note: Player UI itself is likely fixed in the layout */}
      </div>

      {trackDetails.description && (
        <p className="text-gray-700 my-4">{trackDetails.description}</p>
      )}

      {/* TODO: Add sections for Bookmarks and Progress for this track */}
      {/* These might be Client Components using TanStack Query */}
      {/* <TrackBookmarks trackId={trackId} /> */}
      {/* <TrackProgress trackId={trackId} /> */}

      {/* Display other metadata */}
       {trackDetails.tags && trackDetails.tags.length > 0 && (
           <div className="mt-4 text-xs">
               Tags: {trackDetails.tags.join(', ')}
           </div>
       )}

       {/* Debug: Show play URL (remove in production) */}
       {/* <p className="text-xs mt-2 truncate">Play URL: {trackDetails.playUrl}</p> */}

       {/* --- Activity Section (Client Component) --- */}
       <TrackActivityClient trackId={trackDetails.id} />
    </div>
  );
}