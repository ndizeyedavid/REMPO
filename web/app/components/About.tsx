export default function About() {
  return (
    <section className="relative px-4 py-24 md:px-6" id="about">
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            About REMPO
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            The intelligent dashboard for managing your global Git ecosystem
          </p>
        </div>

        <div className="space-y-8">
          <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 text-2xl font-semibold">What is REMPO?</h3>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              REMPO is a beautiful, intelligent dashboard designed for
              developers who manage multiple Git repositories. Whether you're
              working on a single project or orchestrating dozens of codebases
              across your organization, REMPO provides a unified interface to
              discover, visualize, and manage all your repositories in one
              place.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Built with developers in mind, REMPO combines powerful repository
              scanning, real-time status tracking, and AI-powered insights to
              help you stay organized and productive.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 text-2xl font-semibold">Key Features</h3>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="mr-3 text-primary">✓</span>
                <span>
                  <strong>Global Repository Scanning:</strong> Automatically
                  discover all Git repositories on your system with a single
                  click.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-primary">✓</span>
                <span>
                  <strong>Real-time Progress & Smart Caching:</strong>{" "}
                  Experience lightning-fast repository updates with intelligent
                  caching that optimizes performance.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-primary">✓</span>
                <span>
                  <strong>Repository Status & Commit History:</strong> View
                  detailed information about each repository, including commit
                  history, branch status, and recent changes.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-primary">✓</span>
                <span>
                  <strong>Built-in Terminal:</strong> Execute Git commands
                  directly from REMPO's integrated terminal with keyboard
                  shortcuts (press Ctrl+K).
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-primary">✓</span>
                <span>
                  <strong>AI-Powered Insights:</strong> Get intelligent
                  summaries and analysis of your repositories with lazy-loaded
                  AI insights.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-primary">✓</span>
                <span>
                  <strong>9 Beautiful Themes:</strong> Choose from carefully
                  designed themes that look great and reduce eye strain.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-primary">✓</span>
                <span>
                  <strong>System Integration:</strong> Minimize to system tray,
                  launch at startup, and seamlessly integrate REMPO into your
                  workflow.
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 text-2xl font-semibold">Why REMPO?</h3>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Managing multiple Git repositories can be overwhelming. Each
              repository has its own status, commit history, and context. REMPO
              solves this problem by bringing everything together in one
              beautiful, intuitive interface.
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              With REMPO, you can:
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                • Quickly discover all your repositories across your system
              </li>
              <li>• Monitor repository status and changes at a glance</li>
              <li>
                • Execute Git operations efficiently with a built-in terminal
              </li>
              <li>• Get AI-powered insights about your repositories</li>
              <li>
                • Customize your experience with themes and keyboard shortcuts
              </li>
              <li>
                • Integrate REMPO seamlessly into your development workflow
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 text-2xl font-semibold">For Whom?</h3>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              REMPO is designed for developers, teams, and organizations who
              want to:
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>• Manage multiple Git repositories efficiently</li>
              <li>• Have a single source of truth for repository status</li>
              <li>
                • Work faster with keyboard shortcuts and terminal integration
              </li>
              <li>• Understand their codebase better with AI insights</li>
              <li>• Keep their development environment organized</li>
              <li>
                • Use beautiful, themable interfaces that reduce development
                fatigue
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 text-2xl font-semibold">Our Mission</h3>
            <p className="text-gray-700 dark:text-gray-300">
              We believe developers should spend less time managing repositories
              and more time building amazing software. REMPO is our answer to
              making Git repository management beautiful, fast, and intelligent.
              We're committed to continuously improving REMPO based on your
              feedback and ensuring it remains the best tool for managing your
              global Git ecosystem.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
