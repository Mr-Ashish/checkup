import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// Color palette: 0D1821, 344966, E6AACE, F0F4EF, BFCC94
const darkNavy = '#0D1821';
const slateBlue = '#344966';
const softPink = '#E6AACE';
const offWhite = '#F0F4EF';
const sageGreen = '#BFCC94';

const customColors = {
  primary: slateBlue,
  onPrimary: offWhite,
  primaryContainer: softPink,
  onPrimaryContainer: darkNavy,
  secondary: sageGreen,
  onSecondary: darkNavy,
  secondaryContainer: softPink,
  onSecondaryContainer: darkNavy,
  tertiary: softPink,
  onTertiary: darkNavy,
  tertiaryContainer: sageGreen,
  onTertiaryContainer: darkNavy,
  error: '#B00020',
  onError: '#FFFFFF',
  errorContainer: '#FFDAD6',
  onErrorContainer: '#410002',
  background: offWhite,
  onBackground: darkNavy,
  surface: offWhite,
  onSurface: darkNavy,
  surfaceVariant: softPink,
  onSurfaceVariant: darkNavy,
  outline: slateBlue,
  outlineVariant: sageGreen,
  shadow: darkNavy,
  scrim: darkNavy,
  inverseSurface: darkNavy,
  inverseOnSurface: offWhite,
  inversePrimary: softPink,
  elevation: {
    level0: 'transparent',
    level1: sageGreen + '20', // with alpha
    level2: sageGreen + '40',
    level3: sageGreen + '60',
    level4: sageGreen + '80',
    level5: sageGreen + 'A0',
  },
  surfaceDisabled: darkNavy + '1F',
  onSurfaceDisabled: darkNavy + '61',
  backdrop: darkNavy + '4D',
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: customColors,
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    primary: softPink,
    onPrimary: darkNavy,
    primaryContainer: slateBlue,
    onPrimaryContainer: offWhite,
    secondary: sageGreen,
    onSecondary: darkNavy,
    secondaryContainer: slateBlue,
    onSecondaryContainer: offWhite,
    tertiary: sageGreen,
    onTertiary: darkNavy,
    tertiaryContainer: softPink,
    onTertiaryContainer: darkNavy,
    error: '#CF6679',
    onError: '#000000',
    errorContainer: '#B00020',
    onErrorContainer: '#FFDAD6',
    background: darkNavy,
    onBackground: offWhite,
    surface: darkNavy,
    onSurface: offWhite,
    surfaceVariant: slateBlue,
    onSurfaceVariant: offWhite,
    outline: softPink,
    outlineVariant: sageGreen,
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: offWhite,
    inverseOnSurface: darkNavy,
    inversePrimary: slateBlue,
    elevation: {
      level0: 'transparent',
      level1: slateBlue + '20',
      level2: slateBlue + '40',
      level3: slateBlue + '60',
      level4: slateBlue + '80',
      level5: slateBlue + 'A0',
    },
    surfaceDisabled: offWhite + '1F',
    onSurfaceDisabled: offWhite + '61',
    backdrop: darkNavy + '4D',
  },
};