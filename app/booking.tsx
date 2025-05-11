import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { processPayment, getSavedCards } from '../payment';
import { sendLocalNotification } from '../utils/notification';

// Date de test pentru tipurile de curse
const rideTypes = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'Mașină standard pentru 4 persoane',
    price: 25,
    time: '5-7 minute',
    icon: 'car-outline'
  },
  {
    id: 'comfort',
    name: 'Comfort',
    description: 'Mașină confortabilă pentru 4 persoane',
    price: 35,
    time: '7-10 minute',
    icon: 'car-sport-outline'
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Mașină premium pentru 4 persoane',
    price: 50,
    time: '10-15 minute',
    icon: 'car-sport'
  }
];

export default function BookingScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [pickupLocation, setPickupLocation] = useState('Strada Universității 1, București');
  const [destination, setDestination] = useState('');
  const [selectedRideType, setSelectedRideType] = useState('standard');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash');
  const [savedCards, setSavedCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [bookingData, setBookingData] = useState({
    distance: '5.2 km',
    duration: '15 minute',
    price: 25
  });

  // Încarcă cardurile salvate
  useEffect(() => {
    const loadCards = async () => {
      const cards = await getSavedCards();
      setSavedCards(cards);
      
      // Selectează cardul implicit dacă există
      const defaultCard = cards.find(card => card.isDefault);
      if (defaultCard) {
        setSelectedCardId(defaultCard.id);
        setSelectedPaymentMethod('card');
      }
    };
    
    loadCards();
  }, []);

  // Actualizează prețul când se schimbă tipul de cursă
  useEffect(() => {
    const selectedRide = rideTypes.find(type => type.id === selectedRideType);
    if (selectedRide) {
      setBookingData(prev => ({
        ...prev,
        price: selectedRide.price
      }));
    }
  }, [selectedRideType]);

  // Gestionează rezervarea cursei
  const handleBookRide = async () => {
    if (!destination) {
      Alert.alert('Eroare', 'Vă rugăm să introduceți destinația');
      return;
    }

    setIsLoading(true);
    
    // Procesează plata dacă metoda este card
    if (selectedPaymentMethod === 'card' && selectedCardId) {
      const paymentResult = await processPayment(bookingData.price, selectedCardId);
      
      if (!paymentResult.success) {
        setIsLoading(false);
        Alert.alert('Eroare de plată', paymentResult.error);
        return;
      }
    }
    
    // Simulăm o cerere către server pentru rezervare
    setTimeout(() => {
      setIsLoading(false);
      
      // Trimite notificare locală
      sendLocalNotification(
        'Cursă rezervată cu succes',
        `Șoferul va ajunge în aproximativ ${rideTypes.find(type => type.id === selectedRideType)?.time}.`
      );
      
      Alert.alert(
        'Rezervare confirmată',
        `Cursa ta a fost rezervată. Un șofer va ajunge în aproximativ ${rideTypes.find(type => type.id === selectedRideType)?.time}.`,
        [
          {
            text: 'OK',
            onPress: () => router.replace('/')
          }
        ]
      );
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rezervă o cursă</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Locații</Text>
          
          <View style={styles.locationInputContainer}>
            <View style={styles.locationIconContainer}>
              <View style={styles.pickupDot} />
              <View style={styles.locationLine} />
              <View style={styles.destinationDot} />
            </View>
            
            <View style={styles.locationInputs}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>De la</Text>
                <TextInput
                  style={styles.input}
                  value={pickupLocation}
                  onChangeText={setPickupLocation}
                  placeholder="Locația de preluare"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>La</Text>
                <TextInput
                  style={styles.input}
                  value={destination}
                  onChangeText={setDestination}
                  placeholder="Destinație"
                />
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tip de cursă</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rideTypesContainer}
          >
            {rideTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.rideTypeCard,
                  selectedRideType === type.id && styles.selectedRideType
                ]}
                onPress={() => setSelectedRideType(type.id)}
              >
                <Ionicons 
                  name={type.icon} 
                  size={32} 
                  color={selectedRideType === type.id ? "#007BFF" : "#666"} 
                />
                <Text style={styles.rideTypeName}>{type.name}</Text>
                <Text style={styles.rideTypeDescription}>{type.description}</Text>
                <Text style={styles.rideTypePrice}>{type.price} RON</Text>
                <Text style={styles.rideTypeTime}>{type.time}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Metodă de plată</Text>
          
          <View style={styles.paymentMethodsContainer}>
            <TouchableOpacity 
              style={[
                styles.paymentMethodButton,
                selectedPaymentMethod === 'cash' && styles.paymentMethodSelected
              ]}
              onPress={() => {
                setSelectedPaymentMethod('cash');
                setSelectedCardId(null);
              }}
            >
              <Ionicons 
                name="cash" 
                size={24} 
                color={selectedPaymentMethod === 'cash' ? "#007BFF" : "#333"} 
              />
              <Text style={styles.paymentMethodName}>Numerar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.paymentMethodButton,
                selectedPaymentMethod === 'card' && styles.paymentMethodSelected
              ]}
              onPress={() => setSelectedPaymentMethod('card')}
            >
              <Ionicons 
                name="card" 
                size={24} 
                color={selectedPaymentMethod === 'card' ? "#007BFF" : "#333"} 
              />
              <Text style={styles.paymentMethodName}>Card</Text>
            </TouchableOpacity>
          </View>
          
          {selectedPaymentMethod === 'card' && (
            <View style={styles.cardSelection}>
              {savedCards.length === 0 ? (
                <TouchableOpacity 
                  style={styles.addCardButton}
                  onPress={() => router.push('/payment-methods')}
                >
                  <Ionicons name="add-circle" size={20} color="#007BFF" />
                  <Text style={styles.addCardButtonText}>Adaugă un card</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {savedCards.map((card) => (
                      <TouchableOpacity 
                        key={card.id}
                        style={[
                          styles.savedCardItem,
                          selectedCardId === card.id && styles.selectedCardItem
                        ]}
                        onPress={() => setSelectedCardId(card.id)}
                      >
                        <Ionicons 
                          name="card" 
                          size={20} 
                          color={card.type === 'visa' ? "#1A1F71" : "#EB001B"} 
                        />
                        <Text style={styles.savedCardNumber}>{card.maskedNumber}</Text>
                        {card.isDefault && (
                          <View style={styles.defaultCardBadge}>
                            <Text style={styles.defaultCardText}>Implicit</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    ))}
                    
                    <TouchableOpacity 
                      style={styles.addCardButton}
                      onPress={() => router.push('/payment-methods')}
                    >
                      <Ionicons name="add-circle" size={20} color="#007BFF" />
                      <Text style={styles.addCardButtonText}>Adaugă</Text>
                    </TouchableOpacity>
                  </ScrollView>
                </>
              )}
            </View>
          )}
        </View>
        
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Distanță</Text>
            <Text style={styles.summaryValue}>{bookingData.distance}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Durată estimată</Text>
            <Text style={styles.summaryValue}>{bookingData.duration}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Preț total</Text>
            <Text style={styles.summaryPrice}>{bookingData.price} RON</Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.bookButton}
          onPress={handleBookRide}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.bookButtonText}>Rezervă acum</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  locationInputContainer: {
    flexDirection: 'row',
  },
  locationIconContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 10,
  },
  pickupDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    marginTop: 12,
  },
  locationLine: {
    width: 2,
    height: 30,
    backgroundColor: '#ddd',
    marginVertical: 5,
  },
  destinationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F44336',
  },
  locationInputs: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  rideTypesContainer: {
    paddingVertical: 10,
  },
  rideTypeCard: {
    width: 150,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginRight: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedRideType: {
    borderColor: '#007BFF',
    backgroundColor: '#e6f2ff',
  },
  rideTypeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  rideTypeDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
    height: 30,
  },
  rideTypePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF',
    marginTop: 10,
  },
  rideTypeTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  paymentMethodsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentMethodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#eee',
  },
  paymentMethodSelected: {
    borderColor: '#007BFF',
    backgroundColor: '#e6f2ff',
  },
  paymentMethodName: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  cardSelection: {
    marginTop: 15,
  },
  savedCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedCardItem: {
    borderColor: '#007BFF',
    backgroundColor: '#e6f2ff',
  },
  savedCardNumber: {
    fontSize: 14,
    color: '#333',
    marginLeft: 5,
  },
  defaultCardBadge: {
    backgroundColor: '#007BFF',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginLeft: 5,
  },
  defaultCardText: {
    fontSize: 10,
    color: '#fff',
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#eee',
    borderStyle: 'dashed',
  },
  addCardButtonText: {
    fontSize: 14,
    color: '#007BFF',
    marginLeft: 5,
  },
  summarySection: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    margin: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  summaryPrice: {
    fontSize: 18,
    color: '#007BFF',
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  bookButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});