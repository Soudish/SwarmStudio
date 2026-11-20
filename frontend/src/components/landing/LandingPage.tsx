import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  Brain,
  Feather,
  Palette,
  Headphones,
  CheckCircle2,
  Film,
  Gamepad2,
  Mic,
  Sun,
  Moon,
  Sparkles,
  Terminal,
  FileText,
  Sliders,
  ShieldCheck,
  Cpu,
  Layers,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { User } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

interface LandingPageProps {
  onEnterStudio: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  currentUser: User | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterStudio,
  onOpenAuth,
  currentUser,
}) => {
  const { isDark, toggleTheme } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMediumTab, setActiveMediumTab] = useState<'film' | 'game' | 'podcast'>('film');
  const [activeStoryStep, setActiveStoryStep] = useState(0);
  const storyContainerRef = useRef<HTMLDivElement>(null);

  // Scroll listener for sticky navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mediumShowcase = {
    film: {
      title: 'Cinematic Short Film & Screenplay',
      logline: 'When a decommissioned maintenance robot discovers human emotions after meeting a lonely child in the rain-slicked under-city, it must choose between algorithmic survival and a final act of devotion.',
      genre: 'Sci-Fi / Cyberpunk Noir',
      tone: 'Atmospheric & Deeply Emotional',
      agentsOutput: [
        { label: 'Story Agent', text: 'Three-Act screenplay breakdown with 4 dramatic scenes & dialogue excerpts' },
        { label: 'Research Agent', text: 'Lore of New Aethelgard 2148 + Unit 7-Kaelen & Leo Vane character dossiers' },
        { label: 'Visual Agent', text: 'Panavision 35mm anamorphic Midjourney prompts + 5-color obsidian neon palette' },
        { label: 'Audio Agent', text: 'Felt upright piano, cello motifs, and 5 categorized rain/servo SFX cues' },
        { label: 'Critic Agent', text: 'Quality Index: 92/100 — "Greenlit with distinction for high thematic resonance"' },
      ]
    },
    game: {
      title: 'Narrative RPG & Quest Lore',
      logline: 'A rogue memory courier in Neo-Kyoto accidentally downloads the encrypted memories of a murdered megacorp CEO, triggering a hunt across vertical factions.',
      genre: 'Cyberpunk Narrative RPG',
      tone: 'High Stakes & Moral Ambiguity',
      agentsOutput: [
        { label: 'Story Agent', text: 'Branching quest arcs, faction dialogues, and critical choice consequences' },
        { label: 'Research Agent', text: 'Corporate syndicate lore, neural cyberware limits, and 4 NPC dossiers' },
        { label: 'Visual Agent', text: 'Unreal Engine 5 concept art prompts, holographic lighting, dark cyber-palette' },
        { label: 'Audio Agent', text: 'Industrial darksynth soundtrack, tactical EMP stingers, and radio Foley' },
        { label: 'Critic Agent', text: 'Quality Index: 90/100 — "Branching logic validated; NPC motivations tight"' },
      ]
    },
    podcast: {
      title: 'Serialized Investigative Audio Drama',
      logline: 'An audio restoration archivist unearths hypnotic rhythmic pulses embedded inside forgotten 1970s pirate radio broadcast tapes.',
      genre: 'Supernatural Mystery Audio Drama',
      tone: 'Eerie, Claustrophobic & Gripping',
      agentsOutput: [
        { label: 'Story Agent', text: '6-part episodic narrative treatment with tension pacing and cliffhangers' },
        { label: 'Research Agent', text: 'Acoustic frequency physics, tape-decay lore, and protagonist profile' },
        { label: 'Visual Agent', text: 'Vintage analog cassette artwork prompts, warm amber filament lighting' },
        { label: 'Audio Agent', text: 'Tape reel flutter, detuned tape-head hum, binaural spatial audio cues' },
        { label: 'Critic Agent', text: 'Quality Index: 94/100 — "Acoustic world-building achieves maximum suspense"' },
      ]
    }
  };

  const workflowSteps = [
    {
      num: '01',
      title: 'Research & Lore',
      agent: 'Research Agent',
      dotColor: 'bg-agent-research',
      desc: 'Grounds your premise with expansive world lore, faction politics, and psychologically rich character dossiers.',
      mockup: {
        badge: 'Character Dossier',
        name: 'UNIT 7-KAELEN',
        role: 'Protagonist / Decommissioned Android',
        details: 'Constructed 2138 by Aethel Corp. Possesses obsolete emotive subroutine that activates under acoustic resonance.',
        tags: ['New Aethelgard', 'Heuristic Memory', 'Empathetic Glitch']
      }
    },
    {
      num: '02',
      title: 'Story Architecture',
      agent: 'Story Agent',
      dotColor: 'bg-agent-story',
      desc: 'Structures a rigorous 3-act narrative beat sheet, scene treatments, and standard screenplay dialogue.',
      mockup: {
        badge: 'Screenplay Excerpt',
        name: 'SCENE 1: THE DRAINAGE ALLEY',
        role: 'EXT. LOWER DISTRICT - NIGHT (RAIN)',
        details: 'KAELEN steps beneath a leaking conduit. Rain droplets vaporize against his warm chassis. Leo clutches a music box.',
        tags: ['Act I Beat', 'Slugline: EXT/NIGHT', 'Page 1 of 14']
      }
    },
    {
      num: '03',
      title: 'Visual & Acoustic Design',
      agent: 'Visual & Audio Agents',
      dotColor: 'bg-agent-visual',
      desc: 'Synthesizes 5-swatch color palettes, Midjourney/FLUX prompts, and scene-specific acoustic soundscapes.',
      mockup: {
        badge: 'Multimodal Assets',
        name: 'Aesthetic Palette & Score Leitmotif',
        role: 'Panavision 35mm + Felt Piano / Cello Motifs',
        details: 'Color Palette: #0B0E14, #1E293B, #6D5BD0, #38BDF8, #F1F5F9. SFX: 5 categorized atmospheric cues.',
        tags: ['5 Swatches', 'Midjourney v6', 'Foley Soundboard']
      }
    },
    {
      num: '04',
      title: 'Continuity & Quality Audit',
      agent: 'Critic Agent',
      dotColor: 'bg-agent-critic',
      desc: 'Audits continuity, plot holes, and character voice consistency, calculating an objective Quality Index.',
      mockup: {
        badge: 'Quality Assessment',
        name: 'Quality Index: 92/100 — Greenlit',
        role: 'Continuity & Pacing Verification',
        details: 'Pacing is tight; emotional arc builds smoothly toward Scene 3. High thematic resonance with zero logic contradictions.',
        tags: ['Continuity: Pass', 'Index: 92/100', 'Editorial Notes: 3']
      }
    },
    {
      num: '05',
      title: 'Director Refine & Export',
      agent: 'Human Director',
      dotColor: 'bg-accent',
      desc: 'Maintain full creative agency with inline screenplay editing, targeted section regeneration, and pitch-ready exports.',
      mockup: {
        badge: 'Production Deliverables',
        name: 'Pitch Deck & Treatment Ready',
        role: 'PDF Bible, Markdown Treatment, Print Decks',
        details: 'One-click publication of production-grade documentation ready for studio pitches, game engines, or writer rooms.',
        tags: ['Vector PDF', 'Markdown', 'Print Stylesheet']
      }
    }
  ];

  return (
    <div className="min-h-screen bg-bg text-text1 selection:bg-accent-tint selection:text-accent-text theme-transition">
      {/* ── STICKY MINIMAL NAVBAR ───────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-200 ${
          isScrolled
            ? 'bg-bg/85 backdrop-blur-md border-b border-border shadow-sm'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div
            onClick={onEnterStudio}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-border group-hover:border-border-hover transition-colors">
              <img src="/logo.jpg" alt="SwarmStudio" className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base tracking-tight text-text1">
                SwarmStudio
              </span>
              <span className="hidden sm:inline-flex text-[11px] font-medium px-2 py-0.5 rounded-full bg-accent-tint text-accent-text">
                Beta
              </span>
            </div>
          </div>

          {/* Anchor Nav Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-text2">
            <a href="#features" className="hover:text-text1 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-text1 transition-colors">How It Works</a>
            <a href="#agents" className="hover:text-text1 transition-colors">Agent Swarm</a>
            <a href="#playground" className="hover:text-text1 transition-colors">Playground</a>
          </nav>

          {/* Actions: Theme Toggle + Auth */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-text2 hover:text-text1 hover:bg-surface-muted transition-colors"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {currentUser ? (
              <button
                onClick={onEnterStudio}
                className="btn-primary text-xs py-2 px-4"
              >
                <span>Open Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth('login')}
                  className="btn-ghost text-xs py-2 px-3.5 border-transparent hover:border-border"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="btn-primary text-xs py-2 px-4"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ────────────────────────────────────────────────── */}
      <section className="pt-8 sm:pt-14 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-[28px] sm:rounded-[32px] border border-border bg-gradient-to-b from-surface via-surface to-surface-muted/60 p-8 sm:p-14 lg:p-16 overflow-hidden shadow-sm">
          {/* Subtle ambient light gradient in top right */}
          <div
            className="absolute top-0 right-0 w-[500px] h-[400px] pointer-events-none opacity-40 blur-3xl -z-0"
            style={{
              background: 'radial-gradient(circle at 70% 30%, rgba(109, 91, 208, 0.18), transparent 70%)'
            }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Copy & Actions */}
            <div className="lg:col-span-7 space-y-6">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-surface-muted border border-border text-text2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span>Autonomous Multi-Agent Creative Intelligence</span>
              </div>

              {/* Large Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-text1 leading-[1.08]">
                Where AI agents direct, write, and score your creative vision.
              </h1>

              {/* 2-line Subcopy */}
              <p className="text-base sm:text-lg text-text2 leading-relaxed max-w-xl">
                Transform a single premise into a complete production bible. Specialized AI agents research lore, draft screenplays, design visual prompts, and compose acoustic soundscapes in unified concert.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={onEnterStudio}
                  className="btn-primary text-sm px-6 py-3"
                >
                  <span>Launch Studio Workspace</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
                <a
                  href="#playground"
                  className="btn-ghost text-sm px-5 py-3"
                >
                  <span>Explore Deliverables</span>
                </a>
              </div>

              {/* Format & Tech Badges */}
              <div className="pt-6 border-t border-border flex flex-wrap items-center gap-2">
                <span className="text-xs text-text3 font-medium mr-1">Formats:</span>
                <span className="pill text-xs">Film & Cinema</span>
                <span className="pill text-xs">Game Narrative</span>
                <span className="pill text-xs">Podcast Drama</span>
                <span className="text-text3 text-xs mx-1">·</span>
                <span className="text-xs text-text3 font-medium mr-1">Stack:</span>
                <span className="pill text-xs">CrewAI</span>
                <span className="pill text-xs">Local Ollama</span>
                <span className="pill text-xs">FLUX.1</span>
              </div>
            </div>

            {/* Right Column: Floating Agent Chips */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              {[
                {
                  agent: 'Research Agent',
                  color: 'bg-agent-research',
                  tag: 'Lore & Dossiers',
                  text: 'Synthesized New Aethelgard corporate laws & 2 character dossiers'
                },
                {
                  agent: 'Story Agent',
                  color: 'bg-agent-story',
                  tag: '3-Act Screenplay',
                  text: 'Act I inciting incident written with dramatic dialogue beats'
                },
                {
                  agent: 'Visual Agent',
                  color: 'bg-agent-visual',
                  tag: 'Cinematography',
                  text: '5-color obsidian swatch palette + 35mm anamorphic prompts'
                },
                {
                  agent: 'Audio Agent',
                  color: 'bg-agent-audio',
                  tag: 'Score & Foley',
                  text: 'Felt upright piano leitmotif & 5 categorized rain sound cues'
                },
                {
                  agent: 'Critic Agent',
                  color: 'bg-agent-critic',
                  tag: 'Continuity Audit',
                  text: 'Quality Index: 92/100 — Zero logic contradictions flagged'
                },
              ].map((chip, idx) => (
                <motion.div
                  key={idx}
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx, duration: 0.4 }}
                  className="card p-3.5 flex items-center justify-between gap-3 shadow-sm hover:border-border-hover transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${chip.color}`} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-text1">{chip.agent}</span>
                        <span className="text-[10px] text-text3 font-mono">[{chip.tag}]</span>
                      </div>
                      <p className="text-[11px] text-text2 truncate max-w-[280px] sm:max-w-xs">{chip.text}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 shrink-0">Done</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BENTO FEATURES GRID ─────────────────────────────────────────── */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="max-w-2xl space-y-3">
          <span className="label">Capabilities</span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-text1">
            Engineered for high-order creative production.
          </h2>
          <p className="text-sm sm:text-base text-text2">
            Every layer of the platform is designed to replace disconnected prompt-engineering with structured, multi-departmental orchestration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              icon: Brain,
              title: 'Multi-Agent Orchestration',
              desc: 'Autonomous CrewAI workflow where Research, Story, Visual, and Audio agents collaborate sequentially and share departmental memory context.'
            },
            {
              icon: Cpu,
              title: '100% Private & Local Inference',
              desc: 'Powered natively by Ollama with Llama 3 and Mistral. Zero cloud LLM lock-in, recurring API subscriptions, or confidential lore leakage.'
            },
            {
              icon: Sliders,
              title: 'Human-in-the-Loop Director',
              desc: 'Maintain authoritative creative control. Edit any scene inline, supply tailored director notes, and selectively regenerate sections.'
            },
            {
              icon: FileText,
              title: 'Production-Ready Pitch Bibles',
              desc: 'Instantly compile your completed project into an industry-formatted PDF pitch bible, clean Markdown treatments, or print-ready decks.'
            },
            {
              icon: Terminal,
              title: 'Real-Time Streaming Telemetry',
              desc: 'Inspect agent deliberations live via WebSockets. Monitor agent states, token activity, and inner chains of thought in real-time.'
            },
            {
              icon: Layers,
              title: 'Multimodal Synthesis',
              desc: 'Generate cohesive 5-swatch color palettes with click-to-copy hex codes, FLUX.1 prompts, and categorized audio Foley cue soundboards.'
            },
          ].map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="card p-6 flex flex-col justify-between space-y-4 hover:border-border-hover transition-colors"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-muted flex items-center justify-center text-text1 border border-border">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="text-base font-semibold text-text1">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-text2 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── STICKY VERTICAL SLIDING "HOW IT WORKS" STORY ───────────────── */}
      <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="max-w-2xl space-y-3">
          <span className="label">Workflow</span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-text1">
            From raw spark to complete production bible.
          </h2>
          <p className="text-sm sm:text-base text-text2">
            Watch how specialized agents transform a one-sentence premise into a comprehensive cinematic asset package.
          </p>
        </div>

        {/* Desktop Sticky Layout / Mobile Stacked Layout */}
        <div ref={storyContainerRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Step Index (Sticky on Desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-3">
            {workflowSteps.map((step, idx) => {
              const isActive = activeStoryStep === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStoryStep(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                    isActive
                      ? 'card border-accent/40 bg-surface shadow-sm'
                      : 'border-transparent hover:bg-surface-muted text-text3 hover:text-text2'
                  }`}
                >
                  <span className={`text-xs font-mono font-bold pt-0.5 ${isActive ? 'text-accent' : 'text-text3'}`}>
                    {step.num}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${step.dotColor}`} />
                      <h3 className={`text-sm font-semibold ${isActive ? 'text-text1' : 'text-text2'}`}>
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-xs text-text3 mt-1 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Display Cards (Interactive Stack) */}
          <div className="lg:col-span-7">
            {(() => {
              const step = workflowSteps[activeStoryStep];
              return (
                <div className="card p-6 sm:p-8 space-y-6 shadow-md border-border">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${step.dotColor}`} />
                      <span className="text-xs font-semibold text-text1">{step.agent}</span>
                      <span className="pill text-[10px]">{step.mockup.badge}</span>
                    </div>
                    <span className="text-xs font-mono text-text3">Step {step.num} of 05</span>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-text1">{step.mockup.name}</h4>
                    <p className="text-xs font-medium text-accent">{step.mockup.role}</p>
                    <div className="p-4 rounded-xl bg-surface-muted border border-border text-xs sm:text-sm text-text2 leading-relaxed">
                      {step.mockup.details}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    {step.mockup.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="pill text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => setActiveStoryStep((prev) => (prev > 0 ? prev - 1 : 4))}
                      className="text-xs text-text3 hover:text-text1 transition-colors"
                    >
                      &larr; Previous step
                    </button>
                    <button
                      onClick={() => setActiveStoryStep((prev) => (prev < 4 ? prev + 1 : 0))}
                      className="btn-ghost text-xs py-1.5 px-3"
                    >
                      <span>Next: {workflowSteps[(activeStoryStep + 1) % 5].title}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* ── AGENT SWARM SHOWCASE ─────────────────────────────────────────── */}
      <section id="agents" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="max-w-2xl space-y-3">
          <span className="label">The Creative Crew</span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-text1">
            Meet your 5 specialized AI collaborators.
          </h2>
          <p className="text-sm sm:text-base text-text2">
            Each agent possesses distinct creative objectives, departmental prompts, and shared access to project memory.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              name: 'Research Agent',
              role: 'World-Building & Lore Architect',
              dotColor: 'bg-agent-research',
              icon: Brain,
              desc: 'Establishes environmental physics, historical timelines, societal factions, and psychologically rich character dossiers.',
              outputs: ['World lore & faction politics', 'Character profiles & psychology', 'Historical context bible']
            },
            {
              name: 'Story Agent',
              role: 'Screenplay & Narrative Architect',
              dotColor: 'bg-agent-story',
              icon: Feather,
              desc: 'Translates world lore into dramatic 3-act narrative arcs, structured scene treatments, and sharp screenplay dialogue.',
              outputs: ['3-Act structure beat sheet', 'Scene breakdowns & sluglines', 'Standard script dialogue']
            },
            {
              name: 'Visual Agent',
              role: 'Art Director & Concept Artist',
              dotColor: 'bg-agent-visual',
              icon: Palette,
              desc: 'Directs the aesthetic look, assembling 5-swatch color palettes, lighting ratios, and ready-to-render Midjourney/FLUX prompts.',
              outputs: ['5-swatch palette with hex codes', 'Midjourney v6 / FLUX prompts', 'Cinematography camera cues']
            },
            {
              name: 'Audio Agent',
              role: 'Sound Designer & Music Supervisor',
              dotColor: 'bg-agent-audio',
              icon: Headphones,
              desc: 'Curates the acoustic universe: score instrumentation, character leitmotifs, and categorized atmospheric Foley soundscapes.',
              outputs: ['Score philosophy & themes', 'Categorized SFX soundboard', 'Vocal cadence & casting tone']
            },
            {
              name: 'Critic Agent',
              role: 'Lead Editorial & Continuity Critic',
              dotColor: 'bg-agent-critic',
              icon: CheckCircle2,
              desc: 'Audits continuity, plot holes, and character voice consistency across all departments, awarding an objective Quality Index (0-100).',
              outputs: ['Continuity audit & plothole check', 'Quality Index score (0-100)', 'Targeted director notes']
            },
            {
              name: 'Human Director',
              role: 'Executive Creator & Approver',
              dotColor: 'bg-accent',
              icon: Sliders,
              desc: 'You maintain ultimate creative authority. Edit any scene inline, request targeted section regenerations, or approve for export.',
              outputs: ['Inline scene beat editor', 'Selective section regeneration', 'Vector PDF & Markdown export']
            },
          ].map((agent, i) => {
            const Icon = agent.icon;
            return (
              <div
                key={i}
                className="card p-6 flex flex-col justify-between space-y-5 hover:border-border-hover transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-surface-muted flex items-center justify-center text-text1 border border-border">
                      <Icon className="w-5 h-5 text-text1" />
                    </div>
                    <span className="flex items-center gap-1.5 text-xs text-text3 font-medium">
                      <span className={`w-2 h-2 rounded-full ${agent.dotColor}`} />
                      Autonomous
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-text1">{agent.name}</h3>
                    <p className="text-xs text-accent font-medium mt-0.5">{agent.role}</p>
                  </div>

                  <p className="text-xs text-text2 leading-relaxed">{agent.desc}</p>
                </div>

                <div className="pt-3 border-t border-border space-y-1.5">
                  <span className="label block text-[10px]">Deliverables</span>
                  {agent.outputs.map((out, oIdx) => (
                    <div key={oIdx} className="text-[11px] text-text3 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-text3" />
                      <span>{out}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── PLAYGROUND PREVIEW ───────────────────────────────────────────── */}
      <section id="playground" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="label">Live Playground</span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-text1">
            Explore sample production deliverables.
          </h2>
          <p className="text-sm sm:text-base text-text2">
            Toggle between formats below to inspect real outputs generated by the SwarmStudio agent team.
          </p>

          {/* Medium Tabs */}
          <div className="pt-4 flex justify-center">
            <div className="inline-flex p-1 rounded-full bg-surface-muted border border-border text-xs font-medium">
              {[
                { id: 'film', label: 'Film & Cinema', icon: Film },
                { id: 'game', label: 'Narrative RPG Game', icon: Gamepad2 },
                { id: 'podcast', label: 'Audio Drama Podcast', icon: Mic },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveMediumTab(id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    activeMediumTab === id
                      ? 'bg-surface text-text1 shadow-sm font-semibold'
                      : 'text-text3 hover:text-text1'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Deliverable Mockup Window */}
        {(() => {
          const item = mediumShowcase[activeMediumTab];
          return (
            <div className="max-w-4xl mx-auto card overflow-hidden shadow-md border-border">
              {/* Window Chrome */}
              <div className="px-5 py-3.5 bg-surface-muted border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-text3/30" />
                  <span className="w-2.5 h-2.5 rounded-full bg-text3/30" />
                  <span className="w-2.5 h-2.5 rounded-full bg-text3/30" />
                  <span className="ml-2 text-xs font-mono text-text3">SwarmStudio &mdash; {item.title}</span>
                </div>
                <span className="pill text-[10px]">{item.genre}</span>
              </div>

              {/* Workspace Content */}
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <span className="label block text-[10px]">Logline</span>
                  <blockquote className="text-sm sm:text-base text-text1 italic font-serif leading-relaxed mt-1">
                    "{item.logline}"
                  </blockquote>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {item.agentsOutput.map((out, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-surface-muted/60 border border-border space-y-1">
                      <span className="font-semibold text-text1 block">{out.label}</span>
                      <p className="text-[11px] text-text2 leading-snug">{out.text}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-border">
                  <span className="text-xs text-text3 font-medium">Tone: {item.tone}</span>
                  <button
                    onClick={onEnterStudio}
                    className="btn-primary text-xs py-2 px-4"
                  >
                    <span>Build A {item.title} Project</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* ── FINAL CTA BAND ──────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="card-dark p-8 sm:p-14 lg:p-16 rounded-[28px] sm:rounded-[32px] text-center space-y-6 shadow-md">
          <div className="space-y-3 max-w-xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              Ready to assemble your AI creative team?
            </h2>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              Turn simple premises into production-ready scripts, visual palettes, and soundscapes in minutes.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onEnterStudio}
              className="inline-flex items-center gap-2 bg-white text-text1 font-semibold text-sm px-6 py-3 rounded-full hover:bg-white/90 transition-colors shadow-sm"
            >
              <span>Launch Studio Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-xs text-text3 space-y-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md overflow-hidden border border-border">
                <img src="/logo.jpg" alt="SwarmStudio" className="w-full h-full object-cover" />
              </div>
              <span className="font-semibold text-sm text-text1">SwarmStudio</span>
            </div>
            <p className="text-xs text-text2 max-w-xs leading-relaxed">
              The autonomous multi-agent creative studio. Transform premises into screenplays, visual palettes, and acoustic score treatments.
            </p>
            <div className="pt-1 flex items-center gap-4 text-text3">
              <a href="#" className="hover:text-text1 transition-colors">GitHub</a>
              <a href="#" className="hover:text-text1 transition-colors">Twitter</a>
              <a href="#" className="hover:text-text1 transition-colors">Discord</a>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-2.5">
            <span className="font-semibold text-text1 block text-xs">Product</span>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-text1 transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-text1 transition-colors">How It Works</a></li>
              <li><a href="#agents" className="hover:text-text1 transition-colors">Agent Swarm</a></li>
              <li><a href="#playground" className="hover:text-text1 transition-colors">Playground</a></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-2.5">
            <span className="font-semibold text-text1 block text-xs">Resources</span>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-text1 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-text1 transition-colors">Ollama Setup</a></li>
              <li><a href="#" className="hover:text-text1 transition-colors">Model Compatibility</a></li>
              <li><a href="#" className="hover:text-text1 transition-colors">Changelog</a></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-2.5">
            <span className="font-semibold text-text1 block text-xs">Legal</span>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-text1 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-text1 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-text1 transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-text1 transition-colors">License</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} SwarmStudio. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Built with CrewAI, FastAPI & React</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Systems Operational
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
