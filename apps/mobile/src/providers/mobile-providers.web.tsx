import { DarkTheme, ThemeProvider } from 'expo-router';
import type { ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';

// Web preview never wires Wagmi/AppKit - Expo Router server-renders the
// first request on Node, and the Reown SDK's WalletConnect connector
// touches `window` unconditionally during construction, crashing that Node
// process. wagmi-config.ts (which calls createAppKit()) is only imported by
// the .native.tsx variant of this file, so it never enters the web bundle's
// module graph at all - not merely "not called" but entirely excluded from
// this platform's build. See use-wallet.web.ts for the matching no-op hook.
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

export function MobileProviders({ children }: { children: ReactNode }) {
  return (
    <SafeAreaProvider>
      <ThemeProvider value={chainSpanNavigationTheme}>{children}</ThemeProvider>
    </SafeAreaProvider>
  );
}
