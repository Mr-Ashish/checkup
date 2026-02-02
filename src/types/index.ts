export interface Contact {
  email: string;
}

export interface Settings {
  contacts: Contact[];
  period: number; // in hours
  lastCheckIn: Date | null;
}