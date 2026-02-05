import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';
import { calculateTimeRemaining, formatHHMMSS } from '@/utils/time';
import BottomProgressBar from '@/components/BottomProgressBar';

interface UrgentCheckInScreenProps {
  remainingSeconds: number;
  totalSeconds: number;
  onCheckIn: () => void;
}

const UrgentCheckInScreen: React.FC<UrgentCheckInScreenProps> = ({ remainingSeconds, totalSeconds, onCheckIn }) => {
  const timeDisplay = formatHHMMSS(calculateTimeRemaining(remainingSeconds * 1000));

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Red urgent banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>URGENT CHECK-IN</Text>
        </View>

        {/* Countdown */}
        <Text style={styles.countdown}>{timeDisplay}</Text>

        {/* Question */}
        <Text style={styles.question}>Are you safe?</Text>

        {/* Green check-in button — manually styled because Paper's contained button uses tealPrimary */}
        <TouchableOpacity style={styles.checkInButton} onPress={onCheckIn} activeOpacity={0.8}>
          <Text style={styles.checkInText}>CHECK IN</Text>
        </TouchableOpacity>
      </View>

      <BottomProgressBar remainingSeconds={remainingSeconds} totalSeconds={totalSeconds} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  banner: {
    width: '100%',
    backgroundColor: Colors.dark.urgentRed,
    paddingVertical: 18,
    alignItems: 'center',
  },
  bannerText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  countdown: {
    color: Colors.dark.text,
    fontSize: 56,
    fontWeight: 'bold',
    marginTop: 60,
  },
  question: {
    color: Colors.dark.text,
    fontSize: 22,
    fontWeight: '600',
    marginTop: 32,
  },
  checkInButton: {
    marginTop: 48,
    backgroundColor: Colors.dark.safeGreen,
    width: '75%',
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.dark.safeGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  checkInText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
});

export default UrgentCheckInScreen;
