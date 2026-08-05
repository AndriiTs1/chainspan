import { ScrollView, StyleSheet, View } from 'react-native';
import type { ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Spacing } from '@/constants/theme';

type ScreenProps = ViewProps & {
  scroll?: boolean;
};

// Shared page shell for every tab/modal screen: dark background, safe-area
// awareness, consistent outer padding. `scroll` covers the common case
// (content taller than the viewport); pass `scroll={false}` for screens that
// manage their own layout.
export function Screen({ children, style, scroll = true, ...rest }: ScreenProps) {
  if (scroll) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView contentContainerStyle={[styles.content, style]} {...rest}>
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={[styles.content, styles.flex, style]} {...rest}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing[20],
    gap: Spacing[16],
  },
  flex: {
    flex: 1,
  },
});
