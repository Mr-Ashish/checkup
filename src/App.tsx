import React, { useState, useEffect } from 'react';
import OnboardingScreen from './screens/OnboardingScreen';
import SetupScreen from './screens/SetupScreen';
import MainScreen from './screens/MainScreen';
import { saveSettings, loadSettings } from './utils/storage';
import { Settings, Contact, User } from './types';
// @ts-ignore
import BackgroundTimer from 'react-native-background-timer';
import { Linking } from 'react-native';

const App: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);

  useEffect(() => {
    const init = async () => {
      const loaded = await loadSettings();
      if (loaded) {
        setSettings(loaded);
        startTimer(loaded);
      }
    };
    init();
  }, []);

  const startTimer = (currentSettings: Settings) => {
    if (!currentSettings.lastCheckIn || !currentSettings.period) return;
    const checkInTime = new Date(currentSettings.lastCheckIn.getTime() + currentSettings.period * 60 * 60 * 1000);
    const now = new Date();
    const diff = checkInTime.getTime() - now.getTime();
    if (diff > 0) {
      BackgroundTimer.setTimeout(() => {
        sendAlert(currentSettings.contacts);
      }, diff);
      updateRemainingTime(currentSettings);
      const interval = BackgroundTimer.setInterval(() => {
        updateRemainingTime(currentSettings);
      }, 60000);
    } else {
      sendAlert(currentSettings.contacts);
    }
  };

  const updateRemainingTime = (currentSettings: Settings) => {
    if (!currentSettings.lastCheckIn) return;
    const checkInTime = new Date(currentSettings.lastCheckIn.getTime() + currentSettings.period * 60 * 60 * 1000);
    const now = new Date();
    const diff = Math.max(0, checkInTime.getTime() - now.getTime());
    setRemainingTime(Math.floor(diff / (1000 * 60)));
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

  const handleSaveUser = async (user: User) => {
    const newSettings: Settings = {
      user,
      contacts: [],
      period: 1,
      lastCheckIn: null,
    };
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  const handleSave = async (contacts: Contact[], period: number) => {
    if (!settings) return;
    const newSettings: Settings = {
      ...settings,
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
    BackgroundTimer.stopBackgroundTimer();
    startTimer(updated);
  };

  if (!settings || !settings.user) {
    return <OnboardingScreen onSaveUser={handleSaveUser} />;
  }

  if (!settings.contacts || settings.contacts.length === 0) {
    return <SetupScreen onSave={handleSave} />;
  }

  return <MainScreen remainingTime={remainingTime} onCheckIn={handleCheckIn} />;
};

export default App;