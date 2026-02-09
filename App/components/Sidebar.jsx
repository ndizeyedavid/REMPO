import { Folder, ScanLine, Settings } from "lucide-react";

export default function Sidebar({
    watchedFolders = [],
    onScanProjects,
    onSettings,
    onFolderClick,
    title = "Rempo",
    subtitle = "Remember what you were building",
}) {
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
                    <button
                        type="button"
                        className="btn btn-primary btn-block rounded-full shadow-lg shadow-primary/20"
                        onClick={onScanProjects}
                    >
                        <ScanLine className="size-5" />
                        Scan Projects
                    </button>
                </div>
            </div>


            <div className="flex min-h-0 flex-1 flex-col px-2">
                <div className="px-3 pb-2 text-xs font-bold uppercase tracking-widest opacity-40">
                    Recent Folders
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar px-1">
                    {watchedFolders.length > 0 ? (
                        <ul className="menu menu-sm w-full gap-1">
                            {watchedFolders.map((path) => (
                                <li key={path}>
                                    <button
                                        type="button"
                                        className="justify-start gap-3 rounded-xl hover:bg-base-content/5 py-3 group"
                                        onClick={() => onFolderClick?.(path)}
                                    >
                                        <div className="p-1.5 rounded-lg bg-base-content/5 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                            <Folder className="size-4 opacity-70" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-medium">{path.split(/[\\/]/).pop()}</p>
                                            <p className="truncate text-[10px] opacity-40">{path}</p>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 opacity-30 text-center px-4">
                            <Folder className="size-8 mb-2" />
                            <p className="text-xs">No recently scanned folders</p>
                        </div>
                    )}
                </div>
            </div>

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
        </aside>
    );
}
