// apps/user-app/app/(main)/tracks/page.tsx
'use client'; // Needs client hooks for filters/pagination

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation'; // Use Next.js hooks
import { useQuery } from '@tanstack/react-query';
import { listTracks } from '@/_services/trackService';
import { TrackList } from '@/_components/track/TrackList';
import type { ListTrackQueryParams, AudioLevel } from '@repo/types';
import { PaginationControls } from '@/_components/ui/PaginationControls';
import { Input, Select } from '@repo/ui';
import { useDebounce } from '@repo/utils';
import { DefaultLimit, MaxLimit } from '@repo/utils'; // Use shared constants
import { Loader } from 'lucide-react';

// Define keys for react-query
const tracksQueryKeys = {
    list: (params: ListTrackQueryParams) => ['tracks', params] as const,
};

// Separate component to read search params and manage state/fetching
function TrackPageContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // --- State Management ---
    // Read initial state FROM URL search params
    const [searchTerm, setSearchTerm] = useState(() => searchParams.get('q') || '');
    const [languageFilter, setLanguageFilter] = useState(() => searchParams.get('lang') || '');
    const [levelFilter, setLevelFilter] = useState(() => searchParams.get('level') || '');
    // TODO: Add state for other filters like tags if needed

    // Sorting state (example, you might want Select dropdowns for this)
    const [sortBy, setSortBy] = useState<ListTrackQueryParams['sortBy']>(() => (searchParams.get('sortBy') as ListTrackQueryParams['sortBy']) || 'createdAt');
    const [sortDir, setSortDir] = useState<ListTrackQueryParams['sortDir']>(() => (searchParams.get('sortDir') as ListTrackQueryParams['sortDir']) || 'desc');

    // Pagination state (driven by URL params via PaginationControls)
    const currentPage = useMemo(() => parseInt(searchParams.get('page') || '1', 10), [searchParams]);
    const limit = useMemo(() => {
        let l = parseInt(searchParams.get('limit') || String(DefaultLimit), 10);
        if (isNaN(l) || l <= 0) l = DefaultLimit;
        return Math.min(l, MaxLimit);
    }, [searchParams]);
    const offset = useMemo(() => (currentPage - 1) * limit, [currentPage, limit]);

    // Debounce search term for API call efficiency
    const debouncedSearchTerm = useDebounce(searchTerm, 400);

    // Build query params MEMOIZED for the API call based on current state
    const queryParams: ListTrackQueryParams = useMemo(() => ({
        limit,
        offset,
        q: debouncedSearchTerm || undefined,
        lang: languageFilter || undefined,
        level: levelFilter as AudioLevel || undefined, // Cast to type
        sortBy: sortBy,
        sortDir: sortDir,
    }), [limit, offset, debouncedSearchTerm, languageFilter, levelFilter, sortBy, sortDir]);

    // --- Data Fetching ---
    const { data: queryResponse, isLoading, isFetching, isError, error } = useQuery({
        queryKey: tracksQueryKeys.list(queryParams), // Query key includes all params
        queryFn: () => listTracks(queryParams),
        placeholderData: (prev) => prev, // Keep previous data while loading new page/filters
        staleTime: 1 * 60 * 1000, // 1 minute
    });

    const tracks = queryResponse?.data ?? [];
    const totalTracks = queryResponse?.total ?? 0;

    // --- Event Handlers to Update URL Search Params ---
    const updateSearchParams = (newParams: Record<string, string>) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        // Update provided params
        for (const key in newParams) {
            if (newParams[key]) {
                current.set(key, newParams[key]);
            } else {
                current.delete(key); // Remove param if value is empty
            }
        }
        // Reset page to 1 when filters change
        current.set('page', '1');
        // Keep existing limit or set default
        current.set('limit', String(limit));
        current.delete('offset'); // Use page param

        const search = current.toString();
        const query = search ? `?${search}` : "";
        router.push(`${pathname}${query}`); // Navigate, triggering refetch
    };

    // Update URL when debounced search term changes
    useEffect(() => {
        updateSearchParams({ q: debouncedSearchTerm });
    }, [debouncedSearchTerm]); // Only trigger when debounced value changes

    // Update URL immediately for other filters/sorts
    const handleLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLanguageFilter(value);
        updateSearchParams({ lang: value });
    };

    const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setLevelFilter(value);
        updateSearchParams({ level: value });
    };

     const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
         const value = e.target.value;
         const [newSortBy, newSortDir] = value.split('_') as [ListTrackQueryParams['sortBy'], ListTrackQueryParams['sortDir']];
         setSortBy(newSortBy ?? 'createdAt');
         setSortDir(newSortDir ?? 'desc');
         updateSearchParams({ sortBy: newSortBy ?? 'createdAt', sortDir: newSortDir ?? 'desc' });
     };


    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Explore Tracks</h1>

            {/* Filter/Sort Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 border rounded-md bg-slate-50 dark:bg-slate-800 shadow-sm">
                <Input
                    placeholder="Search title/desc..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Update local state, useEffect handles URL update
                    aria-label="Search tracks"
                />
                <Input
                    placeholder="Language (e.g., en)"
                    value={languageFilter}
                    onChange={handleLanguageChange}
                    aria-label="Filter by language"
                />
                 <Select value={levelFilter} onChange={handleLevelChange} aria-label="Filter by level">
                    <option value="">Any Level</option>
                    <option value="A1">A1</option> <option value="A2">A2</option>
                    <option value="B1">B1</option> <option value="B2">B2</option>
                    <option value="C1">C1</option> <option value="C2">C2</option>
                    <option value="NATIVE">Native</option>
                 </Select>
                 <Select value={`${sortBy}_${sortDir}`} onChange={handleSortChange} aria-label="Sort tracks">
                     <option value="createdAt_desc">Newest First</option>
                     <option value="createdAt_asc">Oldest First</option>
                     <option value="title_asc">Title (A-Z)</option>
                     <option value="title_desc">Title (Z-A)</option>
                     <option value="durationMs_asc">Duration (Shortest)</option>
                     <option value="durationMs_desc">Duration (Longest)</option>
                     <option value="level_asc">Level (A1-Native)</option> {/* May need custom sorting logic */}
                 </Select>
            </div>

            {isError && (
                <div className="text-red-500 bg-red-100 p-3 rounded border border-red-400 mb-4">
                     Error loading tracks: {error instanceof Error ? error.message : 'Unknown error'}
                </div>
            )}

            {/* TrackList handles its own loading state based on isLoading prop */}
            <TrackList tracks={tracks} isLoading={isLoading || isFetching} />

            {/* Pagination */}
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

// Wrap with Suspense to allow useSearchParams in the client component
export default function TracksPageWrapper() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center p-10"><Loader className="h-8 w-8 animate-spin text-blue-500"/> Loading...</div>}>
            <TrackPageContent />
        </Suspense>
    );
}