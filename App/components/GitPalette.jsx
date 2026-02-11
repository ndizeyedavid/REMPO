import React, { useEffect, useMemo, useRef, useState } from "react";
import { Terminal, X } from "lucide-react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

export default function GitPalette({ isOpen, onClose, cwd }) {
  const [ptyId, setPtyId] = useState(null);
  const [ptyError, setPtyError] = useState(null);

  const terminalHostRef = useRef(null);
  const xtermRef = useRef(null);
  const fitRef = useRef(null);
  const disposeDataListenerRef = useRef(null);
  const disposeExitListenerRef = useRef(null);
  const ptyIdRef = useRef(null);

  const folderName = useMemo(() => {
    if (!cwd) return "No folder selected";
    return cwd.split(/[\\/]/).pop();
  }, [cwd]);

  const disposePty = async (id) => {
    if (!id) return;
    try {
      await window.electronAPI?.ptyDispose?.({ id });
    } catch (e) { }
  };

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;
    let cleanupObserver;

    const cleanup = async () => {
      try {
        if (typeof cleanupObserver === "function") cleanupObserver();
      } catch (e) { }

      try {
        disposeDataListenerRef.current?.();
      } catch (e) { }
      try {
        disposeExitListenerRef.current?.();
      } catch (e) { }

      disposeDataListenerRef.current = null;
      disposeExitListenerRef.current = null;

      const id = ptyIdRef.current;
      ptyIdRef.current = null;
      setPtyId(null);
      await disposePty(id);

      try {
        xtermRef.current?.dispose?.();
      } catch (e) { }
      xtermRef.current = null;
      fitRef.current = null;
    };

    const start = async () => {
      await cleanup();
      if (cancelled) return;

      setPtyError(null);
      const host = terminalHostRef.current;
      if (!host) return;

      const xterm = new XTerm({
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
      xterm.loadAddon(fit);

      xterm.open(host);
      fit.fit();

      xtermRef.current = xterm;
      fitRef.current = fit;

      const initialCols = xterm.cols;
      const initialRows = xterm.rows;

      const res = await window.electronAPI?.ptyCreate?.({
        cwd: cwd || undefined,
        cols: initialCols,
        rows: initialRows,
      });

      if (cancelled) {
        xterm.dispose();
        return;
      }

      if (!res?.ok) {
        setPtyError(res?.error || "Failed to start terminal");
        xterm.dispose();
        return;
      }

      const id = res.id;
      ptyIdRef.current = id;
      setPtyId(id);

      disposeDataListenerRef.current = window.electronAPI?.onPtyData?.(({ id: msgId, data }) => {
        if (msgId !== id) return;
        xterm.write(data);
      });
      disposeExitListenerRef.current = window.electronAPI?.onPtyExit?.(({ id: msgId }) => {
        if (msgId !== id) return;
        ptyIdRef.current = null;
        setPtyId(null);
      });

      xterm.onData((data) => {
        window.electronAPI?.ptyWrite?.({ id, data });
      });

      const ro = new ResizeObserver(() => {
        try {
          fit.fit();
          window.electronAPI?.ptyResize?.({ id, cols: xterm.cols, rows: xterm.rows });
        } catch (e) { }
      });
      ro.observe(host);

      xterm.attachCustomKeyEventHandler((e) => {
        if (e.key === "Escape") {
          onClose?.();
          return false;
        }
        return true;
      });

      cleanupObserver = () => {
        try {
          ro.disconnect();
        } catch (e) { }
      };
    };

    start();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [isOpen, cwd, onClose]);

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
                  <div className="font-bold truncate">Terminal</div>
                  <div className="text-xs opacity-50 truncate">cwd: {folderName}</div>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm btn-square" onClick={onClose}>
                <X className="size-5" />
              </button>
            </div>

            <div className="px-5 py-4">
              {ptyError ? (
                <div className="text-sm bg-error/10 border border-error/20 rounded-xl p-4">
                  {ptyError}
                </div>
              ) : (
                <div
                  ref={terminalHostRef}
                  className="h-80 w-full px-2 border border-base-content/10 overflow-hidden"
                  style={{ background: "#0b0b0b" }}
                />
              )}
              <div className="mt-2 text-[10px] opacity-40">Esc to close.</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
