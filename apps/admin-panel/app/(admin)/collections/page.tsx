// apps/admin-panel/app/(admin)/collections/page.tsx
'use client';

import React, { useState, useMemo, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { DataTable } from '@/_components/admin/DataTable'; // Adjust path
import { useAdminCollections } from '@/_hooks/useAdminCollections'; // Adjust path
import { type AdminListCollectionsParams } from '@/_services/adminCollectionService'; // Adjust path
import { type ColumnDef, type SortingState, type PaginationState, type ColumnFiltersState } from '@tanstack/react-table';
import type { AudioCollectionResponseDTO } from '@repo/types';
import { Button, Badge } from '@repo/ui'; // Add Badge
import { Pencil, Trash2, Loader } from 'lucide-react'; // Remove Plus
import { deleteCollectionAction } from '@/_actions/adminCollectionActions'; // Adjust path
import { useQueryClient } from '@tanstack/react-query';
import { ResourceActions } from '@/_components/admin/ResourceActions'; // Use ResourceActions

// --- Main Page Component ---
export default function AdminCollectionsPage() {
    const queryClient = useQueryClient();
    const [sorting, setSorting] = useState<SortingState>([]);
    // Client-side filtering example (remove if using server-side)
    // const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 15 });

    // Memoize query params
    const queryParams = useMemo((): AdminListCollectionsParams => {
        const params: AdminListCollectionsParams = {
            limit: pagination.pageSize,
            offset: pagination.pageIndex * pagination.pageSize,
        };
        if (sorting.length > 0) {
            // Ensure the id matches allowed sortBy values
            params.sortBy = sorting[0].id as AdminListCollectionsParams['sortBy'];
            params.sortDir = sorting[0].desc ? 'desc' : 'asc';
        }
        // Add filter params if doing server-side filtering
        // const titleFilter = columnFilters.find(f => f.id === 'title');
        // if(titleFilter) params.q = titleFilter.value as string;
        return params;
    }, [pagination, sorting /*, columnFilters*/]);

    // Fetch data
    const { data: queryResponse, isLoading, isFetching, isError, error } = useAdminCollections(queryParams);

    // Memoize data
    const tableData = useMemo(() => queryResponse?.data ?? [], [queryResponse?.data]);
    const totalCollections = useMemo(() => queryResponse?.total ?? 0, [queryResponse?.total]);

    // Define Table Columns
    const collectionColumns = useMemo((): ColumnDef<AudioCollectionResponseDTO>[] => [
        {
            accessorKey: 'title',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} >
                    Title <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            enableSorting: true,
            // enableColumnFilter: true, // Enable if using client-side filtering
        },
        {
            accessorKey: 'type',
            header: 'Type',
            cell: ({ row }) => <Badge variant={row.original.type === 'COURSE' ? 'default' : 'secondary'} >{row.original.type}</Badge>
        },
        {
            accessorKey: 'ownerId',
            header: 'Owner ID',
             // Consider fetching/displaying owner email if needed and feasible
            cell: ({ row }) => <span className="font-mono text-xs">{row.original.ownerId}</span>
        },
        // { header: 'Track Count', cell: ({row}) => row.original.tracks?.length ?? 0 }, // Depends on API response
        {
            accessorKey: 'createdAt',
            header: ({ column }) => (
                 <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} >
                    Created At <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            enableSorting: true,
            cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
        },
        {
            id: 'actions',
            header: () => <div className="text-right">Actions</div>,
            cell: ({ row }) => (
                 <div className="flex justify-end">
                      <ResourceActions
                          resourceId={row.original.id}
                          resourceName="collection"
                          editPath={`/collections/${row.original.id}/edit`} // Link to admin edit page
                          deleteAction={deleteCollectionAction}
                          onDeleteSuccess={() => {
                              // Invalidate the query to refetch data after successful delete
                              queryClient.invalidateQueries({ queryKey: adminCollectionsQueryKeys.list(queryParams) });
                              // Optionally invalidate detail queries if needed elsewhere
                              queryClient.invalidateQueries({ queryKey: adminCollectionsQueryKeys.detail(row.original.id) });
                          }}
                          // onDeleteError={(msg) => { /* Show toast */ }}
                      />
                 </div>
            ),
        },
    ], [queryClient, queryParams]); // Include queryParams in dependencies if used for invalidation

    useEffect(() => { if (isError) console.error("Error fetching collections:", error) }, [isError, error]);

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Audio Collections</h1>
                 {/* Admins likely don't create collections from scratch this way? */}
                 {/* <Button asChild><Link href="/collections/new"><Plus className="h-4 w-4 mr-2" /> Add New Collection</Link></Button> */}
            </div>

            {isError && ( <div className="text-red-600 bg-red-100 border border-red-300 p-3 rounded mb-4">Error loading collections: {error?.message}</div> )}

            <DataTable
                columns={collectionColumns}
                data={tableData}
                totalItems={totalCollections}
                isLoading={isLoading || isFetching} // Show loading indicator during fetch/refetch
                pagination={pagination}
                setPagination={setPagination}
                sorting={sorting}
                setSorting={setSorting}
                // Pass filter state/setter if using client-side filtering
                // columnFilters={columnFilters}
                // setColumnFilters={setColumnFilters}
            />
        </div>
    );
}