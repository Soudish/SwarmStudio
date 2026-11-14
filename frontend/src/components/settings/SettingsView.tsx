import React, { useState } from 'react';
import {
  Cpu,
  Database,
  Sliders,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Save,
  Copy,
  Check,
  Terminal,
  ExternalLink,
  Sparkles
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
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">System & AI Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure local Ollama LLM inference, Supabase cloud sync, and fallback execution.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Ollama Configuration Section */}
        <div className="p-6 md:p-8 rounded-3xl bg-[#0F1626] border border-purple-500/20 space-y-5 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Local AI Inference (Ollama)</h2>
                <p className="text-xs text-slate-400">Run completely offline models with zero API subscription costs.</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 ${
                  settings?.ollama_status?.online
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${settings?.ollama_status?.online ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                {settings?.ollama_status?.online ? 'Ollama Online' : 'Ollama Offline'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
                Ollama Base URL
              </label>
              <input
                type="text"
                value={ollamaUrl}
                onChange={(e) => setOllamaUrl(e.target.value)}
                placeholder="http://localhost:11434"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
                Default Model Name
              </label>
              <input
                type="text"
                value={ollamaModel}
                onChange={(e) => setOllamaModel(e.target.value)}
                placeholder="llama3.2, mistral, gemma2, etc."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Test Connection Button & Result */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handleTestOllama}
              disabled={testingOllama}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-purple-300 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 transition-all self-start"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testingOllama ? 'animate-spin' : ''}`} />
              <span>{testingOllama ? 'Testing Connection...' : 'Test Ollama Connection'}</span>
            </button>

            {testResult && (
              <div className="text-xs">
                {testResult.status.online ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Ollama v{testResult.status.version} detected! ({testResult.models?.length || 0} models installed)
                  </span>
                ) : (
                  <span className="text-amber-400 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    {testResult.status.error} (Creative engine will use smart fallback)
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Quick Ollama CLI command callout */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-900 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase text-[10px]">
              <Terminal className="w-3.5 h-3.5 text-purple-400" />
              Quick Setup Command
            </div>
            <p className="text-slate-400">
              To download and launch the recommended local model on your system, run:
            </p>
            <div className="p-2 rounded-lg bg-slate-900 font-mono text-purple-300 text-[11px] border border-slate-800">
              ollama run llama3.2
            </div>
          </div>
        </div>

        {/* Supabase Cloud Persistence Section */}
        <div className="p-6 md:p-8 rounded-3xl bg-[#0F1626] border border-slate-800 space-y-5 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Database & Supabase Sync</h2>
                <p className="text-xs text-slate-400">
                  Dual-tier persistence: Automatic local SQLite storage + optional Supabase cloud replication.
                </p>
              </div>
            </div>

            <span
              className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                settings?.supabase_configured
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {settings?.supabase_configured ? 'Supabase Connected' : 'Local SQLite Active'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
                Supabase Project URL
              </label>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
                Supabase Anon / Secret Key
              </label>
              <input
                type="password"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                placeholder="eyJhbGciOi..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Copyable SQL Schema */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Supabase Table Schema (SQL)
              </span>
              <button
                type="button"
                onClick={handleCopySql}
                className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copied SQL' : 'Copy Schema'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-slate-950 font-mono text-[11px] text-slate-400 border border-slate-900 overflow-x-auto">
              {sqlSchema}
            </pre>
          </div>
        </div>

        {/* Fallback & Hackathon Presentation Mode */}
        <div className="p-6 rounded-2xl bg-[#0F1626] border border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-sm">Resilient Creative Fallback Engine</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Automatically generates rich, structured creative scripts even when Ollama is offline or downloading models.
            </p>
          </div>
          <input
            type="checkbox"
            checked={demoFallback}
            onChange={(e) => setDemoFallback(e.target.checked)}
            className="w-5 h-5 rounded accent-purple-600 cursor-pointer"
          />
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-4">
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" />
              Settings updated successfully!
            </span>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-900/30 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
