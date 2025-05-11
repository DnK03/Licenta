import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Modal,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/auth';

const { width, height } = Dimensions.get('window');

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [destination, setDestination] = useState(null);
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [recentLocations, setRecentLocations] = useState([
    { id: 1, name: 'Acasă', address: 'Strada Exemplu 123, București' },
    { id: 2, name: 'Birou', address: 'Bulevardul Unirii 10, București' },
    { id: 3, name: 'Universitate', address: 'Piața Universității, București' },
  ]);

  const mapRef = useRef(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permisiunea de localizare a fost refuzată');
        setIsLoading(false);
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        setIsLoading(false);
      } catch (error) {
        setErrorMsg('Nu s-a putut obține locația curentă');
        setIsLoading(false);
      }
    })();
  }, []);

  const handleSearch = () => {
    // În aplicația reală, aici ar trebui să folosiți un serviciu de geocodare
    // cum ar fi Google Places API pentru a căuta adresa
    Alert.alert('Căutare', `Căutare pentru: ${searchQuery}`);

    // Simulăm găsirea unei locații
    const mockLocation = {
      latitude: 44.4268,
      longitude: 26.1025,
      address: searchQuery || 'Locație căutată'
    };

    setDestination(mockLocation);
    setShowDestinationModal(true);
  };

  const handleSelectLocation = (location) => {
    setDestination({
      latitude: 44.4268, // În aplicația reală, acestea ar fi coordonatele reale ale locației
      longitude: 26.1025,
      address: location.address
    });
    setShowDestinationModal(true);
  };

  const handleBookRide = () => {
    // Aici ar trebui să navigați către ecranul de rezervare
    // cu detaliile despre destinație
    router.push({
      pathname: '/booking',
      params: {
        destinationAddress: destination.address,
        destinationLat: destination.latitude,
        destinationLng: destination.longitude
      }
    });
  };

  let mapDisplay = <ActivityIndicator size="large" color="#007BFF" />;

  if (!isLoading) {
    if (errorMsg) {
      mapDisplay = <Text style={styles.errorText}>{errorMsg}</Text>;
    } else if (location) {
      mapDisplay = (
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Locația mea"
            description="Aici te afli acum"
          >
            <View style={styles.markerContainer}>
              <View style={styles.markerDot} />
            </View>
          </Marker>

          {destination && (
            <Marker
              coordinate={{
                latitude: destination.latitude,
                longitude: destination.longitude,
              }}
              title="Destinație"
              description={destination.address}
              pinColor="#FF3B30"
            />
          )}
        </MapView>
      );
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="menu-outline" size={24} color="#333" />
        </TouchableOpacity>

        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Unde vrei să mergi?"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.mapContainer}>
        {mapDisplay}
      </View>

      {!showDestinationModal && !isLoading && !errorMsg && (
        <View style={styles.recentLocationsContainer}>
          <Text style={styles.recentLocationsTitle}>Locații recente</Text>
          <ScrollView style={styles.recentLocationsList}>
            {recentLocations.map((location) => (
              <TouchableOpacity
                key={location.id}
                style={styles.locationItem}
                onPress={() => handleSelectLocation(location)}
              >
                <View style={styles.locationIconContainer}>
                  <Ionicons name="location-outline" size={24} color="#007BFF" />
                </View>
                <View style={styles.locationDetails}>
                  <Text style={styles.locationName}>{location.name}</Text>
                  <Text style={styles.locationAddress}>{location.address}</Text>
                </View>
                <Ionicons name="chevron-forward-outline" size={20} color="#999" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <Modal
        visible={showDestinationModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirmă destinația</Text>
              <TouchableOpacity 
                onPress={() => setShowDestinationModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.destinationDetails}>
              <View style={styles.addressContainer}>
                <Ionicons name="location" size={24} color="#FF3B30" style={styles.addressIcon} />
                <View>
                  <Text style={styles.addressLabel}>Destinație</Text>
                  <Text style={styles.addressText}>{destination?.address}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editButtonText}>Editează</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.rideOptions}>
              <Text style={styles.rideOptionsTitle}>Opțiuni de călătorie</Text>

              <View style={styles.rideTypesContainer}>
                <TouchableOpacity style={[styles.rideTypeButton, styles.rideTypeSelected]}>
                  <Ionicons name="car" size={24} color="#007BFF" />
                  <Text style={styles.rideTypeText}>Standard</Text>
                  <Text style={styles.rideTypePrice}>25 RON</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.rideTypeButton}>
                  <Ionicons name="car-sport" size={24} color="#333" />
                  <Text style={styles.rideTypeText}>Comfort</Text>
                  <Text style={styles.rideTypePrice}>35 RON</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.rideTypeButton}>
                  <Ionicons name="car-sport" size={24} color="#333" />
                  <Text style={styles.rideTypeText}>Premium</Text>
                  <Text style={styles.rideTypePrice}>50 RON</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.bookButton}
              onPress={handleBookRide}
            >
              <Text style={styles.bookButtonText}>Rezervă acum</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInputContainer: {
    flex: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 123, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007BFF',
    borderWidth: 2,
    borderColor: 'white',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  recentLocationsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: height * 0.4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  recentLocationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  recentLocationsList: {
    maxHeight: height * 0.3,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  locationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  locationDetails: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: height * 0.7,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  destinationDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addressIcon: {
    marginRight: 15,
  },
  addressLabel: {
    fontSize: 14,
    color: '#666',
  },
  addressText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    maxWidth: width * 0.5,
  },
  editButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
  },
  editButtonText: {
    fontSize: 14,
    color: '#333',
  },
  rideOptions: {
    marginBottom: 20,
  },
  rideOptionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  rideTypesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rideTypeButton: {
    width: width * 0.28,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    padding: 15,
    justifyContent: 'space-between',
  },
  rideTypeSelected: {
    borderWidth: 2,
    borderColor: '#007BFF',
  },
  rideTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginTop: 5,
  },
  rideTypePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  bookButton: {
    backgroundColor: '#007BFF',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
