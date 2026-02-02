export interface Contact {
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
}