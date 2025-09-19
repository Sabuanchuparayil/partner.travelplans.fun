/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    {
      pattern: /bg-(blue|sky|teal|purple|green|yellow|cyan|indigo)-100/,
    },
    {
      pattern: /border-(blue|sky|teal|purple|green|yellow|cyan|indigo)-500/,
    },
    {
      pattern: /text-(blue|sky|teal|purple|green|yellow|cyan|indigo)-800/,
    },
    {
        pattern: /text-(blue|sky|teal|purple|green|yellow|cyan|indigo)-500/,
    },
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Amaranth', 'sans-serif'],
      },
      colors: {
        primary: '#00A9E0', // New theme blue from logo
        'primary-dark': '#0087B3',
        secondary: '#8CC63F', // New theme green from logo
        accent: '#F7941D', // New theme orange from logo
        sidebar: '#F9FAFB', // Light gray for new sidebar theme
        'sidebar-accent': '#E5E7EB', // Slightly darker for hover/active
      },
      keyframes: {
        'toast-in': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      animation: {
        'toast-in': 'toast-in 0.5s ease-out forwards',
      }
    }
  },
  plugins: [],
}
