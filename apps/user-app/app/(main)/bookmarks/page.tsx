// apps/user-app/app/(main)/bookmarks/page.tsx
'use client';

import React, { useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/_hooks/useAuth';
import { useBookmarks } from '@/_hooks/useBookmarks';
import { BookmarkList } from '@/_components/activity/BookmarkList';
import { PaginationControls } from '@/_components/ui/PaginationControls';
import { usePlayerStore } from '@/_stores/playerStore';
import { Loader, BookmarkX, Info } from 'lucide-react';
import { DefaultLimit } from '@repo/utils'; // Use shared constant

// Separate component to handle logic dependent on searchParams and auth state
function BookmarksPageContent() {
    const { user, isAuthenticated, isLoading: isLoadingAuth } = useAuth();
    const searchParams = useSearchParams();
    const playerSeek = usePlayerStore((state) => state.seek);
    const loadAndPlay = usePlayerStore((state) => state.loadAndPlayTrack);

    // --- Pagination State from URL ---
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || String(DefaultLimit), 10);
    const offset = useMemo(() => (currentPage - 1) * limit, [currentPage, limit]);

    // --- Data Fetching ---
    // Fetch paginated list of *all* user bookmarks (no trackId filter here)
    const bookmarkParams = useMemo(() => ({ limit, offset }), [limit, offset]);
    const {
        data: queryResponse,
        isLoading: isLoadingBookmarks,
        isFetching, // Use for refetch indicator
        isError,
        error,
    } = useBookmarks(user?.id, bookmarkParams); // Use the hook for paginated lists

    // --- Seek and Play Handler ---
    const handleSeekAndPlay = (trackId: string, timeSeconds: number) => {
        loadAndPlay(trackId).then(() => {
            // Seek slightly after play starts to ensure it takes effect
            setTimeout(() => playerSeek(timeSeconds), 100);
        }).catch(err => console.error("Failed to load track for bookmark:", err));
    };

    // --- Render Logic ---
    const isLoading = isLoadingAuth || (isLoadingBookmarks && !queryResponse?.data); // Show initial loader
    const bookmarks = queryResponse?.data ?? [];
    const totalBookmarks = queryResponse?.total ?? 0;

    if (isLoading) {
        return <div className="flex justify-center items-center p-10"><Loader className="h-8 w-8 animate-spin text-blue-500" /></div>;
    }

    if (!isAuthenticated && !isLoadingAuth) {
        return (
             <div className="text-center text-slate-500 dark:text-slate-400 py-10">
                 <Info size={24} className="mx-auto mb-2 text-slate-400"/>
                 Please <Link href="/login" className="text-blue-600 hover:underline font-medium">Login</Link> or{' '}
                 <Link href="/register" className="text-blue-600 hover:underline font-medium">Register</Link>{' '}
                 to view your bookmarks.
             </div>
        );
    }

    return (
        <div className="space-y-6">
            {isError && (
                <div className="text-red-500 bg-red-100 p-3 rounded border border-red-400 mb-4">
                    Error loading bookmarks: {error instanceof Error ? error.message : 'Unknown error'}
                </div>
            )}

            {totalBookmarks === 0 && !isFetching ? (
                <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                    <BookmarkX className="mx-auto h-12 w-12 text-slate-400 mb-2"/>
                    You haven&apos;t added any bookmarks yet. Bookmarks you add while playing tracks will appear here.
                </div>
            ) : (
                // Pass the seek AND play handler to the list
                <BookmarkList
                    bookmarks={bookmarks}
                    // Correct the onSeek prop name if BookmarkList expects something different
                    onSeek={(timeSec) => {
                        // Find the corresponding bookmark to get the trackId
                        const bm = bookmarks.find(b => b.timestampMs / 1000 === timeSec); // Approximation needed? Or pass ID too?
                        if (bm) {
                            handleSeekAndPlay(bm.trackId, timeSec);
                        } else {
                             console.warn("Could not find trackId for bookmark seek time:", timeSec);
                             playerSeek(timeSec); // Fallback to just seeking
                        }
                    }}
                    isLoading={isFetching} // Show subtle loading within list on refetch
                    // trackId is not needed here as we invalidate the whole user list
                />
            )}

            {totalBookmarks > 0 && !isLoading && (
                <PaginationControls
                    totalItems={totalBookmarks}
                    currentPage={currentPage}
                    itemsPerPage={limit}
                />
            )}
        </div>
    );
}

// Main export using Suspense for searchParams
export default function BookmarksPage() {
  return (
      <div className="container mx-auto py-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">My Bookmarks</h1>
          <Suspense fallback={<div className="flex justify-center items-center p-10"><Loader className="h-8 w-8 animate-spin text-blue-500" /></div>}>
              <BookmarksPageContent />
          </Suspense>
      </div>
  );
}