import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Activity,
  Settings as SettingsIcon,
  Plus,
  Cpu,
  Layers,
  Globe,
  LogOut,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';
import { SettingsData, ProjectData, User } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  activeProject: ProjectData | null;
  settings: SettingsData | null;
  onOpenCreateModal: () => void;
  currentUser: User | null;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onLogout: () => void;
  onGoToLanding: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  activeProject,
  settings,
  onOpenCreateModal,
  currentUser,
  onOpenAuth,
  onLogout,
  onGoToLanding
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isOllamaOnline = settings?.ollama_status?.online;
  const { theme, toggleTheme, isDark } = useTheme();

  // Close dropdown on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navBtnClass = (tab: string) =>
    `flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
      currentTab === tab
        ? isDark
          ? 'bg-purple-600/15 text-purple-300 border border-purple-500/30'
          : 'bg-purple-100 text-purple-700 border border-purple-300'
        : isDark
        ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
    }`;

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b backdrop-blur-md theme-transition ${
        isDark
          ? 'border-purple-500/10 bg-[#090D16]/80'
          : 'border-slate-200 bg-white/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onSelectTab('dashboard')}
          >
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-purple-600/25 border border-purple-400/30 group-hover:shadow-purple-500/40 transition-shadow">
              <img
                src="/logo.jpg"
                alt="SwarmStudio"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`font-extrabold text-lg tracking-tight bg-gradient-to-r bg-clip-text text-transparent ${
                    isDark
                      ? 'from-white via-purple-100 to-purple-300'
                      : 'from-slate-800 via-purple-700 to-purple-500'
                  }`}
                >
                  SwarmStudio
                </span>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                    isDark
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-purple-100 text-purple-600 border border-purple-200'
                  }`}
                >
                  v1.0
                </span>
              </div>
              <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Multi-Agent Creative Studio
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button onClick={() => onSelectTab('dashboard')} className={navBtnClass('dashboard')}>
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>

            <button onClick={() => onSelectTab('workspace')} className={`${navBtnClass('workspace')} relative`}>
              <Layers className="w-4 h-4" />
              Workspace
              {activeProject && (
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping absolute -top-0.5 -right-0.5" />
              )}
            </button>

            <button onClick={() => onSelectTab('activity')} className={navBtnClass('activity')}>
              <Activity className="w-4 h-4" />
              Agent Activity
            </button>

            <button onClick={() => onSelectTab('projects')} className={navBtnClass('projects')}>
              <FolderKanban className="w-4 h-4" />
              My Projects
            </button>

            <button onClick={() => onSelectTab('settings')} className={navBtnClass('settings')}>
              <SettingsIcon className="w-4 h-4" />
              Settings
            </button>

            <button
              onClick={onGoToLanding}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all border border-transparent ml-1 ${
                isDark
                  ? 'text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 hover:border-purple-500/30'
                  : 'text-purple-600 hover:text-purple-700 hover:bg-purple-50 hover:border-purple-200'
              }`}
              title="View Public Landing Page"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Landing</span>
            </button>
          </nav>

          {/* Right Status & Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-all ${
                isDark
                  ? 'text-amber-400 hover:bg-slate-800 hover:text-amber-300'
                  : 'text-purple-600 hover:bg-purple-50 hover:text-purple-700'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Ollama Pill Indicator */}
            <div
              onClick={() => onSelectTab('settings')}
              className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-colors ${
                isDark
                  ? 'bg-slate-900/80 border border-slate-700/60 hover:border-purple-500/40'
                  : 'bg-slate-100 border border-slate-200 hover:border-purple-300'
              }`}
              title={
                isOllamaOnline
                  ? `Connected to Ollama (${settings?.ollama_model})`
                  : 'Local Ollama daemon offline. Click to configure.'
              }
            >
              <Cpu className={`w-3.5 h-3.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              <span className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {settings?.ollama_model || 'Ollama'}
              </span>
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  isOllamaOnline
                    ? 'bg-emerald-400 ring-4 ring-emerald-400/20'
                    : 'bg-amber-400 ring-4 ring-amber-400/20'
                }`}
              />
            </div>

            {/* Create Project Button */}
            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-900/30 border border-purple-400/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Project</span>
            </button>

            {/* User Auth Profile / Buttons */}
            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl transition-all text-xs font-semibold ${
                    isDark
                      ? 'bg-slate-900/80 border border-slate-700/80 hover:border-purple-500/50 text-slate-200'
                      : 'bg-white border border-slate-200 hover:border-purple-300 text-slate-700 shadow-sm'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-[11px] font-bold text-white shadow-sm">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline truncate max-w-[90px]">{currentUser.name}</span>
                  <ChevronDown className={`w-3 h-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                </button>

                {userDropdownOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl py-2 z-50 animate-fadeIn ${
                      isDark
                        ? 'bg-[#0F1626] border border-slate-700'
                        : 'bg-white border border-slate-200'
                    }`}
                  >
                    <div className={`px-4 py-2 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                      <div className={`font-bold text-xs truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {currentUser.name}
                      </div>
                      <div className={`text-[11px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {currentUser.email}
                      </div>
                      <div
                        className={`mt-1 text-[10px] px-2 py-0.5 rounded-full inline-block font-mono ${
                          isDark
                            ? 'bg-purple-500/20 text-purple-300'
                            : 'bg-purple-100 text-purple-600'
                        }`}
                      >
                        {currentUser.project_count} saved project{currentUser.project_count === 1 ? '' : 's'}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onSelectTab('projects');
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center gap-2 ${
                        isDark
                          ? 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <FolderKanban className="w-3.5 h-3.5 text-purple-400" />
                      <span>My Saved Works</span>
                    </button>

                    <button
                      onClick={() => {
                        onGoToLanding();
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center gap-2 ${
                        isDark
                          ? 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Public Landing Page</span>
                    </button>

                    <button
                      onClick={() => {
                        onLogout();
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center gap-2 mt-1 ${
                        isDark
                          ? 'text-rose-300 hover:bg-rose-500/10 border-t border-slate-800'
                          : 'text-rose-600 hover:bg-rose-50 border-t border-slate-100'
                      }`}
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenAuth('login')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isDark
                      ? 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isDark
                      ? 'text-purple-300 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30'
                      : 'text-purple-600 bg-purple-100 hover:bg-purple-200 border border-purple-200'
                  }`}
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
