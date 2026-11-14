import React from 'react';
import {
  Sparkles,
  LayoutDashboard,
  FolderKanban,
  Activity,
  Settings as SettingsIcon,
  Bot,
  Plus,
  Cpu,
  Layers
} from 'lucide-react';
import { SettingsData, ProjectData } from '../../types';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  activeProject: ProjectData | null;
  settings: SettingsData | null;
  onOpenCreateModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  activeProject,
  settings,
  onOpenCreateModal
}) => {
  const isOllamaOnline = settings?.ollama_status?.online;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-purple-500/10 bg-[#090D16]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectTab('dashboard')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 shadow-lg shadow-purple-600/25 border border-purple-400/30">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent">
                  SwarmStudio
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Multi-Agent Creative Studio</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'dashboard'
                  ? 'bg-purple-600/15 text-purple-300 border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>

            <button
              onClick={() => onSelectTab('workspace')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all relative ${
                currentTab === 'workspace'
                  ? 'bg-purple-600/15 text-purple-300 border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Layers className="w-4 h-4" />
              Workspace
              {activeProject && (
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping absolute -top-0.5 -right-0.5" />
              )}
            </button>

            <button
              onClick={() => onSelectTab('activity')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'activity'
                  ? 'bg-purple-600/15 text-purple-300 border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Activity className="w-4 h-4" />
              Agent Activity
            </button>

            <button
              onClick={() => onSelectTab('projects')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'projects'
                  ? 'bg-purple-600/15 text-purple-300 border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              My Projects
            </button>

            <button
              onClick={() => onSelectTab('settings')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'settings'
                  ? 'bg-purple-600/15 text-purple-300 border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              Settings
            </button>
          </nav>

          {/* Right Status & Actions */}
          <div className="flex items-center space-x-3">
            {/* Ollama Pill Indicator */}
            <div
              onClick={() => onSelectTab('settings')}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 cursor-pointer hover:border-purple-500/40 transition-colors"
              title={isOllamaOnline ? `Connected to Ollama (${settings?.ollama_model})` : "Local Ollama daemon offline. Click to configure."}
            >
              <Cpu className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-medium text-slate-300">
                {settings?.ollama_model || 'Ollama'}
              </span>
              <span className={`inline-block w-2 h-2 rounded-full ${isOllamaOnline ? 'bg-emerald-400 ring-4 ring-emerald-400/20' : 'bg-amber-400 ring-4 ring-amber-400/20'}`} />
            </div>

            {/* Create Project Button */}
            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-900/30 border border-purple-400/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Project</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
