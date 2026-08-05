import { supportedChains } from '@chainspan/web3';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import type { AndroidSymbol, SFSymbol } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Screen } from '@/components/ui/screen';
import { Colors, IconSize, Spacing } from '@/constants/theme';

function SectionLabel({ children }: { children: string }) {
  return (
    <AppText variant="caption" color="muted" style={styles.sectionLabel}>
      {children}
    </AppText>
  );
}

type QuickAction = {
  label: string;
  sf: SFSymbol;
  md: AndroidSymbol;
  onPress: () => void;
};

function QuickActionCard({ label, sf, md, onPress }: QuickAction) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.quickAction, pressed && styles.quickActionPressed]}>
      <SymbolView
        name={{ ios: sf, android: md, web: md }}
        size={IconSize.lg}
        tintColor={Colors.brandBlue}
      />
      <AppText variant="body" style={styles.quickActionLabel}>
        {label}
      </AppText>
    </Pressable>
  );
}

// Wallet Status / Portfolio Preview stay honest about being empty states -
// no fabricated balances or connection state. Quick Actions navigate to
// already-existing Stage 8.1 routes; none of them are wired to real Web3
// behavior yet (that starts in Stage 8.3).
export default function DashboardScreen() {
  const quickActions: QuickAction[] = [
    { label: 'Explorer', sf: 'magnifyingglass', md: 'search', onPress: () => router.push('/explorer') },
    { label: 'Sign Message', sf: 'signature', md: 'edit_square', onPress: () => router.push('/sign') },
    { label: 'Portfolio', sf: 'chart.pie', md: 'pie_chart', onPress: () => router.push('/portfolio') },
    { label: 'Wallet', sf: 'wallet.pass', md: 'account_balance_wallet', onPress: () => router.push('/wallet') },
  ];

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="caption" color="secondary">
          ChainSpan
        </AppText>
        <AppText variant="display">Dashboard</AppText>
        <AppText variant="body" color="secondary">
          Production Web3 Platform
        </AppText>
      </View>

      <Card style={styles.cardContent}>
        <View style={styles.rowCenter}>
          <SymbolView
            name={{ ios: 'wallet.pass', android: 'account_balance_wallet', web: 'account_balance_wallet' }}
            size={IconSize.lg}
            tintColor={Colors.textSecondary}
          />
          <AppText variant="heading">Wallet not connected</AppText>
        </View>
        <AppText variant="body" color="secondary">
          Wallet integration arrives in Stage 8.3.
        </AppText>
        <PrimaryButton label="Open Wallet" onPress={() => router.push('/wallet')} />
      </Card>

      <View style={styles.section}>
        <SectionLabel>Portfolio</SectionLabel>
        <Card style={styles.cardContent}>
          <AppText variant="body" color="secondary">
            Portfolio becomes available after wallet connection.
          </AppText>
          <PrimaryButton label="View Portfolio" onPress={() => router.push('/portfolio')} />
        </Card>
      </View>

      <View style={styles.section}>
        <SectionLabel>Quick Actions</SectionLabel>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <QuickActionCard key={action.label} {...action} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionLabel>Supported Networks</SectionLabel>
        <Card style={styles.cardContent}>
          <AppText variant="body" color="secondary">
            {supportedChains.length} EVM networks, shared with the Web app via @chainspan/web3.
          </AppText>
          <View style={styles.networkList}>
            {supportedChains.map((chain) => (
              <Badge key={chain.id} label={chain.name} tone="brand" />
            ))}
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <SectionLabel>About</SectionLabel>
        <Card style={styles.cardContent}>
          <AppText variant="heading">ChainSpan</AppText>
          <AppText variant="body" color="secondary">
            Web v1.0.0
          </AppText>
          <AppText variant="body" color="secondary">
            Mobile Foundation
          </AppText>
          <AppText variant="caption" color="muted">
            Powered by shared packages/web3
          </AppText>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing[4],
    marginBottom: Spacing[8],
  },
  section: {
    gap: Spacing[8],
  },
  sectionLabel: {
    paddingHorizontal: Spacing[4],
  },
  cardContent: {
    gap: Spacing[12],
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[10],
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[12],
  },
  quickAction: {
    flexBasis: '47%',
    flexGrow: 1,
    minHeight: 96,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderBrand,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[8],
    paddingVertical: Spacing[16],
  },
  quickActionPressed: {
    opacity: 0.7,
  },
  quickActionLabel: {
    textAlign: 'center',
  },
  networkList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[8],
  },
});
