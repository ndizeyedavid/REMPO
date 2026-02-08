import React from "react";
import { Folder, Loader2, Search } from "lucide-react";

export default function ScanningState({ folders, repos, totalFolders = 114 }) {
  const progress = Math.min((folders / totalFolders) * 100, 100);

  return (
    <div className="w-full max-w-md text-center">
      <div className="relative mx-auto mb-8 grid size-20 place-items-center rounded-2xl  bg-primary/10 border border-primary/50 shadow-sm">
        <div className="grid size-14 place-items-center rounded-xl  text-primary">
          <Search className="size-8" />
        </div>
        <div className="absolute -bottom-1 -right-1 rounded-full bg-base-100 p-1">
          <Loader2 className="size-5 animate-spin text-primary" />
        </div>
      </div>

      <h2 className="text-xl font-medium tracking-tight">
        Scanning your projects...
      </h2>
      <p className="mt-2 text-sm opacity-50">
        Looking for Git repositories in your project folders
      </p>

      <div className="mt-10 grid grid-cols-2 gap-px bg-base-content/5 overflow-hidden rounded-xl">
        <div className="bg-base-100 p-6">
          <div className="text-2xl font-semibold">{folders}</div>
          <div className="mt-1 text-xs opacity-50 uppercase tracking-wider font-medium">
            Folders Scanned
          </div>
        </div>
        <div className="bg-base-100 p-6">
          <div className="text-2xl font-semibold text-primary">{repos}</div>
          <div className="mt-1 text-xs opacity-50 uppercase tracking-wider font-medium">
            Repos Found
          </div>
        </div>
      </div>

      <div className="mt-10 h-1.5 w-full overflow-hidden rounded-full bg-base-200">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
