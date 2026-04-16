"use client";

import { useSearch } from "@/features/pokemon/hooks/use-search";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasSearch: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  hasSearch,
}: PaginationProps) {
  const { setPage } = useSearch();

  // Don't show pagination during search (client-side filtering)
  if (hasSearch) return null;

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button
        onClick={() => setPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => setPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}
