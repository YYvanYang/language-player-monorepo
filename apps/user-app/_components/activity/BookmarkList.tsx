// apps/user-app/_components/activity/BookmarkList.tsx
'use client';

import React, { useState, useTransition } from 'react';
import type { BookmarkResponseDTO } from '@repo/types';
import { formatDuration, cn } from '@repo/utils'; // Import cn
import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@repo/ui'; // Add Tooltip
import { X, Loader, Bookmark } from 'lucide-react';
import { deleteBookmarkAction } from '@/_actions/userActivityActions'; // Adjust alias
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/_hooks/useAuth'; // Need user ID for invalidation
import { bookmarksQueryKeys } from '@/_hooks/useBookmarks'; // Import query keys

interface BookmarkListProps {
  bookmarks: BookmarkResponseDTO[];
  onSeek: (timeSeconds: number) => void;
  isLoading?: boolean;
  trackId?: string; // Track ID IS needed for specific cache invalidation on delete
}

export function BookmarkList({ bookmarks, onSeek, isLoading, trackId }: BookmarkListProps) {
    const { user } = useAuth();
    const [isDeleting, startDeleteTransition] = useTransition();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const handleDelete = (bookmarkId: string, bookmarkNote?: string | null) => {
        if (isDeleting) return;
        // Find the bookmark to get the timestamp for the confirmation message
        const bookmarkToDelete = bookmarks.find(b => b.id === bookmarkId);
        if (!bookmarkToDelete) return; // Should not happen

        if (!window.confirm(`Delete bookmark${bookmarkNote ? ` "${bookmarkNote}"` : ''} at ${formatDuration(bookmarkToDelete.timestampMs)}?`)) {
            return;
        }

        setDeletingId(bookmarkId);
        startDeleteTransition(async () => {
            const result = await deleteBookmarkAction(bookmarkId);
            if (result.success) {
                console.log(`Bookmark ${bookmarkId} deleted`);
                // Invalidate relevant queries using the keys factory
                const userId = user?.id;
                if (userId) {
                    // Invalidate the user's overall bookmark list
                    queryClient.invalidateQueries({ queryKey: bookmarksQueryKeys.all(userId) });
                    // If trackId is available, invalidate the specific track's bookmark query
                    if (trackId) {
                        queryClient.invalidateQueries({ queryKey: bookmarksQueryKeys.trackDetail(userId, trackId) });
                    }
                }
                // Optionally show success toast
            } else {
                console.error("Failed to delete bookmark:", result.message);
                alert(`Error deleting bookmark: ${result.message || 'Unknown error'}`); // Simple feedback
            }
            setDeletingId(null);
        });
    };

    if (isLoading) {
        return <div className="text-center p-4"><Loader className="h-5 w-5 animate-spin inline-block text-slate-400"/> Loading bookmarks...</div>;
    }

    if (!bookmarks || bookmarks.length === 0) {
        return <p className="text-sm text-slate-500 dark:text-slate-400 px-4 py-2 text-center italic">No bookmarks added for this track yet.</p>;
    }

    return (
        <TooltipProvider delayDuration={300}>
            <ul className="space-y-1">
                {bookmarks.map((bm) => {
                     const isCurrentlyDeleting = isDeleting && deletingId === bm.id;
                     return (
                        <li
                            key={bm.id}
                            className={cn(
                                "flex justify-between items-center p-2 border rounded hover:bg-slate-50 dark:hover:bg-slate-800 dark:border-slate-700",
                                isCurrentlyDeleting && "opacity-50 pointer-events-none" // Style while deleting
                            )}
                        >
                            {/* Seek Button/Area */}
                             <button
                                onClick={() => onSeek(bm.timestampMs / 1000)}
                                className="flex-grow text-left hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-300 rounded px-1 truncate disabled:hover:text-inherit"
                                title={`Jump to ${formatDuration(bm.timestampMs)}`}
                                disabled={isCurrentlyDeleting}
                            >
                                <span className="font-mono text-sm mr-2 tabular-nums text-blue-700 dark:text-blue-300 w-[55px] inline-block">{formatDuration(bm.timestampMs)}</span>
                                {bm.note ? (
                                     <span className="text-slate-700 dark:text-slate-300 text-sm italic"> - {bm.note}</span>
                                ) : (
                                     <span className="text-slate-400 dark:text-slate-500 text-sm italic"> (No note)</span>
                                )}
                            </button>

                             {/* Delete Button */}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                     <Button
                                        variant="ghost"
                                        size="icon" // Make it an icon button
                                        className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20 p-1 h-7 w-7 flex-shrink-0" // Adjust size/padding
                                        onClick={() => handleDelete(bm.id, bm.note)}
                                        disabled={isCurrentlyDeleting}
                                        aria-label={`Delete bookmark at ${formatDuration(bm.timestampMs)}`}
                                    >
                                        {isCurrentlyDeleting ? <Loader className="h-4 w-4 animate-spin"/> : <X className="h-4 w-4" />}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                    <p>Delete Bookmark</p>
                                </TooltipContent>
                            </Tooltip>
                        </li>
                     );
                 })}
            </ul>
        </TooltipProvider>
    );
}