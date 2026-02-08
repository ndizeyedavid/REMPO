import React, { useState } from "react";
import { 
  X, User, Palette, Sparkles, Globe, 
  Settings as SettingsIcon, Bell, Shield, 
  Moon, Sun, Monitor, Languages, Terminal
} from "lucide-react";

export default function SettingsModal({ onClose }) {
  const [activeTab, setActiveTab] = useState("personalization");

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
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center z-[201] p-4 pointer-events-none">
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
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                  activeTab === tab.id 
                    ? "bg-primary text-primary-content shadow-lg shadow-primary/20 scale-[1.02]" 
                    : "hover:bg-base-content/5 opacity-70 hover:opacity-100"
                }`}
              >
                <tab.icon className="size-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
            
            <div className="mt-auto px-3 py-4 border-t border-base-content/5">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <User className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate">Developer</p>
                  <p className="text-[10px] opacity-40 truncate">Free Plan</p>
                </div>
              </div>
            </div>
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
                    <div className="grid grid-cols-3 gap-4">
                      <button className="flex flex-col gap-3 p-4 rounded-2xl border-2 border-primary bg-primary/5">
                        <div className="w-full aspect-video rounded-lg bg-slate-950 border border-white/10 flex items-center justify-center">
                          <Moon className="size-6 text-primary" />
                        </div>
                        <span className="text-sm font-bold">Dark Mode</span>
                      </button>
                      <button className="flex flex-col gap-3 p-4 rounded-2xl border-2 border-transparent hover:border-base-content/10 transition-all">
                        <div className="w-full aspect-video rounded-lg bg-slate-50 border border-black/10 flex items-center justify-center text-slate-900">
                          <Sun className="size-6" />
                        </div>
                        <span className="text-sm font-medium opacity-60">Light Mode</span>
                      </button>
                      <button className="flex flex-col gap-3 p-4 rounded-2xl border-2 border-transparent hover:border-base-content/10 transition-all">
                        <div className="w-full aspect-video rounded-lg bg-gradient-to-br from-slate-950 to-slate-50 border border-base-content/10 flex items-center justify-center">
                          <Monitor className="size-6 text-primary" />
                        </div>
                        <span className="text-sm font-medium opacity-60">System</span>
                      </button>
                    </div>
                  </section>

                  <section>
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
                  </section>
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
                      <span className="label-text font-bold">Summary Verbosity</span>
                    </label>
                    <input type="range" min="0" max="100" value="70" className="range range-primary range-sm" />
                    <div className="w-full flex justify-between text-xs px-2 mt-2 opacity-40 uppercase font-bold tracking-tighter">
                      <span>Concise</span>
                      <span>Detailed</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-base-200 border border-base-content/5">
                      <div>
                        <p className="font-bold">Auto-summarize new repos</p>
                        <p className="text-xs opacity-50">Summarize projects immediately after scanning</p>
                      </div>
                      <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "languages" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-2 gap-4">
                    {['English', 'Spanish', 'French', 'German', 'Japanese', 'Chinese'].map((lang) => (
                      <button key={lang} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        lang === 'English' ? 'bg-primary/5 border-primary text-primary font-bold' : 'border-base-content/10 hover:border-base-content/20'
                      }`}>
                        <div className="flex items-center gap-3">
                          <Languages className="size-4 opacity-70" />
                          <span>{lang}</span>
                        </div>
                        {lang === 'English' && <Check className="size-4" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-base-content/5 flex justify-end gap-3 bg-base-200/30">
              <button className="btn btn-ghost rounded-xl px-6 font-bold" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary rounded-xl px-8 font-bold shadow-lg shadow-primary/20" onClick={onClose}>Save Changes</button>
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
