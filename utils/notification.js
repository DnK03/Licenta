import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

// Configurare notificări
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function NotificationHandler() {
  const router = useRouter();

  useEffect(() => {
    // Solicită permisiuni pentru notificări
    registerForPushNotificationsAsync();

    // Configurează listener pentru notificări primite când aplicația este în prim-plan
    const notificationListener = Notifications.addNotificationReceivedListener(
      notification => {
        console.log('Notificare primită:', notification);
      }
    );

    // Configurează listener pentru notificări pe care utilizatorul a apăsat
    const responseListener = Notifications.addNotificationResponseReceivedListener(
      response => {
        console.log('Răspuns notificare:', response);
        
        // Extrage datele din notificare
        const data = response.notification.request.content.data;
        
        // Navighează în funcție de tipul notificării
        if (data.type === 'ride_request') {
          router.push(`/ride-details/${data.rideId}`);
        } else if (data.type === 'payment') {
          router.push('/payment-methods');
        }
      }
    );

    // Curățare la demontare
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return null;
}

// Funcție pentru înregistrarea dispozitivului pentru notificări push
async function registerForPushNotificationsAsync() {
  try {
    // Verifică dacă dispozitivul poate primi notificări
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    // Dacă nu avem permisiuni, solicită-le
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    // Dacă utilizatorul a refuzat permisiunile, ieșim din funcție
    if (finalStatus !== 'granted') {
      console.log('Nu s-au acordat permisiuni pentru notificări!');
      return;
    }
    
    // Obține token-ul pentru notificări push (în aplicația reală, acesta ar trebui trimis la server)
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Token notificări push:', token);
    
    // Configurări specifice pentru Android
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  } catch (error) {
    console.error('Eroare la înregistrarea pentru notificări:', error);
  }
}

// Funcție pentru trimiterea unei notificări locale (pentru testare)
export async function sendLocalNotification(title, body, data = {}) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
    },
    trigger: null, // Trimite imediat
  });
}