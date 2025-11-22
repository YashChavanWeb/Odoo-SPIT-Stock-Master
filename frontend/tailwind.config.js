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
          50: '#fffbea',
          100: '#fff3b8',
          200: '#ffeb85',
          300: '#ffe053',
          400: '#ffd622',
          500: '#FFD700',
          600: '#e6c200',
          700: '#bfa100',
          800: '#998000',
          900: '#7d6600',
        },
        // NEUTRAL COLORS FOR BG / TEXT
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
