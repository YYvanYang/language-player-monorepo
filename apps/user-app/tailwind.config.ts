// apps/user-app/tailwind.config.ts
import type { Config } from "tailwindcss";

// Removed theme and container definitions as they belong in CSS (@repo/ui/src/globals.css)
const config: Pick<Config, "content" | "darkMode" | "plugins"> = {
  darkMode: "class",
  content: [ // Define content paths specific to this app
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./_components/**/*.{js,ts,jsx,tsx,mdx}",
    // IMPORTANT: Include path to shared UI package
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  // Removed 'theme' block - customizations go in packages/ui/src/globals.css @theme
  plugins: [
      // Define app-specific plugins here
      require('@tailwindcss/typography'),
  ],
};
export default config;