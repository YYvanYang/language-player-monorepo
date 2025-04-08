'use client';

import React from 'react';
// import { useActionState } from 'react'; // TODO: Use when actions are available
// import { updateCollectionTracksAction } from '@/actions/collectionActions'; // TODO: Adjust import path
import { PlayTrackButton } from '@/components/player/PlayTrackButton'; // TODO: Adjust import path
import { AudioTrackResponseDTO } from '@/types'; // TODO: Adjust import path

// TODO: Implement Drag and Drop using dnd-kit or react-beautiful-dnd

interface CollectionTrackListProps {
  collectionId: string;
  tracks: AudioTrackResponseDTO[];
  canEdit: boolean; // To control visibility of edit features like remove/reorder
}

export function CollectionTrackList({ collectionId, tracks, canEdit }: CollectionTrackListProps) {
  // TODO: Replace with useActionState for track updates (reordering, removal)
  // const [state, updateTracksAction, isPending] = useActionState(
  //   updateCollectionTracksAction.bind(null, collectionId),
  //   null
  // );

  const handleRemoveTrack = (trackIdToRemove: string) => {
    if (!canEdit) return;
    const newTrackIds = tracks
      .filter((track) => track.id !== trackIdToRemove)
      .map((track) => track.id);
    console.log('Removing track:', trackIdToRemove, 'New IDs:', newTrackIds);
    // TODO: Call updateTracksAction({ orderedTrackIds: newTrackIds }) when using useActionState
  };

  const handleReorderTracks = (reorderedTracks: AudioTrackResponseDTO[]) => {
     if (!canEdit) return;
     const reorderedTrackIds = reorderedTracks.map(track => track.id);
     console.log('Reordering tracks. New order:', reorderedTrackIds);
     // TODO: Call updateTracksAction({ orderedTrackIds: reorderedTrackIds }) when using useActionState
     // TODO: Integrate with Drag and Drop library's onDragEnd event
  }

  if (!tracks || tracks.length === 0) {
    return <p className="text-gray-500">这个收藏集还没有音轨。</p>;
  }

  return (
    <div className="space-y-2">
      {/* TODO: Wrap this list with DndContext/Droppable if implementing drag and drop */}
      {tracks.map((track, index) => (
        // TODO: Wrap this item with Draggable if implementing drag and drop
        <div key={track.id} className="flex items-center justify-between rounded-md bg-gray-50 p-3 shadow-sm">
          <div className="flex items-center space-x-3">
             {/* TODO: Add Drag Handle if implementing drag and drop and canEdit is true */}
             {canEdit && <span className="cursor-grab text-gray-400">⠿</span>}
             <span className="font-medium">{track.title}</span>
             {track.artist && <span className="text-sm text-gray-600">- {track.artist}</span>}
          </div>
          <div className="flex items-center space-x-2">
            <PlayTrackButton track={track} playlist={tracks} playlistTitle="收藏集" />
            {canEdit && (
              <button
                onClick={() => handleRemoveTrack(track.id)}
                // disabled={isPending} // TODO: Use when using useActionState
                className="text-red-500 hover:text-red-700 disabled:opacity-50"
                aria-label={`从收藏集中移除 ${track.title}`}
              >
                {/* Simple text or use an Icon */}
                移除
              </button>
            )}
          </div>
        </div>
      ))}
       {/* TODO: Display server-side errors from useActionState 'state' related to track updates */}
      {/* {state?.message && <p className="text-sm text-red-600">{state.message}</p>} */}
    </div>
  );
} 