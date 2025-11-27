import Image from "next/image";
import Link from "next/link";
import { PhotoEntry } from "@/types/photos";

export const FeaturedPhoto = ({ photo }: { photo: PhotoEntry }) => {
  return (
    <section className="relative overflow-hidden rounded-[40px] border border-white/10 bg-neutral-900 shadow-2xl">
      {/* Background Glow */}
      <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-emerald-500/20 blur-[100px]" />
      <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-blue-500/10 blur-[100px]" />

      <div className="relative grid gap-10 p-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 lg:p-12">
        <div className="flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-400">
                Featured Story
              </p>
            </div>
            <h2 className="text-5xl font-bold leading-[1.1] tracking-tight text-white lg:text-6xl">
              {photo.title}
            </h2>
            {photo.description && (
              <p className="max-w-xl text-lg leading-relaxed text-white/60">
                {photo.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-6 border-y border-white/10 py-6">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/40">Captured</p>
              <p className="mt-1 text-sm font-medium text-white">{photo.capturedOn}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/40">Location</p>
              <p className="mt-1 text-sm font-medium text-white">{photo.metadata.location}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/40">Camera</p>
              <p className="mt-1 text-sm font-medium text-white">{photo.metadata.camera}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <Link
              href={`/photo/${photo.slug}`}
              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-emerald-400"
            >
              <span>Read the story</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl lg:aspect-square">
          <Image
            src={photo.image.url}
            alt={photo.title}
            fill
            className="object-cover transition duration-700 hover:scale-105"
            placeholder="blur"
            blurDataURL={photo.image.placeholder}
            sizes="(min-width: 1024px) 45vw, 100vw"
            priority
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl" />
        </div>
      </div>
    </section>
  );
};
