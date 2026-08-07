import { getSupportedChain } from '@chainspan/web3';
import type { AssetBalance, Portfolio } from '@chainspan/web3';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Screen } from '@/components/ui/screen';
import { Colors, IconSize, Spacing } from '@/constants/theme';
import { usePortfolio } from '@/hooks/use-portfolio';
import { formatBalance, shortenAddress } from '@/lib/web3/format';

function openWallet() {
  router.push('/wallet');
}

export default function PortfolioScreen() {
  const result = usePortfolio();

  return (
    <Screen>
      <AppText variant="heading">Portfolio</AppText>

      {result.status === 'disconnected' ? <DisconnectedState /> : null}
      {result.status === 'unsupported' ? <UnsupportedState chainId={result.chainId} /> : null}
      {result.status === 'loading' ? <LoadingState /> : null}
      {result.status === 'error' ? <ErrorState /> : null}
      {result.status === 'success' ? (
        <SuccessState
          portfolio={result.portfolio}
          hasPartialError={result.hasPartialError}
          failedCount={result.failedAssets.length}
        />
      ) : null}
    </Screen>
  );
}

function DisconnectedState() {
  return (
    <Card style={styles.cardContent}>
      <AppText variant="body" color="secondary">
        Connect a wallet to view your balances.
      </AppText>
      <AppText variant="body" color="secondary">
        Wallet not connected
      </AppText>
      <PrimaryButton label="Open Wallet" onPress={openWallet} />
    </Card>
  );
}

function UnsupportedState({ chainId }: { chainId: number }) {
  return (
    <Card style={styles.cardContent}>
      <View style={styles.rowCenter}>
        <SymbolView
          name={{ ios: 'exclamationmark.triangle.fill', android: 'warning', web: 'warning' }}
          size={IconSize.lg}
          tintColor={Colors.caution}
        />
        <AppText variant="heading">Unsupported network</AppText>
      </View>
      <AppText variant="body" color="secondary">
        Portfolio isn&apos;t available on chain {chainId}. Switch to a supported network in your
        wallet.
      </AppText>
      <PrimaryButton label="Open Wallet" onPress={openWallet} />
    </Card>
  );
}

function LoadingState() {
  return (
    <Card
      style={[styles.cardContent, styles.rowCenter]}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading portfolio">
      <ActivityIndicator color={Colors.brandBlue} />
      <AppText variant="body" color="secondary">
        Loading your balances...
      </AppText>
    </Card>
  );
}

function ErrorState() {
  return (
    <Card style={styles.errorCard} accessibilityRole="alert">
      <AppText variant="body" color="secondary">
        Portfolio data could not be loaded.
      </AppText>
    </Card>
  );
}

function SuccessState({
  portfolio,
  hasPartialError,
  failedCount,
}: {
  portfolio: Portfolio;
  hasPartialError: boolean;
  failedCount: number;
}) {
  const chain = getSupportedChain(portfolio.chainId);

  return (
    <>
      <Card style={styles.cardContent}>
        <View style={styles.rowCenter}>
          <AppText variant="mono" color="secondary">
            {shortenAddress(portfolio.address)}
          </AppText>
          {chain ? <Badge label={chain.name} tone="brand" /> : null}
        </View>

        {hasPartialError ? (
          <View style={styles.partialWarning}>
            <AppText variant="caption" color="secondary">
              Some balances could not be loaded
              {failedCount > 0 ? ` (${failedCount})` : ''}.
            </AppText>
          </View>
        ) : null}
      </Card>

      {portfolio.assets.length === 0 ? (
        <Card style={styles.cardContent}>
          <AppText variant="body" color="secondary">
            No supported assets were found for this wallet on the current network.
          </AppText>
        </Card>
      ) : (
        <Card style={styles.list}>
          {portfolio.assets.map((asset, index) => (
            <View key={`${asset.token.type}-${asset.token.symbol}-${index}`}>
              <AssetRow asset={asset} />
              {index < portfolio.assets.length - 1 ? <View style={styles.divider} /> : null}
            </View>
          ))}
        </Card>
      )}
    </>
  );
}

function AssetRow({ asset }: { asset: AssetBalance }) {
  const { token, value } = asset;

  return (
    <View style={styles.assetRow}>
      <View style={styles.assetInfo}>
        <AppText variant="body" numberOfLines={1}>
          {token.name}
        </AppText>
        <Badge label={token.type === 'native' ? 'Native' : 'ERC-20'} tone="neutral" />
      </View>

      <View style={styles.assetBalance}>
        <AppText variant="body">{formatBalance(value, token.decimals)}</AppText>
        <AppText variant="caption" color="muted">
          {token.symbol}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContent: {
    gap: Spacing[12],
  },
  errorCard: {
    borderColor: 'rgba(248,113,113,0.1)',
    backgroundColor: 'rgba(248,113,113,0.06)',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing[10],
  },
  partialWarning: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.2)',
    backgroundColor: 'rgba(251,191,36,0.08)',
    paddingHorizontal: Spacing[12],
    paddingVertical: Spacing[10],
  },
  list: {
    padding: 0,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing[16],
  },
  assetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing[12],
    minHeight: 44,
    paddingHorizontal: Spacing[16],
    paddingVertical: Spacing[12],
  },
  assetInfo: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[8],
  },
  assetBalance: {
    alignItems: 'flex-end',
  },
});
