import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

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
      <Button title="Check In" onPress={onCheckIn} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  time: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'blue',
    marginBottom: 30,
    textAlign: 'center',
  },
});

export default MainScreen;