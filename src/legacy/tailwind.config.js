import { addDynamicIconSelectors } from '@iconify/tailwind'
import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: ['./*.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [typography, addDynamicIconSelectors()],
}
