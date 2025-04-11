// apps/admin-panel/_components/admin/DataTable.tsx
'use client';

import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel, // Keep for potential client-side filtering needs
  flexRender,
  type ColumnDef,
  type SortingState,
  type PaginationState,
  type ColumnFiltersState,
} from '@tanstack/react-table';
import { Button, Input, Spinner } from '@repo/ui'; // Use Spinner from shared UI
import { ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@repo/utils';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[]; // Data for the current page
  totalItems: number; // Total count for pagination
  isLoading?: boolean; // Loading state from TanStack Query
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  sorting?: SortingState; // Server-side sorting state
  setSorting?: React.Dispatch<React.SetStateAction<SortingState>>; // Setter for server-side sorting
  // Optional: Add props for server-side filtering if implemented
  // filterParams?: Record<string, string | undefined>;
  // setFilterParams?: (params: Record<string, string | undefined>) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalItems,
  isLoading = false,
  pagination,
  setPagination,
  sorting = [],
  setSorting,
  // Add filter props if needed
}: DataTableProps<TData, TValue>) {

  // Remove client-side filter state if using server-side filtering
  // const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  // const [globalFilter, setGlobalFilter] = useState('');

  const pageCount = useMemo(() => {
      return pagination.pageSize > 0 ? Math.ceil(totalItems / pagination.pageSize) : 0;
  }, [totalItems, pagination.pageSize]);

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount,
    state: {
      pagination,
      sorting,
      // Remove client-side filter state if not used
      // columnFilters,
      // globalFilter,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting, // Hook up server-side sorting handler
    // Remove client-side filter handlers if not used
    // onColumnFiltersChange: setColumnFilters,
    // onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // getFilteredRowModel: getFilteredRowModel(), // Keep if client-side filtering is sometimes useful
    manualPagination: true, // Required for server-side pagination
    manualSorting: !!setSorting, // Enable manual sorting only if handler provided
    manualFiltering: true, // Set to true if using server-side filtering
    debugTable: process.env.NODE_ENV === 'development',
  });

  return (
    <div className="space-y-4">
      {/* Example: Global Filter Input (Client-side - remove if not using) */}
       {/* <div className="flex items-center py-4">
         <Input
           placeholder="Filter all columns..."
           value={globalFilter ?? ''}
           onChange={(event) => setGlobalFilter(event.target.value)}
           className="max-w-sm"
         />
         {isLoading && <Spinner size="sm" className="ml-2 text-slate-400" />}
       </div> */}

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-slate-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                     style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={cn(
                            "flex items-center gap-1",
                            header.column.getCanSort() && !!setSorting ? 'cursor-pointer select-none' : ''
                        )}
                        onClick={setSorting ? header.column.getToggleSortingHandler() : undefined}
                        title={header.column.getCanSort() && !!setSorting ? `Sort by ${header.column.id}` : undefined}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && !!setSorting && (
                          <span className="ml-1 opacity-50 group-hover:opacity-100 transition-opacity">
                             {{ asc: ' ▲', desc: ' ▼'}[header.column.getIsSorted() as string] ?? <ArrowUpDown className="h-3 w-3 inline-block" />}
                          </span>
                         )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-gray-700 relative">
            {isLoading && (
                 // Loading overlay
                 <tr className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 flex items-center justify-center z-10">
                     <td colSpan={columns.length}><Spinner size="lg" /></td>
                 </tr>
             )}
             {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} data-state={row.getIsSelected() ? "selected" : undefined} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              !isLoading && ( // Only show "No results" if not loading
                 <tr>
                    <td colSpan={columns.length} className="h-24 text-center text-slate-500 dark:text-slate-400">
                    No results found.
                    </td>
                 </tr>
                )
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between py-4">
         <div className="text-sm text-muted-foreground dark:text-slate-400">
             {/* Show skeleton loading for counts while loading */}
             {isLoading ? 'Loading count...' : `
                Showing ${table.getRowModel().rows.length > 0 ? pagination.pageIndex * pagination.pageSize + 1 : 0}-
                ${Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalItems)} of
                ${totalItems} row(s).`}
         </div>
         <div className="flex items-center space-x-1 sm:space-x-2">
             <span className="text-sm mr-2 hidden md:inline">
                  {/* Show skeleton loading for page count */}
                 Page {isLoading ? '...' : table.getState().pagination.pageIndex + 1} of {isLoading ? '...' : table.getPageCount()}
             </span>
            <Button
              variant="outline" size="icon"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage() || isLoading}
              aria-label="Go to first page"
              className="h-8 w-8"
            >
               <ChevronsLeft className="h-4 w-4"/>
            </Button>
            <Button
              variant="outline" size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage() || isLoading}
              aria-label="Go to previous page"
              className="h-8 px-2"
            >
                <ChevronLeft className="h-4 w-4"/> <span className="hidden sm:inline">Prev</span>
            </Button>
            <Button
              variant="outline" size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage() || isLoading}
              aria-label="Go to next page"
              className="h-8 px-2"
            >
                 <span className="hidden sm:inline">Next</span> <ChevronRight className="h-4 w-4"/>
            </Button>
             <Button
              variant="outline" size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage() || isLoading}
              aria-label="Go to last page"
               className="h-8 w-8"
            >
                 <ChevronsRight className="h-4 w-4"/>
             </Button>
        </div>
      </div>
    </div>
  );
}