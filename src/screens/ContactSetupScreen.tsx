import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import {
  Button,
  TextInput,
  Dialog,
  Portal,
  IconButton,
  Menu,
  useTheme,
} from 'react-native-paper';
import * as Contacts from 'expo-contacts';
import StepIndicator from '@/components/StepIndicator';
import { Contact } from '@/types';
import { Colors } from '@/constants/theme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface ContactSetupScreenProps {
  onSave: (contacts: Contact[]) => void;
}

const ContactSetupScreen: React.FC<ContactSetupScreenProps> = ({ onSave }) => {
  const theme = useTheme();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [menuVisible, setMenuVisible] = useState<number | null>(null);
  const [searchText, setSearchText] = useState<string>('');

  const filteredContacts = searchText.trim()
    ? contacts.filter(
        (c) =>
          (c.name || '').toLowerCase().includes(searchText.toLowerCase()) ||
          (c.phone || '').includes(searchText) ||
          (c.email || '').toLowerCase().includes(searchText.toLowerCase())
      )
    : contacts;

  const startAdd = useCallback(() => {
    setEditingContact({ name: '', phone: '', email: '' });
    setEditingIndex(-1);
  }, []);

  const startEdit = useCallback((index: number) => {
    setEditingContact({ ...contacts[index] });
    setEditingIndex(index);
  }, [contacts]);

  const cancelEdit = useCallback(() => {
    setEditingContact(null);
    setEditingIndex(null);
  }, []);

  const saveEdit = useCallback(() => {
    if (!editingContact) return;
    if (editingIndex === -1) {
      setContacts((prev) => [...prev, editingContact]);
    } else if (editingIndex !== null) {
      setContacts((prev) => {
        const updated = [...prev];
        updated[editingIndex] = editingContact;
        return updated;
      });
    }
    setEditingContact(null);
    setEditingIndex(null);
  }, [editingContact, editingIndex]);

  const removeContact = useCallback((index: number) => {
    setContacts((prev) => prev.filter((_, i) => i !== index));
    setMenuVisible(null);
  }, []);

  const updateEditingContact = useCallback((field: keyof Contact, value: string) => {
    setEditingContact((prev) => (prev ? { ...prev, [field]: value } : prev));
  }, []);

  const pickFromDevice = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Contact access is required to pick contacts.');
      return;
    }
    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.Name, Contacts.Fields.Emails, Contacts.Fields.PhoneNumbers],
    });
    if (data.length === 0) {
      Alert.alert('No Contacts', 'No contacts found on your device.');
      return;
    }
    // Pick the first contact for simplicity; a FlatList picker could be added later
    const picked = data[0];
    setEditingContact((prev) => ({
      ...(prev || {}),
      name: picked.name || prev?.name || '',
      email: picked.emails?.[0]?.email || prev?.email || '',
      phone: picked.phoneNumbers?.[0]?.number || prev?.phone || '',
    }));
  };

  const handleContinue = () => {
    if (contacts.length === 0) {
      Alert.alert('Error', 'Please add at least one emergency contact.');
      return;
    }
    onSave(contacts);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StepIndicator currentStep={2} totalSteps={3} />

      <Text style={[styles.heading, { color: theme.colors.onSurface }]}>
        Set up your emergency contacts
      </Text>

      <TextInput
        label="Search contacts..."
        value={searchText}
        onChangeText={setSearchText}
        mode="outlined"
        style={styles.search}
        left={<TextInput.Icon icon="magnify" />}
      />

      <Text style={[styles.sectionLabel, { color: theme.colors.onSurfaceVariant }]}>
        Active Emergency Contacts
      </Text>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {filteredContacts.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
            No contacts added yet
          </Text>
        ) : (
          filteredContacts.map((contact, index) => {
            // Find original index for menu actions
            const originalIndex = contacts.indexOf(contact);
            return (
              <View
                key={originalIndex}
                style={[styles.contactCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.surfaceVariant }]}
              >
                <View style={[styles.avatar, { backgroundColor: Colors.dark.avatarPlaceholder }]}>
                  <MaterialCommunityIcons name="account" size={22} color={Colors.dark.text} />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={[styles.contactName, { color: theme.colors.onSurface }]}>
                    {contact.name || 'Unknown'}
                  </Text>
                  <Text style={[styles.contactDetail, { color: theme.colors.onSurfaceVariant }]}>
                    {contact.phone || contact.email || 'No details'}
                  </Text>
                </View>
                <Menu
                  visible={menuVisible === originalIndex}
                  onDismiss={() => setMenuVisible(null)}
                  anchor={
                    <IconButton
                      icon="dots-vertical"
                      onPress={() => setMenuVisible(originalIndex)}
                    />
                  }
                >
                  <Menu.Item onPress={() => { setMenuVisible(null); startEdit(originalIndex); }} title="Edit" />
                  <Menu.Item onPress={() => removeContact(originalIndex)} title="Remove" />
                </Menu>
              </View>
            );
          })
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button mode="outlined" onPress={startAdd} style={styles.addButton}>
          Add Contact
        </Button>
        <Button
          mode="contained"
          onPress={handleContinue}
          disabled={contacts.length === 0}
          style={styles.continueButton}
          contentStyle={styles.buttonContent}
        >
          Continue
        </Button>
      </View>

      <Portal>
        <Dialog visible={editingContact !== null} onDismiss={cancelEdit}>
          <Dialog.Title>
            {editingIndex === -1 ? 'Add Contact' : 'Edit Contact'}
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              value={editingContact?.name || ''}
              onChangeText={(text) => updateEditingContact('name', text)}
              label="Name"
              mode="outlined"
              style={styles.dialogInput}
            />
            <TextInput
              value={editingContact?.phone || ''}
              onChangeText={(text) => updateEditingContact('phone', text)}
              label="Phone Number"
              mode="outlined"
              style={styles.dialogInput}
              keyboardType="phone-pad"
            />
            <TextInput
              value={editingContact?.email || ''}
              onChangeText={(text) => updateEditingContact('email', text)}
              label="Email"
              mode="outlined"
              style={styles.dialogInput}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Button mode="outlined" onPress={pickFromDevice} style={styles.pickButton}>
              Pick from Device Contacts
            </Button>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={cancelEdit}>Cancel</Button>
            <Button onPress={saveEdit}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  search: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  list: {
    flex: 1,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 32,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '600',
  },
  contactDetail: {
    fontSize: 13,
    marginTop: 2,
  },
  footer: {
    paddingBottom: 48,
    gap: 12,
  },
  addButton: {
    borderRadius: 30,
  },
  continueButton: {
    borderRadius: 30,
  },
  buttonContent: {
    height: 48,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dialogInput: {
    marginBottom: 12,
  },
  pickButton: {
    marginTop: 8,
  },
});

export default ContactSetupScreen;
