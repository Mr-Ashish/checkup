// @ts-ignore
import BackgroundTimer from 'react-native-background-timer';
import { Settings } from '../types';
import { HOUR_TO_MS, UPDATE_INTERVAL_MS } from '../constants/app';

export const getCheckInTime = (settings: Settings): Date | null => {
  if (!settings.lastCheckIn || !settings.period) return null;
  return new Date(settings.lastCheckIn.getTime() + settings.period * HOUR_TO_MS);
};

export const getRemainingTimeMinutes = (settings: Settings): number => {
  const checkInTime = getCheckInTime(settings);
  if (!checkInTime) return 0;
  const now = new Date();
  const diff = Math.max(0, checkInTime.getTime() - now.getTime());
  return Math.floor(diff / (1000 * 60));
};

export const startTimer = (
  settings: Settings,
  onAlert: () => void,
  onUpdate: () => void
) => {
  const checkInTime = getCheckInTime(settings);
  if (!checkInTime) return;
  const now = new Date();
  const diff = checkInTime.getTime() - now.getTime();
  if (diff > 0) {
    BackgroundTimer.setTimeout(() => {
      onAlert();
    }, diff);
    onUpdate(); // Initial update
    BackgroundTimer.setInterval(() => {
      onUpdate();
    }, UPDATE_INTERVAL_MS);
  } else {
    onAlert();
  }
};

export const stopTimer = () => {
  BackgroundTimer.stopBackgroundTimer();
};