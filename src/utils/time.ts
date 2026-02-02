export interface TimeRemaining {
  days: number;
  hours: number;
  mins: number;
  secs: number;
}

export const calculateTimeRemaining = (diffMs: number): TimeRemaining => {
  const totalSeconds = Math.floor(Math.max(0, diffMs) / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return { days, hours, mins, secs };
};

export const formatTimeRemaining = (time: TimeRemaining): string => {
  return `${time.days}d ${time.hours}h ${time.mins}m ${time.secs}s`;
};

export const getTotalSeconds = (time: TimeRemaining): number => {
  return time.days * 86400 + time.hours * 3600 + time.mins * 60 + time.secs;
};

export const getDisclaimerStyle = (totalSeconds: number, theme: any) => {
  let color = theme.colors.onSurfaceVariant;
  let opacity = 0.5;
  let fontSize = 14;
  if (totalSeconds < 300) { // less than 5 min
    color = theme.colors.error;
    opacity = 1;
    fontSize = 18;
  } else if (totalSeconds < 3600) { // less than 1 hour
    color = theme.colors.tertiary || theme.colors.secondary;
    opacity = 0.8;
    fontSize = 16;
  } else if (totalSeconds < 86400) { // less than 1 day
    color = theme.colors.secondary;
    opacity = 0.6;
    fontSize = 15;
  }
  return { color, opacity, fontSize };
};