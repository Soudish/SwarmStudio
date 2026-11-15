import React, { useState } from 'react';
import {
  X,
  FileText,
  Printer,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  FileDown
} from 'lucide-react';
import { ProjectData } from '../../types';
import { api } from '../../services/api';
import {
  downloadClientMarkdown,
  printProjectDossier,
  copyProjectToClipboard
} from '../../services/clientExport';
import { useTheme } from '../../contexts/ThemeContext';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectData;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const { isDark } = useTheme();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setErrorMsg(null);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleDownloadPdf = async () => {
    setLoadingAction('pdf-download');
    setErrorMsg(null);
    try {
      const safeTitle = (project.title || 'project').replace(/[^a-zA-Z0-9_-]/g, '_');
      await api.exportProject(project.id, 'pdf', `${safeTitle}_dossier.pdf`);
      showSuccess('PDF downloaded successfully!');
    } catch (err: any) {
      console.warn('Backend PDF export failed, falling back to browser print engine:', err);
      // Seamless fallback to browser printable dossier
      printProjectDossier(project);
      showSuccess('Opened printable PDF dossier in browser window.');
    } finally {
      setLoadingAction(null);
    }
  };

  const handlePrintDossier = () => {
    try {
      printProjectDossier(project);
      showSuccess('Opened print / save as PDF dialog.');
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to open print dialog.');
    }
  };

  const handleDownloadMarkdown = async () => {
    setLoadingAction('markdown');
    setErrorMsg(null);
    try {
      const safeTitle = (project.title || 'project').replace(/[^a-zA-Z0-9_-]/g, '_');
      await api.exportProject(project.id, 'markdown', `${safeTitle}_dossier.md`);
      showSuccess('Markdown downloaded successfully!');
    } catch (err) {
      console.warn('API markdown export failed, using instant client generation:', err);
      downloadClientMarkdown(project);
      showSuccess('Markdown dossier saved!');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleCopyClipboard = async () => {
    setLoadingAction('copy');
    const ok = await copyProjectToClipboard(project);
    if (ok) {
      setCopied(true);
      showSuccess('Full project screenplay copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } else {
      setErrorMsg('Failed to copy to clipboard.');
    }
    setLoadingAction(null);
  };

  const cardBg = isDark ? 'bg-[#0F1626]' : 'bg-white';
  const cardBorder = isDark ? 'border-slate-800' : 'border-slate-200';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';
  const tileBg = isDark ? 'bg-slate-900/70 border-slate-800 hover:border-purple-500/40' : 'bg-slate-50/80 border-slate-200 hover:border-purple-300';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-xl rounded-3xl border shadow-2xl p-6 sm:p-8 relative ${cardBg} ${cardBorder}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-5 right-5 p-2 rounded-xl transition-colors ${
            isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
          aria-label="Close Export Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/30">
            <FileDown className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-xl font-bold tracking-tight ${textPrimary}`}>Export Creative Dossier</h2>
            <p className={`text-xs ${textMuted}`}>Select a format to save or distribute your production package.</p>
          </div>
        </div>

        {/* Project Mini-Banner */}
        <div className={`mt-4 p-3 rounded-xl border flex items-center justify-between text-xs ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-purple-50/40 border-purple-100'}`}>
          <div className="truncate pr-3">
            <span className="font-semibold text-purple-400">{project.project_type.toUpperCase()}</span>
            <span className={`mx-2 ${textMuted}`}>&bull;</span>
            <span className={`font-medium ${textPrimary}`}>{project.title}</span>
          </div>
          <span className={`text-[11px] px-2 py-0.5 rounded-md font-semibold ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-700 shadow-sm'}`}>
            {project.genre}
          </span>
        </div>

        {/* Feedback Messages */}
        {successMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Export Options Grid */}
        <div className="mt-5 space-y-3">
          {/* 1. PDF Dossier */}
          <div className={`p-4 rounded-2xl border transition-all ${tileBg}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${textPrimary}`}>Production PDF Package</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-purple-500/20 text-purple-400">
                    Recommended
                  </span>
                </div>
                <p className={`text-[11px] mt-0.5 ${textMuted}`}>
                  Formatted production dossier with title page, characters, and scenes.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadPdf}
                  disabled={loadingAction !== null}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                >
                  {loadingAction === 'pdf-download' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <FileDown className="w-3.5 h-3.5" />
                  )}
                  <span>Download .PDF</span>
                </button>

                <button
                  onClick={handlePrintDossier}
                  disabled={loadingAction !== null}
                  title="Open print view or save as PDF directly from browser"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
                    isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <Printer className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Print View</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2. Markdown Script */}
          <div className={`p-4 rounded-2xl border transition-all ${tileBg}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${textPrimary}`}>Markdown Treatment (.md)</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-indigo-500/20 text-indigo-400">
                    Script Editors
                  </span>
                </div>
                <p className={`text-[11px] mt-0.5 ${textMuted}`}>
                  Raw screenplay and worldbuilding, compatible with Obsidian and Final Draft.
                </p>
              </div>

              <button
                onClick={handleDownloadMarkdown}
                disabled={loadingAction !== null}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                  isDark ? 'border-indigo-500/40 text-indigo-300 bg-indigo-500/15 hover:bg-indigo-500/25' : 'border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100'
                }`}
              >
                {loadingAction === 'markdown' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <FileText className="w-3.5 h-3.5" />
                )}
                <span>Download .MD</span>
              </button>
            </div>
          </div>

          {/* 3. Copy to Clipboard */}
          <div className={`p-4 rounded-2xl border transition-all ${tileBg}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className={`text-xs font-bold ${textPrimary}`}>Direct Clipboard Copy</span>
                <p className={`text-[11px] mt-0.5 ${textMuted}`}>
                  Copy the entire script treatment to paste anywhere immediately.
                </p>
              </div>

              <button
                onClick={handleCopyClipboard}
                disabled={loadingAction !== null}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
                  copied
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                    : isDark
                    ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                    : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Script'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${
              isDark ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
