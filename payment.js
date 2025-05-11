// Simulare sistem de plată pentru aplicația de transport
import AsyncStorage from '@react-native-async-storage/async-storage';

// Constante pentru tipurile de carduri
export const CARD_TYPES = {
  VISA: 'visa',
  MASTERCARD: 'mastercard',
};

// Simulare verificare card
export const validateCard = (cardNumber, expiryDate, cvv) => {
  // Verifică dacă numărul cardului are 16 cifre
  if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
    return { valid: false, message: 'Numărul cardului trebuie să conțină 16 cifre' };
  }
  
  // Verifică formatul datei de expirare (MM/YY)
  if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(expiryDate)) {
    return { valid: false, message: 'Data de expirare trebuie să fie în formatul MM/YY' };
  }
  
  // Verifică dacă data de expirare nu este în trecut
  const [month, year] = expiryDate.split('/');
  const expiryDateObj = new Date(2000 + parseInt(year), parseInt(month) - 1);
  const currentDate = new Date();
  
  if (expiryDateObj < currentDate) {
    return { valid: false, message: 'Cardul a expirat' };
  }
  
  // Verifică CVV (3 cifre)
  if (!/^\d{3}$/.test(cvv)) {
    return { valid: false, message: 'CVV trebuie să conțină 3 cifre' };
  }
  
  return { valid: true, message: 'Card valid' };
};

// Detectează tipul cardului bazat pe numărul cardului
export const detectCardType = (cardNumber) => {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  
  if (cleanNumber.startsWith('4')) {
    return CARD_TYPES.VISA;
  } else if (/^5[1-5]/.test(cleanNumber)) {
    return CARD_TYPES.MASTERCARD;
  }
  
  return null;
};

// Formatează numărul cardului pentru afișare (adaugă spații)
export const formatCardNumber = (cardNumber) => {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  const chunks = [];
  
  for (let i = 0; i < cleanNumber.length; i += 4) {
    chunks.push(cleanNumber.slice(i, i + 4));
  }
  
  return chunks.join(' ');
};

// Salvează un card în storage
export const saveCard = async (card) => {
  try {
    // Obține cardurile existente
    const existingCardsJson = await AsyncStorage.getItem('savedCards');
    let existingCards = existingCardsJson ? JSON.parse(existingCardsJson) : [];
    
    // Generează un ID unic pentru card
    const cardId = Date.now().toString();
    
    // Adaugă noul card
    const newCard = {
      id: cardId,
      number: card.number,
      // Salvăm doar ultimele 4 cifre pentru securitate
      maskedNumber: '**** **** **** ' + card.number.slice(-4),
      expiryDate: card.expiryDate,
      cardholderName: card.cardholderName,
      type: detectCardType(card.number),
      isDefault: existingCards.length === 0 ? true : false,
    };
    
    // Adaugă cardul la lista existentă
    existingCards.push(newCard);
    
    // Salvează lista actualizată
    await AsyncStorage.setItem('savedCards', JSON.stringify(existingCards));
    
    return { success: true, card: newCard };
  } catch (error) {
    console.error('Eroare la salvarea cardului:', error);
    return { success: false, error: 'Nu s-a putut salva cardul' };
  }
};

// Obține toate cardurile salvate
export const getSavedCards = async () => {
  try {
    const cardsJson = await AsyncStorage.getItem('savedCards');
    return cardsJson ? JSON.parse(cardsJson) : [];
  } catch (error) {
    console.error('Eroare la obținerea cardurilor:', error);
    return [];
  }
};

// Șterge un card
export const deleteCard = async (cardId) => {
  try {
    const cardsJson = await AsyncStorage.getItem('savedCards');
    if (!cardsJson) return { success: false, error: 'Nu există carduri salvate' };
    
    let cards = JSON.parse(cardsJson);
    const cardToDelete = cards.find(card => card.id === cardId);
    
    if (!cardToDelete) {
      return { success: false, error: 'Cardul nu a fost găsit' };
    }
    
    // Filtrează cardul care trebuie șters
    const updatedCards = cards.filter(card => card.id !== cardId);
    
    // Dacă cardul șters era cel implicit și mai există carduri, setează primul card ca implicit
    if (cardToDelete.isDefault && updatedCards.length > 0) {
      updatedCards[0].isDefault = true;
    }
    
    await AsyncStorage.setItem('savedCards', JSON.stringify(updatedCards));
    
    return { success: true };
  } catch (error) {
    console.error('Eroare la ștergerea cardului:', error);
    return { success: false, error: 'Nu s-a putut șterge cardul' };
  }
};

// Setează un card ca implicit
export const setDefaultCard = async (cardId) => {
  try {
    const cardsJson = await AsyncStorage.getItem('savedCards');
    if (!cardsJson) return { success: false, error: 'Nu există carduri salvate' };
    
    let cards = JSON.parse(cardsJson);
    
    // Resetează toate cardurile ca neimplicite și setează cardul selectat ca implicit
    cards = cards.map(card => ({
      ...card,
      isDefault: card.id === cardId
    }));
    
    await AsyncStorage.setItem('savedCards', JSON.stringify(cards));
    
    return { success: true };
  } catch (error) {
    console.error('Eroare la setarea cardului implicit:', error);
    return { success: false, error: 'Nu s-a putut seta cardul implicit' };
  }
};

// Simulează o tranzacție de plată
export const processPayment = async (amount, cardId = null) => {
  try {
    // Simulăm o întârziere pentru a imita procesarea plății
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulăm o rată de succes de 90%
    const isSuccessful = Math.random() < 0.9;
    
    if (isSuccessful) {
      // Generăm un ID de tranzacție
      const transactionId = 'TRX' + Date.now().toString();
      
      // Salvăm tranzacția în istoricul de plăți
      const historyJson = await AsyncStorage.getItem('paymentHistory');
      let history = historyJson ? JSON.parse(historyJson) : [];
      
      const transaction = {
        id: transactionId,
        amount,
        cardId,
        date: new Date().toISOString(),
        status: 'completed'
      };
      
      history.push(transaction);
      await AsyncStorage.setItem('paymentHistory', JSON.stringify(history));
      
      return {
        success: true,
        transactionId,
        message: 'Plata a fost procesată cu succes'
      };
    } else {
      return {
        success: false,
        error: 'Tranzacția a fost refuzată. Vă rugăm să încercați din nou sau să folosiți altă metodă de plată.'
      };
    }
  } catch (error) {
    console.error('Eroare la procesarea plății:', error);
    return {
      success: false,
      error: 'A apărut o eroare la procesarea plății'
    };
  }
};

// Obține istoricul de plăți
export const getPaymentHistory = async () => {
  try {
    const historyJson = await AsyncStorage.getItem('paymentHistory');
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error('Eroare la obținerea istoricului de plăți:', error);
    return [];
  }
};