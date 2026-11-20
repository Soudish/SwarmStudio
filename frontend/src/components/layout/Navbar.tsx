import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  Layers,
  Activity,
  FolderKanban,
  Settings as SettingsIcon,
  Plus,
  Cpu,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowLeft,
  User as UserIcon,
} from 'lucide-react';
import { SettingsData, ProjectData, User } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

export interface NavbarProps {
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
  onGoToLanding,
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('swarmstudio-sidebar-collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isOllamaOnline = settings?.ollama_status?.online;
  const { toggleTheme, isDark } = useTheme();

  const isGenerating = activeProject?.status === 'generating';

  useEffect(() => {
    try {
      localStorage.setItem('swarmstudio-sidebar-collapsed', String(collapsed));
    } catch {}
  }, [collapsed]);

  // Keyboard shortcut Ctrl/Cmd+B toggles collapsed sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'workspace', label: 'Workspace', icon: Layers, badge: isGenerating },
    { id: 'activity', label: 'Agent Activity', icon: Activity },
    { id: 'projects', label: 'My Projects', icon: FolderKanban },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-4">
      {/* Top section: Brand + Collapse + New Project CTA + Nav */}
      <div className="space-y-4">
        {/* Brand Header */}
        {collapsed ? (
          <div className="flex flex-col items-center gap-2 pb-3 border-b border-border">
            <button
              onClick={onGoToLanding}
              className="w-9 h-9 rounded-xl overflow-hidden border border-border shrink-0 bg-surface-muted flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/50 transition-transform hover:scale-105 active:scale-95"
              title="Back to Landing Page"
              aria-label="Back to Landing Page"
            >
              <img src="/logo.jpg" alt="SwarmStudio" className="w-full h-full object-cover" />
            </button>

            <button
              onClick={() => setCollapsed(false)}
              className="hidden md:flex w-9 h-9 rounded-lg text-text3 hover:text-text1 hover:bg-surface-muted items-center justify-center transition-colors"
              title="Expand sidebar (Ctrl+B)"
              aria-label="Expand sidebar"
            >
              <PanelLeftOpen className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <button
              onClick={onGoToLanding}
              className="flex items-center gap-3 cursor-pointer group min-w-0 text-left focus:outline-none focus:ring-2 focus:ring-accent/50 rounded-xl p-1 -m-1 transition-transform active:scale-95"
              title="Back to Landing Page"
            >
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-border shrink-0 bg-surface-muted flex items-center justify-center transition-transform group-hover:scale-105">
                <img src="/logo.jpg" alt="SwarmStudio" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <span className="font-semibold text-base tracking-tight text-text1 truncate block">
                  SwarmStudio
                </span>
              </div>
            </button>

            {/* Desktop 36px toggle */}
            <button
              onClick={() => setCollapsed(true)}
              className="hidden md:flex w-9 h-9 rounded-lg text-text3 hover:text-text1 hover:bg-surface-muted items-center justify-center transition-colors"
              title="Collapse sidebar (Ctrl+B)"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>

            {/* Mobile close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden w-9 h-9 rounded-lg text-text3 hover:text-text1 hover:bg-surface-muted flex items-center justify-center"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* New Project Primary CTA */}
        {collapsed ? (
          <button
            onClick={onOpenCreateModal}
            className="w-11 h-11 mx-auto rounded-xl bg-text1 text-surface flex items-center justify-center hover:opacity-90 transition-transform active:scale-95 shadow-sm"
            title="New Project"
            aria-label="New Project"
          >
            <Plus className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={onOpenCreateModal}
            className="btn-primary w-full shadow-sm text-sm h-11 justify-center gap-2 font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        )}

        {/* Navigation Items — 15px text, 20px icons, ~44px height */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3.5 rounded-xl text-[15px] font-medium transition-all relative h-11 ${
                  isActive
                    ? 'bg-accent-tint text-accent-text font-semibold shadow-sm'
                    : 'text-text2 hover:text-text1 hover:bg-surface-muted'
                } ${collapsed ? 'justify-center px-0 w-11 mx-auto' : 'px-3.5'}`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-accent' : 'text-text3'}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {item.badge && (
                  <span
                    className={`w-2.5 h-2.5 rounded-full bg-accent animate-ping absolute ${
                      collapsed ? 'top-1.5 right-1.5' : 'right-3.5'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom section: Engine status, theme, landing, user */}
      <div className="space-y-3 pt-3 border-t border-border">
        {/* Model status pill (compact row with dot — ONLY place model is shown) */}
        <button
          onClick={() => handleNavClick('settings')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border border-border text-xs text-text2 hover:border-border-hover bg-surface-muted/60 transition-colors ${
            collapsed ? 'justify-center px-0 w-11 h-10 mx-auto' : 'h-10'
          }`}
          title={
            isOllamaOnline
              ? `Model: ${settings?.ollama_model || 'llama3.2'} (Online)`
              : 'Ollama offline (smart fallback)'
          }
        >
          <Cpu className="w-4 h-4 text-text3 shrink-0" />
          {!collapsed && (
            <span className="truncate flex-1 text-left text-xs font-mono">
              {settings?.ollama_model || 'llama3.2'}
            </span>
          )}
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isOllamaOnline ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          />
        </button>

        {/* Secondary items: Dark Mode (14px) & Back to Site (14px) */}
        <div className={`space-y-1 ${collapsed ? 'flex flex-col items-center' : ''}`}>
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-3 text-sm font-medium text-text2 hover:text-text1 hover:bg-surface-muted transition-colors rounded-xl h-10 ${
              collapsed ? 'w-11 justify-center' : 'w-full px-3'
            }`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-500 shrink-0" /> : <Moon className="w-4 h-4 text-text3 shrink-0" />}
            {!collapsed && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>

          <button
            onClick={onGoToLanding}
            className={`flex items-center gap-3 text-sm font-medium text-text2 hover:text-text1 hover:bg-surface-muted transition-colors rounded-xl h-10 ${
              collapsed ? 'w-11 justify-center' : 'w-full px-3'
            }`}
            title="Back to Site"
            aria-label="Back to Site"
          >
            <ArrowLeft className="w-4 h-4 text-text3 shrink-0" />
            {!collapsed && <span>Back to Site</span>}
          </button>
        </div>

        {/* User Block */}
        {currentUser ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className={`w-full flex items-center gap-2 p-1.5 rounded-xl border border-border hover:border-border-hover transition-colors bg-surface text-text1 ${
                collapsed ? 'justify-center p-1 w-11 mx-auto' : ''
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-accent-tint text-accent-text flex items-center justify-center font-semibold text-xs shrink-0">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              {!collapsed && (
                <>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-xs font-medium text-text1 truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-text3 truncate">{currentUser.email}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-text3 shrink-0" />
                </>
              )}
            </button>

            {userDropdownOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-56 card p-2 shadow-md z-50 animate-fadeIn">
                <div className="px-3 py-2 border-b border-border mb-1">
                  <p className="text-xs font-semibold text-text1 truncate">{currentUser.name}</p>
                  <p className="text-[11px] text-text3 truncate">{currentUser.email}</p>
                  <span className="pill text-[10px] mt-1.5">
                    {currentUser.project_count} project{currentUser.project_count === 1 ? '' : 's'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    handleNavClick('projects');
                    setUserDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-text2 hover:text-text1 hover:bg-surface-muted flex items-center gap-2"
                >
                  <FolderKanban className="w-3.5 h-3.5 text-text3" />
                  <span>My Projects</span>
                </button>
                <button
                  onClick={() => {
                    onGoToLanding();
                    setUserDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-text2 hover:text-text1 hover:bg-surface-muted flex items-center gap-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-text3" />
                  <span>Back to Site</span>
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setUserDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-rose-500 hover:bg-rose-500/10 flex items-center gap-2 mt-1 border-t border-border pt-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-1.5">
            {collapsed ? (
              <button
                onClick={() => onOpenAuth('login')}
                className="w-10 h-10 mx-auto rounded-full border border-border flex items-center justify-center text-text2 hover:text-text1"
                title="Sign In"
                aria-label="Sign In"
              >
                <UserIcon className="w-4 h-4" />
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="btn-ghost text-xs py-1.5 px-2 justify-center"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="btn-accent text-xs py-1.5 px-2 justify-center"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-40 w-full border-b border-border bg-surface/90 backdrop-blur-md px-4 py-3 flex items-center justify-between">
        <button
          onClick={onGoToLanding}
          className="flex items-center gap-2.5 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/50 rounded-lg p-1 -m-1"
          title="Back to Landing Page"
        >
          <div className="w-7 h-7 rounded-lg overflow-hidden border border-border shrink-0">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-text1">SwarmStudio</span>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCreateModal}
            className="w-8 h-8 rounded-full bg-text1 text-surface flex items-center justify-center text-xs"
            title="Create Project"
            aria-label="Create Project"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded-lg text-text2 hover:text-text1 hover:bg-surface-muted"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Slide-over Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-72 max-w-[80vw] bg-surface h-full shadow-2xl border-r border-border z-10 flex flex-col">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop Persistent Sidebar — smooth 250ms width transition */}
      <aside
        className={`hidden md:flex flex-col shrink-0 sticky top-0 h-screen border-r border-border bg-surface z-30 transition-[width] duration-250 ease-in-out ${
          collapsed ? 'w-[72px]' : 'w-[260px]'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export interface TopbarProps {
  currentTab: string;
  activeProject: ProjectData | null;
  projects?: ProjectData[];
  onSelectProject?: (p: ProjectData) => void;
  settings?: SettingsData | null;
  onOpenCreateModal?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentTab,
  activeProject,
  projects,
  onSelectProject,
  settings,
  onOpenCreateModal,
}) => {
  return (
    <header className="h-14 min-h-[56px] max-h-14 w-full border-b border-border bg-surface/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left side: Single title or breadcrumb */}
      <div className="flex items-center min-w-0 pr-4">
        {currentTab === 'dashboard' && (
          <h1 className="text-base font-semibold text-text1">Dashboard</h1>
        )}

        {currentTab === 'workspace' && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-text3 font-medium">Workspace</span>
            {activeProject && (
              <>
                <span className="text-text3">/</span>
                <span className="font-semibold text-text1 truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                  {activeProject.title}
                </span>
              </>
            )}
          </div>
        )}

        {currentTab === 'activity' && (
          <h1 className="text-base font-semibold text-text1">Agent Activity</h1>
        )}

        {currentTab === 'projects' && (
          <h1 className="text-base font-semibold text-text1">My Projects</h1>
        )}

        {currentTab === 'settings' && (
          <h1 className="text-base font-semibold text-text1">Settings</h1>
        )}
      </div>

      {/* Right side: Page-level actions */}
      <div className="flex items-center gap-3 shrink-0">
        {(currentTab === 'dashboard' || currentTab === 'projects') && onOpenCreateModal && (
          <button
            onClick={onOpenCreateModal}
            className="btn-primary text-xs py-1.5 px-3 shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>
        )}

        {currentTab === 'activity' && projects && projects.length > 0 && onSelectProject && (
          <div className="flex items-center gap-2 text-xs">
            <label className="text-text3 hidden sm:inline whitespace-nowrap">Active Project:</label>
            <select
              value={activeProject?.id || ''}
              onChange={(e) => {
                const found = projects.find((p) => p.id === e.target.value);
                if (found) onSelectProject(found);
              }}
              className="input text-xs py-1 px-2.5 font-medium max-w-[220px]"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.status})
                </option>
              ))}
            </select>
          </div>
        )}

        {currentTab === 'workspace' && activeProject && (
          <span
            className={`pill text-xs ${
              activeProject.status === 'completed'
                ? 'pill-accent'
                : activeProject.status === 'generating'
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                : ''
            }`}
          >
            {activeProject.status === 'completed'
              ? 'Ready'
              : activeProject.status === 'generating'
              ? `Generating (${activeProject.progress}%)`
              : activeProject.status}
          </span>
        )}
      </div>
    </header>
  );
};
