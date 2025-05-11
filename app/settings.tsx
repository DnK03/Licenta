import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [rideUpdatesEnabled, setRideUpdatesEnabled] = useState(true);
  const [promotionsEnabled, setPromotionsEnabled] = useState(true);
  const [reminderEnabled, setReminderEnabled] = useState(true);

  // Încarcă setările salvate
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('notificationSettings');
      if (settings) {
        const parsedSettings = JSON.parse(settings);
        setNotificationsEnabled(parsedSettings.notificationsEnabled);
        setRideUpdatesEnabled(parsedSettings.rideUpdatesEnabled);
        setPromotionsEnabled(parsedSettings.promotionsEnabled);
        setReminderEnabled(parsedSettings.reminderEnabled);
      }
    } catch (error) {
      console.log('Eroare la încărcarea setărilor:', error);
    }
  };

  // Salvează setările
  const saveSettings = async () => {
    try {
      const settings = {
        notificationsEnabled,
        rideUpdatesEnabled,
        promotionsEnabled,
        reminderEnabled
      };
      await AsyncStorage.setItem('notificationSettings', JSON.stringify(settings));
    } catch (error) {
      console.log('Eroare la salvarea setărilor:', error);
    }
  };

  // Actualizează și salvează setările când se schimbă
  useEffect(() => {
    saveSettings();
  }, [notificationsEnabled, rideUpdatesEnabled, promotionsEnabled, reminderEnabled]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Setări notificări</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingTitle}>Notificări</Text>
              <Text style={styles.settingDescription}>Activează sau dezactivează toate notificările</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={(value) => {
                setNotificationsEnabled(value);
                if (!value) {
                  setRideUpdatesEnabled(false);
                  setPromotionsEnabled(false);
                  setReminderEnabled(false);
                }
              }}
              trackColor={{ false: '#d1d1d1', true: '#007BFF' }}
              thumbColor="#fff"
            />
          </View>
          
          <View style={[styles.settingItem, !notificationsEnabled && styles.disabledSetting]}>
            <View>
              <Text style={styles.settingTitle}>Actualizări curse</Text>
              <Text style={styles.settingDescription}>Primește notificări despre sosirea șoferului și actualizări de călătorie</Text>
            </View>
            <Switch
              value={rideUpdatesEnabled}
              onValueChange={(value) => setRideUpdatesEnabled(value)}
              disabled={!notificationsEnabled}
              trackColor={{ false: '#d1d1d1', true: '#007BFF' }}
              thumbColor="#fff"
            />
          </View>
          
          <View style={[styles.settingItem, !notificationsEnabled && styles.disabledSetting]}>
            <View>
              <Text style={styles.settingTitle}>Promoții și oferte</Text>
              <Text style={styles.settingDescription}>Primește notificări despre reduceri și oferte speciale</Text>
            </View>
            <Switch
              value={promotionsEnabled}
              onValueChange={(value) => setPromotionsEnabled(value)}
              disabled={!notificationsEnabled}
              trackColor={{ false: '#d1d1d1', true: '#007BFF' }}
              thumbColor="#fff"
            />
          </View>
          
          <View style={[styles.settingItem, !notificationsEnabled && styles.disabledSetting]}>
            <View>
              <Text style={styles.settingTitle}>Remindere</Text>
              <Text style={styles.settingDescription}>Primește remindere pentru călătoriile programate</Text>
            </View>
            <Switch
              value={reminderEnabled}
              onValueChange={(value) => setReminderEnabled(value)}
              disabled={!notificationsEnabled}
              trackColor={{ false: '#d1d1d1', true: '#007BFF' }}
              thumbColor="#fff"
            />
          </View>
        </View>
        
        <View style={styles.infoSection}>
          <Ionicons name="information-circle-outline" size={24} color="#666" />
          <Text style={styles.infoText}>
            Poți modifica aceste setări oricând. Notificările ne ajută să te ținem la curent cu informații importante despre călătoriile tale.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  disabledSetting: {
    opacity: 0.5,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    maxWidth: '80%',
  },
  infoSection: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    margin: 20,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    flex: 1,
  },
});