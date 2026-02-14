"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import {
  Menu,
  X,
  ArrowRight,
  Zap,
  Search,
  Download,
  Github,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { RainbowButton } from "@/components/ui/rainbow-button";

interface NavItem {
  name: string;
  href: string;
}

const navItems: NavItem[] = [
  { name: "Home", href: "/#" },
  { name: "Features", href: "/#features" },
  { name: "Solutions", href: "/#solution" },
  { name: "Technology", href: "/#tech" },
  { name: "Showcase", href: "/#showcase" },
  { name: "Changelog", href: "/changelog" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isDownloadModalOpen) return;
    setCountdown(3);
  }, [isDownloadModalOpen]);

  useEffect(() => {
    if (!isDownloadModalOpen) return;
    if (isDownloading) return;

    if (countdown <= 0) {
      startDownload();
      return;
    }

    const timer = window.setTimeout(() => {
      setCountdown((c) => c - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [countdown, isDownloadModalOpen, isDownloading]);

  const confettiPieces = useMemo(() => {
    const colors = ["#0076db", "#80bfff", "#ffffff", "#22c55e", "#a855f7"];

    return Array.from({ length: 26 }).map((_, i) => {
      const left = Math.round(Math.random() * 100);
      const delay = Math.random() * 0.6;
      const duration = 1.6 + Math.random() * 1.4;
      const size = 6 + Math.round(Math.random() * 8);
      const rotate = Math.round(Math.random() * 360);
      const color = colors[i % colors.length];

      return {
        left,
        delay,
        duration,
        size,
        rotate,
        color,
        key: `${i}-${left}`,
      };
    });
  }, [isDownloadModalOpen]);

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.3,
        ease: easeInOut,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: easeInOut,
        staggerChildren: 0.1,
      },
    },
  };

  const mobileItemVariants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0 },
  };

  const startDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      const res = await fetch("/api/download", { method: "POST" });
      const data = (await res.json()) as { downloadUrl?: string };
      const url =
        data?.downloadUrl ||
        "https://github.com/ndizeyedavid/REMPO/releases/latest";
      window.location.href = url;
    } catch {
      window.location.href =
        "https://github.com/ndizeyedavid/REMPO/releases/latest";
    } finally {
      setIsDownloading(false);
      setIsDownloadModalOpen(false);
    }
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "border-border/50 bg-background/80 border-b shadow-sm backdrop-blur-md"
            : "bg-transparent"
        }`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <motion.div
              className="flex items-center space-x-3"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Link
                prefetch={false}
                href="/"
                className="flex items-center space-x-3"
              >
                <div className="relative">
                  <Image
                    src="/logo.png"
                    width={45}
                    height={45}
                    alt="REMPO Logo"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-foreground text-lg font-bold">
                    REMPO
                  </span>
                  {/* <span className="text-muted-foreground -mt-1 text-xs">
                    Remember what you were building
                  </span> */}
                </div>
              </Link>
            </motion.div>

            <nav className="hidden items-center space-x-1 lg:flex">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  variants={itemVariants}
                  className="relative"
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Link
                    prefetch={false}
                    href={item.href}
                    className="text-foreground/80 hover:text-foreground relative rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200"
                  >
                    {hoveredItem === item.name && (
                      <motion.div
                        className="bg-muted absolute inset-0 rounded-lg"
                        layoutId="navbar-hover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10">{item.name}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              className="hidden items-center space-x-3 lg:flex"
              variants={itemVariants}
            >
              <Link
                prefetch={false}
                href="https://github.com/ndizeyedavid/REMPO"
                className="text-foreground/80 hover:text-foreground px-4 py-2 text-sm font-medium transition-colors duration-200"
              >
                <Github />
              </Link>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  type="button"
                  onClick={() => setIsDownloadModalOpen(true)}
                  className="bg-foreground text-background hover:bg-foreground/90 inline-flex items-center space-x-2 rounded-lg px-5 py-2.5 text-sm font-medium shadow-sm transition-all duration-200"
                >
                  <span>Download</span>
                  <Download className="h-4 w-4" />
                </button>
              </motion.div>
            </motion.div>

            <motion.button
              className="text-foreground hover:bg-muted rounded-lg p-2 transition-colors duration-200 lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              variants={itemVariants}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="border-border bg-background fixed top-16 right-4 z-50 w-80 overflow-hidden rounded-2xl border shadow-2xl lg:hidden"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="space-y-6 p-6">
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <motion.div key={item.name} variants={mobileItemVariants}>
                      <Link
                        prefetch={false}
                        href={item.href}
                        className="text-foreground hover:bg-muted block rounded-lg px-4 py-3 font-medium transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="border-border space-y-3 border-t pt-6"
                  variants={mobileItemVariants}
                >
                  <Link
                    prefetch={false}
                    href="https://github.com/ndizeyedavid/REMPO"
                    className="text-foreground hover:bg-muted block w-full rounded-lg py-3 text-center font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Github
                  </Link>
                  <button
                    type="button"
                    className="bg-foreground text-background hover:bg-foreground/90 block w-full rounded-lg py-3 text-center font-medium transition-all duration-200"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsDownloadModalOpen(true);
                    }}
                  >
                    Download
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDownloadModalOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() =>
                isDownloading ? null : setIsDownloadModalOpen(false)
              }
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              <div
                className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#050608] shadow-[0_24px_90px_rgba(0,0,0,0.85)]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="border-b border-white/10 p-5">
                  <p className="text-xs font-mono uppercase tracking-[0.3em] text-zinc-500">
                    Download
                  </p>
                  <div className="mt-2 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-50">
                        Thank you for supporting REMPO
                      </h3>
                      <p className="mt-2 text-sm text-zinc-300">
                        Your download really helps. I hope REMPO saves you time
                        and keeps your projects organized.
                      </p>
                    </div>
                    <div className="rounded-xl border border-[#0076db]/30 bg-[#0076db]/10 px-2 py-2 text-right">
                      <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#80bfff]">
                        Starting in
                      </p>
                      <p className="mt-0.5 text-2xl font-semibold text-zinc-50">
                        {isDownloading ? "…" : countdown}
                        <span className="ml-1 text-sm font-normal text-zinc-300">
                          s
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="relative mt-4 overflow-hidden rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs text-zinc-400">
                      I am continously adding more updates and making this
                      application even way more potentious and useful, we'll let
                      you know if there is something new!
                    </p>
                  </div>
                </div>

                <div className="items-center justify-end gap-2 p-5 hidden">
                  <button
                    type="button"
                    disabled={isDownloading}
                    onClick={() => setIsDownloadModalOpen(false)}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 hover:bg-white/10 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={startDownload}
                    disabled={isDownloading}
                    className="rounded-lg bg-[#0076db] px-4 py-2 text-sm font-medium text-white hover:bg-[#0a82ea] disabled:opacity-70"
                  >
                    {isDownloading ? "Preparing..." : "Download now"}
                  </button>
                </div>

                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  {confettiPieces.map((p) => (
                    <span
                      key={p.key}
                      className="absolute -top-6 opacity-0"
                      style={{
                        left: `${p.left}%`,
                        width: `${p.size}px`,
                        height: `${Math.max(6, Math.round(p.size * 0.6))}px`,
                        backgroundColor: p.color,
                        borderRadius: "2px",
                        transform: `rotate(${p.rotate}deg)`,
                        animation: `confetti-fall ${p.duration}s ease-out ${p.delay}s forwards`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(420px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
