import React, { useEffect, useMemo, useRef, useState } from "react";
import { Terminal, X, CornerDownLeft } from "lucide-react";

const parseGitArgs = (input) => {
  const s = (input || "").trim();
  if (!s) return [];

  // Allow user to type either `git status` or just `status`
  const withoutGit = s.toLowerCase().startsWith("git ") ? s.slice(4) : s;

  const args = [];
  let cur = "";
  let quote = null;

  for (let i = 0; i < withoutGit.length; i++) {
    const ch = withoutGit[i];

    if (quote) {
      if (ch === quote) {
        quote = null;
      } else {
        cur += ch;
      }
      continue;
    }

    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }

    if (ch === " ") {
      if (cur) {
        args.push(cur);
        cur = "";
      }
      continue;
    }

    cur += ch;
  }

  if (cur) args.push(cur);
  return args;
};

export default function GitPalette({ isOpen, onClose, cwd }) {
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [entries, setEntries] = useState([]);
  const [running, setRunning] = useState(false);

  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  const folderName = useMemo(() => {
    if (!cwd) return "No folder selected";
    return cwd.split(/[\\/]/).pop();
  }, [cwd]);

  useEffect(() => {
    if (!isOpen) return;
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [isOpen]);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [entries, running]);

  const run = async () => {
    if (!cwd) {
      setEntries((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          cmd: command,
          ok: false,
          stdout: "",
          stderr: "No active scanned folder selected",
        },
      ]);
      return;
    }

    const args = parseGitArgs(command);
    if (args.length === 0) return;

    const cmdText = `git ${args.join(" ")}`;
    setHistory((prev) => {
      const next = [cmdText, ...prev];
      return next.slice(0, 50);
    });
    setHistoryIndex(-1);

    setRunning(true);
    try {
      const res = await window.electronAPI.runGitCommand({ cwd, args });
      setEntries((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          cmd: cmdText,
          ok: !!res?.ok,
          stdout: res?.stdout || "",
          stderr: res?.stderr || "",
        },
      ]);
    } catch (e) {
      setEntries((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          cmd: cmdText,
          ok: false,
          stdout: "",
          stderr: String(e?.message || e),
        },
      ]);
    } finally {
      setRunning(false);
      setCommand("");
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose?.();
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      run();
      return;
    }

    if (e.key === "ArrowUp") {
      if (history.length === 0) return;
      e.preventDefault();
      const nextIndex = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(nextIndex);
      const h = history[nextIndex] || "";
      setCommand(h.startsWith("git ") ? h : `git ${h}`);
      return;
    }

    if (e.key === "ArrowDown") {
      if (history.length === 0) return;
      e.preventDefault();
      const nextIndex = Math.max(historyIndex - 1, -1);
      setHistoryIndex(nextIndex);
      const h = nextIndex === -1 ? "" : history[nextIndex] || "";
      setCommand(h);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-150" onClick={onClose} />
      <div className="fixed left-0 right-0 bottom-0 z-151">
        <div className="mx-auto w-full max-w-5xl">
          <div className="bg-base-300 border border-base-content/10 rounded-t-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-base-content/10 bg-base-200/40">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Terminal className="size-5" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold truncate">Git Command Palette</div>
                  <div className="text-xs opacity-50 truncate">cwd: {folderName}</div>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm btn-square" onClick={onClose}>
                <X className="size-5" />
              </button>
            </div>

            <div ref={scrollRef} className="max-h-72 overflow-y-auto custom-scrollbar px-5 py-4 space-y-3">
              {entries.length === 0 ? (
                <div className="opacity-40 text-sm">
                  Type a git command (e.g. <span className="font-mono">status</span>, <span className="font-mono">log -5</span>, <span className="font-mono">checkout -b my-branch</span>)
                </div>
              ) : (
                entries.map((e) => (
                  <div key={e.id} className="space-y-2">
                    <div className="font-mono text-xs opacity-70">$ {e.cmd}</div>
                    {(e.stdout || "").trim() && (
                      <pre className="text-xs bg-base-100/40 border border-base-content/5 rounded-xl p-3 overflow-x-auto">{e.stdout}</pre>
                    )}
                    {(e.stderr || "").trim() && (
                      <pre className={`text-xs border rounded-xl p-3 overflow-x-auto ${e.ok ? "bg-warning/10 border-warning/20" : "bg-error/10 border-error/20"}`}>{e.stderr}</pre>
                    )}
                  </div>
                ))
              )}
              {running && (
                <div className="font-mono text-xs opacity-50">running...</div>
              )}
            </div>

            <div className="px-5 py-4 border-t border-base-content/10 bg-base-200/30">
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="text-[10px] font-bold opacity-40 uppercase tracking-widest ml-1">Command</label>
                  <input
                    ref={inputRef}
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="git status"
                    className="input input-bordered w-full bg-base-100/40 border-base-content/10 rounded-xl focus:border-primary/50 font-mono"
                    disabled={running}
                  />
                </div>
                <button
                  className="btn btn-primary rounded-xl gap-2"
                  onClick={run}
                  disabled={running || !command.trim()}
                  title="Run (Enter)"
                >
                  <CornerDownLeft className="size-4" />
                  Run
                </button>
              </div>
              <div className="mt-2 text-[10px] opacity-40">
                Enter to run. Esc to close. Up/Down for history.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
