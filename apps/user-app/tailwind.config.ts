// apps/user-app/tailwind.config.ts
import type { Config } from "tailwindcss";
// import baseConfig from '../../tailwind.config.js'; // Example if root config exists

const config: Config = {
  // presets: [baseConfig], // Extend base config if needed
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./_components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}", // Include shared UI package
  ],
  darkMode: "class", // Or 'media'
  theme: {
    container: { // Optional: Center container by default
        center: true,
        padding: {
            DEFAULT: '1rem',
            sm: '1.5rem',
            lg: '2rem',
        },
    },
    extend: {
       // Add app-specific theme extensions here
       colors: {
         // Re-declare shadcn/ui-like variables if needed, or define directly
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
        borderRadius: {
         lg: `var(--radius)`,
         md: `calc(var(--radius) - 2px)`,
         sm: "calc(var(--radius) - 4px)",
       },
      // Add other extensions
      keyframes: { // Needed for shadcn/ui components often
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" }, },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" }, },
      },
      animation: { // Needed for shadcn/ui components often
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
      // require("tailwindcss-animate"), // If using animations
      require('@tailwindcss/typography'), // If using prose class for markdown/descriptions
  ],
};
export default config;