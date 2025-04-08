// apps/user-app/_components/track/TrackActivityClient.tsx
'use client';

import { useAuth } from '@/../_hooks/useAuth'; // Get current user ID
import { useTrackBookmarks } from '@/../_hooks/useBookmarks'; // Use the new hook
// import { useTrackProgress } from '@/../_hooks/useProgress'; // Hook for progress
import { usePlayerStore } from '@/../_stores/playerStore';
import { BookmarkList } from '@/../_components/activity/BookmarkList'; // Import list component
import { AddBookmarkButton } from '@/../_components/player/AddBookmarkButton'; // Import button

interface TrackActivityClientProps {
    trackId: string;
}

export function TrackActivityClient({ trackId }: TrackActivityClientProps) {
    const { user, isAuthenticated } = useAuth();
    const { seek: playerSeek } = usePlayerStore(state => ({ seek: state.seek })); // Get seek action

    // Fetch bookmarks for this track using TanStack Query hook
    const { data: bookmarks, isLoading: isLoadingBookmarks, error: bookmarksError } =
        useTrackBookmarks(isAuthenticated ? user?.id : undefined, trackId);

    // Fetch progress for this track (example)
    // const { data: progress, isLoading: isLoadingProgress, error: progressError } =
    //    useTrackProgress(isAuthenticated ? user?.id : undefined, trackId);

    if (!isAuthenticated) {
        return <p className="text-sm text-gray-500 my-4">Login to save progress and bookmarks.</p>;
    }

    return (
        <div className="mt-6 space-y-4">
             {/* Progress Display */}
             {/* <div>
                <h3 className="font-semibold mb-2">Your Progress</h3>
                {isLoadingProgress && <p>Loading progress...</p>}
                {progressError && <p className="text-red-500">Error loading progress.</p>}
                {progress && <p>Listened up to: {formatDuration(progress.progressMs)}</p>}
                {!isLoadingProgress && !progressError && !progress && <p>No progress recorded yet.</p>}
             </div> */}

            {/* Bookmarks Section */}
            <div>
                 <div className="flex justify-between items-center mb-2">
                     <h3 className="font-semibold">Bookmarks</h3>
                      <AddBookmarkButton />
                 </div>
                 {bookmarksError && <p className="text-red-500">Error loading bookmarks.</p>}
                 {/* Pass bookmarks data, loading state, and seek callback to the list */}
                 <BookmarkList
                    bookmarks={bookmarks ?? []}
                    isLoading={isLoadingBookmarks}
                    onSeek={playerSeek}
                    trackId={trackId}
                 />
             </div>
        </div>
    );
}