// apps/user-app/_components/ui/PaginationControls.tsx
'use client';

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@repo/ui'; // Adjust alias if needed
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { DefaultLimit } from '@/pkg/pagination/pagination'; // Import default


interface PaginationControlsProps {
  totalItems: number;
  itemsPerPage?: number; // Optional, defaults if not provided
  currentPage?: number; // Optional, defaults if not provided
}

export function PaginationControls({
  totalItems,
  itemsPerPage: itemsPerPageProp,
  currentPage: currentPageProp,
}: PaginationControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Determine limit: prop -> searchParam -> default
  const limit = itemsPerPageProp ?? parseInt(searchParams.get('limit') || '', 10) || DefaultLimit;
  // Determine current page: prop -> searchParam -> default
  const currentPage = currentPageProp ?? parseInt(searchParams.get('page') || '1', 10);

  const totalPages = Math.ceil(totalItems / limit);
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handlePageChange = (pageNumber: number) => {
    const current = new URLSearchParams(Array.from(searchParams.entries())); // Create mutable copy

    // Set page number for clarity, can also set offset if preferred
    current.set('page', String(pageNumber));
    current.set('limit', String(limit)); // Ensure limit is included

    // Remove offset if using page param
    current.delete('offset');

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`); // Navigate with new query params
  };

  if (totalPages <= 1 || isNaN(totalPages)) {
    return null; // Don't render pagination if only one page or invalid totalPages
  }

  return (
    <div className="flex items-center justify-center space-x-1 sm:space-x-2 py-4">
      <Button
        variant="outline" size="icon" // Use icon size for chevrons
        onClick={() => handlePageChange(1)}
        disabled={!canGoPrevious}
        aria-label="Go to first page"
        className="h-8 w-8"
      >
         <ChevronsLeft className="h-4 w-4"/>
      </Button>
      <Button
        variant="outline" size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={!canGoPrevious}
        aria-label="Go to previous page"
        className="h-8 px-2"
      >
          <ChevronLeft className="h-4 w-4 mr-1 sm:mr-0"/> <span className="hidden sm:inline">Previous</span>
      </Button>
       <span className="text-sm font-medium px-2 sm:px-3">
            Page {currentPage} of {totalPages}
       </span>
      <Button
        variant="outline" size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={!canGoNext}
        aria-label="Go to next page"
        className="h-8 px-2"
      >
          <span className="hidden sm:inline">Next</span> <ChevronRight className="h-4 w-4 ml-1 sm:ml-0"/>
      </Button>
       <Button
        variant="outline" size="icon" // Use icon size
        onClick={() => handlePageChange(totalPages)}
        disabled={!canGoNext}
        aria-label="Go to last page"
        className="h-8 w-8"
      >
           <ChevronsRight className="h-4 w-4"/>
       </Button>
    </div>
  );
}