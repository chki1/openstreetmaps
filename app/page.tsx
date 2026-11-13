import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-3xl font-semibold">OpenStreetMap · Улаанбаатар</h1>
      <p className="text-zinc-600 dark:text-zinc-400">Leaflet + OpenStreetMap дээр хийсэн газрын зураг.</p>
      <Link
        href="/map"
        className="rounded-full bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
      >
        Газрын зураг нээх
      </Link>
    </main>
  );
}
