import { describe, it, expect, vi } from "vitest";
import { getPokemonById, ApiError } from "./client";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("API Client", () => {
  it("should return pokemon data on successful fetch", async () => {
    const mockPokemon = {
      id: 1,
      name: "bulbasaur",
      height: 7,
      weight: 69,
      base_experience: 64,
      types: [],
      abilities: [],
      stats: [],
      sprites: { front_default: null },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPokemon,
    });

    const result = await getPokemonById("1");
    expect(result.name).toBe("bulbasaur");
    expect(result.id).toBe(1);
  });

  it("should throw ApiError on failed fetch", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
      json: async () => ({ message: "Not found" }),
    });

    await expect(getPokemonById("99999")).rejects.toThrow(ApiError);
  });
});
