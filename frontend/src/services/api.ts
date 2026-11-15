import { ProjectData, CreateProjectPayload, SettingsData, AgentActivity, User, AuthResponse } from '../types';

const API_BASE = '/api';
const TOKEN_KEY = 'swarmstudio_auth_token';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Auth helpers
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Registration failed');
    }
    const data: AuthResponse = await res.json();
    this.setToken(data.access_token);
    return data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Invalid email or password');
    }
    const data: AuthResponse = await res.json();
    this.setToken(data.access_token);
    return data;
  },

  async getMe(): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch user profile');
    return res.json();
  },

  logout(): void {
    this.clearToken();
  },

  // Projects
  async getProjects(): Promise<ProjectData[]> {
    const res = await fetch(`${API_BASE}/projects`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load projects');
    return res.json();
  },

  async getProject(id: string): Promise<ProjectData> {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load project');
    return res.json();
  },

  async createProject(payload: CreateProjectPayload): Promise<ProjectData> {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create project');
    return res.json();
  },

  async updateProject(id: string, payload: Partial<ProjectData>): Promise<ProjectData> {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update project');
    return res.json();
  },

  async deleteProject(id: string): Promise<{ status: string }> {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete project');
    return res.json();
  },

  async regenerateSection(id: string, section: string, instructions?: string): Promise<ProjectData> {
    const res = await fetch(`${API_BASE}/projects/${id}/regenerate-section`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ section, instructions }),
    });
    if (!res.ok) throw new Error('Failed to regenerate section');
    return res.json();
  },

  getExportUrl(id: string, format: 'markdown' | 'pdf'): string {
    return `${API_BASE}/projects/${id}/export?format=${format}`;
  },

  async exportProject(id: string, format: 'markdown' | 'pdf', filename?: string): Promise<void> {
    const token = localStorage.getItem(TOKEN_KEY);
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_BASE}/projects/${id}/export?format=${format}`, {
      headers,
    });
    if (!res.ok) {
      let detail = 'Export failed';
      try {
        const err = await res.json();
        detail = err.detail || detail;
      } catch {
        // ignore
      }
      throw new Error(detail);
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `project_${id.slice(0, 8)}.${format === 'pdf' ? 'pdf' : 'md'}`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 250);
  },

  async getProjectActivity(id: string): Promise<AgentActivity[]> {
    const res = await fetch(`${API_BASE}/activity/${id}`);
    if (!res.ok) throw new Error('Failed to load project activity');
    return res.json();
  },

  async getSettings(): Promise<SettingsData> {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  async updateSettings(payload: Partial<SettingsData>): Promise<SettingsData> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to save settings');
    return res.json();
  },

  async generateImage(prompt: string, width = 1024, height = 576, seed?: number): Promise<{ url: string; image_id: string; provider: string }> {
    const res = await fetch(`${API_BASE}/media/generate-image`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ prompt, width, height, seed }),
    });
    if (!res.ok) throw new Error('Failed to generate image');
    return res.json();
  },

  getImageUrl(path: string): string {
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    const base = API_BASE.replace('/api', '');
    return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
  },

  async generateMusic(prompt: string, duration = 15, genre = 'cinematic'): Promise<{ url: string; track_id: string; provider: string; duration: number }> {
    const res = await fetch(`${API_BASE}/media/generate-music`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ prompt, duration, genre }),
    });
    if (!res.ok) throw new Error('Failed to generate music track');
    return res.json();
  },

  getAudioUrl(path: string): string {
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    const base = API_BASE.replace('/api', '');
    return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
  },

  async testOllama(): Promise<any> {
    const res = await fetch(`${API_BASE}/settings/test-ollama`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to test Ollama');
    return res.json();
  },

  createWebSocket(projectId: string, onMessage: (data: any) => void, onError?: () => void): WebSocket {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const ws = new WebSocket(`${protocol}//${host}/ws/projects/${projectId}`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };

    if (onError) {
      ws.onerror = onError;
    }

    return ws;
  }
};
