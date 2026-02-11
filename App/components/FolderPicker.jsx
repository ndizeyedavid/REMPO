import React, { useEffect, useMemo, useState } from "react";
import {
  X,
  ChevronRight,
  HardDrive,
  Folder,
  ArrowLeft,
  ArrowUp,
  Monitor,
  Download,
  FileText,
  Image,
  Music,
  Video,
  Clock,
} from "lucide-react";

const normalizePath = (p) => {
  if (!p || typeof p !== "string") return "";
  return p;
};

const splitPath = (p) => {
  const path = normalizePath(p);
  if (!path) return [];

  if (/^[A-Za-z]:\\?$/.test(path)) {
    const drive = path.slice(0, 2).toUpperCase();
    return [drive + "\\"];
  }

  const parts = path.split(/[\\/]+/).filter(Boolean);

  if (/^[A-Za-z]:$/.test(parts[0])) {
    const drive = parts[0].toUpperCase();
    const rest = parts.slice(1);
    return [drive + "\\", ...rest];
  }

  return parts;
};

const joinPath = (segments) => {
  if (!segments.length) return "";

  const first = segments[0];
  if (/^[A-Za-z]:\\$/.test(first)) {
    const drive = first;
    const rest = segments.slice(1);
    if (!rest.length) return drive;
    return drive + rest.join("\\");
  }

  return segments.join("/");
};

