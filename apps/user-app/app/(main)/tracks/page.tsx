// apps/user-app/app/(main)/tracks/page.tsx
'use client'; // Make it a client component for filters/pagination hooks

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { listTracks } from '@/../_services/trackService'; // Adjust alias
import { TrackList } from '@/../_components/track/TrackList'; // Adjust alias
import type { ListTrackQueryParams } from '@repo/types';
import { PaginationControls } from '@/../_components/ui/PaginationControls'; // Adjust alias
import { Input, Select } from '@repo/ui'; // Adjust alias
import { useDebounce } from '@/../_hooks/useDebounce'; // Adjust alias
import { DefaultLimit } from '@/../pkg/pagination/pagination';

// Define keys for react-query
const tracksQueryKeys = {
    list: (params: ListTrackQueryParams) => ['tracks', params] as const,
};

// Separate component to read search params and manage state
function TrackPageContent() {
    const searchParams = useSearchParams();

    // State for Filters
    const [searchTerm, setSearchTerm] = useState(() => searchParams.get('q') || '');
    const [languageFilter, setLanguageFilter] = useState(() => searchParams.get('lang') || '');
    const [levelFilter, setLevelFilter] = useState(() => searchParams.get('level') || '');
    // Add other filter states if needed (isPublic, tags...)

    // State for Sorting
    const [sortBy, setSortBy] = useState(() => searchParams.get('sortBy') || 'createdAt');
    const [sortDir, setSortDir] = useState(() => searchParams.get('sortDir') || 'desc');

    // State for Pagination (driven by URL params via PaginationControls)
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || String(DefaultLimit), 10);
    const offset = useMemo(() => (currentPage - 1) * limit, [currentPage, limit]);

    // Debounce search term
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // Build query params for the API call
    const queryParams: ListTrackQueryParams = useMemo(() => ({
        limit,
        offset,
        q: debouncedSearchTerm || undefined,
        lang: languageFilter || undefined,
        level: levelFilter || undefined,
        sortBy: sortBy as ListTrackQueryParams['sortBy'],
        sortDir: sortDir as ListTrackQueryParams['sortDir'],
    }), [limit, offset, debouncedSearchTerm, languageFilter, levelFilter, sortBy, sortDir]);

    // Fetch data using TanStack Query
    const { data: queryResponse, isLoading, isFetching, isError, error } = useQuery({
        queryKey: tracksQueryKeys.list(queryParams), // Use query key factory
        queryFn: () => listTracks(queryParams),
        placeholderData: (prev) => prev, // Keep previous data while loading
        staleTime: 1 * 60 * 1000, // 1 minute
    });

    const tracks = queryResponse?.data ?? [];
    const totalTracks = queryResponse?.total ?? 0;

    // TODO: Implement handlers for filter/sort changes that update the state
    // These handlers would likely use router.push to update URL search params,
    // which would then trigger a refetch via the change in queryParams.

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Explore Tracks</h1>

            {/* Filter/Sort Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 border rounded-md bg-slate-50 dark:bg-slate-800">
                <Input
                    placeholder="Search title/desc..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Input
                    placeholder="Language (e.g., en-US)"
                    value={languageFilter}
                    onChange={(e) => setLanguageFilter(e.target.value)}
                />
                 <Select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
                    <option value="">Any Level</option>
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                    <option value="C1">C1</option>
                    <option value="C2">C2</option>
                    <option value="NATIVE">Native</option>
                 </Select>
                {/* TODO: Add Sort Selectors */}
            </div>

            {isError && (
                <div className="text-red-500 bg-red-100 p-3 rounded border border-red-400 mb-4">
                     Error loading tracks: {error instanceof Error ? error.message : 'Unknown error'}
                </div>
            )}

            {/* Pass isLoading OR isFetching to TrackList for loading indicators */}
            <TrackList tracks={tracks} isLoading={isLoading || isFetching} />

            {totalTracks > 0 && !isLoading && (
                <PaginationControls
                    totalItems={totalTracks}
                    itemsPerPage={limit}
                    currentPage={currentPage}
                />
            )}
        </div>
    );
}

// Wrap with Suspense for useSearchParams
export default function TracksPageWrapper() {
    return (
        <Suspense fallback={<div>Loading page...</div>}>
            <TrackPageContent />
        </Suspense>
    );
}