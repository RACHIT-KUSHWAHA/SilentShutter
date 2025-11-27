import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Silent Shutter • Lenslogue",
  description: "Story-first, zero-budget photography platform for Rachit Sharma.",
};

const pillars = [
  {
    title: "Street nota bene",
    body: "Quick walks with the Fuji, short notes dumped into Notion, and a weekly curation session to pick what ships.",
  },
  {
    title: "Greenrooms",
    body: "Portrait sessions for indie musicians and founders who can pay in barter and good chai.",
  },
  {
    title: "Documentation",
    body: "Grassroots projects, old cities, and stories that look better with metadata on display.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
      <main className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-16">
        <header className="space-y-6">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">About Rachit</p>
          <h1 className="text-4xl font-semibold">The photographer who refuses to wait for budget approvals.</h1>
          <p className="text-white/70">
            I am Rachit Sharma, a New Delhi based photographer building a self-hosted platform with
            free tools. The goal: publish shoots fast, keep ratings public, and open-source the playbook.
          </p>
        </header>

        <section className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-semibold">How the platform stays free</h2>
          <ul className="space-y-6 text-white/80">
            <li>Frontend lives on Vercel free tier (Next.js + Tailwind).</li>
            <li>Ratings write to Firebase/Supabase free tier; falls back to local storage on read-only demos.</li>
            <li>Images stay on Cloudinary or Unsplash placeholders until a brief is approved.</li>
          </ul>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="rounded-3xl border border-white/10 bg-black/40 p-6">
              <h3 className="text-lg font-semibold">{pillar.title}</h3>
              <p className="mt-3 text-sm text-white/70">{pillar.body}</p>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-emerald-500/20 via-slate-900 to-black p-8">
          <h2 className="text-2xl font-semibold">Contact</h2>
          <p className="mt-3 text-white/70">DM @pixelrachit on Instagram or drop a mail at hello@silentshutter.studio.</p>
        </section>
      </main>
    </div>
  );
}
