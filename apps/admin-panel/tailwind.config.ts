// apps/admin-panel/tailwind.config.ts
import type { Config } from "tailwindcss";
// Optionally import shared theme config if you create one
// import baseConfig from '../../tailwind.config.js'; // Example if root config exists

const config: Config = {
  // Merge with base config if it exists
  // presets: [baseConfig],

  // Paths specific to the admin-panel app
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./_components/**/*.{js,ts,jsx,tsx,mdx}",
    // Include path to shared UI package if its components use Tailwind classes
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // Or 'media'
  theme: {
    extend: {
      // Add admin-panel specific theme overrides or extensions here
      colors: {
         // Example: Define shadcn/ui-like variables if using compatible components
         border: "hsl(var(--border))",
         input: "hsl(var(--input))",
         ring: "hsl(var(--ring))",
         background: "hsl(var(--background))",
         foreground: "hsl(var(--foreground))",
         primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
         secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
         destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
         muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
         accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
         popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
         card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
      },
       borderRadius: { // Example override
         lg: `var(--radius)`,
         md: `calc(var(--radius) - 2px)`,
         sm: "calc(var(--radius) - 4px)",
       },
      // ... other extensions
    },
  },
  plugins: [
      // Add any Tailwind plugins used specifically in the admin panel
      // require("tailwindcss-animate") // If using animations
  ],
};
export default config;