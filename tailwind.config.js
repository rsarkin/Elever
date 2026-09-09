/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light Sand Palette
        sand: {
          50: '#FDFBF7',
          100: '#F7F2E8',
          150: '#F0E8D9',
          200: '#E6DABF',
          300: '#D6C5A5',
          400: '#B8A381',
          500: '#948060',
          600: '#756345',
          700: '#574831',
          800: '#3D3220',
          850: '#FFFFFF', // Crisp White card surfaces
          900: '#211B10', // Dark Espresso Text
          950: '#141009',
        },
        // Backward-compatible alias mapping to light sand
        oceanic: {
          950: '#FFFFFF',
          900: '#F7F2E8',
          850: '#FFFFFF',
          800: '#F0E8D9',
          700: '#E6DABF',
          600: '#D6C5A5',
          500: '#756345',
        },
        // Suitable Marine Blue Accent (Light Mode)
        marine: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0284C7',
          600: '#0369A1',
          700: '#075985',
          800: '#0C4A6E',
        },
        sky: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0284C7',
          600: '#0369A1',
          700: '#075985',
          800: '#0C4A6E',
        },
        cyan: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0284C7',
          600: '#0369A1',
          700: '#075985',
        },
        // Soft Pastel Green Palette
        pastel: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
        },
        emerald: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
