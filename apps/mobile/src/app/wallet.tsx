import { router } from 'expo-router';
import { StyleSheet } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';

export default function WalletModal() {
  return (
    <Screen scroll={false} style={styles.content}>
      <AppText variant="body" color="secondary">
        Wallet connection will be added in Stage 8.3.
      </AppText>
      <PrimaryButton
        label="Close"
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'flex-end',
    paddingBottom: Spacing[32],
  },
});
