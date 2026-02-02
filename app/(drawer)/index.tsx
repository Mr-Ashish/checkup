import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { saveSettings, loadSettings } from '../../src/utils/storage';
import { Settings, Contact } from '../../src/types';
// import BackgroundTimer from 'react-native-background-timer'; // Temporarily disabled for Expo compatibility
import { Linking, Alert } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA', // Light background
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#6200EE', // Primary color
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
    color: '#49454F', // On surface
  },
  input: {
    width: '100%',
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#79747E', // Outline
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
    backgroundColor: '#FFFFFF',
    elevation: 2, // Add shadow
  },
  time: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#03DAC6', // Secondary
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    borderRadius: 8,
    elevation: 4,
  },
});

export default function HomeScreen() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [contacts, setContacts] = useState<Contact[]>([
    { email: '' },
    { email: '' },
    { email: '' },
    { email: '' },
  ]);
  const [period, setPeriod] = useState<number>(1);

  useEffect(() => {
    const init = async () => {
      try {
        const loaded = await loadSettings();
        if (loaded) {
          setSettings(loaded);
          startTimer(loaded);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        // Handle error, perhaps show alert or reset
      }
    };
    init();
  }, []);

  const startTimer = (currentSettings: Settings) => {
    if (!currentSettings.lastCheckIn || !currentSettings.period) return;
    const checkInTime = new Date(currentSettings.lastCheckIn.getTime() + currentSettings.period * 60 * 60 * 1000);
    const now = new Date();
    const diff = checkInTime - now;
    if (diff > 0) {
      setTimeout(() => {
        sendAlertEmail(currentSettings.contacts);
      }, diff);
      updateRemainingTime(currentSettings);
      // Note: Interval not implemented for simplicity; remaining time updates only on re-render
    } else {
      sendAlertEmail(currentSettings.contacts);
    }
  };

  const updateRemainingTime = (currentSettings: Settings) => {
    if (!currentSettings.lastCheckIn) return;
    const checkInTime = new Date(currentSettings.lastCheckIn.getTime() + currentSettings.period * 60 * 60 * 1000);
    const now = new Date();
    const diff = Math.max(0, checkInTime - now);
    setRemainingTime(Math.floor(diff / (1000 * 60)));
  };

  const sendAlertEmail = (contacts: Contact[]) => {
    const emails = contacts.map(c => c.email).join(',');
    const subject = 'Emergency Alert';
    const body = 'The user has not checked in as scheduled.';
    Linking.openURL(`mailto:${emails}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const handleSave = async () => {
    const validContacts = contacts.filter(c => c.email.trim() !== '');
    if (validContacts.length === 0) {
      Alert.alert('Error', 'Please enter at least one emergency contact.');
      return;
    }
    const newSettings: Settings = {
      contacts: validContacts,
      period,
      lastCheckIn: new Date(),
    };
    setSettings(newSettings);
    await saveSettings(newSettings);
    startTimer(newSettings);
  };

  const updateContact = (index: number, email: string) => {
    const newContacts = [...contacts];
    newContacts[index] = { email };
    setContacts(newContacts);
  };

  const handleCheckIn = async () => {
    if (!settings) return;
    const updated: Settings = {
      ...settings,
      lastCheckIn: new Date(),
    };
    setSettings(updated);
    await saveSettings(updated);
    // BackgroundTimer.stopBackgroundTimer(); // Removed
    startTimer(updated);
  };

  if (!settings) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Emergency Check-In Setup</Text>
        <Text style={styles.subtitle}>Enter Emergency Contacts (Emails):</Text>
        {contacts.map((contact, index) => (
          <TextInput
            key={index}
            value={contact.email}
            onChangeText={(text) => updateContact(index, text)}
            placeholder={`Contact ${index + 1}`}
            keyboardType="email-address"
            mode="outlined"
            style={styles.input}
          />
        ))}
        <Text style={styles.subtitle}>Select Check-in Period:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={period}
            onValueChange={(itemValue: number) => setPeriod(itemValue)}
          >
            <Picker.Item label="1 hour" value={1} />
            <Picker.Item label="2 hours" value={2} />
            <Picker.Item label="4 hours" value={4} />
            <Picker.Item label="8 hours" value={8} />
            <Picker.Item label="12 hours" value={12} />
            <Picker.Item label="24 hours" value={24} />
          </Picker>
        </View>
        <Button mode="contained" onPress={() => handleSave()} style={styles.button}>
          Save and Start
        </Button>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency Check-In</Text>
      <Text style={styles.subtitle}>Next Check-in in:</Text>
      <Text style={styles.time}>{remainingTime} minutes</Text>
      <Button mode="contained" onPress={handleCheckIn} style={styles.button}>
        Check In
      </Button>
    </View>
  );
}
