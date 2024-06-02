const { nextui } = require('@nextui-org/react');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      sans: ['Poppins'],
      serif: ['Noto Sans'],
      display: ['Poppins'],
    },
    container: {
      center: true,
      padding: '0rem',
      screens: {
        sm: '400px',
        xl: '1680px',
        '2xl': '2200px',
      },
    },
    extend: {
      animation: {
        'background-pan': 'background-pan 3s ease-in-out infinite',
      },
      keyframes: {
        'background-pan': {
          '0%': { backgroundPosition: '100% 50%' },
          '50%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
      },
      colors: {
        danger: {
          DEFAULT: '#b61920',
          // foreground: "#000000",
        },
        secondary: {
          DEFAULT: '#ccdfff',
        },

        green: {
          50: '#30AF5B',
          90: '#292C27',
        },
        gray: {
          10: '#EEEEEE',
          20: '#A2A2A2',
          30: '#7B7B7B',
          50: '#585858',
          90: '#141414',
        },
        orange: {
          50: '#FF814C',
        },
        blue: {
          70: '#021639',
        },
        yellow: {
          50: '#FEC601',
        },
        red: {
          50: '#b61920',
        },
      },
      border: 'hsl(var(--border))',
      input: 'hsl(var(--input))',
      ring: 'hsl(var(--ring))',
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))',
      },
      secondary: {
        DEFAULT: 'hsl(var(--secondary))',
        foreground: 'hsl(var(--secondary-foreground))',
      },
      destructive: {
        DEFAULT: 'hsl(var(--destructive))',
        foreground: 'hsl(var(--destructive-foreground))',
      },
      muted: {
        DEFAULT: 'hsl(var(--muted))',
        foreground: 'hsl(var(--muted-foreground))',
      },
      accent: {
        DEFAULT: 'hsl(var(--accent))',
        foreground: 'hsl(var(--accent-foreground))',
      },
      popover: {
        DEFAULT: 'hsl(var(--popover))',
        foreground: 'hsl(var(--popover-foreground))',
      },
      card: {
        DEFAULT: 'hsl(var(--card))',
        foreground: 'hsl(var(--card-foreground))',
      },
      transitionProperty: {
        'width': 'width',
      }
    },
  },
  darkMode: 'class',
  plugins: [require('tailwindcss-animate'), nextui()],
};
