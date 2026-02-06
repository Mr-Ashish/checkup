import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity, FlatList } from 'react-native';
import {
  Button,
  TextInput,
  Portal,
  IconButton,
  Menu,
  Modal,
  Dialog,
} from 'react-native-paper';
import ThemedDialog from '@/components/ThemedDialog';
import * as Contacts from 'expo-contacts';
import StepIndicator from '@/components/StepIndicator';
import { Contact } from '@/types';
import { Colors } from '@/constants/theme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { isValidEmail, isValidContact } from '@/utils/validation';
import ErrorBoundary from '@/components/ErrorBoundary';

interface ContactSetupScreenProps {
  onSave: (contacts: Contact[]) => void;
}

const ContactSetupScreen: React.FC<ContactSetupScreenProps> = ({ onSave }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [menuVisible, setMenuVisible] = useState<number | null>(null);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [deviceContacts, setDeviceContacts] = useState<Contacts.Contact[]>([]);

  // ── edit handlers ──────────────────────────────────────────────────────────

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
    if (editingContact.email && !isValidEmail(editingContact.email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
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

  // ── sync handlers ──────────────────────────────────────────────────────────

  const openSyncModal = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Contact access is required to sync contacts.');
      return;
    }
    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.Name, Contacts.Fields.Emails, Contacts.Fields.PhoneNumbers],
    });
    if (data.length === 0) {
      Alert.alert('No Contacts', 'No contacts found on your device.');
      return;
    }
    setDeviceContacts(data);
    setShowSyncModal(true);
  };

  const selectDeviceContact = (contact: Contacts.Contact) => {
    setContacts((prev) => [
      ...prev,
      {
        name: contact.name || '',
        phone: contact.phoneNumbers?.[0]?.number || '',
        email: contact.emails?.[0]?.email || '',
      },
    ]);
    setShowSyncModal(false);
  };

  const handleContinue = () => {
    if (contacts.length === 0) {
      Alert.alert('Error', 'Please add at least one emergency contact.');
      return;
    }
    onSave(contacts);
  };

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        {/* Back arrow — overlaid on StepIndicator row; no-op in linear onboarding flow */}
        <TouchableOpacity style={styles.backBtn} onPress={() => {}}>
          <MaterialCommunityIcons name="chevron-left" size={24} color={Colors.dark.text} />
        </TouchableOpacity>

        <StepIndicator currentStep={2} totalSteps={3} />

        <Text style={styles.heading}>Set up your emergency contacts</Text>

        {/* ── middle (flex: 1) ── */}
        {contacts.length === 0 ? (
          <View style={styles.middle}>
            <Text style={styles.subheading}>
              Choose who to notify if you miss a check-in.{'\n'}
              These people will receive an alert if you're unresponsive.
            </Text>

            {/* Dashed-circle illustration */}
            <View style={styles.illustrationWrapper}>
              <View style={styles.dashedCircle}>
                <View style={styles.iconCard}>
                  <MaterialCommunityIcons name="account-star" size={44} color={Colors.dark.primary} />
                </View>
              </View>
              {/* "+" FAB at bottom-right of circle */}
              <View style={styles.plusFab}>
                <MaterialCommunityIcons name="plus" size={20} color={Colors.dark.text} />
              </View>
            </View>

            <Text style={styles.emptyTitle}>No contacts added yet</Text>
            <Text style={styles.emptySubtext}>
              Sync your phonebook to easily select your{'\n'}
              trusted emergency contacts.
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionLabel}>Active Emergency Contacts</Text>
            <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
              {contacts.map((contact, index) => (
                <View key={index} style={styles.contactCard}>
                  <View style={styles.avatar}>
                    <MaterialCommunityIcons name="account" size={22} color={Colors.dark.text} />
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>{contact.name || 'Unknown'}</Text>
                    <Text style={styles.contactDetail}>{contact.phone || contact.email || 'No details'}</Text>
                  </View>
                  <Menu
                    visible={menuVisible === index}
                    onDismiss={() => setMenuVisible(null)}
                    style={styles.menu}
                    anchor={<IconButton icon="dots-vertical" onPress={() => setMenuVisible(index)} />}
                  >
                    <Menu.Item onPress={() => { setMenuVisible(null); startEdit(index); }} title="Edit" />
                    <Menu.Item onPress={() => removeContact(index)} title="Remove" />
                  </Menu>
                </View>
              ))}
            </ScrollView>
          </>
        )}

        {/* ── bottom buttons ── */}
        {contacts.length === 0 ? (
          <View style={styles.bottomButtons}>
            <TouchableOpacity onPress={openSyncModal} style={styles.syncBtn}>
              <MaterialCommunityIcons name="sync" size={18} color={Colors.dark.text} style={styles.syncIcon} />
              <Text style={styles.syncBtnText}>Sync Phone Contacts</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={startAdd} style={styles.manualBtn}>
              <Text style={styles.manualBtnText}>Add Manually</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.footer}>
            <TouchableOpacity onPress={startAdd} style={styles.manualBtn}>
              <Text style={styles.manualBtnText}>Add Contact</Text>
            </TouchableOpacity>
            <Button
              mode="contained"
              onPress={handleContinue}
              style={styles.continueButton}
              contentStyle={styles.buttonContent}
            >
              Continue
            </Button>
          </View>
        )}

        {/* ── add / edit dialog ── */}
        <Portal>
          <ThemedDialog visible={editingContact !== null} onDismiss={cancelEdit}>
            <Dialog.Title style={styles.dialogTitle}>
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
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={cancelEdit}>Cancel</Button>
              <Button onPress={saveEdit} disabled={!isValidContact(editingContact ?? undefined)}>
                Save
              </Button>
            </Dialog.Actions>
          </ThemedDialog>
        </Portal>

        {/* ── device-contact sync picker ── */}
        <Portal>
          <Modal
            visible={showSyncModal}
            onDismiss={() => setShowSyncModal(false)}
            contentContainerStyle={styles.modal}
          >
            <Text style={styles.modalTitle}>Select a Contact</Text>
            <FlatList
              data={deviceContacts}
              keyExtractor={(_, i) => i.toString()}
              style={styles.modalList}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => selectDeviceContact(item)} style={styles.modalItem}>
                  <Text style={styles.modalItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <Button onPress={() => setShowSyncModal(false)} style={styles.modalCancel}>
              Cancel
            </Button>
          </Modal>
        </Portal>
      </View>
    </ErrorBoundary>
  );
};

