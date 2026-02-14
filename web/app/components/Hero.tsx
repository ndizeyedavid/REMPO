"use client";

import React, { useEffect, useRef } from "react";

const colors = {
  50: "#e6f3ff", // very light blue
  100: "#b3d9ff", // light blue
  200: "#80bfff", // accent light blue
  300: "#4da6ff", // mid blue
  400: "#1a8cff", // brighter blue
  500: "#0076db", // primary accent blue (matches logo)
  600: "#005fb0", // darker blue
  700: "#004685", // deep blue
  800: "#00315c", // very deep blue
  900: "#001a33", // near-black blue
};

export default function Hero() {
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate words
    const words = document.querySelectorAll<HTMLElement>(".word");
    words.forEach((word) => {
      const delay = parseInt(word.getAttribute("data-delay") || "0", 10);
      setTimeout(() => {
        word.style.animation = "word-appear 0.8s ease-out forwards";
      }, delay);
    });

    // Mouse gradient
    const gradient = gradientRef.current;
    function onMouseMove(e: MouseEvent) {
      if (gradient) {
        gradient.style.left = e.clientX - 192 + "px";
        gradient.style.top = e.clientY - 192 + "px";
        gradient.style.opacity = "1";
      }
    }
    function onMouseLeave() {
      if (gradient) gradient.style.opacity = "0";
    }
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    // Word hover effects
    words.forEach((word) => {
      word.addEventListener("mouseenter", () => {
        word.style.textShadow = "0 0 20px rgba(200, 180, 160, 0.5)";
      });
      word.addEventListener("mouseleave", () => {
        word.style.textShadow = "none";
      });
    });

    // Click ripple effect
    function onClick(e: MouseEvent) {
      const ripple = document.createElement("div");
      ripple.style.position = "fixed";
      ripple.style.left = e.clientX + "px";
      ripple.style.top = e.clientY + "px";
      ripple.style.width = "4px";
      ripple.style.height = "4px";
      ripple.style.background = "rgba(200, 180, 160, 0.6)";
      ripple.style.borderRadius = "50%";
      ripple.style.transform = "translate(-50%, -50%)";
      ripple.style.pointerEvents = "none";
      ripple.style.animation = "pulse-glow 1s ease-out forwards";
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 1000);
    }
    document.addEventListener("click", onClick);

    // Floating elements on scroll
    let scrolled = false;
    function onScroll() {
      if (!scrolled) {
        scrolled = true;
        document
          .querySelectorAll<HTMLElement>(".floating-element")
          .forEach((el, index) => {
            setTimeout(() => {
              el.style.animationPlayState = "running";
            }, index * 200);
          });
      }
    }
    window.addEventListener("scroll", onScroll);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="font-primary relative min-h-screen w-full pt-10 overflow-hidden bg-gradient-to-br from-[#1a1d18] via-black to-[#2a2e26] text-[#e6e1d7]">
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="rgba(200,180,160,0.08)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <line
          x1="0"
          y1="20%"
          x2="100%"
          y2="20%"
          className="grid-line"
          style={{ animationDelay: "0.5s" }}
        />
        <line
          x1="0"
          y1="80%"
          x2="100%"
          y2="80%"
          className="grid-line"
          style={{ animationDelay: "1s" }}
        />
        <line
          x1="20%"
          y1="0"
          x2="20%"
          y2="100%"
          className="grid-line"
          style={{ animationDelay: "1.5s" }}
        />
        <line
          x1="80%"
          y1="0"
          x2="80%"
          y2="100%"
          className="grid-line"
          style={{ animationDelay: "2s" }}
        />
        <line
          x1="50%"
          y1="0"
          x2="50%"
          y2="100%"
          className="grid-line"
          style={{ animationDelay: "2.5s", opacity: 0.05 }}
        />
        <line
          x1="0"
          y1="50%"
          x2="100%"
          y2="50%"
          className="grid-line"
          style={{ animationDelay: "3s", opacity: 0.05 }}
        />
        <circle
          cx="20%"
          cy="20%"
          r="2"
          className="detail-dot"
          style={{ animationDelay: "3s" }}
        />
        <circle
          cx="80%"
          cy="20%"
          r="2"
          className="detail-dot"
          style={{ animationDelay: "3.2s" }}
        />
        <circle
          cx="20%"
          cy="80%"
          r="2"
          className="detail-dot"
          style={{ animationDelay: "3.4s" }}
        />
        <circle
          cx="80%"
          cy="80%"
          r="2"
          className="detail-dot"
          style={{ animationDelay: "3.6s" }}
        />
        <circle
          cx="50%"
          cy="50%"
          r="1.5"
          className="detail-dot"
          style={{ animationDelay: "4s" }}
        />
      </svg>

      {/* Corner elements */}
      <div
        className="corner-element top-8 left-8"
        style={{ animationDelay: "4s" }}
      >
        <div
          className="absolute top-0 left-0 h-2 w-2 opacity-30"
          style={{ background: colors[200] }}
        ></div>
      </div>
      <div
        className="corner-element top-8 right-8"
        style={{ animationDelay: "4.2s" }}
      >
        <div
          className="absolute top-0 right-0 h-2 w-2 opacity-30"
          style={{ background: colors[200] }}
        ></div>
      </div>
      <div
        className="corner-element bottom-8 left-8"
        style={{ animationDelay: "4.4s" }}
      >
        <div
          className="absolute bottom-0 left-0 h-2 w-2 opacity-30"
          style={{ background: colors[200] }}
        ></div>
      </div>
      <div
        className="corner-element right-8 bottom-8"
        style={{ animationDelay: "4.6s" }}
      >
        <div
          className="absolute right-0 bottom-0 h-2 w-2 opacity-30"
          style={{ background: colors[200] }}
        ></div>
      </div>

      {/* Floating elements */}
      <div
        className="floating-element"
        style={{ top: "25%", left: "15%", animationDelay: "5s" }}
      ></div>
      <div
        className="floating-element"
        style={{ top: "60%", left: "85%", animationDelay: "5.5s" }}
      ></div>
      <div
        className="floating-element"
        style={{ top: "40%", left: "10%", animationDelay: "6s" }}
      ></div>
      <div
        className="floating-element"
        style={{ top: "75%", left: "90%", animationDelay: "6.5s" }}
      ></div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-between px-8 py-12 md:px-16 md:py-20">
        {/* Top tagline */}
        <div className="text-center">
          <h2
            className="font-mono text-xs font-light tracking-[0.2em] uppercase opacity-80 md:text-sm"
            style={{ color: colors[50] }}
          >
            <span className="word" data-delay="0">
              Welcome
            </span>
            <span className="word" data-delay="100">
              to
            </span>
            <span className="word" data-delay="200">
              <b>REMPO</b>
            </span>
            <span className="word" data-delay="300">
              (Repository
            </span>
            <span className="word" data-delay="400">
              +
            </span>
            <span className="word" data-delay="500">
              Remember)
            </span>
            {/* <span className="word" data-delay="600">
              you
            </span>
            <span className="word" data-delay="700">
              were
            </span>
            <span className="word" data-delay="800">
              building.
            </span> */}
          </h2>
          <div
            className="mt-4 h-px w-16 opacity-30"
            style={{
              background: `linear-gradient(to right, transparent, ${colors[200]}, transparent)`,
            }}
          ></div>
        </div>

        {/* Main headline */}
        <div className="mx-auto max-w-5xl text-center">
          <h1
            className="text-decoration text-3xl leading-tight font-extralight tracking-tight md:text-5xl lg:text-6xl"
            style={{ color: colors[50] }}
          >
            <div className="mb-4 md:mb-6">
              <span className="word" data-delay="900">
                Remember
              </span>
              <span className="word" data-delay="975">
                What
              </span>
              <span className="word" data-delay="1050">
                You
              </span>
              <span className="word" data-delay="1125">
                Were
              </span>
              <span className="word" data-delay="1200">
                Building
              </span>
              <span className="word" data-delay="1275"></span>
              <span className="word" data-delay="2700"></span>
            </div>
            <div
              className="text-2xl leading-relaxed font-thin md:text-3xl lg:text-4xl hidden"
              style={{ color: colors[200] }}
            >
              <span className="word" data-delay="1300">
                Discover
              </span>
              <span className="word" data-delay="1375">
                Visualize
              </span>
              <span className="word" data-delay="1450">
                and
              </span>
              <span className="word" data-delay="1525">
                Manage
              </span>
              <span className="word" data-delay="1600">
                your
              </span>
              <span className="word" data-delay="1675">
                Git
              </span>
              <span className="word" data-delay="1750">
                Repositories
              </span>
              <span className="word" data-delay="1825">
                in
              </span>
              <span className="word" data-delay="1900">
                one
              </span>
              <span className="word" data-delay="1975">
                secure
              </span>
              <span className="word" data-delay="2050">
                applicaion.
              </span>
            </div>
          </h1>
          <div
            className="absolute top-1/2 -left-8 h-px w-4 opacity-20"
            style={{
              background: colors[200],
              animation: "word-appear 1s ease-out forwards",
              animationDelay: "3.5s",
            }}
          ></div>
          <div
            className="absolute top-1/2 -right-8 h-px w-4 opacity-20"
            style={{
              background: colors[200],
              animation: "word-appear 1s ease-out forwards",
              animationDelay: "3.7s",
            }}
          ></div>
        </div>

        {/* Bottom tagline */}
        <div className="text-center">
          <div
            className="mb-4 h-px w-16 opacity-30"
            style={{
              background: `linear-gradient(to right, transparent, ${colors[200]}, transparent)`,
            }}
          ></div>
          <h2
            className="font-mono text-xs font-light tracking-[0.2em] uppercase opacity-80 md:text-sm"
            style={{ color: colors[50] }}
          >
            <span className="word" data-delay="1275">
              Repository
            </span>
            <span className="word" data-delay="1350">
              scanning,
            </span>
            <span className="word" data-delay="1450">
              smart
            </span>
            <span className="word" data-delay="1550">
              caching,
            </span>
            <span className="word" data-delay="1650">
              terminal
            </span>
            <span className="word" data-delay="1750">
              integration.
            </span>
          </h2>
          <div
            className="mt-6 flex justify-center space-x-4 opacity-0"
            style={{
              animation: "word-appear 1s ease-out forwards",
              animationDelay: "4.5s",
            }}
          >
            <div
              className="h-1 w-1 rounded-full opacity-40"
              style={{ background: colors[200] }}
            ></div>
            <div
              className="h-1 w-1 rounded-full opacity-60"
              style={{ background: colors[200] }}
            ></div>
            <div
              className="h-1 w-1 rounded-full opacity-40"
              style={{ background: colors[200] }}
            ></div>
          </div>
        </div>
      </div>

      {/* Bottom fade into Technologies section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[138px] bg-gradient-to-b from-transparent  to-[#121212]" />

      <div
        id="mouse-gradient"
        ref={gradientRef}
        className="pointer-events-none fixed h-96 w-96 rounded-full opacity-0 blur-3xl transition-all duration-500 ease-out"
        style={{
          background: `radial-gradient(circle, ${colors[500]}0D 0%, transparent 100%)`,
        }}
      ></div>
    </div>
  );
}
