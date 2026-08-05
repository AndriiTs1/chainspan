import { DarkTheme, ThemeProvider } from 'expo-router';
import type { ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';

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

// QueryClientProvider intentionally not included yet - no data-fetching
// hooks exist in Stage 8.1 (Wallet/Portfolio/Explorer reads land in later
// stages), so adding TanStack Query now would be an unused dependency.
export function MobileProviders({ children }: { children: ReactNode }) {
  return (
    <SafeAreaProvider>
      <ThemeProvider value={chainSpanNavigationTheme}>{children}</ThemeProvider>
    </SafeAreaProvider>
  );
}
