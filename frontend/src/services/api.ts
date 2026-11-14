import { ProjectData, CreateProjectPayload, SettingsData, AgentActivity } from '../types';

const API_BASE = '/api';

export const api = {
  async getProjects(): Promise<ProjectData[]> {
    const res = await fetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error('Failed to load projects');
    return res.json();
  },

  async getProject(id: string): Promise<ProjectData> {
    const res = await fetch(`${API_BASE}/projects/${id}`);
    if (!res.ok) throw new Error('Failed to load project');
    return res.json();
  },

  async createProject(payload: CreateProjectPayload): Promise<ProjectData> {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create project');
    return res.json();
  },

  async updateProject(id: string, payload: Partial<ProjectData>): Promise<ProjectData> {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update project');
    return res.json();
  },

  async deleteProject(id: string): Promise<{ status: string }> {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete project');
    return res.json();
  },

  async regenerateSection(id: string, section: string, instructions?: string): Promise<ProjectData> {
    const res = await fetch(`${API_BASE}/projects/${id}/regenerate-section`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section, instructions }),
    });
    if (!res.ok) throw new Error('Failed to regenerate section');
    return res.json();
  },

  getExportUrl(id: string, format: 'markdown' | 'pdf'): string {
    return `${API_BASE}/projects/${id}/export?format=${format}`;
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to save settings');
    return res.json();
  },

  async testOllama(): Promise<any> {
    const res = await fetch(`${API_BASE}/settings/test-ollama`, {
      method: 'POST',
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
