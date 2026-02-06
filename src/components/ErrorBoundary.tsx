import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      return fallback || <DefaultFallback error={error} />;
    }

    return children;
  }
}

const DefaultFallback: React.FC<{ error?: Error }> = ({ error }) => {
  const theme = useTheme();
  const router = useRouter();
  const reset = () => {
    // Reset to home (clears error state; native-friendly alternative to reload)
    router.replace('/');
  };

  return (
    <View style={[styles.fallback, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.error }]}>Something went wrong</Text>
      {error && <Text style={[styles.message, { color: theme.colors.onSurface }]}>{error.message}</Text>}
      <Button title="Try Again" onPress={reset} color={theme.colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
  },
});

export default ErrorBoundary;
