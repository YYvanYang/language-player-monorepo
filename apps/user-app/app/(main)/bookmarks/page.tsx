// apps/user-app/app/(main)/bookmarks/page.tsx
'use client'; // Needs hooks

import React, { useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/_hooks/useAuth';
import { useBookmarks } from '@/_hooks/useBookmarks';
import { BookmarkList } from '@/_components/activity/BookmarkList';
import { PaginationControls } from '@/_components/ui/PaginationControls';
import { usePlayerStore } from '@/_stores/playerStore';
import { Loader, BookmarkX } from 'lucide-react';
import { DefaultLimit } from '@/pkg/pagination/pagination';

// Separate component to handle logic dependent on searchParams
function BookmarksPageContent() {
    const { user, isAuthenticated, isLoading: isLoadingAuth } = useAuth();
    const searchParams = useSearchParams();
    const playerSeek = usePlayerStore((state) => state.seek);

    // --- Pagination State from URL ---
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || String(DefaultLimit), 10);
    const offset = useMemo(() => (currentPage - 1) * limit, [currentPage, limit]);

    // --- Data Fetching ---
    const bookmarkParams = useMemo(() => ({ limit, offset }), [limit, offset]);
    const {
        data: queryResponse,
        isLoading: isLoadingBookmarks,
        isFetching, // Use for refetch indicator
        isError,
        error,
    } = useBookmarks(user?.id, bookmarkParams); // Hook handles 'enabled' based on userId

    // --- Render Logic ---
    const isLoading = isLoadingAuth || (isLoadingBookmarks && !queryResponse); // Show initial loader
    const bookmarks = queryResponse?.data ?? [];
    const totalBookmarks = queryResponse?.total ?? 0;

    if (isLoading) {
        return <div className="flex justify-center items-center p-10"><Loader className="h-8 w-8 animate-spin text-blue-500" /></div>;
    }

    if (!isAuthenticated && !isLoadingAuth) {
        return <p className="text-center text-gray-500">Please <Link href="/login" className="text-blue-600 hover:underline">login</Link> to view your bookmarks.</p>;
    }

    return (
        <>
            {isError && (
                <div className="text-red-500 bg-red-100 p-3 rounded border border-red-400 mb-4">
                    Error loading bookmarks: {error instanceof Error ? error.message : 'Unknown error'}
                </div>
            )}

            {totalBookmarks === 0 && !isFetching ? (
                <div className="text-center py-10 text-slate-500">
                    <BookmarkX className="mx-auto h-12 w-12 text-slate-400 mb-2"/>
                    You haven't added any bookmarks yet.
                </div>
            ) : (
                <BookmarkList
                    bookmarks={bookmarks}
                    onSeek={playerSeek}
                    isLoading={isFetching} // Show subtle loading within list on refetch
                />
            )}

            {totalBookmarks > 0 && !isLoading && (
                <PaginationControls
                    totalItems={totalBookmarks}
                    currentPage={currentPage}
                    itemsPerPage={limit}
                />
            )}
        </>
    );
}

// Main export using Suspense for searchParams
export default function BookmarksPage() {
  return (
      <div>
          <h1 className="text-2xl font-bold mb-6">My Bookmarks</h1>
          <Suspense fallback={<div className="flex justify-center items-center p-10"><Loader className="h-8 w-8 animate-spin text-blue-500" /></div>}>
              <BookmarksPageContent />
          </Suspense>
      </div>
  );
}