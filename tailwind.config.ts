import type { Config } from 'tailwindcss'

const defaultTheme = require('tailwindcss/defaultTheme')

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
          'game': "url('/background.png')",
          'game1': "url('/background1.png')",
          'game2': "url('/background2.png')",
      },
    },
    screens: {
      'xse': {'max': '400px'},
      'xsm': {'min': '475px'},
      'xb': {'max': '520px'},
      ...defaultTheme.screens,
    },
  },
  plugins: [],
}
export default config
