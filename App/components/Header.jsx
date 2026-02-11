import React from "react";
import { Sidebar, Minus, Square, X, Home } from "lucide-react";

export default function Header({
    status = "Ready to scan",
    left,
    right,
    setView,
    className = "",
}) {

    return (
        <header
            className={`flex h-12 items-center justify-between border-b border-base-content/10 bg-base-300 px-4 text-base-content select-none ${className}`}
            style={{ WebkitAppRegion: "drag" }}
            onDoubleClick={() => window.electronAPI?.windowToggleMaximize?.()}
        >
            <div className="flex min-w-0 items-center gap-3" style={{ WebkitAppRegion: "no-drag" }}>
                {left ?? (
                    <span onClick={() => setView("welcome")} className="inline-flex size-5 items-center justify-center rounded-md opacity-70 hover:opacity-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 cursor-pointer">
                        <Home className="size-5" />
                    </span>
                )}
                <div className="min-w-0 truncate text-sm opacity-80">{status}</div>
            </div>

            <div className="flex items-center gap-2" style={{ WebkitAppRegion: "no-drag" }}>
                {right ? <div className="flex items-center gap-2">{right}</div> : null}

                <div className="ml-2 flex items-center gap-1">
                    <button
                        className="btn btn-ghost btn-xs btn-square"
                        onClick={() => window.electronAPI?.windowMinimize?.()}
                        title="Minimize"
                    >
                        <Minus className="size-4" />
                    </button>
                    <button
                        className="btn btn-ghost btn-xs btn-square"
                        onClick={() => window.electronAPI?.windowToggleMaximize?.()}
                        title="Maximize"
                    >
                        <Square className="size-4" />
                    </button>
                    <button
                        className="btn btn-ghost btn-xs btn-square hover:btn-error"
                        onClick={() => window.electronAPI?.windowClose?.()}
                        title="Close"
                    >
                        <X className="size-4" />
                    </button>
                </div>
            </div>
        </header>
    );
}
