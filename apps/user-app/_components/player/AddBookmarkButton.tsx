// apps/user-app/_components/player/AddBookmarkButton.tsx
'use client';

import React, { useState, useTransition } from 'react';
import { usePlayerStore } from '@/../_stores/playerStore'; // Adjust alias
import { createBookmarkAction } from '@/../_actions/userActivityActions'; // Adjust alias
import { Button } from '@repo/ui';
import { BookmarkPlus, Loader } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query'; // To invalidate queries

export function AddBookmarkButton() {
  const { currentTrackDetails, currentTime, playbackState } = usePlayerStore(state => ({
    currentTrackDetails: state.currentTrackDetails,
    currentTime: state.currentTime,
    playbackState: state.playbackState,
  }));
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient(); // Get query client instance

  const canBookmark = currentTrackDetails && currentTime > 0 && playbackState !== 'IDLE'; // Basic condition

  const handleAddBookmark = () => {
    if (!canBookmark) return;

    const timestampMs = Math.floor(currentTime * 1000);
    const trackId = currentTrackDetails!.id; // Assert non-null because canBookmark is true

    startTransition(async () => {
      // TODO: Optionally add input for a 'note' here or pass null/empty
      const result = await createBookmarkAction(trackId, timestampMs, "");
      if (result.success && result.bookmark) {
        console.log('Bookmark created:', result.bookmark);
        // Invalidate relevant bookmark queries using TanStack Query Client
        // The Server Action already called revalidateTag, but client-side invalidation
        // gives more immediate feedback if using RQ cache.
        queryClient.invalidateQueries({ queryKey: ['bookmarks', trackId] });
        queryClient.invalidateQueries({ queryKey: ['bookmarks', 'user'] }); // Invalidate general user list too
        // Optionally show a success toast notification
      } else {
        console.error("Failed to add bookmark:", result.message);
        // Optionally show an error toast notification
      }
    });
  };

  return (
    <Button
      onClick={handleAddBookmark}
      disabled={!canBookmark || isPending}
      variant="ghost"
      size="sm"
      title="Add bookmark at current time"
    >
      {isPending ? <Loader className="h-4 w-4 animate-spin" /> : <BookmarkPlus className="h-4 w-4" />}
      <span className="ml-1">Bookmark</span>
    </Button>
  );
}