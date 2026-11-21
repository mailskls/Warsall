/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F2F4F8',
        card: '#FFFFFF',
        ink: {
          900: '#1E293B',
          700: '#334155',
          500: '#64748B',
          400: '#94A3B8',
        },
        lavender: '#E5E9F2',
        brand: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          400: '#3B82F6',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
        gold: {
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,23,42,0.04), 0 4px 12px rgba(15,23,42,0.05)',
        'card-hover': '0 2px 4px rgba(15,23,42,0.06), 0 10px 24px rgba(15,23,42,0.08)',
        pop: '0 8px 30px rgba(37,99,235,0.18)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.22,1,0.36,1)',
        'slide-right': 'slideRight 0.3s cubic-bezier(0.22,1,0.36,1)',
        'pop-in': 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        'bubble-grow': 'bubbleGrow 0.2s ease-out',
        'shake': 'shake 0.5s ease-in-out',
        'spin-slow': 'spin 1.2s linear infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(14px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        popIn: {
          '0%': { transform: 'scale(0.5)', opacity: 0 },
          '60%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        bubbleGrow: {
          '0%': { transform: 'scale(0.6)' },
          '100%': { transform: 'scale(1)' },
        },
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-6px) rotate(-2deg)' },
          '75%': { transform: 'translateX(6px) rotate(2deg)' },
        },
        pulseSoft: {
          '0%,100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
      },
    },
  },
  plugins: [],
};
