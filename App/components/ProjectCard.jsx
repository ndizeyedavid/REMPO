import React from "react";
import { Folder, GitBranch, Clock, Sparkles, MoreHorizontal, ExternalLink, GitCommit, Trash2 } from "lucide-react";

export default function ProjectCard({ project, handleProjectClick }) {
    function verifyClickArea(e) {
        if (e.target.id != "menu") {
            handleProjectClick(project);
        }
    }
    return (
        <div className="bg-base-300/30 p-5 rounded-2xl border border-base-content/5 hover:border-primary/30 transition-all group relative" onClick={verifyClickArea}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-content transition-colors">
                        <Folder className="size-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">{project.name}</h3>
                        <p className="text-xs opacity-40 font-mono">{project.path}</p>
                    </div>
                </div>

                {/* Action Menu */}
                <div className="dropdown dropdown-end opacity-0 group-hover:opacity-100 transition-opacity" id="menu">
                    <button tabIndex={0} className="btn btn-ghost btn-sm btn-square rounded-lg bg-base-200/50">
                        <MoreHorizontal className="size-4" />
                    </button>
                    <ul tabIndex={0} className="dropdown-content z-1 menu p-2 shadow-2xl bg-base-300 rounded-xl w-52 mt-2 border border-base-content/10">
                        <li>
                            <button className="flex items-center gap-3 py-2.5">
                                <ExternalLink className="size-4 opacity-70" />
                                <span>Open in Editor</span>
                            </button>
                        </li>
                        <li>
                            <button className="flex items-center gap-3 py-2.5">
                                <GitCommit className="size-4 opacity-70" />
                                <span>Quick Commit</span>
                            </button>
                        </li>
                        <li>
                            <button className="flex items-center gap-3 py-2.5 border-b border-base-content/5 rounded-none pb-3 mb-1">
                                <GitBranch className="size-4 opacity-70" />
                                <span>Switch Branch</span>
                            </button>
                        </li>
                        <li>
                            <button className="flex items-center gap-3 py-2.5 text-error hover:bg-error/10">
                                <Trash2 className="size-4" />
                                <span>Remove from list</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="flex gap-2 mb-4">
                <span
                    className={`badge badge-sm gap-1 py-3 px-3 ${project.status === "Clean"
                        ? "badge-success bg-success/10 text-success border-success/20"
                        : project.status === "Uncommitted"
                            ? "badge-warning bg-warning/10 text-warning border-warning/20"
                            : "badge-info bg-info/10 text-info border-info/20"
                        }`}
                >
                    <div className="size-1.5 rounded-full bg-current" />
                    {project.status}
                </span>
                <span className="badge badge-sm badge-ghost py-3 px-3 gap-1 opacity-70">
                    <GitBranch className="size-3" />
                    {project.branch}
                </span>
            </div>

            <div className="text-sm opacity-60 mb-6 flex items-center gap-2">
                <Clock className="size-3" />
                {project.lastCommit}
            </div>

            <div className="space-y-3 pt-4 border-t border-base-content/5">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
                    <Sparkles className="size-3" />
                    AI Summary
                </div>
                <p className="text-sm opacity-70 leading-relaxed line-clamp-2 italic">
                    "{project.summary}"
                </p>
            </div>
        </div>
    );
}
