import React, { useState } from 'react';
import {
  Brain,
  Feather,
  Palette,
  Headphones,
  CheckCircle2,
  Activity,
  Bot,
  ArrowRight,
  Clock
} from 'lucide-react';
import { ProjectData } from '../../types';

interface AgentActivityViewProps {
  activeProject: ProjectData | null;
  projects: ProjectData[];
  onSelectProject: (p: ProjectData) => void;
}

export const AgentActivityView: React.FC<AgentActivityViewProps> = ({
  activeProject,
  projects,
  onSelectProject,
}) => {
  const [selectedAgentFilter, setSelectedAgentFilter] = useState<string>('all');

  const activities = activeProject?.activities || [];

  const getAgentStatus = (agentName: string) => {
    if (!activeProject) return 'idle';
    if (activeProject.status === 'completed') return 'completed';
    const agentActs = activities.filter((a) =>
      a.agent_name.toLowerCase().includes(agentName.toLowerCase())
    );
    if (!agentActs.length) return 'waiting';
    const last = agentActs[agentActs.length - 1];
    return last.status;
  };

  const agents = [
    {
      id: 'research',
      name: 'Research Agent',
      role: 'World Lore & Lore Researcher',
      icon: Brain,
      dotColor: 'bg-agent-research',
      task: 'Constructs world lore, physical/magic laws, and character dossiers.',
      status: getAgentStatus('Research Agent'),
    },
    {
      id: 'story',
      name: 'Story Agent',
      role: 'Screenwriter & Narrative Architect',
      icon: Feather,
      dotColor: 'bg-agent-story',
      task: 'Drafts logline, three-act structure, script treatments, and scene beats.',
      status: getAgentStatus('Story Agent'),
    },
    {
      id: 'visual',
      name: 'Visual Agent',
      role: 'Art Director & Visual Designer',
      icon: Palette,
      dotColor: 'bg-agent-visual',
      task: 'Formulates color palettes, lighting setups, and FLUX image prompts.',
      status: getAgentStatus('Visual Agent'),
    },
    {
      id: 'audio',
      name: 'Audio Agent',
      role: 'Sound Designer & Music Supervisor',
      icon: Headphones,
      dotColor: 'bg-agent-audio',
      task: 'Scores soundtrack themes, voice casting notes, and Foley SFX cues.',
      status: getAgentStatus('Audio Agent'),
    },
    {
      id: 'critic',
      name: 'Critic Agent',
      role: 'Executive Editorial & Continuity',
      icon: CheckCircle2,
      dotColor: 'bg-agent-critic',
      task: 'Audits narrative continuity, scores quality (0–100), and flags revisions.',
      status: getAgentStatus('Critic Agent'),
    },
  ];

  const filteredActivities = activities.filter((a) => {
    if (selectedAgentFilter === 'all') return true;
    return a.agent_name.toLowerCase().includes(selectedAgentFilter.toLowerCase());
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header & Project Selector */}
      <div className="card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <span className="label text-accent">Live Telemetry Flow</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-text1">
            Multi-Agent Swarm Pipeline
          </h1>
          <p className="text-xs text-text3 mt-0.5">
            Real-time execution log and collaboration graph across the 5 specialized autonomous agents.
          </p>
        </div>

        {/* Project Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-text3 whitespace-nowrap">Active Project:</label>
          <select
            value={activeProject?.id || ''}
            onChange={(e) => {
              const found = projects.find((p) => p.id === e.target.value);
              if (found) onSelectProject(found);
            }}
            className="input text-xs py-1.5 px-3 font-medium max-w-[220px]"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pipeline Progression Tracker */}
      <div className="card p-5 space-y-3">
        <span className="label block">Sequential Execution Pipeline</span>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
          {agents.map((ag, i) => {
            const Icon = ag.icon;
            const isCompleted = ag.status === 'completed';
            const isRunning = ag.status === 'running';

            return (
              <div
                key={ag.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                  isRunning
                    ? 'border-accent bg-accent-tint shadow-sm'
                    : isCompleted
                    ? 'border-border bg-surface'
                    : 'border-border bg-surface-muted opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-text3 uppercase">
                      0{i + 1}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        isRunning
                          ? 'bg-accent text-surface animate-pulse'
                          : isCompleted
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-surface-muted text-text3'
                      }`}
                    >
                      {isRunning ? 'Active' : isCompleted ? 'Done' : 'Waiting'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-3.5 h-3.5 ${isRunning ? 'text-accent' : 'text-text2'}`} />
                    <span className="font-semibold text-xs text-text1 truncate">{ag.name}</span>
                  </div>

                  <p className="text-[11px] text-text3 line-clamp-2 mt-1 leading-snug">{ag.task}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-Pane Layout: Agent Status (Left) & Thought Log (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 5 Agent Status Rows */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="label">Agent Status Roster</span>
            <span className="text-xs text-text3">5 Active Agents</span>
          </div>

          <div className="space-y-2.5">
            {agents.map((ag) => {
              const Icon = ag.icon;
              const status = ag.status;
              const isRunning = status === 'running';
              const isDone = status === 'completed';

              return (
                <div
                  key={ag.id}
                  className={`card p-4 flex items-center justify-between gap-3 ${
                    isRunning ? 'border-accent shadow-sm' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-2 h-2 rounded-full ${ag.dotColor} shrink-0`} />
                    <div className="w-8 h-8 rounded-lg bg-surface-muted flex items-center justify-center shrink-0 border border-border">
                      <Icon className="w-4 h-4 text-text2" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-xs text-text1 truncate">{ag.name}</h3>
                      <p className="text-[11px] text-text3 truncate">{ag.role}</p>
                    </div>
                  </div>

                  <span
                    className={`pill text-[10px] shrink-0 ${
                      isRunning
                        ? 'pill-accent font-semibold animate-pulse'
                        : isDone
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : ''
                    }`}
                  >
                    {isRunning ? 'Active' : isDone ? 'Done' : 'Waiting'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Thought & Execution Log Panel */}
        <div className="lg:col-span-7 card p-5 space-y-4 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="label">Thought Log</span>
              <span className="pill text-[10px]">{filteredActivities.length} Events</span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto text-xs scrollbar-none">
              {['all', 'Research', 'Story', 'Visual', 'Audio', 'Critic'].map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedAgentFilter(f)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedAgentFilter === f
                      ? 'bg-text1 text-surface font-semibold'
                      : 'text-text3 hover:text-text1 hover:bg-surface-muted'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {filteredActivities.length === 0 ? (
            <div className="p-12 text-center text-xs text-text3">
              No telemetry events recorded yet for this project. Start a generation to stream live logs.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredActivities.map((act) => (
                <div
                  key={act.id}
                  className="card-muted p-3.5 space-y-1.5 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-text1">
                      <Bot className="w-3.5 h-3.5 text-accent" />
                      <span>{act.agent_name}</span>
                    </div>
                    <span className="text-[10px] text-text3 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(act.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <p className="text-xs text-text2 leading-relaxed">{act.message}</p>

                  {act.details && (
                    <div className="font-mono text-[11px] p-2.5 rounded-lg bg-surface border border-border text-text2 whitespace-pre-wrap mt-1">
                      {act.details}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
