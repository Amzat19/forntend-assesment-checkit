import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPokemonById, getPokemonList } from "@/lib/api/client";
import { Breadcrumb } from "@/components/ui/breadcrumb";

interface PageProps {
  params: { id: string };
}

// Generate static params for first 50 Pokemon (SSG optimization)
export async function generateStaticParams() {
  const data = await getPokemonList(50, 0);
  return data.results.map((p) => ({
    id: p.id.toString(),
  }));
}

// Dynamic metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const pokemon = await getPokemonById(params.id);
    const imageUrl =
      pokemon.sprites.other?.["official-artwork"]?.front_default ||
      pokemon.sprites.front_default ||
      "";

    return {
      title: `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} | Pokemon Explorer`,
      description: `View details about ${pokemon.name} including stats, types, and abilities.`,
      openGraph: {
        images: imageUrl ? [imageUrl] : [],
      },
    };
  } catch {
    return {
      title: "Pokemon Not Found",
    };
  }
}

export default async function PokemonDetail({ params }: PageProps) {
  let pokemon;

  try {
    pokemon = await getPokemonById(params.id);
  } catch {
    notFound();
  }

  const imageUrl =
    pokemon.sprites.other?.["official-artwork"]?.front_default ||
    pokemon.sprites.front_default;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) },
  ];

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Breadcrumb items={breadcrumbItems} />

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="grid gap-8 p-8 md:grid-cols-2">
            {/* Image Section */}
            <div className="relative aspect-square rounded-lg bg-gray-50">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={`${pokemon.name} official artwork`}
                  fill
                  priority
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  No image available
                </div>
              )}
            </div>

            {/* Info Section */}
            <div>
              <h1 className="text-4xl font-bold capitalize text-gray-900">
                {pokemon.name}
              </h1>

              <div className="mt-4 flex flex-wrap gap-2">
                {pokemon.types.map((t) => (
                  <span
                    key={t.type.name}
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                  >
                    {t.type.name}
                  </span>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-50 p-4">
                  <dt className="text-sm font-medium text-gray-500">Height</dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900">
                    {pokemon.height / 10}m
                  </dd>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <dt className="text-sm font-medium text-gray-500">Weight</dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900">
                    {pokemon.weight / 10}kg
                  </dd>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <dt className="text-sm font-medium text-gray-500">
                    Base Experience
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900">
                    {pokemon.base_experience}
                  </dd>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <dt className="text-sm font-medium text-gray-500">
                    Abilities
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900">
                    {pokemon.abilities.map((a) => a.ability.name).join(", ")}
                  </dd>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-900">
                  Base Stats
                </h2>
                <dl className="mt-4 space-y-4">
                  {pokemon.stats.map((stat) => (
                    <div key={stat.stat.name}>
                      <div className="flex items-center justify-between">
                        <dt className="text-sm font-medium capitalize text-gray-500">
                          {stat.stat.name.replace("-", " ")}
                        </dt>
                        <dd className="text-sm font-medium text-gray-900">
                          {stat.base_stat}
                        </dd>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-blue-600"
                          style={{
                            width: `${Math.min((stat.base_stat / 255) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
