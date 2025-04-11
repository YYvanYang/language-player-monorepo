// packages/eslint-config-custom/index.js
module.exports = {
    // Base configurations recommended for Next.js + TypeScript projects
    extends: [
      'eslint:recommended', // ESLint's recommended rules
      'plugin:@typescript-eslint/recommended', // Recommended TS rules
      'next/core-web-vitals', // Next.js specific rules + React hooks + Accessibility
      'plugin:tailwindcss/recommended', // Tailwind CSS specific rules (if using plugin)
      // 'prettier', // Add prettier if you want it to handle formatting rules, requires eslint-config-prettier
    ],
    parser: '@typescript-eslint/parser', // Use the TS parser
    plugins: [
      '@typescript-eslint',
      'tailwindcss', // Add plugin if used
    ],
    rules: {
      // Customize or override rules here
      '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_' }], // Warn on unused vars, allowing underscore prefix
      '@typescript-eslint/no-explicit-any': 'warn', // Warn against using 'any'
      'no-console': ['warn', { allow: ['warn', 'error'] }], // Warn on console.log/info/debug
      // Add specific Tailwind rules if needed
       "tailwindcss/no-custom-classname": "off", // Allow custom class names if needed
       "tailwindcss/classnames-order": "warn", // Suggest ordering Tailwind classes
       // Next.js specific overrides if needed
       "@next/next/no-img-element": "warn", // Suggest using next/image
    },
    // Ignore patterns if needed within this config
    ignorePatterns: [
      "node_modules/",
      ".next/",
      "out/",
      "dist/",
      "*.config.js", // Ignore JS config files at root of package
      "*.config.mjs",
    ],
    // Settings for plugins like react version
    settings: {
      react: {
        version: 'detect', // Automatically detect React version
      },
    },
     // Environment settings
     env: {
      browser: true,
      node: true,
      es2021: true,
    },
  };