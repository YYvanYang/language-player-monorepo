// packages/ui/src/index.ts
// Ensure components intended for client-side use have 'use client' directive
// OR export them from specific client entry points if needed.
// For simplicity, assuming most UI components might need client context eventually.
// Add 'use client' here or individually in components.

import "./globals.css"; // Import base styles defined in this package

export * from './Button';
export * from './Card';
export * from './Spinner';
export * from './ErrorMessage';
export * from './Link';
export * from './Input';
export * from './Label';
export * from './Progress';
export * from './Select';
export * from './Textarea';
export * from './Checkbox';
export * from './Tooltip';
export * from './AlertDialog';
export * from './Badge';

// Add other UI component exports here...