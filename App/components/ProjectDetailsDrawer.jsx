import React, { useState, useEffect } from "react";
import {
  X, Folder, GitBranch, Sparkles, GitCommit,
  ExternalLink, FileCode, Clock, ChevronRight,
  Loader2, Github
} from "lucide-react";
import CommitModal from "./CommitModal";
import toast from "react-hot-toast";

export default function ProjectDetailsDrawer({ project, onClose, onLogActivity, aiSettings, aiResponses, onTriggerSummary }) {
  const [details, setDetails] = useState({ commits: [], files: [] });
  const [loading, setLoading] = useState(true);
  const [isCommitModalOpen, setIsCommitModalOpen] = useState(false);
  const [remoteUrl, setRemoteUrl] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!project?.path) return;
      setLoading(true);
      try {
        const [repoData, url] = await Promise.all([
          window.electronAPI.getRepoDetails(project.path),
          window.electronAPI.getRemoteUrl(project.path)
        ]);
        setDetails(repoData);
        setRemoteUrl(url);
      } catch (error) {
        console.error("Failed to load repo details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [project?.path]);

  const aiEnabled = !!aiSettings?.enabled;
  const aiSummary = project?.path ? aiResponses?.[project.path] : null;

  const triggerSummary = async () => {
    if (!project?.path) return;
    if (!aiEnabled) return;
    if (aiSummary) return;

    setAiLoading(true);
    setAiError(null);
    try {
      await onTriggerSummary?.(project.path);
    } catch (e) {
      setAiError(String(e?.message || e));
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    if (!project?.path) return;
    triggerSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.path, aiEnabled]);

  const handleOpenGithub = () => {
    if (remoteUrl) {
      window.electronAPI.openInBrowser(remoteUrl);
    } else {
      toast.error("No remote URL found for this repository");
    }
  };

  const handleCommitConfirm = async ({ branchName, commitMessage }) => {
    try {
      const result = await window.electronAPI.commitAndPush({
        repoPath: project.path,
        branchName,
        commitMessage
      });

      if (result.success) {
        toast.success(`Successfully pushed to branch ${branchName}`);

        // Log activity
        if (onLogActivity) {
          onLogActivity({
            project: project.name,
            action: `Pushed to ${branchName}`,
            type: 'push'
          });
        }

        // Refresh details after success
        const data = await window.electronAPI.getRepoDetails(project.path);
        setDetails(data);
      } else {
        toast.error(`Failed to commit: ${result.error}`);
      }
    } catch (error) {
      console.error("Commit flow failed:", error);
      toast.error("An unexpected error occurred during commit");
    }
  };

  if (!project) return null;

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-100 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 pt-6 h-full w-full max-w-lg bg-base-300 shadow-2xl z-101 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-base-content/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Folder className="size-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{project.name}</h2>
              <p className="text-xs opacity-40 font-mono">{project.path}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {remoteUrl && (
              <button
                onClick={handleOpenGithub}
                className="btn btn-ghost btn-sm btn-square opacity-60 hover:opacity-100 text-primary"
                title="Open on GitHub"
              >
                <Github className="size-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm btn-square opacity-60 hover:opacity-100"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {/* Status & Branch */}
          <div className="flex gap-2">
            <span className="badge badge-success bg-success/10 text-success border-0 gap-1.5 py-3 px-3">
              <div className="size-1.5 rounded-full bg-success" />
              {project.status}
            </span>
            <span className="badge badge-ghost bg-base-content/5 border-0 gap-1.5 py-3 px-3 opacity-70">
              <GitBranch className="size-3.5" />
              {project.branch}
            </span>
          </div>

          {/* AI Context Summary */}
          <div className="bg-primary/5 rounded-2xl border border-primary/20 p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
              <Sparkles className="size-4" />
              AI Context Summary
            </div>
            {aiEnabled ? (
              <>
                {aiSummary ? (
                  <p className="text-sm leading-relaxed opacity-80">{aiSummary}</p>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm leading-relaxed opacity-60">
                      {aiLoading ? "Generating summary..." : "No summary yet."}
                    </p>
                    {aiError && (
                      <div className="text-xs bg-error/10 border border-error/20 rounded-xl p-3">
                        {aiError}
                      </div>
                    )}
                    <button
                      className="btn btn-xs btn-primary rounded-lg"
                      onClick={() => {
                        setAiError(null);
                        setAiLoading(false);
                        onTriggerSummary?.(project.path);
                      }}
                      disabled={aiLoading}
                    >
                      {aiLoading ? (
                        <>
                          <Loader2 className="size-3 animate-spin" />
                          Generating
                        </>
                      ) : (
                        "Generate"
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm leading-relaxed opacity-60">
                AI summaries are disabled in Settings.
              </p>
            )}
          </div>

          {/* Recent Commits */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold opacity-60">
              <GitCommit className="size-4" />
              Recent Commits
            </div>
            <div className="space-y-3">
              {loading ? (
                <div className="flex items-center justify-center py-10 opacity-40 gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  <span className="text-sm">Loading commits...</span>
                </div>
              ) : details.commits.length > 0 ? (
                details.commits.map((commit) => (
                  <div key={commit.id} className="bg-base-100/40 p-4 rounded-xl border border-base-content/5 group cursor-pointer hover:bg-base-100/60 transition-colors">
                    <div className="flex gap-3">
                      <span className="text-xs font-mono text-primary/70">{commit.id}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{commit.message}</p>
                        <p className="text-[10px] opacity-40 mt-1">{formatDate(commit.time)} • {commit.author}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm opacity-40 py-4 text-center italic">No recent commits found</p>
              )}
            </div>
          </div>

          {/* Changed Files */}
          <div className="space-y-4 pb-4">
            <div className="flex items-center gap-2 text-sm font-bold opacity-60">
              <FileCode className="size-4" />
              Changed Files
            </div>
            <ul className="space-y-3">
              {loading ? (
                <div className="flex items-center justify-center py-6 opacity-40 gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  <span className="text-sm">Loading files...</span>
                </div>
              ) : details.files.length > 0 ? (
                details.files.map((file) => (
                  <li key={file.name} className="flex items-center gap-3 text-sm group cursor-pointer">
                    <div className={`size-1.5 rounded-full ${file.status === 'added' ? 'bg-success' :
                      file.status === 'deleted' ? 'bg-error' : 'bg-warning'
                      }`} />
                    <span className="opacity-70 group-hover:opacity-100 transition-opacity truncate flex-1">{file.name}</span>
                    <span className="text-[10px] opacity-30 uppercase font-bold">{file.status}</span>
                  </li>
                ))
              ) : (
                <p className="text-sm opacity-40 text-center italic">No pending changes</p>
              )}
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-base-content/10 grid grid-cols-2 gap-4 bg-base-300">
          <button
            onClick={() => setIsCommitModalOpen(true)}
            className="btn btn-ghost bg-base-content/5 border-base-content/10 rounded-xl gap-2 font-medium"
          >
            <GitCommit className="size-4" />
            Commit Changes
          </button>
          <button
            onClick={() => window.electronAPI.openInEditor(project.path)}
            className="btn btn-primary rounded-xl gap-2 font-medium"
          >
            <ExternalLink className="size-4" />
            Open in Editor
          </button>
        </div>
      </div>

      <CommitModal
        isOpen={isCommitModalOpen}
        onClose={() => setIsCommitModalOpen(false)}
        onConfirm={handleCommitConfirm}
        repoName={project.name}
      />
    </>
  );
}
