"use client";

import { useSearch } from "@/features/pokemon/hooks/use-search";
import { SearchInput } from "@/components/ui/search-input";

export function SearchFilters({ types }: { types: string[] }) {
  const { localSearch, setLocalSearch, filters, setType } = useSearch();

  return (
    <>
      <SearchInput
        value={localSearch}
        onChange={setLocalSearch}
        placeholder="Search Pokemon by name..."
      />

      <div className="flex items-center gap-2">
        <label
          htmlFor="type-filter"
          className="text-sm font-medium text-gray-700"
        >
          Type:
        </label>
        <select
          id="type-filter"
          value={filters.type || "all"}
          onChange={(e) =>
            setType(e.target.value === "all" ? "" : e.target.value)
          }
          className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          {types.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
