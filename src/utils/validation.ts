import { Contact } from '@/types';

export const isValidEmail = (email?: string): boolean => {
  if (!email || email.trim() === '') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

// Contact valid if has name + (phone or valid email). Used to gate save/continue buttons.
export const isValidContact = (contact?: Contact): boolean => {
  if (!contact) return false;
  const hasName = !!(contact.name || '').trim();
  const hasPhone = !!(contact.phone || '').trim();
  const hasValidEmail = isValidEmail(contact.email);
  return hasName && (hasPhone || hasValidEmail);
};
