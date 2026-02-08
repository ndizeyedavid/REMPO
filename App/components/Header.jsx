import React from "react";
import { Sidebar, Square } from "lucide-react";

export default function Header({
    status = "Ready to scan",
    left,
    right,
    className = "",
}) {
    return (
        <header
            className={`flex h-12 items-center justify-between border-b border-base-content/10 bg-base-300 px-4 text-base-content ${className}`}
        >
            <div className="flex min-w-0 items-center gap-3">
                {left ?? (
                    <span className="inline-flex size-5 items-center justify-center rounded-md opacity-70 transition-colors hover:bg-base-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 cursor-pointer">
                        <Sidebar className="size-4" />
                    </span>
                )}
                <div className="min-w-0 truncate text-sm opacity-80">{status}</div>
            </div>

            {right ? <div className="flex items-center gap-2">{right}</div> : null}
        </header>
    );
}
