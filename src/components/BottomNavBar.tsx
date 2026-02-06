import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors } from '@/constants/theme';

interface BottomNavBarProps {
  activeTab?: 'dashboard' | 'history' | 'contacts' | 'profile';
}

const TABS = [
  { id: 'dashboard', icon: 'home',            label: 'Dashboard', path: '/' },
  { id: 'history',   icon: 'clock-outline',   label: 'History',   path: '/' },          // screen TBD
  { id: 'contacts',  icon: 'account-group',   label: 'Contacts',  path: '/settings' },
  { id: 'profile',   icon: 'account',         label: 'Profile',   path: '/profile' },
] as const;

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab = 'dashboard' }) => {
  const router = useRouter();

  return (
    <View style={styles.bar}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        const color = isActive ? Colors.dark.primary : Colors.dark.mutedText;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => router.replace(tab.path as any)}
            activeOpacity={0.6}
          >
            <MaterialCommunityIcons name={tab.icon} size={22} color={color} />
            <Text style={[styles.label, { color }]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.cardBorder,
    paddingVertical: 10,
    paddingBottom: 24,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
  },
});

export default BottomNavBar;
