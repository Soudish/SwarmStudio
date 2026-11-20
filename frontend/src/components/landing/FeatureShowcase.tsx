import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { RefreshCw, Download } from 'lucide-react';

export const FeatureShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-62%']);

  return (
    <section id="built-different" className="relative bg-gradient-to-b from-[#F9F8FE] via-[#F2EDFC] to-[#F9F8FE] dark:from-[#0B0916] dark:via-[#120D24] dark:to-[#0B0916] transition-colors duration-200">
      {/* Ambient Theme Glow */}
      <div className="absolute top-1/2 right-1/4 w-[650px] h-[650px] rounded-full bg-accent/10 dark:bg-accent/15 blur-[140px] pointer-events-none" />

      {/* Desktop Horizontal Scroll Gallery */}
      <div ref={containerRef} className="hidden md:block relative h-[280vh]">
        <div className="sticky top-0 h-screen w-full flex flex-col justify-center pt-16 sm:pt-20 px-8 lg:px-16 overflow-hidden">
          {/* Section Header */}
          <div className="max-w-7xl mx-auto w-full mb-8">
            <span className="font-landing-mono text-xs uppercase tracking-wider text-accent font-semibold block mb-2">
              Architecture
            </span>
            <h2 className="text-4xl lg:text-5xl font-semibold tracking-[-0.04em] text-text1">
              Built different.
            </h2>
          </div>

          {/* Horizontal Track */}
          <div className="w-full overflow-visible">
            <motion.div
              style={{ x: shouldReduceMotion ? '0%' : x }}
              className="flex items-stretch gap-8 will-change-transform pr-16"
            >
              {/* Panel 1: Multi-agent SVG Node Graph */}
              <div className="w-[520px] shrink-0 rounded-[32px] border border-accent/25 dark:border-accent/30 bg-white/95 dark:bg-[#151228] p-8 shadow-[0_16px_40px_rgba(109,91,208,0.08)] dark:shadow-2xl flex flex-col justify-between">
                <div>
                  <span className="font-landing-mono text-xs text-accent font-semibold tracking-wider uppercase block mb-1">
                    01 / Autonomous Swarm
                  </span>
                  <h3 className="text-2xl lg:text-3xl font-semibold tracking-tight text-text1">
                    Five specialized agents.
                  </h3>
                  <p className="mt-2 text-sm text-text2 leading-relaxed">
                    Research, narrative, visuals, score and critique collaborate autonomously.
                  </p>
                </div>

                <div className="h-64 my-6 rounded-2xl bg-accent/5 dark:bg-white/5 border border-accent/20 flex items-center justify-center p-4 relative overflow-hidden">
                  <MultiAgentGraph />
                </div>

                <div className="flex items-center justify-between text-xs font-landing-mono text-text3 pt-2 border-t border-border/80">
                  <span>Graph Orchestration</span>
                  <span className="text-accent font-medium">Sequential & Parallel</span>
                </div>
              </div>

              {/* Panel 2: Runs Locally Terminal Window */}
              <div className="w-[480px] shrink-0 rounded-[32px] border border-accent/25 dark:border-accent/30 bg-white/95 dark:bg-[#151228] p-8 shadow-[0_16px_40px_rgba(109,91,208,0.08)] dark:shadow-2xl flex flex-col justify-between">
                <div>
                  <span className="font-landing-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold tracking-wider uppercase block mb-1">
                    02 / Privacy First
                  </span>
                  <h3 className="text-2xl lg:text-3xl font-semibold tracking-tight text-text1">
                    Runs entirely local.
                  </h3>
                  <p className="mt-2 text-sm text-text2 leading-relaxed">
                    Execute on your machine with zero API keys or cloud requirements.
                  </p>
                </div>

                <div className="h-64 my-6 rounded-2xl bg-[#0F0E17] text-white p-4 font-landing-mono text-xs shadow-inner flex flex-col border border-white/10 overflow-hidden">
                  <TerminalMock />
                </div>

                <div className="flex items-center justify-between text-xs font-landing-mono text-text3 pt-2 border-t border-border/80">
                  <span>Ollama & Offline Core</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">100% Private</span>
                </div>
              </div>

              {/* Panel 3: You Direct Screenplay Editing */}
              <div className="w-[500px] shrink-0 rounded-[32px] border border-accent/25 dark:border-accent/30 bg-white/95 dark:bg-[#151228] p-8 shadow-[0_16px_40px_rgba(109,91,208,0.08)] dark:shadow-2xl flex flex-col justify-between">
                <div>
                  <span className="font-landing-mono text-xs text-fuchsia-600 dark:text-fuchsia-400 font-semibold tracking-wider uppercase block mb-1">
                    03 / Human in the Loop
                  </span>
                  <h3 className="text-2xl lg:text-3xl font-semibold tracking-tight text-text1">
                    Direct every scene.
                  </h3>
                  <p className="mt-2 text-sm text-text2 leading-relaxed">
                    Edit beats inline and re-roll dialogues with live directorial notes.
                  </p>
                </div>

                <div className="h-64 my-6 rounded-2xl bg-accent/5 dark:bg-white/5 border border-accent/20 p-5 flex flex-col justify-center relative overflow-hidden">
                  <DirectingMock />
                </div>

                <div className="flex items-center justify-between text-xs font-landing-mono text-text3 pt-2 border-t border-border/80">
                  <span>Interactive Regeneration</span>
                  <span className="text-fuchsia-600 dark:text-fuchsia-400 font-medium">Non-destructive</span>
                </div>
              </div>

              {/* Panel 4: Ready to Ship Exports Stack */}
              <div className="w-[460px] shrink-0 rounded-[32px] border border-accent/25 dark:border-accent/30 bg-white/95 dark:bg-[#151228] p-8 shadow-[0_16px_40px_rgba(109,91,208,0.08)] dark:shadow-2xl flex flex-col justify-between">
                <div>
                  <span className="font-landing-mono text-xs text-amber-500 font-semibold tracking-wider uppercase block mb-1">
                    04 / Industry Standard
                  </span>
                  <h3 className="text-2xl lg:text-3xl font-semibold tracking-tight text-text1">
                    Ready to ship.
                  </h3>
                  <p className="mt-2 text-sm text-text2 leading-relaxed">
                    Download formatted screenplays and complete production decks in seconds.
                  </p>
                </div>

                <div className="h-64 my-6 rounded-2xl bg-accent/5 dark:bg-white/5 border border-accent/20 flex items-center justify-center p-4 relative overflow-hidden">
                  <ExportStackMock />
                </div>

                <div className="flex items-center justify-between text-xs font-landing-mono text-text3 pt-2 border-t border-border/80">
                  <span>Print PDF & Markdown</span>
                  <span className="text-amber-500 font-medium">Instant Package</span>
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Vertical Stack (<768px) */}
      <div className="md:hidden px-4 py-16 space-y-10">
        <div>
          <span className="font-landing-mono text-xs uppercase tracking-wider text-accent font-semibold block mb-1">
            Architecture
          </span>
          <h2 className="text-3xl font-semibold tracking-tight text-text1">
            Built different.
          </h2>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-accent/20 bg-white/95 dark:bg-[#151228] p-6 shadow-md space-y-4">
            <span className="font-landing-mono text-xs text-accent font-semibold uppercase">01 / Swarm</span>
            <h3 className="text-xl font-semibold text-text1">Five specialized agents.</h3>
            <p className="text-sm text-text2">Research, narrative, visuals, score and critique collaborate autonomously.</p>
            <div className="h-56 rounded-xl bg-accent/5 dark:bg-white/5 border border-accent/20 flex items-center justify-center p-2">
              <MultiAgentGraph />
            </div>
          </div>

          <div className="rounded-[28px] border border-accent/20 bg-white/95 dark:bg-[#151228] p-6 shadow-md space-y-4">
            <span className="font-landing-mono text-xs text-emerald-600 font-semibold uppercase">02 / Local</span>
            <h3 className="text-xl font-semibold text-text1">Runs entirely local.</h3>
            <p className="text-sm text-text2">Execute on your machine with zero API keys or cloud requirements.</p>
            <div className="h-56 rounded-xl bg-[#0F0E17] text-white p-4 font-landing-mono text-xs shadow-inner border border-white/10">
              <TerminalMock />
            </div>
          </div>

          <div className="rounded-[28px] border border-accent/20 bg-white/95 dark:bg-[#151228] p-6 shadow-md space-y-4">
            <span className="font-landing-mono text-xs text-fuchsia-600 font-semibold uppercase">03 / Director</span>
            <h3 className="text-xl font-semibold text-text1">Direct every scene.</h3>
            <p className="text-sm text-text2">Edit beats inline and re-roll dialogues with live directorial notes.</p>
            <div className="h-56 rounded-xl bg-accent/5 dark:bg-white/5 border border-accent/20 p-4 flex flex-col justify-center">
              <DirectingMock />
            </div>
          </div>

          <div className="rounded-[28px] border border-accent/20 bg-white/95 dark:bg-[#151228] p-6 shadow-md space-y-4">
            <span className="font-landing-mono text-xs text-amber-500 font-semibold uppercase">04 / Export</span>
            <h3 className="text-xl font-semibold text-text1">Ready to ship.</h3>
            <p className="text-sm text-text2">Download formatted screenplays and complete production decks in seconds.</p>
            <div className="h-56 rounded-xl bg-accent/5 dark:bg-white/5 border border-accent/20 flex items-center justify-center p-4">
              <ExportStackMock />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* Animation 1: Multi-Agent SVG Node Graph */
const MultiAgentGraph: React.FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg className="w-full h-full" viewBox="0 0 380 200" fill="none">
        <path d="M 65 100 L 125 100" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
        <path d="M 170 95 C 195 90, 215 55, 235 50" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
        <path d="M 170 105 C 195 110, 215 145, 235 150" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
        <path d="M 265 55 C 285 60, 305 90, 320 95" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
        <path d="M 265 145 C 285 140, 305 110, 320 105" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />

        <motion.circle
          r="4"
          fill="#06B6D4"
          animate={{ cx: [65, 125], cy: [100, 100], opacity: [0, 1, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle
          r="4"
          fill="#D946EF"
          animate={{ cx: [170, 235], cy: [95, 50], opacity: [0, 1, 0] }}
          transition={{ duration: 2.2, delay: 0.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle
          r="4"
          fill="#10B981"
          animate={{ cx: [170, 235], cy: [105, 150], opacity: [0, 1, 0] }}
          transition={{ duration: 2.2, delay: 0.7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle
          r="4"
          fill="#6366F1"
          animate={{ cx: [265, 320], cy: [55, 95], opacity: [0, 1, 0] }}
          transition={{ duration: 2.2, delay: 1.3, repeat: Infinity, ease: 'easeInOut' }}
        />

        <g transform="translate(50, 100)">
          <circle r="18" fill="var(--surface)" stroke="#06B6D4" strokeWidth="2" />
          <text textAnchor="middle" dy="4" fill="currentColor" fontSize="9" fontWeight="600">RES</text>
        </g>

        <g transform="translate(150, 100)">
          <circle r="20" fill="var(--surface)" stroke="#D946EF" strokeWidth="2" />
          <text textAnchor="middle" dy="4" fill="currentColor" fontSize="10" fontWeight="600">STR</text>
        </g>

        <g transform="translate(250, 50)">
          <circle r="18" fill="var(--surface)" stroke="#F59E0B" strokeWidth="2" />
          <text textAnchor="middle" dy="4" fill="currentColor" fontSize="9" fontWeight="600">VIS</text>
        </g>

        <g transform="translate(250, 150)">
          <circle r="18" fill="var(--surface)" stroke="#10B981" strokeWidth="2" />
          <text textAnchor="middle" dy="4" fill="currentColor" fontSize="9" fontWeight="600">AUD</text>
        </g>

        <g transform="translate(335, 100)">
          <circle r="18" fill="var(--surface)" stroke="#6366F1" strokeWidth="2" />
          <text textAnchor="middle" dy="4" fill="currentColor" fontSize="9" fontWeight="600">CRT</text>
        </g>
      </svg>
    </div>
  );
};

/* Animation 2: Terminal typing loop */
const TerminalMock: React.FC = () => {
  const [lineIndex, setLineIndex] = useState(0);

  const logs = [
    '$ ollama run llama3.2',
    '● Model loaded: llama3.2 (4.1GB)',
    '✔ Context window: 128k initialized',
    '⚡ Story Agent generating Beat 1...',
    '✦ Tokens/sec: 48.2 (GPU local)',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setLineIndex((prev) => (prev + 1) % (logs.length + 1));
    }, 1100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex items-center gap-1.5 pb-2 border-b border-white/10 shrink-0">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        <span className="text-[10px] text-white/40 ml-2 font-landing-mono">terminal — local</span>
      </div>

      <div className="space-y-1.5 my-auto">
        {logs.slice(0, Math.max(1, lineIndex)).map((line, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            className={`truncate ${
              idx === 0
                ? 'text-accent font-semibold'
                : idx === 1
                ? 'text-emerald-400'
                : 'text-white/80'
            }`}
          >
            {line}
          </motion.div>
        ))}
      </div>

      <div className="text-[10px] text-white/30 pt-1 border-t border-white/10 flex items-center justify-between">
        <span>No network telemetry</span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Offline
        </span>
      </div>
    </div>
  );
};

/* Animation 3: Screenplay line editing */
const DirectingMock: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="p-3.5 rounded-xl bg-surface border border-accent/20 font-landing-mono text-xs space-y-2 shadow-xs">
        <p className="text-[10px] text-text3 uppercase tracking-wider font-semibold">SCENE 2 / DIALOGUE</p>
        <p className="text-text1">
          KAELEN:{' '}
          <span className="bg-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-300 px-1 py-0.5 rounded">
            "I remember the rain before the blackout."
          </span>
          <span className="inline-block w-1.5 h-3 bg-fuchsia-500 ml-1 animate-pulse" />
        </p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[11px] font-landing-mono text-text3">Director feedback applied</span>
        <motion.div
          animate={{ scale: [1, 0.94, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-400 border border-fuchsia-500/25 text-xs font-semibold shadow-xs cursor-pointer"
        >
          <RefreshCw className="w-3 h-3 animate-[spin_4s_linear_infinite]" />
          <span>Regenerate Line</span>
        </motion.div>
      </div>
    </div>
  );
};

/* Animation 4: Exports stack */
const ExportStackMock: React.FC = () => {
  return (
    <div className="relative w-full max-w-[260px] h-40 flex items-center justify-center">
      <motion.div
        animate={{ y: [0, -6, 0], rotate: [-4, -6, -4] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-44 h-32 rounded-xl bg-surface border border-border p-3 shadow-md -translate-x-4 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-[10px] font-landing-mono text-text3">
          <span>deck.md</span>
          <span className="font-semibold text-accent">MD</span>
        </div>
        <div className="space-y-1">
          <div className="h-1.5 w-12 bg-text3/30 rounded" />
          <div className="h-1.5 w-24 bg-text3/20 rounded" />
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 6, 0], rotate: [2, 4, 2] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative w-48 h-34 rounded-xl bg-surface border border-accent/40 p-3.5 shadow-xl flex flex-col justify-between z-10"
      >
        <div className="flex items-center justify-between text-xs font-landing-mono">
          <span className="font-semibold text-text1">Screenplay.pdf</span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">
            PDF
          </span>
        </div>

        <div className="space-y-1.5 my-2">
          <div className="h-2 w-20 bg-accent/30 rounded" />
          <div className="h-1.5 w-full bg-text3/20 rounded" />
          <div className="h-1.5 w-4/5 bg-text3/20 rounded" />
        </div>

        <div className="flex items-center justify-between text-[10px] font-landing-mono text-text3 border-t border-border/60 pt-1">
          <span>Standard US Letter</span>
          <Download className="w-3 h-3 text-accent" />
        </div>
      </motion.div>
    </div>
  );
};
