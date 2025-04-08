// apps/user-app/_components/activity/BookmarkList.tsx
'use client';

import React, { useTransition } from 'react';
import type { BookmarkResponseDTO } from '@repo/types';
import { formatDuration } from '@repo/utils';
import { Button } from '@repo/ui';
import { X, Loader } from 'lucide-react';
import { deleteBookmarkAction } from '@/../_actions/userActivityActions'; // Adjust alias
import { useQueryClient } from '@tanstack/react-query';

interface BookmarkListProps {
  bookmarks: BookmarkResponseDTO[];
  onSeek: (timeSeconds: number) => void; // Callback to player to seek
  isLoading?: boolean; // Optional loading state from parent/query
  trackId?: string; // Needed for cache invalidation after delete
}

export function BookmarkList({ bookmarks, onSeek, isLoading, trackId }: BookmarkListProps) {
    const [isDeleting, startDeleteTransition] = useTransition();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const handleDelete = (bookmarkId: string) => {
        if (isDeleting) return;
        setDeletingId(bookmarkId);
        startDeleteTransition(async () => {
            const result = await deleteBookmarkAction(bookmarkId);
            if (result.success) {
                 console.log(`Bookmark ${bookmarkId} deleted`);
                // Invalidate queries
                if (trackId) {
                   queryClient.invalidateQueries({ queryKey: ['bookmarks', trackId] });
                }
                 queryClient.invalidateQueries({ queryKey: ['bookmarks', 'user'] });
            } else {
                console.error("Failed to delete bookmark:", result.message);
                // Show error notification
            }
            setDeletingId(null); // Reset deleting state
        });
    };


    if (isLoading) {
        return <div className="text-center p-4"><Loader className="h-5 w-5 animate-spin inline-block"/> Loading bookmarks...</div>;
    }

    if (!bookmarks || bookmarks.length === 0) {
        return <p className="text-sm text-gray-500 px-4 py-2">No bookmarks added yet.</p>;
    }

    return (
        <ul className="space-y-2">
        {bookmarks.map((bm) => (
            <li key={bm.id} className="flex justify-between items-center p-2 border rounded hover:bg-gray-50">
            <button
                onClick={() => onSeek(bm.timestampMs / 1000)} // Seek on click
                className="text-left hover:text-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-300 rounded px-1"
                title={`Jump to ${formatDuration(bm.timestampMs)}`}
            >
                <span className="font-mono text-sm mr-2">{formatDuration(bm.timestampMs)}</span>
                {bm.note && <span className="text-gray-700 text-sm italic"> - {bm.note}</span>}
            </button>
             <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleDelete(bm.id)}
                disabled={isDeleting && deletingId === bm.id}
                aria-label={`Delete bookmark at ${formatDuration(bm.timestampMs)}`}
             >
                {isDeleting && deletingId === bm.id ? <Loader className="h-4 w-4 animate-spin"/> : <X className="h-4 w-4" />}
             </Button>
            </li>
        ))}
        </ul>
    );
}