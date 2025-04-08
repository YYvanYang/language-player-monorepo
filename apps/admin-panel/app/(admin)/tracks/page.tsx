// apps/admin-panel/app/(admin)/tracks/page.tsx
'use client';

import React, { useState, useMemo, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { DataTable } from '@/../_components/admin/DataTable'; // Adjust path
import { useAdminTracks } from '@/../_hooks/useAdminTracks'; // Adjust path
import { type AdminListTracksParams } from '@/../_services/adminTrackService'; // Adjust path
import { type ColumnDef, type SortingState, type PaginationState, type ColumnFiltersState } from '@tanstack/react-table';
import type { AudioTrackResponseDTO } from '@repo/types';
import { Button } from '@repo/ui';
import { Pencil, Trash2, Plus, Loader } from 'lucide-react';
import { formatDuration } from '@repo/utils';
import { deleteTrackAction } from '@/../_actions/adminTrackActions'; // Adjust path
import { useQueryClient } from '@tanstack/react-query';

// --- Delete Confirmation Component (Example) ---
function DeleteTrackButton({ trackId, trackTitle, onSuccess }: { trackId: string, trackTitle: string, onSuccess: () => void }) {
    const [isDeleting, startDeleteTransition] = useTransition();

    const handleDelete = () => {
        if (!window.confirm(`Are you sure you want to delete track "${trackTitle}" (${trackId})? This action cannot be undone.`)) {
            return;
        }
        startDeleteTransition(async () => {
            const result = await deleteTrackAction(trackId);
            if (result.success) {
                console.log(`Track ${trackId} deleted successfully.`);
                alert(`Track "${trackTitle}" deleted.`); // Replace with toast notification
                onSuccess(); // Trigger refetch via cache invalidation
            } else {
                console.error(`Failed to delete track ${trackId}:`, result.message);
                alert(`Error deleting track: ${result.message}`); // Replace with toast notification
            }
        });
    };

    return (
        <Button variant="ghost" size="icon" title="Delete Track" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? <Loader className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-red-600" />}
        </Button>
    );
}


// --- Main Page Component ---
export default function AdminTracksPage() {
    const queryClient = useQueryClient();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]); // Example: client-side filtering state
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 15,
    });

    // Memoize query params based on table state
    const queryParams = useMemo(() => {
        const params: AdminListTracksParams = {
            limit: pagination.pageSize,
            offset: pagination.pageIndex * pagination.pageSize,
        };
        if (sorting.length > 0) {
            params.sortBy = sorting[0].id;
            params.sortDir = sorting[0].desc ? 'desc' : 'asc';
        }
        // Map columnFilters to backend query params if doing server-side filtering
        // Example: If filtering by title column
        // const titleFilter = columnFilters.find(f => f.id === 'title');
        // if(titleFilter && typeof titleFilter.value === 'string') {
        //     params.q = titleFilter.value;
        // }
        return params;
    }, [pagination, sorting/*, columnFilters*/]); // Include columnFilters if server-side

    // Fetch data
    const { data: queryResponse, isLoading, isError, error } = useAdminTracks(queryParams);

    // Memoize data for stability
    const tableData = useMemo(() => queryResponse?.data ?? [], [queryResponse?.data]);
    const totalTracks = useMemo(() => queryResponse?.total ?? 0, [queryResponse?.total]);

    // --- Define Table Columns ---
    const trackColumns = useMemo((): ColumnDef<AudioTrackResponseDTO>[] => [
        { accessorKey: 'title', header: 'Title', enableColumnFilter: true }, // Enable filtering for title
        { accessorKey: 'languageCode', header: 'Language' },
        { accessorKey: 'level', header: 'Level' },
        { accessorKey: 'durationMs', header: 'Duration', cell: ({row}) => formatDuration(row.original.durationMs) },
        { accessorKey: 'isPublic', header: 'Public', cell: ({row}) => (row.original.isPublic ? 'Yes' : 'No') },
        { accessorKey: 'createdAt', header: 'Created At', cell: ({row}) => new Date(row.original.createdAt).toLocaleDateString() },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" asChild title="Edit Track">
                        <Link href={`/tracks/${row.original.id}/edit`}>
                            <Pencil className="h-4 w-4 text-blue-600" />
                        </Link>
                    </Button>
                    <DeleteTrackButton
                         trackId={row.original.id}
                         trackTitle={row.original.title}
                         onSuccess={() => {
                            // Invalidate the query to refetch data after successful delete
                            queryClient.invalidateQueries({ queryKey: ['admin', 'tracks'] });
                         }}
                    />
                </div>
            ),
        },
    ], [queryClient]); // Include queryClient if used in cell renderers (like Delete button)


    useEffect(() => { if (isError) console.error("Error fetching tracks:", error) }, [isError, error]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Audio Tracks</h1>
                 <Button asChild>
                     <Link href="/tracks/new">
                         <Plus className="h-4 w-4 mr-2" /> Add New Track
                     </Link>
                 </Button>
            </div>

             {isError && (
                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                     Error loading tracks: {error?.message}
                 </div>
             )}

            <DataTable
                columns={trackColumns}
                data={tableData}
                totalItems={totalTracks}
                isLoading={isLoading}
                pagination={pagination}
                setPagination={setPagination}
                sorting={sorting}
                setSorting={setSorting}
                // Enable if using client-side filtering with the input example in DataTable
                columnFilters={columnFilters}
                setColumnFilters={setColumnFilters}
                // manualFiltering={false} // Set true if filtering server-side
            />
        </div>
    );
}