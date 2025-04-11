// apps/user-app/_components/collection/CollectionTrackList.tsx
'use client';

import React, { useState, useEffect, useTransition } from 'react';
import type { AudioTrackResponseDTO } from '@repo/types';
import { PlayTrackButton } from '@/../_components/track/PlayTrackButton';
import { Button } from '@repo/ui';
import { X, GripVertical, Loader, AlertTriangle } from 'lucide-react';
import { updateCollectionTracksAction } from '@/../_actions/collectionActions';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@repo/utils';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CollectionTrackListProps {
    initialTracks: AudioTrackResponseDTO[];
    collectionId: string;
    isOwner: boolean; // Determines if edit controls are shown
}

// --- Sortable Item Component ---
interface SortableTrackItemProps {
    track: AudioTrackResponseDTO;
    isOwner: boolean;
    onRemove: (trackId: string) => void;
    isProcessing: boolean; // General processing state for this item
}

function SortableTrackItem({ track, isOwner, onRemove, isProcessing }: SortableTrackItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: track.id, disabled: !isOwner }); // Disable sorting if not owner

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : undefined,
        cursor: isOwner ? (isDragging ? 'grabbing' : 'grab') : 'default',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "flex items-center justify-between p-2 border rounded bg-white dark:bg-slate-900 dark:border-slate-700 shadow-sm mb-2",
                isDragging && "shadow-lg ring-2 ring-blue-500",
                isProcessing && "opacity-50 pointer-events-none"
            )}
            {...attributes} // Add attributes here for the whole item if handle is not separate
        >
            <div className="flex items-center gap-2 md:gap-3 flex-grow min-w-0">
                {isOwner && (
                    <button
                        {...listeners} // Drag handle listeners
                        aria-label={`Drag to reorder ${track.title}`}
                        title="Drag to reorder"
                        className="cursor-grab touch-none p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-400 rounded"
                        disabled={isProcessing} // Disable while processing
                    >
                        <GripVertical className="h-5 w-5" />
                    </button>
                )}
                <div className="truncate flex-grow">
                    <p className="text-sm font-medium truncate">{track.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{track.languageCode} {track.level && `(${track.level})`}</p>
                </div>
            </div>
            <div className="flex items-center flex-shrink-0 gap-1 ml-2">
                <PlayTrackButton trackId={track.id} trackTitle={track.title} />
                {isOwner && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20 w-7 h-7" // Smaller icon button
                        onClick={() => onRemove(track.id)}
                        disabled={isProcessing}
                        title={`Remove ${track.title} from collection`}
                        aria-label={`Remove ${track.title}`}
                    >
                        {isProcessing ? <Loader className="h-4 w-4 animate-spin"/> : <X className="h-4 w-4" />}
                    </Button>
                )}
            </div>
        </div>
    );
}

// --- Main List Component ---
export function CollectionTrackList({ initialTracks, collectionId, isOwner }: CollectionTrackListProps) {
    const [tracks, setTracks] = useState(initialTracks);
    const [isSaving, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [processingTrackId, setProcessingTrackId] = useState<string | null>(null); // For remove loading state
    const queryClient = useQueryClient();

    // Sync local state if initialTracks prop changes externally
    useEffect(() => {
        setTracks(initialTracks);
    }, [initialTracks]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // --- Server Action Call ---
    const saveTrackOrder = (newOrderedTracks: AudioTrackResponseDTO[]) => {
        if (!isOwner) return; // Should not happen if controls are hidden

        const orderedIds = newOrderedTracks.map(t => t.id);
        setError(null); // Clear previous errors

        startTransition(async () => {
            const result = await updateCollectionTracksAction(collectionId, { orderedTrackIds: orderedIds });
            if (!result.success) {
                console.error("Failed to update track order:", result.message);
                setError(result.message || "Failed to save track order.");
                setTracks(initialTracks); // Revert optimistic update on error
                // Show error toast
            } else {
                console.log("Track order saved successfully.");
                // Invalidate query to ensure consistency, although action revalidates tag
                queryClient.invalidateQueries({ queryKey: ['collection', collectionId] });
                 queryClient.invalidateQueries({ queryKey: ['collectionTracks', collectionId] });
                // Update initialTracks locally to prevent reverting on next prop change?
                // Maybe not needed if parent revalidates correctly via tags.
                // Show success toast?
            }
            setProcessingTrackId(null); // Clear specific processing state if any
        });
    };

    // --- Drag End Handler ---
    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return; // No change or invalid drop

        const oldIndex = tracks.findIndex((t) => t.id === active.id);
        const newIndex = tracks.findIndex((t) => t.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return; // Should not happen

        const reorderedTracks = arrayMove(tracks, oldIndex, newIndex);
        setTracks(reorderedTracks); // Optimistic UI update
        saveTrackOrder(reorderedTracks); // Save new order via server action
    }

    // --- Remove Handler ---
    const handleRemoveTrack = (trackIdToRemove: string) => {
        if (isSaving) return; // Prevent action while already saving

        const trackToRemove = tracks.find(t => t.id === trackIdToRemove);
         if (!window.confirm(`Remove "${trackToRemove?.title ?? 'this track'}" from the collection?`)) {
             return;
         }

        const currentTracks = tracks; // Keep current state for potential revert
        const filteredTracks = tracks.filter(track => track.id !== trackIdToRemove);

        setProcessingTrackId(trackIdToRemove); // Set loading state for the specific item
        setTracks(filteredTracks); // Optimistic UI Update
        saveTrackOrder(filteredTracks); // Save new order (which excludes the track)
    };

    if (!tracks) {
       return <div className="p-4 text-center text-slate-500">Loading tracks...</div> // Handle loading state if needed
    }
    if (tracks.length === 0) {
        return <p className="text-center text-slate-500 dark:text-slate-400 py-4">No tracks in this collection yet.</p>;
    }

    return (
        <div className="space-y-2">
            {error && (
                <div className="mb-4 p-3 border border-red-400 bg-red-100 text-red-700 rounded-md flex items-center justify-between">
                    <span><AlertTriangle className="inline h-4 w-4 mr-2"/> {error}</span>
                    <Button variant="ghost" size="sm" onClick={() => setError(null)}><X size={16}/></Button>
                </div>
            )}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={tracks.map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                    disabled={!isOwner} // Disable context if not owner
                >
                    {tracks.map((track) => (
                        <SortableTrackItem
                            key={track.id}
                            track={track}
                            isOwner={isOwner}
                            onRemove={handleRemoveTrack}
                            isProcessing={isSaving && processingTrackId === track.id} // Pass processing state for specific item
                        />
                    ))}
                </SortableContext>
            </DndContext>
             {isSaving && !processingTrackId && ( // General saving indicator if not removing specific track
                <div className="flex items-center justify-center text-sm text-slate-500 mt-2">
                    <Loader className="h-4 w-4 animate-spin mr-2" /> Saving changes...
                </div>
             )}
        </div>
    );
}