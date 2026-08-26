/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#F5A623',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        secondary: 'var(--secondary)',
        destructive: 'var(--destructive)',
        'muted-foreground': 'var(--muted-foreground)',
        border: 'var(--border)',
        cyron: {
          amber: '#F5A623',
          charcoal: '#070707',
        },
        bg: {
          base: '#070707',
          card: 'rgba(255,255,255,0.04)',
        },
        text: {
          primary: '#f4f4f5',
          muted: '#a1a1aa',
        },
      },
      boxShadow: {
        soft: '0 4px 16px rgba(0, 0, 0, 0.35)',
        glow: '0 0 28px rgba(245, 166, 35, 0.25)',
      },
      borderRadius: {
        xl: '1rem',
      },
      fontFamily: {
        sans: ['Sora', '"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', '"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      borderColor: {
        border: 'var(--border)',
      },
    },
  },
  plugins: [],
};

