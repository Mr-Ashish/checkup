import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';
import { URGENT_THRESHOLD_SECS, WARNING_THRESHOLD_SECS } from '@/constants/app';

interface BottomProgressBarProps {
  remainingSeconds: number;
  totalSeconds: number;
}

const BottomProgressBar: React.FC<BottomProgressBarProps> = ({ remainingSeconds, totalSeconds }) => {
  const fraction = totalSeconds > 0 ? Math.max(0, Math.min(1, remainingSeconds / totalSeconds)) : 0;

  const color = remainingSeconds <= URGENT_THRESHOLD_SECS
    ? Colors.dark.urgentRed
    : remainingSeconds <= WARNING_THRESHOLD_SECS
      ? Colors.dark.statusYellow
      : Colors.dark.safeGreen;

  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${fraction * 100}%`, backgroundColor: color }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.dark.cardBorder,
  },
  fill: {
    height: '100%',
  },
});

export default BottomProgressBar;
