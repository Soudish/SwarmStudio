import React from 'react';
import {
  Plus,
  Film,
  Gamepad2,
  Mic,
  ArrowRight,
  Bot,
  Brain,
  Feather,
  Palette,
  Headphones,
  CheckCircle2,
  ChevronRight,
  Cpu,
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

  const agents = [
    {
      name: 'Research Agent',
      role: 'World & Lore',
      icon: Brain,
      dotColor: 'bg-agent-research',
      deliverables: ['Macro-world environmental rules', 'Psychological character dossiers'],
    },
    {
      name: 'Story Agent',
      role: 'Narrative & Screenplay',
      icon: Feather,
      dotColor: 'bg-agent-story',
      deliverables: ['Three-Act structure & beats', 'Scene dialogue & action lines'],
    },
    {
      name: 'Visual Agent',
      role: 'Art Direction',
      icon: Palette,
      dotColor: 'bg-agent-visual',
      deliverables: ['5-color hex palette', 'FLUX.1 concept art prompts'],
    },
    {
      name: 'Audio Agent',
      role: 'Soundtrack & SFX',
      icon: Headphones,
      dotColor: 'bg-agent-audio',
      deliverables: ['Musical stems & acoustic tone', 'Scene-by-scene SFX cues'],
    },
    {
      name: 'Critic Agent',
      role: 'Continuity & Audit',
      icon: CheckCircle2,
      dotColor: 'bg-agent-critic',
      deliverables: ['0–100 Quality Index', 'Editorial revisions & continuity audit'],
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text1">Studio Dashboard</h1>
          <p className="text-sm text-text2 mt-1">
            Orchestrate autonomous AI agents across narrative, concept art, and audio design.
          </p>
        </div>
        <button
          onClick={onOpenCreateModal}
          className="btn-primary shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Dark Hero Stat Card */}
      <section className="relative overflow-hidden card-dark p-6 sm:p-8">
        {/* Subtle radial light in corner */}
        <div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(142, 126, 248, 0.45) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-white/90 border border-white/10 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-accent-text" />
            <span>Autonomous Multi-Agent Crew</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
            Your creative team, working as one.
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-white/70 leading-relaxed max-w-xl">
            A single premise expands into complete screenplays, multi-dimensional character lore,
            color theory, neural concept art, and acoustic audio synthesis.
          </p>

          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-3 gap-4">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-white">{projects.length}</div>
              <div className="text-xs text-white/60 mt-0.5">Total Projects</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-white">{completedCount}</div>
              <div className="text-xs text-white/60 mt-0.5">Ready for Production</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-white">5 Agents</div>
              <div className="text-xs text-white/60 mt-0.5">Active Swarm</div>
            </div>
          </div>
        </div>
      </section>

      {/* Row of 4 Minimal Stat Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Projects',
            value: `${projects.length}`,
            sub: `${completedCount} completed • ${inProgressCount} generating`,
            icon: FolderKanban,
          },
          {
            label: 'Creative Swarm',
            value: '5 Agents',
            sub: 'Research • Story • Visual • Audio • Critic',
            icon: Bot,
          },
          {
            label: 'Inference Engine',
            value: settings?.ollama_status?.online ? 'Ollama Online' : 'Local Fallback',
            sub: settings?.ollama_status?.online
              ? `Model: ${settings?.ollama_model}`
              : 'Smart offline generator',
            icon: Cpu,
          },
          {
            label: 'Human Review',
            value: 'Interactive',
            sub: 'Live script edit & targeted regen',
            icon: CheckCircle2,
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="card p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="label">{item.label}</span>
                <div className="w-7 h-7 rounded-full bg-accent-tint text-accent-text flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-xl font-bold text-text1 tracking-tight">{item.value}</div>
                <div className="text-xs text-text3 mt-0.5 truncate">{item.sub}</div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Recent Projects Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-text1">Recent Projects</h2>
            <p className="text-xs text-text3">Select any project to open the interactive studio.</p>
          </div>
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
          <div className="card card-muted p-12 text-center border-dashed">
            <h3 className="text-sm font-semibold text-text1">No projects created yet</h3>
            <p className="text-xs text-text3 mt-1 mb-5 max-w-sm mx-auto">
              Start your first creative premise to watch the multi-agent swarm generate an
              interconnected dossier.
            </p>
            <button onClick={onOpenCreateModal} className="btn-primary">
              <Plus className="w-4 h-4" />
              <span>Create First Project</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.slice(0, 6).map((proj) => {
              const typeIcon =
                proj.project_type === 'film' ? Film : proj.project_type === 'game' ? Gamepad2 : Mic;
              const TypeIcon = typeIcon;
              const isGen = proj.status === 'generating';

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
                            : isGen
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'bg-surface-muted text-text3'
                        }`}
                      >
                        {proj.status === 'completed'
                          ? 'Ready'
                          : isGen
                          ? `Generating (${proj.progress}%)`
                          : proj.status}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-text1 line-clamp-1 group-hover:text-accent transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-text2 mt-1 line-clamp-2 leading-relaxed">
                      {proj.idea}
                    </p>

                    {isGen && (
                      <div className="mt-3 w-full bg-surface-muted rounded-full h-1 overflow-hidden">
                        <div
                          className="bg-accent h-1 rounded-full transition-all duration-300"
                          style={{ width: `${proj.progress}%` }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-text3">
                    <span className="truncate max-w-[180px]">
                      {proj.genre} • {proj.tone}
                    </span>
                    <span className="flex items-center gap-1 text-accent font-medium text-xs">
                      Open <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Creative Agents Showcase — Compact Row */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-text1">Creative Agents</h2>
          <p className="text-xs text-text3">
            Autonomous specialists with continuous context inheritance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {agents.map((agent, i) => {
            const Icon = agent.icon;
            return (
              <div key={i} className="card p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2 h-2 rounded-full ${agent.dotColor} shrink-0`} />
                    <Icon className="w-4 h-4 text-text2 shrink-0" />
                    <h3 className="text-xs font-semibold text-text1 truncate">{agent.name}</h3>
                  </div>
                  <div className="text-[11px] text-text3 font-medium mb-3">{agent.role}</div>
                  <ul className="space-y-1">
                    {agent.deliverables.map((del, dIdx) => (
                      <li key={dIdx} className="text-[11px] text-text2 flex items-start gap-1.5 leading-snug">
                        <span className="text-text3 mt-0.5">•</span>
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
