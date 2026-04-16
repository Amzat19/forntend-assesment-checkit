import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900">404</h2>
        <p className="mt-2 text-lg text-gray-600">Pokemon not found</p>
        <Link
          href="/"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          Return to explorer
        </Link>
      </div>
    </main>
  );
}
