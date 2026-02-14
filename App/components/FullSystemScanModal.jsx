import React, { useEffect, useMemo, useState } from "react";
import { AlertTriangle, HardDrive, X } from "lucide-react";

export default function FullSystemScanModal({ isOpen, onClose, onConfirm }) {
  const [isLoading, setIsLoading] = useState(false);
  const [drives, setDrives] = useState([]);
  const [selected, setSelected] = useState({});
  const allSelected = useMemo(() => {
    if (!drives.length) return false;
    return drives.every((d) => selected[d.path]);
  }, [drives, selected]);

  useEffect(() => {
    if (!isOpen) return;

    const load = async () => {
      setIsLoading(true);
      try {
        const res = await window.electronAPI.listDrives();
        const next = res?.ok && Array.isArray(res.drives) ? res.drives : [];
        setDrives(next);
        const defaults = {};
        next.forEach((d) => {
          defaults[d.path] = true;
        });
        setSelected(defaults);
      } catch (e) {
        setDrives([]);
        setSelected({});
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleAll = () => {
    const next = {};
    const target = !allSelected;
    drives.forEach((d) => {
      next[d.path] = target;
    });
    setSelected(next);
  };

  const toggleDrive = (path) => {
    setSelected((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const selectedDrives = drives.filter((d) => selected[d.path]);

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-200"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-201 flex items-center justify-center p-4">
        <div className="w-full max-w-xl bg-base-300 border border-base-content/10 rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-base-content/10 bg-base-200/40">
            <div className="min-w-0">
              <div className="font-bold truncate flex items-center gap-2">
                <AlertTriangle className="size-4 text-warning" />
                Full System Scan
              </div>
              <div className="text-xs opacity-50 truncate">
                This can take a while depending on disk size and number of files.
              </div>
            </div>
            <button className="btn btn-ghost btn-sm btn-square" onClick={onClose}>
              <X className="size-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm">
              <div className="font-semibold">Heads up</div>
              <div className="opacity-70 mt-1">
                We&apos;ll scan selected drives for folders containing a <span className="font-mono">.git</span> directory.
                System folders are skipped to keep the scan fast.
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Choose drives to scan</div>
              <button className="btn btn-ghost btn-sm" onClick={toggleAll}>
                {allSelected ? "Unselect all" : "Select all"}
              </button>
            </div>

            <div className="rounded-2xl border border-base-content/10 bg-base-200/30 overflow-hidden">
              {isLoading ? (
                <div className="p-4 text-sm opacity-60">Loading drives...</div>
              ) : drives.length === 0 ? (
                <div className="p-4 text-sm opacity-60">No drives found.</div>
              ) : (
                <div className="divide-y divide-base-content/10">
                  {drives.map((d) => (
                    <button
                      type="button"
                      key={d.path}
                      onClick={() => toggleDrive(d.path)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-base-content/5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                          <HardDrive className="size-4" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{d.name}</div>
                          <div className="text-xs opacity-50 font-mono">{d.path}</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        checked={!!selected[d.path]}
                        onChange={() => toggleDrive(d.path)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button className="btn btn-ghost rounded-xl" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn btn-primary rounded-xl"
                disabled={selectedDrives.length === 0 || isLoading}
                onClick={() => onConfirm(selectedDrives.map((d) => d.path))}
              >
                Start scan ({selectedDrives.length})
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
