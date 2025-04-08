// tailwind.config.js (Root - can be left minimal or define shared theme)
/** @type {import('tailwindcss').Config} */
module.exports = {
    // Content will be defined in each app's config, pointing to its specific files
    content: [],
    theme: {
      extend: {
        // Define shared theme extensions here if needed (e.g., custom colors, fonts)
        // colors: {
        //   brand: {
        //     primary: '#...',
        //     secondary: '#...',
        //   },
        // },
      },
    },
    plugins: [
      // Add any global Tailwind plugins here (e.g., @tailwindcss/forms)
    ],
  };