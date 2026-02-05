import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Contact } from '@/types';
import { Colors } from '@/constants/theme';

interface AlertFiredScreenProps {
  contacts: Contact[];
  onDismiss: () => void;
}

const AlertFiredScreen: React.FC<AlertFiredScreenProps> = ({ contacts, onDismiss }) => {
  const theme = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Red banner */}
      <View style={styles.banner}>
        <MaterialCommunityIcons name="alert-circle" size={32} color="#FFFFFF" style={styles.bannerIcon} />
        <Text style={styles.bannerText}>Emergency Contacts Notified</Text>
      </View>

      <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
        Your emergency contacts have been alerted because a check-in was missed.
      </Text>

      {/* Contact list */}
      {contacts.map((contact, index) => (
        <View
          key={index}
          style={[styles.contactCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.surfaceVariant }]}
        >
          <View style={[styles.avatar, { backgroundColor: Colors.dark.avatarPlaceholder }]}>
            <MaterialCommunityIcons name="account" size={22} color={Colors.dark.text} />
          </View>
          <View style={styles.contactInfo}>
            <Text style={[styles.contactName, { color: theme.colors.onSurface }]}>
              {contact.name || 'Unknown'}
            </Text>
            <View style={styles.channelIcons}>
              {contact.email && (
                <View style={styles.channelBadge}>
                  <MaterialCommunityIcons name="email" size={16} color={Colors.dark.primary} />
                  <Text style={[styles.channelLabel, { color: Colors.dark.primary }]}>Email</Text>
                </View>
              )}
              {contact.phone && (
                <View style={styles.channelBadge}>
                  <MaterialCommunityIcons name="phone" size={16} color={Colors.dark.primary} />
                  <Text style={[styles.channelLabel, { color: Colors.dark.primary }]}>SMS</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      ))}

      <Button
        mode="contained"
        onPress={onDismiss}
        style={styles.dismissButton}
        contentStyle={styles.dismissButtonContent}
      >
        Return Home
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  banner: {
    width: '100%',
    backgroundColor: Colors.dark.urgentRed,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  bannerIcon: {
    marginBottom: 8,
  },
  bannerText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    lineHeight: 20,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  channelIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  channelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  channelLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  dismissButton: {
    marginHorizontal: 20,
    marginTop: 32,
    marginBottom: 48,
    borderRadius: 30,
  },
  dismissButtonContent: {
    height: 52,
  },
  dismissButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AlertFiredScreen;
