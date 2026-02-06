import { useState, useEffect, useCallback } from 'react';
import { sendAlert } from '../utils/alert';
import { Settings } from '../types';
import { HOUR_TO_MS, TIMER_TICK_MS } from '../constants/app';

export const useCheckInTimer = (settings: Settings | null, initialRemaining = 0, initialAlertFired = false) => {
  // Use initials from load to prevent flash of urgent screen (0 <= threshold) on tab switch/re-mount.
  const [remainingSeconds, setRemainingSeconds] = useState<number>(initialRemaining);
  const [alertFired, setAlertFired] = useState<boolean>(initialAlertFired);

  // Sync remainingSeconds immediately when settings changes (e.g. after period save or reset).
  // Without this, the stale useState(initialRemaining) value lingers for up to 1 tick.
  useEffect(() => {
    if (!settings) {
      setRemainingSeconds(0);
      setAlertFired(false);
      return;
    }
    if (!settings.lastCheckIn || !settings.period || settings.setupComplete === false) return;
    const deadline = new Date(settings.lastCheckIn.getTime() + settings.period * HOUR_TO_MS);
    const secs = Math.max(0, Math.floor((deadline.getTime() - Date.now()) / 1000));
    setRemainingSeconds(secs);
    if (secs <= 0) setAlertFired(true);
  }, [settings]);

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

  const handleCheckIn = useCallback(async () => {
    if (!settings) return;
    const now = new Date();
    // Note: full update/save happens in parent (to keep hook pure)
    setAlertFired(false);
    setRemainingSeconds(settings.period * 3600);
    return { lastCheckIn: now };
  }, [settings]);

  const handleAlertDismiss = useCallback(() => {
    handleCheckIn();
  }, [handleCheckIn]);

  return {
    remainingSeconds,
    alertFired,
    setAlertFired,
    handleCheckIn,
    handleAlertDismiss,
  };
};
