import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Provider as PaperProvider } from 'react-native-paper';
import { darkTheme } from '@/theme';
import ErrorBoundary from '@/components/ErrorBoundary';

export const unstable_settings = {
  anchor: '(drawer)',
};

export default function RootLayout() {
  return (
    <PaperProvider theme={darkTheme}>
      <ThemeProvider value={DarkTheme}>
        <ErrorBoundary>
          <Stack>
            <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
          </Stack>
        </ErrorBoundary>
        <StatusBar style="light" />
      </ThemeProvider>
    </PaperProvider>
  );
}
