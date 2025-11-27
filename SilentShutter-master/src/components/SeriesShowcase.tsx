const series = [
  {
    title: "Silent Street Memos",
    body: "A running notebook of Delhi nights between midnight and sunrise. I collect sounds, fog, and the way sodium lights clip highlights.",
    status: "Updating every fortnight",
  },
  {
    title: "Green Room Portrait Lab",
    body: "Portraits of indie musicians and founders who fund the shoot with chai, instruments, or mentorship.",
    status: "Booking slots for Q1 2026",
  },
  {
    title: "Cities in Transit",
    body: "Documenting tier-2 transport hubs before metro lines make them unrecognizable.",
    status: "Editing 18-frame zine",
  },
];

export const SeriesShowcase = () => {
  return (
    <section className="space-y-8 rounded-[32px] border border-white/10 bg-black/40 p-8">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Ongoing series</p>
        <h3 className="text-3xl font-semibold text-white">Projects that define Silent Shutter</h3>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {series.map((item) => (
          <article key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white">
            <h4 className="text-xl font-semibold">{item.title}</h4>
            <p className="mt-3 text-sm text-white/70">{item.body}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.4em] text-emerald-300">{item.status}</p>
          </article>
        ))}
      </div>
    </section>
  );
};
