import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Image,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/auth';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [weatherData, setWeatherData] = useState({
    temp: 22,
    condition: 'Însorit',
    icon: 'sunny'
  });

  const [promotions, setPromotions] = useState([
    {
      id: 1,
      title: 'Reducere 20%',
      description: 'Pentru primele 5 curse în acest weekend',
      image: require('../assets/images/promo1.png')
    },
    {
      id: 2,
      title: 'Invită un prieten',
      description: 'Primești 15 RON pentru fiecare prieten invitat',
      image: require('../assets/images/promo2.png')
    }
  ]);

  const [recentRides, setRecentRides] = useState([
    {
      id: 1,
      destination: 'Piața Universității, București',
      date: '12 aprilie 2023',
      price: 35
    },
    {
      id: 2,
      destination: 'Aeroportul Otopeni, București',
      date: '5 aprilie 2023',
      price: 75
    }
  ]);

  const [favoriteLocations, setFavoriteLocations] = useState([
    { id: 1, name: 'Acasă', address: 'Strada Exemplu 123, București' },
    { id: 2, name: 'Birou', address: 'Bulevardul Unirii 10, București' }
  ]);

  const handleBookRide = () => {
    router.push('/map');
  };

  const handleSelectLocation = (location) => {
    router.push({
      pathname: '/map',
      params: { destination: location.address }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Bună, {user?.name?.split(' ')[0] || 'Utilizator'}!</Text>
            <Text style={styles.subGreeting}>Unde vrei să mergi astăzi?</Text>
          </View>

          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => router.push('/profile')}
          >
            <Ionicons name="person" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.weatherContainer}>
          <Ionicons name={weatherData.icon} size={24} color="#fff" />
          <Text style={styles.weatherText}>
            {weatherData.temp}°C • {weatherData.condition}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.bookRideButton}
            onPress={handleBookRide}
          >
            <Ionicons name="car" size={24} color="#fff" />
            <Text style={styles.bookRideText}>Rezervă o cursă</Text>
          </TouchableOpacity>

          <View style={styles.quickActionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIcon}>
                <Ionicons name="time" size={24} color="#007BFF" />
              </View>
              <Text style={styles.actionText}>Programări</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIcon}>
                <Ionicons name="star" size={24} color="#007BFF" />
              </View>
              <Text style={styles.actionText}>Favorite</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIcon}>
                <Ionicons name="gift" size={24} color="#007BFF" />
              </View>
              <Text style={styles.actionText}>Promoții</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Promoții</Text>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.promotionsContainer}
          >
            {promotions.map((promo) => (
              <TouchableOpacity key={promo.id} style={styles.promotionCard}>
                <Image 
                  source={promo.image} 
                  style={styles.promotionImage}
                  resizeMode="cover"
                />
                <View style={styles.promotionContent}>
                  <Text style={styles.promotionTitle}>{promo.title}</Text>
                  <Text style={styles.promotionDescription}>{promo.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Locații favorite</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Vezi toate</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.favoriteLocations}>
            {favoriteLocations.map((location) => (
              <TouchableOpacity 
                key={location.id} 
                style={styles.locationItem}
                onPress={() => handleSelectLocation(location)}
              >
                <View style={styles.locationIcon}>
                  <Ionicons 
                    name={location.name === 'Acasă' ? 'home' : 'briefcase'} 
                    size={24} 
                    color="#007BFF" 
                  />
                </View>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationName}>{location.name}</Text>
                  <Text style={styles.locationAddress}>{location.address}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.addLocationButton}>
              <Ionicons name="add-circle" size={24} color="#007BFF" />
              <Text style={styles.addLocationText}>Adaugă locație</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Curse recente</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Vezi toate</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.recentRides}>
            {recentRides.map((ride) => (
              <TouchableOpacity key={ride.id} style={styles.rideItem}>
                <View style={styles.rideIconContainer}>
                  <Ionicons name="car" size={24} color="#fff" />
                </View>
                <View style={styles.rideInfo}>
                  <Text style={styles.rideDestination}>{ride.destination}</Text>
                  <Text style={styles.rideDate}>{ride.date} • {ride.price} RON</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#007BFF" />
          <Text style={[styles.navText, styles.navTextActive]}>Acasă</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/map')}
        >
          <Ionicons name="map-outline" size={24} color="#999" />
          <Text style={styles.navText}>Hartă</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="time-outline" size={24} color="#999" />
          <Text style={styles.navText}>Activitate</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/profile')}
        >
          <Ionicons name="person-outline" size={24} color="#999" />
          <Text style={styles.navText}>Profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#007BFF',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  subGreeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 5,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  bookRideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007BFF',
    height: 50,
    borderRadius: 25,
    marginBottom: 15,
  },
  bookRideText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  quickActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    width: width * 0.28,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  actionText: {
    fontSize: 12,
    color: '#333',
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#007BFF',
  },
  promotionsContainer: {
    paddingRight: 20,
  },
  promotionCard: {
    width: width * 0.7,
    height: 150,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 15,
    backgroundColor: '#f9f9f9',
  },
  promotionImage: {
    width: '100%',
    height: 100,
  },
  promotionContent: {
    padding: 10,
  },
  promotionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  promotionDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  favoriteLocations: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e6f2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  locationInfo: {
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
  addLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  addLocationText: {
    fontSize: 14,
    color: '#007BFF',
    marginLeft: 5,
  },
  recentRides: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
  },
  rideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rideIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  rideInfo: {
    flex: 1,
  },
  rideDestination: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  rideDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  bottomNav: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  navTextActive: {
    color: '#007BFF',
  },
});
