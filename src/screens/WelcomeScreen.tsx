import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors } from '@/constants/theme';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        <View style={styles.iconWrapper}>
          <MaterialCommunityIcons
            name="shield-check"
            size={100}
            color={Colors.dark.primary}
          />
        </View>

        <Text style={styles.tagline}>
          Stay Safe by Staying in Touch
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={onGetStarted}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Get Started
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    flexDirection: 'column',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    shadowColor: Colors.dark.tealGlow,
    shadowRadius: 30,
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  tagline: {
    color: Colors.dark.text,
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 30,
  },
  buttonContainer: {
    paddingHorizontal: 40,
    paddingBottom: 60,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    borderRadius: 30,
  },
  buttonContent: {
    height: 52,
  },
});

export default WelcomeScreen;
