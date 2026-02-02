import React, { useState, useEffect, useCallback } from 'react';
import { useLayoutEffect, useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import OnboardingScreen from '../../src/screens/OnboardingScreen';
import SetupScreen from '../../src/screens/SetupScreen';
import MainScreen from '../../src/screens/MainScreen';
import { saveSettings, loadSettings } from '../../src/utils/storage';
import { Settings, Contact, User } from '../../src/types';
// import BackgroundTimer from 'react-native-background-timer'; // Temporarily disabled for Expo compatibility
import { Linking } from 'react-native';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);

  const loadAppSettings = useCallback(async () => {
    try {
      const loaded = await loadSettings();
      setSettings(loaded);
      if (loaded && loaded.lastCheckIn) {
        startTimer(loaded);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, []);

  useLayoutEffect(() => {
    const shouldHide = !settings || !settings.user || (!settings.contacts || settings.contacts.length === 0);
    navigation.setOptions({
      tabBarStyle: shouldHide ? { display: 'none' } : undefined,
      headerShown: shouldHide ? false : true,
    });
  }, [settings, navigation]);

  useEffect(() => {
    loadAppSettings();
  }, [loadAppSettings]);

  useFocusEffect(useCallback(() => {
    loadAppSettings();
  }, [loadAppSettings]));

  const startTimer = (currentSettings: Settings) => {
    if (!currentSettings.lastCheckIn || !currentSettings.period) return;
    const checkInTime = new Date(currentSettings.lastCheckIn.getTime() + currentSettings.period * 60 * 60 * 1000);
    const now = new Date();
    const diff = checkInTime.getTime() - now.getTime();
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
    const diff = Math.max(0, checkInTime.getTime() - now.getTime());
    setRemainingTime(Math.floor(diff / (1000 * 60)));
  };

  const sendAlertEmail = (contacts: Contact[]) => {
    const emails = contacts.map(c => c.email).join(',');
    const subject = 'Emergency Alert';
    const body = 'The user has not checked in as scheduled.';
    Linking.openURL(`mailto:${emails}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
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
    // BackgroundTimer.stopBackgroundTimer(); // Removed
    startTimer(updated);
  };

  if (!settings || !settings.user) {
    return <OnboardingScreen onSaveUser={handleSaveUser} />;
  }

  if (!settings.contacts || settings.contacts.length === 0) {
    return <SetupScreen onSave={handleSave} />;
  }

  return <MainScreen remainingTime={remainingTime} onCheckIn={handleCheckIn} />;
}
