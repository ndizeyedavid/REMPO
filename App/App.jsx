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

    const handleStartScan = () => {
        if (view === "scanning") return

        setView("scanning")
        setScanProgress({ folders: 0, repos: 0 })

        let folders = 0
        let repos = 0
        const interval = setInterval(() => {
            folders += Math.floor(Math.random() * 8) + 2
            if (Math.random() > 0.8) repos += 1

            setScanProgress({ folders, repos })

            if (folders >= 114) {
                clearInterval(interval)
                setTimeout(() => {
                    setView("dashboard")
                }, 500)
            }
        }, 100)
    }

    const handleBackToWelcome = () => {
        setView("welcome")
        setScanProgress({ folders: 0, repos: 0 })
    }

    return (
        <div className="flex h-screen w-screen bg-base-200 text-base-content overflow-hidden">
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
                            <DashboardState />
                        )}
                    </div>
                </main>
            </div>

            {isSettingsOpen && (
                <SettingsModal onClose={() => setIsSettingsOpen(false)} />
            )}
        </div>
    )
}
