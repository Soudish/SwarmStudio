/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: {
          DEFAULT: 'var(--surface)',
          muted: 'var(--surface-muted)',
        },
        border: {
          DEFAULT: 'var(--border)',
          hover: 'var(--border-hover)',
        },
        text1: 'var(--text-1)',
        text2: 'var(--text-2)',
        text3: 'var(--text-3)',
        accent: {
          DEFAULT: 'var(--accent)',
          tint: 'var(--accent-tint)',
          text: 'var(--accent-text)',
        },
        'hero-dark': 'var(--hero-dark)',
        agent: {
          research: '#06B6D4',
          story: '#D946EF',
          visual: '#F59E0B',
          audio: '#10B981',
          critic: '#6366F1',
        },
      },
      borderRadius: {
        card: '20px',
        hero: '28px',
        btn: '9999px',
        input: '12px',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        tight: '-0.03em',
        label: '0.08em',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'shimmer': 'shimmer 2s infinite linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
