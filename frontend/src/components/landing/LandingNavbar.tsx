import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, ArrowRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { User } from '../../types';

interface LandingNavbarProps {
  onEnterStudio: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  currentUser: User | null;
  onNavigate: (target: string) => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  onEnterStudio,
  onOpenAuth,
  currentUser,
  onNavigate,
}) => {
  const { isDark, toggleTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 120) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);

      // Determine active section
      const sections = ['how-it-works', 'built-different', 'swarm', 'faq'];
      const scrollPos = window.scrollY + 200;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { id: 'how-it-works', label: 'How it works' },
    { id: 'built-different', label: 'Built different' },
    { id: 'swarm', label: 'Meet the swarm' },
    { id: 'faq', label: 'Questions' },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-4 sm:top-6 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none"
        >
          <nav className="pointer-events-auto flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-full border border-border/80 bg-surface/75 dark:bg-[#121217]/80 backdrop-blur-xl shadow-sm transition-colors duration-200">
            {/* Logo */}
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setActiveSection('');
              }}
              className="flex items-center gap-2 pr-2 sm:pr-3 pl-1 group outline-none"
            >
              <div className="w-6 h-6 rounded-md overflow-hidden border border-border/60 shrink-0">
                <img src="/logo.jpg" alt="SwarmStudio" className="w-full h-full object-cover" />
              </div>
              <span className="font-semibold text-xs tracking-tight text-text1 hidden sm:inline-block">
                SwarmStudio
              </span>
            </button>

            <div className="h-4 w-[1px] bg-border mx-1 hidden sm:block" />

            {/* Nav Links */}
            <div className="flex items-center space-x-0.5 sm:space-x-1">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => onNavigate(`#${link.id}`)}
                    className={`relative px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                      isActive
                        ? 'text-text1 font-semibold'
                        : 'text-text2 hover:text-text1'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavPill"
                        className="absolute inset-0 bg-surface-muted dark:bg-white/10 rounded-full -z-10"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    {link.label}
                  </button>
                );
              })}
            </div>

            <div className="h-4 w-[1px] bg-border mx-1" />

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              className="w-7 h-7 flex items-center justify-center rounded-full text-text2 hover:text-text1 hover:bg-surface-muted transition-colors"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* Actions */}
            <div className="flex items-center gap-1.5 pl-1">
              {currentUser ? (
                <button
                  onClick={onEnterStudio}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-full bg-accent text-white hover:bg-accent/90 transition-colors shadow-sm"
                >
                  <span>Launch Studio</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => onOpenAuth('login')}
                    className="text-xs font-medium text-text2 hover:text-text1 px-2.5 py-1.5 rounded-full transition-colors hidden xs:inline-block"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => onOpenAuth('register')}
                    className="inline-flex items-center gap-1 text-xs font-medium px-3.5 py-1.5 rounded-full bg-accent text-white hover:bg-accent/90 transition-colors shadow-sm"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </>
              )}
            </div>
          </nav>
        </motion.header>
      )}
    </AnimatePresence>
  );
};
