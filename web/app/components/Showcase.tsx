"use client";

import Image from "next/image";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const screenshots = [
  {
    src: "/techs/electron.webp",
    alt: "REMPO main window with global repositories view",
    title: "Global Git overview",
    description:
      "See all your repositories in one place with status and branches.",
    layout: "col-span-2 row-span-2",
  },
  {
    src: "/techs/react.webp",
    alt: "REMPO hero UI",
    title: "Beautiful desktop UI",
    description:
      "Dark theme tuned to your blue brand for long hacking sessions.",
    layout: "col-span-1 row-span-1",
  },
  {
    src: "/techs/tailwindcss.png",
    alt: "Settings panel",
    title: "Powerful settings",
    description: "Control themes, AI, notifications and scan preferences.",
    layout: "col-span-1 row-span-1",
  },
  {
    src: "/techs/llama.png",
    alt: "AI summary overlay",
    title: "AI summaries",
    description: "Let LLaMA + Groq explain what you were building.",
    layout: "col-span-2 row-span-1",
  },
];

export default function Showcase() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeShot = activeIndex !== null ? screenshots[activeIndex] : null;

  return (
    <section
      id="showcase"
      className="relative z-0 mx-auto w-full max-w-6xl px-6 py-20 md:px-8 md:py-24"
    >
      <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-zinc-500">
            Showcase
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
            A peek inside REMPO
          </h2>
          <p className="mt-3 max-w-xl text-sm text-zinc-400">
            Screenshots that capture the feel of the desktop app  the global
            repo grid, AI summaries and blue neon vibes.
          </p>
        </div>
        <p className="mt-2 max-w-xs text-xs text-zinc-500 md:text-right">
          All shots are from the actual REMPO Electron app. The layout below
          uses a responsive Bento grid with subtle motion.
        </p>
      </div>

      <div className="relative">
        {/* soft glow */}
        <div className="pointer-events-none absolute -inset-x-10 -top-10 -bottom-10 -z-10" />

        <div className="grid auto-rows-[140px] grid-cols-1 gap-4 md:auto-rows-[180px] md:grid-cols-3">
          {screenshots.map((shot, idx) => (
            <motion.button
              type="button"
              key={shot.src}
              className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/60 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0076db] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050608] ${shot.layout}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.06 }}
              viewport={{ once: true, amount: 0.3 }}
              onClick={() => setActiveIndex(idx)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-[#0076db33] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
              />

              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 md:p-4">
                <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#80bfff]">
                  {shot.title}
                </p>
                <p className="mt-1 text-[11px] text-zinc-200 line-clamp-2">
                  {shot.description}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox modal */}
      <AnimatePresence>
        {activeShot && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveIndex(null)}
          >
            <motion.div
              className="relative mx-4 w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/90 shadow-[0_24px_80px_rgba(0,0,0,0.9)]"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                className="absolute right-3 top-3 z-10 rounded-full border border-white/20 bg-black/40 px-2 py-1 text-[11px] text-zinc-200 hover:bg-white/10"
              >
                Close
              </button>

              <div className="relative h-[260px] w-full bg-black md:h-[420px]">
                <Image
                  src={activeShot.src}
                  alt={activeShot.alt}
                  fill
                  className="object-contain object-center"
                />
              </div>

              <div className="border-t border-white/10 bg-zinc-950/80 p-4 md:p-5">
                <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#80bfff]">
                  {activeShot.title}
                </p>
                <p className="mt-2 text-sm text-zinc-200">
                  {activeShot.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
