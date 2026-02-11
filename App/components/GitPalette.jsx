import React, { useEffect, useMemo, useRef, useState } from "react";
import { Terminal, X } from "lucide-react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

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
  const [running, setRunning] = useState(false);
  const runningRef = useRef(false);

  const terminalHostRef = useRef(null);
  const xtermRef = useRef(null);
  const fitRef = useRef(null);
  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);
  const inputRef = useRef("");

  const folderName = useMemo(() => {
    if (!cwd) return "No folder selected";
    return cwd.split(/[\\/]/).pop();
  }, [cwd]);

  const writePrompt = (term) => {
    term.write(`\r\n${folderName} $ `);
  };

  const clearInput = (term) => {
    const cur = inputRef.current || "";
    if (!cur) return;
    term.write("\b \b".repeat(cur.length));
    inputRef.current = "";
  };

  const setInput = (term, next) => {
    clearInput(term);
    if (next) term.write(next);
    inputRef.current = next;
  };

  const runCommand = async (term, text) => {
    const args = parseGitArgs(text);
    if (!args.length) {
      writePrompt(term);
      return;
    }

    if (!cwd) {
      term.write("\r\nNo active scanned folder selected\r\n");
      writePrompt(term);
      return;
    }

    const cmdText = `git ${args.join(" ")}`;
    term.write(`\r\n`);

    historyRef.current = [cmdText, ...historyRef.current].slice(0, 50);
    historyIndexRef.current = -1;

    runningRef.current = true;
    setRunning(true);
    try {
      const res = await window.electronAPI.runGitCommand({ cwd, args });
      const stdout = (res?.stdout || "").trimEnd();
      const stderr = (res?.stderr || "").trimEnd();
      if (stdout) term.write(`${stdout.replace(/\n/g, "\r\n")}\r\n`);
      if (stderr) term.write(`${stderr.replace(/\n/g, "\r\n")}\r\n`);
    } catch (e) {
      term.write(`${String(e?.message || e).replace(/\n/g, "\r\n")}\r\n`);
    } finally {
      runningRef.current = false;
      setRunning(false);
      writePrompt(term);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const host = terminalHostRef.current;
    if (!host) return;

    const term = new XTerm({
      convertEol: true,
      cursorBlink: true,
      fontFamily:
        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
      fontSize: 13,
      theme: {
        background: "#0b0b0b",
      },
    });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(host);
    fit.fit();

    xtermRef.current = term;
    fitRef.current = fit;

    term.write(`Welcome to Rempo Git\r\n`);
    term.write(`Type git commands like: status, log -5, checkout -b my-branch\r\n`);
    writePrompt(term);

    const ro = new ResizeObserver(() => {
      try {
        fit.fit();
      } catch (e) { }
    });
    ro.observe(host);

    const onKey = (e) => {
      const key = e.domEvent.key;

      if (key === "Escape") {
        e.domEvent.preventDefault();
        onClose?.();
        return;
      }

      if (runningRef.current) {
        if (key === "c" && e.domEvent.ctrlKey) {
          term.write("^C");
          writePrompt(term);
        }
        return;
      }

      if (key === "Backspace") {
        if (inputRef.current.length > 0) {
          term.write("\b \b");
          inputRef.current = inputRef.current.slice(0, -1);
        }
        return;
      }

      if (key === "Enter") {
        const text = inputRef.current;
        inputRef.current = "";
        runCommand(term, text);
        return;
      }

      if (key === "ArrowUp") {
        const hist = historyRef.current;
        if (!hist.length) return;
        const nextIndex = Math.min(historyIndexRef.current + 1, hist.length - 1);
        historyIndexRef.current = nextIndex;
        const cmd = hist[nextIndex] || "";
        setInput(term, cmd);
        return;
      }

      if (key === "ArrowDown") {
        const hist = historyRef.current;
        if (!hist.length) return;
        const nextIndex = Math.max(historyIndexRef.current - 1, -1);
        historyIndexRef.current = nextIndex;
        const cmd = nextIndex === -1 ? "" : hist[nextIndex] || "";
        setInput(term, cmd);
        return;
      }

      if (e.domEvent.ctrlKey || e.domEvent.metaKey || e.domEvent.altKey) return;
      if (!e.key || e.key.length !== 1) return;

      term.write(e.key);
      inputRef.current += e.key;
    };

    const keyDisposable = term.onKey(onKey);

    return () => {
      try {
        keyDisposable?.dispose?.();
      } catch (e) { }
      try {
        ro.disconnect();
      } catch (e) { }
      try {
        term.dispose();
      } catch (e) { }
      xtermRef.current = null;
      fitRef.current = null;
      inputRef.current = "";
      historyIndexRef.current = -1;
    };
  }, [isOpen, folderName, cwd, onClose]);

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

            <div className="px-5 py-4">
              <div
                ref={terminalHostRef}
                className="h-80 w-full rounded-2xl border border-base-content/10 overflow-hidden"
                style={{ background: "#0b0b0b" }}
              />
              <div className="mt-2 text-[10px] opacity-40">Enter to run. Esc to close. Up/Down for history.</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
