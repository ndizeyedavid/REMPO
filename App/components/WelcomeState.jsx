import React from "react";
import { Sparkles, ArrowRight, Infinity, Timer, Folder } from "lucide-react";

export default function WelcomeState({ onStartScan }) {
  return (
    <div className="w-full max-w-xl text-center">
      <div className="mx-auto mb-6 grid size-16 place-items-center rounded-2xl bg-primary/15 border border-primary/50">
        <div className="grid size-12 place-items-center rounded-xl text-primary">
          <Folder className="size-7" />
        </div>
      </div>

      <h1 className="text-2xl font-semibold tracking-tight">
        Rediscover Your Projects
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm opacity-70">
        Scan your local Git repositories to get an instant overview of all
        your projects with AI-powered summaries that help you remember what
        you were working on.
      </p>

      <div className="mt-7 flex justify-center">
        <button
          type="button"
          className="btn btn-primary rounded-full px-8"
          onClick={onStartScan}
        >
          Scan Projects
          <ArrowRight className="size-4" />
        </button>
      </div>

      {/* <div className="mt-10 grid grid-cols-3 gap-8">
        <div className="text-center">
          <div className="mx-auto mb-2 flex items-center justify-center gap-2 text-base-content">
            <Infinity className="size-5 opacity-80" />
          </div>
          <div className="text-xs opacity-70">Projects Supported</div>
        </div>
        <div className="text-center">
          <div className="mx-auto mb-2 flex items-center justify-center gap-2 text-primary">
            <span className="text-2xl font-semibold leading-none">AI</span>
          </div>
          <div className="text-xs opacity-70">Powered Summaries</div>
        </div>
        <div className="text-center">
          <div className="mx-auto mb-2 flex items-center justify-center gap-2 text-base-content">
            <Timer className="size-5 opacity-80" />
            <span className="text-lg font-semibold leading-none">&lt;1s</span>
          </div>
          <div className="text-xs opacity-70">Instant Context</div>
        </div>
      </div> */}
    </div>
  );
}
