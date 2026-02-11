import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative px-4 py-24 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-2xl border border-[#1A3C6C]/30 bg-[#1A2649]/80 shadow-2xl transition-all duration-500 hover:border-[#2E9BFF]/30 hover:shadow-[0_0_30px_rgba(88,192,255,0.2)]">
          <div className="relative z-10 grid gap-0 lg:grid-cols-2">
            <div className="p-8 md:p-12 lg:p-16">
              <div className="mb-6 inline-block rounded-full border border-[#1A3C6C]/30 bg-[#0A0F2C] px-4 py-1 text-[#2E9BFF]">
                TAKE ACTION NOW
              </div>
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
                Ready to{" "}
                <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                  Stay Organized?
                </span>
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Developers worldwide are using REMPO to manage their Git
                repositories with ease. Take control of your projects today with
                our beautiful, intelligent dashboard.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="mt-1 mr-4 rounded-full bg-[#0A0F2C] p-2 text-[#2E9BFF]">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.5 10L9 11.5L12.5 8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-white">
                      Discover All Your Repos
                    </h3>
                    <p className="text-muted-foreground">
                      Automatically scan and discover all your Git repositories
                      in seconds.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mt-1 mr-4 rounded-full bg-[#0A0F2C] p-2 text-[#2E9BFF]">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.5 10L9 11.5L12.5 8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Beautiful Dashboard Interface
                    </h3>
                    <p className="text-muted-foreground">
                      Experience one of 9 beautiful themes that make managing
                      repos enjoyable.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mt-1 mr-4 rounded-full bg-[#0A0F2C] p-2 text-[#2E9BFF]">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.5 10L9 11.5L12.5 8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      AI-Powered Insights
                    </h3>
                    <p className="text-muted-foreground">
                      Get intelligent summaries and insights about your
                      repositories instantly.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex flex-col justify-center overflow-hidden bg-[#03487f] p-8 text-white md:p-12 lg:p-16">
              <div className="absolute top-0 right-0 h-full w-full opacity-10"></div>
              <div className="relative z-10">
                <h3 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
                  Manage Git Repositories Like Never Before
                </h3>
                <p className="mb-8 text-white/80">
                  REMPO brings together all the tools you need:
                </p>

                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-lg font-bold">
                      1
                    </div>
                    <p className="text-lg">
                      Global scanning discovers all your repositories
                    </p>
                  </div>

                  <div className="flex items-center">
                    <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-lg font-bold">
                      2
                    </div>
                    <p className="text-lg">
                      Real-time status updates and commit tracking
                    </p>
                  </div>

                  <div className="flex items-center">
                    <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-lg font-bold">
                      3
                    </div>
                    <p className="text-lg">
                      Built-in terminal with keyboard shortcuts (Ctrl+K)
                    </p>
                  </div>
                </div>

                <div className="mt-10 rounded-xl bg-white/10 p-6 backdrop-blur">
                  <p className="text-lg font-medium">
                    &quot;REMPO transformed how I manage my repositories. It's
                    beautiful, fast, and incredibly powerful.&quot;
                  </p>
                  <p className="mt-3 font-medium text-white/70">
                    — Alex Chen, Senior Developer
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
