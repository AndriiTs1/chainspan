import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { MobileProviders } from '@/providers/mobile-providers';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <MobileProviders>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="wallet" options={{ presentation: 'modal', headerShown: true, title: 'Wallet' }} />
        <Stack.Screen name="sign" options={{ presentation: 'modal', headerShown: true, title: 'Sign Message' }} />
      </Stack>
    </MobileProviders>
  );
}
