module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        glass: 'rgba(30, 41, 59, 0.5)',
        accent: '#38bdf8',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
