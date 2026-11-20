import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import {
  Film,
  Sparkles,
  Layers,
  FileText,
  Music,
  CheckCircle2,
  Sliders,
  ChevronRight,
  Maximize2
} from 'lucide-react';

export const WorkspacePreview: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [hoverTilt, setHoverTilt] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'center center'],
  });

  const scrollRotateX = useTransform(scrollYProgress, [0, 1], [12, 0]);
  const scrollScale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.4, 1], [0.6, 0.85, 1]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = ((clientY - top) / height - 0.5) * -6; // tilt X
    const y = ((clientX - left) / width - 0.5) * 6;  // tilt Y
    setHoverTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setHoverTilt({ x: 0, y: 0 });
  };

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-16">
        <span className="font-landing-mono text-xs uppercase tracking-wider text-text3 font-medium block mb-2">
          Studio Interface
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.04em] text-text1">
          Designed for flow.
        </h2>
        <p className="mt-3 text-base text-text2">
          A unified cockpit orchestrating research, dialogue, aesthetics and audio in real time.
        </p>
      </div>

      {/* 3D Perspective Wrapper */}
      <div
        ref={containerRef}
        style={{ perspective: 1200 }}
        className="w-full max-w-6xl mx-auto"
      >
        <motion.div
          style={{
            rotateX: shouldReduceMotion ? 0 : scrollRotateX,
            scale: shouldReduceMotion ? 1 : scrollScale,
            opacity: shouldReduceMotion ? 1 : scrollOpacity,
            transformStyle: 'preserve-3d',
          }}
          animate={
            shouldReduceMotion
              ? {}
              : {
                  rotateX: hoverTilt.x,
                  rotateY: hoverTilt.y,
                }
          }
          transition={{ type: 'spring', damping: 20, stiffness: 120 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="rounded-[28px] border border-border/80 bg-surface shadow-2xl overflow-hidden transition-shadow duration-300 hover:shadow-accent/10"
        >
          {/* Framed Browser Chrome */}
          <div className="px-4 py-3 border-b border-border bg-surface-muted/60 flex items-center justify-between">
            {/* Traffic Lights */}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56]/80" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E]/80" />
              <span className="w-3 h-3 rounded-full bg-[#27C93F]/80" />
            </div>

            {/* URL Pill */}
            <div className="px-4 py-1 rounded-full bg-surface border border-border/80 text-[11px] font-landing-mono text-text3 flex items-center gap-2 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>swarmstudio.local/workspace/aethelgard-2148</span>
            </div>

            <Maximize2 className="w-3.5 h-3.5 text-text3" />
          </div>

          {/* Studio Body Mock */}
          <div className="grid grid-cols-12 min-h-[440px] divide-x divide-border bg-surface">
            {/* Left Mock Sidebar */}
            <div className="col-span-3 p-4 space-y-4 bg-surface-muted/20 hidden md:block">
              <div className="flex items-center gap-2 pb-3 border-b border-border/60">
                <div className="w-5 h-5 rounded bg-accent/20 text-accent flex items-center justify-center text-[10px] font-bold">
                  SS
                </div>
                <span className="text-xs font-semibold text-text1 truncate">Unit 7-Kaelen</span>
              </div>

              {/* Agent Status List */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-landing-mono text-text3 uppercase tracking-wider block">
                  Swarm Agents
                </span>
                {[
                  { name: 'Research', color: 'bg-cyan-500', status: 'Done' },
                  { name: 'Story', color: 'bg-fuchsia-500', status: 'Active' },
                  { name: 'Visual', color: 'bg-amber-500', status: 'Done' },
                  { name: 'Audio', color: 'bg-emerald-500', status: 'Done' },
                  { name: 'Critic', color: 'bg-indigo-500', status: '92/100' },
                ].map((a) => (
                  <div
                    key={a.name}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-surface border border-border/50 text-xs font-landing-mono"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${a.color}`} />
                      <span className="text-text1">{a.name}</span>
                    </div>
                    <span className="text-[10px] text-text3">{a.status}</span>
                  </div>
                ))}
              </div>

              {/* Ambient Generation Progress Bar */}
              <div className="pt-3 border-t border-border/60 space-y-1.5">
                <div className="flex justify-between text-[10px] font-landing-mono text-text3">
                  <span>Generation</span>
                  <span className="text-accent font-semibold">100% Complete</span>
                </div>
                <div className="h-1.5 w-full bg-surface-muted rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: ['70%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
                    className="h-full bg-accent rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="col-span-12 md:col-span-9 p-5 flex flex-col justify-between">
              {/* Tab Row */}
              <div className="flex items-center gap-2 border-b border-border/60 pb-3 text-xs font-landing-mono">
                <span className="px-3 py-1 rounded-full bg-accent text-white font-medium">Screenplay</span>
                <span className="px-3 py-1 rounded-full text-text2 hover:text-text1">World Lore</span>
                <span className="px-3 py-1 rounded-full text-text2 hover:text-text1">Palettes & SFX</span>
                <span className="px-3 py-1 rounded-full text-text2 hover:text-text1">Quality Audit</span>
              </div>

              {/* Screenplay Content Snippet */}
              <div className="my-6 p-4 rounded-xl bg-surface-muted/30 border border-border/50 font-landing-mono text-xs space-y-3">
                <div className="text-accent font-semibold">SCENE 1: THE DRAINAGE ALLEY - NIGHT</div>
                <p className="text-text2 leading-relaxed">
                  Heavy rain patters across discarded holographic signage. KAELEN steps from behind the conduit,
                  his worn mechanical joint clicking softly with each deliberate stride.
                </p>
                <div className="pl-6 text-text1">
                  <span className="text-text3 text-[10px] block">KAELEN</span>
                  "The archives didn't mention this weather pattern."
                </div>
              </div>

              {/* Bottom Widget Strip: Ambient score ring + audio waveform */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/60">
                {/* Score badge */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-muted/40 border border-border/60">
                  <div className="w-10 h-10 rounded-full border-2 border-indigo-500/80 flex items-center justify-center font-landing-mono text-xs font-bold text-text1">
                    92
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-text1 block">Critic Index Verified</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-landing-mono">
                      ● Greenlit for production
                    </span>
                  </div>
                </div>

                {/* Ambient Waveform */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-muted/40 border border-border/60">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-text1 block">Acoustic Score</span>
                    <span className="text-[10px] text-text3 font-landing-mono">Rain + Felt Piano</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[12, 20, 14, 26, 18, 30, 22, 16].map((h, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [h * 0.4, h, h * 0.5] }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          repeatType: 'reverse',
                          delay: i * 0.1,
                        }}
                        className="w-1 rounded-full bg-emerald-500"
                        style={{ height: h }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
