export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: '#2E4D3D',
        moss: '#527F5B',
        leaf: '#A3C9A8',
        mist: '#DCEAD9',
        cream: '#F7F7F2',
        rust: { DEFAULT: '#9B3F36', soft: '#F2DAD6' },
        sand: { DEFAULT: '#6F5710', soft: '#F1E8C6' },
      },
      fontFamily: {
        heading: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        body: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
      },
    },
  },
};
