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
      className="group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-neutral-900"
    >
      <Image
        src={photo.image.url}
        alt={photo.title}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        className="object-cover transition duration-700 group-hover:scale-110 group-hover:opacity-80"
        placeholder="blur"
        blurDataURL={photo.image.placeholder}
        priority={Boolean(photo.featured)}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 transition duration-500 group-hover:opacity-80" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 opacity-0 transition duration-500 group-hover:opacity-100">
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
    </Link>
  );
};
