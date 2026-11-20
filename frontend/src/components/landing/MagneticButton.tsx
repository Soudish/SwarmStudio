import React, { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  strength?: number;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  strength = 8,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (shouldReduceMotion || !buttonRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const deltaX = (clientX - centerX) / (width / 2);
    const deltaY = (clientY - centerY) / (height / 2);

    setPosition({
      x: deltaX * strength,
      y: deltaY * strength,
    });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const baseStyles = 'group relative inline-flex items-center justify-center font-medium transition-colors select-none';
  
  const variantStyles = {
    primary:
      'rounded-full px-6 py-3.5 bg-accent text-white shadow-md hover:bg-accent/90 active:scale-[0.98]',
    secondary:
      'rounded-full px-6 py-3.5 bg-surface text-text1 border border-border hover:border-border-hover hover:bg-surface-muted active:scale-[0.98]',
    ghost:
      'px-4 py-2 text-text2 hover:text-text1 transition-colors',
  };

  return (
    <motion.button
      ref={buttonRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        x: shouldReduceMotion ? 0 : position.x,
        y: shouldReduceMotion ? 0 : position.y,
      }}
      transition={{
        type: 'spring',
        damping: 15,
        stiffness: 200,
        mass: 0.1,
      }}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
};
