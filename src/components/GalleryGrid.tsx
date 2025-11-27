"use client";

import { useMemo, useState } from "react";
import { categories } from "@/data/photos";
import { PhotoCard } from "./PhotoCard";
import { PhotoEntry } from "@/types/photos";
import { motion, AnimatePresence } from "framer-motion";

import { Menu } from "lucide-react";

const FILTER_ALL = "all";
const PAGE_SIZE = 6;

export const GalleryGrid = ({ photos }: { photos: PhotoEntry[] }) => {
  const [activeTag, setActiveTag] = useState<string>(FILTER_ALL);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const filteredPhotos = useMemo(() => {
    const all = activeTag === FILTER_ALL
      ? photos
      : photos.filter((photo) => photo.category === activeTag);
    return all;
  }, [activeTag, photos]);

  const filterButtons = [FILTER_ALL, ...categories];

  return (
    <section className="space-y-10">
      <div className="relative z-20 flex flex-wrap gap-3">
        {/* Desktop View: Show all buttons */}
        <div className="hidden flex-wrap gap-3 md:flex">
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
                    layoutId="activeFilterDesktop"
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

        {/* Mobile View: All Shots + Hamburger */}
        <div className="flex w-full items-center justify-between md:hidden">
          <button
            type="button"
            className={`relative rounded-full px-5 py-2.5 text-sm font-bold uppercase tracking-wide transition-all ${activeTag === FILTER_ALL
              ? "text-black bg-emerald-400"
              : "text-white/60 hover:text-white bg-white/5"
              }`}
            onClick={() => {
              setActiveTag(FILTER_ALL);
              setVisibleCount(PAGE_SIZE);
            }}
          >
            All Shots
          </button>

          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold uppercase tracking-wide transition-all ${activeTag !== FILTER_ALL
                ? "bg-emerald-400 text-black"
                : "bg-white/5 text-white"
                }`}
            >
              <span>{activeTag !== FILTER_ALL ? activeTag : "Categories"}</span>
              <Menu className="h-4 w-4" />
            </button>

            <AnimatePresence>
              {isMenuOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsMenuOpen(false)}
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 top-full z-50 mt-2 min-w-[200px] overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 p-2 shadow-xl"
                  >
                    {categories.map((filter) => (
                      <button
                        key={filter}
                        onClick={() => {
                          setActiveTag(filter);
                          setVisibleCount(PAGE_SIZE);
                          setIsMenuOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition ${activeTag === filter
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "text-white/60 hover:bg-white/5 hover:text-white"
                          }`}
                      >
                        {filter}
                        {activeTag === filter && (
                          <motion.div
                            layoutId="activeCheck"
                            className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                          />
                        )}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
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
