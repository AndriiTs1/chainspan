import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Colors, IconSize, Spacing } from '@/constants/theme';

const upcoming = ['Balances', 'Tokens', 'Native assets', 'ERC-20 Portfolio'];

export default function PortfolioScreen() {
  return (
    <Screen>
      <AppText variant="heading">Portfolio</AppText>

      <Card style={styles.cardContent}>
        <View style={styles.iconWrap}>
          <SymbolView
            name={{ ios: 'chart.pie', android: 'pie_chart', web: 'pie_chart' }}
            size={IconSize.lg}
            tintColor={Colors.brandBlue}
          />
        </View>

        <AppText variant="body" color="secondary">
          Portfolio integration will be added in Stage 8.4.
        </AppText>

        <View style={styles.list}>
          {upcoming.map((item) => (
            <View key={item} style={styles.listRow}>
              <View style={styles.dot} />
              <AppText variant="body" color="secondary">
                {item}
              </AppText>
            </View>
          ))}
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cardContent: {
    gap: Spacing[12],
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(59,130,246,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    gap: Spacing[8],
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[8],
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.brandBlue,
  },
});
