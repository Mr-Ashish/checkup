import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import CircularTimer from '@/components/CircularTimer';
import BottomNavBar from '@/components/BottomNavBar';
import BottomProgressBar from '@/components/BottomProgressBar';
import { Contact } from '@/types';

interface SafetyDashboardScreenProps {
  remainingSeconds: number;
  totalSeconds: number;
  contacts: Contact[];
  lastCheckIn: Date | null;
  onCheckIn: () => void;
}

const formatDate = (date: Date | null): string => {
  if (!date) return 'Never';
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatPeriod = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  if (days > 0 && remainingHours > 0) return `${days}d ${remainingHours}h`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  return `${hours} hour${hours !== 1 ? 's' : ''}`;
};

const SafetyDashboardScreen: React.FC<SafetyDashboardScreenProps> = ({
  remainingSeconds,
  totalSeconds,
  contacts,
  lastCheckIn,
  onCheckIn,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={[styles.header, { color: theme.colors.onSurface }]}>
          Safety Dashboard
        </Text>

        <View style={styles.timerContainer}>
          <CircularTimer remainingSeconds={remainingSeconds} totalSeconds={totalSeconds} size={220} />
        </View>

        <View style={styles.cardsRow}>
          <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.surfaceVariant }]}>
            <Text style={[styles.cardLabel, { color: theme.colors.onSurfaceVariant }]}>Period</Text>
            <Text style={[styles.cardValue, { color: theme.colors.onSurface }]}>
              {formatPeriod(totalSeconds)}
            </Text>
          </View>

          <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.surfaceVariant }]}>
            <Text style={[styles.cardLabel, { color: theme.colors.onSurfaceVariant }]}>Contacts</Text>
            <Text style={[styles.cardValue, { color: theme.colors.onSurface }]}>
              {contacts.length}
            </Text>
          </View>
        </View>

        <View style={[styles.card, styles.fullCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.surfaceVariant }]}>
          <Text style={[styles.cardLabel, { color: theme.colors.onSurfaceVariant }]}>Last Check-in</Text>
          <Text style={[styles.cardValue, { color: theme.colors.onSurface }]}>
            {formatDate(lastCheckIn)}
          </Text>
        </View>

        <Button
          mode="contained"
          onPress={onCheckIn}
          style={styles.checkInButton}
          contentStyle={styles.checkInButtonContent}
        >
          Check In
        </Button>
      </ScrollView>

      <BottomNavBar activeTab="home" />
      <BottomProgressBar remainingSeconds={remainingSeconds} totalSeconds={totalSeconds} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 24,
    paddingBottom: 8,
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  fullCard: {
    marginHorizontal: 20,
    marginTop: 12,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  checkInButton: {
    marginHorizontal: 20,
    marginTop: 28,
    marginBottom: 40,
    borderRadius: 30,
  },
  checkInButtonContent: {
    height: 50,
  },
});

export default SafetyDashboardScreen;
