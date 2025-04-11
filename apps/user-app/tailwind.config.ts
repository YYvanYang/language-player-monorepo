// apps/user-app/tailwind.config.ts
import type { Config } from "tailwindcss";
// import baseConfig from '../../tailwind.config'; // Optional

const config: Config = {
  // Inherit darkMode, plugins from base or define explicitly
  darkMode: "class",
  content: [ // Define content paths specific to this app
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./_components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}", // Include shared UI
  ],
  theme: {
    // Theme customizations primarily in app/globals.css or packages/ui/src/globals.css via @theme
    // container: { // Extend base container if needed
    //   ...baseConfig.theme?.container,
    // },
    extend: {
        // Extend from base if needed: ...baseConfig.theme?.extend,
        // Add user-app specific *structural* extensions here
    },
  },
  plugins: [
    // Inherit plugins from base or add user-app-specific ones
    // require("tailwindcss-animate"),
    require('@tailwindcss/typography'),
  ],
};
export default config;