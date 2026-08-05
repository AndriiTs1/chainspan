import { StyleSheet, Text } from 'react-native';
import type { TextProps } from 'react-native';

import { Colors, Fonts } from '@/constants/theme';

type AppTextVariant = 'display' | 'heading' | 'body' | 'caption' | 'mono';
type AppTextColor = 'primary' | 'secondary' | 'muted';

type AppTextProps = TextProps & {
  variant?: AppTextVariant;
  color?: AppTextColor;
};

const colorMap: Record<AppTextColor, string> = {
  primary: Colors.textPrimary,
  secondary: Colors.textSecondary,
  muted: Colors.textMuted,
};

// Five tiers, matching the Typography section of the Stage 8.1 architecture
// doc. Only `mono` sets an explicit fontFamily - the rest rely on the OS
// default system font. Loading Geist to match Web exactly is a deliberately
// open, later decision (not resolved by this foundation stage).
export function AppText({ variant = 'body', color = 'primary', style, ...rest }: AppTextProps) {
  return <Text style={[{ color: colorMap[color] }, variantStyles[variant], style]} {...rest} />;
}

const variantStyles = StyleSheet.create({
  display: {
    fontSize: 40,
    fontWeight: '700',
    lineHeight: 46,
    letterSpacing: -0.5,
  },
  heading: {
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  mono: {
    fontFamily: Fonts?.mono,
    fontSize: 13,
    lineHeight: 18,
  },
});
