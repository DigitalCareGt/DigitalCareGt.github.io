/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: '#111312',
          900: '#171a18',
          850: '#1e2420',
          800: '#263029',
        },
        care: {
          50: '#effaf7',
          200: '#b9e4d9',
          500: '#4fae98',
          600: '#3f927f',
          700: '#2e6f61',
        },
        paper: '#f7f6f1',
      },
      fontFamily: {
        sans: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        display: ['"Exo 2"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        diffusion: '0 24px 70px -36px rgba(17, 19, 18, 0.55)',
        insetline: 'inset 0 1px 0 rgba(255,255,255,0.16)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -10px, 0)' },
        },
        scan: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        reveal: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        scan: 'scan 2.8s ease-in-out infinite',
        reveal: 'reveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
};
