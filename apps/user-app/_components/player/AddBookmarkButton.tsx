// apps/user-app/_components/player/AddBookmarkButton.tsx
'use client';

import React, { useState, useTransition } from 'react';
import { usePlayerStore } from '@/_stores/playerStore';
import { createBookmarkAction } from '@/_actions/userActivityActions';
import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@repo/ui';
import { BookmarkPlus, Loader } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { bookmarksQueryKeys } from '@/_hooks/useBookmarks'; // Import query keys
import { useAuth } from '@/_hooks/useAuth';
import { PlaybackState } from '@/_lib/constants';
import { useAudioClip } from '@repo/utils'; // Import hook
export function AddBookmarkButton() {
  const { user } = useAuth(); // Get user for query keys
  const { currentTrackDetails, currentTime, playbackState } = usePlayerStore(state => ({
    currentTrackDetails: state.currentTrackDetails,
    currentTime: state.currentTime,
    playbackState: state.playbackState,
  }));
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const playClickSound = useAudioClip('/sounds/click.wav', 0.3);
  const playSuccessSound = useAudioClip('/sounds/success.wav', 0.4); // Example
  const playErrorSound = useAudioClip('/sounds/error.wav', 0.4); // Example

  // Can bookmark if a track is loaded, playing/paused/ready/ended, and time > 0
  const canBookmark = currentTrackDetails && currentTime >= 0 &&
                      playbackState !== PlaybackState.IDLE &&
                      playbackState !== PlaybackState.LOADING &&
                      playbackState !== PlaybackState.DECODING &&
                      playbackState !== PlaybackState.ERROR;

  const handleAddBookmark = () => {
    playClickSound(); // Play click sound immediately
    if (!canBookmark || !user?.id) return;

    const timestampMs = Math.floor(currentTime * 1000);
    const trackId = currentTrackDetails!.id; // Assert non-null because canBookmark is true

    startTransition(async () => {
      // TODO: Implement input for a 'note' if desired
      const note = prompt("Add an optional note for this bookmark:"); // Simple prompt, replace with proper UI
      const result = await createBookmarkAction(trackId, timestampMs, note); // Pass note

      if (result.success && result.bookmark) {
        playSuccessSound(); // Play success sound
        console.log('Bookmark created:', result.bookmark);
        // Invalidate relevant bookmark queries
        // Use query keys factory for consistency
        queryClient.invalidateQueries({ queryKey: bookmarksQueryKeys.trackDetail(user.id, trackId) });
        queryClient.invalidateQueries({ queryKey: bookmarksQueryKeys.all(user.id) });
        // TODO: Show success toast
         alert("Bookmark added!");
      } else {
        playErrorSound(); // Play error sound
        console.error("Failed to add bookmark:", result.message);
        // TODO: Show error toast
        alert(`Error adding bookmark: ${result.message || 'Unknown error'}`);
      }
    });
  };

  return (
     <TooltipProvider delayDuration={300}>
         <Tooltip>
             <TooltipTrigger asChild>
                 <Button
                    onClick={handleAddBookmark}
                    disabled={!canBookmark || isPending}
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50"
                 >
                 {isPending ? <Loader className="h-4 w-4 animate-spin" /> : <BookmarkPlus className="h-4 w-4" />}
                 <span className="ml-1 hidden md:inline">Bookmark</span>
                 </Button>
             </TooltipTrigger>
             <TooltipContent side="top">
                 <p>Add bookmark at current time</p>
             </TooltipContent>
         </Tooltip>
     </TooltipProvider>
  );
}