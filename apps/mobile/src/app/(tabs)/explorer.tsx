import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Colors, IconSize, Spacing } from '@/constants/theme';

const futureCapabilities = ['NFT', 'Transactions', 'ENS'];

// "Explorer" is the tab-level name (see Stage 8.1 architecture update);
// Contract Inspector is its first feature, added in Stage 8.6. Keeping the
// tab name stable now avoids a rename later when NFT/Transactions/ENS join it.
export default function ExplorerScreen() {
  return (
    <Screen>
      <AppText variant="heading">Explorer</AppText>

      <Card style={styles.cardContent}>
        <View style={styles.rowCenter}>
          <SymbolView
            name={{ ios: 'doc.text.magnifyingglass', android: 'find_in_page', web: 'find_in_page' }}
            size={IconSize.lg}
            tintColor={Colors.brandBlue}
          />
          <AppText variant="heading">Contract Inspector</AppText>
        </View>
        <AppText variant="body" color="secondary">
          Read curated ERC-20 contracts directly over public RPC. Arrives in Stage 8.6.
        </AppText>
      </Card>

      <View style={styles.section}>
        <AppText variant="caption" color="muted" style={styles.sectionLabel}>
          More Explorer capabilities are planned
        </AppText>
        <View style={styles.futureRow}>
          {futureCapabilities.map((item) => (
            <Badge key={item} label={item} tone="neutral" />
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cardContent: {
    gap: Spacing[12],
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[10],
  },
  section: {
    gap: Spacing[8],
  },
  sectionLabel: {
    paddingHorizontal: Spacing[4],
  },
  futureRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[8],
  },
});
