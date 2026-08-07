// expo-router requires a platform-suffix-free fallback file to exist inside
// src/app whenever .native.tsx/.web.tsx siblings are present (unlike files
// outside src/app, e.g. providers/hooks, where the suffix-only pair is
// enough). Every real target (ios/android via .native, web via .web) is
// already covered by a more specific match, so this file itself is never
// actually selected by Metro at runtime - it only satisfies that check.
export { default } from './_layout.native';
