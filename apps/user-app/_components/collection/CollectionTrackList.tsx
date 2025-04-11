// apps/user-app/_components/collection/CollectionTrackList.tsx
'use client';

import React, { useState, useEffect, useTransition, useMemo } from 'react';
import type { AudioTrackResponseDTO } from '@repo/types';
import { PlayTrackButton } from '@/_components/track/PlayTrackButton'; // Use correct import alias
import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@repo/ui';
import { X, GripVertical, Loader, AlertTriangle, ListRestart } from 'lucide-react';
import { updateCollectionTracksAction } from '@/_actions/collectionActions'; // Use correct import alias
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@repo/utils';
import { useAuth } from '@/_hooks/useAuth'; // Use correct import alias

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  MeasuringStrategy,
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
    isProcessing: boolean; // Is THIS item being removed?
    isSavingOrder: boolean; // Is the overall order being saved?
}

function SortableTrackItem({ track, isOwner, onRemove, isProcessing, isSavingOrder }: SortableTrackItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: track.id, disabled: !isOwner || isProcessing || isSavingOrder }); // Disable during any processing

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition || 'transform 250ms ease',
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : undefined,
        cursor: isOwner ? (isDragging ? 'grabbing' : 'grab') : 'default',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "flex items-center justify-between p-2 border rounded bg-white dark:bg-slate-900 dark:border-slate-700 shadow-sm mb-2 transition-shadow",
                isDragging && "shadow-lg ring-2 ring-blue-500",
                (isProcessing || isSavingOrder) && "opacity-50 pointer-events-none animate-pulse"
            )}
            {...attributes} // Attributes for accessibility
        >
            <div className="flex items-center gap-2 md:gap-3 flex-grow min-w-0">
                {isOwner && (
                    <button
                        {...listeners} // Listeners only on the handle
                        aria-label={`Drag to reorder ${track.title}`}
                        title="Drag to reorder"
                        className="cursor-grab touch-none p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-400 rounded disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isProcessing || isSavingOrder}
                    >
                        <GripVertical className="h-5 w-5" />
                    </button>
                )}
                {/* Add padding if not owner to align with handle space */}
                {!isOwner && <div className="w-7 h-7 flex-shrink-0"></div>}
                <div className="truncate flex-grow">
                    <p className="text-sm font-medium truncate">{track.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {track.languageCode} {track.level && `(${track.level})`}
                    </p>
                </div>
            </div>
            <div className="flex items-center flex-shrink-0 gap-1 ml-2">
                <PlayTrackButton trackId={track.id} trackTitle={track.title} />
                {isOwner && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20 w-7 h-7"
                                onClick={() => onRemove(track.id)}
                                disabled={isProcessing || isSavingOrder}
                                aria-label={`Remove ${track.title}`}
                            >
                                {isProcessing ? <Loader className="h-4 w-4 animate-spin"/> : <X className="h-4 w-4" />}
                            </Button>
                        </TooltipTrigger>
                         <TooltipContent side="top"><p>Remove from Collection</p></TooltipContent>
                    </Tooltip>
                )}
            </div>
        </div>
    );
}

