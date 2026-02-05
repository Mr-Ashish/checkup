import React, { useState, useCallback } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';
import StepIndicator from '@/components/StepIndicator';
import { User } from '@/types';

interface UserInfoScreenProps {
  onSaveUser: (user: User) => void;
}

const UserInfoScreen: React.FC<UserInfoScreenProps> = ({ onSaveUser }) => {
  const theme = useTheme();
  const [user, setUser] = useState<User>({ name: '', phone: '', email: '' });

  const updateField = useCallback((field: keyof User, value: string) => {
    setUser(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleContinue = useCallback(() => {
    onSaveUser(user);
  }, [user, onSaveUser]);

  const isNextEnabled = (user.name || '').trim().length > 0;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StepIndicator currentStep={1} totalSteps={3} />

      <View style={styles.form}>
        <TextInput
          label="Full Name"
          value={user.name || ''}
          onChangeText={(text) => updateField('name', text)}
          mode="outlined"
          style={styles.input}
          autoCapitalize="words"
          autoCorrect={false}
        />
        <TextInput
          label="Phone Number"
          value={user.phone || ''}
          onChangeText={(text) => updateField('phone', text)}
          mode="outlined"
          style={styles.input}
          keyboardType="phone-pad"
          autoCorrect={false}
        />
        <TextInput
          label="Email"
          value={user.email || ''}
          onChangeText={(text) => updateField('email', text)}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleContinue}
          disabled={!isNextEnabled}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Continue
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    gap: 16,
  },
  input: {
    width: '100%',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    borderRadius: 30,
  },
  buttonContent: {
    height: 52,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserInfoScreen;
