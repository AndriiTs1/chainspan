import { Pressable, StyleSheet } from 'react-native';
import type { PressableProps } from 'react-native';

import { Colors, MinTouchTarget, Radius, Spacing } from '@/constants/theme';
import { AppText } from './app-text';

type PrimaryButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
};

// Solid brand blue, not the blue->violet gradient used on Web - RN has no
// native gradient support without an extra dependency (expo-linear-gradient),
// which isn't justified for a foundation-stage placeholder button. The
// gradient treatment is deliberately deferred to Stage 8.7 Polish.
export function PrimaryButton({ label, disabled, ...rest }: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: Boolean(disabled) }}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
      {...rest}>
      <AppText style={styles.label}>{label}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: MinTouchTarget,
    borderRadius: Radius.lg,
    backgroundColor: Colors.brandBlue,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing[24],
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
});
