// apps/user-app/app/tracks/page.tsx
import { listTracks } from '@/_services/trackService'; // Adjust alias
import { TrackList } from '@/_components/track/TrackList'; // Adjust alias
import type { ListTrackQueryParams } from '@repo/types';
// Import PaginationControls if you build one

// Define search params type for the page
interface TracksPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function TracksPage({ searchParams }: TracksPageProps) {
  // TODO: Parse searchParams into ListTrackQueryParams securely
  // For now, fetch first page without filters
  const initialParams: ListTrackQueryParams = { limit: 20, offset: 0 };
  const { data: tracks, total } = await listTracks(initialParams);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Available Tracks</h1>
      {/* TODO: Add Filter/Sort Controls (likely client components) */}
      <TrackList tracks={tracks} />
      {/* TODO: Add Pagination Controls (using total, limit, offset) */}
       {/* <PaginationControls total={total} limit={initialParams.limit ?? 20} offset={initialParams.offset ?? 0} /> */}
    </div>
  );
}