export default function FolderPicker({
  isOpen,
  onClose,
  onSelect,
  initialPath,
  recentFolders = [],
}) {
  const [currentPath, setCurrentPath] = useState(initialPath || "");
  const [dirs, setDirs] = useState([]);
  const [drives, setDrives] = useState([]);
  const [quickAccess, setQuickAccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const breadcrumbs = useMemo(() => splitPath(currentPath), [currentPath]);

  const canGoBack = historyIndex > 0;
  const canGoUp = breadcrumbs.length > 1;

  const pushHistory = (nextPath) => {
    const normalized = normalizePath(nextPath);
    setHistory((prev) => {
      const base = prev.slice(0, historyIndex + 1);
      const next = [...base, normalized];
      return next;
    });
    setHistoryIndex((prev) => prev + 1);
  };

  const goToPath = (nextPath, { addHistory = true } = {}) => {
    const normalized = normalizePath(nextPath);
    setCurrentPath(normalized);
    if (addHistory) pushHistory(normalized);
  };

  const goBack = () => {
    if (!canGoBack) return;
    const nextIndex = historyIndex - 1;
    setHistoryIndex(nextIndex);
    setCurrentPath(history[nextIndex] || "");
  };

  const goUp = () => {
    if (!canGoUp) return;
    const nextSegments = breadcrumbs.slice(0, -1);
    const nextPath = joinPath(nextSegments);
    goToPath(nextPath);
  };

  useEffect(() => {
    if (!isOpen) return;

    const init = async () => {
      setError(null);
      setLoading(true);
      try {
        const [homeRes, drivesRes, quickRes] = await Promise.all([
          window.electronAPI.getHomeDir(),
          window.electronAPI.listDrives(),
          window.electronAPI.getQuickAccessPaths(),
        ]);

        if (drivesRes?.ok) setDrives(drivesRes.drives || []);
        if (quickRes?.ok) setQuickAccess(quickRes.paths || null);
        if (!currentPath) {
          if (initialPath) {
            setCurrentPath(initialPath);
            setHistory([initialPath]);
            setHistoryIndex(0);
          } else if (quickRes?.ok && quickRes.paths?.desktop) {
            setCurrentPath(quickRes.paths.desktop);
            setHistory([quickRes.paths.desktop]);
            setHistoryIndex(0);
          } else if (homeRes?.ok && homeRes.path) {
            setCurrentPath(homeRes.path);
            setHistory([homeRes.path]);
            setHistoryIndex(0);
          } else if (drivesRes?.ok && (drivesRes.drives || []).length > 0) {
            const first = drivesRes.drives[0].path;
            setCurrentPath(first);
            setHistory([first]);
            setHistoryIndex(0);
          }
        } else if (historyIndex === -1) {
          setHistory([currentPath]);
          setHistoryIndex(0);
        }
      } catch (e) {
        setError(String(e?.message || e));
      } finally {
        setLoading(false);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (!currentPath) return;

    const fetchDir = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await window.electronAPI.listDir({ dirPath: currentPath });
        if (!res?.ok) {
          setDirs([]);
          setError(res?.error || "Failed to list directory");
          return;
        }
        setDirs(res.dirs || []);
      } catch (e) {
        setDirs([]);
        setError(String(e?.message || e));
      } finally {
        setLoading(false);
      }
    };

    fetchDir();
  }, [isOpen, currentPath]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose?.();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickItems = [
    {
      key: "desktop",
      label: "Desktop",
      icon: Monitor,
      path: quickAccess?.desktop,
    },
    {
      key: "downloads",
      label: "Downloads",
      icon: Download,
      path: quickAccess?.downloads,
    },
    {
      key: "documents",
      label: "Documents",
      icon: FileText,
      path: quickAccess?.documents,
    },
    {
      key: "pictures",
      label: "Pictures",
      icon: Image,
      path: quickAccess?.pictures,
    },
    {
      key: "music",
      label: "Music",
      icon: Music,
      path: quickAccess?.music,
    },
    {
      key: "videos",
      label: "Videos",
      icon: Video,
      path: quickAccess?.videos,
    },
  ].filter((i) => !!i.path);

  const recentItems = Array.isArray(recentFolders)
    ? recentFolders.filter(Boolean).slice(0, 8)
    : [];

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-200" onClick={onClose} />
      <div className="fixed inset-0 z-201 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl bg-base-300 border border-base-content/10 rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-base-content/10 bg-base-200/40">
            <div className="min-w-0">
              <div className="font-bold truncate">Select a folder to scan</div>
              <div className="text-xs opacity-50 truncate">{currentPath || ""}</div>
            </div>
            <button className="btn btn-ghost btn-sm btn-square" onClick={onClose}>
              <X className="size-5" />
            </button>
          </div>

          <div className="px-6 py-4 border-b border-base-content/10 flex items-center gap-2">
            <button className="btn btn-ghost btn-sm btn-square" onClick={goBack} disabled={!canGoBack}>
              <ArrowLeft className="size-4" />
            </button>
            <button className="btn btn-ghost btn-sm btn-square" onClick={goUp} disabled={!canGoUp}>
              <ArrowUp className="size-4" />
            </button>

            <div className="flex items-center gap-1 min-w-0 overflow-x-auto custom-scrollbar">
              {breadcrumbs.map((seg, idx) => {
                const nextPath = joinPath(breadcrumbs.slice(0, idx + 1));
                return (
                  <div key={`${seg}-${idx}`} className="flex items-center gap-1">
                    {idx > 0 && <ChevronRight className="size-4 opacity-40" />}
                    <button
                      className="btn btn-ghost btn-sm rounded-xl"
                      onClick={() => goToPath(nextPath)}
                      title={nextPath}
                    >
                      {seg}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-12 min-h-[420px]">
            <div className="col-span-3 border-r border-base-content/10 bg-base-200/20 p-3">
              {quickItems.length > 0 && (
                <>
                  <div className="text-xs font-bold uppercase tracking-widest opacity-40 px-2 pb-2">Quick Access</div>
                  <div className="space-y-1">
                    {quickItems.map((q) => {
                      const Icon = q.icon;
                      return (
                        <button
                          key={q.key}
                          className={`btn btn-ghost btn-sm w-full justify-start rounded-xl ${currentPath?.toLowerCase()?.startsWith(q.path.toLowerCase()) ? "bg-base-content/5" : ""}`}
                          onClick={() => goToPath(q.path)}
                          title={q.path}
                        >
                          <Icon className="size-4 opacity-70" />
                          {q.label}
                        </button>
                      );
                    })}
                  </div>
                  <div className="divider my-3" />
                </>
              )}

              {recentItems.length > 0 && (
                <>
                  <div className="text-xs font-bold uppercase tracking-widest opacity-40 px-2 pb-2">Recent</div>
                  <div className="space-y-1">
                    {recentItems.map((p) => (
                      <button
                        key={p}
                        className={`btn btn-ghost btn-sm w-full justify-start rounded-xl ${currentPath?.toLowerCase()?.startsWith(String(p).toLowerCase()) ? "bg-base-content/5" : ""}`}
                        onClick={() => goToPath(p)}
                        title={p}
                      >
                        <Clock className="size-4 opacity-70" />
                        <span className="truncate">{String(p).split(/[\\/]/).pop()}</span>
                      </button>
                    ))}
                  </div>
                  <div className="divider my-3" />
                </>
              )}

              <div className="text-xs font-bold uppercase tracking-widest opacity-40 px-2 pb-2">Drives</div>
              <div className="space-y-1">
                {(drives || []).map((d) => (
                  <button
                    key={d.path}
                    className={`btn btn-ghost btn-sm w-full justify-start rounded-xl ${currentPath?.toLowerCase()?.startsWith(d.path.toLowerCase()) ? "bg-base-content/5" : ""}`}
                    onClick={() => goToPath(d.path)}
                  >
                    <HardDrive className="size-4 opacity-70" />
                    {d.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-span-9 p-4">
              {error && (
                <div className="mb-3 text-xs bg-error/10 border border-error/20 rounded-xl p-3">{error}</div>
              )}

              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-bold uppercase tracking-widest opacity-40">Folders</div>
                {loading && <div className="text-xs opacity-40">Loading...</div>}
              </div>

              <div className="max-h-[460px] overflow-y-auto custom-scrollbar pr-1">
                {dirs.length === 0 && !loading ? (
                  <div className="opacity-40 text-sm py-10 text-center">No folders found</div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {dirs.map((d) => (
                      <button
                        key={d.path}
                        className="btn btn-ghost justify-start rounded-2xl border border-base-content/10 bg-base-100/30 hover:bg-base-100/50"
                        onClick={() => goToPath(d.path)}
                        title={d.path}
                      >
                        <Folder className="size-4 opacity-70" />
                        <span className="truncate">{d.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-end gap-3">
                <button className="btn btn-ghost rounded-xl" onClick={onClose}>Cancel</button>
                <button
                  className="btn btn-primary rounded-xl"
                  onClick={() => onSelect?.(currentPath)}
                  disabled={!currentPath || loading}
                >
                  Select folder
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
