import Constants from 'expo-constants';
import { StyleSheet } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';

// Appearance / Networks / About / GitHub / LinkedIn / Licenses are the
// approved Settings sections - added once each has something real to show
// (Appearance depends on the still-open light/dark decision; Networks and
// About are meaningful once Wallet/Explorer exist). Only real, already
// available data (app version, current stage) is shown here for now.
export default function SettingsScreen() {
  const version = Constants.expoConfig?.version ?? 'unknown';

  return (
    <Screen>
      <AppText variant="heading">Settings</AppText>
      <Card style={styles.cardContent}>
        <AppText variant="body">Version {version}</AppText>
        <Badge label="Stage 8.1 · Foundation" tone="neutral" />
        <AppText variant="body" color="secondary">
          Appearance, Networks, About and account settings will be added as their related
          features ship.
        </AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cardContent: {
    gap: Spacing[8],
  },
});
