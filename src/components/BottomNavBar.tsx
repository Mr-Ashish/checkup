import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors } from '@/constants/theme';

interface BottomNavBarProps {
  activeTab?: 'home' | 'settings';
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab = 'home' }) => {
  const router = useRouter();
  const homeActive = activeTab === 'home';

  return (
    <View style={styles.bar}>
      <TouchableOpacity style={styles.tab} activeOpacity={homeActive ? 1 : 0.6}>
        <MaterialCommunityIcons
          name="shield-check"
          size={22}
          color={homeActive ? Colors.dark.primary : Colors.dark.mutedText}
        />
        <Text style={[styles.label, { color: homeActive ? Colors.dark.primary : Colors.dark.mutedText }]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={() => router.push('/settings')} activeOpacity={0.6}>
        <MaterialCommunityIcons
          name="cog"
          size={22}
          color={activeTab === 'settings' ? Colors.dark.primary : Colors.dark.mutedText}
        />
        <Text style={[styles.label, { color: activeTab === 'settings' ? Colors.dark.primary : Colors.dark.mutedText }]}>
          Settings
        </Text>
      </TouchableOpacity>
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
