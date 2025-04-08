// apps/admin-panel/app/(admin)/users/page.tsx
'use client'; // Need client component for table state and hooks

import React, { useState, useMemo, useEffect } from 'react';
import { DataTable } from '@/../_components/admin/DataTable'; // Adjust path
import { useAdminUsers } from '@/../_hooks/useAdminUsers'; // Adjust path
import { type ColumnDef, type SortingState, type PaginationState, type ColumnFiltersState } from '@tanstack/react-table';
import type { UserResponseDTO } from '@repo/types';
import { Button } from '@repo/ui';
import Link from 'next/link'; // For Actions column
import { Pencil, Trash2 } from 'lucide-react'; // Example action icons

// Define Columns for the User Table
const userColumns: ColumnDef<UserResponseDTO>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'authProvider', header: 'Provider'},
    { accessorKey: 'createdAt', header: 'Registered At', cell: ({row}) => new Date(row.original.createdAt).toLocaleDateString() },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
            <div className="space-x-1">
                {/* TODO: Link to Edit page or trigger Edit Action/Modal */}
                <Button variant="ghost" size="icon" asChild title="Edit User">
                    {/* <Link href={`/users/${row.original.id}/edit`}> */}
                        <Pencil className="h-4 w-4 text-blue-600" />
                    {/* </Link> */}
                </Button>
                 {/* TODO: Implement Delete Action */}
                <Button variant="ghost" size="icon" title="Delete User (Not implemented)">
                    <Trash2 className="h-4 w-4 text-red-600"/>
                </Button>
            </div>
        ),
    },
];


export default function AdminUsersPage() {
    // --- State for Server-Side Operations ---
    const [sorting, setSorting] = useState<SortingState>([]); // Server-side sort state
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]); // Server-side filter state
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0, // TanStack Table uses 0-based index
        pageSize: 15, // Default page size
    });

    // --- Build Query Params from State ---
    // Memoize to prevent re-fetching if only unrelated state changes
    const queryParams = useMemo(() => {
        const params: any = { // Use AdminListUsersParams type here
            limit: pagination.pageSize,
            offset: pagination.pageIndex * pagination.pageSize,
        };
        if (sorting.length > 0) {
            params.sortBy = sorting[0].id;
            params.sortDir = sorting[0].desc ? 'desc' : 'asc';
        }
        // TODO: Map columnFilters state to your specific backend query params (e.g., q, provider)
        // Example: Find filter for 'email' column
        const emailFilter = columnFilters.find(f => f.id === 'email');
        if(emailFilter && typeof emailFilter.value === 'string') {
            params.q = emailFilter.value; // Assuming 'q' searches email
        }
        return params;
    }, [pagination, sorting, columnFilters]);


    // --- Fetch Data using TanStack Query ---
    const { data: queryResponse, isLoading, isError, error } = useAdminUsers(queryParams);

    // --- Memoize Data/Total ---
    // Prevent data flickering during loading states when placeholderData is used
    const tableData = useMemo(() => queryResponse?.data ?? [], [queryResponse?.data]);
    const totalUsers = useMemo(() => queryResponse?.total ?? 0, [queryResponse?.total]);

    // Optional: Log errors
    useEffect(() => {
        if (isError) { console.error("Error fetching users:", error); }
    }, [isError, error]);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
            {/* TODO: Add "Create User" button? */}

             {isError && (
                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                     <strong className="font-bold">Error!</strong>
                     <span className="block sm:inline"> Failed to load users: {error?.message}</span>
                 </div>
             )}

            <DataTable
                columns={userColumns}
                data={tableData}
                totalItems={totalUsers}
                isLoading={isLoading}
                pagination={pagination}
                setPagination={setPagination}
                sorting={sorting}
                setSorting={setSorting} // Enable server-side sorting
                // columnFilters={columnFilters} // Enable client-side filtering (or pass state for server-side)
                // setColumnFilters={setColumnFilters}
            />
        </div>
    );
}