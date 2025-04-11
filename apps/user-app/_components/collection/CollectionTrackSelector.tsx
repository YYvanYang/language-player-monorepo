// apps/user-app/_components/collection/CollectionTrackSelector.tsx
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@repo/utils'; // Use shared hook if available, or local one
import { listTracks } from '@/_services/trackService'; // User track service
import type { AudioTrackResponseDTO, ListTrackQueryParams } from '@repo/types';
import { Input, Checkbox, Label, Spinner, Button } from '@repo/ui';
import { X as IconX, Search, ListPlus, Check } from 'lucide-react';
import { cn } from '@repo/utils';

// Query key factory for track search
const trackSearchQueryKeys = {
    search: (term: string) => ['tracks', 'search', term] as const,
};

interface CollectionTrackSelectorProps {
    // IDs of tracks already in the collection (to disable selection)
    existingTrackIds?: string[];
    // Callback when tracks are selected/deselected to be added
    onTracksSelected: (selectedIds: string[]) => void;
    disabled?: boolean; // Disable the whole component
}

export function CollectionTrackSelector({
    existingTrackIds = [],
    onTracksSelected,
    disabled = false
}: CollectionTrackSelectorProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<AudioTrackResponseDTO[]>([]);
    // Store IDs of tracks selected *in this component instance*
    const [newlySelectedIds, setNewlySelectedIds] = useState<Set<string>>(new Set());
    const debouncedSearchTerm = useDebounce(searchTerm, 400);

    const existingIdsSet = useMemo(() => new Set(existingTrackIds), [existingTrackIds]);

    // Fetch search results using TanStack Query
    const { data: searchData, isLoading, isFetching, isError, error } = useQuery({
        queryKey: trackSearchQueryKeys.search(debouncedSearchTerm),
        queryFn: async () => {
            if (!debouncedSearchTerm.trim()) return { data: [], total: 0 }; // Return empty if no search term
            const params: ListTrackQueryParams = { q: debouncedSearchTerm, limit: 20 }; // Limit results
            // Assuming listTracks service function exists and works
            return listTracks(params);
        },
        enabled: !!debouncedSearchTerm.trim(), // Only fetch when search term is present
        placeholderData: (prev) => prev,
        staleTime: 5 * 60 * 1000, // Cache search results for 5 mins
    });

    // Update local results state when query data changes
    useEffect(() => {
        setSearchResults(searchData?.data ?? []);
    }, [searchData]);

    // Handle checkbox change for newly selected tracks
    const handleSelect = useCallback((trackId: string, isSelected: boolean) => {
        setNewlySelectedIds(prev => {
            const newSet = new Set(prev);
            if (isSelected) {
                newSet.add(trackId);
            } else {
                newSet.delete(trackId);
            }
            return newSet;
        });
    }, []);

    // Handle adding selected tracks
    const handleAddSelected = () => {
        onTracksSelected(Array.from(newlySelectedIds));
        // Clear selection and search after adding
        setNewlySelectedIds(new Set());
        setSearchTerm('');
        setSearchResults([]);
    };

    const isSearching = isLoading || isFetching;

    return (
        <div className={cn("space-y-3 border p-3 rounded bg-slate-50 dark:bg-slate-800/50", disabled && "opacity-70 pointer-events-none")}>
            <Label className="text-sm font-medium" htmlFor="track-search-input">Add Tracks to Collection</Label>
            <div className="relative">
                <Input
                    id="track-search-input"
                    type="search"
                    placeholder="Search tracks by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={disabled || isSearching}
                    className="pl-8"
                />
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                 {isSearching && <Spinner size="sm" className="absolute right-2 top-1/2 -translate-y-1/2" />}
            </div>

            {isError && (
                 <p className="text-xs text-red-600">Error searching: {error instanceof Error ? error.message : 'Unknown error'}</p>
             )}

            {/* Search Results List */}
            {searchResults.length > 0 && (
                <div className="max-h-60 overflow-y-auto border rounded bg-white dark:bg-slate-900 p-2 space-y-1 shadow-sm">
                    {searchResults.map(track => {
                         const isAlreadyInCollection = existingIdsSet.has(track.id);
                         const isSelected = newlySelectedIds.has(track.id);
                         const isDisabled = isAlreadyInCollection || disabled;
                         return (
                             <div key={track.id} className={cn("flex items-center space-x-2 p-1 rounded", isDisabled ? "opacity-60" : "hover:bg-slate-100 dark:hover:bg-slate-700/50")}>
                                 <Checkbox
                                    id={`track-select-${track.id}`}
                                    checked={isSelected}
                                    disabled={isDisabled}
                                    onCheckedChange={(checked) => handleSelect(track.id, !!checked)}
                                    aria-label={`Select track ${track.title}`}
                                />
                                <Label
                                    htmlFor={`track-select-${track.id}`}
                                    className={cn("text-sm font-normal flex-grow truncate", isDisabled ? "cursor-not-allowed" : "cursor-pointer")}
                                >
                                    {track.title}
                                    <span className="text-xs text-slate-500 ml-1">({track.languageCode})</span>
                                    {isAlreadyInCollection && <span className="text-xs text-green-600 dark:text-green-400 ml-1 italic">(Already Added)</span>}
                                </Label>
                             </div>
                         );
                    })}
                </div>
            )}
            {!isSearching && debouncedSearchTerm && searchResults.length === 0 && (
                <p className="text-xs text-slate-500 dark:text-slate-400 p-2 text-center italic">
                    No tracks found matching "{debouncedSearchTerm}".
                </p>
            )}

            {/* Add Button */}
            {newlySelectedIds.size > 0 && (
                 <div className="flex justify-end pt-2 border-t dark:border-slate-700/50">
                     <Button type="button" onClick={handleAddSelected} size="sm" disabled={disabled}>
                         <ListPlus size={16} className="mr-1"/> Add {newlySelectedIds.size} Selected Track(s)
                     </Button>
                 </div>
            )}
        </div>
    );
}