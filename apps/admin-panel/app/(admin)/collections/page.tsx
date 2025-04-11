// apps/admin-panel/app/(admin)/collections/page.tsx
'use client';

import React, { useState, useMemo, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { DataTable } from '@/_components/admin/DataTable'; // Adjust path
import { useAdminCollections } from '@/_hooks/useAdminCollections'; // Adjust path
import { type AdminListCollectionsParams } from '@/_services/adminCollectionService'; // Adjust path
import { type ColumnDef, type SortingState, type PaginationState, type ColumnFiltersState } from '@tanstack/react-table';
import type { AudioCollectionResponseDTO } from '@repo/types';
import { Button } from '@repo/ui';
import { Pencil, Trash2, Plus, Loader } from 'lucide-react';
import { deleteCollectionAction } from '@/_actions/adminCollectionActions'; // Adjust path
import { useQueryClient } from '@tanstack/react-query';

// --- Delete Confirmation Component (Similar to Tracks) ---
function DeleteCollectionButton({ collectionId, collectionTitle, onSuccess }: { collectionId: string, collectionTitle: string, onSuccess: () => void }) {
    const [isDeleting, startDeleteTransition] = useTransition();
    const handleDelete = () => {
        if (!window.confirm(`Are you sure you want to delete collection "${collectionTitle}" (${collectionId})? This will also remove its association with tracks.`)) { return; }
        startDeleteTransition(async () => {
            const result = await deleteCollectionAction(collectionId);
            if (result.success) {
                alert(`Collection "${collectionTitle}" deleted.`);
                onSuccess();
            } else {
                alert(`Error deleting collection: ${result.message}`);
            }
        });
    };
    return ( <Button variant="ghost" size="icon" title="Delete Collection" onClick={handleDelete} disabled={isDeleting}> {isDeleting ? <Loader className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-red-600" />} </Button> );
}

// --- Main Page Component ---
export default function AdminCollectionsPage() {
    const queryClient = useQueryClient();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]); // For client-side filtering example
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 15 });

    // Memoize query params
    const queryParams = useMemo(() => {
        const params: AdminListCollectionsParams = { // Replace 'any' with AdminListCollectionsParams type
            limit: pagination.pageSize,
            offset: pagination.pageIndex * pagination.pageSize,
        };
        if (sorting.length > 0) {
            params.sortBy = sorting[0].id;
            params.sortDir = sorting[0].desc ? 'desc' : 'asc';
        }
        // Add filter params if doing server-side filtering
        return params;
    }, [pagination, sorting/*, columnFilters*/]);

    // Fetch data
    const { data: queryResponse, isLoading, isError, error } = useAdminCollections(queryParams);

    // Memoize data
    const tableData = useMemo(() => queryResponse?.data ?? [], [queryResponse?.data]);
    const totalCollections = useMemo(() => queryResponse?.total ?? 0, [queryResponse?.total]);

    // Define Table Columns
    const collectionColumns = useMemo((): ColumnDef<AudioCollectionResponseDTO>[] => [
        { accessorKey: 'title', header: 'Title', enableColumnFilter: true },
        { accessorKey: 'type', header: 'Type' },
        { accessorKey: 'ownerId', header: 'Owner ID' }, // Maybe fetch owner email? Requires JOIN/modification
        // { header: 'Track Count', cell: ({row}) => row.original.tracks?.length ?? 0 }, // Only works if tracks are included in list response
        { accessorKey: 'createdAt', header: 'Created At', cell: ({row}) => new Date(row.original.createdAt).toLocaleDateString() },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" asChild title="Edit Collection">
                        <Link href={`/collections/${row.original.id}/edit`}>
                            <Pencil className="h-4 w-4 text-blue-600" />
                        </Link>
                    </Button>
                     <DeleteCollectionButton
                         collectionId={row.original.id}
                         collectionTitle={row.original.title}
                         onSuccess={() => {
                            queryClient.invalidateQueries({ queryKey: ['admin', 'collections'] });
                         }}
                    />
                </div>
            ),
        },
    ], [queryClient]);

    useEffect(() => { if (isError) console.error("Error fetching collections:", error) }, [isError, error]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Audio Collections</h1>
                 {/* Admin usually doesn't create collections? Or maybe they do. */}
                 {/* <Button asChild><Link href="/collections/new"><Plus className="h-4 w-4 mr-2" /> Add New Collection</Link></Button> */}
            </div>

            {isError && ( <div className="text-red-600 mb-4">Error loading collections: {error?.message}</div> )}

            <DataTable
                columns={collectionColumns}
                data={tableData}
                totalItems={totalCollections}
                isLoading={isLoading}
                pagination={pagination}
                setPagination={setPagination}
                sorting={sorting}
                setSorting={setSorting}
                columnFilters={columnFilters} // Using client-side filter state
                setColumnFilters={setColumnFilters}
            />
        </div>
    );
}