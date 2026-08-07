import { Platform, StyleSheet, View } from 'react-native';
import type { ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Radius } from '@/constants/theme';

type ChainSpanLogoProps = {
  size?: number;
  iconSize?: number;
  style?: ViewStyle;
};

// Exact geometry ported from lucide-react's `Boxes` icon - the same glyph
// apps/web/components/brand/chainspan-logo.tsx renders via lucide-react.
// Read directly from node_modules/lucide-react/dist/esm/icons/boxes.mjs:
// same viewBox and the same path `d` strings verbatim, plus the same
// stroke defaults from lucide's defaultAttributes.mjs (fill=none,
// strokeWidth=2, strokeLinecap=round, strokeLinejoin=round). This is the
// brand mark itself, not a similar system icon - a hand-picked SF Symbol/
// Material Symbol would be a different glyph, which is fine for ordinary
// UI icons but not for a logo that has to read as the same mark as web.
// react-native-svg is already an installed dependency (pulled in for
// AppKit's own UI in Stage 8.3), so this adds no new package.
const BOXES_PATHS = [
  'M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z',
  'm7 16.5-4.74-2.85',
  'm7 16.5 5-3',
  'M7 16.5v5.17',
  'M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z',
  'm17 16.5-5-3',
  'm17 16.5 4.74-2.85',
  'M17 16.5v5.17',
  'M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z',
  'M12 8 7.26 5.15',
  'm12 8 4.74-2.85',
  'M12 13.5V8',
] as const;

const BOXES_GLYPH_COLOR = '#60a5fa';

export function ChainSpanLogo({ size = 40, iconSize = 20, style }: ChainSpanLogoProps) {
  return (
    <View style={[styles.badge, { width: size, height: size }, style]}>
      <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
        {BOXES_PATHS.map((d) => (
          <Path
            key={d}
            d={d}
            stroke={BOXES_GLYPH_COLOR}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.3)',
    backgroundColor: 'rgba(59,130,246,0.1)',
    // react-native-web deprecated the shadow* props in favor of the CSS-
    // native boxShadow string; native RN has no boxShadow support at all,
    // so this needs the actual platform split rather than one or the other.
    ...Platform.select({
      web: { boxShadow: '0 0 12px rgba(59,130,246,0.35)' },
      default: {
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
      },
    }),
  },
});
