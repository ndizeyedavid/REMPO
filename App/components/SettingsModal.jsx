import React, { useState } from "react";
import {
  X, User, Palette, Sparkles, Globe,
  Settings as SettingsIcon, Bell, Shield,
  Moon, Sun, Monitor, Languages, Terminal,
  Bug, Info, Github, ExternalLink, Heart
} from "lucide-react";
import logoImage from "../../src/assets/logo.png";

export default function SettingsModal({ onClose, currentTheme, onThemeChange, settings, onSettingsUpdate }) {
  const [activeTab, setActiveTab] = useState("personalization");
  const [localSettings, setLocalSettings] = useState(settings);

  const handleToggleAi = (enabled) => {
    const next = { ...localSettings, ai: { ...localSettings.ai, enabled } };
    setLocalSettings(next);
  };

  const handleToggleAutoSummarize = (autoSummarizeOnScan) => {
    const next = { ...localSettings, ai: { ...localSettings.ai, autoSummarizeOnScan } };
    setLocalSettings(next);
  };

  const handleApiKeyChange = (apiKey) => {
    const next = { ...localSettings, ai: { ...localSettings.ai, apiKey } };
    setLocalSettings(next);
  };

  const handleSetLanguage = (language) => {
    const next = { ...localSettings, language };
    setLocalSettings(next);
  };

  const handleToggleNotificationsEnabled = (enabled) => {
    const next = {
      ...localSettings,
      notifications: {
        ...(localSettings.notifications || {}),
        enabled,
      },
    };
    setLocalSettings(next);
  };

  const handleToggleNotificationType = (key, value) => {
    const next = {
      ...localSettings,
      notifications: {
        ...(localSettings.notifications || {}),
        [key]: value,
      },
    };
    setLocalSettings(next);
  };

  const handleToggleSystem = (key, value) => {
    const next = {
      ...localSettings,
      system: {
        ...(localSettings.system || {}),
        [key]: value,
      },
    };
    setLocalSettings(next);
  };

  const handleSetTerminal = (key, value) => {
    const next = {
      ...localSettings,
      terminal: {
        ...(localSettings.terminal || {}),
        [key]: value,
      },
    };
    setLocalSettings(next);
  };

  const handleSetScan = (key, value) => {
    const next = {
      ...localSettings,
      scan: {
        ...(localSettings.scan || {}),
        [key]: value,
      },
    };
    setLocalSettings(next);
  };

  const handleClearScanCache = async () => {
    await onSettingsUpdate("scanCache", {});
  };

  const handleClearAiSummaries = async () => {
    await onSettingsUpdate("aiResponses", {});
  };

  const handleClearActivities = async () => {
    await onSettingsUpdate("activities", []);
  };

  const handleSave = () => {
    onSettingsUpdate("settings", localSettings);
    onClose();
  };

  const handleOpenUrl = (url) => {
    window.electronAPI.openInBrowser(url);
  };

  const themes = [
    { id: "light", label: "Light Mode", icon: Sun, color: "bg-slate-50", textColor: "text-slate-900" },
    { id: "dark", label: "Dark Mode", icon: Moon, color: "bg-[#191e24]", textColor: "text-white" },
    { id: "synthwave", label: "Synthwave", icon: Moon, color: "bg-indigo-950", textColor: "text-indigo-400" },
    { id: "halloween", label: "Halloween", icon: Moon, color: "bg-orange-950", textColor: "text-orange-500" },
    { id: "aqua", label: "Aqua", icon: Moon, color: "bg-cyan-900", textColor: "text-cyan-400" },
    { id: "dracula", label: "Dracula", icon: Moon, color: "bg-purple-950", textColor: "text-purple-400" },
    { id: "caramellatte", label: "Caramellatte", icon: Sun, color: "bg-[#feecd3]", textColor: "text-[#b8390f]" },
    { id: "purple", label: "Purple", icon: Moon, color: "bg-[#59168b]", textColor: "text-white" },
    { id: "emerald", label: "Emerald", icon: Sun, color: "bg-[#e8e8e8]", textColor: "text-[#2d3645]" },
  ];

  const tabs = [
    { id: "personalization", label: "Personalization", icon: Palette },
    { id: "ai", label: "AI Configuration", icon: Sparkles },
    { id: "languages", label: "Languages", icon: Globe },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "system", label: "System", icon: SettingsIcon },
    { id: "about", label: "About", icon: Info },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-200 animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center z-201 p-4 pointer-events-none">
        <div className="bg-base-300 w-full max-w-4xl h-[600px] rounded-3xl shadow-2xl border border-base-content/10 overflow-hidden flex pointer-events-auto animate-in zoom-in-95 duration-300">

          {/* Sidebar Navigation */}
          <div className="w-64 border-r border-base-content/5 bg-base-200/50 p-6 flex flex-col gap-2">
            <h2 className="text-xl font-bold px-3 mb-6 flex items-center gap-2">
              <SettingsIcon className="size-5 text-primary" />
              Settings
            </h2>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${activeTab === tab.id
                  ? "bg-primary text-primary-content shadow-lg shadow-primary/20 scale-[1.02]"
                  : "hover:bg-base-content/5 opacity-70 hover:opacity-100"
                  }`}
              >
                <tab.icon className="size-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}


          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-base-300">
            {/* Content Header */}
            <div className="p-6 border-b border-base-content/5 flex items-center justify-between">
              <h3 className="text-lg font-bold capitalize">{activeTab.replace("-", " ")}</h3>
              <button
                onClick={onClose}
                className="btn btn-ghost btn-sm btn-square rounded-xl hover:bg-error/10 hover:text-error transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {activeTab === "personalization" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <section>
                    <h4 className="text-sm font-bold opacity-40 uppercase tracking-widest mb-4">Appearance</h4>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                      {themes.map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => onThemeChange(theme.id)}
                          className={`flex flex-col gap-3 p-4 rounded-2xl border-2 transition-all ${currentTheme === theme.id
                            ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                            : "border-transparent hover:border-base-content/10"
                            }`}
                        >
                          <div className={`w-full aspect-video rounded-lg ${theme.color} border border-base-content/10 flex items-center justify-center ${theme.textColor}`}>
                            <theme.icon className="size-6" />
                          </div>
                          <div className="flex items-center justify-between w-full">
                            <span className={`text-sm font-bold ${currentTheme === theme.id ? "text-primary" : "opacity-60"}`}>
                              {theme.label}
                            </span>
                            {currentTheme === theme.id && <Check className="size-4 text-primary" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* <section>
                    <h4 className="text-sm font-bold opacity-40 uppercase tracking-widest mb-4">Theme Color</h4>
                    <div className="flex gap-4">
                      {['#2DD4BF', '#3B82F6', '#A855F7', '#EC4899', '#F97316'].map((color) => (
                        <button
                          key={color}
                          className="size-10 rounded-full border-2 border-transparent hover:scale-110 transition-transform shadow-lg"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </section> */}
                </div>
              )}

              {activeTab === "ai" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <section className="bg-primary/5 rounded-2xl border border-primary/20 p-6 flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                      <Sparkles className="size-6" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">AI-Powered Project Insights</h4>
                      <p className="text-sm opacity-70 leading-relaxed">
                        Adjust how the AI summarizes your codebases and provides context for your project activity.
                      </p>
                    </div>
                  </section>

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-bold">Groq API Key</span>
                    </label>
                    <input
                      type="password"
                      placeholder="gsk_..."
                      className="input input-bordered w-full bg-base-100/40 border-base-content/10 rounded-xl focus:border-primary/50"
                      value={localSettings.ai?.apiKey || ""}
                      onChange={(e) => handleApiKeyChange(e.target.value)}
                    />
                    <label className="label">
                      <span className="label-text-alt opacity-50">Get your key from groq.com</span>
                    </label>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-base-200 border border-base-content/5">
                      <div>
                        <p className="font-bold">Enable AI Features</p>
                        <p className="text-xs opacity-50">Master switch for all AI-powered functionality</p>
                      </div>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={localSettings.ai?.enabled}
                        onChange={(e) => handleToggleAi(e.target.checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-base-200 border border-base-content/5">
                      <div>
                        <p className="font-bold">Auto-summarize new repos</p>
                        <p className="text-xs opacity-50">Summarize projects immediately after scanning</p>
                      </div>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={localSettings.ai?.autoSummarizeOnScan}
                        onChange={(e) => handleToggleAutoSummarize(e.target.checked)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "languages" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-2 gap-4">
                    {['English', 'Spanish', 'French', 'German', 'Japanese', 'Chinese'].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => handleSetLanguage(lang)}
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${lang === localSettings.language ? 'bg-primary/5 border-primary text-primary font-bold' : 'border-base-content/10 hover:border-base-content/20'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <Languages className="size-4 opacity-70" />
                          <span>{lang}</span>
                        </div>
                        {lang === localSettings.language && <Check className="size-4" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <section>
                    <h4 className="text-sm font-bold opacity-40 uppercase tracking-widest mb-4">Desktop Notifications</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-base-200 border border-base-content/5">
                        <div>
                          <p className="font-bold">Enable Notifications</p>
                          <p className="text-xs opacity-50">Show desktop alerts for important project updates</p>
                        </div>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          checked={localSettings.notifications?.enabled !== false}
                          onChange={(e) => handleToggleNotificationsEnabled(e.target.checked)}
                        />
                      </div>

                    </div>
                  </section>

                  <section>
                    <h4 className="text-sm font-bold opacity-40 uppercase tracking-widest mb-4">Alert Types</h4>
                    <div className="space-y-3">
                      {[
                        { key: "scanCompleted", label: "Scan Completed", desc: "Notify when a project scan is finished" },
                        { key: "newCommitsDetected", label: "New Commits Detected", desc: "Alert when watched repos have new activity" },
                        { key: "mergeConflicts", label: "Merge Conflicts", desc: "Immediate alert if a conflict is found during sync" }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 rounded-2xl border border-base-content/10">
                          <div>
                            <p className="font-medium">{item.label}</p>
                            <p className="text-xs opacity-50">{item.desc}</p>
                          </div>
                          <input
                            type="checkbox"
                            className="checkbox checkbox-primary rounded-lg"
                            checked={localSettings.notifications?.[item.key] !== false}
                            onChange={(e) => handleToggleNotificationType(item.key, e.target.checked)}
                            disabled={localSettings.notifications?.enabled === false}
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}

              {activeTab === "system" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
                  <section>
                    <h4 className="text-sm font-bold opacity-40 uppercase tracking-widest mb-4">Application Behavior</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-base-200 border border-base-content/5">
                        <div>
                          <p className="font-bold">Open last scanned folder on launch</p>
                          <p className="text-xs opacity-50">Automatically restore your last scan when the app starts</p>
                        </div>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          checked={localSettings.system?.openLastScannedFolderOnLaunch !== false}
                          onChange={(e) => handleToggleSystem("openLastScannedFolderOnLaunch", e.target.checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-2xl bg-base-200 border border-base-content/5">
                        <div>
                          <p className="font-bold">Restore last cached results</p>
                          <p className="text-xs opacity-50">Skip scanning and load your last scan from cache on startup</p>
                        </div>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          checked={localSettings.system?.restoreLastCacheOnLaunch !== false}
                          onChange={(e) => handleToggleSystem("restoreLastCacheOnLaunch", e.target.checked)}
                          disabled={localSettings.system?.openLastScannedFolderOnLaunch === false}
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-base-200 border border-base-content/5">
                        <div>
                          <p className="font-bold">Launch at Startup</p>
                          <p className="text-xs opacity-50">Automatically start Rempo when Windows begins</p>
                        </div>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          checked={!!localSettings.system?.launchAtStartup}
                          onChange={(e) => handleToggleSystem("launchAtStartup", e.target.checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-base-200 border border-base-content/5">
                        <div>
                          <p className="font-bold">Hardware Acceleration</p>
                          <p className="text-xs opacity-50">Use GPU for smoother UI rendering (requires restart)</p>
                        </div>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          checked={localSettings.system?.hardwareAcceleration !== false}
                          onChange={(e) => handleToggleSystem("hardwareAcceleration", e.target.checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-base-200 border border-base-content/5">
                        <div>
                          <p className="font-bold">Minimize to Tray</p>
                          <p className="text-xs opacity-50">Keep the app running in the system tray when closed</p>
                        </div>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          checked={localSettings.system?.minimizeToTray !== false}
                          onChange={(e) => handleToggleSystem("minimizeToTray", e.target.checked)}
                        />
                      </div>
                    </div>
                  </section>

                  <section>
                    <h4 className="text-sm font-bold opacity-40 uppercase tracking-widest mb-4">Storage & Cache</h4>
                    <div className="p-4 rounded-2xl border border-base-content/10 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-base-200 text-base-content/70">
                          <Terminal className="size-5" />
                        </div>
                        <div>
                          <p className="font-bold">Database Location</p>
                          <p className="text-xs opacity-50">C:\Users\Developer\AppData\Roaming\Rempo\db</p>
                        </div>
                      </div>
                      {/* <button className="btn btn-ghost btn-sm rounded-lg border border-base-content/10">Change</button> */}
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <button
                        type="button"
                        className="btn btn-ghost rounded-xl border border-base-content/10"
                        onClick={handleClearScanCache}
                      >
                        Clear Scan Cache
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost rounded-xl border border-base-content/10"
                        onClick={handleClearAiSummaries}
                      >
                        Clear AI Summaries
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost rounded-xl border border-base-content/10"
                        onClick={handleClearActivities}
                      >
                        Clear Activity Log
                      </button>
                    </div>
                  </section>

                  <section>
                    <h4 className="text-sm font-bold opacity-40 uppercase tracking-widest mb-4">Git Terminal</h4>
                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl bg-base-200 border border-base-content/5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold">Font Size</p>
                            <p className="text-xs opacity-50">Affects the embedded Git terminal (Ctrl+K)</p>
                          </div>
                          <input
                            type="number"
                            min={10}
                            max={22}
                            className="input input-bordered w-24 bg-base-100/40 border-base-content/10 rounded-xl"
                            value={Number(localSettings.terminal?.fontSize ?? 13)}
                            onChange={(e) => handleSetTerminal("fontSize", Number(e.target.value || 13))}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-2xl bg-base-200 border border-base-content/5">
                        <div>
                          <p className="font-bold">Cursor Blink</p>
                          <p className="text-xs opacity-50">Blinking cursor in the Git terminal</p>
                        </div>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          checked={localSettings.terminal?.cursorBlink !== false}
                          onChange={(e) => handleSetTerminal("cursorBlink", e.target.checked)}
                        />
                      </div>

                      <div className="p-4 rounded-2xl bg-base-200 border border-base-content/5">
                        <p className="font-bold mb-2">Terminal Theme</p>
                        <div className="join w-full">
                          <button
                            type="button"
                            className={`btn join-item flex-1 ${localSettings.terminal?.theme !== "light" ? "btn-primary" : "btn-ghost"}`}
                            onClick={() => handleSetTerminal("theme", "dark")}
                          >
                            Dark
                          </button>
                          <button
                            type="button"
                            className={`btn join-item flex-1 ${localSettings.terminal?.theme === "light" ? "btn-primary" : "btn-ghost"}`}
                            onClick={() => handleSetTerminal("theme", "light")}
                          >
                            Light
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h4 className="text-sm font-bold opacity-40 uppercase tracking-widest mb-4">Scan Defaults</h4>
                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl bg-base-200 border border-base-content/5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold">Max Depth</p>
                            <p className="text-xs opacity-50">How deep Rempo searches for repos (higher = slower)</p>
                          </div>
                          <input
                            type="number"
                            min={1}
                            max={25}
                            className="input input-bordered w-24 bg-base-100/40 border-base-content/10 rounded-xl"
                            value={Number(localSettings.scan?.maxDepth ?? 6)}
                            onChange={(e) => handleSetScan("maxDepth", Number(e.target.value || 6))}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-2xl bg-base-200 border border-base-content/5">
                        <div>
                          <p className="font-bold">Include Hidden Folders</p>
                          <p className="text-xs opacity-50">Scan dot-folders and hidden directories</p>
                        </div>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          checked={!!localSettings.scan?.includeHidden}
                          onChange={(e) => handleSetScan("includeHidden", e.target.checked)}
                        />
                      </div>

                      <div className="p-4 rounded-2xl bg-base-200 border border-base-content/5">
                        <p className="font-bold mb-2">Extra Ignore Patterns</p>
                        <p className="text-xs opacity-50 mb-3">One pattern per line. Example: node_modules, dist, .next</p>
                        <textarea
                          className="textarea textarea-bordered w-full bg-base-100/40 border-base-content/10 rounded-xl"
                          rows={4}
                          value={(localSettings.scan?.extraIgnorePatterns || []).join("\n")}
                          onChange={(e) =>
                            handleSetScan(
                              "extraIgnorePatterns",
                              (e.target.value || "")
                                .split(/\r?\n/)
                                .map((s) => s.trim())
                                .filter(Boolean)
                            )
                          }
                        />
                      </div>
                    </div>
                  </section>

                  <section className="pt-4">
                    <div className="flex items-center justify-between opacity-40">
                      <span className="text-xs font-bold">App Version: 0.0.4-beta</span>
                      <button className="text-xs font-bold hover:underline">Check for Updates</button>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === "about" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
                  <div className="flex flex-col items-center text-center space-y-4 py-6">
                    <div className="size-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shadow-xl shadow-primary/10 border border-primary/20">
                      <img src={logoImage} className="size-16" alt="Rempo Logo" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black tracking-tighter">REMPO</h3>
                      <p className="text-xs font-bold opacity-40 uppercase tracking-widest">Version 1.0.4-beta</p>
                    </div>
                    <p className="max-w-md opacity-70 leading-relaxed italic">
                      "Remember what you were building. A beautiful dashboard for your global git ecosystem."
                    </p>
                  </div>

                  <section className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleOpenUrl("https://github.com/ndizeyedavid/REMPO/issues/new?template=bug_report.yml")}
                      className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-base-200 border border-base-content/5 hover:border-primary/30 hover:bg-primary/5 transition-all group"
                    >
                      <div className="p-3 rounded-2xl bg-error/10 text-error group-hover:scale-110 transition-transform">
                        <Bug className="size-6" />
                      </div>
                      <div className="text-center">
                        <p className="font-bold">Report a Bug</p>
                        <p className="text-xs opacity-50">Found an issue? Let us know!</p>
                      </div>
                    </button>

                    <button
                      onClick={() => handleOpenUrl("https://github.com/ndizeyedavid/REMPO")}
                      className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-base-200 border border-base-content/5 hover:border-primary/30 hover:bg-primary/5 transition-all group"
                    >
                      <div className="p-3 rounded-2xl bg-base-content/10 text-base-content group-hover:scale-110 transition-transform">
                        <Github className="size-6" />
                      </div>
                      <div className="text-center">
                        <p className="font-bold">GitHub Repo</p>
                        <p className="text-xs opacity-50">Star us or contribute code</p>
                      </div>
                    </button>
                  </section>

                  <section className="p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/10 relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col items-center text-center gap-4">
                      <div className="flex items-center gap-2 text-primary font-bold">
                        <Heart className="size-5 fill-primary" />
                        <span>Created with passion by</span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-2xl font-black tracking-tight">David NDIZEYE</h4>
                        <p className="text-sm opacity-60">Full-stack Developer & Geek🤓</p>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => handleOpenUrl("https://github.com/ndizeyedavid")}
                          className="btn btn-ghost btn-sm rounded-xl border border-base-content/10 hover:bg-primary/10"
                        >
                          <Github className="size-4 mr-2" />
                          Follow
                        </button>
                        <button
                          onClick={() => handleOpenUrl("https://davidndizeye.vercel.app")}
                          className="btn btn-ghost btn-sm rounded-xl border border-base-content/10 hover:bg-primary/10"
                        >
                          <ExternalLink className="size-4 mr-2" />
                          Portfolio
                        </button>
                      </div>
                    </div>
                    <div className="absolute -top-6 -right-4 p-8 opacity-5 group-hover:opacity-30 transition-opacity rotate-12">
                      {/* <Playst className="size-32 rotate-12" /> */}
                      <span className="text-[128px]">🎮</span>
                    </div>
                  </section>

                  <div className="text-center pt-4 opacity-30 text-[10px] font-bold uppercase tracking-widest">
                    &copy; 2026 REMPO. All rights reserved.
                  </div>
                </div>
              ) || null}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-base-content/5 flex justify-end gap-3 bg-base-200/30">
              <button className="btn btn-ghost rounded-xl px-6 font-bold" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary rounded-xl px-8 font-bold shadow-lg shadow-primary/20" onClick={handleSave}>Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Check({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
