import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        "primary-teal": "#30CFC0",
        "seconday-blue": "#A8D5E2",
        "tertiary-navy": "#2E3A59",
        "quaternary-grey": "#F2F2F2",
      },
      fontFamily: {
        sans: ["var(--lato)", "sans"],
      },
    },
  },
  plugins: [require("daisyui")],
}
export default config
