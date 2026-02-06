import { Stack } from 'expo-router';

export default function Layout() {
  // Stack with headerShown false removes side drawer/hamburger.
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}