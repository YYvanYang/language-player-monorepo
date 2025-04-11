// postcss.config.mjs (Root)
// Minimal config, apps/packages might have their own or extend this implicitly via Next.js
const config = {
    plugins: {
      tailwindcss: {}, // Enable Tailwind
      autoprefixer: {}, // Add vendor prefixes
    },
};

export default config;