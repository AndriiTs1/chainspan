import { AppKitProvider } from '@reown/appkit-react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, ThemeProvider } from 'expo-router';
import type { ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WagmiProvider } from 'wagmi';

import { Colors } from '@/constants/theme';
import { appKit, wagmiConfig } from '@/lib/web3/wagmi-config';

// Adapts expo-router's own ThemeProvider (it already wraps React Navigation's
// theme context, used for native chrome like headers) instead of introducing
// a second, competing theme provider. Only the colors are overridden - the
// rest of DarkTheme (fonts, etc.) is kept as-is since ChainSpan mobile is
// dark-only already, DarkTheme is the correct base to start from.
const chainSpanNavigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Colors.background,
    card: Colors.surface,
    text: Colors.textPrimary,
    border: Colors.border,
    primary: Colors.brandBlue,
    notification: Colors.danger,
  },
};

// One QueryClient for the app's lifetime - wagmi's internal queries and
// AppKit's own data fetching share this instance, mirroring the single
// wagmiConfig singleton pattern already used on web (see
// apps/web/lib/web3/wagmi-config.ts).
const queryClient = new QueryClient();

// <AppKit/> itself (the modal UI) is intentionally NOT rendered here - it's
// mounted in wallet.tsx instead, so it only exists while that screen is on
// screen rather than from the very first app launch. AppKitProvider/
// WagmiProvider/QueryClientProvider stay global: ModalController's state is
// a module-level singleton independent of whether <AppKit/> is mounted, so
// deferring just the renderer doesn't lose anything.

export function MobileProviders({ children }: { children: ReactNode }) {
  return (
    <SafeAreaProvider>
      <ThemeProvider value={chainSpanNavigationTheme}>
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <AppKitProvider instance={appKit}>
              {children}
            </AppKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
