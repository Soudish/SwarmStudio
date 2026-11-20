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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div
        className="w-full max-w-xl card p-6 sm:p-8 my-8 shadow-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-text3 hover:text-text1 hover:bg-surface-muted transition-colors"
          aria-label="Close Export Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-accent-tint text-accent-text flex items-center justify-center shrink-0">
            <FileDown className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-text1">Export Project</h2>
          </div>
        </div>

        {/* Project Mini-Banner */}
        <div className="mt-3 p-3 rounded-xl card-muted flex items-center justify-between text-xs">
          <div className="truncate pr-3">
            <span className="font-semibold text-accent uppercase tracking-wider">{project.project_type}</span>
            <span className="mx-2 text-text3">•</span>
            <span className="font-medium text-text1">{project.title}</span>
          </div>
          <span className="pill text-[10px] shrink-0">
            {project.genre}
          </span>
        </div>

        {/* Feedback Banners */}
        {successMsg && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Export Options Grid */}
        <div className="mt-4 space-y-3">
          {/* 1. PDF Dossier */}
          <div className="card-muted p-4 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-text1">PDF Document</span>
                </div>
                <p className="text-[11px] text-text3 mt-0.5">
                  Executive dossier with cover, lore, and screenplay.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleDownloadPdf}
                  disabled={loadingAction !== null}
                  className="btn-primary text-xs py-1.5 px-3 disabled:opacity-50"
                >
                  {loadingAction === 'pdf-download' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <FileDown className="w-3.5 h-3.5" />
                  )}
                  <span>Download PDF</span>
                </button>

                <button
                  onClick={handlePrintDossier}
                  disabled={loadingAction !== null}
                  title="Open print view or save as PDF"
                  className="btn-ghost text-xs py-1.5 px-3"
                >
                  <Printer className="w-3.5 h-3.5 text-text3" />
                  <span>Print</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2. Markdown Script */}
          <div className="card-muted p-4 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-text1">Markdown (.md)</span>
                </div>
                <p className="text-[11px] text-text3 mt-0.5">
                  Treatment compatible with Final Draft and Markdown apps.
                </p>
              </div>

              <button
                onClick={handleDownloadMarkdown}
                disabled={loadingAction !== null}
                className="btn-ghost text-xs py-1.5 px-3 shrink-0 disabled:opacity-50"
              >
                {loadingAction === 'markdown' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-text3" />
                )}
                <span>Download MD</span>
              </button>
            </div>
          </div>

          {/* 3. Copy to Clipboard */}
          <div className="card-muted p-4 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-text1">Copy to Clipboard</span>
                <p className="text-[11px] text-text3 mt-0.5">
                  Copy full treatment and scene breakdown.
                </p>
              </div>

              <button
                onClick={handleCopyClipboard}
                disabled={loadingAction !== null}
                className="btn-ghost text-xs py-1.5 px-3 shrink-0 disabled:opacity-50"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-text3" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="btn-ghost text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
