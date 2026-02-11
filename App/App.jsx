import toast from "react-hot-toast"
import { useState, useEffect } from "react"
import Sidebar from "./components/Sidebar"
import Header from "./components/Header"
import WelcomeState from "./components/WelcomeState"
import ScanningState from "./components/ScanningState"
import DashboardState from "./components/DashboardState"
import SettingsModal from "./components/SettingsModal"
import GitPalette from "./components/GitPalette"
import FolderPicker from "./components/FolderPicker"

export default function App() {
    const [view, setView] = useState("welcome") // "welcome", "scanning", "dashboard"
    const [scanProgress, setScanProgress] = useState({ folders: 0, repos: 0 })
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [theme, setTheme] = useState("light")
    const [scannedRepos, setScannedRepos] = useState([])
    const [watchedFolders, setWatchedFolders] = useState([])
    const [pinnedFolders, setPinnedFolders] = useState([])
    const [scanCache, setScanCache] = useState({})
    const [activeFolderPath, setActiveFolderPath] = useState(null)
    const [activities, setActivities] = useState([])
    const [isGitPaletteOpen, setIsGitPaletteOpen] = useState(false)
    const [isFolderPickerOpen, setIsFolderPickerOpen] = useState(false)
    const [settings, setSettings] = useState({
        ai: {
            enabled: true,
            autoSummarizeOnScan: true,
            verbosity: 70,
            provider: "groq",
            apiKey: "",
        },
        notifications: {
            enabled: true,
            scanCompleted: true,
            newCommitsDetected: true,
            mergeConflicts: true,
        },
        system: {
            openLastScannedFolderOnLaunch: true,
        },
        language: "English",
    })
    const [aiResponses, setAiResponses] = useState({})

    const openFolderPicker = () => {
        setIsFolderPickerOpen(true)
    }

    // Load initial data from store
    useEffect(() => {
        const initStore = async () => {
            try {
                const store = await window.electronAPI.getStore();
                if (store.theme) setTheme(store.theme);
                if (store.watchedFolders) setWatchedFolders(store.watchedFolders);
                if (store.pinnedFolders) setPinnedFolders(store.pinnedFolders);
                if (store.scanCache) setScanCache(store.scanCache);
                if (store.activities) setActivities(store.activities);
                if (store.settings) setSettings(store.settings);
                if (store.aiResponses) setAiResponses(store.aiResponses);
                if (store.lastScannedFolder) {
                    console.log("Last scanned folder:", store.lastScannedFolder);
                }

                const openLast = store.settings?.system?.openLastScannedFolderOnLaunch !== false;
                const last = store.lastScannedFolder;
                const cached = last ? store.scanCache?.[last] : null;
                if (openLast && last && cached?.repos && Array.isArray(cached.repos) && cached.repos.length > 0) {
                    setActiveFolderPath(last);
                    setScannedRepos(cached.repos);
                    setView("dashboard");
                }
            } catch (error) {
                console.error("Failed to load store:", error);
            }

            // Hide loading screen after initialization
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 300);
            }
        };
        initStore();
    }, []);

    useEffect(() => {
        const onKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setIsGitPaletteOpen(true);
            }
        }
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [])

    const handleThemeChange = async (newTheme) => {
        setTheme(newTheme);
        try {
            await window.electronAPI.updateStore("theme", newTheme);
        } catch (error) {
            console.error("Failed to update theme in store:", error);
        }
    };

    const handleSettingsUpdate = async (key, value) => {
        if (key === "settings") {
            setSettings(value);
        }
        if (key === "scanCache") {
            setScanCache(value || {});
        }
        if (key === "aiResponses") {
            setAiResponses(value || {});
        }
        if (key === "activities") {
            setActivities(Array.isArray(value) ? value : []);
        }
        try {
            await window.electronAPI.updateStore(key, value);
        } catch (error) {
            console.error(`Failed to update ${key} in store:`, error);
        }
    };

    const handleStartScan = async (folderPathInput = null, options = {}) => {
        if (view === "scanning") return

        try {
            let folderPath = folderPathInput;
            if (!folderPath) {
                openFolderPicker();
                return;
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

            const disposeScanProgress = window.electronAPI?.onScanProgress
                ? window.electronAPI.onScanProgress(({ folders, repos }) => {
                    setScanProgress({ folders: folders || 0, repos: repos || 0 });
                })
                : null;

            // Actual scan
            const scanOptions = {
                ...(settings.scan || {}),
                ...(options.scan || {}),
            };
            const repos = await window.electronAPI.scanRepos(folderPath, scanOptions);

            try {
                disposeScanProgress?.();
            } catch (e) { }

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

            setScannedRepos(repos);

            // Auto-summarize first 8 repos if enabled
            if (settings.ai?.enabled && settings.ai?.autoSummarizeOnScan && settings.ai?.apiKey) {
                const first8 = repos.slice(0, 8);
                first8.forEach(repo => {
                    if (!aiResponses[repo.path]) {
                        window.electronAPI.generateSummary({ repoPath: repo.path })
                            .then(res => {
                                if (res.ok) {
                                    setAiResponses(prev => ({
                                        ...prev,
                                        [repo.path]: res.summary
                                    }));
                                }
                            });
                    }
                });
            }

            // Send notification
            window.electronAPI.sendNotification({
                title: "Scan Complete",
                type: "scanCompleted",
                body: `Successfully scanned ${repos.length} repositories in ${folderPath.split(/[\\/]/).pop()}`
            });

            setTimeout(() => {
                setView("dashboard");
            }, 500);
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

    const handlePinFolder = async (folderPath) => {
        let newPinned;
        if (pinnedFolders.includes(folderPath)) {
            newPinned = pinnedFolders.filter(f => f !== folderPath);
        } else {
            newPinned = [folderPath, ...pinnedFolders];
        }
        setPinnedFolders(newPinned);
        await window.electronAPI.updateStore("pinnedFolders", newPinned);
        toast.success(pinnedFolders.includes(folderPath) ? "Folder unpinned" : "Folder pinned");
    };

    const handleRemoveFolder = async (folderPath) => {
        const newWatched = watchedFolders.filter(f => f !== folderPath);
        const newPinned = pinnedFolders.filter(f => f !== folderPath);

        setWatchedFolders(newWatched);
        setPinnedFolders(newPinned);

        await window.electronAPI.updateStore("watchedFolders", newWatched);
        await window.electronAPI.updateStore("pinnedFolders", newPinned);

        // Optionally clear cache for this folder
        const nextCache = { ...scanCache };
        delete nextCache[folderPath];
        setScanCache(nextCache);
        await window.electronAPI.updateStore("scanCache", nextCache);

        if (activeFolderPath === folderPath) {
            setView("welcome");
            setActiveFolderPath(null);
        }

        toast.success("Folder removed from history");
    };

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
                onScanProjects={openFolderPicker}
                onRefreshProjects={handleRefreshScan}
                onSettings={() => setIsSettingsOpen(true)}
                watchedFolders={watchedFolders}
                pinnedFolders={pinnedFolders}
                onPinFolder={handlePinFolder}
                onRemoveFolder={handleRemoveFolder}
                onFolderClick={(path) => handleStartScan(path)}
                primaryActionVariant={view === "dashboard" && activeFolderPath ? "refresh" : "scan"}
            />
            <div className="flex min-w-0 flex-1 flex-col">
                <Header
                    status={view === "scanning" ? "Scanning projects..." : view === "dashboard" ? "Scan complete" : "Ready to scan"}
                    setView={setView}
                />
                <main className="min-h-0 flex-1 bg-base-100 overflow-hidden">
                    <div className="flex h-full items-center justify-center">
                        {view === "welcome" && (
                            <div className="px-6 w-full flex justify-center">
                                <WelcomeState onStartScan={openFolderPicker} />
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
                                aiSettings={settings.ai}
                                aiResponses={aiResponses}
                                onTriggerSummary={(repoPath) => {
                                    if (settings.ai?.enabled && settings.ai?.apiKey && !aiResponses[repoPath]) {
                                        window.electronAPI.generateSummary({ repoPath })
                                            .then(res => {
                                                if (res.ok) {
                                                    setAiResponses(prev => ({
                                                        ...prev,
                                                        [repoPath]: res.summary
                                                    }));
                                                }
                                            });
                                    }
                                }}
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
                    settings={settings}
                    onSettingsUpdate={handleSettingsUpdate}
                />
            )}

            <GitPalette
                isOpen={isGitPaletteOpen}
                onClose={() => setIsGitPaletteOpen(false)}
                cwd={activeFolderPath}
            />

            <FolderPicker
                isOpen={isFolderPickerOpen}
                onClose={() => setIsFolderPickerOpen(false)}
                onSelect={(folderPath) => {
                    setIsFolderPickerOpen(false)
                    handleStartScan(folderPath)
                }}
                initialPath={activeFolderPath}
                recentFolders={watchedFolders}
            />
        </div>
    )
}
