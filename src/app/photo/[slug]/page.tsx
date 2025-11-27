import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPhotos, getPhotoBySlug } from "@/lib/db";
import type { PhotoEntry } from "@/types/photos";
import { RatingButton } from "@/components/RatingButton";
import { ArrowLeft, Camera, MapPin, Calendar } from "lucide-react";

interface PhotoPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const photos = await getPhotos();
  return photos.map((photo) => ({ slug: photo.slug }));
}

export async function generateMetadata({ params }: PhotoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const photo = await getPhotoBySlug(slug);
  if (!photo) {
    return {
      title: "Photo not found • Silent Shutter",
    };
  }

  return {
    title: `${photo.title} • Silent Shutter`,
    description: photo.description,
    openGraph: {
      title: `${photo.title} • Silent Shutter`,
      description: photo.description,
      images: [photo.image.url],
    },
  };
}

type MetaKey = keyof PhotoEntry["metadata"];

const metadataKeys: Array<{ label: string; key: MetaKey }> = [
  { label: "Camera", key: "camera" },
  { label: "Lens", key: "lens" },
  { label: "ISO", key: "iso" },
  { label: "Aperture", key: "aperture" },
  { label: "Shutter", key: "shutter" },
  { label: "Location", key: "location" },
];

export default async function PhotoPage({ params }: PhotoPageProps) {
  const { slug } = await params;
  const photo = await getPhotoBySlug(slug);

  if (!photo) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] h-[50vh] w-[50vw] rounded-full bg-emerald-900/20 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] h-[40vh] w-[40vw] rounded-full bg-blue-900/10 blur-[120px]" />
      </div>

      <main className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:py-16">
        <Link 
          href="/" 
          className="group inline-flex items-center gap-2 text-sm font-medium text-white/60 transition hover:text-white"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition group-hover:bg-white/10">
            <ArrowLeft className="h-4 w-4" />
          </span>
          <span>Back to gallery</span>
        </Link>

        <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:items-start">
          {/* Main Image Column */}
          <div className="space-y-8">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[32px] border border-white/10 bg-neutral-900 shadow-2xl">
              <Image
                src={photo.image.url}
                alt={photo.title}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 65vw, 100vw"
                placeholder="blur"
                blurDataURL={photo.image.placeholder}
                priority
              />
            </div>
            
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold leading-tight sm:text-4xl">{photo.title}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-white/60">
                  {photo.metadata.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-emerald-400" />
                      <span>{photo.metadata.location}</span>
                    </div>
                  )}
                  {photo.capturedOn && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-emerald-400" />
                      <span>{photo.capturedOn}</span>
                    </div>
                  )}
                </div>
              </div>
              <RatingButton photoId={photo.id} initialScore={photo.initialScore} />
            </div>
          </div>

          {/* Sidebar Column */}
          <aside className="space-y-8">
            {/* Description Card */}
            {photo.description && (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-white/40">The Story</h3>
                <p className="text-lg leading-relaxed text-white/80">{photo.description}</p>
              </div>
            )}

            {/* Metadata Card */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
              <div className="mb-6 flex items-center gap-3">
                <Camera className="h-5 w-5 text-emerald-400" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Technical Specs</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-8">
                {metadataKeys
                  .map((entry) => ({
                    label: entry.label,
                    value: photo.metadata[entry.key],
                  }))
                  .filter(({ value }) => value !== undefined && value !== null && value !== "")
                  .map(({ label, value }) => (
                    <div key={label} className="space-y-1.5">
                      <p className="text-[10px] uppercase tracking-widest text-white/40">{label}</p>
                      <p className="font-mono text-sm text-emerald-100">{value}</p>
                    </div>
                  ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
