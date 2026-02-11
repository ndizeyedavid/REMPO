import React, { useState } from "react";
import {
  X, User, Palette, Sparkles, Globe,
  Settings as SettingsIcon, Bell, Shield,
  Moon, Sun, Monitor, Languages, Terminal
} from "lucide-react";

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

  const handleSave = () => {
    onSettingsUpdate("settings", localSettings);
    onClose();
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
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                  </section>

                  <section className="pt-4">
                    <div className="flex items-center justify-between opacity-40">
                      <span className="text-xs font-bold">App Version: 1.0.4-beta</span>
                      <button className="text-xs font-bold hover:underline">Check for Updates</button>
                    </div>
                  </section>
                </div>
              )}
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
