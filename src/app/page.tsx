import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { HomeGallery } from "@/components/HomeGallery";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-3 py-10 sm:px-6">
        <HomeGallery />
      </main>

      <Footer />
    </div>
  );
}
