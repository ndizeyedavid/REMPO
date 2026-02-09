import React, { useState } from "react";
import { X, GitBranch, MessageSquare, Send, Loader2 } from "lucide-react";

export default function CommitModal({ isOpen, onClose, onConfirm, repoName }) {
  const [branchName, setBranchName] = useState("");
  const [commitMessage, setCommitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!branchName || !commitMessage) return;

    setIsSubmitting(true);
    await onConfirm({ branchName, commitMessage });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-base-300 w-full max-w-md rounded-3xl shadow-2xl border border-base-content/10 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-base-content/10 flex items-center justify-between bg-base-200/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <GitBranch className="size-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Commit Changes</h3>
              <p className="text-xs opacity-50 truncate max-w-[200px]">{repoName}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-square opacity-60 hover:opacity-100"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold opacity-40 uppercase tracking-widest ml-1">Branch Name</label>
            <div className="relative">
              <GitBranch className="absolute left-4 top-1/2 -translate-y-1/2 size-4 opacity-40" />
              <input
                autoFocus
                type="text"
                placeholder="feature/new-sidebar"
                className="input input-bordered w-full pl-12 bg-base-100/50 border-base-content/10 rounded-xl focus:border-primary/50 transition-all"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold opacity-40 uppercase tracking-widest ml-1">Commit Message</label>
            <div className="relative">
              <MessageSquare className="absolute left-4 top-4 size-4 opacity-40" />
              <textarea
                placeholder="What did you change?"
                className="textarea textarea-bordered w-full pl-12 bg-base-100/50 border-base-content/10 rounded-xl focus:border-primary/50 transition-all min-h-[100px] pt-3.5"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !branchName || !commitMessage}
              className="btn btn-primary btn-block rounded-xl gap-2 font-bold shadow-lg shadow-primary/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Committing...
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  Push to Origin
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
