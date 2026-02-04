import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList } from 'react-native';
import { Button, TextInput, Modal, Portal, DataTable, Dialog, useTheme, IconButton, Menu } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { Contact as EmergencyContact } from '../../types';
import { saveSettings, loadSettings } from '../../utils/storage';
import { Alert } from 'react-native';
import * as Contacts from 'expo-contacts';

export default function SettingsScreen() {
  const theme = useTheme();
  const router = useRouter();

  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [selectedDays, setSelectedDays] = useState<number>(0);
  const [selectedHours, setSelectedHours] = useState<number>(1);
  const [contactList, setContactList] = useState<Contacts.Contact[]>([]);
  const [showContactPicker, setShowContactPicker] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [menuVisible, setMenuVisible] = useState<number | null>(null);
  const [showResetDialog, setShowResetDialog] = useState<boolean>(false);

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 20,
      backgroundColor: theme.colors.background,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: theme.colors.primary,
      fontFamily: theme.fonts.titleLarge.fontFamily,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 10,
      marginTop: 20,
      color: theme.colors.onSurface,
      fontFamily: theme.fonts.titleMedium.fontFamily,
    },
    input: {
      width: '100%',
      marginBottom: 10,
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: theme.colors.outline,
      borderRadius: 8,
      marginBottom: 20,
      width: '100%',
      backgroundColor: theme.colors.background,
      elevation: 2,
    },
    button: {
      marginTop: 10,
      marginBottom: 10,
      borderRadius: 8,
      elevation: 4,
    },
    card: {
      marginBottom: 10,
      padding: 10,
    },
    contactActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    pickButton: {
      marginLeft: 10,
    },
    modal: {
      backgroundColor: theme.colors.surface,
      padding: 20,
      margin: 20,
      borderRadius: 8,
      maxHeight: '80%',
    },
    contactItem: {
      marginBottom: 10,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    actionButton: {
      marginLeft: 5,
      marginRight: 5,
    },
    editForm: {
      marginTop: 20,
      padding: 10,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      borderRadius: 8,
    },
    warning: {
      color: theme.colors.error,
      fontSize: 16,
      textAlign: 'center',
      marginVertical: 10,
      fontFamily: theme.fonts.bodyLarge.fontFamily,
    },
    tableContainer: {
      position: 'relative',
    },
    addButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      backgroundColor: theme.colors.secondaryContainer,
    },
    periodContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    periodPicker: {
      flex: 1,
      marginHorizontal: 5,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      borderRadius: 8,
      backgroundColor: theme.colors.surface,
      elevation: 2,
    },
    resetButton: {
      marginTop: 20,
      marginBottom: 10,
      borderRadius: 8,
      backgroundColor: theme.colors.error,
    },
  });

  useEffect(() => {
    const load = async () => {
      try {
        const loaded = await loadSettings();
        if (loaded) {
          setContacts(loaded.contacts || []);
          const period = loaded.period || 1;
          setSelectedDays(Math.floor(period / 24));
          setSelectedHours(period % 24);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    const validContacts = contacts.filter(c => c.email || c.phone || c.name);
    if (validContacts.length === 0) {
      Alert.alert('Error', 'Please enter at least one emergency contact.');
      return;
    }
    const period = selectedDays * 24 + selectedHours;
    if (period === 0) {
      Alert.alert('Error', 'Please select a valid check-in period.');
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

  const handleReset = async () => {
    await saveSettings(null);
    setShowResetDialog(false);
    Alert.alert('App Reset', 'The app has been reset. Please restart the app to go through onboarding again.');
    // Navigate to home
    router.replace('/');
  };



  const removeContact = (index: number) => {
    const newContacts = contacts.filter((_, i) => i !== index);
    setContacts(newContacts);
  };

  const selectContact = (contact: Contacts.Contact) => {
    if (editingContact) {
      const name = contact.name;
      const email = contact.emails?.[0]?.email;
      const phone = contact.phoneNumbers?.[0]?.number;
      setEditingContact({
        ...editingContact,
        name: name || editingContact.name,
        email: email || editingContact.email,
        phone: phone || editingContact.phone,
      });
    }
    setShowContactPicker(false);
  };

  const startEdit = (index: number) => {
    setEditingContact({ ...contacts[index] });
    setEditingIndex(index);
  };

  const startAdd = () => {
    setEditingContact({});
    setEditingIndex(-1);
  };

  const cancelEdit = () => {
    setEditingContact(null);
    setEditingIndex(null);
  };

  const saveEdit = () => {
    if (!editingContact) return;
    if (editingIndex === -1) {
      setContacts([...contacts, editingContact]);
    } else if (editingIndex !== null) {
      const newContacts = [...contacts];
      newContacts[editingIndex] = editingContact;
      setContacts(newContacts);
    }
    setEditingContact(null);
    setEditingIndex(null);
  };

  const updateEditingContact = (field: keyof EmergencyContact, value: string) => {
    if (editingContact) {
      setEditingContact({ ...editingContact, [field]: value });
    }
  };

  const pickForEditing = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Contact access is required to pick contacts.');
      return;
    }
    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.Name, Contacts.Fields.Emails, Contacts.Fields.PhoneNumbers],
    });
    setContactList(data);
    setShowContactPicker(true);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <Text style={styles.sectionTitle}>Emergency Contacts</Text>
      <View style={styles.tableContainer}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Name</DataTable.Title>
            <DataTable.Title>Phone</DataTable.Title>
            <DataTable.Title>Email</DataTable.Title>
            <DataTable.Title>Actions</DataTable.Title>
          </DataTable.Header>
          {contacts.map((contact, index) => (
            <DataTable.Row key={index}>
              <DataTable.Cell>{contact.name || ''}</DataTable.Cell>
              <DataTable.Cell>{contact.phone || ''}</DataTable.Cell>
              <DataTable.Cell>{contact.email || ''}</DataTable.Cell>
              <DataTable.Cell>
                <Menu
                  visible={menuVisible === index}
                  onDismiss={() => setMenuVisible(null)}
                  anchor={<IconButton icon="dots-vertical" onPress={() => setMenuVisible(index)} />}
                  style={{ backgroundColor: theme.colors.background }}
                >
                  <Menu.Item onPress={() => { setMenuVisible(null); startEdit(index); }} title="Edit" />
                  <Menu.Item onPress={() => { setMenuVisible(null); removeContact(index); }} title="Remove" />
                </Menu>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
        <IconButton icon="plus" size={24} onPress={startAdd} style={styles.addButton} />
      </View>

      {contacts.length === 0 && (
        <Text style={styles.warning}>Warning: At least one emergency contact is required.</Text>
      )}

      <Portal>
        <Dialog visible={editingContact !== null} onDismiss={cancelEdit}>
          <Dialog.Title style={{ fontFamily: theme.fonts.titleLarge.fontFamily }}>
            {editingIndex === -1 ? 'Add Contact' : 'Edit Contact'}
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              value={editingContact?.name || ''}
              onChangeText={(text) => updateEditingContact('name', text)}
              placeholder="Name"
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              value={editingContact?.phone || ''}
              onChangeText={(text) => updateEditingContact('phone', text)}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              value={editingContact?.email || ''}
              onChangeText={(text) => updateEditingContact('email', text)}
              placeholder="Email"
              keyboardType="email-address"
              mode="outlined"
              style={styles.input}
            />
            <Button mode="outlined" onPress={pickForEditing} style={styles.pickButton}>
              Pick from Contacts
            </Button>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={cancelEdit}>Cancel</Button>
            <Button onPress={saveEdit}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Text style={styles.sectionTitle}>Check-in Period</Text>
      <View style={styles.periodContainer}>
        <View style={styles.periodPicker}>
          <Picker
            selectedValue={selectedDays}
            onValueChange={(itemValue: number) => setSelectedDays(itemValue)}
          >
            {Array.from({ length: 8 }, (_, i) => (
              <Picker.Item key={i} label={`${i} day${i !== 1 ? 's' : ''}`} value={i} />
            ))}
          </Picker>
        </View>
        <View style={styles.periodPicker}>
          <Picker
            selectedValue={selectedHours}
            onValueChange={(itemValue: number) => setSelectedHours(itemValue)}
          >
            {Array.from({ length: 24 }, (_, i) => (
              <Picker.Item key={i} label={`${i} hour${i !== 1 ? 's' : ''}`} value={i} />
            ))}
          </Picker>
        </View>
      </View>
      <Button mode="contained" onPress={handleSave} style={styles.button}>
        Save Settings
      </Button>
      <Button mode="contained" onPress={() => setShowResetDialog(true)} style={styles.resetButton}>
        Reset App
      </Button>

      <Portal>
        <Modal visible={showContactPicker} onDismiss={() => setShowContactPicker(false)} contentContainerStyle={styles.modal}>
          <Text style={styles.title}>Select a Contact</Text>
          <FlatList
            data={contactList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }: { item: Contacts.Contact }) => (
              <Button mode="outlined" onPress={() => selectContact(item)} style={styles.contactItem}>
                {item.name}
              </Button>
            )}
          />
          <Button onPress={() => setShowContactPicker(false)}>Cancel</Button>
        </Modal>

        <Dialog visible={showResetDialog} onDismiss={() => setShowResetDialog(false)} style={{ backgroundColor: theme.colors.background }}>
          <Dialog.Title>Reset App</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to reset the app? This will clear all your settings, emergency contacts, and user information. You will need to go through the onboarding process again.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowResetDialog(false)}>Cancel</Button>
            <Button onPress={handleReset}>Reset</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}