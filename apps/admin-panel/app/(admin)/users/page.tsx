// apps/admin-panel/app/(admin)/users/page.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { DataTable } from '@/_components/admin/DataTable';
import { useAdminUsers } from '@/_hooks/useAdminUsers';
import { type AdminListUsersParams } from '@/_services/adminUserService';
import { type ColumnDef, type SortingState, type PaginationState, type ColumnFiltersState } from '@tanstack/react-table';
import type { UserResponseDTO } from '@repo/types';
import { ResourceActions } from '@/_components/admin/ResourceActions';
import { deleteUserAction } from '@/_actions/adminUserActions';
import { Badge, Button } from '@repo/ui'; // Use shared UI
import { useQueryClient } from '@tanstack/react-query';
import { ArrowUpDown, UserPlus } from 'lucide-react'; // Add UserPlus for Add button
import Link from 'next/link'; // Import Link

export default function AdminUsersPage() {
    const queryClient = useQueryClient();
    const [sorting, setSorting] = useState<SortingState>([{ id: 'createdAt', desc: true }]); // Default sort
    // Client-side filtering example (remove if using server-side)
    // const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 });

    // --- Define Table Columns ---
    // Memoize columns to prevent unnecessary re-renders
    const userColumns = useMemo((): ColumnDef<UserResponseDTO>[] => [
        {
            accessorKey: 'name',
            header: ({ column }) => ( // Make header sortable
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} >
                    Name <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
             enableSorting: true,
        },
        {
            accessorKey: 'email',
            header: ({ column }) => ( // Make header sortable
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} >
                    Email <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
             enableSorting: true,
        },
        {
            accessorKey: 'authProvider',
            header: 'Provider',
            cell: ({ row }) => <Badge variant={row.original.authProvider === 'google' ? 'default' : 'secondary'}>{row.original.authProvider}</Badge>,
             enableSorting: false, // Provider likely not sortable meaningfully
        },
         {
             accessorKey: 'isAdmin', // Assuming UserResponseDTO includes this
             header: 'Admin',
             cell: ({ row }) => (row.original.isAdmin ? <Badge variant="destructive">Yes</Badge> : <Badge variant="outline">No</Badge>),
             enableSorting: true, // Allow sorting by admin status
         },
        {
            accessorKey: 'createdAt',
            header: ({ column }) => ( // Make header sortable
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} >
                    Registered <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            enableSorting: true,
            cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
        },
        {
            id: 'actions',
            header: () => <div className="text-right pr-4">Actions</div>,
            cell: ({ row }) => (
                 <div className="flex justify-end">
                    <ResourceActions
                        resourceId={row.original.id}
                        resourceName="user"
                        editPath={`/users/${row.original.id}/edit`} // Link to admin edit page
                        deleteAction={deleteUserAction}
                        onDeleteSuccess={() => {
                             queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
                             // Also invalidate detail query if necessary
                             queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'detail', row.original.id] });
                         }}
                         // Add onDeleteError for toast notifications if needed
                    />
                 </div>
            ),
        },
    ], [queryClient]); // Dependency for invalidation callback


    // Build query params (adapt if using server-side filtering)
    const queryParams: AdminListUsersParams = useMemo(() => {
         const params: AdminListUsersParams = {
            limit: pagination.pageSize,
            offset: pagination.pageIndex * pagination.pageSize,
        };
        if (sorting.length > 0) {
            // Cast needed as accessorKey might not perfectly match allowed sortBy values
            params.sortBy = sorting[0].id as AdminListUsersParams['sortBy'];
            params.sortDir = sorting[0].desc ? 'desc' : 'asc';
        }
         // Map columnFilters if server-side:
         // const emailFilter = columnFilters.find(f => f.id === 'email');
         // if(emailFilter) params.q = emailFilter.value as string;
        return params;
    }, [pagination, sorting /*, columnFilters*/]);

    const { data: queryResponse, isLoading, isFetching, isError, error } = useAdminUsers(queryParams);

    const tableData = useMemo(() => queryResponse?.data ?? [], [queryResponse?.data]);
    const totalUsers = useMemo(() => queryResponse?.total ?? 0, [queryResponse?.total]);

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                 <h1 className="text-2xl font-bold">Manage Users</h1>
                 {/* Add button to create new user (if applicable) */}
                  {/* <Button asChild>
                     <Link href="/users/new"><UserPlus className="mr-2 h-4 w-4"/> Add User</Link>
                 </Button> */}
            </div>

            {/* TODO: Add Filter components based on DataTable structure */}
            {/* Example: <Input placeholder="Filter emails..." onChange={(e) => table.getColumn('email')?.setFilterValue(e.target.value)} /> */}

            {isError && ( <div className="text-red-600 bg-red-100 border border-red-300 p-3 rounded mb-4">Error loading users: {error?.message}</div> )}

            <DataTable
                columns={userColumns}
                data={tableData}
                totalItems={totalUsers}
                isLoading={isLoading || isFetching} // Show loader during initial load and refetch
                pagination={pagination}
                setPagination={setPagination}
                sorting={sorting}
                setSorting={setSorting} // Pass setter for server-side sorting
                // Pass filter state/setter if using client-side filtering in DataTable
                // columnFilters={columnFilters}
                // setColumnFilters={setColumnFilters}
                // Set manualFiltering to true if filters are handled server-side via queryParams
                // manualFiltering={true}
            />
        </div>
    );
}