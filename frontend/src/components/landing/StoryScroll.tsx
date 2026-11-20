import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useReducedMotion } from 'framer-motion';
import { Check, FileText, ArrowRight } from 'lucide-react';

interface StepData {
  number: string;
  title: string;
  sub: string;
  agent: string;
  accentColor: string;
  deliverables: string[];
}

const STEPS: StepData[] = [
  {
    number: '01',
    title: 'Research & Lore',
    sub: 'Expands premises into rich world lore and psychological character dossiers.',
    agent: 'Research Agent',
    accentColor: '#06B6D4',
    deliverables: ['World Lore', 'Character Dossiers', 'Faction Politics'],
  },
  {
    number: '02',
    title: 'Story Architecture',
    sub: 'Crafts dramatic three-act screenplay beats and dialogue scene by scene.',
    agent: 'Story Agent',
    accentColor: '#D946EF',
    deliverables: ['3-Act Beat Sheet', 'Scene Sluglines', 'Dialogue Treatment'],
  },
  {
    number: '03',
    title: 'Visual & Audio',
    sub: 'Generates custom aesthetic color palettes, lighting prompts and acoustic cues.',
    agent: 'Visual & Audio Agents',
    accentColor: '#F59E0B',
    deliverables: ['5-Color Palette', 'Midjourney Prompts', 'Foley Leitmotifs'],
  },
  {
    number: '04',
    title: 'Critic Audit',
    sub: 'Verifies narrative pacing, checks continuity and assigns an objective quality index.',
    agent: 'Critic Agent',
    accentColor: '#6366F1',
    deliverables: ['Quality Index Score', 'Pacing Verification', 'Zero Contradictions'],
  },
  {
    number: '05',
    title: 'Export & Ship',
    sub: 'Compiles production-ready screenplay PDF and markdown assets for instant delivery.',
    agent: 'Production Engine',
    accentColor: '#10B981',
    deliverables: ['Formatted PDF', 'Production Markdown', 'Asset Package'],
  },
];

