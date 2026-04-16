"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { SearchFilters } from "@/types/pokemon";

const DEBOUNCE_MS = 300;

export function useSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local state for immediate input feedback
  const [localSearch, setLocalSearch] = useState(searchParams.get("q") || "");

  // Sync local state when URL changes (back/forward navigation)
  useEffect(() => {
    setLocalSearch(searchParams.get("q") || "");
  }, [searchParams]);

  // Debounced URL update
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const currentQ = searchParams.get("q") || "";

      if (localSearch !== currentQ) {
        const params = new URLSearchParams(searchParams);

        if (localSearch) {
          params.set("q", localSearch);
          params.delete("page"); // Reset to page 1 on new search
        } else {
          params.delete("q");
        }

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [localSearch, pathname, router, searchParams]);

  const setType = useCallback(
    (type: string) => {
      const params = new URLSearchParams(searchParams);

      if (type) {
        params.set("type", type);
      } else {
        params.delete("type");
      }
      params.delete("page");

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const setPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams);

      if (page > 1) {
        params.set("page", page.toString());
      } else {
        params.delete("page");
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const filters: SearchFilters = {
    q: searchParams.get("q") || "",
    type: searchParams.get("type") || "",
  };

  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  return {
    localSearch,
    setLocalSearch,
    filters,
    currentPage,
    setPage,
    setType,
  };
}
