import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Switch,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DriverProfileScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [driverData, setDriverData] = useState(null);
  const [earnings, setEarnings] = useState({
    today: 0,
    thisWeek: 0,
    thisMonth: 0
  });
  const [stats, setStats] = useState({
    totalRides: 0,
    completionRate: 0,
    rating: 0,
    distance: 0
  });
  
  // Simulăm încărcarea datelor șoferului
  useEffect(() => {
    const loadDriverData = async () => {
      try {
        // În aplicația reală, aceste date ar veni de la server
        setTimeout(() => {
          setDriverData({
            id: '123456',
            name: 'Ion Popescu',
            email: 'ion.popescu@example.com',
            phone: '0712345678',
            car: {
              make: 'Dacia',
              model: 'Logan',
              year: 2020,
              color: 'Alb',
              licensePlate: 'B 123 ABC'
            },
            profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
            status: 'approved',
            documents: {
              driverLicense: 'valid',
              idCard: 'valid',
              insurance: 'valid'
            }
          });
          
          setEarnings({
            today: 150,
            thisWeek: 750,
            thisMonth: 3200
          });
          
          setStats({
            totalRides: 124,
            completionRate: 98,
            rating: 4.8,
            distance: 1250
          });
          
          setIsLoading(false);
        }, 1000);
        
        // Încărcăm starea online
        const onlineStatus = await AsyncStorage.getItem('driverOnlineStatus');
        setIsOnline(onlineStatus === 'true');
      } catch (error) {
        console.error('Eroare la încărcarea datelor șoferului:', error);
        setIsLoading(false);
      }
    };
    
    loadDriverData();
  }, []);
  
  // Gestionează schimbarea stării online
  const handleOnlineToggle = async (value) => {
    setIsOnline(value);
    await AsyncStorage.setItem('driverOnlineStatus', value.toString());
    
    if (value) {
      Alert.alert(
        'Ești online',
        'Acum poți primi cereri de curse.',
        [{ text: 'OK' }]
      );
    }
  };
  
  // Gestionează deconectarea
  const handleSignOut = () => {
    Alert.alert(
      'Confirmare',
      'Sigur doriți să vă deconectați?',
      [
        {
          text: 'Anulează',
          style: 'cancel'
        },
        {
          text: 'Deconectare',
          onPress: () => {
            // Aici ar trebui să apelăm funcția de deconectare din contextul de autentificare
            router.replace('/login');
          }
        }
      ]
    );
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Se încarcă profilul...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil șofer</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.onlineStatusSection}>
          <Text style={styles.onlineStatusLabel}>
            Status: <Text style={isOnline ? styles.onlineText : styles.offlineText}>
              {isOnline ? 'Online' : 'Offline'}
            </Text>
          </Text>
          <Switch
            value={isOnline}
            onValueChange={handleOnlineToggle}
            trackColor={{ false: '#d1d1d1', true: '#4CAF50' }}
            thumbColor="#fff"
          />
        </View>
        
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: driverData.profileImage }}
              style={styles.profileImage}
            />
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{driverData.name}</Text>
            <Text style={styles.profileEmail}>{driverData.email}</Text>
            <Text style={styles.profilePhone}>{driverData.phone}</Text>
            
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={18} color="#FFD700" />
              <Text style={styles.ratingText}>{stats.rating}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.carInfoSection}>
          <Text style={styles.sectionTitle}>Informații vehicul</Text>
          
          <View style={styles.carInfoContainer}>
            <View style={styles.carIconContainer}>
              <Ionicons name="car" size={40} color="#007BFF" />
            </View>
            
            <View style={styles.carDetails}>
              <Text style={styles.carName}>{driverData.car.make} {driverData.car.model} ({driverData.car.year})</Text>
              <Text style={styles.carInfo}>Culoare: {driverData.car.color}</Text>
              <Text style={styles.carInfo}>Număr înmatriculare: {driverData.car.licensePlate}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.earningsSection}>
          <Text style={styles.sectionTitle}>Câștiguri</Text>
          
          <View style={styles.earningsContainer}>
            <View style={styles.earningItem}>
              <Text style={styles.earningValue}>{earnings.today} RON</Text>
              <Text style={styles.earningLabel}>Astăzi</Text>
            </View>
            
            <View style={styles.earningDivider} />
            
            <View style={styles.earningItem}>
              <Text style={styles.earningValue}>{earnings.thisWeek} RON</Text>
              <Text style={styles.earningLabel}>Săptămâna aceasta</Text>
            </View>
            
            <View style={styles.earningDivider} />
            
            <View style={styles.earningItem}>
              <Text style={styles.earningValue}>{earnings.thisMonth} RON</Text>
              <Text style={styles.earningLabel}>Luna aceasta</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.viewDetailsButton}>
            <Text style={styles.viewDetailsButtonText}>Vezi detalii complete</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Statistici</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalRides}</Text>
              <Text style={styles.statLabel}>Curse totale</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.completionRate}%</Text>
              <Text style={styles.statLabel}>Rata de finalizare</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.distance} km</Text>
              <Text style={styles.statLabel}>Distanță totală</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.rating}</Text>
              <Text style={styles.statLabel}>Rating mediu</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.documentsSection}>
          <Text style={styles.sectionTitle}>Documente</Text>
          
          <View style={styles.documentItem}>
            <View style={styles.documentIconContainer}>
              <Ionicons name="card-outline" size={24} color="#007BFF" />
            </View>
            <View style={styles.documentInfo}>
              <Text style={styles.documentName}>Permis de conducere</Text>
              <Text style={styles.documentStatus}>
                Status: <Text style={styles.validText}>Valid</Text>
              </Text>
            </View>
            <TouchableOpacity style={styles.documentAction}>
              <Ionicons name="eye-outline" size={24} color="#007BFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.documentItem}>
            <View style={styles.documentIconContainer}>
              <Ionicons name="id-card-outline" size={24} color="#007BFF" />
            </View>
            <View style={styles.documentInfo}>
              <Text style={styles.documentName}>Carte de identitate</Text>
              <Text style={styles.documentStatus}>
                Status: <Text style={styles.validText}>Valid</Text>
              </Text>
            </View>
            <TouchableOpacity style={styles.documentAction}>
              <Ionicons name="eye-outline" size={24} color="#007BFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.documentItem}>
            <View style={styles.documentIconContainer}>
              <Ionicons name="document-text-outline" size={24} color="#007BFF" />
            </View>
            <View style={styles.documentInfo}>
              <Text style={styles.documentName}>Asigurare auto</Text>
              <Text style={styles.documentStatus}>
                Status: <Text style={styles.validText}>Valid</Text>
              </Text>
            </View>
            <TouchableOpacity style={styles.documentAction}>
              <Ionicons name="eye-outline" size={24} color="#007BFF" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.actionsSection}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/driver-rides')}
          >
            <Ionicons name="list-outline" size={24} color="#007BFF" />
            <Text style={styles.actionButtonText}>Istoricul curselor</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/driver-settings')}
          >
            <Ionicons name="settings-outline" size={24} color="#007BFF" />
            <Text style={styles.actionButtonText}>Setări</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/driver-help')}
          >
            <Ionicons name="help-circle-outline" size={24} color="#007BFF" />
            <Text style={styles.actionButtonText}>Ajutor & Suport</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
          <Text style={styles.signOutButtonText}>Deconectare</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  onlineStatusSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  onlineStatusLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  onlineText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  offlineText: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  profileSection: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileImageContainer: {
    marginRight: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  profilePhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  carInfoSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  carInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  carIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e6f2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  carDetails: {
    flex: 1,
  },
  carName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  carInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  earningsSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  earningsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
  },
  earningItem: {
    flex: 1,
    alignItems: 'center',
  },
  earningValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  earningLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  earningDivider: {
    width: 1,
    backgroundColor: '#ddd',
  },
  viewDetailsButton: {
    alignSelf: 'center',
    marginTop: 15,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: 20,
  },
  viewDetailsButtonText: {
    color: '#007BFF',
    fontSize: 14,
  },
  statsSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  documentsSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  documentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e6f2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  documentStatus: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  validText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  documentAction: {
    padding: 5,
  },
  actionsSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    margin: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF3B30',
    borderRadius: 8,
  },
  signOutButtonText: {
    fontSize: 16,
    color: '#FF3B30',
    marginLeft: 10,
  },
});