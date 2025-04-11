// tailwind.config.ts (Root)
import type { Config } from 'tailwindcss';

// Define base configurations or themes reusable across apps/packages
const config: Omit<Config, "content"> = { // Omit content, it's app-specific
  darkMode: "class", // Or 'media' if preferred
  theme: {
    container: { // Basic container setup (optional)
        center: true,
        padding: {
            DEFAULT: '1rem',
            sm: '1.5rem',
            lg: '2rem',
        },
        screens: { // Optional: define container max widths
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
        },
    },
    extend: {
       // Define shared theme extensions (colors, fonts, etc.)
       // Example using CSS variables for shadcn/ui compatibility
       colors: {
         border: 'hsl(var(--border))',
         input: 'hsl(var(--input))',
         ring: 'hsl(var(--ring))',
         background: 'hsl(var(--background))',
         foreground: 'hsl(var(--foreground))',
         primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
         secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
         destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
         muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
         accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
         popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
         card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
       },
        borderRadius: {
         lg: `var(--radius)`,
         md: `calc(var(--radius) - 2px)`,
         sm: "calc(var(--radius) - 4px)",
       },
       keyframes: {
         "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" }, },
         "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" }, },
       },
       animation: {
         "accordion-down": "accordion-down 0.2s ease-out",
         "accordion-up": "accordion-up 0.2s ease-out",
       },
    },
  },
  plugins: [
     // require("tailwindcss-animate"), // Add if using animations
      require('@tailwindcss/typography'), // Add if using prose class
  ],
};
export default config;