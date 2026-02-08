import { Folder, ScanLine, Settings } from "lucide-react";

export default function Sidebar({
    watchedFolders = ["~/Projects", "~/Code", "~/Development"],
    onScanProjects,
    onSettings,
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
                        className="btn btn-primary btn-block rounded-full"
                        onClick={onScanProjects}
                    >
                        <ScanLine className="size-5" />
                        Scan Projects
                    </button>
                </div>
            </div>


            <div className="flex min-h-0 flex-1 flex-col px-2">
                <div className="px-3 pb-2 text-xs font-semibold tracking-wide opacity-70">
                    Watched Folders
                </div>

                <ul className="menu menu-sm w-full flex-1 overflow-y-auto px-1">
                    {watchedFolders.map((path) => (
                        <li key={path}>
                            <button type="button" className="justify-start gap-3 rounded-xl">
                                <Folder className="size-4 opacity-70" />
                                <span className="truncate">{path}</span>
                            </button>
                        </li>
                    ))}
                </ul>
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
