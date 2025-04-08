// apps/user-app/_components/collection/CollectionTrackList.tsx
'use client';

import React, { useState, useTransition } from 'react';
import type { AudioTrackResponseDTO } from '@repo/types';
import { PlayTrackButton } from '@/../_components/track/PlayTrackButton'; // Adjust alias
import { Button } from '@repo/ui'; // Adjust alias
import { X, GripVertical, Loader } from 'lucide-react';
import {
    updateCollectionTracksAction
} from '@/../_actions/collectionActions'; // Adjust alias
import { useQueryClient } from '@tanstack/react-query'; // For invalidation
import { cn } from '@repo/utils'; // Adjust alias

// --- Drag-and-Drop Setup (Conceptual using dnd-kit) ---
// Install: pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities --filter user-app
// Uncomment imports and code blocks below if implementing dnd-kit
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragEndEvent,
// } from '@dnd-kit/core';
// import {
//   arrayMove,
//   SortableContext,
//   sortableKeyboardCoordinates,
//   useSortable,
//   verticalListSortingStrategy,
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// --- End Drag-and-Drop Setup ---

interface CollectionTrackListProps {
    initialTracks: AudioTrackResponseDTO[];
    collectionId: string;
    isOwner: boolean; // Control whether edit controls (remove/reorder) are shown
}

// --- Sortable Item Component (for Drag-and-Drop) ---
interface SortableTrackItemProps {
    track: AudioTrackResponseDTO;
    isOwner: boolean;
    onRemove: (trackId: string) => void;
    isDeleting: boolean;
}

function SortableTrackItem({ track, isOwner, onRemove, isDeleting }: SortableTrackItemProps) {
    // --- dnd-kit Hook (Uncomment if implementing) ---
    // const {
    //     attributes,
    //     listeners,
    //     setNodeRef,
    //     transform,
    //     transition,
    //     isDragging, // Can use this for styling while dragging
    // } = useSortable({ id: track.id });

    // const style = {
    //     transform: CSS.Transform.toString(transform),
    //     transition,
    //     opacity: isDragging ? 0.5 : 1, // Example dragging style
    //     zIndex: isDragging ? 10 : undefined,
    //     cursor: isOwner ? 'grab' : 'default',
    // };
    // --- End dnd-kit Hook ---

    // --- Render Logic (using style and attributes/listeners from dnd-kit if active) ---
    return (
        <div
            // ref={setNodeRef} // dnd-kit: Assign ref
            // style={style} // dnd-kit: Apply transform/transition styles
            className="flex items-center justify-between p-2 border rounded bg-white shadow-sm mb-2"
        >
            <div className="flex items-center gap-3 flex-grow min-w-0">
                 {isOwner && (
                    <button
                        // {...attributes} // dnd-kit: Spread attributes
                        // {...listeners} // dnd-kit: Spread listeners for drag handle
                        aria-label={`Drag to reorder ${track.title}`}
                        title="Drag to reorder"
                        className="cursor-grab touch-none p-1 text-gray-400 hover:text-gray-700"
                    >
                        <GripVertical className="h-5 w-5" />
                    </button>
                 )}
                <div className="truncate flex-grow">
                    <p className="text-sm font-medium truncate">{track.title}</p>
                    <p className="text-xs text-gray-500 truncate">{track.languageCode} {track.level && `(${track.level})`}</p>
                </div>
            </div>
            <div className="flex items-center flex-shrink-0 gap-1 ml-2">
                <PlayTrackButton trackId={track.id} trackTitle={track.title} />
                 {isOwner && (
                     <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 w-8 h-8" // Make slightly smaller
                        onClick={() => onRemove(track.id)}
                        disabled={isDeleting}
                        title={`Remove ${track.title} from collection`}
                        aria-label={`Remove ${track.title}`}
                    >
                         {isDeleting ? <Loader className="h-4 w-4 animate-spin"/> : <X className="h-4 w-4" />}
                    </Button>
                 )}
            </div>
        </div>
    );
}
// --- End Sortable Item Component ---


