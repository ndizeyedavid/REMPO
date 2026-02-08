import React from "react";
import { Folder, GitBranch, Clock, Sparkles, MoreHorizontal, ChevronRight } from "lucide-react";

export default function ProjectListItem({ project }) {
  return (
    <div className="bg-base-300/30 p-3 rounded-xl border border-base-content/5 hover:border-primary/30 transition-all group flex items-center">
      {/* Icon */}
      <div className="flex gap-1.5 items-center">
        <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-content transition-colors shrink-0">
          <Folder className="size-5" />
        </div>

        {/* Name and Path */}
        <div className="min-w-0 w-48 shrink-0">
          <h3 className="font-semibold text-sm truncate">{project.name}</h3>
          <p className="text-[10px] opacity-40 font-mono truncate">{project.path}</p>
        </div>
      </div>

      <div className="flex gap-1 items-center">
        {/* Status Badge */}
        <div className="flex justify-start">
          <span
            className={`badge badge-sm gap-1.5 py-2.5 px-3 border-0 ${project.status === "Clean"
              ? "bg-success/10 text-success"
              : project.status === "Uncommitted" || project.status === "Uncommitted Changes"
                ? "bg-warning/10 text-warning"
                : project.status === "Conflicts"
                  ? "bg-error/10 text-error"
                  : "bg-info/10 text-info"
              }`}
          >
            <div className="size-1.5 rounded-full bg-current" />
            <span className="text-[11px] font-medium">{project.status}</span>
          </span>
        </div>

        {/* Branch */}
        <div className="w-24 shrink-0 flex items-center gap-1.5 opacity-60 bg-base-200">
          <GitBranch className="size-3.5" />
          <span className="text-xs truncate">{project.branch}</span>
        </div>
      </div>

      {/* Last Commit */}
      <div className="flex-1 min-w-0 flex items-center gap-2 opacity-50">
        <Clock className="size-3.5 shrink-0" />
        <span className="text-xs truncate">{project.lastCommit}</span>
      </div>

      {/* AI Summary Preview */}
      {/* <div className="w-48 shrink-0 flex items-center gap-2 text-primary/70">
        <Sparkles className="size-3.5 shrink-0" />
        <span className="text-xs truncate italic">{project.summary}</span>
      </div> */}

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0 ml-auto">
        <button className="btn btn-ghost btn-xs btn-square opacity-40 hover:opacity-100">
          <MoreHorizontal className="size-4" />
        </button>
        <button className="btn btn-ghost btn-xs btn-square opacity-40 hover:opacity-100">
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
