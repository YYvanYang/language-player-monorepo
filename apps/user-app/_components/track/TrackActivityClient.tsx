// apps/user-app/_components/track/TrackActivityClient.tsx
'use client';

import { useAuth } from '@/_hooks/useAuth';
import { useTrackBookmarks } from '@/_hooks/useBookmarks';
import { usePlayerStore } from '@/_stores/playerStore';
import { BookmarkList } from '@/_components/activity/BookmarkList';
import { AddBookmarkButton } from '@/_components/player/AddBookmarkButton';
import { Loader, Info } from 'lucide-react';
import Link from 'next/link';

interface TrackActivityClientProps {
    trackId: string;
}

export function TrackActivityClient({ trackId }: TrackActivityClientProps) {
    const { user, isAuthenticated, isLoading: isLoadingAuth } = useAuth();
    const { seek: playerSeek } = usePlayerStore(state => ({ seek: state.seek }));

    // Fetch bookmarks specifically for this track
    const { data: bookmarks, isLoading: isLoadingBookmarks, error: bookmarksError } =
        useTrackBookmarks(user?.id, trackId); // Hook handles enabled flag

    // --- Render Logic ---

    // Show loading indicator while auth state is resolving
    if (isLoadingAuth) {
        return <div className="flex justify-center items-center p-4"><Loader className="h-5 w-5 animate-spin text-slate-400"/></div>;
    }

    // Prompt login if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="text-sm text-center text-slate-500 dark:text-slate-400 my-6 p-4 border rounded-md bg-slate-50 dark:bg-slate-800/50">
                <Info size={18} className="inline-block mr-1 mb-0.5"/>
                <Link href="/login" className="text-blue-600 hover:underline font-medium">Login</Link> or{' '}
                <Link href="/register" className="text-blue-600 hover:underline font-medium">Register</Link>{' '}
                to save your progress and add bookmarks.
            </div>
        );
    }

    // Render bookmark section for authenticated users
    return (
        <div className="mt-6 space-y-4">
            <div>
                <div className="flex justify-between items-center mb-2 border-b pb-2">
                    <h3 className="font-semibold text-lg">Bookmarks</h3>
                    {/* AddBookmarkButton already checks if track is loaded/playing */}
                    <AddBookmarkButton />
                </div>
                {bookmarksError && <p className="text-red-500 text-sm px-4 py-2">Error loading bookmarks.</p>}
                <BookmarkList
                    bookmarks={bookmarks ?? []}
                    isLoading={isLoadingBookmarks}
                    onSeek={playerSeek}
                    trackId={trackId} // Pass trackId for cache invalidation on delete
                />
            </div>
        </div>
    );
}