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
        night: {
          800: "#0f172a",
          900: "#0b1220",
          950: "#060a12",
        },
        frost: {
          300: "#a5d8ff",
          400: "#74c0fc",
        },
      },
    },
  },
  plugins: [],
};
export default config;
