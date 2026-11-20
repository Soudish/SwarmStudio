import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  Layers,
  Activity,
  FolderKanban,
  Settings as SettingsIcon,
  Plus,
  Cpu,
  Globe,
  LogOut,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Menu,
  X,
  Sparkles,
  User as UserIcon
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
  onGoToLanding
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
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 cursor-pointer group min-w-0"
          >
            <div className="w-8 h-8 rounded-xl overflow-hidden border border-border shrink-0 bg-surface-muted flex items-center justify-center">
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm tracking-tight text-text1 truncate">
                    SwarmStudio
                  </span>
                  <span className="pill text-[10px] px-1.5 py-0.2">v1.0</span>
                </div>
                <p className="text-[11px] text-text3 truncate">AI Creative Studio</p>
              </div>
            )}
          </div>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-text3 hover:text-text1 hover:bg-surface-muted transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-text3 hover:text-text1 hover:bg-surface-muted"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Project Primary CTA */}
        {collapsed ? (
          <button
            onClick={onOpenCreateModal}
            className="w-10 h-10 mx-auto rounded-full bg-text1 text-surface flex items-center justify-center hover:opacity-90 transition-transform active:scale-95 shadow-sm"
            title="Create New Project"
          >
            <Plus className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={onOpenCreateModal}
            className="btn-primary w-full shadow-sm text-xs justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        )}

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all relative ${
                  isActive
                    ? 'bg-accent-tint text-accent-text font-semibold'
                    : 'text-text2 hover:text-text1 hover:bg-surface-muted'
                } ${collapsed ? 'justify-center px-0' : ''}`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-accent' : 'text-text3'}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {item.badge && (
                  <span
                    className={`w-2 h-2 rounded-full bg-accent animate-ping absolute ${
                      collapsed ? 'top-1 right-1' : 'right-3'
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
        {/* Model status pill */}
        <button
          onClick={() => handleNavClick('settings')}
          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-border text-xs text-text2 hover:border-border-hover bg-surface-muted transition-colors ${
            collapsed ? 'justify-center px-0' : ''
          }`}
          title={
            isOllamaOnline
              ? `Connected: ${settings?.ollama_model}`
              : 'Ollama offline (using smart fallback)'
          }
        >
          <Cpu className="w-3.5 h-3.5 text-text3 shrink-0" />
          {!collapsed && (
            <span className="truncate flex-1 text-left text-[11px]">
              {settings?.ollama_model || 'Ollama'}
            </span>
          )}
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isOllamaOnline ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          />
        </button>

        {/* Utility row: Theme toggle & Landing */}
        <div className={`flex items-center gap-1.5 ${collapsed ? 'flex-col' : 'justify-between'}`}>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-text2 hover:text-text1 hover:bg-surface-muted transition-colors flex items-center gap-2 text-xs"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
            {!collapsed && <span className="text-[11px]">{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>

          <button
            onClick={onGoToLanding}
            className="p-2 rounded-xl text-text2 hover:text-text1 hover:bg-surface-muted transition-colors flex items-center gap-1.5 text-xs"
            title="View Public Landing Page"
          >
            <Globe className="w-4 h-4" />
            {!collapsed && <span className="text-[11px]">Site</span>}
          </button>
        </div>

        {/* User Block */}
        {currentUser ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className={`w-full flex items-center gap-2 p-1.5 rounded-xl border border-border hover:border-border-hover transition-colors bg-surface text-text1 ${
                collapsed ? 'justify-center p-1' : ''
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
                  <span>My Saved Works</span>
                </button>
                <button
                  onClick={() => {
                    onGoToLanding();
                    setUserDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-text2 hover:text-text1 hover:bg-surface-muted flex items-center gap-2"
                >
                  <Globe className="w-3.5 h-3.5 text-text3" />
                  <span>Public Landing Page</span>
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
                className="w-8 h-8 mx-auto rounded-full border border-border flex items-center justify-center text-text2 hover:text-text1"
                title="Sign In"
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
        <div className="flex items-center gap-2.5" onClick={() => onSelectTab('dashboard')}>
          <div className="w-7 h-7 rounded-lg overflow-hidden border border-border shrink-0">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-text1">SwarmStudio</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCreateModal}
            className="w-8 h-8 rounded-full bg-text1 text-surface flex items-center justify-center text-xs"
            title="Create Project"
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

      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden md:flex flex-col shrink-0 sticky top-0 h-screen border-r border-border bg-surface z-30 transition-all duration-200 ${
          collapsed ? 'w-[72px]' : 'w-[248px]'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export const Topbar: React.FC<{
  currentTab: string;
  activeProject: ProjectData | null;
  settings: SettingsData | null;
  onOpenCreateModal?: () => void;
}> = ({ currentTab, activeProject, settings, onOpenCreateModal }) => {
  const titles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Studio Overview', subtitle: 'Autonomous AI Creative Collaboration' },
    workspace: {
      title: activeProject ? activeProject.title : 'Project Workspace',
      subtitle: activeProject ? `${activeProject.genre} • ${activeProject.tone}` : 'Creative Suite',
    },
    activity: { title: 'Agent Telemetry', subtitle: 'Live Multi-Agent Event Stream' },
    projects: { title: 'My Projects', subtitle: 'Saved Scripts & Creative Dossiers' },
    settings: { title: 'Platform Settings', subtitle: 'Model Configuration & Storage' },
  };

  const meta = titles[currentTab] || { title: 'SwarmStudio', subtitle: 'Creative Suite' };

  return (
    <div className="w-full border-b border-border bg-surface/50 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-text1">{meta.title}</h1>
        <p className="text-xs text-text3 mt-0.5">{meta.subtitle}</p>
      </div>

      <div className="flex items-center gap-2.5">
        {activeProject && currentTab === 'workspace' && (
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

        <span className="pill text-xs">
          <Cpu className="w-3 h-3 text-text3" />
          <span>{settings?.ollama_model || 'llama3.2'}</span>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              settings?.ollama_status?.online ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          />
        </span>
      </div>
    </div>
  );
};
