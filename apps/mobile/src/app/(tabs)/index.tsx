import { supportedChains } from '@chainspan/web3';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';

// Deliberately minimal for Stage 8.1 - Wallet Status / Portfolio Preview /
// Quick Actions / About are part of the approved Dashboard architecture, but
// would need real wallet/portfolio data to show honestly. They land with
// their respective feature stages, not here.
export default function DashboardScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="caption" color="secondary">
          ChainSpan
        </AppText>
        <AppText variant="display">Dashboard</AppText>
        <AppText variant="body" color="secondary">
          Mobile foundation
        </AppText>
      </View>

      <Card style={styles.cardContent}>
        <AppText variant="heading">Supported networks</AppText>
        <AppText variant="body" color="secondary">
          Already configured in @chainspan/web3, shared with the Web app.
        </AppText>
        <Badge label={`${supportedChains.length} networks`} tone="brand" />
      </Card>

      <Card style={styles.cardContent}>
        <AppText variant="heading">What&apos;s next</AppText>
        <AppText variant="body" color="secondary">
          Wallet connection and portfolio data will be wired up in upcoming stages. This screen is
          a Stage 8.1 foundation placeholder, not a finished feature.
        </AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing[4],
    marginBottom: Spacing[8],
  },
  cardContent: {
    gap: Spacing[8],
  },
});
