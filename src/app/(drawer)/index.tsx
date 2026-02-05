import React, { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveSettings, loadSettings } from '../../utils/storage';
import { sendAlert } from '../../utils/alert';
import { Settings, Contact, User } from '../../types';
import { HOUR_TO_MS, TIMER_TICK_MS, URGENT_THRESHOLD_SECS } from '../../constants/app';
import WelcomeScreen from '../../screens/WelcomeScreen';
import UserInfoScreen from '../../screens/UserInfoScreen';
import ContactSetupScreen from '../../screens/ContactSetupScreen';
import PeriodScreen from '../../screens/PeriodScreen';
import SafetyDashboardScreen from '../../screens/SafetyDashboardScreen';
import UrgentCheckInScreen from '../../screens/UrgentCheckInScreen';
import AlertFiredScreen from '../../screens/AlertFiredScreen';

const HAS_SEEN_WELCOME_KEY = 'hasSeenWelcome';

export default function HomeScreen() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [hasSeenWelcome, setHasSeenWelcome] = useState<boolean>(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [alertFired, setAlertFired] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);

  // Initial load from AsyncStorage
  useEffect(() => {
    const init = async () => {
      try {
        const [loadedSettings, welcomeSeen] = await Promise.all([
          loadSettings(),
          AsyncStorage.getItem(HAS_SEEN_WELCOME_KEY),
        ]);

        if (welcomeSeen === 'true') setHasSeenWelcome(true);

        if (loadedSettings) {
          setSettings(loadedSettings);

          if (loadedSettings.lastCheckIn && loadedSettings.period && loadedSettings.setupComplete !== false) {
            const deadline = new Date(loadedSettings.lastCheckIn.getTime() + loadedSettings.period * HOUR_TO_MS);
            const secs = Math.max(0, Math.floor((deadline.getTime() - Date.now()) / 1000));
            setRemainingSeconds(secs);
            if (secs <= 0) {
              setAlertFired(true);
            }
          }
        }
      } catch (error) {
        console.error('Error loading app state:', error);
      } finally {
        setLoaded(true);
      }
    };
    init();
  }, []);

  // Live countdown ticker
  useEffect(() => {
    if (!settings?.lastCheckIn || !settings?.period || settings.setupComplete === false) return;
    if (alertFired) return;

    const intervalId = setInterval(() => {
      const deadline = new Date(settings.lastCheckIn!.getTime() + settings.period * HOUR_TO_MS);
      const secs = Math.max(0, Math.floor((deadline.getTime() - Date.now()) / 1000));

      if (secs <= 0) {
        sendAlert(settings.contacts);
        setAlertFired(true);
        clearInterval(intervalId);
      } else {
        setRemainingSeconds(secs);
      }
    }, TIMER_TICK_MS);

    return () => clearInterval(intervalId);
  }, [settings, alertFired]);

  // --- Handlers ---

  const handleGetStarted = useCallback(async () => {
    await AsyncStorage.setItem(HAS_SEEN_WELCOME_KEY, 'true');
    setHasSeenWelcome(true);
  }, []);

  const handleSaveUser = useCallback(async (user: User) => {
    const newSettings: Settings = {
      user,
      contacts: [],
      period: 1,
      lastCheckIn: null,
      setupComplete: false,
    };
    setSettings(newSettings);
    await saveSettings(newSettings);
  }, []);

  const handleSaveContacts = useCallback(async (contacts: Contact[]) => {
    if (!settings) return;
    const updated: Settings = {
      ...settings,
      contacts,
    };
    setSettings(updated);
    await saveSettings(updated);
  }, [settings]);

  const handlePeriodSave = useCallback(async (period: number) => {
    if (!settings) return;
    const now = new Date();
    const updated: Settings = {
      ...settings,
      period,
      lastCheckIn: now,
      setupComplete: true,
    };
    setSettings(updated);
    await saveSettings(updated);
    setRemainingSeconds(period * 3600);
  }, [settings]);

  const handleCheckIn = useCallback(async () => {
    if (!settings) return;
    const now = new Date();
    const updated: Settings = {
      ...settings,
      lastCheckIn: now,
    };
    setSettings(updated);
    await saveSettings(updated);
    setAlertFired(false);
    setRemainingSeconds(settings.period * 3600);
  }, [settings]);

  const handleAlertDismiss = useCallback(() => {
    handleCheckIn();
  }, [handleCheckIn]);

  // Show nothing until initial AsyncStorage load completes
  if (!loaded) return null;

  // --- State machine ---

  if (!hasSeenWelcome && (!settings || !settings.user)) {
    return <WelcomeScreen onGetStarted={handleGetStarted} />;
  }

  if (!settings || !settings.user) {
    return <UserInfoScreen onSaveUser={handleSaveUser} />;
  }

  if (!settings.contacts || settings.contacts.length === 0) {
    return <ContactSetupScreen onSave={handleSaveContacts} />;
  }

  if (settings.setupComplete === false) {
    return <PeriodScreen onSave={handlePeriodSave} />;
  }

  if (alertFired) {
    return <AlertFiredScreen contacts={settings.contacts} onDismiss={handleAlertDismiss} />;
  }

  if (remainingSeconds <= URGENT_THRESHOLD_SECS) {
    return <UrgentCheckInScreen remainingSeconds={remainingSeconds} totalSeconds={settings.period * 3600} onCheckIn={handleCheckIn} />;
  }

  return (
    <SafetyDashboardScreen
      remainingSeconds={remainingSeconds}
      totalSeconds={settings.period * 3600}
      contacts={settings.contacts}
      lastCheckIn={settings.lastCheckIn}
      onCheckIn={handleCheckIn}
    />
  );
}
