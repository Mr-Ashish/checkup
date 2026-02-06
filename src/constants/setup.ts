// Setup screen constants
export const CONTACT_INDICES = [0, 1];
export const CONTACT_FIELDS = ['name', 'phone', 'email'] as const;
export type ContactField = typeof CONTACT_FIELDS[number];

export const CONTACT_PLACEHOLDERS = {
  name: 'Name',
  phone: 'Phone Number',
  email: 'Email Address',
};

export const CONTACT_KEYBOARD_TYPES = {
  name: 'default' as const,
  phone: 'phone-pad' as const,
  email: 'email-address' as const,
};

export const PERIOD_OPTIONS = [
  { label: '1 hour', value: 1 },
  { label: '2 hours', value: 2 },
  { label: '4 hours', value: 4 },
  { label: '8 hours', value: 8 },
  { label: '12 hours', value: 12 },
  { label: '24 hours', value: 24 },
];

export const ERROR_MESSAGES = {
  noContacts: 'Please enter at least one emergency contact with email or phone.',
};