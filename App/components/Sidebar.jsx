import { Folder, ScanLine, Settings, RefreshCcw, MoreVertical, Pin, Trash2, PinOff } from "lucide-react";

export default function Sidebar({
    watchedFolders = [],
    pinnedFolders = [],
    onScanProjects,
    onRefreshProjects,
    onPinFolder,
    onRemoveFolder,
    primaryActionVariant,
    onSettings,
    onFolderClick,
    title = "Rempo",
    subtitle = "Remember what you were building",
}) {
    const resolvedVariant = primaryActionVariant || "scan";

    // Sort: Pinned first, then by watchedFolders order
    const allFolders = [
        ...pinnedFolders.map(p => ({ path: p, isPinned: true })),
        ...watchedFolders
            .filter(w => !pinnedFolders.includes(w))
            .map(w => ({ path: w, isPinned: false }))
    ];

    return (
        <aside className="flex h-screen w-80 flex-col border-r border-base-content/10 bg-base-300 text-base-content">
            <div className="">
                <div className="flex items-center gap-3 px-5 py-4">
                    <div className="grid size-10 place-items-center rounded-xl bg-primary text-primary-content">
                        <Folder className="size-5" />
                    </div>
                    <div className="min-w-0">
                        <div className="truncate text-lg font-semibold">{title}</div>
                        <div className="truncate text-sm opacity-70">{subtitle}</div>
                    </div>
                </div>

                <div className="divider m-0" />

                <div className="px-5 py-4">
                    <div className={`grid ${resolvedVariant == "refresh" ? "grid-cols-2" : "grid-cols-1"} gap-3`}>
                        <button
                            type="button"
                            className="btn btn-primary btn-block rounded-full shadow-lg shadow-primary/20"
                            onClick={onScanProjects}
                        >
                            <ScanLine className="size-5" />
                            {resolvedVariant == "refresh" ? "Scan" : "Scan Projects"}
                        </button>

                        {resolvedVariant === "refresh" && (
                            <button
                                type="button"
                                className="btn btn-ghost btn-block rounded-full border border-base-content/10 bg-base-100/30"
                                onClick={onRefreshProjects}
                            >
                                <RefreshCcw className="size-5" />
                                Refresh
                            </button>
                        )}
                    </div>
                </div>
            </div>


            <div className="flex min-h-0 flex-1 flex-col px-2">
                <div className="px-3 pb-2 text-xs font-bold uppercase tracking-widest opacity-40">
                    Recent Folders
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar px-1">
                    {allFolders.length > 0 ? (
                        <ul className="menu menu-sm w-full gap-1">
                            {allFolders.map(({ path, isPinned }) => (
                                <li key={path} className="group relative">
                                    <div className="flex items-center p-0">
                                        <button
                                            type="button"
                                            className="flex justify-start gap-3 rounded-xl hover:bg-base-content/5 py-3 px-3 w-full"
                                            onClick={() => onFolderClick?.(path)}
                                        >
                                            <div className="p-1.5 px-2 flex items-center justify-center rounded-lg bg-base-content/5 group-hover:bg-primary/10 group-hover:text-primary transition-colors relative">
                                                <Folder className="size-4.5 opacity-70" />
                                                {isPinned && (
                                                    <Pin className="size-2 absolute -top-0.5 -right-0.5 text-primary fill-primary" />
                                                )}
                                            </div>
                                            <div className="flex flex-col justify-start text-left">
                                                <p className="truncate font-medium">{path.split(/[\\/]/).pop()}</p>
                                                <p className="truncate text-[10px] opacity-40">{path}</p>
                                            </div>
                                        </button>

                                        {/* Hover Menu */}
                                        <div div className="dropdown dropdown-left absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity" >
                                            <button tabIndex={0} className="btn btn-ghost btn-xs btn-square">
                                                <MoreVertical className="size-4" />
                                            </button>
                                            <ul tabIndex={0} className="dropdown-content z-1 menu p-2 shadow bg-base-200 rounded-box w-40 border border-base-content/10">
                                                <li>
                                                    <button onClick={() => onPinFolder?.(path)}>
                                                        {isPinned ? (
                                                            <><PinOff className="size-4" /> Unpin</>
                                                        ) : (
                                                            <><Pin className="size-4" /> Pin Folder</>
                                                        )}
                                                    </button>
                                                </li>
                                                <li>
                                                    <button onClick={() => onRemoveFolder?.(path)} className="text-error">
                                                        <Trash2 className="size-4" /> Remove
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 opacity-30 text-center px-4">
                            <Folder className="size-8 mb-2" />
                            <p className="text-xs">No recently scanned folders</p>
                        </div>
                    )
                    }
                </div >
            </div >

            <div className="divider m-0" />

            <div className="p-2">
                <button
                    type="button"
                    className="btn btn-ghost btn-block justify-start gap-3 rounded-xl"
                    onClick={onSettings}
                >
                    <Settings className="size-5 opacity-70" />
                    Settings
                </button>
            </div>
        </aside >
    );
}
