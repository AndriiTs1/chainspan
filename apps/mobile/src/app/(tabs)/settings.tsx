import Constants from 'expo-constants';
import { SymbolView } from 'expo-symbols';
import type { AndroidSymbol, SFSymbol } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Colors, IconSize, MinTouchTarget, Spacing } from '@/constants/theme';

type SettingsRowProps = {
  label: string;
  sf: SFSymbol;
  md: AndroidSymbol;
  value?: string;
};

// Every row is disabled - Appearance/Networks/About/Developer have nothing
// real to show yet (depend on later stages), and Version already shows real
// data but isn't something you "open". Structured as a real settings list
// (icon + label + trailing value/chevron) rather than plain disabled text.
function SettingsRow({ label, sf, md, value }: SettingsRowProps) {
  return (
    <Pressable
      disabled
      accessibilityRole="button"
      accessibilityLabel={value ? `${label}, ${value}` : label}
      accessibilityState={{ disabled: true }}
      style={styles.row}>
      <View style={styles.rowLeft}>
        <SymbolView name={{ ios: sf, android: md, web: md }} size={IconSize.md} tintColor={Colors.textSecondary} />
        <AppText variant="body">{label}</AppText>
      </View>

      {value ? (
        <AppText variant="body" color="muted">
          {value}
        </AppText>
      ) : (
        <SymbolView
          name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
          size={IconSize.sm}
          tintColor={Colors.textMuted}
        />
      )}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const version = Constants.expoConfig?.version ?? 'unknown';

  return (
    <Screen>
      <AppText variant="heading">Settings</AppText>

      <Card style={styles.list}>
        <SettingsRow label="Appearance" sf="paintpalette" md="palette" />
        <View style={styles.divider} />
        <SettingsRow label="Networks" sf="network" md="hub" />
        <View style={styles.divider} />
        <SettingsRow label="About" sf="info.circle" md="info" />
        <View style={styles.divider} />
        <SettingsRow label="Developer" sf="chevron.left.forwardslash.chevron.right" md="code" />
        <View style={styles.divider} />
        <SettingsRow label="Version" sf="tag" md="sell" value={version} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: MinTouchTarget,
    paddingHorizontal: Spacing[16],
    paddingVertical: Spacing[12],
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[12],
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing[16],
  },
});
