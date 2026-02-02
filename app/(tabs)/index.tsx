import React, { useState, useEffect } from 'react';
import SetupScreen from '../../src/screens/SetupScreen';
import MainScreen from '../../src/screens/MainScreen';
import { saveSettings, loadSettings } from '../../src/utils/storage';
import { Settings, Contact } from '../../src/types';
// import BackgroundTimer from 'react-native-background-timer'; // Temporarily disabled for Expo compatibility
import { Linking } from 'react-native';

export default function HomeScreen() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);

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

  const handleSave = async (contacts: Contact[], period: number) => {
    const newSettings: Settings = {
      contacts,
      period,
      lastCheckIn: new Date(),
    };
    setSettings(newSettings);
    await saveSettings(newSettings);
    startTimer(newSettings);
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
    return <SetupScreen onSave={handleSave} />;
  }

  return <MainScreen remainingTime={remainingTime} onCheckIn={handleCheckIn} />;
}
