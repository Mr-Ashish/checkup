import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

interface MainScreenProps {
  remainingTime: number;
  onCheckIn: () => void;
}

const MainScreen: React.FC<MainScreenProps> = ({ remainingTime, onCheckIn }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency Check-In</Text>
      <Text style={styles.subtitle}>Next Check-in in:</Text>
      <Text style={styles.time}>{remainingTime} minutes</Text>
      <TouchableOpacity style={styles.button} onPress={onCheckIn}>
        <Text style={styles.buttonText}>Check In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
    color: Colors.light.text,
  },
  time: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.light.primary,
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.light.onPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MainScreen;