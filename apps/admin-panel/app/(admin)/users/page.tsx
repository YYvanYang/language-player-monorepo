// apps/admin-panel/app/(admin)/users/page.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { DataTable } from '@/_components/admin/DataTable';
import { useAdminUsers } from '@/_hooks/useAdminUsers';
import { type AdminListUsersParams } from '@/_services/adminUserService';
import { type ColumnDef, type SortingState, type PaginationState, type ColumnFiltersState } from '@tanstack/react-table';
import type { UserResponseDTO } from '@repo/types';
import { ResourceActions } from '@/_components/admin/ResourceActions';
import { deleteUserAction } from '@/_actions/adminUserActions';
import { Badge } from '@repo/ui'; // Assuming Badge component

// Define Columns for Admin User Table
const userColumns = React.useMemo((): ColumnDef<UserResponseDTO>[] => [
    { accessorKey: 'name', header: 'Name', enableSorting: true },
    { accessorKey: 'email', header: 'Email', enableSorting: true },
    {
        accessorKey: 'authProvider',
        header: 'Provider',
        cell: ({ row }) => <Badge variant={row.original.authProvider === 'google' ? 'default' : 'secondary'}>{row.original.authProvider}</Badge>
    },
    {
        accessorKey: 'createdAt', header: 'Registered', enableSorting: true,
        cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
    },
    // Add isAdmin or Roles column if applicable
    // { accessorKey: 'isAdmin', header: 'Admin', cell: ({ row }) => row.original.isAdmin ? 'Yes' : 'No' },
    {
        id: 'actions',
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
            <ResourceActions
                resourceId={row.original.id}
                resourceName="user"
                editPath={`/users/${row.original.id}/edit`} // Link to admin edit page
                deleteAction={deleteUserAction}
                // Add callbacks for toast notifications
            />
        ),
    },
], []);

export default function AdminUsersPage() {
    const [sorting, setSorting] = useState<SortingState>([{ id: 'createdAt', desc: true }]); // Default sort
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]); // Example: Client-side filtering state
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 });

    // Build query params (adapt if using server-side filtering)
    const queryParams: AdminListUsersParams = useMemo(() => {
         const params: AdminListUsersParams = {
            limit: pagination.pageSize,
            offset: pagination.pageIndex * pagination.pageSize,
        };
        if (sorting.length > 0) {
            params.sortBy = sorting[0].id as AdminListUsersParams['sortBy']; // Cast might be needed
            params.sortDir = sorting[0].desc ? 'desc' : 'asc';
        }
         // Map columnFilters if server-side:
         // const emailFilter = columnFilters.find(f => f.id === 'email');
         // if(emailFilter) params.q = emailFilter.value as string;
        return params;
    }, [pagination, sorting/*, columnFilters*/]);

    const { data: queryResponse, isLoading, isFetching, isError, error } = useAdminUsers(queryParams);

    const tableData = useMemo(() => queryResponse?.data ?? [], [queryResponse?.data]);
    const totalUsers = useMemo(() => queryResponse?.total ?? 0, [queryResponse?.total]);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
             {/* TODO: Add Filter components based on DataTable structure */}
             {/* <div className="mb-4"> ... filter inputs ... </div> */}

            {isError && ( <div className="text-red-600 mb-4">Error: {error?.message}</div> )}

            <DataTable
                columns={userColumns}
                data={tableData}
                totalItems={totalUsers}
                isLoading={isLoading || isFetching}
                pagination={pagination}
                setPagination={setPagination}
                sorting={sorting}
                setSorting={setSorting}
                // Pass filter state if using client-side filtering in DataTable
                columnFilters={columnFilters}
                setColumnFilters={setColumnFilters}
                // Set manualFiltering to true if filters are handled server-side via queryParams
                // manualFiltering={true}
            />
        </div>
    );
}