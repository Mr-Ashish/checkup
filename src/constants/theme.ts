/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// Color palette: 0D1821, 344966, E6AACE, F0F4EF, BFCC94
const darkNavy = '#0D1821';
const slateBlue = '#344966';
const softPink = '#E6AACE';
const offWhite = '#F0F4EF';
const sageGreen = '#BFCC94';

export const Colors = {
  light: {
    text: darkNavy,
    background: offWhite,
    tint: slateBlue,
    icon: slateBlue,
    tabIconDefault: slateBlue,
    tabIconSelected: sageGreen,
    primary: slateBlue,
    secondary: softPink,
    accent: sageGreen,
    surface: offWhite,
    onPrimary: offWhite,
    onSurfaceDisabled: darkNavy + '61', // with alpha
  },
  dark: {
    text: offWhite,
    background: darkNavy,
    tint: softPink,
    icon: softPink,
    tabIconDefault: softPink,
    tabIconSelected: sageGreen,
    primary: softPink,
    secondary: slateBlue,
    accent: sageGreen,
    surface: darkNavy,
    onPrimary: darkNavy,
    onSurfaceDisabled: offWhite + '61',
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
