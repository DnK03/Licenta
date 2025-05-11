import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { 
  validateCard, 
  formatCardNumber, 
  detectCardType, 
  saveCard, 
  getSavedCards,
  deleteCard,
  setDefaultCard,
  CARD_TYPES
} from '../payment';

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [savedCards, setSavedCards] = useState([]);
  const [showAddCard, setShowAddCard] = useState(false);
  
  // State pentru noul card
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [cardType, setCardType] = useState(null);
  
  // Încarcă cardurile salvate
  useEffect(() => {
    loadSavedCards();
  }, []);
  
  const loadSavedCards = async () => {
    setIsLoading(true);
    const cards = await getSavedCards();
    setSavedCards(cards);
    setIsLoading(false);
  };
  
  // Gestionează schimbarea numărului cardului
  const handleCardNumberChange = (text) => {
    // Permite doar cifre și spații
    const formattedText = formatCardNumber(text.replace(/[^0-9]/g, ''));
    setCardNumber(formattedText);
    
    // Detectează tipul cardului
    const type = detectCardType(formattedText);
    setCardType(type);
  };
  
  // Gestionează schimbarea datei de expirare
  const handleExpiryDateChange = (text) => {
    // Permite doar cifre și /
    text = text.replace(/[^0-9]/g, '');
    
    if (text.length > 2) {
      text = text.substring(0, 2) + '/' + text.substring(2, 4);
    }
    
    setExpiryDate(text);
  };
  
  // Salvează cardul nou
  const handleSaveCard = async () => {
    // Validează cardul
    const validation = validateCard(cardNumber, expiryDate, cvv);
    
    if (!validation.valid) {
      Alert.alert('Eroare', validation.message);
      return;
    }
    
    if (!cardholderName.trim()) {
      Alert.alert('Eroare', 'Vă rugăm să introduceți numele titularului cardului');
      return;
    }
    
    setIsLoading(true);
    
    const result = await saveCard({
      number: cardNumber.replace(/\s/g, ''),
      expiryDate,
      cardholderName,
    });
    
    if (result.success) {
      // Resetează formularul
      setCardNumber('');
      setExpiryDate('');
      setCvv('');
      setCardholderName('');
      setCardType(null);
      setShowAddCard(false);
      
      // Reîncarcă cardurile
      await loadSavedCards();
      
      Alert.alert('Succes', 'Cardul a fost adăugat cu succes');
    } else {
      Alert.alert('Eroare', result.error || 'Nu s-a putut salva cardul');
    }
    
    setIsLoading(false);
  };
  
  // Șterge un card
  const handleDeleteCard = async (cardId) => {
    Alert.alert(
      'Confirmare',
      'Sigur doriți să ștergeți acest card?',
      [
        {
          text: 'Anulează',
          style: 'cancel'
        },
        {
          text: 'Șterge',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            const result = await deleteCard(cardId);
            
            if (result.success) {
              await loadSavedCards();
              Alert.alert('Succes', 'Cardul a fost șters');
            } else {
              Alert.alert('Eroare', result.error || 'Nu s-a putut șterge cardul');
            }
            
            setIsLoading(false);
          }
        }
      ]
    );
  };
  
  // Setează un card ca implicit
  const handleSetDefaultCard = async (cardId) => {
    setIsLoading(true);
    const result = await setDefaultCard(cardId);
    
    if (result.success) {
      await loadSavedCards();
    } else {
      Alert.alert('Eroare', result.error || 'Nu s-a putut seta cardul implicit');
    }
    
    setIsLoading(false);
  };
  
  // Renderează iconița pentru tipul cardului
  const renderCardTypeIcon = (type) => {
    switch (type) {
      case CARD_TYPES.VISA:
        return <Ionicons name="card" size={24} color="#1A1F71" />;
      case CARD_TYPES.MASTERCARD:
        return <Ionicons name="card" size={24} color="#EB001B" />;
      default:
        return <Ionicons name="card-outline" size={24} color="#999" />;
    }
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
        <Text style={styles.headerTitle}>Metode de plată</Text>
        <View style={styles.placeholder} />
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {!showAddCard ? (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Carduri salvate</Text>
                
                {savedCards.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Ionicons name="card-outline" size={48} color="#ccc" />
                    <Text style={styles.emptyStateText}>Nu aveți carduri salvate</Text>
                  </View>
                ) : (
                  savedCards.map((card) => (
                    <View key={card.id} style={styles.cardItem}>
                      <View style={styles.cardInfo}>
                        {renderCardTypeIcon(card.type)}
                        <View style={styles.cardDetails}>
                          <Text style={styles.cardNumber}>{card.maskedNumber}</Text>
                          <Text style={styles.cardName}>{card.cardholderName}</Text>
                          <Text style={styles.cardExpiry}>Exp: {card.expiryDate}</Text>
                        </View>
                      </View>
                      
                      <View style={styles.cardActions}>
                        {card.isDefault ? (
                          <View style={styles.defaultBadge}>
                            <Text style={styles.defaultBadgeText}>Implicit</Text>
                          </View>
                        ) : (
                          <TouchableOpacity 
                            style={styles.setDefaultButton}
                            onPress={() => handleSetDefaultCard(card.id)}
                          >
                            <Text style={styles.setDefaultButtonText}>Setează implicit</Text>
                          </TouchableOpacity>
                        )}
                        
                        <TouchableOpacity 
                          style={styles.deleteButton}
                          onPress={() => handleDeleteCard(card.id)}
                        >
                          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                )}
                
                <TouchableOpacity 
                  style={styles.addCardButton}
                  onPress={() => setShowAddCard(true)}
                >
                  <Ionicons name="add-circle" size={24} color="#007BFF" />
                  <Text style={styles.addCardButtonText}>Adaugă un card nou</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Alte metode de plată</Text>
                
                <TouchableOpacity style={styles.paymentMethodItem}>
                  <Ionicons name="cash-outline" size={24} color="#333" />
                  <Text style={styles.paymentMethodText}>Numerar</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.infoSection}>
                <Ionicons name="shield-checkmark" size={24} color="#007BFF" />
                <Text style={styles.infoText}>
                  Datele cardului dvs. sunt criptate și stocate în siguranță. Nu vom stoca niciodată codul CVV.
                </Text>
              </View>
            </>
          ) : (
            <View style={styles.addCardForm}>
              <Text style={styles.formTitle}>Adaugă un card nou</Text>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Număr card</Text>
                <View style={styles.cardNumberContainer}>
                  <TextInput
                    style={styles.cardNumberInput}
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChangeText={handleCardNumberChange}
                    keyboardType="number-pad"
                    maxLength={19} // 16 cifre + 3 spații
                  />
                  {cardType && (
                    <View style={styles.cardTypeIcon}>
                      {renderCardTypeIcon(cardType)}
                    </View>
                  )}
                </View>
              </View>
              
              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.label}>Data expirării</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChangeText={handleExpiryDateChange}
                    keyboardType="number-pad"
                    maxLength={5} // MM/YY
                  />
                </View>
                
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>CVV</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    value={cvv}
                    onChangeText={setCvv}
                    keyboardType="number-pad"
                    maxLength={3}
                    secureTextEntry
                  />
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Numele titularului</Text>
                <TextInput
                  style={styles.input}
                  placeholder="NUME PRENUME"
                  value={cardholderName}
                  onChangeText={setCardholderName}
                  autoCapitalize="characters"
                />
              </View>
              
              <View style={styles.formActions}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setShowAddCard(false)}
                >
                  <Text style={styles.cancelButtonText}>Anulează</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={handleSaveCard}
                >
                  <Text style={styles.saveButtonText}>Salvează</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
  cardItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardDetails: {
    marginLeft: 15,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  cardName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  cardExpiry: {
    fontSize: 14,
    color: '#666',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  defaultBadge: {
    backgroundColor: '#e6f2ff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  defaultBadgeText: {
    fontSize: 12,
    color: '#007BFF',
    fontWeight: '500',
  },
  setDefaultButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  setDefaultButtonText: {
    fontSize: 14,
    color: '#007BFF',
  },
  deleteButton: {
    padding: 5,
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginTop: 10,
  },
  addCardButtonText: {
    fontSize: 16,
    color: '#007BFF',
    marginLeft: 10,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
  },
  paymentMethodText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
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
  addCardForm: {
    padding: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
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
  cardNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  cardNumberInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  cardTypeIcon: {
    marginLeft: 10,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#007BFF',
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
});