export const StoryScroll: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      const stepIndex = Math.min(Math.floor(latest * STEPS.length), STEPS.length - 1);
      setActiveStep(Math.max(0, stepIndex));
    });
  }, [scrollYProgress]);

  return (
    <section id="how-it-works" className="relative bg-gradient-to-b from-[#F9F8FE] via-[#F2EEFB] to-[#F9F8FE] dark:from-[#0B0916] dark:via-[#130E26] dark:to-[#0B0916] transition-colors duration-200">
      {/* Ambient Theme Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-accent/10 dark:bg-accent/15 blur-[140px] pointer-events-none" />

      {/* Desktop Pinned Scroll Story with Veriq Card Deck */}
      <div ref={containerRef} className="hidden md:block relative h-[320vh]">
        <div className="sticky top-0 h-screen w-full flex items-center pt-16 sm:pt-20 px-6 lg:px-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-12 lg:gap-16 items-center w-full">
            
            {/* Left Column — Veriq Mode List style */}
            <div className="col-span-5 flex flex-col justify-between py-6 space-y-8">
              <div>
                <span className="font-landing-mono text-xs uppercase tracking-wider text-accent font-semibold block mb-2">
                  Swarm in Practice
                </span>

                <h2 className="text-4xl lg:text-5xl font-semibold tracking-[-0.04em] text-text1 leading-tight">
                  How it works.
                </h2>
                <p className="mt-3 text-base text-text2 max-w-sm leading-relaxed">
                  Five AI agents coordinate across five discrete phases, outputting verified creative assets.
                </p>
              </div>

              {/* Interactive Steps List with Active Bullet (Veriq reference style) */}
              <div className="space-y-3 pt-2">
                {STEPS.map((step, idx) => {
                  const isActive = idx === activeStep;
                  return (
                    <div
                      key={step.number}
                      className={`flex items-center gap-3 text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? 'text-text1 font-semibold translate-x-1.5'
                          : 'text-text3 hover:text-text2'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          isActive
                            ? 'bg-accent shadow-[0_0_10px_rgba(109,91,208,0.7)] scale-125'
                            : 'bg-border'
                        }`}
                      />
                      <span className="font-landing-mono text-xs text-text3 mr-1">{step.number}</span>
                      <span>{step.title}</span>
                    </div>
                  );
                })}
              </div>

              {/* Active Step Agent Tag */}
              <div className="pt-4 border-t border-border/80 flex items-center justify-between text-xs font-landing-mono">
                <span className="text-text3">Active Phase</span>
                <span className="text-accent font-semibold flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: STEPS[activeStep].accentColor }}
                  />
                  {STEPS[activeStep].agent}
                </span>
              </div>
            </div>

            {/* Right Column — 3D Stacked Card Deck (Veriq Screenshots 1 & 2) */}
            <div className="col-span-7 relative h-[500px] flex items-center justify-center">
              <div className="relative w-full max-w-[540px] h-[480px]">
                {STEPS.map((step, i) => {
                  const isBelow = activeStep < i;
                  const isCurrent = activeStep === i;
                  const stepsBehind = Math.max(0, activeStep - i);

                  // Physical deck stacking calculation
                  const y = isBelow ? 420 : -stepsBehind * 14;
                  const scale = isBelow ? 0.96 : Math.max(0.85, 1 - stepsBehind * 0.05);
                  const opacity = isBelow ? 0 : isCurrent ? 1 : Math.max(0.4, 0.9 - stepsBehind * 0.2);
                  const zIndex = 10 + i;

                  return (
                    <motion.div
                      key={step.number}
                      initial={false}
                      animate={{
                        y: shouldReduceMotion ? 0 : y,
                        scale: shouldReduceMotion ? 1 : scale,
                        opacity: shouldReduceMotion ? (isCurrent ? 1 : 0) : opacity,
                        zIndex,
                      }}
                      transition={{
                        duration: 0.55,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="absolute inset-0 w-full h-full rounded-[28px] border border-accent/25 dark:border-accent/30 bg-white dark:bg-[#151226] p-6 lg:p-7 shadow-[0_20px_50px_rgba(109,91,208,0.12)] dark:shadow-[0_24px_50px_rgba(0,0,0,0.5)] flex flex-col justify-between overflow-hidden"
                    >
                      {/* Card Header with Step Mono Badge */}
                      <div className="flex items-center justify-between border-b border-border/80 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-accent/15 text-accent font-landing-mono text-xs font-semibold">
                            {step.number}
                          </span>
                          <span className="font-landing-mono text-xs uppercase tracking-wider font-semibold text-text1">
                            {step.title}
                          </span>
                        </div>
                        <span className="text-[11px] font-landing-mono px-2 py-0.5 rounded-full bg-surface-muted text-text2 font-medium">
                          {step.agent}
                        </span>
                      </div>

                      {/* Upper/Center Visual Mini-Mockup */}
                      <div className="flex-1 my-3 flex items-center justify-center">
                        {i === 0 && <ResearchMockup active={isCurrent} />}
                        {i === 1 && <StoryMockup active={isCurrent} />}
                        {i === 2 && <VisualAudioMockup active={isCurrent} />}
                        {i === 3 && <CriticMockup active={isCurrent} />}
                        {i === 4 && <ExportMockup active={isCurrent} />}
                      </div>

                      {/* Card Bottom: Description & Deliverables */}
                      <div className="pt-3 border-t border-border/80 space-y-2">
                        <p className="text-xs sm:text-sm text-text2 leading-relaxed font-normal">
                          {step.sub}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {step.deliverables.map((item) => (
                            <span
                              key={item}
                              className="px-2.5 py-0.5 rounded-full text-[11px] font-landing-mono bg-accent/10 text-accent font-medium"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Stack (<768px): Vertical reveal without pinning */}
      <div className="md:hidden px-4 py-16 space-y-10">
        <div className="text-center max-w-sm mx-auto">
          <span className="font-landing-mono text-xs uppercase tracking-wider text-accent font-semibold">
            How it works
          </span>
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-text1 mt-2">
            Five steps to production.
          </h2>
        </div>

        <div className="space-y-6">
          {STEPS.map((step, idx) => (
            <div
              key={step.number}
              className="rounded-[24px] border border-accent/20 bg-white dark:bg-[#151226] p-5 shadow-md flex flex-col space-y-3"
            >
              <div className="flex items-center justify-between border-b border-border/80 pb-2.5">
                <span className="font-landing-mono text-sm font-semibold text-accent">
                  Phase {step.number}
                </span>
                <span className="text-xs font-landing-mono px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
                  {step.agent}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-text1">{step.title}</h3>
              <p className="text-xs text-text2 leading-relaxed">{step.sub}</p>
              <div className="py-2">
                {idx === 0 && <ResearchMockup active={true} />}
                {idx === 1 && <StoryMockup active={true} />}
                {idx === 2 && <VisualAudioMockup active={true} />}
                {idx === 3 && <CriticMockup active={true} />}
                {idx === 4 && <ExportMockup active={true} />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* 1. Research Mockup */
const ResearchMockup: React.FC<{ active: boolean }> = ({ active }) => (
  <div className="w-full max-w-md space-y-3.5">
    <div className="space-y-2 p-3 rounded-xl bg-accent/5 dark:bg-white/5 border border-accent/15">
      <div className="flex items-center justify-between text-[10px] font-landing-mono text-text3 mb-1">
        <span>ARCHIVE_RECORDS // 2148</span>
        <span className="text-cyan-600 dark:text-cyan-400 font-semibold">● ACTIVE SYNTHESIS</span>
      </div>
      <div className="h-2.5 w-full bg-accent/20 rounded-full overflow-hidden">
        <motion.div
          animate={active ? { width: ['0%', '100%'] } : { width: '100%' }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="h-full bg-accent/60 rounded-full"
        />
      </div>
      <div className="h-2 w-4/5 bg-accent/15 rounded-full overflow-hidden">
        <motion.div
          animate={active ? { width: ['0%', '100%'] } : { width: '100%' }}
          transition={{ duration: 1.1, delay: 0.15, ease: 'easeOut' }}
          className="h-full bg-cyan-500/50 rounded-full"
        />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-2.5 pt-1">
      <div className="p-2.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 flex items-center gap-2.5 shadow-xs">
        <div className="w-7 h-7 rounded-full bg-cyan-500/25 text-cyan-600 dark:text-cyan-300 font-landing-mono text-[11px] font-semibold flex items-center justify-center shrink-0">
          U7
        </div>
        <div className="overflow-hidden">
          <p className="text-xs font-semibold text-text1 truncate">Unit 7-Kaelen</p>
          <p className="text-[9px] text-text3 font-landing-mono">Decommissioned AI</p>
        </div>
      </div>

      <div className="p-2.5 rounded-xl border border-accent/30 bg-accent/10 flex items-center gap-2.5 shadow-xs">
        <div className="w-7 h-7 rounded-full bg-accent/25 text-accent font-landing-mono text-[11px] font-semibold flex items-center justify-center shrink-0">
          LV
        </div>
        <div className="overflow-hidden">
          <p className="text-xs font-semibold text-text1 truncate">Leo Vane</p>
          <p className="text-[9px] text-text3 font-landing-mono">Archivist Scout</p>
        </div>
      </div>
    </div>
  </div>
);

/* 2. Story Mockup */
const StoryMockup: React.FC<{ active: boolean }> = ({ active }) => (
  <div className="w-full max-w-md p-4 rounded-xl bg-accent/5 dark:bg-white/5 border border-accent/20 font-landing-mono text-xs space-y-3">
    <div className="px-2.5 py-1 bg-fuchsia-500/15 border-l-2 border-fuchsia-500 text-fuchsia-700 dark:text-fuchsia-300 font-semibold tracking-wide rounded-r text-[11px]">
      EXT. LOWER DISTRICT ALLEYWAY - NIGHT
    </div>

    <div className="space-y-1.5 pl-2 text-text2 text-[11px]">
      <p className="text-[10px] text-text3 tracking-wider">KAELEN</p>
      <div className="text-text1 font-normal flex items-center">
        <span>The resonance frequency... it's human.</span>
        <span className="inline-block w-1.5 h-3 bg-fuchsia-500 ml-1 animate-pulse" />
      </div>
    </div>
  </div>
);

/* 3. Visual & Audio Mockup */
const VisualAudioMockup: React.FC<{ active: boolean }> = ({ active }) => {
  const swatches = ['#0B0E14', '#1E293B', '#6D5BD0', '#38BDF8', '#F1F5F9'];
  const bars = [14, 24, 38, 18, 30, 42, 20, 28, 36, 16, 26, 40, 22, 32];

  return (
    <div className="w-full max-w-md space-y-4">
      <div>
        <span className="text-[10px] font-landing-mono text-text3 mb-1.5 block">
          Aesthetic Palette Tokens
        </span>
        <div className="flex gap-2">
          {swatches.map((color, i) => (
            <div
              key={color}
              className="flex-1 h-10 rounded-lg border border-black/10 shadow-xs flex items-end justify-center pb-1 text-[8px] font-landing-mono font-medium"
              style={{
                backgroundColor: color,
                color: i > 2 ? '#000' : '#FFF',
              }}
            >
              {color.slice(1, 4)}
            </div>
          ))}
        </div>
      </div>

      <div>
        <span className="text-[10px] font-landing-mono text-text3 mb-1.5 block">
          Acoustic Foley & Leitmotif Score
        </span>
        <div className="h-12 rounded-xl bg-accent/5 dark:bg-white/5 border border-accent/20 flex items-center justify-center gap-1.5 px-4">
          {bars.map((h, i) => (
            <motion.div
              key={i}
              animate={
                active
                  ? { height: [h * 0.4, h, h * 0.6] }
                  : { height: h * 0.4 }
              }
              transition={{
                duration: 1.2,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: i * 0.06,
                ease: 'easeInOut',
              }}
              className="w-1.5 rounded-full bg-amber-500/85"
              style={{ height: h }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/* 4. Critic Mockup */
const CriticMockup: React.FC<{ active: boolean }> = ({ active }) => {
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!active) {
      setScore(0);
      return;
    }
    let current = 0;
    const interval = setInterval(() => {
      current += 3;
      if (current >= 92) {
        current = 92;
        clearInterval(interval);
      }
      setScore(current);
    }, 25);
    return () => clearInterval(interval);
  }, [active]);

  const checks = [
    'Narrative pacing validated',
    'Character voice consistent',
    'Zero contradictions detected',
  ];

  return (
    <div className="w-full max-w-md flex items-center gap-5">
      <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            className="stroke-accent/15 stroke-[7] fill-none"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            className="stroke-accent stroke-[7] fill-none"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 - (251.2 * score) / 100}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-landing-mono text-xl font-bold text-text1">{score}</span>
          <span className="text-[9px] font-landing-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
            Greenlit
          </span>
        </div>
      </div>

      <div className="space-y-1.5">
        {checks.map((text) => (
          <div
            key={text}
            className="flex items-center gap-2 text-xs font-medium text-text1"
          >
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-2.5 h-2.5" />
            </div>
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* 5. Export Mockup */
const ExportMockup: React.FC<{ active: boolean }> = ({ active }) => (
  <div className="w-full max-w-md relative flex flex-col items-center justify-center space-y-3">
    <div className="w-48 h-24 rounded-lg border border-accent/25 bg-accent/5 dark:bg-white/5 p-3 shadow-xs flex flex-col justify-between">
      <div className="space-y-1.5">
        <div className="w-16 h-2 bg-accent/40 rounded-full" />
        <div className="w-28 h-1.5 bg-accent/20 rounded-full" />
        <div className="w-20 h-1.5 bg-accent/15 rounded-full" />
      </div>
      <div className="flex justify-between items-center text-[9px] font-landing-mono text-text3 border-t border-border/80 pt-1">
        <span>Draft v1.0</span>
        <span className="text-emerald-600 font-semibold">Ready to Ship</span>
      </div>
    </div>

    <div className="flex gap-2.5">
      <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-landing-mono font-semibold flex items-center gap-1.5 shadow-xs">
        <FileText className="w-3.5 h-3.5" />
        <span>Screenplay.pdf</span>
      </div>

      <div className="px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 text-xs font-landing-mono font-semibold flex items-center gap-1.5 shadow-xs">
        <FileText className="w-3.5 h-3.5" />
        <span>Production.md</span>
      </div>
    </div>
  </div>
);
