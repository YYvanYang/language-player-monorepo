// apps/user-app/_components/ui/PaginationControls.tsx
'use client';

import React, { useCallback, useMemo } from 'react'; // Added useMemo
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@repo/ui';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
// CORRECTED IMPORT PATH
import { DefaultLimit, MaxLimit } from '@repo/utils';

interface PaginationControlsProps {
  totalItems: number;
  itemsPerPage?: number;
  currentPage?: number;
}

export function PaginationControls({
  totalItems,
  itemsPerPage: itemsPerPageProp, // Allow overriding limit via props
  currentPage: currentPageProp, // Allow overriding page via props
}: PaginationControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Use props first, then URL params, then defaults for limit and page
  const limit = useMemo(() => {
      let l = itemsPerPageProp ?? parseInt(searchParams.get('limit') || String(DefaultLimit), 10);
      if (isNaN(l) || l <= 0) l = DefaultLimit;
      return Math.min(l, MaxLimit);
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
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('page', String(pageNumber));
    // Only set limit param if it's different from default or was already present
    if (limit !== DefaultLimit || searchParams.has('limit')) {
        current.set('limit', String(limit));
    } else {
        current.delete('limit'); // Remove if default
    }
    current.delete('offset'); // Always prefer page param

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  }, [searchParams, pathname, router, limit]);

  if (totalPages <= 1 || isNaN(totalPages)) {
    return null;
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