// ── styles ─────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // layout
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    paddingHorizontal: 20,
  },
  backBtn: {
    position: 'absolute',
    left: 16,
    top: 22,
    zIndex: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: 4,
  },

  // ── empty state ──
  middle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subheading: {
    fontSize: 14,
    color: Colors.dark.mutedText,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  illustrationWrapper: {
    width: 164,
    height: 164,
    position: 'relative',
    marginBottom: 24,
  },
  dashedCircle: {
    width: 164,
    height: 164,
    borderRadius: 82,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.dark.primary + '55',
    backgroundColor: Colors.dark.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCard: {
    width: 84,
    height: 84,
    borderRadius: 18,
    backgroundColor: Colors.dark.primary + '25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusFab: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.dark.tealGlow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 13,
    color: Colors.dark.mutedText,
    textAlign: 'center',
    lineHeight: 18,
  },

  // ── populated state ──
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.dark.mutedText,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  list: {
    flex: 1,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.avatarPlaceholder,
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
    color: Colors.dark.text,
  },
  contactDetail: {
    fontSize: 13,
    color: Colors.dark.mutedText,
    marginTop: 2,
  },
  menu: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 8,
  },

  // ── buttons ──
  bottomButtons: {
    gap: 12,
    paddingBottom: 48,
  },
  syncBtn: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 30,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncIcon: {
    marginRight: 8,
  },
  syncBtnText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
  },
  manualBtn: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  manualBtnText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    gap: 12,
    paddingBottom: 48,
  },
  continueButton: {
    borderRadius: 30,
  },
  buttonContent: {
    height: 48,
  },

  // ── dialogs ──
  dialogTitle: {
    color: Colors.dark.text,
  },
  dialogInput: {
    marginBottom: 12,
  },
  modal: {
    backgroundColor: Colors.dark.surface,
    padding: 20,
    borderRadius: 12,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalList: {
    maxHeight: 300,
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.cardBorder,
  },
  modalItemText: {
    fontSize: 15,
    color: Colors.dark.text,
  },
  modalCancel: {
    marginTop: 12,
  },
});

export default ContactSetupScreen;
