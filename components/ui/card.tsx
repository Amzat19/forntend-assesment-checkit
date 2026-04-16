import { PokemonListItem } from "@/types/pokemon";
import Image from "next/image";
import Link from "next/link";

interface CardProps {
  pokemon: PokemonListItem;
  imageUrl: string | null;
  types?: string[]; //optional for type badges
  baseExp?: number; //optional for base experience display
}

export function Card({ pokemon, imageUrl, types = [], baseExp }: CardProps) {
  return (
    <Link href={`/pokemon/${pokemon.id}`} className="group block">
      <article className="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
        <div className="aspect-square relative mb-4 bg-gray-50 rounded-md overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`${pokemon.name} artwork`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-contain p-2"
              priority={pokemon.id <= 4} // Priority for above-the-fold images
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-100 text-gray-400">
              <span className="text-sm">No image</span>
            </div>
          )}
        </div>

        <h2 className="text-lg font-semibold capitalize text-gray-900 group-hover:text-blue-600">
          {pokemon.name}
        </h2>

        <div className="mt-2 flex flex-wrap gap-2">
          {types.map((type) => (
            <span
              key={type}
              className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
            >
              {type}
            </span>
          ))}
        </div>

        {baseExp && (
          <p className="mt-2 text-sm text-gray-500">Base XP: {baseExp}</p>
        )}
      </article>
    </Link>
  );
}
