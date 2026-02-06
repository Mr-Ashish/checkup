import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Contact as EmergencyContact, Settings } from '../../types';
import BottomNavBar from '@/components/BottomNavBar';
import NumberScrollPicker from '@/components/NumberScrollPicker';
import { saveSettings, loadSettings } from '../../utils/storage';
import { isValidContact } from '../../utils/validation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Colors } from '@/constants/theme';

const RELATIONSHIP_OPTIONS = ['Friend', 'Family', 'Colleague', 'Neighbor', 'Other'];
const ROLE_LABELS = ['PRIMARY', 'SECONDARY', 'BACKUP'];
const ROLE_COLORS: Record<string, string> = {
  PRIMARY: Colors.dark.primary,          // tealPrimary
  SECONDARY: Colors.dark.statusYellow,   // statusYellow
  BACKUP: Colors.dark.mutedText,         // mutedText
};

/** Derive initials from a contact name — up to 2 uppercase chars. */
function getInitials(name?: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
}

export default function SettingsScreen() {
  const router = useRouter();

  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [selectedDays, setSelectedDays] = useState<number>(0);
  const [selectedHours, setSelectedHours] = useState<number>(1);
  const [fullSettings, setFullSettings] = useState<Settings | null>(null);

  // Edit-form state: null = list view, number = editing index, -1 = adding new
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const loaded = await loadSettings();
        if (loaded) {
          setFullSettings(loaded);
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

  // --- list-view actions ---

  const startAdd = () => {
    setEditingContact({ name: '', phone: '', email: '', relationship: 'Friend', smsAlerts: true, automatedCalls: false });
    setEditingIndex(-1);
  };

  const startEdit = (index: number) => {
    const c = contacts[index];
    setEditingContact({
      ...c,
      relationship: c.relationship || 'Friend',
      smsAlerts: c.smsAlerts ?? true,
      automatedCalls: c.automatedCalls ?? false,
    });
    setEditingIndex(index);
  };

  // --- edit-form actions ---

  const cancelEdit = () => {
    setEditingContact(null);
    setEditingIndex(null);
  };

  const saveEdit = () => {
    if (!editingContact) return;
    let updated: EmergencyContact[];
    if (editingIndex === -1) {
      updated = [...contacts, editingContact];
    } else if (editingIndex !== null) {
      updated = contacts.map((c, i) => (i === editingIndex ? editingContact : c));
    } else {
      return;
    }
    setContacts(updated);
    persistContacts(updated);
    cancelEdit();
  };

  const deleteContact = () => {
    if (editingIndex === null || editingIndex === -1) return;
    const updated = contacts.filter((_, i) => i !== editingIndex);
    setContacts(updated);
    persistContacts(updated);
    cancelEdit();
  };

  const updateField = (field: keyof EmergencyContact, value: string | boolean) => {
    setEditingContact((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  // --- persistence helpers ---

  const persistContacts = async (updated: EmergencyContact[]) => {
    if (!fullSettings) return;
    const merged: Settings = { ...fullSettings, contacts: updated };
    await saveSettings(merged);
    setFullSettings(merged);
  };

  const handleSave = async () => {
    const validContacts = contacts.filter((c) => c.email || c.phone || c.name);
    if (validContacts.length === 0) {
      Alert.alert('Error', 'Please enter at least one emergency contact.');
      return;
    }
    const period = selectedDays * 24 + selectedHours;
    if (period === 0) {
      Alert.alert('Error', 'Please select a valid check-in period.');
      return;
    }
    const merged: Settings = {
      ...fullSettings,
      contacts: validContacts,
      period,
      lastCheckIn: new Date(),
    };
    await saveSettings(merged);
    setFullSettings(merged);
    Alert.alert('Success', 'Settings saved!');
  };

  const handleReset = async () => {
    await saveSettings(null);
    await AsyncStorage.removeItem('hasSeenWelcome');
    Alert.alert('App Reset', 'The app has been reset.');
    router.replace('/');
  };

  // ─── RENDER ────────────────────────────────────────────────────────────────

  // Full-screen edit / add form
  if (editingContact !== null && editingIndex !== null) {
    return (
      <ErrorBoundary>
        <View style={styles.editRoot}>
          {/* Header */}
          <View style={styles.editHeader}>
            <TouchableOpacity onPress={cancelEdit} style={styles.editBackBtn}>
              <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.dark.text} />
            </TouchableOpacity>
            <Text style={styles.editTitle}>
              {editingIndex === -1 ? 'Add Contact' : 'Edit Contact'}
            </Text>
          </View>

          <ScrollView style={styles.editScroll} contentContainerStyle={styles.editScrollContent}>
            {/* Name */}
            <Text style={styles.fieldLabel}>Name</Text>
            <TextInputField
              value={editingContact.name || ''}
              onChangeText={(t) => updateField('name', t)}
              placeholder="Enter name"
            />

            {/* Phone */}
            <Text style={styles.fieldLabel}>Phone Number</Text>
            <TextInputField
              value={editingContact.phone || ''}
              onChangeText={(t) => updateField('phone', t)}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />

            {/* Relationship */}
            <Text style={styles.fieldLabel}>Relationship</Text>
            <View style={styles.pickerBox}>
              <Picker
                selectedValue={editingContact.relationship || 'Friend'}
                onValueChange={(value: string) => updateField('relationship', value)}
                style={styles.picker}
                itemStyle={{ color: Colors.dark.text }}
              >
                {RELATIONSHIP_OPTIONS.map((r) => (
                  <Picker.Item key={r} label={r} value={r} />
                ))}
              </Picker>
            </View>

            {/* SMS Alerts toggle */}
            <View style={styles.toggleRow}>
              <View>
                <Text style={styles.toggleLabel}>Enable SMS Alerts</Text>
                <Text style={styles.toggleSub}>Receive SMS when alert is triggered</Text>
              </View>
              <Switch
                value={editingContact.smsAlerts ?? true}
                onValueChange={(v) => updateField('smsAlerts', v)}
                trackColor={{ false: Colors.dark.cardBorder, true: Colors.dark.primary }}
                thumbColor={Colors.dark.text}
              />
            </View>

            {/* Automated Calls toggle */}
            <View style={styles.toggleRow}>
              <View>
                <Text style={styles.toggleLabel}>Enable Automated Calls</Text>
                <Text style={styles.toggleSub}>Receive automated call when alert is triggered</Text>
              </View>
              <Switch
                value={editingContact.automatedCalls ?? false}
                onValueChange={(v) => updateField('automatedCalls', v)}
                trackColor={{ false: Colors.dark.cardBorder, true: Colors.dark.primary }}
                thumbColor={Colors.dark.text}
              />
            </View>
          </ScrollView>

          {/* Sticky footer */}
          <View style={styles.editFooter}>
            <Button
              mode="contained"
              onPress={saveEdit}
              disabled={!isValidContact(editingContact)}
              style={styles.saveBtn}
              contentStyle={styles.saveBtnContent}
            >
              Save Changes
            </Button>
            {editingIndex !== -1 && (
              <TouchableOpacity onPress={deleteContact} style={styles.deleteBtn}>
                <MaterialCommunityIcons name="trash-can-outline" size={20} color={Colors.dark.urgentRed} />
                <Text style={styles.deleteBtnText}>Delete Contact</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ErrorBoundary>
    );
  }

  // Main settings list
  return (
    <ErrorBoundary>
      <View style={styles.main}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
          <Text style={styles.title}>Settings</Text>

          {/* ── Emergency Contacts ── */}
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          <View style={styles.contactList}>
            {contacts.length === 0 ? (
              <Text style={styles.emptyText}>No contacts added yet</Text>
            ) : (
              contacts.map((contact, index) => {
                const roleLabel = ROLE_LABELS[Math.min(index, ROLE_LABELS.length - 1)];
                return (
                  <View key={index} style={styles.contactCard}>
                    {/* Avatar */}
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{getInitials(contact.name)}</Text>
                    </View>
                    {/* Info */}
                    <View style={styles.contactInfo}>
                      <View style={styles.nameRow}>
                        <Text style={styles.contactName}>{contact.name || 'Unknown'}</Text>
                        <View style={[styles.badge, { backgroundColor: ROLE_COLORS[roleLabel] + '22', borderColor: ROLE_COLORS[roleLabel] }]}>
                          <Text style={[styles.badgeText, { color: ROLE_COLORS[roleLabel] }]}>{roleLabel}</Text>
                        </View>
                      </View>
                      <Text style={styles.contactPhone}>{contact.phone || contact.email || 'No details'}</Text>
                    </View>
                    {/* Edit pencil */}
                    <IconButton icon="pencil" size={20} onPress={() => startEdit(index)} iconColor={Colors.dark.mutedText} />
                  </View>
                );
              })
            )}
          </View>

          {/* FAB-style add button */}
          <TouchableOpacity onPress={startAdd} style={styles.addFab}>
            <MaterialCommunityIcons name="plus" size={24} color={Colors.dark.text} />
          </TouchableOpacity>

          {contacts.length === 0 && (
            <Text style={styles.warning}>At least one emergency contact is required.</Text>
          )}

          {/* ── Check-in Period ── */}
          <Text style={styles.sectionTitle}>Check-in Period</Text>
          <View style={styles.pickersRow}>
            <NumberScrollPicker
              value={selectedDays}
              onChange={setSelectedDays}
              min={0}
              max={7}
              label="Days"
              padStart={0}
            />

            <Text style={styles.separator}>:</Text>

            <NumberScrollPicker
              value={selectedHours}
              onChange={setSelectedHours}
              min={0}
              max={23}
              label="Hours"
              padStart={2}
            />
          </View>

          {/* ── Action buttons ── */}
          <Button
            mode="contained"
            onPress={handleSave}
            disabled={contacts.length === 0 || selectedDays + selectedHours === 0}
            style={styles.saveSettingsBtn}
            contentStyle={styles.saveSettingsBtnContent}
          >
            Save Settings
          </Button>

          <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
            <MaterialCommunityIcons name="restart" size={18} color={Colors.dark.text} style={styles.resetIcon} />
            <Text style={styles.resetBtnText}>Reset App</Text>
          </TouchableOpacity>
        </ScrollView>

        <BottomNavBar activeTab="contacts" />
      </View>
    </ErrorBoundary>
  );
}

// ─── Inline text-input component (avoids Paper TextInput quirks in dark themed pickers) ──
import { TextInput as RNTextInput } from 'react-native';

function TextInputField({ value, onChangeText, placeholder, keyboardType }: {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'phone-pad' | 'email-address';
}) {
  return (
    <RNTextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={Colors.dark.mutedText}
      keyboardType={keyboardType}
      autoCapitalize="none"
      style={styles.textInput}
    />
  );
}

// ─── STYLES ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // ── main list ──
  main: { flex: 1, backgroundColor: Colors.dark.background },
  container: { padding: 20, paddingBottom: 24 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.dark.primary,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 12,
    marginTop: 8,
  },

  // ── contact cards ──
  contactList: { gap: 10 },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
    borderRadius: 12,
    padding: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.dark.avatarPlaceholder,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '700',
  },
  contactInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  contactName: { color: Colors.dark.text, fontSize: 15, fontWeight: '600' },
  contactPhone: { color: Colors.dark.mutedText, fontSize: 13, marginTop: 2 },
  badge: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.6 },
  emptyText: {
    color: Colors.dark.mutedText,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 24,
  },
  warning: {
    color: Colors.dark.urgentRed,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },

  // ── FAB ──
  addFab: {
    alignSelf: 'center',
    marginTop: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
    // shadow
    shadowColor: Colors.dark.tealGlow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },

  // ── period picker (mirrors PeriodScreen layout) ──
  pickersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  pickerBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.dark.surface,
    alignItems: 'center',
  },
  picker: { height: 100, width: '100%' },
  separator: { fontSize: 28, fontWeight: 'bold', color: Colors.dark.mutedText },

  // ── save / reset buttons ──
  saveSettingsBtn: { width: '100%', borderRadius: 30 },
  saveSettingsBtnContent: { height: 52 },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.dark.urgentRed,
  },
  resetIcon: { marginRight: 8 },
  resetBtnText: { color: Colors.dark.text, fontSize: 15, fontWeight: '600' },

  // ── edit form ──
  editRoot: { flex: 1, backgroundColor: Colors.dark.background },
  editHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 56,   // below status bar
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.cardBorder,
  },
  editBackBtn: { marginRight: 12 },
  editTitle: { color: Colors.dark.text, fontSize: 18, fontWeight: '600' },
  editScroll: { flex: 1 },
  editScrollContent: { padding: 20 },

  // ── form fields ──
  fieldLabel: {
    color: Colors.dark.mutedText,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 6,
    marginTop: 18,
  },
  textInput: {
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.cardBorder,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: Colors.dark.text,
    fontSize: 15,
    minHeight: 48,
  },
  // reuse pickerBox for relationship picker (already defined above)

  // ── toggles ──
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.cardBorder,
  },
  toggleLabel: { color: Colors.dark.text, fontSize: 15, fontWeight: '500' },
  toggleSub: { color: Colors.dark.mutedText, fontSize: 13, marginTop: 2 },

  // ── edit footer ──
  editFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.cardBorder,
    gap: 12,
  },
  saveBtn: { width: '100%', borderRadius: 30 },
  saveBtnContent: { height: 52 },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.dark.urgentRed,
  },
  deleteBtnText: { color: Colors.dark.urgentRed, fontSize: 15, fontWeight: '600', marginLeft: 6 },

  // ── unused placeholder (kept to avoid stray JSX ref) ──
  inputBox: { display: 'none' },
  inputIcon: {},
});
