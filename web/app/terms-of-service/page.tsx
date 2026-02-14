import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-[#050608] text-zinc-100">
      <Header />
      <div className="mx-auto w-full max-w-4xl px-6 py-20 md:px-8 md:py-24">
        <header className="mb-10 border-b border-white/5 pb-6">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Last updated: February 14, 2026
          </p>
        </header>

        <div className="space-y-8 text-sm leading-relaxed text-zinc-300">
          <section>
            <h2 className="text-base font-semibold text-zinc-100">
              1. Acceptance of terms
            </h2>
            <p className="mt-2">
              By downloading, installing or using REMPO (the "Application"), you
              agree to be bound by these Terms of Service. If you do not agree
              to these terms, you must not use the Application.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100">
              2. Description of the Application
            </h2>
            <p className="mt-2">
              REMPO is a desktop tool that scans folders you select for Git
              repositories and presents them in a unified dashboard. The
              Application may integrate with third‑party services such as Git
              hosting providers and AI APIs, but it does not operate as a
              replacement for Git itself.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100">
              3. Your responsibilities
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                <span className="font-medium text-zinc-100">
                  Compliance with laws.
                </span>
                <span className="ml-1">
                  You are responsible for ensuring that your use of REMPO
                  complies with all applicable laws, regulations and third‑party
                  agreements (including the terms of your Git hosting providers
                  and AI API providers).
                </span>
              </li>
              <li>
                <span className="font-medium text-zinc-100">
                  Repository access.
                </span>
                <span className="ml-1">
                  You must only scan folders and repositories that you are
                  legally permitted to access. REMPO operates on your local file
                  system and assumes you have the right to work with the content
                  you select.
                </span>
              </li>
              <li>
                <span className="font-medium text-zinc-100">Backups.</span>
                <span className="ml-1">
                  You are solely responsible for backing up your code,
                  repositories and configuration. REMPO is not a backup
                  solution.
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100">
              4. Third‑party services
            </h2>
            <p className="mt-2">
              REMPO may interact with third‑party services, including but not
              limited to GitHub, GitLab, Bitbucket, and AI providers such as
              Groq. Your use of those services is governed solely by their
              respective terms of service and privacy policies. We do not
              control and are not responsible for those services.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100">
              5. Open‑source license
            </h2>
            <p className="mt-2">
              REMPO is distributed under the MIT License. These Terms of Service
              supplement, and do not replace, the open‑source license included
              in the repository. In the event of a conflict between these Terms
              and the MIT License, the MIT License will govern your rights to
              the source code.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100">
              6. No warranty
            </h2>
            <p className="mt-2">
              THE APPLICATION IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
              WARRANTY OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT
              NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
              PARTICULAR PURPOSE AND NON‑INFRINGEMENT. YOU USE THE APPLICATION
              AT YOUR OWN RISK.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100">
              7. Limitation of liability
            </h2>
            <p className="mt-2">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL THE
              MAINTAINERS OR CONTRIBUTORS OF REMPO BE LIABLE FOR ANY INDIRECT,
              INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, OR ANY
              LOSS OF DATA, PROFITS OR REVENUE, ARISING OUT OF OR IN CONNECTION
              WITH YOUR USE OF THE APPLICATION.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100">
              8. Termination
            </h2>
            <p className="mt-2">
              You may stop using REMPO at any time by uninstalling the
              Application and deleting its configuration directory. We may
              update or discontinue the Application at any time without prior
              notice.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100">
              9. Changes to these terms
            </h2>
            <p className="mt-2">
              We may update these Terms of Service from time to time. When we
              do, we will update the "Last updated" date at the top of this
              page. Your continued use of REMPO after changes become effective
              means that you accept the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100">
              10. Contact
            </h2>
            <p className="mt-2">
              If you have questions about these Terms of Service, you can reach
              the maintainer at{" "}
              <span className="font-mono">davidndizeye101@gmail.com</span>
              or by opening an issue on the GitHub repository.
            </p>
          </section>

          <p className="mt-10 text-xs text-zinc-500">
            This page is provided for informational purposes only and does not
            constitute legal advice. We still working on it😅 and we'll sure let you know as soon as this updates.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
