// apps/user-app/_components/ui/PaginationControls.tsx
'use client';

import React, { useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@repo/ui';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

// Corrected Import Path for DefaultLimit
import { DefaultLimit, MaxLimit } from '@repo/utils'; // Assuming constants are moved to utils or a dedicated constants package

interface PaginationControlsProps {
  totalItems: number;
  itemsPerPage?: number; // Optional prop override
  currentPage?: number; // Optional prop override
}

export function PaginationControls({
  totalItems,
  itemsPerPage: itemsPerPageProp,
  currentPage: currentPageProp,
}: PaginationControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Determine effective limit and page from props or URL params
  const limit = useMemo(() => {
      let l = itemsPerPageProp ?? parseInt(searchParams.get('limit') || '', 10);
      if (isNaN(l) || l <= 0) l = DefaultLimit;
      if (l > MaxLimit) l = MaxLimit;
      return l;
  }, [itemsPerPageProp, searchParams]);

  const currentPage = useMemo(() => {
      let p = currentPageProp ?? parseInt(searchParams.get('page') || '1', 10);
      if (isNaN(p) || p < 1) p = 1;
      return p;
  }, [currentPageProp, searchParams]);

  const totalPages = useMemo(() => (limit > 0 ? Math.ceil(totalItems / limit) : 0), [totalItems, limit]);

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handlePageChange = useCallback((pageNumber: number) => {
    const current = new URLSearchParams(Array.from(searchParams.entries())); // Create mutable copy
    current.set('page', String(pageNumber));
    // Keep existing limit param or set default if changing page
    if (!current.has('limit')) {
       current.set('limit', String(limit));
    }
    current.delete('offset'); // Prefer page over offset

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`); // Navigate with new query params
  }, [searchParams, pathname, router, limit]);

  if (totalPages <= 1 || isNaN(totalPages)) {
    return null; // Don't render if only one page or invalid state
  }

  return (
    <div className="flex items-center justify-center space-x-1 sm:space-x-2 py-4 mt-6 border-t dark:border-slate-700">
      <Button
        variant="outline" size="icon"
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
       <span className="text-sm font-medium px-2 sm:px-3 text-slate-600 dark:text-slate-400">
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
        variant="outline" size="icon"
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