export function CollectionTrackList({ initialTracks, collectionId, isOwner }: CollectionTrackListProps) {
    const [tracks, setTracks] = useState(initialTracks); // Local state for optimistic updates/reordering
    const [isPending, startTransition] = useTransition();
    const [deletingTrackId, setDeletingTrackId] = useState<string | null>(null);
    const queryClient = useQueryClient();

    // Update local state if initialTracks prop changes (e.g., after parent revalidation)
    useEffect(() => {
        setTracks(initialTracks);
    }, [initialTracks]);

    // --- Drag-and-Drop Sensors (Uncomment if implementing) ---
    // const sensors = useSensors(
    //     useSensor(PointerSensor),
    //     useSensor(KeyboardSensor, {
    //         coordinateGetter: sortableKeyboardCoordinates,
    //     })
    // );
    // --- End Drag-and-Drop Sensors ---

    // --- Drag-and-Drop End Handler (Uncomment and implement if implementing) ---
    // function handleDragEnd(event: DragEndEvent) {
    //     const { active, over } = event;
    //     if (over && active.id !== over.id) {
    //         setTracks((currentTracks) => {
    //             const oldIndex = currentTracks.findIndex((t) => t.id === active.id);
    //             const newIndex = currentTracks.findIndex((t) => t.id === over.id);
    //             const reorderedTracks = arrayMove(currentTracks, oldIndex, newIndex);

    //             // Optimistic UI update done via setTracks
    //             // Call server action in background
    //             startTransition(async () => {
    //                 const orderedIds = reorderedTracks.map(t => t.id);
    //                 const result = await updateCollectionTracksAction(collectionId, { orderedTrackIds: orderedIds });
    //                 if (!result.success) {
    //                     console.error("Failed to save track order:", result.message);
    //                     // Revert optimistic update on failure
    //                     setTracks(currentTracks); // Revert to original order before move
    //                     // Show error notification
    //                 } else {
    //                     // Optional: Invalidate query cache to ensure consistency, though revalidateTag in action helps
    //                     queryClient.invalidateQueries({ queryKey: ['collection', collectionId] });
    //                 }
    //             });

    //             return reorderedTracks; // Return reordered list for immediate UI update
    //         });
    //     }
    // }
    // --- End Drag-and-Drop End Handler ---

    // --- Remove Handler ---
    const handleRemoveTrack = (trackIdToRemove: string) => {
        if (isPending) return; // Prevent multiple actions

        const currentTracks = tracks; // Keep current state for potential revert
        const filteredTracks = tracks.filter(track => track.id !== trackIdToRemove);
        const orderedIds = filteredTracks.map(t => t.id);

        // Optimistic UI Update
        setTracks(filteredTracks);
        setDeletingTrackId(trackIdToRemove); // Show loader on the specific item being removed

        startTransition(async () => {
             const result = await updateCollectionTracksAction(collectionId, { orderedTrackIds: orderedIds });
             if (!result.success) {
                 console.error("Failed to remove track:", result.message);
                 // Revert optimistic update
                 setTracks(currentTracks);
                 // Show error notification
             } else {
                 // Optional: Invalidate query cache
                 queryClient.invalidateQueries({ queryKey: ['collection', collectionId] });
             }
             setDeletingTrackId(null); // Stop showing loader
        });
    };
    // --- End Remove Handler ---


    if (!tracks || tracks.length === 0) {
        return <p className="text-center text-gray-500 py-4">No tracks in this collection yet.</p>;
    }

    // --- Render Logic ---
    return (
        <div>
            {/* --- dnd-kit Context (Uncomment if implementing) --- */}
            {/* <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={tracks.map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                > */}
                    {/* Map over tracks */}
                    {tracks.map((track) => (
                         // Use SortableTrackItem component here
                         <SortableTrackItem
                            key={track.id}
                            track={track}
                            isOwner={isOwner}
                            onRemove={handleRemoveTrack}
                            isDeleting={isPending && deletingTrackId === track.id}
                        />
                         // Replace above with below if NOT using drag-and-drop initially:
                        // <TrackItem key={track.id} track={track} isOwner={isOwner} onRemove={handleRemoveTrack} isDeleting={isPending && deletingTrackId === track.id} />
                    ))}
                 {/* </SortableContext>
            </DndContext> */}
            {/* --- End dnd-kit Context --- */}
        </div>
    );
}

// Basic TrackItem if not using dnd-kit (Duplicate of SortableTrackItem's render logic without dnd props)
// function TrackItem({ track, isOwner, onRemove, isDeleting }: SortableTrackItemProps) {
//      return (
//         <div className="flex items-center justify-between p-2 border rounded bg-white shadow-sm mb-2">
//            {/* ... Content identical to SortableTrackItem's return ... */}
//         </div>
//     );
// }