import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/auth';

// Enum pentru starea curselor
const RideStatus = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export default function DriverRidesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('current'); // 'current' sau 'history'
  const [rides, setRides] = useState([]);
  
  // Încărcăm cursele șoferului
  useEffect(() => {
    loadRides();
  }, [activeTab]);
  
  // Funcție pentru încărcarea curselor
  const loadRides = async () => {
    if (refreshing) return;
    
    setIsLoading(true);
    
    try {
// Înlocuiește acest URL cu URL-ul real al API-ului tău
const apiUrl = `http://192.168.1.50/transport-api/driver-rides.php?type=${activeTab}`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setRides(data.rides);
      } else {
        // Dacă suntem în modul de dezvoltare, folosim date de test
        if (__DEV__) {
          console.log('Folosim date de test pentru dezvoltare');
          
          // Simulăm date diferite în funcție de tab-ul activ
          if (activeTab === 'current') {
            setRides([
              {
                id: '1',
                status: RideStatus.PENDING,
                pickup: 'Strada Exemplu 10, București',
                destination: 'Piața Unirii, București',
                distance: '5.2 km',
                estimatedTime: '15 min',
                fare: '25 RON',
                passenger: {
                  name: 'Ana Popescu',
                  rating: 4.8,
                  profileImage: 'https://randomuser.me/api/portraits/women/44.jpg'
                },
                createdAt: new Date(Date.now() - 5 * 60000).toISOString() // 5 minute în urmă
              },
              {
                id: '2',
                status: RideStatus.ACCEPTED,
                pickup: 'Bulevardul Magheru 20, București',
                destination: 'Aeroportul Otopeni, București',
                distance: '18.5 km',
                estimatedTime: '35 min',
                fare: '75 RON',
                passenger: {
                  name: 'Mihai Ionescu',
                  rating: 4.5,
                  profileImage: 'https://randomuser.me/api/portraits/men/22.jpg'
                },
                createdAt: new Date(Date.now() - 15 * 60000).toISOString() // 15 minute în urmă
              },
              {
                id: '3',
                status: RideStatus.IN_PROGRESS,
                pickup: 'Calea Victoriei 25, București',
                destination: 'Parcul Herăstrău, București',
                distance: '7.8 km',
                estimatedTime: '22 min',
                fare: '35 RON',
                passenger: {
                  name: 'Elena Dumitrescu',
                  rating: 4.9,
                  profileImage: 'https://randomuser.me/api/portraits/women/28.jpg'
                },
                createdAt: new Date(Date.now() - 25 * 60000).toISOString() // 25 minute în urmă
              }
            ]);
          } else {
            // Istoric curse
            setRides([
              {
                id: '4',
                status: RideStatus.COMPLETED,
                pickup: 'Strada Academiei 15, București',
                destination: 'Gara de Nord, București',
                distance: '4.3 km',
                duration: '18 min',
                fare: '22 RON',
                passenger: {
                  name: 'Cristian Popa',
                  rating: 4.7,
                  profileImage: 'https://randomuser.me/api/portraits/men/32.jpg'
                },
                completedAt: new Date(Date.now() - 2 * 3600000).toISOString() // 2 ore în urmă
              },
              {
                id: '5',
                status: RideStatus.COMPLETED,
                pickup: 'Bulevardul Dacia 35, București',
                destination: 'Mall Vitan, București',
                distance: '6.1 km',
                duration: '25 min',
                fare: '30 RON',
                passenger: {
                  name: 'Maria Stanescu',
                  rating: 4.6,
                  profileImage: 'https://randomuser.me/api/portraits/women/15.jpg'
                },
                completedAt: new Date(Date.now() - 5 * 3600000).toISOString() // 5 ore în urmă
              },
              {
                id: '6',
                status: RideStatus.CANCELLED,
                pickup: 'Piața Romană, București',
                destination: 'Parcul Tineretului, București',
                distance: '5.5 km',
                fare: '28 RON',
                passenger: {
                  name: 'Alexandru Marin',
                  rating: 4.3,
                  profileImage: 'https://randomuser.me/api/portraits/men/55.jpg'
                },
                cancelledAt: new Date(Date.now() - 8 * 3600000).toISOString(), // 8 ore în urmă
                cancellationReason: 'Pasagerul a anulat cursa'
              }
            ]);
          }
        } else {
          Alert.alert('Eroare', data.message || 'Nu s-au putut încărca cursele');
        }
      }
    } catch (error) {
      console.error('Eroare la încărcarea curselor:', error);
      
      // În modul de dezvoltare, folosim date de test în caz de eroare
      if (__DEV__) {
        console.log('Folosim date de test pentru dezvoltare (după eroare)');
        
        // Simulăm date diferite în funcție de tab-ul activ (același cod ca mai sus)
        if (activeTab === 'current') {
          setRides([
            {
              id: '1',
              status: RideStatus.PENDING,
              pickup: 'Strada Exemplu 10, București',
              destination: 'Piața Unirii, București',
              distance: '5.2 km',
              estimatedTime: '15 min',
              fare: '25 RON',
              passenger: {
                name: 'Ana Popescu',
                rating: 4.8,
                profileImage: 'https://randomuser.me/api/portraits/women/44.jpg'
              },
              createdAt: new Date(Date.now() - 5 * 60000).toISOString() // 5 minute în urmă
            },
            {
              id: '2',
              status: RideStatus.ACCEPTED,
              pickup: 'Bulevardul Magheru 20, București',
              destination: 'Aeroportul Otopeni, București',
              distance: '18.5 km',
              estimatedTime: '35 min',
              fare: '75 RON',
              passenger: {
                name: 'Mihai Ionescu',
                rating: 4.5,
                profileImage: 'https://randomuser.me/api/portraits/men/22.jpg'
              },
              createdAt: new Date(Date.now() - 15 * 60000).toISOString() // 15 minute în urmă
            },
            {
              id: '3',
              status: RideStatus.IN_PROGRESS,
              pickup: 'Calea Victoriei 25, București',
              destination: 'Parcul Herăstrău, București',
              distance: '7.8 km',
              estimatedTime: '22 min',
              fare: '35 RON',
              passenger: {
                name: 'Elena Dumitrescu',
                rating: 4.9,
                profileImage: 'https://randomuser.me/api/portraits/women/28.jpg'
              },
              createdAt: new Date(Date.now() - 25 * 60000).toISOString() // 25 minute în urmă
            }
          ]);
        } else {
          // Istoric curse
          setRides([
            {
              id: '4',
              status: RideStatus.COMPLETED,
              pickup: 'Strada Academiei 15, București',
              destination: 'Gara de Nord, București',
              distance: '4.3 km',
              duration: '18 min',
              fare: '22 RON',
              passenger: {
                name: 'Cristian Popa',
                rating: 4.7,
                profileImage: 'https://randomuser.me/api/portraits/men/32.jpg'
              },
              completedAt: new Date(Date.now() - 2 * 3600000).toISOString() // 2 ore în urmă
            },
            {
              id: '5',
              status: RideStatus.COMPLETED,
              pickup: 'Bulevardul Dacia 35, București',
              destination: 'Mall Vitan, București',
              distance: '6.1 km',
              duration: '25 min',
              fare: '30 RON',
              passenger: {
                name: 'Maria Stanescu',
                rating: 4.6,
                profileImage: 'https://randomuser.me/api/portraits/women/15.jpg'
              },
              completedAt: new Date(Date.now() - 5 * 3600000).toISOString() // 5 ore în urmă
            },
            {
              id: '6',
              status: RideStatus.CANCELLED,
              pickup: 'Piața Romană, București',
              destination: 'Parcul Tineretului, București',
              distance: '5.5 km',
              fare: '28 RON',
              passenger: {
                name: 'Alexandru Marin',
                rating: 4.3,
                profileImage: 'https://randomuser.me/api/portraits/men/55.jpg'
              },
              cancelledAt: new Date(Date.now() - 8 * 3600000).toISOString(), // 8 ore în urmă
              cancellationReason: 'Pasagerul a anulat cursa'
            }
          ]);
        }
      } else {
        Alert.alert('Eroare', 'Nu s-au putut încărca cursele. Verificați conexiunea la internet.');
      }
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };
  
  // Funcție pentru actualizarea listei de curse (pull-to-refresh)
  const handleRefresh = () => {
    setRefreshing(true);
    loadRides();
  };
  
  // Funcție pentru gestionarea acțiunilor pe curse
  const handleRideAction = async (ride, action) => {
    let confirmationTitle = '';
    let confirmationMessage = '';
    let successMessage = '';
    
    // Configurăm mesajele în funcție de acțiune
    switch (action) {
      case 'accept':
        confirmationTitle = 'Confirmare';
        confirmationMessage = `Sigur doriți să acceptați cursa către ${ride.destination}?`;
        successMessage = 'Cursa a fost acceptată. Contactați pasagerul pentru detalii.';
        break;
      case 'start':
        confirmationTitle = 'Confirmare';
        confirmationMessage = 'Confirmați că ați preluat pasagerul și începeți cursa?';
        successMessage = 'Cursa a început. Conduceți cu grijă!';
        break;
      case 'complete':
        confirmationTitle = 'Confirmare';
        confirmationMessage = 'Confirmați că ați ajuns la destinație și cursa este completă?';
        successMessage = 'Cursa a fost finalizată. Mulțumim!';
        break;
      case 'cancel':
        confirmationTitle = 'Confirmare';
        confirmationMessage = 'Sigur doriți să anulați această cursă? Acest lucru poate afecta rating-ul dvs.';
        successMessage = 'Cursa a fost anulată.';
        break;
      case 'view':
        // Pentru vizualizare, navigăm direct fără confirmare
        router.push(`/ride-details/${ride.id}`);
        return;
      default:
        return;
    }
    
    // Afișăm dialogul de confirmare
    Alert.alert(
      confirmationTitle,
      confirmationMessage,
      [
        { text: 'Anulează', style: 'cancel' },
        { 
          text: action === 'cancel' ? 'Da, anulează' : 'Da',
          style: action === 'cancel' ? 'destructive' : 'default',
          onPress: async () => {
            try {
              // Înlocuiește acest URL cu URL-ul real al API-ului tău
              const apiUrl = `http://192.168.1.50/transport-api/driver-rides.php?type=${activeTab}`;
              
              const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                  'Authorization': `Bearer ${user?.token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  ride_id: ride.id,
                  action: action
                })
              });
              
              const data = await response.json();
              
              if (data.success) {
                Alert.alert('Succes', data.message || successMessage);
                // Reîncărcăm cursele pentru a reflecta schimbarea
                loadRides();
              } else {
                Alert.alert('Eroare', data.message || 'Acțiunea nu a putut fi efectuată');
              }
            } catch (error) {
              console.error('Eroare la efectuarea acțiunii:', error);
              
              // În modul de dezvoltare, simulăm succesul
              if (__DEV__) {
                Alert.alert('Succes (simulat)', successMessage);
                // Reîncărcăm cursele pentru a reflecta schimbarea
                loadRides();
              } else {
                Alert.alert('Eroare', 'Acțiunea nu a putut fi efectuată. Verificați conexiunea la internet.');
              }
            }
          }
        }
      ]
    );
  };
  
  // Funcție pentru afișarea stării cursei
  const renderRideStatus = (status) => {
    let statusText = '';
    let statusColor = '';
    
    switch (status) {
      case RideStatus.PENDING:
        statusText = 'În așteptare';
        statusColor = '#FFA500'; // Portocaliu
        break;
      case RideStatus.ACCEPTED:
        statusText = 'Acceptată';
        statusColor = '#3498DB'; // Albastru
        break;
      case RideStatus.IN_PROGRESS:
        statusText = 'În desfășurare';
        statusColor = '#9B59B6'; // Violet
        break;
      case RideStatus.COMPLETED:
        statusText = 'Finalizată';
        statusColor = '#2ECC71'; // Verde
        break;
      case RideStatus.CANCELLED:
        statusText = 'Anulată';
        statusColor = '#E74C3C'; // Roșu
        break;
      default:
        statusText = 'Necunoscut';
        statusColor = '#95A5A6'; // Gri
    }
    
    return (
      <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
        <Text style={styles.statusText}>{statusText}</Text>
      </View>
    );
  };
  
  // Funcție pentru afișarea acțiunilor disponibile pentru o cursă
  const renderRideActions = (ride) => {
    switch (ride.status) {
      case RideStatus.PENDING:
        return (
          <View style={styles.rideActions}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.acceptButton]}
              onPress={() => handleRideAction(ride, 'accept')}
            >
              <Text style={styles.actionButtonText}>Acceptă</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => handleRideAction(ride, 'cancel')}
            >
              <Text style={styles.actionButtonText}>Refuză</Text>
            </TouchableOpacity>
          </View>
        );
      case RideStatus.ACCEPTED:
        return (
          <View style={styles.rideActions}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.startButton]}
              onPress={() => handleRideAction(ride, 'start')}
            >
              <Text style={styles.actionButtonText}>Începe cursa</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => handleRideAction(ride, 'cancel')}
            >
              <Text style={styles.actionButtonText}>Anulează</Text>
            </TouchableOpacity>
          </View>
        );
      case RideStatus.IN_PROGRESS:
        return (
          <View style={styles.rideActions}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.completeButton]}
              onPress={() => handleRideAction(ride, 'complete')}
            >
              <Text style={styles.actionButtonText}>Finalizează</Text>
            </TouchableOpacity>
          </View>
        );
      case RideStatus.COMPLETED:
      case RideStatus.CANCELLED:
        return (
          <View style={styles.rideActions}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.viewButton]}
              onPress={() => handleRideAction(ride, 'view')}
            >
              <Text style={styles.actionButtonText}>Vezi detalii</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };
  
  // Funcție pentru afișarea unei curse în listă
  const renderRideItem = ({ item }) => {
    const isCurrentRide = activeTab === 'current';
    
    return (
      <View style={styles.rideItem}>
        <View style={styles.rideHeader}>
          {renderRideStatus(item.status)}
          
          <Text style={styles.rideTime}>
            {isCurrentRide 
              ? `Acum ${Math.round((Date.now() - new Date(item.createdAt).getTime()) / 60000)} min`
              : item.status === RideStatus.COMPLETED
                ? `Finalizată acum ${Math.round((Date.now() - new Date(item.completedAt).getTime()) / 3600000)} ore`
                : `Anulată acum ${Math.round((Date.now() - new Date(item.cancelledAt).getTime()) / 3600000)} ore`
            }
          </Text>
        </View>
        
        <View style={styles.rideDetails}>
          <View style={styles.locationContainer}>
            <View style={styles.locationMarkers}>
              <View style={styles.pickupMarker} />
              <View style={styles.locationLine} />
              <View style={styles.destinationMarker} />
            </View>
            
            <View style={styles.locationTexts}>
              <Text style={styles.locationLabel}>Preluare:</Text>
              <Text style={styles.locationAddress} numberOfLines={1}>{item.pickup}</Text>
              
              <Text style={[styles.locationLabel, { marginTop: 10 }]}>Destinație:</Text>
              <Text style={styles.locationAddress} numberOfLines={1}>{item.destination}</Text>
            </View>
          </View>
          
          <View style={styles.rideInfo}>
            <View style={styles.rideInfoItem}>
              <Ionicons name="navigate-outline" size={16} color="#666" />
              <Text style={styles.rideInfoText}>{item.distance}</Text>
            </View>
            
            <View style={styles.rideInfoItem}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.rideInfoText}>
                {isCurrentRide ? item.estimatedTime : item.duration || 'N/A'}
              </Text>
            </View>
            
            <View style={styles.rideInfoItem}>
              <Ionicons name="cash-outline" size={16} color="#666" />
              <Text style={styles.rideInfoText}>{item.fare}</Text>
            </View>
          </View>
          
          <View style={styles.passengerInfo}>
            <Image 
              source={{ uri: item.passenger.profileImage }} 
              style={styles.passengerImage} 
            />
            
            <View style={styles.passengerDetails}>
              <Text style={styles.passengerName}>{item.passenger.name}</Text>
              
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={styles.ratingText}>{item.passenger.rating}</Text>
              </View>
            </View>
            
            {isCurrentRide && item.status !== RideStatus.PENDING && (
              <TouchableOpacity 
                style={styles.contactButton}
                onPress={() => {
                  // Aici ar trebui să implementezi funcționalitatea de apelare
                  Alert.alert('Contactare pasager', 'Această funcționalitate va fi implementată în versiunea finală.');
                }}
              >
                <Ionicons name="call-outline" size={20} color="#007BFF" />
              </TouchableOpacity>
            )}
          </View>
          
          {item.status === RideStatus.CANCELLED && (
            <View style={styles.cancellationContainer}>
              <Text style={styles.cancellationReason}>
                Motiv anulare: {item.cancellationReason}
              </Text>
            </View>
          )}
          
          {renderRideActions(item)}
        </View>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cursele mele</Text>
        <View style={styles.placeholder} />
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'current' && styles.activeTabButton]}
          onPress={() => setActiveTab('current')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'current' && styles.activeTabButtonText]}>
            Curse curente
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'history' && styles.activeTabButton]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'history' && styles.activeTabButtonText]}>
            Istoric
          </Text>
        </TouchableOpacity>
      </View>
      
      {isLoading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingText}>Se încarcă cursele...</Text>
        </View>
      ) : rides.length > 0 ? (
        <FlatList
          data={rides}
          renderItem={renderRideItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.ridesList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#007BFF']}
            />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="car-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>
            {activeTab === 'current' 
              ? 'Nu aveți curse active în acest moment'
              : 'Nu aveți curse în istoric'
            }
          </Text>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={handleRefresh}
          >
            <Text style={styles.refreshButtonText}>Reîmprospătează</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#007BFF',
  },
  tabButtonText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabButtonText: {
    color: '#007BFF',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  ridesList: {
    padding: 15,
  },
  rideItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  rideTime: {
    fontSize: 12,
    color: '#666',
  },
  rideDetails: {
    padding: 15,
  },
  locationContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  locationMarkers: {
    width: 20,
    alignItems: 'center',
    marginRight: 10,
  },
  pickupMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
  },
  locationLine: {
    width: 2,
    height: 30,
    backgroundColor: '#ddd',
    marginVertical: 5,
  },
  destinationMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F44336',
  },
  locationTexts: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: '#666',
  },
  locationAddress: {
    fontSize: 14,
    color: '#333',
    marginTop: 2,
  },
  rideInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  rideInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rideInfoText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 5,
  },
  passengerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  passengerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  passengerDetails: {
    flex: 1,
    marginLeft: 10,
  },
  passengerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  contactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e6f2ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancellationContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cancellationReason: {
    fontSize: 14,
    color: '#E74C3C',
    fontStyle: 'italic',
  },
  rideActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  startButton: {
    backgroundColor: '#3498DB',
  },
  completeButton: {
    backgroundColor: '#2ECC71',
  },
  cancelButton: {
    backgroundColor: '#E74C3C',
  },
  viewButton: {
    backgroundColor: '#007BFF',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  refreshButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007BFF',
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});