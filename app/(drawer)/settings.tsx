import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { Contact } from '../../src/types';
import { saveSettings, loadSettings } from '../../src/utils/storage';
import { Alert } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#6200EE',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    alignSelf: 'flex-start',
    width: '100%',
    color: '#49454F',
  },
  input: {
    width: '100%',
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#79747E',
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  button: {
    marginTop: 20,
    borderRadius: 8,
    elevation: 4,
  },
});

export default function SettingsScreen() {
  const [contacts, setContacts] = useState<Contact[]>([
    { email: '' },
    { email: '' },
    { email: '' },
    { email: '' },
  ]);
  const [period, setPeriod] = useState<number>(1);

  useEffect(() => {
    const load = async () => {
      try {
        const loaded = await loadSettings();
        if (loaded) {
          setContacts(loaded.contacts);
          setPeriod(loaded.period);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    const validContacts = contacts.filter(c => c.email.trim() !== '');
    if (validContacts.length === 0) {
      Alert.alert('Error', 'Please enter at least one emergency contact.');
      return;
    }
    const settings = {
      contacts: validContacts,
      period,
      lastCheckIn: new Date(),
    };
    await saveSettings(settings);
    Alert.alert('Success', 'Settings saved!');
  };

  const updateContact = (index: number, email: string) => {
    const newContacts = [...contacts];
    newContacts[index] = { email };
    setContacts(newContacts);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Update Emergency Contacts (Emails):</Text>
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
      <Text style={styles.subtitle}>Update Check-in Period:</Text>
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
      <Button mode="contained" onPress={handleSave} style={styles.button}>
        Save Settings
      </Button>
    </ScrollView>
  );
}