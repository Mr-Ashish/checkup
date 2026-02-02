import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Animated, Dimensions } from 'react-native';
import { Colors } from '@/constants/theme';
import { User } from '../types';

interface OnboardingScreenProps {
  onSaveUser: (user: User) => void;
}

const steps = [
  { key: 'name', label: 'What is your name?', placeholder: 'Enter your full name', keyboardType: 'default' },
  { key: 'phone', label: 'What is your phone number?', placeholder: 'Enter your phone number', keyboardType: 'phone-pad' },
  { key: 'email', label: 'What is your email address?', placeholder: 'Enter your email', keyboardType: 'email-address' },
];

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onSaveUser }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [user, setUser] = useState<User>({ name: '', phone: '', email: '' });
  const translateXAnim = useRef(new Animated.Value(0)).current;
  const { width } = Dimensions.get('window');

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleInputChange = (value: string) => {
    setUser(prev => ({ ...prev, [currentStepData.key]: value }));
  };

  const isNextEnabled = user[currentStepData.key as keyof User]?.trim() !== '';

  const handleNext = () => {
    if (isLastStep) {
      onSaveUser(user);
    } else {
      Animated.timing(translateXAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentStep(currentStep + 1);
        translateXAnim.setValue(width);
        Animated.timing(translateXAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      Animated.timing(translateXAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentStep(currentStep - 1);
        translateXAnim.setValue(-width);
        Animated.timing(translateXAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Animated.View style={[styles.content, { transform: [{ translateX: translateXAnim }] }]}>
        <TextInput
          style={styles.input}
          placeholder={currentStepData.placeholder}
          value={user[currentStepData.key as keyof User] || ''}
          onChangeText={handleInputChange}
          keyboardType={currentStepData.keyboardType as any}
          autoCapitalize={currentStepData.key === 'name' ? 'words' : 'none'}
          autoCorrect={false}
        />
      </Animated.View>
      <View style={styles.footer}>
        <View style={styles.stepIndicator}>
          {steps.map((_, index) => (
            <View key={index} style={[styles.stepDot, index === currentStep && styles.stepDotActive]} />
          ))}
        </View>
        <View style={styles.arrows}>
          {!isFirstStep && (
            <TouchableOpacity onPress={handlePrevious} style={styles.arrowButton}>
              <Text style={styles.arrowText}>‹</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleNext} style={[styles.arrowButton, !isNextEnabled && styles.arrowButtonDisabled]} disabled={!isNextEnabled}>
            <Text style={[styles.arrowText, !isNextEnabled && styles.arrowTextDisabled]}>{isLastStep ? 'Done' : '›'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: Colors.light.primary,
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
    color: Colors.light.text,
    backgroundColor: Colors.light.surface,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.light.secondary,
    marginHorizontal: 5,
  },
  stepDotActive: {
    backgroundColor: Colors.light.primary,
  },
  arrows: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  arrowButton: {
    padding: 15,
    backgroundColor: Colors.light.primary,
    borderRadius: 50,
    minWidth: 60,
    alignItems: 'center',
  },
  arrowButtonDisabled: {
    backgroundColor: Colors.light.surface,
  },
  arrowText: {
    fontSize: 24,
    color: Colors.light.onPrimary,
    fontWeight: 'bold',
  },
  arrowTextDisabled: {
    color: Colors.light.onSurfaceDisabled,
  },
});

export default OnboardingScreen;