import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function BookingScreen() {
  const params = useLocalSearchParams();
  const { pickup, destination } = params;
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  
  const vehicles = [
    { id: '1', type: 'Economy', price: '$10', eta: '3 min' },
    { id: '2', type: 'Comfort', price: '$15', eta: '5 min' },
    { id: '3', type: 'Premium', price: '$25', eta: '7 min' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.routeInfo}>
        <Text style={styles.routeText}>From: {pickup}</Text>
        <Text style={styles.routeText}>To: {destination}</Text>
      </View>
      
      <Text style={styles.heading}>Available Vehicles</Text>
      
      <FlatList
        data={vehicles}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[
              styles.vehicleItem, 
              selectedVehicle === item.id && styles.selectedVehicle
            ]}
            onPress={() => setSelectedVehicle(item.id)}
          >
            <Text style={styles.vehicleType}>{item.type}</Text>
            <Text style={styles.vehiclePrice}>{item.price}</Text>
            <Text style={styles.vehicleEta}>ETA: {item.eta}</Text>
          </TouchableOpacity>
        )}
      />
      
      <TouchableOpacity 
        style={[styles.confirmButton, !selectedVehicle && styles.disabledButton]}
        disabled={!selectedVehicle}
        onPress={() => alert('Booking confirmed!')}
      >
        <Text style={styles.buttonText}>Confirm Booking</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  routeInfo: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 1,
  },
  routeText: {
    fontSize: 16,
    marginVertical: 5,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  vehicleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 5,
    elevation: 1,
  },
  selectedVehicle: {
    backgroundColor: '#e6f7ff',
    borderColor: '#007BFF',
    borderWidth: 1,
  },
  vehicleType: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  vehiclePrice: {
    fontSize: 16,
  },
  vehicleEta: {
    fontSize: 14,
    color: '#666',
  },
  confirmButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});