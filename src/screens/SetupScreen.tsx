import React, { useState, useRef, useMemo, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform, Animated, Dimensions, KeyboardType } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Contact } from '../types';
import { Colors } from '@/constants/theme';
import { CONTACT_INDICES, CONTACT_FIELDS, ContactField, CONTACT_PLACEHOLDERS, CONTACT_KEYBOARD_TYPES, PERIOD_OPTIONS, ERROR_MESSAGES } from '../constants/setup';

interface SetupScreenProps {
  onSave: (contacts: Contact[], period: number) => void;
}

interface Step {
  contactIndex?: number;
  field?: ContactField;
  type?: 'period';
}

const contactSteps: Step[] = CONTACT_INDICES.flatMap(contactIndex =>
  CONTACT_FIELDS.map(field => ({ contactIndex, field }))
);
const periodStep: Step = { type: 'period' };
const steps = [...contactSteps, periodStep];

const SetupScreen: React.FC<SetupScreenProps> = ({ onSave }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [contacts, setContacts] = useState<Contact[]>([
    { name: '', phone: '', email: '' },
    { name: '', phone: '', email: '' },
  ]);
  const [period, setPeriod] = useState<number>(1);
  const translateXAnim = useRef<Animated.Value>(new Animated.Value(0)).current;
  const { width } = Dimensions.get('window');

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;
  const isNextEnabled = currentStepData.type === 'period' || (currentStepData.contactIndex !== undefined && currentStepData.field !== undefined && (contacts[currentStepData.contactIndex]?.[currentStepData.field] || '').trim() !== '');

  const handleSave = () => {
    const validContacts = contacts.filter(c => (c.email && c.email.trim() !== '') || (c.phone && c.phone.trim() !== ''));
    if (validContacts.length === 0) {
      Alert.alert('Error', ERROR_MESSAGES.noContacts);
      return;
    }
    onSave(validContacts, period);
  };

  const updateContact = (index: number, field: keyof Contact, value: string) => {
    const newContacts = [...contacts];
    newContacts[index] = { ...newContacts[index], [field]: value };
    setContacts(newContacts);
  };

  const handleNext = () => {
    if (isLastStep) {
      handleSave();
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

  const renderStep = () => {
    if (currentStepData.type === 'period') {
      return (
        <View style={styles.stepContainer}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={period}
              onValueChange={(itemValue: number) => setPeriod(itemValue)}
            >
              {PERIOD_OPTIONS.map(option => (
                <Picker.Item key={option.value} label={option.label} value={option.value} />
              ))}
            </Picker>
          </View>
        </View>
      );
    } else {
      const contactIndex = currentStepData.contactIndex!;
      const field = currentStepData.field!;
      const value = contacts[contactIndex][field];

      return (
        <View style={styles.stepContainer}>
          <TextInput
            value={value}
            onChangeText={(text) => updateContact(contactIndex, field, text)}
            placeholder={CONTACT_PLACEHOLDERS[field]}
            style={styles.input}
            keyboardType={CONTACT_KEYBOARD_TYPES[field] as KeyboardType}
            autoCapitalize={field === 'name' ? 'words' : 'none'}
            autoCorrect={false}
          />
        </View>
      );
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Animated.View style={[styles.content, { transform: [{ translateX: translateXAnim }] }]}>
        {renderStep()}
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
  stepContainer: {
    alignItems: 'center',
  },
  input: {
    borderWidth: 2,
    borderColor: Colors.light.primary,
    padding: 15,
    width: '100%',
    borderRadius: 10,
    fontSize: 18,
    color: Colors.light.text,
    backgroundColor: Colors.light.surface,
  },
  pickerContainer: {
    borderWidth: 2,
    borderColor: Colors.light.primary,
    borderRadius: 10,
    width: '100%',
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

export default SetupScreen;