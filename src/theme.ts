import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// Color palette tokens — must stay in sync with src/constants/theme.ts
const deepBlack     = '#111827';
const cardSurface   = '#1E293B';
const cardBorder    = '#334155';
const primaryText   = '#F1F5F9';
const mutedText     = '#94A3B8';
const tealPrimary   = '#2DD4BF';
const tealGlow      = '#0D9488';
const urgentRed     = '#EF4444';
const urgentRedDark = '#DC2626';
const safeGreen     = '#22C55E';

const darkColors = {
  primary: tealPrimary,
  onPrimary: deepBlack,
  primaryContainer: tealGlow,
  onPrimaryContainer: primaryText,
  secondary: mutedText,
  onSecondary: deepBlack,
  secondaryContainer: cardSurface,
  onSecondaryContainer: primaryText,
  tertiary: safeGreen,
  onTertiary: deepBlack,
  tertiaryContainer: '#166534',
  onTertiaryContainer: primaryText,
  error: urgentRed,
  onError: '#FFFFFF',
  errorContainer: urgentRedDark,
  onErrorContainer: '#FEE2E2',
  background: deepBlack,
  onBackground: primaryText,
  surface: cardSurface,
  onSurface: primaryText,
  surfaceVariant: cardBorder,
  onSurfaceVariant: mutedText,
  outline: '#475569',
  outlineVariant: cardBorder,
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: primaryText,
  inverseOnSurface: deepBlack,
  inversePrimary: tealGlow,
  elevation: {
    level0: 'transparent',
    level1: cardSurface + '20',
    level2: cardSurface + '40',
    level3: cardSurface + '60',
    level4: cardSurface + '80',
    level5: cardSurface + 'A0',
  },
  surfaceDisabled: deepBlack + '1F',
  onSurfaceDisabled: mutedText + '61',
  backdrop: '#000000' + '4D',
};

// TODO: define a separate light palette for future light mode support.
// Both themes currently share darkColors because the app is forced dark.
export const lightTheme = {
  ...MD3LightTheme,
  colors: darkColors,
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: darkColors,
};
