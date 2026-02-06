// App-specific constants
export const DEFAULT_PERIOD_HOURS = 1; // Default check-in period in hours
export const TIMER_TICK_MS = 1000; // Live countdown interval — 1 second
export const URGENT_THRESHOLD_SECS = 300; // 5 minutes — switch to urgent check-in view
export const WARNING_THRESHOLD_SECS = 3600; // 1 hour  — progress ring turns yellow

export const ALERT_SUBJECT = 'Emergency Alert';
export const ALERT_BODY = 'The user has not checked in as scheduled.';

// Conversion constants
export const HOUR_TO_MS = 60 * 60 * 1000; // 1 hour in milliseconds
export const MINUTE_TO_MS = 60 * 1000; // 1 minute in milliseconds