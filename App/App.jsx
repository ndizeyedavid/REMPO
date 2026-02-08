import toast from "react-hot-toast"
import { useState } from "react"
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

    const handleStartScan = async () => {
        if (view === "scanning") return

        try {
            const folderPath = await window.electronAPI.selectFolder();
            if (!folderPath) return;

            setView("scanning")
            setScanProgress({ folders: 0, repos: 0 })

            // Actual scan
            const repos = await window.electronAPI.scanRepos(folderPath);

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

    const handleBackToWelcome = () => {
        setView("welcome")
        setScanProgress({ folders: 0, repos: 0 })
    }

    return (
        <div className="flex h-screen w-screen bg-base-200 text-base-content overflow-hidden" data-theme={theme}>
            <Sidebar onScanProjects={handleStartScan} onSettings={() => setIsSettingsOpen(true)} />
            <div className="flex min-w-0 flex-1 flex-col">
                <Header
                    status={view === "scanning" ? "Scanning projects..." : view === "dashboard" ? "Scan complete" : "Ready to scan"}
                />
                <main className="min-h-0 flex-1 bg-base-100 overflow-hidden">
                    <div className="flex h-full items-center justify-center">
                        {view === "welcome" && (
                            <div className="px-6 w-full flex justify-center">
                                <WelcomeState onStartScan={handleStartScan} />
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
                            <DashboardState projects={scannedRepos} />
                        )}
                    </div>
                </main>
            </div>

            {isSettingsOpen && (
                <SettingsModal
                    onClose={() => setIsSettingsOpen(false)}
                    currentTheme={theme}
                    onThemeChange={setTheme}
                />
            )}
        </div>
    )
}
