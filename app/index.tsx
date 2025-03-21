import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/auth';

export default function HomeScreen() {
  const { user, signOut } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.name || 'User'}</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <Text style={styles.logoutText}>Logout</Text>
          <Ionicons name="log-out-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.quickActions}>
        <Link href="/booking" asChild>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="car" size={24} color="#007BFF" />
            <Text style={styles.actionText}>Book a Ride</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/map" asChild>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="map" size={24} color="#007BFF" />
            <Text style={styles.actionText}>Open Map</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Rides</Text>
        <View style={styles.rideCard}>
          <View style={styles.rideInfo}>
            <Ionicons name="time-outline" size={20} color="#666" />
            <Text style={styles.rideDate}>Today, 2:30 PM</Text>
          </View>
          <View style={styles.rideRoute}>
            <Text style={styles.rideLocation}>Home</Text>
            <Ionicons name="arrow-forward" size={16} color="#999" />
            <Text style={styles.rideLocation}>Work</Text>
          </View>
          <View style={styles.rideDetails}>
            <Text style={styles.ridePrice}>25.50 RON</Text>
            <Text style={styles.rideStatus}>Completed</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Favorite Locations</Text>
        <TouchableOpacity style={styles.locationCard}>
          <Ionicons name="home-outline" size={24} color="#007BFF" />
          <View style={styles.locationInfo}>
            <Text style={styles.locationName}>Home</Text>
            <Text style={styles.locationAddress}>Strada Exemplu 123, Bucharest</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.locationCard}>
          <Ionicons name="briefcase-outline" size={24} color="#007BFF" />
          <View style={styles.locationInfo}>
            <Text style={styles.locationName}>Work</Text>
            <Text style={styles.locationAddress}>Calea Victoriei 1-5, Bucharest</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  logoutText: {
    color: 'white',
    marginRight: 5,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionText: {
    marginTop: 8,
    fontWeight: '500',
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  rideCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  rideInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rideDate: {
    marginLeft: 5,
    color: '#666',
  },
  rideRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rideLocation: {
    fontSize: 16,
    fontWeight: '500',
    marginHorizontal: 5,
  },
  rideDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  ridePrice: {
    fontWeight: 'bold',
  },
  rideStatus: {
    color: '#28a745',
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  locationInfo: {
    flex: 1,
    marginLeft: 10,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '500',
  },
  locationAddress: {
    color: '#666',
    fontSize: 14,
  },
});