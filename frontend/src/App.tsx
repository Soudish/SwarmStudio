import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Dashboard } from './components/dashboard/Dashboard';
import { ProjectWorkspace } from './components/workspace/ProjectWorkspace';
import { AgentActivityView } from './components/activity/AgentActivityView';
import { MyProjects } from './components/projects/MyProjects';
import { SettingsView } from './components/settings/SettingsView';
import { CreateProjectModal } from './components/dashboard/CreateProjectModal';
import { AuthModal } from './components/auth/AuthModal';
import { LandingPage } from './components/landing/LandingPage';
import { ProjectData, SettingsData, CreateProjectPayload, User } from './types';
import { api } from './services/api';
import { useTheme } from './contexts/ThemeContext';

export const App: React.FC = () => {
  const { isDark } = useTheme();

  // View states: 'landing' or 'studio'
  const [currentView, setCurrentView] = useState<'landing' | 'studio'>('landing');
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Data states
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [activeProject, setActiveProject] = useState<ProjectData | null>(null);
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(true);

  const wsRef = useRef<WebSocket | null>(null);

  // Check stored user session and initial data
  const loadInitialData = async () => {
    try {
      // 1. Check if token exists, restore user profile
      const token = api.getToken();
      let restoredUser: User | null = null;
      if (token) {
        try {
          restoredUser = await api.getMe();
          setCurrentUser(restoredUser);
          setCurrentView('studio'); // If logged in, go straight to Studio
        } catch (e) {
          api.clearToken();
        }
      }

      // 2. Fetch projects & settings
      const [projList, settingsData] = await Promise.all([
        api.getProjects(),
        api.getSettings(),
      ]);

      setProjects(projList);
      setSettings(settingsData);

      if (projList.length > 0 && !activeProject) {
        setActiveProject(projList[0]);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Poll active project if generating
  useEffect(() => {
    if (!activeProject || activeProject.status !== 'generating') return;

    const interval = setInterval(async () => {
      try {
        const updated = await api.getProject(activeProject.id);
        setActiveProject(updated);
        setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      } catch (err) {
        console.error('Error polling active project:', err);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [activeProject?.id, activeProject?.status]);

  // WebSocket connection for real-time agent updates
  useEffect(() => {
    if (!activeProject) return;

    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = api.createWebSocket(
      activeProject.id,
      (data) => {
        if (data.type === 'activity') {
          setActiveProject((prev) => {
            if (!prev || prev.id !== data.project_id) return prev;
            return {
              ...prev,
              progress: data.progress,
              current_agent: data.current_agent,
              activities: [...prev.activities, data.activity],
            };
          });
        } else if (data.type === 'project_updated') {
          setActiveProject(data.project);
          setProjects((prev) =>
            prev.map((p) => (p.id === data.project.id ? data.project : p))
          );
        }
      },
      () => {
        // Fallback gracefully handled by HTTP polling
      }
    );

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [activeProject?.id]);

  const handleCreateProject = async (payload: CreateProjectPayload) => {
    const created = await api.createProject(payload);
    setProjects((prev) => [created, ...prev]);
    setActiveProject(created);
    setCurrentView('studio');
    setCurrentTab('activity'); // Switch to live activity to view swarm work!
  };

  const handleSelectProject = (project: ProjectData) => {
    setActiveProject(project);
    setCurrentView('studio');
    setCurrentTab('workspace');
  };

  const handleRefreshActiveProject = async () => {
    if (!activeProject) return;
    try {
      const refreshed = await api.getProject(activeProject.id);
      setActiveProject(refreshed);
      setProjects((prev) => prev.map((p) => (p.id === refreshed.id ? refreshed : p)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAuthSuccess = async (user: User) => {
    setCurrentUser(user);
    // Reload projects belonging to this user
    try {
      const userProjects = await api.getProjects();
      setProjects(userProjects);
      if (userProjects.length > 0) {
        setActiveProject(userProjects[0]);
      }
    } catch (e) {
      console.error(e);
    }
    setCurrentView('studio');
  };

  const handleLogout = async () => {
    api.logout();
    setCurrentUser(null);
    try {
      const guestProjects = await api.getProjects();
      setProjects(guestProjects);
      setActiveProject(guestProjects.length > 0 ? guestProjects[0] : null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  // If in Landing Page view
  if (currentView === 'landing') {
    return (
      <>
        <LandingPage
          onEnterStudio={() => setCurrentView('studio')}
          onOpenAuth={handleOpenAuth}
          currentUser={currentUser}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          initialMode={authMode}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col theme-transition ${
        isDark
          ? 'bg-[#090D16] text-slate-100 selection:bg-purple-600 selection:text-white'
          : 'bg-[#F8FAFC] text-slate-900 selection:bg-purple-500 selection:text-white'
      }`}
    >
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        activeProject={activeProject}
        settings={settings}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onGoToLanding={() => setCurrentView('landing')}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            <p className={`text-xs font-semibold tracking-wide uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Initializing SwarmStudio Workspace...
            </p>
          </div>
        ) : (
          <>
            {currentTab === 'dashboard' && (
              <Dashboard
                projects={projects}
                onOpenCreateModal={() => setIsCreateModalOpen(true)}
                onSelectProject={handleSelectProject}
                onSelectTab={setCurrentTab}
                settings={settings}
              />
            )}

            {currentTab === 'workspace' && (
              activeProject ? (
                <ProjectWorkspace
                  project={activeProject}
                  onUpdateProject={(updated) => {
                    setActiveProject(updated);
                    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
                  }}
                  onSelectTab={setCurrentTab}
                  onRefreshProject={handleRefreshActiveProject}
                />
              ) : (
                <div
                  className={`p-16 text-center rounded-3xl border border-dashed ${
                    isDark
                      ? 'bg-[#0F1626] border-slate-800'
                      : 'bg-white border-slate-300'
                  }`}
                >
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    No Project Selected
                  </h3>
                  <p className={`text-xs mt-1 mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Create a new project or select an existing one to enter the studio workspace.
                  </p>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-all"
                  >
                    Create New Project
                  </button>
                </div>
              )
            )}

            {currentTab === 'activity' && (
              <AgentActivityView
                activeProject={activeProject}
                projects={projects}
                onSelectProject={setActiveProject}
              />
            )}

            {currentTab === 'projects' && (
              <MyProjects
                projects={projects}
                onSelectProject={handleSelectProject}
                onOpenCreateModal={() => setIsCreateModalOpen(true)}
                onRefreshProjects={loadInitialData}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsView
                settings={settings}
                onRefreshSettings={loadInitialData}
              />
            )}
          </>
        )}
      </main>

      {/* Project Creation Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProject}
        availableModels={settings?.available_models || []}
        defaultModel={settings?.ollama_model || 'llama3.2'}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default App;
