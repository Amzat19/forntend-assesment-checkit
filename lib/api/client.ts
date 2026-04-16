import {
  Pokemon,
  PokemonListResponse,
  type PokemonListItem,
} from "@/types/pokemon";

const BASE_URL = "https://pokeapi.co/api/v2";

interface FetchOptions extends RequestInit {
  revalidate?: number; // seconds
  tags?: string[];
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public info?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchWithConfig<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { revalidate, tags, ...fetchOptions } = options;

  const url = `${BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      next: {
        revalidate,
        tags,
      },
    });

    if (!response.ok) {
      throw new ApiError(
        `API Error: ${response.statusText}`,
        response.status,
        await response.json().catch(() => null),
      );
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      error instanceof Error ? error.message : "Unknown error",
      500,
    );
  }
}

export async function getPokemonList(
  limit: number = 20,
  offset: number = 0,
): Promise<PokemonListResponse> {
  const data = await fetchWithConfig<PokemonListResponse>(
    `/pokemon?limit=${limit}&offset=${offset}`,
    {
      revalidate: 3600, // ISR: 1 hour
      tags: ["pokemon-list"],
    },
  );

  // Transform to include IDs for easier client-side handling
  return {
    ...data,
    results: data.results.map((item) => ({
      ...item,
      id: parseInt(item.url.split("/").filter(Boolean).pop() || "0"),
    })),
  };
}

export async function getPokemonById(id: string): Promise<Pokemon> {
  return fetchWithConfig<Pokemon>(`/pokemon/${id}`, {
    revalidate: 86400, // ISR: 24 hours (pokemon data rarely changes)
    tags: [`pokemon-${id}`, "pokemon-detail"],
  });
}

export async function getPokemonByType(
  type: string,
): Promise<PokemonListItem[]> {
  const data = await fetchWithConfig<{
    pokemon: { pokemon: PokemonListItem }[];
  }>(`/type/${type}`, { revalidate: 86400 });

  return data.pokemon.map((p) => ({
    ...p.pokemon,
    id: parseInt(p.pokemon.url.split("/").filter(Boolean).pop() || "0"),
  }));
}

export { ApiError };