// --- Main List Component ---
export function CollectionTrackList({ initialTracks, collectionId, isOwner }: CollectionTrackListProps) {
    const { user } = useAuth();
    const [tracks, setTracks] = useState(initialTracks);
    const [isSaving, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [processingTrackId, setProcessingTrackId] = useState<string | null>(null);
    const queryClient = useQueryClient();

    // Memoize track IDs for SortableContext
    const trackIds = useMemo(() => tracks.map(t => t.id), [tracks]);

    // Sync local state if initialTracks prop changes externally
    useEffect(() => {
        // Only update if the incoming list is different from the current list order
        const initialIds = initialTracks.map(t => t.id).join(',');
        const currentIds = tracks.map(t => t.id).join(',');
        if (initialIds !== currentIds) {
            setTracks(initialTracks);
        }
    }, [initialTracks]); // Intentionally exclude 'tracks'

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const saveTrackOrder = useCallback((newOrderedTracks: AudioTrackResponseDTO[]) => {
        if (!isOwner) return;
        const orderedIds = newOrderedTracks.map(t => t.id);
        setError(null);
        startTransition(async () => {
            const result = await updateCollectionTracksAction(collectionId, { orderedTrackIds: orderedIds });
            setProcessingTrackId(null); // Clear specific track processing state after save attempt
            if (!result.success) {
                console.error("Failed to update track order:", result.message);
                setError(result.message || "Failed to save changes.");
                setTracks(initialTracks); // Revert optimistic update on error
            } else {
                console.log("Track order saved successfully.");
                // Invalidate query after successful save
                const userId = user?.id;
                // Invalidate collection detail to get updated track list/order
                 queryClient.invalidateQueries({ queryKey: ['collection', collectionId] });
                 // Optionally invalidate user's collection list if order affects display there
                 if (userId) {
                    queryClient.invalidateQueries({ queryKey: ['collections', userId] });
                 }
            }
        });
    }, [collectionId, initialTracks, isOwner, queryClient, user?.id]);

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        setTracks((currentTracks) => {
            const oldIndex = currentTracks.findIndex((t) => t.id === active.id);
            const newIndex = currentTracks.findIndex((t) => t.id === over.id);
            if (oldIndex === -1 || newIndex === -1) return currentTracks;
            const reorderedTracks = arrayMove(currentTracks, oldIndex, newIndex);
            saveTrackOrder(reorderedTracks); // Save new order async
            return reorderedTracks; // Optimistic update
        });
    }

    const handleRemoveTrack = useCallback((trackIdToRemove: string) => {
        if (isSaving) return;
        const trackToRemove = tracks.find(t => t.id === trackIdToRemove);
         if (!window.confirm(`Remove "${trackToRemove?.title ?? 'this track'}" from the collection?`)) return;

        const filteredTracks = tracks.filter(track => track.id !== trackIdToRemove);
        setProcessingTrackId(trackIdToRemove); // Indicate which track is being processed
        setTracks(filteredTracks); // Optimistic UI Update
        saveTrackOrder(filteredTracks); // Save new order (without the track)
    }, [tracks, isSaving, saveTrackOrder]);

    const handleRevertChanges = useCallback(() => {
        if (isSaving) return;
        if (window.confirm("Discard local changes and revert to the last saved order?")) {
            setError(null);
            setTracks(initialTracks);
        }
    }, [initialTracks, isSaving]);

    const hasLocalChanges = useMemo(() => {
        return JSON.stringify(initialTracks.map(t => t.id)) !== JSON.stringify(tracks.map(t => t.id));
    }, [initialTracks, tracks]);


    if (!tracks) return <div className="p-4 text-center text-slate-500">Loading tracks...</div>;
    if (tracks.length === 0 && initialTracks.length === 0) return <p className="text-center text-slate-500 dark:text-slate-400 py-4">No tracks in this collection yet.</p>;

    return (
        <div className="space-y-3">
            {error && (
                <div className="p-3 border border-red-400 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md flex items-center justify-between">
                    <span className="flex items-center"><AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0"/> {error}</span>
                    <Button variant="ghost" size="sm" onClick={() => setError(null)} className="text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800/50"><IconX size={16}/></Button>
                </div>
            )}
             {isOwner && hasLocalChanges && !isSaving && !error && (
                 <div className="p-2 border border-blue-300 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md flex items-center justify-between text-sm">
                    <span>You have unsaved changes in the track order.</span>
                    <Button onClick={handleRevertChanges} variant="ghost" size="sm" className="text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/50">
                        <ListRestart size={14} className="mr-1"/> Revert
                    </Button>
                </div>
             )}

            <TooltipProvider delayDuration={300}>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
                >
                    <SortableContext items={trackIds} strategy={verticalListSortingStrategy} disabled={!isOwner || isSaving}>
                        {tracks.map((track) => (
                            <SortableTrackItem
                                key={track.id}
                                track={track}
                                isOwner={isOwner}
                                onRemove={handleRemoveTrack}
                                isProcessing={processingTrackId === track.id} // Specific track being removed
                                isSavingOrder={isSaving && processingTrackId !== track.id} // Overall save in progress
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </TooltipProvider>

             {isSaving && !processingTrackId && ( // Show generic saving indicator only if not processing a specific track removal
                <div className="flex items-center justify-center text-sm text-slate-500 dark:text-slate-400 mt-2">
                    <Loader className="h-4 w-4 animate-spin mr-2" /> Saving changes...
                </div>
             )}
        </div>
    );
}