import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Contact } from '../types';

interface SetupScreenProps {
  onSave: (contacts: Contact[], period: number) => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onSave }) => {
  const [contacts, setContacts] = useState<Contact[]>([
    { email: '' },
    { email: '' },
    { email: '' },
    { email: '' },
  ]);
  const [period, setPeriod] = useState<number>(1);

  const handleSave = () => {
    const validContacts = contacts.filter(c => c.email.trim() !== '');
    if (validContacts.length === 0) {
      Alert.alert('Error', 'Please enter at least one emergency contact.');
      return;
    }
    onSave(validContacts, period);
  };

  const updateContact = (index: number, email: string) => {
    const newContacts = [...contacts];
    newContacts[index] = { email };
    setContacts(newContacts);
  };

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
          style={styles.input}
          keyboardType="email-address"
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
      <Button title="Save and Start" onPress={handleSave} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    alignSelf: 'flex-start',
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    width: '100%',
    borderRadius: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    width: '100%',
  },
});

export default SetupScreen;