import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Feather,
  Palette,
  Headphones,
  CheckCircle2,
  Check,
  Activity,
  Bot,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { ProjectData } from '../../types';

interface AgentActivityViewProps {
  activeProject: ProjectData | null;
  projects: ProjectData[];
  onSelectProject: (p: ProjectData) => void;
}

export const AgentActivityView: React.FC<AgentActivityViewProps> = ({
  activeProject,
}) => {
  const [selectedAgentFilter, setSelectedAgentFilter] = useState<string>('all');

  const activities = activeProject?.activities || [];

  const getAgentStatus = (agentName: string) => {
    if (!activeProject) return 'idle';
    if (activeProject.status === 'completed') return 'completed';
    const agentActs = activities.filter((a) =>
      a.agent_name.toLowerCase().includes(agentName.toLowerCase())
    );
    if (!agentActs.length) return 'idle';
    const last = agentActs[agentActs.length - 1];
    return last.status;
  };

  const agents = [
    {
      id: 'research',
      name: 'Research',
      role: 'World Lore & Context',
      icon: Brain,
      dotColor: 'bg-agent-research',
      status: getAgentStatus('Research Agent'),
    },
    {
      id: 'story',
      name: 'Story',
      role: 'Screenplay & Narrative',
      icon: Feather,
      dotColor: 'bg-agent-story',
      status: getAgentStatus('Story Agent'),
    },
    {
      id: 'visual',
      name: 'Visual',
      role: 'Art & Palettes',
      icon: Palette,
      dotColor: 'bg-agent-visual',
      status: getAgentStatus('Visual Agent'),
    },
    {
      id: 'audio',
      name: 'Audio',
      role: 'Soundtrack & Foley',
      icon: Headphones,
      dotColor: 'bg-agent-audio',
      status: getAgentStatus('Audio Agent'),
    },
    {
      id: 'critic',
      name: 'Critic',
      role: 'Editorial & Continuity',
      icon: CheckCircle2,
      dotColor: 'bg-agent-critic',
      status: getAgentStatus('Critic Agent'),
    },
  ];

  // Active step index
  const activeStepIdx = agents.findIndex((ag) => ag.status === 'running');
  const progressPercent = activeProject?.status === 'completed'
    ? 100
    : activeStepIdx >= 0
    ? (activeStepIdx / (agents.length - 1)) * 100
    : 0;

  const filteredActivities = activities.filter((a) => {
    if (selectedAgentFilter === 'all') return true;
    return a.agent_name.toLowerCase().includes(selectedAgentFilter.toLowerCase());
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Merged Horizontal Stepper at the Top */}
      <div className="card p-6">
        <div className="relative flex items-center justify-between max-w-3xl mx-auto px-4 sm:px-8">
          {/* Background Connecting Line */}
          <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-border -translate-y-1/2 z-0" />
          {/* Active Animated Progress Line */}
          <div
            className="absolute top-1/2 left-8 h-0.5 bg-accent -translate-y-1/2 z-0 transition-all duration-500 ease-out"
            style={{ width: `calc(${progressPercent}% * (100% - 4rem) / 100)` }}
          />

          {agents.map((ag, i) => {
            const Icon = ag.icon;
            const isCompleted = ag.status === 'completed';
            const isRunning = ag.status === 'running';
            const isError = ag.status === 'error';

            return (
              <div
                key={ag.id}
                title={`${ag.name} Agent: ${ag.role}`}
                className="relative z-10 flex flex-col items-center group cursor-pointer"
              >
                {/* Node Circle */}
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    isRunning
                      ? 'border-accent bg-accent text-white shadow-md ring-4 ring-accent/25 scale-110'
                      : isCompleted
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : isError
                      ? 'border-rose-500 bg-rose-500/10 text-rose-500'
                      : 'border-border bg-surface text-text3 hover:border-border-hover'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  ) : isRunning ? (
                    <Icon className="w-5 h-5 animate-pulse" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                {/* Node Name & Tooltip Role */}
                <div className="text-center mt-2">
                  <span
                    className={`block text-xs font-semibold tracking-tight transition-colors ${
                      isRunning
                        ? 'text-accent'
                        : isCompleted
                        ? 'text-text1'
                        : 'text-text3'
                    }`}
                  >
                    {ag.name}
                  </span>
                  <span className="text-[11px] text-text3 hidden group-hover:block transition-all absolute top-full left-1/2 -translate-x-1/2 whitespace-nowrap bg-surface card px-2 py-0.5 shadow-sm mt-1 z-20">
                    {ag.role}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full-Width Activity Log */}
      <div className="card p-5 space-y-4">
        {/* Toolbar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="label">Activity Log</span>
            <span className="pill text-[10px]">{filteredActivities.length} Events</span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto text-xs scrollbar-none">
            {['all', 'Research', 'Story', 'Visual', 'Audio', 'Critic'].map((f) => (
              <button
                key={f}
                onClick={() => setSelectedAgentFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedAgentFilter === f
                    ? 'bg-text1 text-surface font-semibold shadow-sm'
                    : 'text-text3 hover:text-text1 hover:bg-surface-muted'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Log Entries */}
        {filteredActivities.length === 0 ? (
          <div className="py-12 text-center text-xs text-text3 flex items-center justify-center gap-2">
            <Activity className="w-4 h-4 text-text3/60" />
            <span>No activity recorded yet for this project.</span>
          </div>
        ) : (
          <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {filteredActivities.map((act) => {
                const agentObj = agents.find((a) =>
                  act.agent_name.toLowerCase().includes(a.id)
                );
                const dotColor = agentObj?.dotColor || 'bg-accent';

                return (
                  <motion.div
                    key={act.id}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="card-muted p-3.5 space-y-1.5 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-medium text-text1">
                        <span className={`w-2 h-2 rounded-full ${dotColor} shrink-0`} />
                        <span>{act.agent_name}</span>
                      </div>
                      <span className="text-[11px] text-text3 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(act.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <p className="text-xs text-text2 leading-relaxed pl-4">{act.message}</p>

                    {act.details && (
                      <div className="ml-4 font-mono text-[11px] p-2.5 rounded-lg bg-surface border border-border text-text2 whitespace-pre-wrap mt-1">
                        {act.details}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
