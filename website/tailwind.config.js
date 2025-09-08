const defaultTheme = require('tailwindcss/defaultTheme');
const rootTailWindConfig = require('../tailwind.config.cjs');

module.exports = {
  content: ['./docusaurus.config.js', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  important: true,
  theme: {
    extend: {
      // share same color palette of Podman Desktop UI
      colors: rootTailWindConfig.theme.colors,
      backgroundImage: {
        'hero-pattern': 'url(/img/gradients.png)',
      },
      fontFamily: {
        sans: ['Montserrat', ...defaultTheme.fontFamily.sans],
      },
      extend: {},
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        'float-slow': 'float 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
