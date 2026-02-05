export interface Contact {
  id?: string;
  name?: string;
  phone?: string;
  email?: string;
}

export interface User {
  name?: string;
  phone?: string;
  email?: string;
}

export interface Settings {
  user?: User;
  contacts: Contact[];
  period: number; // in hours
  lastCheckIn: Date | null;
  setupComplete?: boolean; // false during initial 3-step setup; treat undefined as true (backward compat)
}