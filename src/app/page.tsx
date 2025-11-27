import { getPhotos, getCategories } from "@/lib/db";
import { GalleryGrid } from "@/components/GalleryGrid";
import { DatabaseSeeder } from "@/components/DatabaseSeeder";
import { Aperture } from "lucide-react";

export default async function Home() {
  const [photos, categories] = await Promise.all([
    getPhotos(),
    getCategories()
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
            <Aperture className="h-6 w-6 text-emerald-400" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Silent Shutter</span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-3 pb-10 sm:px-6">
        <GalleryGrid photos={photos} categories={categories} />
      </main>
      <DatabaseSeeder />
    </div>
  );
}
<DatabaseSeeder />
    </div >
  );
}
