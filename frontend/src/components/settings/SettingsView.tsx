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
      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Ollama Local LLM Configuration */}
        <div className="card p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent-tint text-accent-text flex items-center justify-center shrink-0">
                <Cpu className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-text1">Ollama Inference</h2>
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
              <span>{settings?.ollama_status?.online ? 'Online' : 'Offline'}</span>
            </span>
          </div>

          <div className="space-y-5">
            {/* Row 1: Ollama URL */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-border/50">
              <div className="md:w-1/3">
                <label className="label block">Server Base URL</label>
                <p className="text-[11px] text-text3 mt-0.5">Local Ollama HTTP endpoint</p>
              </div>
              <div className="md:w-2/3">
                <input
                  type="text"
                  value={ollamaUrl}
                  onChange={(e) => setOllamaUrl(e.target.value)}
                  placeholder="http://localhost:11434"
                  className="input text-xs"
                />
              </div>
            </div>

            {/* Row 2: Model Name */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-border/50">
              <div className="md:w-1/3">
                <label className="label block">Default Model</label>
                <p className="text-[11px] text-text3 mt-0.5">e.g. llama3.2, mistral, gemma2</p>
              </div>
              <div className="md:w-2/3">
                <input
                  type="text"
                  value={ollamaModel}
                  onChange={(e) => setOllamaModel(e.target.value)}
                  placeholder="llama3.2"
                  className="input text-xs"
                />
              </div>
            </div>

            {/* Row 3: Offline Fallback */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-border/50">
              <div className="md:w-1/3">
                <label className="label block">Offline Fallback</label>
                <p className="text-[11px] text-text3 mt-0.5">Structured fallback if offline</p>
              </div>
              <div className="md:w-2/3 flex items-center justify-between">
                <span className="text-xs text-text2">
                  {demoFallback ? 'Enabled (resilient generation)' : 'Disabled (strict local only)'}
                </span>
                <input
                  type="checkbox"
                  checked={demoFallback}
                  onChange={(e) => setDemoFallback(e.target.checked)}
                  className="w-4 h-4 rounded accent-accent cursor-pointer"
                />
              </div>
            </div>

            {/* Row 4: Test Connection & Quick Setup */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={handleTestOllama}
                disabled={testingOllama}
                className="btn-ghost text-xs self-start border border-border hover:border-border-hover"
              >
                {testingOllama ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}
                <span>{testingOllama ? 'Testing...' : 'Test Connection'}</span>
              </button>

              {testResult && (
                <div className="text-xs">
                  {testResult.status.online ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Connected (v{testResult.status.version}, {testResult.models?.length || 0} models)
                    </span>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" />
                      {testResult.status.error || 'Connection failed'} (Offline mode active)
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="card-muted p-3 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 text-text3 font-semibold text-[10px] uppercase tracking-wider">
                <Terminal className="w-3 h-3 text-accent" />
                <span>Quick Pull</span>
              </div>
              <div className="p-1.5 rounded bg-surface border border-border font-mono text-[11px] text-text1">
                ollama run {ollamaModel || 'llama3.2'}
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Supabase Cloud Database */}
        <div className="card p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-surface-muted text-text1 flex items-center justify-center shrink-0 border border-border">
                <Database className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-text1">Supabase Sync</h2>
            </div>

            <span className="pill text-xs">
              {settings?.supabase_configured ? 'Synced' : 'Local SQLite'}
            </span>
          </div>

          <div className="space-y-5">
            {/* Row 1: Supabase URL */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-border/50">
              <div className="md:w-1/3">
                <label className="label block">Project URL</label>
                <p className="text-[11px] text-text3 mt-0.5">Supabase project endpoint</p>
              </div>
              <div className="md:w-2/3">
                <input
                  type="text"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="input text-xs"
                />
              </div>
            </div>

            {/* Row 2: Supabase Anon Key */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-border/50">
              <div className="md:w-1/3">
                <label className="label block">Anon Key</label>
                <p className="text-[11px] text-text3 mt-0.5">Public client authentication key</p>
              </div>
              <div className="md:w-2/3">
                <input
                  type="password"
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  placeholder="eyJhbGciOi..."
                  className="input text-xs"
                />
              </div>
            </div>

            {/* Row 3: Schema (SQL) */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <div>
                  <span className="label block">Database Schema</span>
                  <p className="text-[11px] text-text3">Paste in Supabase SQL editor</p>
                </div>
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="flex items-center gap-1 text-xs text-accent hover:underline font-medium"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Copied' : 'Copy SQL'}</span>
                </button>
              </div>
              <pre className="card-muted p-3 font-mono text-[11px] text-text2 overflow-x-auto max-h-40">
                {sqlSchema}
              </pre>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" />
              Settings saved!
            </span>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary text-xs shadow-sm"
            >
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
