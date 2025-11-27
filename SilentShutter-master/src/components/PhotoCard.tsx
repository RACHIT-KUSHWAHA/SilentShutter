import Image from "next/image";
import Link from "next/link";
import { PhotoEntry } from "@/types/photos";
import { ArrowUpRight } from "lucide-react";

interface PhotoCardProps {
  photo: PhotoEntry;
}

export const PhotoCard = ({ photo }: PhotoCardProps) => {
  return (
    <Link
      href={`/photo/${photo.slug}`}
      className="group relative block w-full"
    >
      <div className="relative w-full rounded-3xl drop-shadow-lg transition-all duration-500 group-hover:drop-shadow-2xl">
        <div className="relative w-full overflow-hidden rounded-3xl">
          <Image
            src={photo.image.url}
            alt={photo.title}
            width={photo.image.width || 800}
            height={photo.image.height || 600}
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="h-auto w-full rounded-3xl object-cover transition duration-700 group-hover:scale-110 group-hover:opacity-80"
            placeholder="blur"
            blurDataURL={photo.image.placeholder}
            priority={Boolean(photo.featured)}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-black/90 from-0% via-black/50 via-30% to-transparent to-60% opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
          </div>

          {/* Content */}
          <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 opacity-0 transition duration-500 group-hover:opacity-100">
            <div className="flex justify-end">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md">
                <ArrowUpRight className="h-5 w-5 text-white" />
              </span>
            </div>

            <div className="translate-y-4 transition duration-500 group-hover:translate-y-0">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                {photo.category}
              </p>
              <h3 className="mt-2 text-xl font-bold text-white leading-tight">
                {photo.title}
              </h3>
              <div className="mt-3 flex items-center gap-3 text-xs text-white/60">
                <span>{photo.metadata.camera}</span>
                <span className="h-1 w-1 rounded-full bg-white/30" />
                <span>{photo.metadata.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
