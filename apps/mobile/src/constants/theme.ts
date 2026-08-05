import '@/global.css';

import { Platform } from 'react-native';

// ChainSpan mobile is dark-only for Stage 8.1, matching the already-shipped
// Web v1.0 visual language. There is no light variant - see the Stage 8.1
// architecture doc for the (still open) light/dark decision.
export const Colors = {
  background: '#02040a',
  surface: '#080d19',
  surfaceElevated: '#070b14',
  border: 'rgba(255, 255, 255, 0.08)',
  borderBrand: 'rgba(147, 197, 253, 0.15)',
  textPrimary: '#ffffff',
  textSecondary: '#a1a1aa',
  textMuted: '#71717a',
  brandBlue: '#3b82f6',
  brandViolet: '#7c3aed',
  success: '#34d399',
  caution: '#fbbf24',
  danger: '#f87171',
} as const;

export type ColorToken = keyof typeof Colors;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    mono: 'var(--font-mono)',
  },
});

// 4px base unit - the same scale already implicitly in use across Web
// (Tailwind's default spacing), formalized here as the shared spec.
export const Spacing = {
  2: 2,
  4: 4,
  6: 6,
  8: 8,
  10: 10,
  12: 12,
  16: 16,
  20: 20,
  24: 24,
  32: 32,
  40: 40,
  48: 48,
} as const;

export const Radius = {
  md: 6,
  lg: 8,
  xl: 12,
  xxl: 16,
  full: 9999,
} as const;

export const IconSize = {
  sm: 16,
  md: 20,
  lg: 24,
} as const;

// Duration only - easing is applied by each animation call site (Reanimated
// doesn't have a single global "MotionConfig" equivalent). No animations are
// needed for Stage 8.1 itself; these exist so later stages share one scale
// instead of inventing per-screen numbers.
export const Motion = {
  fast: 150,
  base: 200,
  slow: 300,
} as const;

export const MinTouchTarget = 44;
