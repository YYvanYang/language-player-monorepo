// apps/user-app/tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  // Relative paths from THIS file to where Tailwind classes are used
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./_components/**/*.{js,ts,jsx,tsx,mdx}", // Add components
    "./_hooks/**/*.{js,ts,jsx,tsx,mdx}", // Add hooks
    "./_context/**/*.{js,ts,jsx,tsx,mdx}", // Add context
    "./_stores/**/*.{js,ts,jsx,tsx,mdx}", // Add stores
    // Add other _ directories if they contain Tailwind classes
  ],
  theme: {
    extend: {
      // Add app-specific theme extensions here
      // Or extend a base theme if you create one in the root or packages/ui
      backgroundImage: { // Example from create-next-app
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;