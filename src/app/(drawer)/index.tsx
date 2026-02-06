import React from 'react';
import { HOUR_TO_MS, URGENT_THRESHOLD_SECS } from '../../constants/app';
import WelcomeScreen from '../../screens/WelcomeScreen';
import UserInfoScreen from '../../screens/UserInfoScreen';
import ContactSetupScreen from '../../screens/ContactSetupScreen';
import PeriodScreen from '../../screens/PeriodScreen';
import SafetyDashboardScreen from '../../screens/SafetyDashboardScreen';
import UrgentCheckInScreen from '../../screens/UrgentCheckInScreen';
import AlertFiredScreen from '../../screens/AlertFiredScreen';
import { useAppInitialization } from '../../hooks/useAppInitialization';
import { useCheckInTimer } from '../../hooks/useCheckInTimer';

export default function HomeScreen() {
  // Extracted to hooks for readability (init/load + timer logic not needed by other screens).
  // Functionality unchanged: state machine + handlers preserved.
  const init = useAppInitialization();
  // Pass initials from load to timer (avoids flash of UrgentCheckIn on tab switch/re-mount, as default 0 <= threshold).
  const timer = useCheckInTimer(init.settings, init.initialRemaining, init.initialAlertFired);

  const {
    settings,
    hasSeenWelcome,
    loaded,
    initialRemaining,  // passed to timer
    initialAlertFired,
    handleGetStarted,
    handleSaveUser,
    handleSaveContacts,
    handlePeriodSave,
  } = init;

  const {
    remainingSeconds,
    alertFired,
    handleCheckIn,
    handleAlertDismiss,
  } = timer;

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
      onCheckIn={handleCheckIn}
    />
  );
}
