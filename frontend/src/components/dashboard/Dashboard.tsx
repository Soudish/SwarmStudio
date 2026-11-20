import React from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Film,
  Gamepad2,
  Mic,
  ArrowRight,
  ChevronRight,
  FolderKanban,
  Sparkles
} from 'lucide-react';
import { ProjectData, SettingsData } from '../../types';

interface DashboardProps {
  projects: ProjectData[];
  onOpenCreateModal: () => void;
  onSelectProject: (project: ProjectData) => void;
  onSelectTab: (tab: string) => void;
  settings: SettingsData | null;
}

export const Dashboard: React.FC<DashboardProps> = ({
  projects,
  onOpenCreateModal,
  onSelectProject,
  onSelectTab,
  settings,
}) => {
  const completedCount = projects.filter((p) => p.status === 'completed').length;
  const inProgressCount = projects.filter((p) => p.status === 'generating').length;

  return (
    <div className="space-y-6 pb-16">
      {/* Dark Hero Stat Card with Real Numbers & CTA */}
      <section className="relative overflow-hidden card-dark p-6 sm:p-8">
        {/* Subtle radial light in corner */}
        <div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(142, 126, 248, 0.45) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
              Creative Swarm
            </h2>

            <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 sm:gap-10">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{projects.length}</div>
                <div className="text-xs text-white/60 mt-0.5">Total projects</div>
              </div>
              <div className="w-px h-8 bg-white/10 hidden sm:block" />
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{completedCount}</div>
                <div className="text-xs text-white/60 mt-0.5">Completed</div>
              </div>
              <div className="w-px h-8 bg-white/10 hidden sm:block" />
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{inProgressCount}</div>
                <div className="text-xs text-white/60 mt-0.5">In progress</div>
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <button
              onClick={onOpenCreateModal}
              className="bg-white text-black hover:bg-white/90 font-medium text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>
          </div>
        </div>
      </section>

      {/* Compact Single-Row Status Strip */}
      <div className="flex items-center gap-4 text-xs text-text3 px-1">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              settings?.ollama_status?.online ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          />
          <span className="font-mono text-text2">{settings?.ollama_model || 'Local Model'}</span>
          <span>({settings?.ollama_status?.online ? 'Online' : 'Fallback'})</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-1.5 text-text3">
          <span>5 Specialized Agents synchronized</span>
        </div>
      </div>

      {/* Recent Projects Section */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold tracking-tight text-text1">Recent Projects</h2>
          {projects.length > 0 && (
            <button
              onClick={() => onSelectTab('projects')}
              className="text-xs font-medium text-accent hover:underline flex items-center gap-1"
            >
              <span>View all ({projects.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {projects.length === 0 ? (
          <div className="card card-muted p-16 text-center border-dashed flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-accent-tint text-accent-text flex items-center justify-center mb-4">
              <FolderKanban className="w-7 h-7" />
            </div>
            <h3 className="text-base font-semibold text-text1">No projects yet</h3>
            <p className="text-xs text-text3 mt-1.5 mb-6 max-w-sm">
              Create your first project to start collaborating with the 5 AI creative agents.
            </p>
            <button onClick={onOpenCreateModal} className="btn-primary">
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.05 },
              },
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {projects.slice(0, 6).map((proj, idx) => {
              const TypeIcon =
                proj.project_type === 'film' ? Film : proj.project_type === 'game' ? Gamepad2 : Mic;
              const isGen = proj.status === 'generating';

              return (
                <motion.div
                  key={proj.id}
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
                  }}
                  onClick={() => onSelectProject(proj)}
                  className="group card-interactive p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5 text-xs text-text3 font-medium">
                        <TypeIcon className="w-3.5 h-3.5" />
                        <span className="capitalize">{proj.project_type}</span>
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
                        <span className="text-text3 text-[11px] font-medium">
                          {proj.status === 'completed'
                            ? 'Ready'
                            : isGen
                            ? `${proj.progress}%`
                            : proj.status}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-base font-semibold text-text1 line-clamp-1 group-hover:text-accent transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-text2 mt-1.5 line-clamp-2 leading-relaxed">
                      {proj.idea}
                    </p>

                    {isGen && (
                      <div className="mt-3.5 w-full bg-surface-muted rounded-full h-1 overflow-hidden">
                        <div
                          className="bg-accent h-1 rounded-full transition-all duration-300"
                          style={{ width: `${proj.progress}%` }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs">
                    <span className="text-text3 truncate max-w-[190px]">
                      {proj.genre} · {proj.tone}
                    </span>
                    <span className="flex items-center gap-1 text-accent font-medium text-xs opacity-75 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                      Open <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </section>
    </div>
  );
};
