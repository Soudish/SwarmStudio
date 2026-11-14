import React from 'react';
import {
  Sparkles,
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
  Clock,
  ChevronRight,
  ShieldAlert,
  Cpu
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
      role: 'World-Building & Lore',
      icon: Brain,
      color: 'from-blue-600 to-cyan-500',
      description: 'Develops deep world history, rules of the universe, and psychologically rich character dossiers.',
    },
    {
      name: 'Story Agent',
      role: 'Screenplay & Narrative',
      icon: Feather,
      color: 'from-purple-600 to-pink-500',
      description: 'Crafts dramatic 3-act narrative structures, scripts with realistic dialogue, and scene beats.',
    },
    {
      name: 'Visual Agent',
      role: 'Art Direction & Concept',
      icon: Palette,
      color: 'from-amber-500 to-rose-500',
      description: 'Defines color theory, lighting atmosphere, cinematography, and copyable text-to-image prompts.',
    },
    {
      name: 'Audio Agent',
      role: 'Soundtrack & SFX Design',
      icon: Headphones,
      color: 'from-emerald-500 to-teal-400',
      description: 'Scores musical motifs, acoustic world-building, scene-by-scene SFX cues, and voice casting notes.',
    },
    {
      name: 'Critic Agent',
      role: 'Continuity & Editorial',
      icon: CheckCircle2,
      color: 'from-violet-600 to-indigo-500',
      description: 'Audits multi-department outputs, detects inconsistencies, scores quality, and recommends revisions.',
    },
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#131B2E] to-[#0A0E1A] border border-purple-500/20 p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            CrewAI Multi-Agent Swarm Orchestration
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Your AI Creative Team, <br />
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
              Collaborating As One.
            </span>
          </h1>

          <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
            Transform a single prompt into an entire cinematic universe. Specialized AI agents collaborate, review each other's work, and deliver complete scripts, world lore, visual prompts, and acoustic soundscapes.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-xl shadow-purple-900/30 border border-purple-400/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-5 h-5" />
              <span>Launch New Project</span>
            </button>

            <button
              onClick={() => onSelectTab('activity')}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-purple-500/40 transition-all text-sm"
            >
              <Bot className="w-4 h-4 text-purple-400" />
              <span>Inspect Agent Swarm</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0F1626] border border-purple-500/10 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Total Projects</span>
            <Film className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">{projects.length}</div>
          <div className="mt-1 text-xs text-slate-400">
            {completedCount} completed &bull; {inProgressCount} in progress
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F1626] border border-purple-500/10 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Creative Swarm</span>
            <Bot className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">5 Agents</div>
          <div className="mt-1 text-xs text-purple-300">Research &bull; Story &bull; Visual &bull; Audio &bull; Critic</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F1626] border border-purple-500/10 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Inference Engine</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">
            {settings?.ollama_status?.online ? 'Ollama Online' : 'Local Fallback'}
          </div>
          <div className="mt-1 text-xs text-slate-400 truncate">
            {settings?.ollama_status?.online ? `Model: ${settings?.ollama_model}` : 'Smart generative engine'}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F1626] border border-purple-500/10 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Human Review</span>
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">Interactive</div>
          <div className="mt-1 text-xs text-slate-400">Edit, regenerate, and export</div>
        </div>
      </section>

      {/* Agents Swarm Showcase */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Specialized Creative Agents</h2>
            <p className="text-sm text-slate-400">Each agent brings distinct expertise to your project pipeline.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {agents.map((agent, i) => {
            const Icon = agent.icon;
            return (
              <div
                key={i}
                className="group p-5 rounded-2xl bg-[#0F1626] border border-slate-800 hover:border-purple-500/40 hover:bg-[#131B2E] transition-all shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-white mb-3 shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-base group-hover:text-purple-300 transition-colors">
                    {agent.name}
                  </h3>
                  <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider mt-0.5">
                    {agent.role}
                  </div>
                  <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                    {agent.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Projects Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Recent Studio Projects</h2>
            <p className="text-sm text-slate-400">Continue exploring or editing your generated creative projects.</p>
          </div>
          {projects.length > 0 && (
            <button
              onClick={() => onSelectTab('projects')}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <span>View all projects ({projects.length})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {projects.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#0F1626] border border-dashed border-slate-800">
            <div className="w-12 h-12 mx-auto rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">No Creative Projects Yet</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto mt-1 mb-6">
              Launch your first project to watch the multi-agent swarm generate scripts, lore, visuals, and audio.
            </p>
            <button
              onClick={onOpenCreateModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Project</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.slice(0, 6).map((proj) => {
              const typeIcon =
                proj.project_type === 'film' ? Film : proj.project_type === 'game' ? Gamepad2 : Mic;
              const TypeIcon = typeIcon;

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
                            : proj.status === 'generating'
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {proj.status === 'completed'
                          ? 'Ready'
                          : proj.status === 'generating'
                          ? `Generating (${proj.progress}%)`
                          : proj.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {proj.idea}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                    <span>{proj.genre} &bull; {proj.tone}</span>
                    <span className="flex items-center gap-1 text-purple-400 group-hover:translate-x-1 transition-transform">
                      Open <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
