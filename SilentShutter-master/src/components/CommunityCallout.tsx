"use client";

export const CommunityCallout = () => {
  return (
    <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-emerald-500/30 via-cyan-500/30 to-slate-900 p-8 text-white shadow-xl">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-white/70">Stay in the loop</p>
        <h3 className="text-3xl font-semibold">Frame Club Newsletter</h3>
        <p className="max-w-2xl text-white/80">
          Monthly highlights, behind-the-scenes breakdowns, and open calls for community voting.
          No spam, just frames.
        </p>
        <form
          className="flex flex-col gap-3 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            const target = event.target as HTMLFormElement;
            target.reset();
          }}
        >
          <input
            type="email"
            required
            placeholder="Email for sneak peeks"
            className="flex-1 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-white placeholder:text-white/60 focus:border-white"
          />
          <button
            type="submit"
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
          >
            Join the list
          </button>
        </form>
        <p className="text-xs uppercase tracking-[0.3em] text-white/60">
          Hosted via Mailchimp free tier • cancel anytime
        </p>
      </div>
    </section>
  );
};
