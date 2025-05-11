import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../context/auth';
import { NotificationHandler } from '../utils/notification';

// Wrapper pentru întreaga aplicație
export default function RootLayout() {
  return (
    <AuthProvider>
      <NotificationHandler />
      <RootLayoutNav />
    </AuthProvider>
  );
}

// Componenta de navigare principală
function RootLayoutNav() {
  const { isAuthenticated, isLoading, userType } = useAuth();

  useEffect(() => {
    // Aici putem face inițializări globale
  }, []);

  // Afișăm un ecran de încărcare dacă verificăm autentificarea
  if (isLoading) {
    return null;
  }

  return (
    <Stack>
      {/* Ecrane comune */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="driver-register" options={{ headerShown: false }} />
      <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
      
      {/* Ecrane pentru utilizatori autentificați */}
      {isAuthenticated && (
        <>
          {/* Ecrane pentru utilizatori normali */}
          {userType === 'user' && (
            <>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="booking-details" options={{ headerTitle: 'Detalii cursă' }} />
              <Stack.Screen name="payment-methods" options={{ headerTitle: 'Metode de plată' }} />
              <Stack.Screen name="add-payment-method" options={{ headerTitle: 'Adaugă metodă de plată' }} />
              <Stack.Screen name="ride-history" options={{ headerTitle: 'Istoric curse' }} />
              <Stack.Screen name="settings" options={{ headerTitle: 'Setări' }} />
              <Stack.Screen name="help" options={{ headerTitle: 'Ajutor' }} />
            </>
          )}
          
          {/* Ecrane pentru șoferi */}
          {userType === 'driver' && (
            <>
              <Stack.Screen name="driver-profile" options={{ headerShown: false }} />
              <Stack.Screen name="driver-rides" options={{ headerTitle: 'Cursele mele' }} />
              <Stack.Screen name="driver-earnings" options={{ headerTitle: 'Câștiguri' }} />
              <Stack.Screen name="driver-settings" options={{ headerTitle: 'Setări' }} />
              <Stack.Screen name="driver-help" options={{ headerTitle: 'Ajutor' }} />
              <Stack.Screen name="ride-details" options={{ headerTitle: 'Detalii cursă' }} />
            </>
          )}
        </>
      )}
    </Stack>
  );
}