import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Semantic Apple/VeriQ Surface Colors
        veriq: {
          bg: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          surface: 'var(--bg-surface)',
          card: 'var(--bg-card)',
          subtle: 'var(--bg-subtle)',
          border: 'var(--border-primary)',
          'border-subtle': 'var(--border-secondary)',
          text: 'var(--text-primary)',
          muted: 'var(--text-secondary)',
        },
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#172554',
          DEFAULT: '#2563eb',
        },
        security: {
          verified: '#10b981',
          warning: '#f59e0b',
          critical: '#ef4444',
          info: '#2563eb',
          neutral: '#6b7280',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      boxShadow: {
        subtle: 'var(--shadow-subtle)',
        card: 'var(--shadow-card)',
        hover: 'var(--shadow-hover)',
        elevated: 'var(--shadow-elevated)',
      }
    },
  },
  plugins: [],
} satisfies Config;
