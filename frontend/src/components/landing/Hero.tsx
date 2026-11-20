import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { MagneticButton } from './MagneticButton';

interface HeroProps {
  onEnterStudio: () => void;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onEnterStudio, onExploreClick }) => {
  const shouldReduceMotion = useReducedMotion();
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const { scrollY } = useScroll();

  // Hero stays static while blurring and subtly scaling as the curtain covers it
  const scale = useTransform(scrollY, [0, 600], [1, 0.94]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0.35]);
  const blurVal = useTransform(scrollY, [0, 500], [0, 12]);
  const filter = useTransform(blurVal, (v) => `blur(${v}px)`);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = ((clientX - left) / width - 0.5) * 24; // max 12px each direction
    const y = ((clientY - top) / height - 0.5) * 24;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  // Heading split into words for masked stagger reveal
  const headingWords = [
    { text: 'From', isAccent: false },
    { text: 'one', isAccent: false },
    { text: 'spark', isAccent: false },
    { text: 'to', isAccent: false },
    { text: 'a', isAccent: false },
    { text: 'full', isAccent: true },
    { text: 'production.', isAccent: true },
  ];

  const wordContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.15,
      },
    },
  };

  const wordVariants = {
    hidden: { y: '105%', opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.85,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div className="relative h-screen w-full select-none">
      <motion.div
        style={{
          scale: shouldReduceMotion ? 1 : scale,
          opacity: shouldReduceMotion ? 1 : opacity,
          filter: shouldReduceMotion ? 'none' : filter,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full h-full pt-20 sm:pt-24 lg:pt-28 pb-3 sm:pb-5 px-3 sm:px-6 lg:px-8 flex flex-col justify-between overflow-hidden"
      >
        <div className="relative w-full h-full rounded-[28px] sm:rounded-[36px] overflow-hidden bg-[#0B0A14] text-[#F3F2F8] shadow-2xl flex flex-col justify-between p-6 sm:p-10 md:p-14 lg:p-16 border border-white/10">
          {/* Background Orbit Image with Mouse Parallax & Idle Float */}
          <motion.div
            initial={{ scale: 1.08 }}
            animate={{
              scale: 1,
              x: shouldReduceMotion ? 0 : mouseOffset.x * 0.7,
              y: shouldReduceMotion ? 0 : mouseOffset.y * 0.7,
            }}
            transition={{
              scale: { duration: 1.4, ease: [0.22, 1, 0.36, 1] },
              x: { type: 'spring', damping: 25, stiffness: 100 },
              y: { type: 'spring', damping: 25, stiffness: 100 },
            }}
            className="absolute inset-0 pointer-events-none z-0"
          >
            <motion.img
              src="/hero-orbit.png"
              alt="Creative Hub Orbit"
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      y: [0, -8, 0],
                    }
              }
              transition={{
                duration: 9,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-full h-full object-cover object-[70%_center] md:object-[78%_center] lg:object-[82%_center] select-none"
            />
          </motion.div>

          {/* Left-to-Right Dark Gradient Scrim for Legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0A14] via-[#0B0A14]/85 to-transparent z-[1] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A14]/90 via-transparent to-black/20 z-[1] pointer-events-none" />

          {/* Faint Grain Overlay */}
          <div className="landing-grain absolute inset-0 opacity-40 z-[2] pointer-events-none" />

          {/* Subtle cursor-follow glow */}
          {!shouldReduceMotion && (
            <div
              className="absolute pointer-events-none z-[2] w-[450px] h-[450px] rounded-full blur-[100px] bg-accent/15 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-out"
              style={{
                left: `calc(50% + ${mouseOffset.x * 12}px)`,
                top: `calc(40% + ${mouseOffset.y * 12}px)`,
              }}
            />
          )}

          {/* Top spacer */}
          <div className="relative z-10 h-2" />

          {/* Main Hero Content — Left Aligned Only, Generous Whitespace */}
          <div className="relative z-10 max-w-2xl lg:max-w-3xl my-auto">
            {/* H1 with Masked Word Stagger */}
            <motion.h1
              variants={wordContainerVariants}
              initial="hidden"
              animate="visible"
              className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-[84px] xl:text-[92px] font-medium tracking-[-0.04em] leading-[0.96] text-white flex flex-wrap gap-x-2.5 sm:gap-x-3.5 gap-y-1 sm:gap-y-2"
            >
              {headingWords.map((word, i) => (
                <span key={i} className="inline-block overflow-hidden pb-1">
                  <motion.span
                    variants={wordVariants}
                    className={`inline-block ${
                      word.isAccent
                        ? 'font-landing-serif italic text-accent font-normal text-[1.14em] tracking-tight'
                        : ''
                    }`}
                  >
                    {word.text}
                  </motion.span>
                </span>
              ))}
            </motion.h1>

            {/* Subcopy */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-[#B3B2C2] max-w-xl font-normal leading-relaxed"
            >
              Five AI agents write, design and score your film, game or podcast.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4 sm:gap-6"
            >
              <MagneticButton
                onClick={onEnterStudio}
                className="!bg-accent !text-white !px-7 !py-4 shadow-xl hover:shadow-accent/25"
              >
                <span className="text-sm sm:text-base font-medium">Launch Studio</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform duration-300" />
              </MagneticButton>

              <button
                onClick={onExploreClick}
                className="group inline-flex items-center gap-2 text-sm sm:text-base font-medium text-white/80 hover:text-white transition-colors py-2 outline-none"
              >
                <span>See how it works</span>
                <ArrowRight className="w-4 h-4 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
              </button>
            </motion.div>
          </div>

          {/* Bottom Scroll Indicator */}
          <div className="relative z-10 flex items-center justify-between pt-4">
            <div className="flex items-center gap-2 text-white/40">
              <span className="font-landing-mono text-[11px] tracking-wider uppercase">Scroll to explore</span>
            </div>

            <motion.button
              onClick={onExploreClick}
              aria-label="Scroll down"
              animate={shouldReduceMotion ? {} : { y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-7 h-10 rounded-full border border-white/20 flex items-start justify-center p-1.5 opacity-60 hover:opacity-100 transition-opacity"
            >
              <div className="w-1 h-2 rounded-full bg-white/70" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
