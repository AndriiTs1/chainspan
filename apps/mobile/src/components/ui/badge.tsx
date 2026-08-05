import { StyleSheet, View } from 'react-native';

import { Colors, Radius, Spacing } from '@/constants/theme';
import { AppText } from './app-text';

type BadgeTone = 'neutral' | 'success' | 'caution' | 'danger' | 'brand';

type BadgeProps = {
  label: string;
  tone?: BadgeTone;
};

const toneColors: Record<BadgeTone, { bg: string; border: string; text: string }> = {
  neutral: { bg: 'rgba(255,255,255,0.06)', border: Colors.border, text: Colors.textSecondary },
  success: { bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)', text: Colors.success },
  caution: { bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)', text: Colors.caution },
  danger: { bg: 'rgba(248,113,113,0.06)', border: 'rgba(248,113,113,0.1)', text: Colors.danger },
  brand: { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)', text: Colors.brandBlue },
};

export function Badge({ label, tone = 'neutral' }: BadgeProps) {
  const colors = toneColors[tone];

  return (
    <View
      style={[styles.badge, { backgroundColor: colors.bg, borderColor: colors.border }]}
      accessibilityRole="text">
      <AppText style={[styles.label, { color: colors.text }]}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing[10],
    paddingVertical: Spacing[4],
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
  },
});
