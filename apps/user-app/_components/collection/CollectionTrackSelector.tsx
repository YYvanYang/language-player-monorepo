// apps/user-app/_components/collection/CollectionTrackSelector.tsx (Conceptual)
'use client';

import React, { useState, useEffect } from 'react';
import { useDebounce } from '@/../_hooks/useDebounce'; // Assuming you have this hook
import { listTracks } from '@/../_services/trackService'; // Need service to search tracks
import type { AudioTrackResponseDTO } from '@repo/types';
import { Input, Checkbox, Label, Spinner } from '@repo/ui'; // Assuming Checkbox exists

interface CollectionTrackSelectorProps {
    name: string; // Name for hidden inputs
    disabled?: boolean;
}

export function CollectionTrackSelector({ name, disabled }: CollectionTrackSelectorProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<AudioTrackResponseDTO[]>([]);
    const [selectedTrackIds, setSelectedTrackIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(false);
    const debouncedSearchTerm = useDebounce(searchTerm, 500); // Debounce search input

    useEffect(() => {
        // Fetch tracks when debounced search term changes
        const fetchResults = async () => {
            if (!debouncedSearchTerm) {
                setSearchResults([]);
                return;
            }
            setIsLoading(true);
            try {
                // Fetch with search query, maybe limit results
                const result = await listTracks({ q: debouncedSearchTerm, limit: 15 });
                setSearchResults(result.data);
            } catch (error) {
                console.error("Failed to search tracks:", error);
                setSearchResults([]); // Clear results on error
            } finally {
                setIsLoading(false);
            }
        };
        fetchResults();
    }, [debouncedSearchTerm]);

    const handleSelect = (trackId: string, isSelected: boolean) => {
        setSelectedTrackIds(prev => {
            const newSet = new Set(prev);
            if (isSelected) {
                newSet.add(trackId);
            } else {
                newSet.delete(trackId);
            }
            return newSet;
        });
    };

    return (
        <div className="space-y-2 border p-4 rounded bg-gray-50">
            <Label>Add Initial Tracks (Optional)</Label>
            <Input
                type="search"
                placeholder="Search tracks by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={disabled}
            />

            {/* Hidden inputs for selected track IDs */}
            {Array.from(selectedTrackIds).map(id => (
                <input key={id} type="hidden" name={name} value={id} />
            ))}

            {isLoading && <div className="text-center p-2"><Spinner /> Searching...</div>}

            {!isLoading && searchResults.length > 0 && (
                <div className="max-h-48 overflow-y-auto border rounded bg-white p-2 space-y-1">
                    {searchResults.map(track => (
                        <div key={track.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={`track-select-${track.id}`}
                                checked={selectedTrackIds.has(track.id)}
                                onCheckedChange={(checked) => handleSelect(track.id, !!checked)}
                                disabled={disabled}
                            />
                            <Label htmlFor={`track-select-${track.id}`} className="text-sm font-normal cursor-pointer">
                                {track.title} ({track.languageCode})
                            </Label>
                        </div>
                    ))}
                </div>
            )}
            {!isLoading && debouncedSearchTerm && searchResults.length === 0 && (
                <p className="text-xs text-gray-500 p-2">No tracks found matching "{debouncedSearchTerm}".</p>
            )}
             <p className="text-xs text-gray-500">{selectedTrackIds.size} track(s) selected.</p>
        </div>
    );
}