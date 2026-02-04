import { Linking } from 'react-native';
import { Contact } from '../types';
import { ALERT_SUBJECT, ALERT_BODY } from '../constants/app';

export const sendAlert = (contacts: Contact[]) => {
  const emails = contacts.filter(c => c.email).map(c => c.email).join(',');
  const phones = contacts.filter(c => c.phone).map(c => c.phone).join(',');
  if (emails) {
    Linking.openURL(`mailto:${emails}?subject=${encodeURIComponent(ALERT_SUBJECT)}&body=${encodeURIComponent(ALERT_BODY)}`);
  }
  if (phones) {
    Linking.openURL(`sms:${phones}?body=${encodeURIComponent(ALERT_BODY)}`);
  }
};