// apps/admin-panel/app/(admin)/users/page.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { DataTable } from '@/../_components/admin/DataTable'; // Adjust path
import { useAdminUsers } from '@/../_hooks/useAdminUsers'; // Adjust path
import { type ColumnDef, type SortingState, type PaginationState, type ColumnFiltersState } from '@tanstack/react-table';
import type { UserResponseDTO } from '@repo/types';
import { Button } from '@repo/ui';
// import Link from 'next/link'; // Link is now inside ResourceActions
// import { Pencil, Trash2 } from 'lucide-react'; // Icons are inside ResourceActions
import { ResourceActions } from '@/../_components/admin/ResourceActions'; // Import the new component
import { deleteUserAction } from '@/../_actions/adminUserActions'; // Import the delete action
// Import toast library if using
// import { toast } from 'react-hot-toast';

// --- Define Columns ---
// Memoize columns to prevent redefining on every render
const userColumns = React.useMemo((): ColumnDef<UserResponseDTO>[] => [
    { accessorKey: 'name', header: 'Name' }, // Can add sorting toggle here if needed
    {
      accessorKey: 'email',
      header: ({ column }) => ( // Example header with sorting
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          {/* Add Sort Icon Logic */}
        </Button>
      ),
    },
    { accessorKey: 'authProvider', header: 'Provider'},
    {
        accessorKey: 'createdAt',
        header: 'Registered At',
        cell: ({row}) => new Date(row.original.createdAt).toLocaleDateString()
    },
    {
        id: 'actions',
        header: () => <div className="text-right">Actions</div>, // Right align header
        cell: ({ row }) => (
            <ResourceActions
                resourceId={row.original.id}
                resourceName="user"
                editPath={`/users/${row.original.id}/edit`} // Construct edit path
                deleteAction={deleteUserAction} // Pass the server action directly
                // Optional callbacks for notifications
                onDeleteError={(message) => {
                    // toast.error(`Failed to delete user: ${message || 'Unknown error'}`);
                    alert(`Failed to delete user: ${message || 'Unknown error'}`); // Simple alert
                }}
                 onDeleteSuccess={() => {
                    // toast.success(`User deleted successfully.`);
                    alert(`User deleted successfully.`); // Simple alert
                 }}
            />
        ),
    },
], []); // Empty dependency array means columns are defined once


export default function AdminUsersPage() {
    // --- State for Server-Side Operations ---
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 15,
    });

    // --- Build Query Params ---
    const queryParams = useMemo(() => {
        const params: any = {
            limit: pagination.pageSize,
            offset: pagination.pageIndex * pagination.pageSize,
        };
        if (sorting.length > 0) {
            params.sortBy = sorting[0].id;
            params.sortDir = sorting[0].desc ? 'desc' : 'asc';
        }
        // TODO: Map columnFilters state to backend query params
        return params;
    }, [pagination, sorting, columnFilters]);

    // --- Fetch Data ---
    const { data: queryResponse, isLoading, isError, error, isPlaceholderData } = useAdminUsers(queryParams);

    // --- Memoize Data/Total ---
    const tableData = useMemo(() => queryResponse?.data ?? [], [queryResponse?.data]);
    const totalUsers = useMemo(() => queryResponse?.total ?? 0, [queryResponse?.total]);

    useEffect(() => {
        if (isError) { console.error("Error fetching users:", error); }
    }, [isError, error]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Users</h1>
                {/* Optional: Add "Create User" button */}
                 {/* <Button asChild> <Link href="/users/new">Create User</Link> </Button> */}
            </div>

             {isError && (
                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                     Error loading users: {error?.message}
                 </div>
             )}

            <DataTable
                columns={userColumns} // Use memoized columns
                data={tableData}
                totalItems={totalUsers}
                // Pass isLoading AND isPlaceholderData for better loading indication during pagination
                isLoading={isLoading || isPlaceholderData}
                pagination={pagination}
                setPagination={setPagination}
                sorting={sorting}
                setSorting={setSorting}
            />
        </div>
    );
}