import React, { useState } from 'react';
import {
  Film,
  Gamepad2,
  Mic,
  Search,
  Plus,
  Trash2,
  Download,
  ExternalLink,
  Filter,
  Calendar,
  Layers,
  FileText
} from 'lucide-react';
import { ProjectData, ProjectType } from '../../types';
import { api } from '../../services/api';

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

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.idea.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.genre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || p.project_type === typeFilter;
    return matchesSearch && matchesType;
  });

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
          <h1 className="text-2xl font-bold text-white tracking-tight">My Creative Projects</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage, review, edit, and export your multi-agent studio creations.
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-900/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-[#0F1626] border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, genre, premise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
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
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0F1626] border border-dashed border-slate-800">
          <h3 className="text-base font-bold text-white">No Matching Projects</h3>
          <p className="text-xs text-slate-400 mt-1">Try a different search term or create a new project.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((proj) => {
            const TypeIcon =
              proj.project_type === 'film' ? Film : proj.project_type === 'game' ? Gamepad2 : Mic;

            return (
              <div
                key={proj.id}
                onClick={() => onSelectProject(proj)}
                className="group cursor-pointer p-5 rounded-2xl bg-[#0F1626] border border-slate-800 hover:border-purple-500/40 hover:bg-[#131B2E] transition-all shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                      <TypeIcon className="w-3.5 h-3.5" />
                      {proj.project_type.toUpperCase()}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        proj.status === 'completed'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {proj.status === 'completed' ? 'Ready' : `Generating (${proj.progress}%)`}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {proj.idea}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-slate-400">
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">
                      {proj.genre}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">
                      {proj.tone}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(proj.created_at).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <a
                      href={api.getExportUrl(proj.id, 'pdf')}
                      download
                      title="Download PDF"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={(e) => handleDelete(e, proj.id)}
                      disabled={deletingId === proj.id}
                      title="Delete Project"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
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
