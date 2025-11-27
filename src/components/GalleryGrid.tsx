"use client";

import { useMemo, useState } from "react";
import { categories } from "@/data/photos";
import { PhotoCard } from "./PhotoCard";
import { PhotoEntry } from "@/types/photos";
import { motion, AnimatePresence } from "framer-motion";

const FILTER_ALL = "all";
const PAGE_SIZE = 6;

export const GalleryGrid = ({ photos }: { photos: PhotoEntry[] }) => {
  const [activeTag, setActiveTag] = useState<string>(FILTER_ALL);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filteredPhotos = useMemo(() => {
    const all = activeTag === FILTER_ALL
      ? photos
      : photos.filter((photo) => photo.category === activeTag);
    return all;
  }, [activeTag, photos]);

  const filterButtons = [FILTER_ALL, ...categories];

  return (
    <section className="space-y-10">
      <div className="flex flex-wrap gap-3">
        {filterButtons.map((filter) => {
          const isActive = filter === activeTag;
          return (
            <button
              key={filter}
              type="button"
              className={`relative rounded-full px-5 py-2.5 text-sm font-bold uppercase tracking-wide transition-all ${isActive
                  ? "text-black"
                  : "text-white/60 hover:text-white"
                }`}
              onClick={() => {
                setActiveTag(filter);
                setVisibleCount(PAGE_SIZE);
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 rounded-full bg-emerald-400"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">
                {filter === FILTER_ALL
                  ? "All Shots"
                  : filter}
              </span>
            </button>
          );
        })}
      </div>

      <motion.div
        layout
        className="columns-1 md:columns-2 xl:columns-3 gap-8 space-y-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredPhotos.slice(0, visibleCount).map((photo) => (
            <motion.div
              key={photo.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="break-inside-avoid mb-8"
            >
              <PhotoCard photo={photo} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {visibleCount < filteredPhotos.length && (
        <div className="flex justify-center pt-8">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
            className="group relative overflow-hidden rounded-full bg-white/5 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-white/10"
          >
            <span className="relative z-10">Load more frames</span>
          </button>
        </div>
      )}
    </section>
  );
};
