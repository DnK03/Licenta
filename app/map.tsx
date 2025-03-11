import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';
import { Link } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';

export default function MapScreen() {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [region, setRegion] = useState({
    latitude: 45.0338367,  // Center point from your OSM data
    longitude: 25.8628394,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Pickup location"
          value={pickup}
          onChangeText={setPickup}
        />
        <TextInput
          style={styles.input}
          placeholder="Destination"
          value={destination}
          onChangeText={setDestination}
        />
      </View>
      
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {pickup && (
          <Marker
            coordinate={region}
            title="Pickup Location"
            description="Your current location"
            pinColor="blue"
          />
        )}
      </MapView>
      
      <Link href={{
        pathname: "/booking",
        params: { pickup, destination }
      }} asChild>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.buttonText}>Find Drivers</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    padding: 15,
    backgroundColor: 'white',
    elevation: 2,
    zIndex: 1,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  map: {
    flex: 1,
  },
  bookButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});