import AsyncStorage from '@react-native-async-storage/async-storage';
import { Settings } from '../types';

const SETTINGS_KEY = 'settings';

export const saveSettings = async (settings: Settings): Promise<void> => {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify({
    ...settings,
    lastCheckIn: settings.lastCheckIn?.toISOString(),
  }));
};

export const loadSettings = async (): Promise<Settings | null> => {
  const data = await AsyncStorage.getItem(SETTINGS_KEY);
  if (data) {
    const parsed = JSON.parse(data);
    return {
      ...parsed,
      lastCheckIn: parsed.lastCheckIn ? new Date(parsed.lastCheckIn) : null,
    };
  }
  return null;
};