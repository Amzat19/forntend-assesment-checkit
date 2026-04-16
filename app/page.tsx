import { Suspense } from "react";
import { Metadata } from "next";
import { getPokemonList, getPokemonByType } from "@/lib/api/client";
import { Card } from "@/components/ui/card";
import { PokemonListItem } from "@/types/pokemon";
import { CardSkeleton } from "@/components/ui/skeleton";
import { Pagination } from "./pagination";
import { SearchFilters } from "./search-filters";

export const metadata: Metadata = {
  title: "Pokemon Explorer | Checkit Assessment",
  description: "Browse and search Pokemon using PokeAPI",
};

const ITEMS_PER_PAGE = 20;
const POKEMON_TYPES = [
  "all",
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

async function PokemonGrid({
  searchParams,
}: {
  searchParams: PageProps["searchParams"];
}) {
  const page = parseInt((searchParams.page as string) || "1", 10);
  const search = ((searchParams.q as string) || "").toLowerCase();
  const typeFilter = (searchParams.type as string) || "";

  let pokemonList: PokemonListItem[] = [];
  let totalCount = 0;

  try {
    if (typeFilter && typeFilter !== "all") {
      // Fetch by type (client-side filtering for search within type)
      const typeData = await getPokemonByType(typeFilter);
      totalCount = typeData.length;

      // Filter by search term if present
      pokemonList = search
        ? typeData.filter((p) => p.name.toLowerCase().includes(search))
        : typeData;
    } else {
      // Fetch paginated list
      const offset = (page - 1) * ITEMS_PER_PAGE;
      const data = await getPokemonList(ITEMS_PER_PAGE, offset);
      totalCount = data.count;

      // Client-side filter for search (PokeAPI doesn't support name search)
      pokemonList = search
        ? data.results.filter((p) => p.name.toLowerCase().includes(search))
        : data.results;
    }
  } catch {
    throw new Error("Failed to fetch Pokemon data");
  }

  // For accurate pagination with search, we'd need server-side search
  // This is a limitation of the PokeAPI - documented in README
  const displayedPokemon =
    typeFilter && typeFilter !== "all"
      ? pokemonList.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
      : pokemonList;

  if (displayedPokemon.length === 0) {
    return (
      <div className="col-span-full py-12 text-center">
        <div className="rounded-lg bg-gray-50 p-8">
          <h3 className="text-lg font-medium text-gray-900">
            No Pokemon found
          </h3>
          <p className="mt-2 text-gray-500">
            Try adjusting your search or filters to find what you&apos;re
            looking for.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {displayedPokemon.map((pokemon) => (
          <Card
            key={pokemon.id}
            pokemon={pokemon}
            imageUrl={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
          />
        ))}
      </div>

      {(!typeFilter || typeFilter === "all") && (
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(totalCount / ITEMS_PER_PAGE)}
          hasSearch={!!search}
        />
      )}
    </>
  );
}

export default function Home({ searchParams }: PageProps) {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pokemon Explorer</h1>
          <p className="mt-2 text-gray-600">
            Search and explore Pokemon from the PokeAPI
          </p>
        </div>

        <div className="mb-8 space-y-4 rounded-lg bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <SearchFilters types={POKEMON_TYPES} />
          </div>
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <PokemonGrid searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
