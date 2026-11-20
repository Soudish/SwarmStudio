import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface AgentData {
  id: string;
  name: string;
  role: string;
  color: string;
  glowClass: string;
  deliverables: string[];
}

const AGENTS: AgentData[] = [
  {
    id: 'research',
    name: 'Research Agent',
    role: 'World lore & character dossiers',
    color: '#06B6D4',
    glowClass: 'shadow-[0_0_20px_rgba(6,182,212,0.5)]',
    deliverables: ['Faction Politics', 'Lore Database', 'Character Dossiers'],
  },
  {
    id: 'story',
    name: 'Story Agent',
    role: 'Screenplay architecture & dialogue',
    color: '#D946EF',
    glowClass: 'shadow-[0_0_20px_rgba(217,70,239,0.5)]',
    deliverables: ['3-Act Beat Sheet', 'Dialogue Excerpts', 'Scene Sluglines'],
  },
  {
    id: 'visual',
    name: 'Visual Agent',
    role: 'Cinematography & visual aesthetics',
    color: '#F59E0B',
    glowClass: 'shadow-[0_0_20px_rgba(245,158,11,0.5)]',
    deliverables: ['5-Color Palettes', 'Midjourney Tokens', 'Lighting Cues'],
  },
  {
    id: 'audio',
    name: 'Audio Agent',
    role: 'Acoustic landscape & soundtrack notes',
    color: '#10B981',
    glowClass: 'shadow-[0_0_20px_rgba(16,185,129,0.5)]',
    deliverables: ['Leitmotif Motifs', 'Foley Soundboard', 'Binaural Audio'],
  },
  {
    id: 'critic',
    name: 'Critic Agent',
    role: 'Continuity audit & quality index',
    color: '#6366F1',
    glowClass: 'shadow-[0_0_20px_rgba(99,102,241,0.5)]',
    deliverables: ['Quality Index Score', 'Pacing Verification', 'Plot-Hole Audit'],
  },
];

