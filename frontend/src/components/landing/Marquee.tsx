import React, { useRef } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from 'framer-motion';

export const Marquee: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  // Calculate velocity factor to reverse and speed up
  const velocityFactor = useTransform(smoothVelocity, [ -1000, 0, 1000 ], [ -3, 1, 3 ], {
    clamp: false,
  });

  const marqueeItems = [
    { text: 'Film', outline: false },
    { text: 'Game Narrative', outline: true },
    { text: 'Podcast', outline: false },
    { text: 'Screenplay', outline: true },
    { text: 'Soundtrack', outline: false },
    { text: 'Concept Art', outline: true },
  ];

  useAnimationFrame((t, delta) => {
    if (shouldReduceMotion) return;
    let moveBy = 0.03 * delta * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  // Wrap around percentage -50% to 0%
  const x = useTransform(baseX, (v) => `${(v % 50) - 50}%`);

  return (
    <section className="relative py-12 sm:py-16 md:py-20 overflow-hidden select-none border-y border-border/40 bg-surface/30">
      <div className="flex whitespace-nowrap overflow-hidden">
        <motion.div
          style={{ x: shouldReduceMotion ? '0%' : x }}
          className="flex items-center gap-8 sm:gap-12 shrink-0 will-change-transform"
        >
          {[0, 1, 2, 3].map((cycle) => (
            <React.Fragment key={cycle}>
              {marqueeItems.map((item, idx) => (
                <div key={`${cycle}-${idx}`} className="inline-flex items-center gap-8 sm:gap-12">
                  <span
                    className={`text-5xl sm:text-7xl md:text-8xl lg:text-[100px] font-semibold tracking-[-0.04em] uppercase transition-colors ${
                      item.outline
                        ? 'text-transparent [-webkit-text-stroke:1.5px_currentColor] text-text1/40 dark:text-white/35'
                        : 'text-text1 dark:text-white'
                    }`}
                  >
                    {item.text}
                  </span>

                  {/* Rotating Asterisk Separator */}
                  <span className="inline-block text-accent text-2xl sm:text-4xl animate-[spin_12s_linear_infinite] opacity-75">
                    ✦
                  </span>
                </div>
              ))}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
