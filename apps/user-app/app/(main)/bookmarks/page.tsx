// apps/user-app/app/(main)/bookmarks/page.tsx
'use client'; // Needs hooks

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/../_hooks/useAuth'; // Adjust path alias
import { useBookmarks } from '@/../_hooks/useBookmarks'; // Adjust path alias
import { BookmarkList } from '@/../_components/activity/BookmarkList'; // Adjust path alias
import { PaginationControls } from '@/../_components/ui/PaginationControls'; // Adjust path alias
import { usePlayerStore } from '@/../_stores/playerStore'; // To get seek action
import { Loader } from 'lucide-react';
import { DefaultLimit } from '@/../pkg/pagination/pagination'; // Import pagination constants if needed


export default function BookmarksPage() {
  const { user, isAuthenticated, isLoading: isLoadingAuth } = useAuth();
  const searchParams = useSearchParams();

  // --- Pagination State ---
  // Read pagination state from URL search params
  const currentPage = parseInt(searchParams.get('page') ?? '1', 10); // Use page for easier control state
  const limit = parseInt(searchParams.get('limit') ?? String(DefaultLimit) , 10); // Use default limit

  // Calculate offset for the query hook based on current page and limit
  const offset = useMemo(() => (currentPage - 1) * limit, [currentPage, limit]);

  // --- Data Fetching State ---
  const bookmarkParams = useMemo(() => ({ limit, offset }), [limit, offset]);
  const {
    data: queryResponse, // This is PaginatedResponseDTO<BookmarkResponseDTO>
    isLoading: isLoadingBookmarks,
    isFetching, // Useful for showing loading indicator during background refetches
    isError,
    error,
  } = useBookmarks(user?.id, bookmarkParams); // Pass current user ID and pagination params

  // --- Player Action ---
  const playerSeek = usePlayerStore((state) => state.seek);

  // --- Render Logic ---
  const isLoading = isLoadingAuth || isLoadingBookmarks; // Combine loading states

  const bookmarks = queryResponse?.data ?? [];
  const totalBookmarks = queryResponse?.total ?? 0;


  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Bookmarks</h1>

      {!isAuthenticated && !isLoadingAuth && (
        <p className="text-center text-gray-500">Please login to view your bookmarks.</p>
      )}

      {isAuthenticated && (
        <>
          {isError && (
            <div className="text-red-500 bg-red-100 p-3 rounded border border-red-400 mb-4">
              Error loading bookmarks: {error?.message}
            </div>
          )}

          {/* Pass loading state to BookmarkList */}
          <BookmarkList
            bookmarks={bookmarks}
            onSeek={playerSeek}
            isLoading={isLoading || isFetching} // Show loading indicator while fetching/refetching
          />

          {totalBookmarks > 0 && !isLoading && (
             <PaginationControls
                totalItems={totalBookmarks}
                currentPage={currentPage}
                itemsPerPage={limit}
                // The component uses router.push based on page number calculation
             />
           )}
        </>
      )}

      {/* Centered loader for initial load */}
       {isLoading && !isError && (
         <div className="flex justify-center items-center p-10">
            <Loader className="h-8 w-8 animate-spin text-blue-500" />
        </div>
       )}
    </div>
  );
}