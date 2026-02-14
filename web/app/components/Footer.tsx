"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";
import {
  Github,
  Linkedin,
  Twitter,
  Moon,
  Sun,
  ArrowDownLeft,
  MessageCircle,
} from "lucide-react";

const data = () => ({
  navigation: {
    product: [
      { name: "Features", href: "/#features" },
      { name: "Solution", href: "/#solutions" },
      { name: "Showcase", href: "/#showcase" },
      { name: "Changelog", href: "/changelog" },
    ],
    moi: [
      { name: "About", href: "http://davidndizeye.vercel.app" },
      { name: "Blog", href: "https://davidndizeye.vercel.app/blog" },
      // { name: "Careers", href: "/careers" },
      { name: "Contact", href: "mailto:davidndizeye101@gmail.com" },
    ],
    resources: [
      { name: "Documentation", href: "/docs" },
      // { name: "API Reference", href: "/api" },
      // { name: "Community", href: "/community" },
      // { name: "Status", href: "/status" },
    ],
    legal: [
      { name: "Privacy", href: "/privacy-policy" },
      { name: "Terms", href: "/terms-of-service" },
      // { name: "Cookie Policy", href: "/cookies" },
    ],
  },
  socialLinks: [
    // { icon: Whatsapp, label: "Twitter", href: "#" },
    {
      icon: MessageCircle,
      label: "Whatsapp",
      href: "https://wa.me?phone=250796140857",
    },
    { icon: Github, label: "GitHub", href: "#" },
    // { icon: Linkedin, label: "LinkedIn", href: "#" },
  ],
  bottomLinks: [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms-of-service", label: "Terms of Service" },
    // { href: "/cookies", label: "Cookie Policy" },
  ],
});

export default function Footer() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentYear = new Date().getFullYear();

  if (!mounted) return null;

  return (
    <footer className="mt-20 w-full">
      <div className="animate-energy-flow via-primary h-px w-full bg-gradient-to-r from-transparent to-transparent" />
      <div className="relative w-full px-5">
        {/* Top Section */}
        <div className="container m-auto grid grid-cols-1 gap-12 py-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Company Info */}
          <div className="space-y-6 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Logo"
                width={200}
                height={200}
                className="size-10"
              />
              <span className="text-xl font-semibold">REMPO</span>
            </Link>
            <p className="text-muted-foreground max-w-md">
              Remember what you were building with a personal desktop
              application that scans and help you know what the hell you've been
              working on
            </p>
            <div className="flex items-center gap-2">
              <div className="flex gap-2">
                {data().socialLinks.map(({ icon: Icon, label, href }) => (
                  <Button
                    key={label}
                    title={label}
                    size="icon"
                    variant="outline"
                    asChild
                    className="hover:bg-primary dark:hover:bg-primary !border-primary/30 !hover:border-primary cursor-pointer shadow-none transition-all duration-500 hover:scale-110 hover:-rotate-12 hover:text-white hover:shadow-md"
                  >
                    <Link href={href}>
                      <Icon className="h-4 w-4" />
                    </Link>
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hidden hover:bg-primary dark:hover:bg-primary !border-primary/30 !hover:border-primary cursor-pointer shadow-none transition-all duration-1000 hover:scale-110 hover:-rotate-12 hover:text-white hover:shadow-md"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="w-full max-w-md space-y-3"
            >
              <label htmlFor="email" className="block text-sm font-medium">
                Subscribe to our newsletter
              </label>
              <div className="relative w-full">
                <Input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="h-12 w-full"
                  required
                />
                <Button
                  type="submit"
                  className="absolute top-1.5 right-1.5 cursor-pointer transition-all duration-1000 hover:px-10"
                >
                  Subscribe
                </Button>
              </div>
              <p className="text-muted-foreground text-xs">
                Get to know when we release new versions or anything cool.
              </p>
            </form>
            <h1 className="from-muted-foreground/15 bg-gradient-to-b bg-clip-text text-5xl font-extrabold text-transparent lg:text-7xl">
              🎮💻🎮💻
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="grid w-full grid-cols-2 items-start justify-between gap-8 px-5 lg:col-span-3">
            {(["product", "moi", "resources", "legal"] as const).map(
              (section) => (
                <div key={section} className="w-full">
                  <h3 className="border-primary mb-4 -ml-5 border-l-2 pl-5 text-sm font-semibold tracking-wider uppercase">
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </h3>
                  <ul className="space-y-3">
                    {data().navigation[section].map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className="group text-muted-foreground hover:text-foreground decoration-primary -ml-5 inline-flex items-center gap-2 underline-offset-8 transition-all duration-500 hover:pl-5 hover:underline"
                        >
                          <ArrowDownLeft className="text-primary rotate-[225deg] opacity-30 transition-all duration-500 group-hover:scale-150 group-hover:opacity-100 sm:group-hover:rotate-[225deg] md:rotate-0" />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="animate-rotate-3d via-primary h-px w-full bg-gradient-to-r from-transparent to-transparent" />
        <div className="text-muted-foreground container m-auto flex flex-col items-center justify-between gap-4 p-4 text-xs md:flex-row md:px-0 md:text-sm">
          <p className="">
            &copy; {currentYear} REMPO | A mesh with ❤️ by{" "}
            <Link
              href="https://davidndizeye.vercel.app"
              target="_blank"
              className="hover:underline"
            >
              David
            </Link>
          </p>
          <div className="flex items-center gap-4">
            {data().bottomLinks.map(({ href, label }) => (
              <Link key={href} href={href} className="hover:text-foreground">
                {label}
              </Link>
            ))}
          </div>
        </div>
        <span className="from-primary/20 absolute inset-x-0 bottom-0 left-0 -z-10 h-1/3 w-full bg-gradient-to-t" />
      </div>

      {/* Animations */}
      <style jsx>{`
        /* ===== Animation Presets ===== */
        .animate-rotate-3d {
          animation: rotate3d 8s linear infinite;
        }

        .animate-energy-flow {
          animation: energy-flow 4s linear infinite;
          background-size: 200% 100%;
        }

        /* ===== Keyframes ===== */
        @keyframes rotate3d {
          0% {
            transform: rotateY(0);
          }
          100% {
            transform: rotateY(360deg);
          }
        }

        @keyframes energy-flow {
          0% {
            background-position: -100% 0;
          }
          100% {
            background-position: 100% 0;
          }
        }
      `}</style>
    </footer>
  );
}
