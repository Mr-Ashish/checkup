import React, { useState, useEffect, useCallback } from 'react';
import { useLayoutEffect, useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import OnboardingScreen from '../../screens/OnboardingScreen';
import SetupScreen from '../../screens/SetupScreen';
import MainScreen from '../../screens/MainScreen';
import { saveSettings, loadSettings } from '../../utils/storage';
import { Settings, Contact, User } from '../../types';
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

  const checkInTime = useMemo(() => {
    if (!settings?.lastCheckIn || !settings?.period) return null;
    return new Date(settings.lastCheckIn.getTime() + settings.period * 60 * 60 * 1000);
  }, [settings]);

  const remainingTimeCalc = useMemo(() => {
    if (!checkInTime) return 0;
    const now = new Date();
    const diff = Math.max(0, checkInTime.getTime() - now.getTime());
    return Math.floor(diff / (1000 * 60));
  }, [checkInTime]);

  useEffect(() => {
    setRemainingTime(remainingTimeCalc);
  }, [remainingTimeCalc]);

  useEffect(() => {
    if (!checkInTime) return;
    const now = new Date();
    const diff = checkInTime.getTime() - now.getTime();
    if (diff > 0) {
      const timeout = setTimeout(() => {
        sendAlertEmail(settings!.contacts);
      }, diff);
      return () => clearTimeout(timeout);
    } else {
      sendAlertEmail(settings!.contacts);
    }
  }, [checkInTime, settings]);

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
