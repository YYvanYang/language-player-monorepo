// apps/user-app/_components/track/TrackActivityClient.tsx
'use client';

import { useAuth } from '@/_hooks/useAuth';
import { useTrackBookmarks } from '@/_hooks/useBookmarks'; // Use the hook for this specific track
// import { useTrackProgress } from '@/_hooks/useProgress'; // If you create a hook for single track progress
import { usePlayerStore } from '@/_stores/playerStore';
import { BookmarkList } from '@/_components/activity/BookmarkList';
import { AddBookmarkButton } from '@/_components/player/AddBookmarkButton';
import { Loader } from 'lucide-react';

interface TrackActivityClientProps {
    trackId: string;
}

export function TrackActivityClient({ trackId }: TrackActivityClientProps) {
    const { user, isAuthenticated } = useAuth();
    const { seek: playerSeek } = usePlayerStore(state => ({ seek: state.seek }));

    // Use the hook specifically designed for fetching all bookmarks for one track
    const { data: bookmarks, isLoading: isLoadingBookmarks, error: bookmarksError } =
        useTrackBookmarks(user?.id, trackId); // Hook handles enabled flag based on userId/trackId

    // Example: Fetching single progress record (if needed beyond player store)
    // const { data: progress, isLoading: isLoadingProgress } = useQuery({
    //     queryKey: ['progress', userId, trackId],
    //     queryFn: () => getUserTrackProgress(trackId), // Assuming service exists
    //     enabled: !!userId && !!trackId,
    // });

    if (!isAuthenticated) {
        return <p className="text-sm text-gray-500 my-4">Login to save progress and bookmarks.</p>;
    }

    return (
        <div className="mt-6 space-y-4">
            {/* Bookmarks Section */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Bookmarks</h3>
                    <AddBookmarkButton />
                </div>
                {bookmarksError && <p className="text-red-500 text-sm">Error loading bookmarks.</p>}
                <BookmarkList
                    bookmarks={bookmarks ?? []}
                    isLoading={isLoadingBookmarks}
                    onSeek={playerSeek}
                    trackId={trackId} // Pass trackId for invalidation on delete
                />
            </div>
        </div>
    );
}