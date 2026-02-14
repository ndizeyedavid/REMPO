import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#050608] text-zinc-100">
      <Header />
      <div className="mx-auto w-full max-w-4xl px-6 py-20 md:px-8 md:py-24">
        <header className="mb-10 border-b border-white/5 pb-6">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Last updated: February 14, 2026
          </p>
        </header>

        <div className="space-y-8 text-sm leading-relaxed text-zinc-300">
          <section>
            <h2 className="text-base font-semibold text-zinc-100">
              1. Overview
            </h2>
            <p className="mt-2">
              REMPO ("we", "our", or "us") is a desktop application that helps
              you visualize and manage Git repositories across your local
              machine. This Privacy Policy explains how REMPO handles
              information on your device.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100">
              2. Data processed locally
            </h2>
            <p className="mt-2">
              REMPO scans folders that you explicitly select in order to detect
              Git repositories and display metadata such as repository name,
              path, branch, recent commits and status. This processing happens
              locally on your machine. By default, this information is not sent
              to our servers.
            </p>
            <p className="mt-2">
              The app stores some preferences in a local configuration file (for
              example: theme, watched folders, scan settings, AI and
              notification preferences). This file is stored in your operating
              system&apos;s application data directory and never leaves your
              device unless you choose to back it up or sync it yourself.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100">
              3. AI summaries and third‑party APIs
            </h2>
            <p className="mt-2">
              REMPO can optionally generate AI summaries of repositories using
              the Groq API or other AI providers you configure. When you enable
              this feature and provide an API key, the app may send limited
              contextual information about your repositories (for example: file
              paths, commit messages and branch names) to the selected AI
              provider in order to generate a summary.
            </p>
            <p className="mt-2">
              Any data sent to an AI provider is governed by that
              provider&apos;s own privacy policy and terms. You are responsible
              for reviewing and accepting those terms before enabling AI
              features, and for deciding whether your code or repository
              metadata is appropriate to send to that provider.
            </p>
            <p className="mt-2">
              You can disable AI features at any time from the in‑app Settings
              panel. When disabled, REMPO will not send repository information
              to an external AI provider.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100">
              4. Telemetry and analytics
            </h2>
            <p className="mt-2">
              The open‑source version of REMPO does not include built‑in
              telemetry or usage analytics. The only network requests performed
              by the app are those required to check for updates (if enabled),
              open links in your browser, or call third‑party APIs you
              explicitly configure such as Groq or Git hosting providers.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100">
              5. Git credentials and authentication
            </h2>
            <p className="mt-2">
              REMPO interacts with your Git repositories using your existing Git
              configuration and credentials on the system. The app does not
              store your GitHub, GitLab or other Git hosting passwords or tokens
              itself; authentication is handled by Git and your operating
              system&apos;s credential helpers.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100">
              6. Your choices
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                <span className="font-medium text-zinc-100">
                  Control scanned folders.
                </span>
                <span className="ml-1">
                  You decide which directories to scan. Removing a folder from
                  your watched list will stop future scans of that path.
                </span>
              </li>
              <li>
                <span className="font-medium text-zinc-100">
                  Disable AI features.
                </span>
                <span className="ml-1">
                  You can turn off AI summaries and clear cached AI responses
                  from Settings at any time.
                </span>
              </li>
              <li>
                <span className="font-medium text-zinc-100">
                  Delete local data.
                </span>
                <span className="ml-1">
                  You may delete REMPO&apos;s local configuration directory from
                  your system to reset the app and remove stored preferences and
                  cache.
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100">
              7. Open‑source and contributions
            </h2>
            <p className="mt-2">
              REMPO is an open‑source project. If you contribute code, issues or
              pull requests on GitHub, your public profile information and any
              content you submit will be visible according to GitHub&apos;s own
              privacy practices.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100">
              8. Changes to this policy
            </h2>
            <p className="mt-2">
              We may update this Privacy Policy from time to time. When we do,
              we will update the "Last updated" date at the top of this page.
              Your continued use of REMPO after changes become effective means
              that you accept the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100">
              9. Contact
            </h2>
            <p className="mt-2">
              If you have questions about this Privacy Policy, you can reach the
              maintainer at{" "}
              <span className="font-mono">davidndizeye101@gmail.com</span>
              or by opening an issue on the GitHub repository.
            </p>
          </section>

          <p className="mt-10 text-xs text-zinc-500">
            Duhh!!😁 Just know that your data is safe, because the app runs
            locally on your system
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
