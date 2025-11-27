import Link from "next/link";
import { PhotoEntry } from "@/types/photos";

export const LatestStories = ({ stories }: { stories: PhotoEntry[] }) => {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">Fresh uploads</p>
          <h3 className="text-2xl font-semibold text-white">Latest drops</h3>
        </div>
        <Link
          href="/about"
          className="text-sm font-medium text-emerald-300 hover:text-white"
        >
          About Rachit →
        </Link>
      </div>
      <div className="mt-8 space-y-6">
        {stories.map((story) => (
          <article
            key={story.id}
            className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/30 p-5 text-white shadow-lg shadow-black/40"
          >
            <div className="text-xs uppercase tracking-[0.35em] text-white/50">{story.category}</div>
            <h4 className="text-lg font-semibold">{story.title}</h4>
            {story.description && <p className="text-sm text-white/70">{story.description}</p>}
            <div className="flex items-center justify-between text-xs text-white/60">
              <span>{story.metadata.location}</span>
              <Link
                href={`/photo/${story.slug}`}
                className="text-emerald-300 transition hover:text-white"
              >
                View →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
