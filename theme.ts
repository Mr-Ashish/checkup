import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

const customColors = {
  primary: '#6200EE', // Vibrant purple
  onPrimary: '#FFFFFF',
  primaryContainer: '#EADDFF',
  onPrimaryContainer: '#21005E',
  secondary: '#03DAC6', // Teal accent
  onSecondary: '#000000',
  secondaryContainer: '#B2DFDB',
  onSecondaryContainer: '#004D40',
  tertiary: '#FF6F00', // Orange
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#FFF3E0',
  onTertiaryContainer: '#E65100',
  error: '#B00020',
  onError: '#FFFFFF',
  errorContainer: '#FFDAD6',
  onErrorContainer: '#410002',
  background: '#FAFAFA', // Light gray
  onBackground: '#1C1B1F',
  surface: '#FFFFFF',
  onSurface: '#1C1B1F',
  surfaceVariant: '#E7E0EC',
  onSurfaceVariant: '#49454F',
  outline: '#79747E',
  outlineVariant: '#C4C7C5',
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#313033',
  inverseOnSurface: '#F4EFF4',
  inversePrimary: '#D0BCFF',
  elevation: {
    level0: 'transparent',
    level1: '#F5F5F5',
    level2: '#EEEEEE',
    level3: '#E0E0E0',
    level4: '#BDBDBD',
    level5: '#9E9E9E',
  },
  surfaceDisabled: '#1C1B1F1F',
  onSurfaceDisabled: '#1C1B1F61',
  backdrop: '#0000004D',
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: customColors,
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#BB86FC',
    onPrimary: '#000000',
    secondary: '#03DAC6',
    onSecondary: '#000000',
    background: '#121212',
    surface: '#1E1E1E',
    onSurface: '#E0E0E0',
    // Add more dark colors as needed
  },
};