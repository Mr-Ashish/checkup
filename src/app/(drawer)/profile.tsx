import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import BottomNavBar from '@/components/BottomNavBar';

export default function ProfileScreen() {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: theme.colors.primary,
    },
    text: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 10,
      color: theme.colors.onSurface,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.text}>User profile information goes here.</Text>
        <Text style={styles.text}>You can add user details, avatar, etc.</Text>
      </View>
      <BottomNavBar activeTab="profile" />
    </View>
  );
}
