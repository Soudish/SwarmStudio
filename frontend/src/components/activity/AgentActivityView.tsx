import React, { useState } from 'react';
import {
  Brain,
  Feather,
  Palette,
  Headphones,
  CheckCircle2,
  Activity,
  Bot
} from 'lucide-react';
import { ProjectData } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

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
  const { isDark } = useTheme();
  const [selectedAgentFilter, setSelectedAgentFilter] = useState<string>('all');

  const activities = activeProject?.activities || [];

  const getAgentStatus = (agentName: string) => {
    if (!activeProject) return 'idle';
    if (activeProject.status === 'completed') return 'completed';
    const agentActs = activities.filter((a) => a.agent_name.toLowerCase().includes(agentName.toLowerCase()));
    if (!agentActs.length) return 'waiting';
    const last = agentActs[agentActs.length - 1];
    return last.status;
  };

  const agents = [
    {
      id: 'research',
      name: 'Research Agent',
      role: 'World-Building & Lore Researcher',
      icon: Brain,
      color: 'text-blue-500 bg-blue-500/15 border-blue-500/30',
      task: 'Construct world lore, laws of physics/magic, and multi-dimensional character dossiers.',
      status: getAgentStatus('Research Agent'),
    },
    {
      id: 'story',
      name: 'Story Agent',
      role: 'Screenwriter & Narrative Architect',
      icon: Feather,
      color: 'text-purple-500 bg-purple-500/15 border-purple-500/30',
      task: 'Draft logline, three-act structure, script excerpts, and scene breakdown.',
      status: getAgentStatus('Story Agent'),
    },
    {
      id: 'visual',
      name: 'Visual Agent',
      role: 'Art Director & Concept Artist',
      icon: Palette,
      color: 'text-amber-500 bg-amber-500/15 border-amber-500/30',
      task: 'Formulate color palettes, cinematography directives, and Midjourney image prompts.',
      status: getAgentStatus('Visual Agent'),
    },
    {
      id: 'audio',
      name: 'Audio Agent',
      role: 'Sound Designer & Music Supervisor',
      icon: Headphones,
      color: 'text-emerald-500 bg-emerald-500/15 border-emerald-500/30',
      task: 'Design musical score motifs, soundtrack tracks, voice casting, and SFX cues.',
      status: getAgentStatus('Audio Agent'),
    },
    {
      id: 'critic',
      name: 'Critic Agent',
      role: 'Lead Editorial & Narrative Critic',
      icon: CheckCircle2,
      color: 'text-violet-500 bg-violet-500/15 border-violet-500/30',
      task: 'Audit cross-department continuity, score quality, and identify improvement directives.',
      status: getAgentStatus('Critic Agent'),
    },
  ];

  const filteredActivities = activities.filter((a) => {
    if (selectedAgentFilter === 'all') return true;
    return a.agent_name.toLowerCase().includes(selectedAgentFilter.toLowerCase());
  });

  const cardBg = isDark ? 'bg-[#0F1626]' : 'bg-white';
  const cardBorder = isDark ? 'border-slate-800' : 'border-slate-200 shadow-sm';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="space-y-8 pb-20">
      {/* Top Header & Project Selector */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border ${cardBg} ${isDark ? 'border-purple-500/20' : 'border-purple-200 shadow-md'}`}>
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-500 mb-1">
            <Activity className="w-4 h-4 animate-pulse" />
            Live Swarm Orchestration Telemetry
          </div>
          <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${textPrimary}`}>
            Multi-Agent Execution Pipeline
          </h1>
          <p className={`text-xs mt-1 ${textMuted}`}>
            Monitoring CrewAI autonomous agents collaborating across creative departments.
          </p>
        </div>

        {/* Project Dropdown */}
        <div className="flex items-center gap-2">
          <label className={`text-xs whitespace-nowrap ${textMuted}`}>Project:</label>
          <select
            value={activeProject?.id || ''}
            onChange={(e) => {
              const found = projects.find((p) => p.id === e.target.value);
              if (found) onSelectProject(found);
            }}
            className={`px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-purple-500 font-medium ${
              isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
            }`}
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Swarm Architecture Workflow Flowchart */}
      <div className={`p-6 rounded-2xl border space-y-4 ${cardBg} ${cardBorder}`}>
        <h2 className={`text-sm font-bold uppercase tracking-wider ${textMuted}`}>
          Agent Collaboration Architecture & Dependency Graph
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {agents.map((ag, i) => {
            const Icon = ag.icon;
            const isCompleted = ag.status === 'completed';
            const isRunning = ag.status === 'running';

            return (
              <div
                key={ag.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isRunning
                    ? isDark ? 'bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-600/20' : 'bg-purple-100/70 border-purple-400 shadow-md'
                    : isCompleted
                    ? isDark ? 'bg-[#131B2E] border-emerald-500/40' : 'bg-emerald-50 border-emerald-300'
                    : isDark ? 'bg-slate-900/50 border-slate-800 opacity-70' : 'bg-slate-50 border-slate-200 opacity-80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Step 0{i + 1}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isRunning
                          ? 'bg-amber-500/20 text-amber-500 animate-pulse'
                          : isCompleted
                          ? 'bg-emerald-500/20 text-emerald-500'
                          : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isRunning ? 'Running' : isCompleted ? 'Completed' : 'Waiting'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-1.5">
                    <div className={`p-1.5 rounded-lg border ${ag.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`font-bold text-xs ${textPrimary}`}>{ag.name}</span>
                  </div>

                  <p className={`text-[11px] line-clamp-2 mt-1 ${textMuted}`}>{ag.task}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Agent Status Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {agents.map((ag) => {
          const Icon = ag.icon;
          const status = ag.status;
          return (
            <div
              key={ag.id}
              className={`p-5 rounded-2xl border space-y-3 shadow-md ${cardBg} ${cardBorder}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl border ${ag.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm ${textPrimary}`}>{ag.name}</h3>
                    <span className="text-[11px] text-purple-500 font-medium">{ag.role}</span>
                  </div>
                </div>

                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                    status === 'running'
                      ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30 animate-pulse'
                      : status === 'completed'
                      ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                      : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {status === 'running' ? 'Active' : status === 'completed' ? 'Done' : 'Idle'}
                </span>
              </div>

              <p className={`text-xs leading-relaxed ${textMuted}`}>{ag.task}</p>
            </div>
          );
        })}
      </div>

      {/* Live Activity Stream Feed */}
      <div className={`p-6 rounded-2xl border space-y-4 ${cardBg} ${cardBorder}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className={`font-bold text-base ${textPrimary}`}>Execution Event Feed</h2>
            <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
              {filteredActivities.length} Events
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {['all', 'Research', 'Story', 'Visual', 'Audio', 'Critic'].map((f) => (
              <button
                key={f}
                onClick={() => setSelectedAgentFilter(f)}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  selectedAgentFilter === f
                    ? 'bg-purple-600 text-white'
                    : isDark ? 'bg-slate-900 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filteredActivities.length === 0 ? (
          <div className={`p-8 text-center text-xs ${textMuted}`}>
            No agent activities recorded for this project yet. Start a generation to view live logs.
          </div>
        ) : (
          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {filteredActivities.map((act) => (
              <div
                key={act.id}
                className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 text-xs ${
                  isDark
                    ? 'bg-slate-950/70 border-slate-900 hover:border-purple-500/30'
                    : 'bg-slate-50 border-slate-200 hover:border-purple-300'
                }`}
              >
                <div className="mt-0.5 p-1 rounded-lg bg-purple-500/10 text-purple-500">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`font-bold ${textPrimary}`}>{act.agent_name}</span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(act.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className={`leading-snug ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{act.message}</p>
                  {act.details && (
                    <div className={`text-[11px] font-mono p-2 rounded-lg mt-1 border ${
                      isDark ? 'bg-slate-900/60 text-slate-400 border-slate-800/60' : 'bg-white text-slate-600 border-slate-200'
                    }`}>
                      {act.details}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
