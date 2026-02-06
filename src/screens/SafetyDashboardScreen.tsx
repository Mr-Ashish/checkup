import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors } from '@/constants/theme';
import { calculateTimeRemaining } from '@/utils/time';
import BottomNavBar from '@/components/BottomNavBar';
import BottomProgressBar from '@/components/BottomProgressBar';
import { Contact } from '@/types';

interface SafetyDashboardScreenProps {
  remainingSeconds: number;
  totalSeconds: number;
  contacts: Contact[];
  onCheckIn: () => void;
}

const SafetyDashboardScreen: React.FC<SafetyDashboardScreenProps> = ({
  remainingSeconds,
  totalSeconds,
  contacts,
  onCheckIn,
}) => {
  const router = useRouter();
  const time = calculateTimeRemaining(remainingSeconds * 1000);
  const hh = String(time.hours).padStart(2, '0');
  const mm = String(time.mins).padStart(2, '0');
  const ss = String(time.secs).padStart(2, '0');

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <MaterialCommunityIcons name="shield" size={28} color={Colors.dark.primary} />
          <Text style={styles.headerTitle}>Safety Dashboard</Text>
          <TouchableOpacity onPress={() => router.push('/settings' as any)}>
            <MaterialCommunityIcons name="cog" size={24} color={Colors.dark.mutedText} />
          </TouchableOpacity>
        </View>

        {/* ── Session Active badge ── */}
        <View style={styles.badgeRow}>
          <View style={styles.sessionBadge}>
            <View style={styles.greenDot} />
            <Text style={styles.sessionText}>SESSION ACTIVE</Text>
          </View>
        </View>

        {/* ── Next check-in label ── */}
        <Text style={styles.nextLabel}>NEXT CHECK-IN IN</Text>

        {/* ── Timer boxes ── */}
        <View style={styles.timerRow}>
          <View style={styles.timerBox}>
            <Text style={styles.timerNumber}>{hh}</Text>
            <Text style={styles.timerLabel}>Hours</Text>
          </View>
          <View style={styles.timerBox}>
            <Text style={styles.timerNumber}>{mm}</Text>
            <Text style={styles.timerLabel}>Minutes</Text>
          </View>
          <View style={styles.timerBox}>
            <Text style={styles.timerNumber}>{ss}</Text>
            <Text style={styles.timerLabel}>Seconds</Text>
          </View>
        </View>

        {/* ── I'm Safe button ── */}
        <TouchableOpacity onPress={onCheckIn} style={styles.safeButton} activeOpacity={0.82}>
          <MaterialCommunityIcons name="check-circle" size={24} color="#FFFFFF" style={styles.safeIcon} />
          <Text style={styles.safeText}>I'm Safe</Text>
        </TouchableOpacity>

        {/* ── Active Emergency Contacts ── */}
        <Text style={styles.sectionHeading}>Active Emergency Contacts</Text>
        {contacts.map((contact, index) => (
          <View key={index} style={styles.contactCard}>
            <View style={styles.contactAvatar}>
              <MaterialCommunityIcons name="account" size={26} color={Colors.dark.text} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{contact.name || 'Unknown'}</Text>
              <Text style={styles.contactSub}>Will be notified if check-in missed</Text>
            </View>
            <MaterialCommunityIcons name="check-circle" size={24} color={Colors.dark.safeGreen} />
          </View>
        ))}

        {/* ── Broadcasting Live Location card ── */}
        <View style={styles.locationCard}>
          <View style={styles.locationMapArea}>
            <View style={styles.locationPinCircle}>
              <MaterialCommunityIcons name="map-marker" size={22} color="#FFFFFF" />
            </View>
          </View>
          <Text style={styles.locationText}>Broadcasting Live Location</Text>
        </View>

      </ScrollView>

      <BottomNavBar activeTab="dashboard" />
      <BottomProgressBar remainingSeconds={remainingSeconds} totalSeconds={totalSeconds} />
    </View>
  );
};

// ── styles ─────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollView: {
    flex: 1,
  },

  // ── header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.dark.text,
  },

  // ── session badge ──
  badgeRow: {
    alignItems: 'center',
    marginVertical: 14,
  },
  sessionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.dark.safeGreen + '44',
    backgroundColor: Colors.dark.safeGreen + '12',
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.dark.safeGreen,
  },
  sessionText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.dark.safeGreen,
    letterSpacing: 1.2,
  },

  // ── next check-in label ──
  nextLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.dark.mutedText,
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 16,
  },

  // ── timer boxes ──
  timerRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  timerBox: {
    flex: 1,
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
    borderRadius: 14,
    paddingVertical: 22,
    alignItems: 'center',
  },
  timerNumber: {
    fontSize: 44,
    fontWeight: '700',
    color: Colors.dark.text,
  },
  timerLabel: {
    fontSize: 13,
    color: Colors.dark.mutedText,
    marginTop: 4,
  },

  // ── I'm Safe button ──
  safeButton: {
    marginHorizontal: 20,
    backgroundColor: Colors.dark.primary,
    borderRadius: 30,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  safeIcon: {
    marginRight: 10,
  },
  safeText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },

  // ── contact cards ──
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.dark.text,
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.surface,
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.dark.avatarPlaceholder,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  contactSub: {
    fontSize: 13,
    color: Colors.dark.mutedText,
    marginTop: 2,
  },

  // ── Broadcasting Live Location ──
  locationCard: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 40,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: Colors.dark.surface,
  },
  locationMapArea: {
    height: 90,
    backgroundColor: '#2d4a3e',   // dark muted green — map-area suggestion
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationPinCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.dark.tealGlow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 3,
  },
  locationText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.dark.text,
    padding: 14,
    textAlign: 'center',
  },
});

export default SafetyDashboardScreen;
