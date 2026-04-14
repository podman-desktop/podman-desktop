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
        'float-diagonal': {
          '0%, 100%': { transform: 'translate(0,0)' },
          '50%': { transform: 'translate(3px, -7px)' },
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        'float-diagonal': 'float-diagonal 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
