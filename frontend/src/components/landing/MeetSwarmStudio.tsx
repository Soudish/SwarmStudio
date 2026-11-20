import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';

interface MeetSwarmStudioProps {
  onExploreClick: () => void;
}

export const MeetSwarmStudio: React.FC<MeetSwarmStudioProps> = ({ onExploreClick }) => {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Top Split Header (just like Veriq screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
        <div className="lg:col-span-6 space-y-6">
          <span className="font-landing-mono text-xs uppercase tracking-wider text-accent font-semibold block">
            The Autonomous Creative Platform
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-[-0.04em] text-text1 leading-[1.05]">
            Meet SwarmStudio.
          </h2>
          <div>
            <button
              onClick={onExploreClick}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-text1 text-bg hover:opacity-90 font-medium text-sm transition-all shadow-md group"
            >
              <span>See how it works</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 lg:pt-8">
          <p className="text-lg sm:text-xl text-text2 leading-relaxed max-w-xl font-normal">
            SwarmStudio turns any premise into a complete creative production, and hands you screenplays, world lore, concept art and scores for every scene.
          </p>
        </div>
      </div>

      {/* 3-Card Grid (Veriq 3-card layout) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Card 1: Lavender / Purple Themed Illustrated Card (Proofs not promises style) */}
        <div className="rounded-[28px] p-7 lg:p-8 bg-gradient-to-br from-[#EFEAFC] via-[#E4DCF9] to-[#D5C9F5] dark:from-[#231C42] dark:via-[#1B1635] dark:to-[#141028] border border-accent/25 flex flex-col justify-between min-h-[360px] shadow-sm relative overflow-hidden group">
          {/* Subtle cosmic orb illustration in the card */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-44 h-44 rounded-full bg-accent/20 blur-2xl pointer-events-none" />
          
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-text1 dark:text-white">
              Autonomy, not prompts
            </h3>
          </div>

          {/* Central Visual Graphic */}
          <div className="my-6 flex items-center justify-center relative">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-accent/30 animate-[spin_16s_linear_infinite]" />
              <div className="absolute inset-2 rounded-full border border-dashed border-accent/40 animate-[spin_10s_linear_infinite_reverse]" />
              <div className="w-14 h-14 rounded-full bg-accent/30 dark:bg-accent/40 backdrop-blur-md flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-accent-text dark:text-accent" />
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs sm:text-sm text-text2 dark:text-[#B6B4CC] leading-relaxed">
              Five specialized AI agents plan, write, score and audit in parallel with zero prompt fatigue.
            </p>
          </div>
        </div>

        {/* Card 2: Dark Obsidian / Purple Card (Fails closed, never guesses style) */}
        <div className="rounded-[28px] p-7 lg:p-8 bg-[#151226] text-white border border-white/10 flex flex-col justify-between min-h-[360px] shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-fuchsia-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-white">
              Fails closed, never drifts.
            </h3>
          </div>

          {/* Verification Chip Graphic */}
          <div className="my-6 space-y-2.5">
            <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs font-landing-mono">
              <span className="text-white/70">Critic Continuity Audit</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Pass
              </span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs font-landing-mono">
              <span className="text-white/70">Quality Index Threshold</span>
              <span className="text-accent font-semibold">92 / 100</span>
            </div>
          </div>

          <div>
            <p className="text-xs sm:text-sm text-[#A8A6BE] leading-relaxed">
              Critic agents verify pacing, character voices and narrative continuity before any scene is finalized.
            </p>
          </div>
        </div>

        {/* Card 3: Dark Obsidian / Purple Card (Automatic failover style) */}
        <div className="rounded-[28px] p-7 lg:p-8 bg-[#151226] text-white border border-white/10 flex flex-col justify-between min-h-[360px] shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-white">
              Offline & local first.
            </h3>
          </div>

          {/* Terminal / Privacy Graphic */}
          <div className="my-6 p-3 rounded-xl bg-[#0C0A17] border border-white/10 font-landing-mono text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 pb-1 border-b border-white/10 text-[10px] text-white/50">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>ollama — localhost:11434</span>
            </div>
            <p className="text-emerald-400 text-[11px]">● 100% On-device execution</p>
            <p className="text-white/60 text-[10px]">Zero external cloud telemetry</p>
          </div>

          <div>
            <p className="text-xs sm:text-sm text-[#A8A6BE] leading-relaxed">
              Runs with Ollama on local models with zero telemetry, keeping your creative intellectual property private.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
