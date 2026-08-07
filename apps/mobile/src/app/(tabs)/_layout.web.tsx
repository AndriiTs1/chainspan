import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';

import { Colors, IconSize } from '@/constants/theme';

// NativeTabs (expo-router/unstable-native-tabs, used in _layout.native.tsx)
// renders as a non-flow, overlapping element on web - confirmed by direct
// measurement: its tab buttons and the screen's heading text occupied the
// same y-range, and "Settings" was cut off entirely below ~390px width.
// expo-router's own stable `Tabs` (React Navigation bottom-tabs under the
// hood) is already part of expo-router - no new dependency - and behaves as
// a normal flex sibling, so screen content is never covered.
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.brandBlue,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ web: 'home' }} size={IconSize.md} tintColor={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          title: 'Portfolio',
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ web: 'pie_chart' }} size={IconSize.md} tintColor={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explorer"
        options={{
          title: 'Explorer',
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ web: 'search' }} size={IconSize.md} tintColor={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ web: 'settings' }} size={IconSize.md} tintColor={color} />
          ),
        }}
      />
    </Tabs>
  );
}
