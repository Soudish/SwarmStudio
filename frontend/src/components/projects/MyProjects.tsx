import React, { useState } from 'react';
import {
  Film,
  Gamepad2,
  Mic,
  Search,
  Plus,
  Trash2,
  Download,
  Calendar,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { ProjectData, ProjectType } from '../../types';
import { api } from '../../services/api';
import { printProjectDossier } from '../../services/clientExport';

interface MyProjectsProps {
  projects: ProjectData[];
  onSelectProject: (p: ProjectData) => void;
  onOpenCreateModal: () => void;
  onRefreshProjects: () => void;
}

export const MyProjects: React.FC<MyProjectsProps> = ({
  projects,
  onSelectProject,
  onOpenCreateModal,
  onRefreshProjects,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | ProjectType>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [exportingId, setExportingId] = useState<string | null>(null);

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.idea.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.genre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || p.project_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleExportPdf = async (e: React.MouseEvent, proj: ProjectData) => {
    e.stopPropagation();
    try {
      setExportingId(proj.id);
      const safeTitle = (proj.title || 'project').replace(/[^a-zA-Z0-9_-]/g, '_');
      await api.exportProject(proj.id, 'pdf', `${safeTitle}_dossier.pdf`);
    } catch (err: any) {
      console.warn('Backend export failed, falling back to browser print engine:', err);
      printProjectDossier(proj);
    } finally {
      setExportingId(null);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      setDeletingId(id);
      await api.deleteProject(id);
      onRefreshProjects();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text1">My Projects</h1>
          <p className="text-xs text-text3 mt-0.5">
            Manage, review, edit, and export your multi-agent studio productions.
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="btn-primary text-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="card p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-text3 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, genre, premise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input text-xs pl-9 py-2"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs scrollbar-none">
          {[
            { id: 'all', label: 'All Formats' },
            { id: 'film', label: 'Films' },
            { id: 'game', label: 'Games' },
            { id: 'podcast', label: 'Podcasts' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTypeFilter(id as any)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                typeFilter === id
                  ? 'bg-text1 text-surface font-semibold'
                  : 'text-text3 hover:text-text1 hover:bg-surface-muted'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filtered.length === 0 ? (
        <div className="card card-muted p-12 text-center border-dashed">
          <h3 className="text-sm font-semibold text-text1">No Matching Projects</h3>
          <p className="text-xs text-text3 mt-1 mb-4">
            Try a different search query or launch a new creative project.
          </p>
          <button onClick={onOpenCreateModal} className="btn-primary text-xs">
            <Plus className="w-4 h-4" />
            <span>Create New Project</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((proj) => {
            const TypeIcon =
              proj.project_type === 'film' ? Film : proj.project_type === 'game' ? Gamepad2 : Mic;

            return (
              <div
                key={proj.id}
                onClick={() => onSelectProject(proj)}
                className="card-interactive p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="pill text-[11px]">
                      <TypeIcon className="w-3 h-3 text-text3" />
                      <span className="capitalize">{proj.project_type}</span>
                    </span>
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                        proj.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {proj.status === 'completed' ? 'Ready' : `Generating (${proj.progress}%)`}
                    </span>
                  </div>

                  <h3 className="font-semibold text-base text-text1 line-clamp-1 group-hover:text-accent transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-text2 mt-1 line-clamp-2 leading-relaxed">
                    {proj.idea}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
                    <span className="pill text-[10px]">{proj.genre}</span>
                    <span className="pill text-[10px]">{proj.tone}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs text-text3">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Calendar className="w-3 h-3 text-text3" />
                    <span>{new Date(proj.created_at).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => handleExportPdf(e, proj)}
                      disabled={exportingId === proj.id}
                      title="Download PDF Dossier"
                      className="p-1.5 rounded-lg text-text3 hover:text-text1 hover:bg-surface-muted transition-colors disabled:opacity-50"
                    >
                      {exportingId === proj.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, proj.id)}
                      disabled={deletingId === proj.id}
                      title="Delete Project"
                      className="p-1.5 rounded-lg text-text3 hover:text-rose-500 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
