/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#e29656',
          orange: '#D48D3B',
          green: '#3E9242',
        },
        secondary: '#282828',
        'gray-200': '#EAECF0',
        'gray-300': 'D0D5DD',
        'gray-500': '#667085',
        'gray-600': '#475467',
        'gray-700': '#344054',
        'gray-900': '#101828',
        'white-100': '#F4F4F4',
        'white-200': '#EDF0F8',
        'black-100': '#3D4258',
        'neutral-black': '#23263B',
        dark: {
          background: '#0D001A',
          foreground: '#ffffff',
          primary: {
            50: '#3B096C',
            100: '#520F83',
            200: '#7318A2',
            300: '#9823C2',
            400: '#c031e2',
            500: '#DD62ED',
            600: '#F182F6',
            700: '#FCADF9',
            800: '#FDD5F9',
            900: '#FEECFE',
            DEFAULT: '#DD62ED',
            foreground: '#ffffff',
          },
          focus: '#F182F6',
        },
        boxShadow: {
          xs: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
        },
        maxWidth: {
          '10xl': '1440px',
        },
        fontFamily: {
          inter: ['Inter', 'sans-serif'],
          spaceGrotesk: ['Space Grotesk', 'sans-serif'],
        },
        borderRadius: {
          10: '10px',
        },
      },
    },
  },
  plugins: [],
};
