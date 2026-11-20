import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Film,
  Gamepad2,
  Mic,
  Search,
  Plus,
  Trash2,
  Download,
  Calendar,
  Loader2
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
      {/* Slim Toolbar Row (No big card container) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-text3 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search projects by title or premise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input text-xs pl-10 pr-3 py-2 w-full"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none">
          {[
            { id: 'all', label: 'All' },
            { id: 'film', label: 'Film' },
            { id: 'game', label: 'Game' },
            { id: 'podcast', label: 'Podcast' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTypeFilter(id as any)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                typeFilter === id
                  ? 'bg-text1 text-surface font-semibold shadow-sm'
                  : 'text-text3 hover:text-text1 hover:bg-surface-muted'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid with Stagger & Layout Transitions */}
      {filtered.length === 0 ? (
        <div className="card card-muted p-12 text-center border-dashed">
          <h3 className="text-sm font-semibold text-text1">No projects found</h3>
          <p className="text-xs text-text3 mt-1 mb-4">
            Try a different search or create a new project.
          </p>
          <button onClick={onOpenCreateModal} className="btn-primary text-xs">
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((proj) => {
              const TypeIcon =
                proj.project_type === 'film' ? Film : proj.project_type === 'game' ? Gamepad2 : Mic;
              const isGen = proj.status === 'generating';

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  key={proj.id}
                  onClick={() => onSelectProject(proj)}
                  className="group card-interactive p-5 flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Format Icon + Label, Status Dot */}
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-1.5 text-xs text-text3 font-medium">
                        <TypeIcon className="w-3.5 h-3.5" />
                        <span className="capitalize">{proj.project_type}</span>
                        <span>·</span>
                        <span className="truncate max-w-[120px]">{proj.genre}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            proj.status === 'completed'
                              ? 'bg-emerald-500'
                              : isGen
                              ? 'bg-amber-500 animate-pulse'
                              : 'bg-text3'
                          }`}
                        />
                        <span className="text-[11px] text-text3 font-medium">
                          {proj.status === 'completed' ? 'Ready' : isGen ? `${proj.progress}%` : proj.status}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-semibold text-base text-text1 line-clamp-1 group-hover:text-accent transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-text2 mt-1.5 line-clamp-1 leading-relaxed">
                      {proj.idea}
                    </p>
                  </div>

                  {/* Footer: Date & Actions on hover/focus */}
                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-text3">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Calendar className="w-3 h-3 text-text3" />
                      <span>{new Date(proj.created_at).toLocaleDateString()}</span>
                    </div>

                    <div
                      className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
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
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};
