// apps/admin-panel/tailwind.config.ts
import type { Config } from "tailwindcss";
// Import base config to potentially extend (optional with v4 if base has little)
// import baseConfig from '../../tailwind.config';

const config: Config = {
  // Inherit darkMode, plugins from base or define explicitly
  darkMode: "class",
  content: [ // Define content paths specific to this app
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./_components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}", // Include shared UI
  ],
  theme: {
    // Theme customizations are now primarily in app/globals.css or packages/ui/src/globals.css via @theme
    // You might extend base container settings or add app-specific structural extensions here if needed.
    // Example: Extending the base container settings (if baseConfig is imported)
    // container: {
    //     ...baseConfig.theme?.container, // Spread base settings
    //     screens: { // Override screens for admin panel if needed
    //         sm: '640px',
    //         md: '768px',
    //         lg: '1024px',
    //         xl: '1280px',
    //         '2xl': '1536px', // Add larger screen for admin
    //     },
    // },
    extend: {
        // Extend from base if needed: ...baseConfig.theme?.extend,
        // Add admin-panel specific *structural* extensions here (rarely needed with v4)
        // Colors, fonts, spacing etc. go in CSS @theme.
    },
  },
  plugins: [
      // Inherit plugins from base or add admin-specific ones
      // require("tailwindcss-animate"),
      require('@tailwindcss/typography'),
  ],
};
export default config;