export const SwarmOrbit: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<AgentData>(AGENTS[1]); // default to Story
  const [isPaused, setIsPaused] = useState(false);
  const [orbitAngle, setOrbitAngle] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  // Orbit rotation loop
  useEffect(() => {
    if (shouldReduceMotion || isPaused) return;
    const interval = setInterval(() => {
      setOrbitAngle((prev) => (prev + 0.006) % (Math.PI * 2));
    }, 20);
    return () => clearInterval(interval);
  }, [isPaused, shouldReduceMotion]);

  // Ellipse dimensions
  const cx = 230;
  const cy = 200;
  const rx = 175;
  const ry = 115;

  return (
    <section id="swarm" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-16">
        <span className="font-landing-mono text-xs uppercase tracking-wider text-text3 font-medium block mb-2">
          Agent Ecosystem
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.04em] text-text1">
          Meet the swarm.
        </h2>
        <p className="mt-3 text-base text-text2">
          Five autonomous intelligences coordinated in a synchronized creative orbit.
        </p>
      </div>

      {/* Orbit & Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left / Center: Interactive SVG Orbit */}
        <div className="lg:col-span-7 flex items-center justify-center relative min-h-[420px]">
          {/* Ambient Central Glow */}
          <div className="absolute w-56 h-56 rounded-full bg-accent/15 blur-[60px] pointer-events-none" />

          <svg
            className="w-full max-w-[480px] h-[400px] overflow-visible"
            viewBox="0 0 460 400"
          >
            {/* Background SVG Ellipse Orbit Track */}
            <ellipse
              cx={cx}
              cy={cy}
              rx={rx}
              ry={ry}
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.12"
              strokeWidth="1.5"
              strokeDasharray="4 6"
            />

            {/* Central Glowing Orb */}
            <g transform={`translate(${cx}, ${cy})`}>
              <circle r="42" fill="url(#centralOrbGradient)" />
              <circle r="46" fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" />
              <text
                textAnchor="middle"
                dy="4"
                fill="#FFFFFF"
                fontSize="11"
                fontFamily="Geist Mono"
                fontWeight="600"
                className="select-none pointer-events-none"
              >
                SWARM
              </text>
            </g>

            {/* Radial Gradient Defs */}
            <defs>
              <radialGradient id="centralOrbGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#8B7FE8" />
                <stop offset="60%" stopColor="#6D5BD0" />
                <stop offset="100%" stopColor="#2A2540" />
              </radialGradient>
            </defs>

            {/* 5 Orbiting Agent Nodes */}
            {AGENTS.map((agent, i) => {
              const nodeAngle = orbitAngle + (i * 2 * Math.PI) / AGENTS.length;
              const x = cx + rx * Math.cos(nodeAngle);
              const y = cy + ry * Math.sin(nodeAngle);
              const isSelected = selectedAgent.id === agent.id;

              return (
                <g
                  key={agent.id}
                  transform={`translate(${x}, ${y})`}
                  onClick={() => setSelectedAgent(agent)}
                  onMouseEnter={() => {
                    setIsPaused(true);
                    setSelectedAgent(agent);
                  }}
                  onMouseLeave={() => setIsPaused(false)}
                  className="cursor-pointer transition-transform duration-200"
                  style={{ transformOrigin: `${x}px ${y}px` }}
                >
                  {/* Outer ring on hover/selected */}
                  {isSelected && (
                    <motion.circle
                      r="26"
                      fill="none"
                      stroke={agent.color}
                      strokeWidth="2"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.25 }}
                    />
                  )}

                  {/* Node Circle */}
                  <circle
                    r={isSelected ? "20" : "16"}
                    fill="var(--surface)"
                    stroke={isSelected ? agent.color : "var(--border)"}
                    strokeWidth={isSelected ? "2.5" : "1.5"}
                    className="transition-all duration-200"
                  />

                  {/* Inner Agent Color Dot */}
                  <circle
                    r={isSelected ? "6" : "4.5"}
                    fill={agent.color}
                    className="transition-all duration-200"
                  />

                  {/* Label under node */}
                  <text
                    y="30"
                    textAnchor="middle"
                    fill="currentColor"
                    fontSize="10"
                    fontFamily="Geist"
                    fontWeight={isSelected ? "600" : "500"}
                    className={`select-none pointer-events-none transition-opacity ${
                      isSelected ? 'opacity-100' : 'opacity-60'
                    }`}
                  >
                    {agent.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right: Focused Detail Panel (ONE detail panel with animated swap) */}
        <div className="lg:col-span-5">
          <div className="rounded-[32px] border border-border bg-surface p-8 shadow-xl min-h-[340px] flex flex-col justify-between relative overflow-hidden">
            {/* Top Glow Accent corresponding to current agent */}
            <div
              className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[50px] opacity-20 pointer-events-none transition-colors duration-500"
              style={{ backgroundColor: selectedAgent.color }}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedAgent.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6"
              >
                {/* Agent Header */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full transition-shadow duration-300"
                    style={{
                      backgroundColor: selectedAgent.color,
                      boxShadow: `0 0 12px ${selectedAgent.color}`,
                    }}
                  />
                  <div>
                    <h3 className="text-2xl font-semibold tracking-tight text-text1">
                      {selectedAgent.name}
                    </h3>
                    <p className="text-xs font-landing-mono text-text3 mt-0.5">
                      {selectedAgent.role}
                    </p>
                  </div>
                </div>

                {/* Role Description */}
                <p className="text-sm text-text2 leading-relaxed">
                  Autonomously executes and audits the project's {selectedAgent.name.toLowerCase()} assets,
                  maintaining strict context fidelity across the narrative swarm.
                </p>

                {/* 3 Deliverables Chips */}
                <div>
                  <span className="font-landing-mono text-[11px] text-text3 uppercase tracking-wider font-semibold block mb-2.5">
                    Agent Deliverables
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedAgent.deliverables.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1.5 rounded-full text-xs font-landing-mono bg-surface-muted text-text1 border border-border/80 flex items-center gap-1.5"
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: selectedAgent.color }}
                        />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Bottom Orbit Status */}
            <div className="pt-6 border-t border-border/60 flex items-center justify-between text-xs font-landing-mono text-text3">
              <span>Status: Synchronized</span>
              <span className="text-accent">Hover node to inspect</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
