import React from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

const entries = [
  {
    version: "0.0.4-beta",
    title: "Production build, blue brand, and marketing site",
    date: "February 14, 2026",
    badge: "Latest",
    highlights: ["Bug", "Update", "Windows"],
    items: [
      {
        label: "Added",
        points: [
          "Windows build & release GitHub Actions workflow that tags, builds and publishes releases from CHANGELOG.md.",
          "Dedicated Privacy Policy and Terms of Service pages for the REMPO app.",
          "New technologies section with Electron, LLaMA, Tailwind CSS and React logos.",
          "Hero grid / particle effects and smooth fades between sections for a seamless scroll experience.",
        ],
      },
      {
        label: "Changed",
        points: [
          "Updated hero and technologies accents from warm beige to REMPO blue (#0076db).",
          "Refined footer navigation to link to legal pages and personal website.",
        ],
      },
    ],
  },
  {
    version: "0.0.3-beta",
    title: "Git palette, folder picker and AI summaries",
    date: "February 11, 2026",
    highlights: [
      "In-app Git command palette powered by xterm.js",
      "Custom Windows-style folder picker with quick access paths",
      "AI-powered repository summaries using Groq",
    ],
    items: [
      {
        label: "Added",
        points: [
          "Global Git command palette with history, Ctrl+K shortcut and real-time output.",
          "Custom folder picker with drives, quick-access locations and recent folders.",
          "AI summaries of repositories using Groq with per-repo caching and settings panel.",
          "Settings for notifications, scan depth, and terminal appearance (font size, theme).",
        ],
      },
    ],
  },
  {
    version: "0.0.1-alpha",
    title: "Initial REMPO prototype",
    date: "January 6, 2026",
    highlights: ["Electron + React foundation", "Basic global repo scanning"],
    items: [
      {
        label: "Added",
        points: [
          "Initial Electron + React shell with Vite tooling.",
          "First version of global repository scanning for selected folders.",
          "Basic dashboard layout and theme switching.",
        ],
      },
    ],
  },
];

export default function ChangelogPage() {
  return (
    <main className="min-h-screen bg-[#050608] text-zinc-100">
      <Header />
      <div className="mx-auto w-full max-w-4xl px-6 py-16 md:px-8 md:py-20">
        {/* Header */}
        <header className="mb-10 flex flex-col mt-5 justify-between gap-4 border-b border-white/5 pb-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-zinc-500">
              Changelog
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              What&apos;s new in REMPO
            </h1>
            <p className="mt-3 max-w-xl text-sm text-zinc-400">
              Follow the evolution of REMPO: features, fixes and polish across
              the desktop app and marketing site.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 text-sm text-zinc-400 md:items-end">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live on GitHub
            </span>
            <Link
              href="https://github.com/ndizeyedavid/REMPO/releases"
              target="_blank"
              className="text-xs text-zinc-400 underline-offset-4 hover:text-zinc-200 hover:underline"
            >
              View all releases on GitHub
            </Link>
          </div>
        </header>

        {/* Timeline */}
        <div className="relative mt-6">
          {/* vertical line */}
          <div className="pointer-events-none absolute left-32 top-0 h-full w-px bg-gradient-to-b from-zinc-700/60 via-zinc-700/20 to-transparent" />

          <div className="space-y-10">
            {entries.map((entry, index) => (
              <article
                key={entry.version}
                className="relative grid gap-6 md:grid-cols-[210px_minmax(0,1fr)]"
              >
                {/* Left column: version + date */}
                <div className="relative flex items-start justify-start md:justify-end">
                  {/* dot on the line */}

                  <div className="relative z-10 max-w-[200px] rounded-xl border border-zinc-700/40 bg-zinc-900 px-4 py-3 text-left md:text-right">
                    <div className="flex flex-wrap items-center gap-2 md:justify-end">
                      <span className="rounded-full border border-zinc-600/60 bg-zinc-900/90 px-2.5 py-1 text-xs font-mono text-zinc-100">
                        v{entry.version}
                      </span>
                      {entry.badge && (
                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
                          {entry.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-[11px] font-mono uppercase tracking-[0.18em] text-zinc-500">
                      {entry.date}
                    </p>
                  </div>
                </div>

                {/* Right column: content card */}
                <div className="relative z-10 rounded-xl border border-white/5  px-5 py-5 shadow-[0_18px_60px_rgba(0,0,0,0.65)] backdrop-blur-sm md:px-6 md:py-6">
                  <h2 className="text-base font-semibold text-zinc-50 md:text-lg">
                    {entry.title}
                  </h2>

                  {entry.highlights && (
                    <ul className="mt-3 flex flex-wrap gap-2 text-[11px] text-zinc-300">
                      {entry.highlights.map((h) => (
                        <li
                          key={h}
                          className="rounded-full border border-zinc-700/60 bg-zinc-900/80 px-2.5 py-1"
                        >
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-4 space-y-4 text-sm text-zinc-300">
                    {entry.items.map((group) => (
                      <section key={group.label}>
                        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                          {group.label}
                        </h3>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          {group.points.map((p) => (
                            <li key={p}>{p}</li>
                          ))}
                        </ul>
                      </section>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-zinc-500">
          Want to see the code? Check out the REMPO repository on{" "}
          <Link
            href="https://github.com/ndizeyedavid/REMPO"
            target="_blank"
            className="underline underline-offset-4 hover:text-zinc-300"
          >
            GitHub
          </Link>
          .
        </p>
      </div>
      <Footer />
    </main>
  );
}
