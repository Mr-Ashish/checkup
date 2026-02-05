import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import StepIndicator from '@/components/StepIndicator';

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
        <View style={[styles.pickerBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.surfaceVariant }]}>
          <Text style={[styles.pickerLabel, { color: theme.colors.onSurfaceVariant }]}>Days</Text>
          <Picker
            selectedValue={selectedDays}
            onValueChange={(value: number) => setSelectedDays(value)}
            style={styles.picker}
            itemStyle={{ color: theme.colors.onSurface }}
          >
            {Array.from({ length: 8 }, (_, i) => (
              <Picker.Item key={i} label={`${i}`} value={i} />
            ))}
          </Picker>
        </View>

        <Text style={[styles.separator, { color: theme.colors.onSurfaceVariant }]}>:</Text>

        <View style={[styles.pickerBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.surfaceVariant }]}>
          <Text style={[styles.pickerLabel, { color: theme.colors.onSurfaceVariant }]}>Hours</Text>
          <Picker
            selectedValue={selectedHours}
            onValueChange={(value: number) => setSelectedHours(value)}
            style={styles.picker}
            itemStyle={{ color: theme.colors.onSurface }}
          >
            {Array.from({ length: 24 }, (_, i) => (
              <Picker.Item key={i} label={`${i}`} value={i} />
            ))}
          </Picker>
        </View>
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
  },
  pickerBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
  },
  pickerLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingTop: 10,
  },
  picker: {
    height: 100,
    width: '100%',
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
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PeriodScreen;
