import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import type { AndroidSymbol, SFSymbol } from 'expo-symbols';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Badge } from '@/components/ui/badge';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Screen } from '@/components/ui/screen';
import { WalletModalMount } from '@/components/web3/wallet-modal-mount';
import { Colors, IconSize, Spacing } from '@/constants/theme';
import { useWallet } from '@/hooks/use-wallet';

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function closeModal() {
  if (router.canGoBack()) {
    router.back();
    return;
  }

  router.replace('/');
}

function Icon({ sf, md, tintColor }: { sf: SFSymbol; md: AndroidSymbol; tintColor: string }) {
  return (
    <SymbolView name={{ ios: sf, android: md, web: md }} size={IconSize.lg} tintColor={tintColor} />
  );
}

export default function WalletModal() {
  const wallet = useWallet();

  return (
    <Screen scroll={false} style={styles.content}>
      {wallet.isConnected ? <ConnectedPanel /> : <DisconnectedPanel />}

      <PrimaryButton label="Close" onPress={closeModal} />
      <WalletModalMount />
    </Screen>
  );
}

// AppKit's own modal already renders on top of this screen when `connect`
// opens it, so this panel only needs to reflect state - not build a second
// wallet-picker UI.
function DisconnectedPanel() {
  const wallet = useWallet();

  if (wallet.isReconnecting) {
    return (
      <View style={styles.panel}>
        <ActivityIndicator color={Colors.brandBlue} />
        <AppText variant="body" color="secondary">
          Restoring your previous session...
        </AppText>
      </View>
    );
  }

  return (
    <View style={styles.panel}>
      <Icon sf="wallet.pass" md="account_balance_wallet" tintColor={Colors.textSecondary} />
      <AppText variant="heading">Connect your wallet</AppText>
      <AppText variant="body" color="secondary">
        Scan a QR code or connect a mobile wallet via WalletConnect.
      </AppText>

      {wallet.connectError ? (
        <View style={styles.errorBanner}>
          <AppText variant="caption" color="secondary" style={styles.errorText}>
            {wallet.connectError}
          </AppText>
        </View>
      ) : null}

      <PrimaryButton
        label={wallet.isConnecting ? 'Connecting...' : 'Connect Wallet'}
        onPress={wallet.connect}
        disabled={wallet.isConnecting}
      />

      <AppText variant="caption" color="muted" style={styles.disclaimer}>
        ChainSpan never receives or stores your private keys.
      </AppText>
    </View>
  );
}

function ConnectedPanel() {
  const wallet = useWallet();

  if (!wallet.address) {
    return null;
  }

  return (
    <View style={styles.panel}>
      <Icon sf="checkmark.circle.fill" md="check_circle" tintColor={Colors.success} />
      <AppText variant="heading">Wallet connected</AppText>
      <AppText variant="mono" color="secondary">
        {shortenAddress(wallet.address)}
      </AppText>

      {wallet.isUnsupportedChain ? (
        <Badge label="Unsupported network" tone="danger" />
      ) : wallet.supportedChain ? (
        <Badge label={wallet.supportedChain.name} tone="brand" />
      ) : null}

      <PrimaryButton label="Disconnect" onPress={wallet.disconnect} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
    paddingBottom: Spacing[32],
  },
  panel: {
    alignItems: 'center',
    gap: Spacing[8],
    paddingBottom: Spacing[8],
  },
  errorBanner: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.1)',
    backgroundColor: 'rgba(248,113,113,0.06)',
    paddingHorizontal: Spacing[12],
    paddingVertical: Spacing[10],
  },
  errorText: {
    textAlign: 'center',
  },
  disclaimer: {
    textAlign: 'center',
  },
});
