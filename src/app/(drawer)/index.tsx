import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, TouchableOpacity, Animated } from 'react-native';
import { Button, TextInput, Card, Title, Modal, Portal, useTheme } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { saveSettings, loadSettings } from '../../utils/storage';
import { Settings, Contact } from '../../types';
import { calculateTimeRemaining, formatTimeRemaining, getTotalSeconds, getDisclaimerStyle, TimeRemaining } from '../../utils/time';
// import BackgroundTimer from 'react-native-background-timer'; // Temporarily disabled for Expo compatibility
import { Linking, Alert } from 'react-native';
import * as Contacts from 'expo-contacts';

export default function HomeScreen() {
  const theme = useTheme();

  const [remainingTime, setRemainingTime] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0,
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: theme.colors.primary,
      fontFamily: theme.fonts.titleLarge.fontFamily,
    },
    subtitle: {
      fontSize: 20,
      marginBottom: 10,
      textAlign: 'center',
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
      backgroundColor: theme.colors.surface,
      elevation: 2,
    },
    time: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.secondary,
      marginBottom: 30,
      textAlign: 'center',
      fontFamily: theme.fonts.headlineSmall.fontFamily,
    },
    button: {
      marginTop: 40,
      width: 180,
      height: 180,
      borderRadius: 90,
      elevation: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    buttonText: {
      color: theme.colors.onPrimary,
      fontSize: 24,
      fontWeight: 'bold',
      fontFamily: theme.fonts.titleLarge.fontFamily,
    },
    card: {
      marginBottom: 10,
      padding: 10,
      width: '100%',
      backgroundColor: theme.colors.surface,
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
    disclaimer: {
      position: 'absolute',
      bottom: 20,
      left: 20,
      right: 20,
      textAlign: 'center',
      fontSize: 14,
      fontFamily: theme.fonts.bodyMedium.fontFamily,
    },
  });
  const [settings, setSettings] = useState<Settings | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([
    {},
    {},
    {},
    {},
  ]);
  const [period, setPeriod] = useState<number>(1);
  const [contactList, setContactList] = useState<Contacts.Contact[]>([]);
  const [showContactPicker, setShowContactPicker] = useState<boolean>(false);
  const [pickingForIndex, setPickingForIndex] = useState<number | null>(null);
  const buttonScale = useRef(new Animated.Value(1)).current;

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
        sendAlert(currentSettings.contacts);
      }, diff);
      updateRemainingTime(currentSettings);
      // Note: Interval not implemented for simplicity; remaining time updates only on re-render
    } else {
      sendAlert(currentSettings.contacts);
    }
  };

  const updateRemainingTime = (currentSettings: Settings) => {
    if (!currentSettings.lastCheckIn) return;
    const checkInTime = new Date(currentSettings.lastCheckIn.getTime() + currentSettings.period * 60 * 60 * 1000);
    const now = new Date();
    const diff = checkInTime.getTime() - now.getTime();
    setRemainingTime(calculateTimeRemaining(diff));
  };

  const sendAlert = (contacts: Contact[]) => {
    const emails = contacts.filter(c => c.email).map(c => c.email).join(',');
    const phones = contacts.filter(c => c.phone).map(c => c.phone).join(',');
    const subject = 'Emergency Alert';
    const body = 'The user has not checked in as scheduled.';
    if (emails) {
      Linking.openURL(`mailto:${emails}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    }
    if (phones) {
      Linking.openURL(`sms:${phones}?body=${encodeURIComponent(body)}`);
    }
  };

  const handleSave = async () => {
    const validContacts = contacts.filter(c => c.email || c.phone || c.name);
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

  const updateContact = (index: number, field: keyof Contact, value: string) => {
    const newContacts = [...contacts];
    newContacts[index] = { ...newContacts[index], [field]: value };
    setContacts(newContacts);
  };

  const pickContact = async (index: number) => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Contact access is required to pick contacts.');
      return;
    }
    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.Name, Contacts.Fields.Emails, Contacts.Fields.PhoneNumbers],
    });
    setContactList(data);
    setPickingForIndex(index);
    setShowContactPicker(true);
  };

  const selectContact = (contact: Contacts.Contact) => {
    if (pickingForIndex !== null) {
      const name = contact.name;
      const email = contact.emails?.[0]?.email;
      const phone = contact.phoneNumbers?.[0]?.number;
      updateContact(pickingForIndex, 'name', name);
      if (email) updateContact(pickingForIndex, 'email', email);
      if (phone) updateContact(pickingForIndex, 'phone', phone);
    }
    setShowContactPicker(false);
    setPickingForIndex(null);
  };

  const animateButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleCheckInPress = () => {
    animateButtonPress();
    handleCheckIn();
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Emergency Check-In Setup</Text>
        <Text style={styles.subtitle}>Enter Emergency Contacts:</Text>
        {contacts.map((contact, index) => (
          <Card key={index} style={styles.card}>
            <Card.Content>
              <Title>Contact {index + 1}</Title>
              <TextInput
                value={contact.name || ''}
                onChangeText={(text) => updateContact(index, 'name', text)}
                placeholder="Name"
                mode="outlined"
                style={styles.input}
              />
              <TextInput
                value={contact.phone || ''}
                onChangeText={(text) => updateContact(index, 'phone', text)}
                placeholder="Phone Number"
                keyboardType="phone-pad"
                mode="outlined"
                style={styles.input}
              />
              <TextInput
                value={contact.email || ''}
                onChangeText={(text) => updateContact(index, 'email', text)}
                placeholder="Email"
                keyboardType="email-address"
                mode="outlined"
                style={styles.input}
              />
              <View style={styles.contactActions}>
                <Button mode="outlined" onPress={() => pickContact(index)} style={styles.pickButton}>
                  Pick from Contacts
                </Button>
              </View>
            </Card.Content>
          </Card>
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

        <Portal>
          <Modal visible={showContactPicker} onDismiss={() => setShowContactPicker(false)} contentContainerStyle={styles.modal}>
            <Text style={styles.title}>Select a Contact</Text>
            <FlatList
              data={contactList}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Button mode="outlined" onPress={() => selectContact(item)} style={styles.contactItem}>
                  {item.name}
                </Button>
              )}
            />
            <Button onPress={() => setShowContactPicker(false)}>Cancel</Button>
          </Modal>
        </Portal>
      </ScrollView>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Emergency Check-In</Text>
        <Text style={styles.subtitle}>Next Check-in in:</Text>
        <Text style={styles.time}>
          {formatTimeRemaining(remainingTime)}
        </Text>
        <TouchableOpacity onPress={handleCheckInPress} activeOpacity={0.8}>
          <Animated.View style={[styles.button, { transform: [{ scale: buttonScale }] }]}>
            <Text style={styles.buttonText}>Check In</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>

      <Text style={[styles.disclaimer, getDisclaimerStyle(getTotalSeconds(remainingTime), theme)]}>
        Remember to check in regularly to ensure your safety.
      </Text>
    </>
  );
}
