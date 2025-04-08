// apps/admin-panel/_components/admin/DataTable.tsx
'use client';

import React, { useState, useMemo } from 'react';
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
import { ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[]; // Data for the current page
  totalItems: number; // Total count for pagination
  isLoading?: boolean;
  // Pass state and setters for server-side pagination/sorting/filtering
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  sorting?: SortingState; // Optional server-side sorting
  setSorting?: React.Dispatch<React.SetStateAction<SortingState>>;
  columnFilters?: ColumnFiltersState; // Optional server-side filtering
  setColumnFilters?: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalItems,
  isLoading = false,
  pagination,
  setPagination,
  sorting = [], // Provide default empty array
  setSorting,
  // columnFilters = [], // Provide default if using client-side filtering initially
  // setColumnFilters,
}: DataTableProps<TData, TValue>) {

  // Client-side filtering state (if NOT doing server-side filtering initially)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  // If doing server-side filtering, remove the useState above and pass state/setter via props


  const pageCount = useMemo(() => {
      return Math.ceil(totalItems / pagination.pageSize);
  }, [totalItems, pagination.pageSize]);

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount, // Inform table about total pages for server-side pagination
    state: {
      pagination,
      sorting,
      columnFilters, // Use state for filtering
    },
    onPaginationChange: setPagination, // Hook up server-side pagination handler
    onSortingChange: setSorting, // Hook up server-side sorting handler (if provided)
    onColumnFiltersChange: setColumnFilters, // Hook up filtering handler (client or server)
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // Enable filtering model
    manualPagination: true, // Crucial for server-side pagination
    manualSorting: !!setSorting, // Enable manual sorting if handler provided
    manualFiltering: false, // Set true if using server-side filtering via props
    debugTable: process.env.NODE_ENV === 'development', // Optional: logs table state
  });

  return (
    <div className="space-y-4">
      {/* Optional: Add Filter inputs here */}
       <div className="flex items-center py-4">
         {/* Example filter for the first column (if filterable) */}
         {table.getAllColumns().find(col => col.getCanFilter()) && (
              <Input
                  placeholder={`Filter ${table.getAllColumns().find(col => col.getCanFilter())?.id}...`}
                  value={(table.getColumn(table.getAllColumns().find(col => col.getCanFilter())!.id)?.getFilterValue() as string) ?? ""}
                  onChange={(event) =>
                      table.getColumn(table.getAllColumns().find(col => col.getCanFilter())!.id)?.setFilterValue(event.target.value)
                  }
                  className="max-w-sm"
              />
         )}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                     style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }} // Apply column size
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={cn("flex items-center gap-1", header.column.getCanSort() ? 'cursor-pointer select-none' : '')}
                        onClick={header.column.getToggleSortingHandler()}
                        title={header.column.getCanSort() ? `Sort by ${header.column.id}` : undefined}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <ArrowUpDown className="ml-2 h-3 w-3 opacity-50" />, // Replace with better icons later
                          desc: <ArrowUpDown className="ml-2 h-3 w-3 opacity-50" />, // Replace with better icons later
                        }[header.column.getIsSorted() as string] ?? (header.column.getCanSort() ? <ArrowUpDown className="ml-2 h-3 w-3 opacity-20" /> : null)}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
               <tr><td colSpan={columns.length} className="text-center p-4">Loading...</td></tr>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} data-state={row.getIsSelected() && "selected"} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between py-4">
         <div className="text-sm text-muted-foreground">
            {/* Optional: Show selected rows */}
            {/* {table.getFilteredSelectedRowModel().rows.length} of{" "} */}
            {totalItems} row(s) found.
         </div>
         <div className="flex items-center space-x-2">
             <span className="text-sm mr-2">
                 Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
             </span>
            <Button
              variant="outline" size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
               <ChevronsLeft className="h-4 w-4"/>
            </Button>
            <Button
              variant="outline" size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
                <ChevronLeft className="h-4 w-4"/> Previous
            </Button>
            <Button
              variant="outline" size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
                Next <ChevronRight className="h-4 w-4"/>
            </Button>
             <Button
              variant="outline" size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
                 <ChevronsRight className="h-4 w-4"/>
            </Button>
        </div>
      </div>
    </div>
  );
}