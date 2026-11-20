import React from 'react';
import { Sun, Moon, ArrowRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface FooterProps {
  onNavigate: (target: string) => void;
  onEnterStudio?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onEnterStudio }) => {
  const { isDark, toggleTheme } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative min-h-[580px] overflow-hidden text-white border-t border-border/80">
      {/* Full-Bleed Cinematic Nebula Image covering the entire footer background (Veriq reference style) */}
      <div className="absolute inset-0 z-0">
        <img
          src="/footer-nebula.png"
          alt="Cinematic Purple Nebula Studio"
          className="w-full h-full object-cover object-[center_15%] filter saturate-[1.25] contrast-[1.08]"
        />
        {/* Soft top gradient blend and dark scrim so all content is crisp and readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0A14]/90 via-[#0B0A14]/65 to-[#0B0A14]/85" />
      </div>

      {/* Footer Content floating directly on the nebula */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-12 flex flex-col justify-between min-h-[580px]">
        
        {/* Top Split Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/15">
          
          {/* Brand Info & Open Studio Button */}
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/20 shadow-xs">
                <img src="/logo.jpg" alt="SwarmStudio" className="w-full h-full object-cover" />
              </div>
              <span className="font-semibold text-lg text-white">SwarmStudio</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-white max-w-sm">
              The autonomous creative studio for storytellers.
            </h3>

            <p className="text-xs sm:text-sm text-white/75 max-w-sm leading-relaxed">
              SwarmStudio runs on your machine with local models, orchestrates five specialized agents, and returns production-ready screenplays and scores.
            </p>

            <div className="pt-2 flex items-center gap-3">
              {onEnterStudio && (
                <button
                  onClick={onEnterStudio}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black hover:bg-white/90 font-medium text-xs sm:text-sm transition-all shadow-md group"
                >
                  <span>Launch Studio</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              )}

              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-white/80 hover:text-white text-xs font-landing-mono transition-colors"
              >
                {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
                <span>{isDark ? 'Light' : 'Dark'}</span>
              </button>
            </div>
          </div>

          {/* Nav Columns (Menu, Essentials, Built with) */}
          <div className="md:col-span-7 grid grid-cols-3 gap-8">
            {/* Menu */}
            <div className="space-y-3.5">
              <span className="font-semibold text-white block text-xs tracking-wider uppercase font-landing-mono">
                Menu
              </span>
              <ul className="space-y-2.5 text-xs text-white/70">
                <li>
                  <button onClick={() => onNavigate('#how-it-works')} className="hover:text-white transition-colors">
                    How it works
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('#built-different')} className="hover:text-white transition-colors">
                    Built different
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('#swarm')} className="hover:text-white transition-colors">
                    Meet the swarm
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('#faq')} className="hover:text-white transition-colors">
                    Questions
                  </button>
                </li>
              </ul>
            </div>

            {/* Essentials */}
            <div className="space-y-3.5">
              <span className="font-semibold text-white block text-xs tracking-wider uppercase font-landing-mono">
                Essentials
              </span>
              <ul className="space-y-2.5 text-xs text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Quick start</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Ollama Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Local Models</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Export Formats</a></li>
              </ul>
            </div>

            {/* Built with */}
            <div className="space-y-3.5">
              <span className="font-semibold text-white block text-xs tracking-wider uppercase font-landing-mono">
                Built with
              </span>
              <ul className="space-y-2.5 text-xs text-white/80">
                <li><span className="text-white font-medium">CrewAI</span></li>
                <li><span className="text-white font-medium">FastAPI</span></li>
                <li><span className="text-white font-medium">React 18</span></li>
                <li><span className="text-white font-medium">Framer Motion</span></li>
                <li><span className="text-white font-medium">Ollama</span></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Status Badges & Copyright (Veriq reference screenshot 4) */}
        <div className="pt-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-landing-mono">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Swarm Engine online · local first
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white shadow-sm">
              v1.0 · CrewAI & FastAPI build
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white shadow-sm">
              ★ 5 Agents Synchronized
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-landing-mono text-white/70 border-t border-white/15 pt-4">
            <p>&copy; {currentYear} SwarmStudio. All rights reserved.</p>
            <p>Built with CrewAI, FastAPI & React</p>
          </div>
        </div>

      </div>
    </footer>
  );
};
