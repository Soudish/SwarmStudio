import React, { useState } from 'react';
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
  RefreshCw,
  Play,
  Sun,
  Moon
} from 'lucide-react';
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
  const [activeMediumTab, setActiveMediumTab] = useState<'film' | 'game' | 'podcast'>('film');
  const { isDark, toggleTheme } = useTheme();

  const mediumShowcase = {
    film: {
      title: 'Cinematic Short Film & Screenplay',
      logline: 'When a decommissioned maintenance robot discovers human emotions after meeting a lonely child in the rain-slicked under-city, it must choose between algorithmic survival and a final act of devotion.',
      genre: 'Sci-Fi / Cyberpunk Noir',
      tone: 'Atmospheric & Deeply Emotional',
      agentsOutput: [
        { label: 'Story Agent', text: 'Three-Act screenplay breakdown with 4 dramatic scenes & dialogue excerpts' },
        { label: 'Research Agent', text: 'Lore of New Aethelgard 2148 + Unit 7-Kaelen & Leo Vane character dossiers' },
        { label: 'Visual Agent', text: 'Panavision 35mm anamorphic Midjourney prompts + 5-color neon obsidian palette' },
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

  // Theme-aware class helpers
  const cardBg = isDark ? 'bg-[#0F1626]' : 'bg-white';
  const cardBorder = isDark ? 'border-slate-800' : 'border-slate-200';
  const cardBorderHover = isDark ? 'hover:border-purple-500/40' : 'hover:border-purple-300';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-300' : 'text-slate-600';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';
  const textLabel = isDark ? 'text-slate-500' : 'text-slate-400';
  const codeBg = isDark ? 'bg-slate-950/80' : 'bg-slate-50';
  const codeBorder = isDark ? 'border-slate-900' : 'border-slate-200';

  return (
    <div className={`min-h-screen theme-transition ${isDark ? 'bg-[#090D16] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'} selection:bg-purple-600 selection:text-white`}>
      {/* Background ambient glow shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] blur-3xl ${isDark ? 'bg-gradient-to-b from-purple-700/20 via-indigo-600/10 to-transparent opacity-75' : 'bg-gradient-to-b from-purple-300/20 via-indigo-200/10 to-transparent opacity-50'}`} />
        <div className={`absolute top-[800px] -left-40 w-96 h-96 rounded-full blur-3xl ${isDark ? 'bg-purple-600/10' : 'bg-purple-200/20'}`} />
        <div className={`absolute top-[1600px] -right-40 w-96 h-96 rounded-full blur-3xl ${isDark ? 'bg-indigo-600/10' : 'bg-indigo-200/20'}`} />
      </div>

      {/* Landing Navbar */}
      <nav className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={onEnterStudio}>
          <div className="relative w-11 h-11 rounded-2xl overflow-hidden shadow-lg shadow-purple-600/30 border border-purple-400/30 group-hover:shadow-purple-500/50 transition-shadow">
            <img src="/logo.jpg" alt="SwarmStudio" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className={`font-extrabold text-xl tracking-tight bg-gradient-to-r bg-clip-text text-transparent ${isDark ? 'from-white via-purple-100 to-purple-300' : 'from-slate-800 via-purple-700 to-purple-500'}`}>
              SwarmStudio
            </span>
            <span className={`ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${isDark ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-purple-100 text-purple-600 border border-purple-200'}`}>
              AI Creative Swarm
            </span>
          </div>
        </div>

        <div className={`hidden md:flex items-center space-x-8 text-sm font-medium ${textSecondary}`}>
          <a href="#features" className="hover:text-purple-400 transition-colors">Features</a>
          <a href="#agents" className="hover:text-purple-400 transition-colors">Agent Swarm</a>
          <a href="#showcase" className="hover:text-purple-400 transition-colors">Playground</a>
          <a href="#workflow" className="hover:text-purple-400 transition-colors">How It Works</a>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition-all ${isDark ? 'text-amber-400 hover:bg-slate-800' : 'text-purple-600 hover:bg-purple-50'}`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {currentUser ? (
            <button
              onClick={onEnterStudio}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-900/40 border border-purple-400/30 transition-all hover:scale-[1.02]"
            >
              <span>Open Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <>
              <button
                onClick={() => onOpenAuth('login')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800/80' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-900/30 border border-purple-400/30 transition-all hover:scale-[1.02]"
              >
                <span>Get Started</span>
              </button>
            </>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-16 pb-20 md:pt-24 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Logo showcase */}
        <div className="flex justify-center mb-8">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden shadow-2xl shadow-purple-600/40 border-2 border-purple-400/40 animate-glow">
            <img src="/logo.jpg" alt="SwarmStudio Logo" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Eyebrow badge */}
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 shadow-sm ${isDark ? 'bg-purple-500/15 border border-purple-500/30 text-purple-300' : 'bg-purple-100 border border-purple-200 text-purple-600'}`}>
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
          <span>Next-Gen Autonomous Creative Intelligence</span>
        </div>

        {/* Main Headline */}
        <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] max-w-4xl mx-auto ${textPrimary}`}>
          Where AI Agents{' '}
          <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
            Direct, Write, & Score
          </span>{' '}
          Your Next Creative Vision.
        </h1>

        {/* Subtitle */}
        <p className={`mt-6 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed ${textSecondary}`}>
          Transform a single creative spark into a comprehensive production bible. Specialized AI agents collaborate, review each other's work, and deliver complete scripts, world lore, Midjourney prompts, and acoustic soundscapes.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onEnterStudio}
            className="flex items-center gap-2.5 px-8 py-4 rounded-2xl font-extrabold text-sm sm:text-base text-white bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-2xl shadow-purple-900/60 border border-purple-400/40 transition-all hover:scale-[1.03] active:scale-[0.98]"
          >
            <img src="/logo.jpg" alt="" className="w-6 h-6 rounded-lg" />
            <span>Launch Studio Workspace</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <a
            href="#showcase"
            className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-semibold text-sm sm:text-base transition-all ${isDark ? 'text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-purple-500/40' : 'text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 hover:border-purple-300 shadow-sm'}`}
          >
            <Play className="w-4 h-4 text-purple-400" />
            <span>Explore Live Deliverables</span>
          </a>
        </div>

        {/* Highlights banner row */}
        <div className={`mt-16 pt-10 border-t grid grid-cols-2 md:grid-cols-4 gap-6 text-left max-w-4xl mx-auto ${isDark ? 'border-purple-500/10' : 'border-purple-200/50'}`}>
          {[
            { stat: '5 Agents', label: 'Autonomous Creative Swarm', desc: 'Research, Story, Visual, Audio & Critic' },
            { stat: '100% Private', label: 'Local Ollama Inference', desc: 'Zero cloud LLM lock-in or recurring fees' },
            { stat: 'Human In Loop', label: 'Inline Screenplay Editing', desc: 'Section regeneration with director notes' },
            { stat: 'Production Ready', label: 'PDF & Markdown Exports', desc: 'Ready for studio pitches & pitch decks' },
          ].map((item, i) => (
            <div key={i} className="space-y-1">
              <div className={`text-2xl font-black ${textPrimary}`}>{item.stat}</div>
              <div className="text-xs text-purple-400 font-semibold">{item.label}</div>
              <p className={`text-[11px] ${textMuted}`}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* INTERACTIVE SWARM SIMULATION PREVIEW */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-2xl relative overflow-hidden ${isDark ? 'bg-gradient-to-b from-[#131B2E] via-[#0F1626] to-[#0A0E1A] border-purple-500/30' : 'bg-gradient-to-b from-white via-slate-50 to-white border-purple-200 shadow-purple-100/50'}`}>
          <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none ${isDark ? 'bg-purple-600/10' : 'bg-purple-200/20'}`} />

          {/* Window Mockup Header */}
          <div className={`flex items-center justify-between border-b pb-4 mb-6 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className={`ml-3 text-xs font-mono ${textMuted}`}>SwarmStudio v1.0 — Active Creative Session</span>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Swarm Concurrency: Optimal
            </span>
          </div>

          {/* Grid showing live agent cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
            {[
              { role: 'Research Agent', status: 'Done', desc: 'World Lore: New Aethelgard 2148', color: 'border-blue-500/40 text-blue-400' },
              { role: 'Story Agent', status: 'Done', desc: 'Screenplay: 4 Scenes & 3-Act Flow', color: 'border-purple-500/40 text-purple-400' },
              { role: 'Visual Agent', status: 'Done', desc: 'Midjourney Prompts & 5-Color Swatch', color: 'border-amber-500/40 text-amber-400' },
              { role: 'Audio Agent', status: 'Done', desc: 'Felt Piano Soundtrack & SFX Cues', color: 'border-emerald-500/40 text-emerald-400' },
              { role: 'Critic Agent', status: '92/100', desc: 'Continuity Audit: Greenlit', color: 'border-violet-500/40 text-violet-400' },
            ].map((ag, i) => (
              <div key={i} className={`p-3.5 rounded-2xl border space-y-1 text-left ${ag.color} ${isDark ? 'bg-slate-900/80' : 'bg-slate-50'}`}>
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className={textPrimary}>{ag.role}</span>
                  <span className="text-emerald-400 font-mono">✓ {ag.status}</span>
                </div>
                <p className={`text-[10px] line-clamp-2 ${textMuted}`}>{ag.desc}</p>
              </div>
            ))}
          </div>

          {/* Deliverable Snapshot Preview */}
          <div className={`p-5 rounded-2xl border text-left space-y-3 font-mono text-xs ${codeBg} ${codeBorder}`}>
            <div className={`flex items-center justify-between border-b pb-2 ${isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
              <span className="font-bold text-purple-400">SCENE 1: THE DISCOVERY [Screenplay Excerpt]</span>
              <span className="text-[11px]">LOCATION: Sector 4 Lower Drainage Alley &bull; MIDNIGHT DRIZZLE</span>
            </div>
            <p className={`leading-relaxed ${textSecondary}`}>
              Cold rain patters against corroded iron pipes. UNIT 7-KAELEN kneels beside a stack of scrap coils, optical sensor rings glowing cobalt. A shivering 10-year-old child, LEO VANE, clutches a broken clockwork music box.
            </p>
            <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-900/80 border-slate-800 text-purple-200' : 'bg-purple-50 border-purple-200 text-purple-700'}`}>
              <span className={`block text-[10px] font-bold ${textLabel}`}>KAELEN:</span>
              "Thermal anomaly confirmed. My logic circuits... recommend silence."
            </div>
          </div>
        </div>
      </section>

      {/* THE 5 AGENTS SHOWCASE */}
      <section id="agents" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
            Autonomous Creative Department
          </span>
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${textPrimary}`}>
            Meet Your Specialized AI Creative Crew
          </h2>
          <p className={`text-sm sm:text-base ${textMuted}`}>
            Each agent possesses distinct creative objectives, specialized prompts, and access to departmental outputs from previous stages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'Research Agent', subtitle: 'World-Building & Lore Architect', icon: Brain, gradient: 'from-blue-600 to-cyan-500', shadowColor: 'shadow-blue-600/20', hoverBorder: 'hover:border-blue-500/40', desc: 'Grounds high-concept concepts with cohesive environmental lore, societal laws, technological boundaries, and psychologically rich character dossiers.', deliverables: ['Universal Laws & Factions', 'Multi-dimensional Character Dossiers', 'Scientific & Fantastical Frameworks'] },
            { name: 'Story Agent', subtitle: 'Screenplay & Narrative Architect', icon: Feather, gradient: 'from-purple-600 to-pink-500', shadowColor: 'shadow-purple-600/20', hoverBorder: 'hover:border-purple-500/40', desc: 'Transforms world-building into cinematic treatments, 3-act narrative structures, sharp character dialogue, and chronological scene beats.', deliverables: ['High-Concept Loglines & Synopsis', 'Three-Act Progression Beats', 'Screenplay Scenes with Dialogue'] },
            { name: 'Visual Agent', subtitle: 'Art Director & Concept Artist', icon: Palette, gradient: 'from-amber-500 to-rose-500', shadowColor: 'shadow-amber-600/20', hoverBorder: 'hover:border-amber-500/40', desc: 'Translates literary moments into visual aesthetics, selecting 5-color swatch palettes, cinematography lighting ratios, and ready-to-use Midjourney/Flux image prompts.', deliverables: ['5-Color Swatch Palette with Hexes', 'Midjourney v6 / Flux Prompt Catalog', 'Cinematography & Lenses Direction'] },
            { name: 'Audio Agent', subtitle: 'Sound Designer & Music Supervisor', icon: Headphones, gradient: 'from-emerald-500 to-teal-400', shadowColor: 'shadow-emerald-600/20', hoverBorder: 'hover:border-emerald-500/40', desc: 'Directs the soundtrack philosophy, leitmotif instruments, scene-by-scene SFX soundscapes (Ambient, Foley, Action, Stingers), and voice casting cadence.', deliverables: ['Score Philosophy & Instrumentation', 'Categorized Sound Effects Catalog', 'Vocal Timbre & Casting Guidelines'] },
            { name: 'Critic Agent', subtitle: 'Lead Editorial & Continuity Critic', icon: CheckCircle2, gradient: 'from-violet-600 to-indigo-500', shadowColor: 'shadow-purple-600/20', hoverBorder: 'hover:border-violet-500/40', desc: 'Audits all multi-departmental outputs for narrative continuity, pacing, character logic, and emotional resonance. Delivers an objective Quality Index (0-100).', deliverables: ['Continuity & Plothole Audit', 'Creative Quality Index (0–100)', 'Prioritized Editorial Recommendations'] },
            { name: 'Human Director', subtitle: 'Executive Creator & Approver', icon: RefreshCw, gradient: 'from-purple-600/40 to-indigo-600/40', shadowColor: '', hoverBorder: '', isSpecial: true, desc: 'You maintain complete creative control. Edit any scene inline, request specific section regenerations, or approve deliverables for final export.', deliverables: ['Inline Script Editor', 'Target Section Regeneration', 'Export to PDF & Markdown'] },
          ].map((agent, i) => {
            const Icon = agent.icon;
            const isSpecial = (agent as any).isSpecial;
            return (
              <div key={i} className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                isSpecial
                  ? isDark
                    ? 'bg-gradient-to-br from-purple-950/40 to-[#0F1626] border-purple-500/30'
                    : 'bg-gradient-to-br from-purple-50 to-white border-purple-200'
                  : `${cardBg} ${cardBorder} ${agent.hoverBorder}`
              }`}>
                <div>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-white mb-4 shadow-lg ${agent.shadowColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className={`font-bold text-lg ${textPrimary}`}>{agent.name}</h3>
                  <span className={`text-xs font-semibold block mb-2 ${isSpecial ? 'text-purple-400' : 'text-purple-400'}`}>{agent.subtitle}</span>
                  <p className={`text-xs leading-relaxed ${textMuted}`}>{agent.desc}</p>
                </div>
                <div className={`pt-3 border-t text-[11px] space-y-1 ${isDark ? 'border-slate-800' : 'border-slate-200'} ${isSpecial ? 'text-purple-400' : textMuted}`}>
                  <span className={`font-bold block ${isSpecial ? 'text-purple-400' : textLabel}`}>
                    {isSpecial ? 'CAPABILITIES:' : 'DELIVERABLES:'}
                  </span>
                  {agent.deliverables.map((d, j) => <div key={j}>&bull; {d}</div>)}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* PLAYGROUND / MEDIUM SHOWCASE */}
      <section id="showcase" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Creative Mediums</span>
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${textPrimary}`}>
            Tailored For Every Storytelling Canvas
          </h2>
          <p className={`text-sm sm:text-base ${textMuted}`}>
            Select a medium below to see real deliverables generated by the agent swarm.
          </p>
        </div>

        {/* Medium Tabs */}
        <div className="flex justify-center">
          <div className={`inline-flex p-1.5 rounded-2xl border text-xs sm:text-sm font-semibold ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
            {[
              { id: 'film', label: 'Film & Cinema', icon: Film },
              { id: 'game', label: 'Narrative RPG Game', icon: Gamepad2 },
              { id: 'podcast', label: 'Audio Drama Podcast', icon: Mic },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveMediumTab(id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all ${
                  activeMediumTab === id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Medium Showcase Card */}
        {(() => {
          const item = mediumShowcase[activeMediumTab];
          return (
            <div className={`max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 text-left ${cardBg} ${isDark ? 'border-purple-500/20' : 'border-purple-200'}`}>
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <div>
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">{item.genre}</span>
                  <h3 className={`text-xl font-bold mt-0.5 ${textPrimary}`}>{item.title}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium self-start sm:self-auto ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                  Tone: {item.tone}
                </span>
              </div>

              <div className={`p-4 rounded-2xl border italic text-sm leading-relaxed ${codeBg} ${codeBorder} ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                "{item.logline}"
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {item.agentsOutput.map((out, idx) => (
                  <div key={idx} className={`p-3.5 rounded-xl border space-y-1 ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="font-bold text-purple-400 block">{out.label}</span>
                    <p className={`text-[11px] leading-snug ${textSecondary}`}>{out.text}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={onEnterStudio}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-900/30 transition-all"
                >
                  <span>Build A {item.title} Project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })()}
      </section>

      {/* WORKFLOW PIPELINE SECTION */}
      <section id="workflow" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">How It Works</span>
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${textPrimary}`}>
            From Raw Prompt to Production Bible
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto text-left">
          {[
            { step: '01', title: 'Enter Creative Spark', desc: 'Type your core premise, select Film, Game, or Podcast, and set tone, genre, and target audience.' },
            { step: '02', title: 'Swarm Orchestration', desc: 'Research & Story agents establish the world lore and write the script, feeding context directly to Visual and Audio agents.' },
            { step: '03', title: 'Critic Continuity Check', desc: 'Critic Agent audits the entire collaborative package, flags subtleties, and assigns an objective Quality Score.' },
            { step: '04', title: 'Refine & Export', desc: 'Edit scripts inline, regenerate sections on demand, and export production-ready PDFs or Markdown treatments.' },
          ].map((s, idx) => (
            <div key={idx} className={`p-6 rounded-3xl border space-y-3 relative ${cardBg} ${cardBorder}`}>
              <div className={`text-3xl font-black ${isDark ? 'text-purple-500/40' : 'text-purple-300/60'}`}>{s.step}</div>
              <h3 className={`font-bold text-base ${textPrimary}`}>{s.title}</h3>
              <p className={`text-xs leading-relaxed ${textMuted}`}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className={`rounded-3xl p-8 sm:p-14 border shadow-2xl relative overflow-hidden ${isDark ? 'bg-gradient-to-r from-purple-900/50 via-indigo-900/40 to-purple-900/50 border-purple-500/40' : 'bg-gradient-to-r from-purple-100 via-indigo-50 to-purple-100 border-purple-200'}`}>
          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${textPrimary}`}>
              Ready to assemble your AI creative team?
            </h2>
            <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-purple-200' : 'text-purple-700'}`}>
              Join SwarmStudio today to turn simple thoughts into fully-realized cinematic scripts, lore bibles, and concept prompt sheets.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={onEnterStudio}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm text-white bg-purple-600 hover:bg-purple-500 shadow-xl shadow-purple-950/60 border border-purple-400/40 transition-all hover:scale-[1.02]"
              >
                <img src="/logo.jpg" alt="" className="w-5 h-5 rounded-lg" />
                <span>Launch Studio Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`relative z-10 border-t py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs ${isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
        <div className="flex items-center gap-2">
          <img src="/logo.jpg" alt="SwarmStudio" className="w-5 h-5 rounded-md" />
          <span className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>SwarmStudio</span>
          <span>&bull;</span>
          <span>Autonomous Multi-Agent Creative Collaboration Platform</span>
        </div>
        <div>
          <span>Powered by CrewAI, Ollama & React &bull; 2026</span>
        </div>
      </footer>
    </div>
  );
};
