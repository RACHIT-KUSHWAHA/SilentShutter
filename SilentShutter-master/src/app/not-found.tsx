import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white">
      <p className="text-xs uppercase tracking-[0.4em] text-white/50">404</p>
      <h1 className="mt-6 text-4xl font-semibold">That frame is missing.</h1>
      <p className="mt-4 max-w-md text-white/70">
        Either the slug is wrong or I have archived the image while reshuffling the gallery.
      </p>
      <Link href="/" className="mt-8 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold">
        Go back home
      </Link>
    </main>
  );
}
