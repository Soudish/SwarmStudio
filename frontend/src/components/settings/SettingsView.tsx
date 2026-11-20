import React, { useState } from 'react';
import {
  Cpu,
  Database,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Save,
  Copy,
  Check,
  Terminal,
  Loader2
} from 'lucide-react';
import { SettingsData } from '../../types';
import { api } from '../../services/api';

interface SettingsViewProps {
  settings: SettingsData | null;
  onRefreshSettings: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onRefreshSettings,
}) => {
  const [ollamaUrl, setOllamaUrl] = useState(settings?.ollama_base_url || 'http://localhost:11434');
  const [ollamaModel, setOllamaModel] = useState(settings?.ollama_model || 'llama3.2');
  const [supabaseUrl, setSupabaseUrl] = useState(settings?.supabase_url || '');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [demoFallback, setDemoFallback] = useState(settings?.demo_fallback_enabled ?? true);

  const [testingOllama, setTestingOllama] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const sqlSchema = `-- Run this in your Supabase SQL Editor to enable cloud persistence:
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    title TEXT,
    project_type TEXT,
    status TEXT,
    progress INTEGER,
    created_at TEXT,
    updated_at TEXT,
    data JSONB
);

-- Optional: Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read/write" ON projects FOR ALL USING (true) WITH CHECK (true);`;

  const handleTestOllama = async () => {
    try {
      setTestingOllama(true);
      const res = await api.testOllama();
      setTestResult(res);
      onRefreshSettings();
    } catch (e: any) {
      setTestResult({
        status: { online: false, error: e.message || 'Connection failed' },
        models: []
      });
    } finally {
      setTestingOllama(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.updateSettings({
        ollama_base_url: ollamaUrl,
        ollama_model: ollamaModel,
        supabase_url: supabaseUrl,
        ...(supabaseKey ? { supabase_key: supabaseKey } : {}),
        demo_fallback_enabled: demoFallback,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
      onRefreshSettings();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text1">System Settings</h1>
        <p className="text-xs text-text3 mt-0.5">
          Configure local Ollama inference, model endpoints, and database synchronization.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Ollama Local LLM Configuration */}
        <div className="card p-6 md:p-8 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent-tint text-accent-text flex items-center justify-center shrink-0">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-text1">Local AI Inference (Ollama)</h2>
                <p className="text-xs text-text3">
                  Direct privacy-first open-weight model execution.
                </p>
              </div>
            </div>

            <span
              className={`pill text-xs font-semibold ${
                settings?.ollama_status?.online
                  ? 'pill-accent'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  settings?.ollama_status?.online ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              <span>{settings?.ollama_status?.online ? 'Ollama Online' : 'Ollama Offline'}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label block mb-1.5">Ollama Server Base URL</label>
              <input
                type="text"
                value={ollamaUrl}
                onChange={(e) => setOllamaUrl(e.target.value)}
                placeholder="http://localhost:11434"
                className="input text-xs"
              />
            </div>

            <div>
              <label className="label block mb-1.5">Default Model Name</label>
              <input
                type="text"
                value={ollamaModel}
                onChange={(e) => setOllamaModel(e.target.value)}
                placeholder="llama3.2, mistral, gemma2, etc."
                className="input text-xs"
              />
            </div>
          </div>

          {/* Test Connection Button & Inline Result */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={handleTestOllama}
              disabled={testingOllama}
              className="btn-ghost text-xs self-start"
            >
              {testingOllama ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
              <span>{testingOllama ? 'Probing Connection...' : 'Test Ollama Connection'}</span>
            </button>

            {testResult && (
              <div className="text-xs">
                {testResult.status.online ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Ollama v{testResult.status.version} connected ({testResult.models?.length || 0} models available)
                  </span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    {testResult.status.error || 'Connection failed'} (Using fallback)
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Quick Setup Command */}
          <div className="card-muted p-3.5 space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 text-text3 font-semibold text-[11px] uppercase tracking-wider">
              <Terminal className="w-3.5 h-3.5 text-accent" />
              <span>Quick Terminal Command</span>
            </div>
            <p className="text-text3 text-xs">
              To pull and serve the recommended local model on your machine:
            </p>
            <div className="p-2 rounded-lg bg-surface border border-border font-mono text-xs text-text1">
              ollama run llama3.2
            </div>
          </div>
        </div>

        {/* Section 2: Supabase Cloud Database */}
        <div className="card p-6 md:p-8 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-surface-muted text-text1 flex items-center justify-center shrink-0 border border-border">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-text1">Database & Supabase Sync</h2>
                <p className="text-xs text-text3">
                  Dual-tier storage: Local SQLite database + optional Supabase cloud replication.
                </p>
              </div>
            </div>

            <span className="pill text-xs">
              {settings?.supabase_configured ? 'Supabase Synced' : 'Local SQLite Active'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label block mb-1.5">Supabase Project URL</label>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="input text-xs"
              />
            </div>

            <div>
              <label className="label block mb-1.5">Supabase Anon Key</label>
              <input
                type="password"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                placeholder="eyJhbGciOi..."
                className="input text-xs"
              />
            </div>
          </div>

          {/* Copyable SQL Schema */}
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="label">Supabase Table Schema (SQL)</span>
              <button
                type="button"
                onClick={handleCopySql}
                className="flex items-center gap-1 text-xs text-accent hover:underline font-medium"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copied SQL' : 'Copy Schema'}</span>
              </button>
            </div>
            <pre className="card-muted p-3.5 font-mono text-[11px] text-text2 overflow-x-auto">
              {sqlSchema}
            </pre>
          </div>
        </div>

        {/* Section 3: Resilient Creative Fallback */}
        <div className="card p-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-sm text-text1">Resilient Creative Fallback Engine</h3>
            <p className="text-xs text-text3 mt-0.5">
              Generates rich, structured narrative treatments if local Ollama inference is offline.
            </p>
          </div>
          <input
            type="checkbox"
            checked={demoFallback}
            onChange={(e) => setDemoFallback(e.target.checked)}
            className="w-4 h-4 rounded accent-accent cursor-pointer"
          />
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" />
              Settings updated successfully!
            </span>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary text-xs"
            >
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
