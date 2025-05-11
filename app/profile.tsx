import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/auth';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // Simulăm încărcarea datelor utilizatorului
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // În aplicația reală, aceste date ar veni de la server
        setTimeout(() => {
          setUserData({
            name: user?.name || 'Utilizator',
            email: user?.email || 'utilizator@example.com',
            phone: '0712345678',
            profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
            paymentMethods: [
              { id: '1', type: 'card', last4: '4242', brand: 'Visa' }
            ],
            rideHistory: {
              total: 24,
              lastMonth: 8
            },
            savedAddresses: [
              { id: '1', name: 'Acasă', address: 'Strada Exemplu 123, București' },
              { id: '2', name: 'Birou', address: 'Bulevardul Business 45, București' }
            ]
          });
          
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Eroare la încărcarea datelor utilizatorului:', error);
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [user]);
  
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
            logout();
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
        <Text style={styles.headerTitle}>Profil</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: userData.profileImage }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editProfileImageButton}>
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userData.name}</Text>
            <Text style={styles.profileEmail}>{userData.email}</Text>
            <Text style={styles.profilePhone}>{userData.phone}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.editProfileButton}
            onPress={() => router.push('/edit-profile')}
          >
            <Text style={styles.editProfileButtonText}>Editează profil</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Metode de plată</Text>
          
          {userData.paymentMethods.length > 0 ? (
            userData.paymentMethods.map(method => (
              <View key={method.id} style={styles.paymentMethodItem}>
                <View style={styles.paymentMethodIcon}>
                  <Ionicons 
                    name={method.type === 'card' ? 'card-outline' : 'cash-outline'} 
                    size={24} 
                    color="#007BFF" 
                  />
                </View>
                <View style={styles.paymentMethodInfo}>
                  <Text style={styles.paymentMethodName}>
                    {method.type === 'card' ? `${method.brand} ****${method.last4}` : 'Cash'}
                  </Text>
                </View>
                <TouchableOpacity style={styles.paymentMethodAction}>
                  <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.emptyStateText}>Nu aveți metode de plată salvate</Text>
          )}
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/payment-methods')}
          >
            <Ionicons name="add-circle-outline" size={20} color="#007BFF" />
            <Text style={styles.addButtonText}>Adaugă metodă de plată</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adrese salvate</Text>
          
          {userData.savedAddresses.length > 0 ? (
            userData.savedAddresses.map(address => (
              <View key={address.id} style={styles.addressItem}>
                <View style={styles.addressIcon}>
                  <Ionicons 
                    name={address.name === 'Acasă' ? 'home-outline' : 'business-outline'} 
                    size={24} 
                    color="#007BFF" 
                  />
                </View>
                <View style={styles.addressInfo}>
                  <Text style={styles.addressName}>{address.name}</Text>
                  <Text style={styles.addressText}>{address.address}</Text>
                </View>
                <TouchableOpacity style={styles.addressAction}>
                  <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.emptyStateText}>Nu aveți adrese salvate</Text>
          )}
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/saved-addresses')}
          >
            <Ionicons name="add-circle-outline" size={20} color="#007BFF" />
            <Text style={styles.addButtonText}>Adaugă adresă</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Istoric curse</Text>
          
          <View style={styles.rideHistoryStats}>
            <View style={styles.rideHistoryStat}>
              <Text style={styles.rideHistoryStatValue}>{userData.rideHistory.total}</Text>
              <Text style={styles.rideHistoryStatLabel}>Curse totale</Text>
            </View>
            
            <View style={styles.rideHistoryStat}>
              <Text style={styles.rideHistoryStatValue}>{userData.rideHistory.lastMonth}</Text>
              <Text style={styles.rideHistoryStatLabel}>Luna aceasta</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => router.push('/ride-history')}
          >
            <Text style={styles.viewAllButtonText}>Vezi tot istoricul</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Setări</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications-outline" size={24} color="#007BFF" style={styles.settingIcon} />
              <Text style={styles.settingName}>Notificări</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#d1d1d1', true: '#4CAF50' }}
              thumbColor="#fff"
            />
          </View>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push('/settings')}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="settings-outline" size={24} color="#007BFF" style={styles.settingIcon} />
              <Text style={styles.settingName}>Setări aplicație</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push('/help')}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="help-circle-outline" size={24} color="#007BFF" style={styles.settingIcon} />
              <Text style={styles.settingName}>Ajutor & Suport</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
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
  profileSection: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editProfileImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007BFF',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 20,
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
  editProfileButton: {
    marginTop: 15,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: 20,
  },
  editProfileButtonText: {
    color: '#007BFF',
    fontSize: 14,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  paymentMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e6f2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    color: '#333',
  },
  paymentMethodAction: {
    padding: 5,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e6f2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  addressInfo: {
    flex: 1,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  addressAction: {
    padding: 5,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    paddingVertical: 10,
  },
  addButtonText: {
    color: '#007BFF',
    fontSize: 14,
    marginLeft: 5,
  },
  rideHistoryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  rideHistoryStat: {
    alignItems: 'center',
  },
  rideHistoryStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  rideHistoryStatLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  viewAllButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: 20,
  },
  viewAllButtonText: {
    color: '#007BFF',
    fontSize: 14,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 15,
  },
  settingName: {
    fontSize: 16,
    color: '#333',
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