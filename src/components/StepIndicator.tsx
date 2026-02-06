import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
        Step {currentStep} of {totalSteps}
      </Text>
      <View style={styles.dots}>
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const isActive = step === currentStep;
          const isPast = step < currentStep;
          return (
            <View
              key={step}
              style={[
                styles.dot,
                {
                  backgroundColor: isActive || isPast
                    ? theme.colors.primary
                    : theme.colors.surfaceVariant,
                  width: isActive ? 24 : 10,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 10,
    borderRadius: 5,
  },
});

export default StepIndicator;
