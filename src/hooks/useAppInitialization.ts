import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveSettings, loadSettings } from '../utils/storage';
import { Settings, Contact, User } from '../types';
import { HOUR_TO_MS } from '../constants/app';

const HAS_SEEN_WELCOME_KEY = 'hasSeenWelcome';

export const useAppInitialization = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [hasSeenWelcome, setHasSeenWelcome] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  // Initial computed for timer to avoid flash of urgent screen on mount/tab switch (default 0 <= threshold).
  const [initialRemaining, setInitialRemaining] = useState<number>(0);
  const [initialAlertFired, setInitialAlertFired] = useState<boolean>(false);

  // Re-run on every focus (handles post-reset navigation back to this screen).
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      const init = async () => {
        try {
          const [loadedSettings, welcomeSeen] = await Promise.all([
            loadSettings(),
            AsyncStorage.getItem(HAS_SEEN_WELCOME_KEY),
          ]);

          if (cancelled) return;

          // Explicit resets — drawer keeps HomeScreen mounted, so stale state
          // persists if we only set when data exists.
          setHasSeenWelcome(welcomeSeen === 'true');

          if (loadedSettings) {
            setSettings(loadedSettings);

            // Compute initial timer values here (prevents urgent flash on re-mount/tab switch).
            if (loadedSettings.lastCheckIn && loadedSettings.period && loadedSettings.setupComplete !== false) {
              const deadline = new Date(loadedSettings.lastCheckIn.getTime() + loadedSettings.period * HOUR_TO_MS);
              const secs = Math.max(0, Math.floor((deadline.getTime() - Date.now()) / 1000));
              setInitialRemaining(secs);
              setInitialAlertFired(secs <= 0);
            } else {
              setInitialRemaining(0);
              setInitialAlertFired(false);
            }
          } else {
            // Storage was cleared (e.g. reset) — wipe in-memory state.
            setSettings(null);
            setInitialRemaining(0);
            setInitialAlertFired(false);
          }
        } catch (error) {
          console.error('Error loading app state:', error);
        } finally {
          if (!cancelled) setLoaded(true);
        }
      };
      init();
      return () => { cancelled = true; };
    }, [])
  );

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
    return updated;  // for timer init if needed
  }, [settings]);

  return {
    settings,
    setSettings,
    hasSeenWelcome,
    loaded,
    initialRemaining,
    initialAlertFired,
    handleGetStarted,
    handleSaveUser,
    handleSaveContacts,
    handlePeriodSave,
  };
};
