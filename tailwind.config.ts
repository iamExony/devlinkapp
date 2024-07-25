import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#FAFAFA',
        'gray': '#D9D9D9',
        'dark-gray': '#737373',
        'light-gray': '#EFEBFF',
        'error': '#FF3939',
        'dark': '#333333',
        'light-blue': '#BEADFF',
        'blue': '#633CFF',
      },
    },
  },
  plugins: [],
};
export default config;
