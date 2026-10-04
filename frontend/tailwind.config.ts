import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary ocean blue from the TASFAM branding image
        ocean: {
          50: '#E6F4FA',
          100: '#CCE9F5',
          200: '#99D3EB',
          300: '#66BDE1',
          400: '#33A7D7',
          500: '#2196C8', // Main ocean blue from image
          600: '#1A78A0',
          700: '#145A78',
          800: '#0D3C50',
          900: '#071E28',
        },
        // Design system colors from spec
        ink: '#10333F',
        accent: '#0F766E',
        surface: '#F6F2EA',
        card: '#FFFFFF',
        hairline: '#DFD8C9',
        muted: '#5C6B72',
        'light-accent': '#8FD0C6',
        // Tanzanian flag colors (from logo)
        tanzania: {
          green: '#1EB53A',
          yellow: '#FCD116',
          black: '#000000',
          blue: '#00A3DD',
        },
      },
      fontFamily: {
        bitter: ['Bitter', 'Georgia', 'serif'],
        karla: ['Karla', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'ocean-gradient': 'linear-gradient(180deg, #2196C8 0%, #145A78 50%, #0D3C50 100%)',
        'hero-gradient': 'linear-gradient(90deg, #0A2530 0%, rgba(10,37,48,.82) 55%, rgba(10,37,48,.35) 100%)',
      },
    },
  },
  plugins: [],
}

export default config
