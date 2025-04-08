// apps/user-app/_components/ui/PaginationControls.tsx
'use client';

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@repo/ui';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationControlsProps {
  totalItems: number;
  currentPage: number; // 1-based page number
  itemsPerPage: number;
  // Can use router based approach or callback approach
  // Callback approach:
  // onPageChange: (pageNumber: number) => void;
}

export function PaginationControls({
  totalItems,
  currentPage,
  itemsPerPage,
}: PaginationControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handlePageChange = (pageNumber: number) => {
    const current = new URLSearchParams(Array.from(searchParams.entries())); // Create mutable copy

    // Calculate new offset based on page number
    const offset = (pageNumber - 1) * itemsPerPage;
    current.set('offset', String(offset));
    current.set('limit', String(itemsPerPage)); // Keep limit consistent

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`); // Navigate with new query params
  };

  if (totalPages <= 1) {
    return null; // Don't render pagination if only one page
  }

  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      <Button
        variant="outline" size="sm"
        onClick={() => handlePageChange(1)}
        disabled={!canGoPrevious}
        aria-label="Go to first page"
      >
         <ChevronsLeft className="h-4 w-4"/>
      </Button>
      <Button
        variant="outline" size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={!canGoPrevious}
        aria-label="Go to previous page"
      >
          <ChevronLeft className="h-4 w-4"/> Previous
      </Button>
       <span className="text-sm px-2">
            Page {currentPage} of {totalPages}
       </span>
      <Button
        variant="outline" size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={!canGoNext}
        aria-label="Go to next page"
      >
          Next <ChevronRight className="h-4 w-4"/>
      </Button>
       <Button
        variant="outline" size="sm"
        onClick={() => handlePageChange(totalPages)}
        disabled={!canGoNext}
        aria-label="Go to last page"
      >
           <ChevronsRight className="h-4 w-4"/>
       </Button>
    </div>
  );
}