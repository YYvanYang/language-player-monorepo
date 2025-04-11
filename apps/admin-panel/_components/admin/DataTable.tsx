// apps/admin-panel/_components/admin/DataTable.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type PaginationState,
  type ColumnFiltersState,
} from '@tanstack/react-table';
import { Button, Input } from '@repo/ui'; // Shared UI
import { ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader } from 'lucide-react';
import { cn } from '@repo/utils'; // Shared util

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[]; // Data for the current page
  totalItems: number; // Total count for pagination
  isLoading?: boolean; // Loading state from TanStack Query
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  sorting?: SortingState; // Optional server-side sorting state
  setSorting?: React.Dispatch<React.SetStateAction<SortingState>>; // Setter for server-side sorting
  // Optional server-side filtering (pass state/setter if using)
  // columnFilters?: ColumnFiltersState;
  // setColumnFilters?: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalItems,
  isLoading = false,
  pagination,
  setPagination,
  sorting = [], // Default to empty array if not provided
  setSorting,
  // Pass columnFilters/setColumnFilters props if doing server-side filtering
}: DataTableProps<TData, TValue>) {

  // State for CLIENT-SIDE filtering (if NOT using server-side filters)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  // State for global filter (client-side)
  const [globalFilter, setGlobalFilter] = useState('');


  const pageCount = useMemo(() => {
      // Ensure pageSize is not zero to prevent division by zero
      return pagination.pageSize > 0 ? Math.ceil(totalItems / pagination.pageSize) : 0;
  }, [totalItems, pagination.pageSize]);

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount, // Inform table about total pages for server-side pagination
    state: {
      pagination,
      sorting,
      columnFilters, // Use state for client-side filtering
      globalFilter, // Use state for global filter
    },
    onPaginationChange: setPagination, // Hook up server-side pagination handler
    onSortingChange: setSorting, // Hook up server-side sorting handler (if provided)
    onColumnFiltersChange: setColumnFilters, // Use client-side filter handler
    onGlobalFilterChange: setGlobalFilter, // Use client-side global filter handler
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // Enable filtering model
    manualPagination: true, // Crucial for server-side pagination
    manualSorting: !!setSorting, // Enable manual sorting only if handler provided
    manualFiltering: false, // Set true if using server-side filtering via props
    debugTable: process.env.NODE_ENV === 'development', // Optional: logs table state
  });

  return (
    <div className="space-y-4">
      {/* Global Filter Input (Client-side) */}
       <div className="flex items-center py-4">
         <Input
           placeholder="Filter all columns..."
           value={globalFilter ?? ''}
           onChange={(event) => setGlobalFilter(event.target.value)}
           className="max-w-sm"
         />
         {isLoading && <Loader className="ml-2 h-5 w-5 animate-spin text-slate-400" />}
       </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                     style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }} // Apply column size if not default
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
                        {/* Sorting Indicator */}
                        {header.column.getCanSort() && !!setSorting && (
                          <span className="ml-1">
                             {{
                                asc: <ArrowUpDown className="h-3 w-3 opacity-80" />,
                                desc: <ArrowUpDown className="h-3 w-3 opacity-80 rotate-180" />, // Rotate for desc? Or use different icons
                              }[header.column.getIsSorted() as string] ?? (
                                <ArrowUpDown className="h-3 w-3 opacity-30" />
                             )}
                          </span>
                         )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-gray-700">
             {/* Loading state overlay might be better handled by the parent component */}
             {/* {isLoading ? (
                <tr><td colSpan={columns.length} className="text-center p-10 text-slate-500"><Loader className="h-6 w-6 animate-spin inline-block mr-2"/>Loading...</td></tr>
             ) :  */}
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
              <tr>
                <td colSpan={columns.length} className="h-24 text-center text-slate-500 dark:text-slate-400">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between py-4">
         <div className="text-sm text-muted-foreground dark:text-slate-400">
            Showing {table.getRowModel().rows.length > 0 ? pagination.pageIndex * pagination.pageSize + 1 : 0}-
            {Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalItems)} of{' '}
            {totalItems} row(s).
         </div>
         <div className="flex items-center space-x-1 sm:space-x-2">
             <span className="text-sm mr-2 hidden md:inline">
                 Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
             </span>
            <Button
              variant="outline" size="icon"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              aria-label="Go to first page"
              className="h-8 w-8"
            >
               <ChevronsLeft className="h-4 w-4"/>
            </Button>
            <Button
              variant="outline" size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Go to previous page"
              className="h-8 px-2"
            >
                <ChevronLeft className="h-4 w-4"/> <span className="hidden sm:inline">Prev</span>
            </Button>
            <Button
              variant="outline" size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Go to next page"
              className="h-8 px-2"
            >
                 <span className="hidden sm:inline">Next</span> <ChevronRight className="h-4 w-4"/>
            </Button>
             <Button
              variant="outline" size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
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