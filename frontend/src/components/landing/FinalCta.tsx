import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { MagneticButton } from './MagneticButton';

interface FinalCtaProps {
  onEnterStudio: () => void;
}

export const FinalCta: React.FC<FinalCtaProps> = ({ onEnterStudio }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative px-3 sm:px-6 lg:px-8 py-12 sm:py-16 max-w-7xl mx-auto">
      <div className="relative rounded-[32px] sm:rounded-[40px] overflow-hidden bg-[#0B0A14] text-[#F3F2F8] shadow-2xl p-10 sm:p-16 md:p-20 text-center border border-white/10 flex flex-col items-center justify-center min-h-[460px]">
        {/* Background Blurred Orbit with Glowing Orb */}
        <motion.div
          animate={shouldReduceMotion ? {} : { scale: [1, 1.05, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 pointer-events-none select-none z-0"
        >
          <img
            src="/hero-orbit.png"
            alt="Swarm Orbit"
            className="w-full h-full object-cover object-center filter blur-md opacity-40"
          />
        </motion.div>

        {/* Central Radial Light */}
        <div className="absolute inset-0 bg-radial from-accent/25 via-[#0B0A14]/75 to-[#0B0A14] pointer-events-none z-[1]" />
        <div className="landing-grain absolute inset-0 opacity-40 z-[2] pointer-events-none" />

        {/* Foreground Content */}
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <span className="font-landing-mono text-xs uppercase tracking-wider text-accent font-medium block">
            Begin Production
          </span>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.04em] text-white leading-tight">
            Start your next story.
          </h2>

          <p className="text-base sm:text-lg text-[#B3B2C2] max-w-md mx-auto">
            From premise to formatted screenplay, art direction and score in minutes.
          </p>

          <div className="pt-4 flex justify-center">
            <MagneticButton
              onClick={onEnterStudio}
              className="!bg-accent !text-white !px-8 !py-4 shadow-xl hover:shadow-accent/30 text-base"
            >
              <span>Launch Studio</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform duration-300" />
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
};
