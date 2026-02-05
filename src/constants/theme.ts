/**
 * Color palette tokens — extracted from the theme.png design.
 * Single source of truth for all hex values. src/theme.ts (Paper MD3) mirrors these.
 */

import { Platform } from 'react-native';

const deepBlack        = '#111827';
const cardSurface      = '#1E293B';
const cardBorder       = '#334155';
const primaryText      = '#F1F5F9';
const mutedText        = '#94A3B8';
const tealPrimary      = '#2DD4BF';
const tealGlow         = '#0D9488';
const urgentRed        = '#EF4444';
const urgentRedDark    = '#DC2626';
const safeGreen        = '#22C55E';
const statusYellow     = '#EAB308';
const avatarPlaceholder = '#475569';
const inputBorder      = '#475569';

// TODO: define a proper light palette here for future light mode support.
// Currently both light and dark point to the same values because the app is forced dark.
export const Colors = {
  light: {
    text: primaryText,
    background: deepBlack,
    tint: tealPrimary,
    icon: tealPrimary,
    tabIconDefault: mutedText,
    tabIconSelected: tealPrimary,
    primary: tealPrimary,
    secondary: mutedText,
    accent: safeGreen,
    surface: cardSurface,
    onPrimary: deepBlack,
    onSurfaceDisabled: mutedText + '61',
    cardBorder,
    mutedText,
    tealGlow,
    urgentRed,
    urgentRedDark,
    safeGreen,
    statusYellow,
    avatarPlaceholder,
    inputBorder,
  },
  dark: {
    text: primaryText,
    background: deepBlack,
    tint: tealPrimary,
    icon: tealPrimary,
    tabIconDefault: mutedText,
    tabIconSelected: tealPrimary,
    primary: tealPrimary,
    secondary: mutedText,
    accent: safeGreen,
    surface: cardSurface,
    onPrimary: deepBlack,
    onSurfaceDisabled: mutedText + '61',
    cardBorder,
    mutedText,
    tealGlow,
    urgentRed,
    urgentRedDark,
    safeGreen,
    statusYellow,
    avatarPlaceholder,
    inputBorder,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
