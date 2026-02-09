import toast from "react-hot-toast"
import { useState, useEffect } from "react"
import Sidebar from "./components/Sidebar"
import Header from "./components/Header"
import WelcomeState from "./components/WelcomeState"
import ScanningState from "./components/ScanningState"
import DashboardState from "./components/DashboardState"
import SettingsModal from "./components/SettingsModal"

export default function App() {
    const [view, setView] = useState("welcome") // "welcome", "scanning", "dashboard"
    const [scanProgress, setScanProgress] = useState({ folders: 0, repos: 0 })
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [theme, setTheme] = useState("light")
    const [scannedRepos, setScannedRepos] = useState([])
    const [watchedFolders, setWatchedFolders] = useState([])
    const [scanCache, setScanCache] = useState({})
    const [activeFolderPath, setActiveFolderPath] = useState(null)
    const [activities, setActivities] = useState([])

    // Load initial data from store
    useEffect(() => {
        const initStore = async () => {
            try {
                const store = await window.electronAPI.getStore();
                if (store.theme) setTheme(store.theme);
                if (store.watchedFolders) setWatchedFolders(store.watchedFolders);
                if (store.scanCache) setScanCache(store.scanCache);
                if (store.activities) setActivities(store.activities);
                if (store.lastScannedFolder) {
                    console.log("Last scanned folder:", store.lastScannedFolder);
                }
            } catch (error) {
                console.error("Failed to load store:", error);
            }
        };
        initStore();
    }, []);

    const handleThemeChange = async (newTheme) => {
        setTheme(newTheme);
        try {
            await window.electronAPI.updateStore("theme", newTheme);
        } catch (error) {
            console.error("Failed to update theme in store:", error);
        }
    };

    const handleStartScan = async (folderPathInput = null, options = {}) => {
        if (view === "scanning") return

        try {
            let folderPath = folderPathInput;
            if (!folderPath) {
                folderPath = await window.electronAPI.selectFolder();
            }
            if (!folderPath) return;

            setActiveFolderPath(folderPath);

            const shouldUseCache = options.useCache !== false;
            const cached = shouldUseCache ? scanCache?.[folderPath] : null;
            if (cached?.repos && Array.isArray(cached.repos) && cached.repos.length > 0) {
                setScannedRepos(cached.repos);
                setView("dashboard");
                // Still update last scanned folder for UX
                await window.electronAPI.updateStore("lastScannedFolder", folderPath);
                return;
            }

            // Update watched folders if it's new
            if (!watchedFolders.includes(folderPath)) {
                const newFolders = [folderPath, ...watchedFolders].slice(0, 10);
                setWatchedFolders(newFolders);
                await window.electronAPI.updateStore("watchedFolders", newFolders);
            }

            // Save last scanned folder
            await window.electronAPI.updateStore("lastScannedFolder", folderPath);

            setView("scanning")
            setScanProgress({ folders: 0, repos: 0 })

            // Actual scan
            const repos = await window.electronAPI.scanRepos(folderPath);

            // Log activity
            await logActivity({
                project: folderPath.split(/[\\/]/).pop(),
                action: `Scanned folder for projects`,
                type: 'scan'
            });

            // Cache scan results
            const nextCache = {
                ...(scanCache || {}),
                [folderPath]: {
                    scannedAt: Date.now(),
                    repos,
                },
            };
            setScanCache(nextCache);
            await window.electronAPI.updateStore("scanCache", nextCache);

            // Simulation-like progress but based on actual results
            let folders = 0;
            const interval = setInterval(() => {
                folders += Math.floor(Math.random() * 8) + 2;
                setScanProgress({
                    folders,
                    repos: Math.floor((folders / 114) * repos.length)
                });

                if (folders >= 114) {
                    clearInterval(interval);
                    // console.log(repos);
                    setScannedRepos(repos);
                    setTimeout(() => {
                        setView("dashboard");
                    }, 500);
                }
            }, 50);
        } catch (error) {
            console.error("Failed to scan:", error);
            toast.error("Failed to scan selected folder");
            setView("welcome");
        }
    }

    const handleRefreshScan = async () => {
        if (!activeFolderPath) return;
        await handleStartScan(activeFolderPath, { useCache: false });
    }

    const handleBackToWelcome = () => {
        setView("welcome")
        setScanProgress({ folders: 0, repos: 0 })
    }

    const logActivity = async (activity) => {
        const newActivity = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            ...activity
        };
        const updatedActivities = [newActivity, ...activities].slice(0, 50);
        setActivities(updatedActivities);
        await window.electronAPI.updateStore("activities", updatedActivities);
    };

    return (
        <div className="flex h-screen w-screen bg-base-200 text-base-content overflow-hidden" data-theme={theme}>
            <Sidebar
                onScanProjects={() => handleStartScan()}
                onRefreshProjects={handleRefreshScan}
                onSettings={() => setIsSettingsOpen(true)}
                watchedFolders={watchedFolders}
                onFolderClick={(path) => handleStartScan(path)}
                primaryActionVariant={view === "dashboard" && activeFolderPath ? "refresh" : "scan"}
            />
            <div className="flex min-w-0 flex-1 flex-col">
                <Header
                    status={view === "scanning" ? "Scanning projects..." : view === "dashboard" ? "Scan complete" : "Ready to scan"}
                />
                <main className="min-h-0 flex-1 bg-base-100 overflow-hidden">
                    <div className="flex h-full items-center justify-center">
                        {view === "welcome" && (
                            <div className="px-6 w-full flex justify-center">
                                <WelcomeState onStartScan={() => handleStartScan()} />
                            </div>
                        )}
                        {view === "scanning" && (
                            <div className="px-6 w-full flex justify-center">
                                <ScanningState
                                    folders={scanProgress.folders}
                                    repos={scanProgress.repos}
                                />
                            </div>
                        )}
                        {view === "dashboard" && (
                            <DashboardState
                                projects={scannedRepos}
                                activities={activities}
                                onLogActivity={logActivity}
                            />
                        )}
                    </div>
                </main>
            </div>

            {isSettingsOpen && (
                <SettingsModal
                    onClose={() => setIsSettingsOpen(false)}
                    currentTheme={theme}
                    onThemeChange={handleThemeChange}
                />
            )}
        </div>
    )
}
