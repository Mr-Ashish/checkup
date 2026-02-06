import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import StepIndicator from '@/components/StepIndicator';
import NumberScrollPicker from '@/components/NumberScrollPicker';

interface PeriodScreenProps {
  onSave: (period: number) => void;
}

const PeriodScreen: React.FC<PeriodScreenProps> = ({ onSave }) => {
  const theme = useTheme();
  const [selectedDays, setSelectedDays] = useState<number>(0);
  const [selectedHours, setSelectedHours] = useState<number>(1);

  const handleFinish = () => {
    const period = selectedDays * 24 + selectedHours;
    onSave(period > 0 ? period : 1); // fallback to 1 hour minimum
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StepIndicator currentStep={3} totalSteps={3} />

      <Text style={[styles.heading, { color: theme.colors.onSurface }]}>
        Set your check-in period
      </Text>
      <Text style={[styles.subheading, { color: theme.colors.onSurfaceVariant }]}>
        You'll be reminded to check in at this interval
      </Text>

      <View style={styles.pickersRow}>
        <NumberScrollPicker
          value={selectedDays}
          onChange={setSelectedDays}
          min={0}
          max={7}
          label="Days"
          padStart={0}
        />

        <Text style={[styles.separator, { color: theme.colors.onSurfaceVariant }]}>:</Text>

        <NumberScrollPicker
          value={selectedHours}
          onChange={setSelectedHours}
          min={0}
          max={23}
          label="Hours"
          padStart={2}
        />
      </View>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleFinish}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Finish Setup
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
  },
  pickersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 20,
  },
  separator: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 48,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    borderRadius: 30,
  },
  buttonContent: {
    height: 52,
  },
});

export default PeriodScreen;
