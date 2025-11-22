/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#edf7ff',
          100: '#d7ecff',
          200: '#b2daff',
          300: '#7cc1ff',
          400: '#3fa2ff',
          500: '#1c7fe6',
          600: '#0d61c2',
          700: '#0a4da0',
          800: '#0c4081',
          900: '#0f3568',
        },
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5f5',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      boxShadow: {
        soft: '0 10px 25px -5px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};

