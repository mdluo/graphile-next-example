module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      sm: '576px',
      // => @media (min-width: 576px) { ... }

      md: '768px',
      // => @media (min-width: 960px) { ... }

      lg: '960px',
      // => @media (min-width: 1440px) { ... }
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
