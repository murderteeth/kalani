import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'
import Theme from 'tailwindcss/defaultTheme'

const config = {
  darkMode: ['class'],
  prefix: '',
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  safelist: [
    'scrollbar-thumb-pink-500'
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        primary: {
          ...colors.orange, 
          '1000': '#170602'
        },
        secondary: colors.violet
      },

      width: {
        'field-btn': '8rem',
      },

      height: {
        'field-btn': '54px',
      },

      borderRadius: {
        primary: Theme.borderRadius.xl
      },

      dropShadow: {
				'fancy': [
					'0 0 16px rgba(255, 255, 255, 0.16)',
					'0 0 4px rgba(255, 255, 255, 0.1)'
				]
			},

      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },

      animation: {
        'atmospheric-pulse': 'pulse 30s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'accordion-down': 'accordion-down 0.1s ease-out',
        'accordion-up': 'accordion-up 0s ease-out',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate')
  ],
} satisfies Config

export default config
