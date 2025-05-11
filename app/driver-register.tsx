import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function DriverRegisterScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // State pentru datele șoferului
  const [formData, setFormData] = useState({
    nume: '',
    prenume: '',
    email: '',
    telefon: '',
    parola: '',
    confirmaParola: '',
    cnp: '',
    numarPermis: '',
    adresa: '',
  });
  
  // State pentru documente și imagini
  const [profileImage, setProfileImage] = useState(null);
  const [driverLicenseImage, setDriverLicenseImage] = useState(null);
  const [idCardImage, setIdCardImage] = useState(null);
  
  // State pentru validare
  const [errors, setErrors] = useState({});
  
  // Funcție pentru actualizarea datelor din formular
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Resetăm eroarea pentru acest câmp dacă există
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null
      });
    }
  };
  
  // Funcție pentru selectarea imaginilor
  const pickImage = async (imageType) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permisiune necesară', 'Avem nevoie de permisiunea de a accesa galeria de imagini.');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: imageType === 'profile' ? [1, 1] : [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      const selectedImage = result.assets[0];
      
      switch (imageType) {
        case 'profile':
          setProfileImage(selectedImage.uri);
          break;
        case 'license':
          setDriverLicenseImage(selectedImage.uri);
          break;
        case 'idCard':
          setIdCardImage(selectedImage.uri);
          break;
      }
    }
  };
  
  // Funcție pentru validarea formularului
  const validateForm = () => {
    const newErrors = {};
    
    // Validare nume și prenume
    if (!formData.nume.trim()) newErrors.nume = 'Numele este obligatoriu';
    if (!formData.prenume.trim()) newErrors.prenume = 'Prenumele este obligatoriu';
    
    // Validare email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email-ul este obligatoriu';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Adresa de email nu este validă';
    }
    
    // Validare telefon
    const phoneRegex = /^(07[0-9]{8})$/;
    if (!formData.telefon.trim()) {
      newErrors.telefon = 'Numărul de telefon este obligatoriu';
    } else if (!phoneRegex.test(formData.telefon)) {
      newErrors.telefon = 'Numărul de telefon nu este valid (format: 07xxxxxxxx)';
    }
    
    // Validare parolă
    if (!formData.parola) {
      newErrors.parola = 'Parola este obligatorie';
    } else if (formData.parola.length < 6) {
      newErrors.parola = 'Parola trebuie să aibă cel puțin 6 caractere';
    }
    
    // Validare confirmare parolă
    if (formData.parola !== formData.confirmaParola) {
      newErrors.confirmaParola = 'Parolele nu coincid';
    }
    
    // Validare CNP
    const cnpRegex = /^[1-9]\d{12}$/;
    if (!formData.cnp.trim()) {
      newErrors.cnp = 'CNP-ul este obligatoriu';
    } else if (!cnpRegex.test(formData.cnp)) {
      newErrors.cnp = 'CNP-ul nu este valid (13 cifre)';
    }
    
    // Validare număr permis
    if (!formData.numarPermis.trim()) {
      newErrors.numarPermis = 'Numărul permisului este obligatoriu';
    }
    
    // Validare adresă
    if (!formData.adresa.trim()) {
      newErrors.adresa = 'Adresa este obligatorie';
    }
    
    // Validare imagini
    if (!profileImage) {
      newErrors.profileImage = 'Fotografia de profil este obligatorie';
    }
    
    if (!driverLicenseImage) {
      newErrors.driverLicenseImage = 'Fotografia permisului de conducere este obligatorie';
    }
    
    if (!idCardImage) {
      newErrors.idCardImage = 'Fotografia cărții de identitate este obligatorie';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Funcție pentru trimiterea formularului
  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Eroare', 'Vă rugăm să completați toate câmpurile obligatorii corect.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Aici ar trebui să trimitem datele către server
      // Simulăm un delay pentru a arăta loading state
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert(
          'Cerere trimisă',
          'Cererea ta de înregistrare ca șofer a fost trimisă cu succes. Te vom contacta în curând pentru verificare.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/')
            }
          ]
        );
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Eroare', 'A apărut o eroare la trimiterea cererii. Vă rugăm să încercați din nou.');
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
        <Text style={styles.headerTitle}>Înregistrare șofer</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informații personale</Text>
          
          <View style={styles.profileImageSection}>
            <TouchableOpacity 
              style={styles.profileImageContainer}
              onPress={() => pickImage('profile')}
            >
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Ionicons name="person" size={40} color="#ccc" />
                </View>
              )}
              <View style={styles.cameraIconContainer}>
                <Ionicons name="camera" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text style={styles.profileImageLabel}>Fotografie de profil</Text>
            {errors.profileImage && (
              <Text style={styles.errorText}>{errors.profileImage}</Text>
            )}
          </View>
          
          <View style={styles.inputRow}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.inputLabel}>Nume</Text>
              <TextInput
                style={[styles.input, errors.nume && styles.inputError]}
                value={formData.nume}
                onChangeText={(text) => handleChange('nume', text)}
                placeholder="Nume"
              />
              {errors.nume && (
                <Text style={styles.errorText}>{errors.nume}</Text>
              )}
            </View>
            
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Prenume</Text>
              <TextInput
                style={[styles.input, errors.prenume && styles.inputError]}
                value={formData.prenume}
                onChangeText={(text) => handleChange('prenume', text)}
                placeholder="Prenume"
              />
              {errors.prenume && (
                <Text style={styles.errorText}>{errors.prenume}</Text>
              )}
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Telefon</Text>
            <TextInput
              style={[styles.input, errors.telefon && styles.inputError]}
              value={formData.telefon}
              onChangeText={(text) => handleChange('telefon', text)}
              placeholder="Telefon (07xxxxxxxx)"
              keyboardType="phone-pad"
            />
            {errors.telefon && (
              <Text style={styles.errorText}>{errors.telefon}</Text>
            )}
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Parolă</Text>
            <TextInput
              style={[styles.input, errors.parola && styles.inputError]}
              value={formData.parola}
              onChangeText={(text) => handleChange('parola', text)}
              placeholder="Parolă"
              secureTextEntry
            />
            {errors.parola && (
              <Text style={styles.errorText}>{errors.parola}</Text>
            )}
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirmă parola</Text>
            <TextInput
              style={[styles.input, errors.confirmaParola && styles.inputError]}
              value={formData.confirmaParola}
              onChangeText={(text) => handleChange('confirmaParola', text)}
              placeholder="Confirmă parola"
              secureTextEntry
            />
            {errors.confirmaParola && (
              <Text style={styles.errorText}>{errors.confirmaParola}</Text>
            )}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informații șofer</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>CNP</Text>
            <TextInput
              style={[styles.input, errors.cnp && styles.inputError]}
              value={formData.cnp}
              onChangeText={(text) => handleChange('cnp', text)}
              placeholder="CNP (13 cifre)"
              keyboardType="number-pad"
              maxLength={13}
            />
            {errors.cnp && (
              <Text style={styles.errorText}>{errors.cnp}</Text>
            )}
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Număr permis de conducere</Text>
            <TextInput
              style={[styles.input, errors.numarPermis && styles.inputError]}
              value={formData.numarPermis}
              onChangeText={(text) => handleChange('numarPermis', text)}
              placeholder="Număr permis de conducere"
            />
            {errors.numarPermis && (
              <Text style={styles.errorText}>{errors.numarPermis}</Text>
            )}
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Adresă</Text>
            <TextInput
              style={[styles.input, errors.adresa && styles.inputError, { height: 80 }]}
              value={formData.adresa}
              onChangeText={(text) => handleChange('adresa', text)}
              placeholder="Adresă completă"
              multiline
            />
            {errors.adresa && (
              <Text style={styles.errorText}>{errors.adresa}</Text>
            )}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Documente</Text>
          
          <View style={styles.documentSection}>
            <Text style={styles.documentLabel}>Permis de conducere</Text>
            <TouchableOpacity 
              style={styles.documentPickerButton}
              onPress={() => pickImage('license')}
            >
              {driverLicenseImage ? (
                <Image source={{ uri: driverLicenseImage }} style={styles.documentImage} />
              ) : (
                <View style={styles.documentPlaceholder}>
                  <Ionicons name="card-outline" size={40} color="#ccc" />
                  <Text style={styles.documentPlaceholderText}>Apasă pentru a încărca</Text>
                </View>
              )}
            </TouchableOpacity>
            {errors.driverLicenseImage && (
              <Text style={styles.errorText}>{errors.driverLicenseImage}</Text>
            )}
          </View>
          
          <View style={styles.documentSection}>
            <Text style={styles.documentLabel}>Carte de identitate</Text>
            <TouchableOpacity 
              style={styles.documentPickerButton}
              onPress={() => pickImage('idCard')}
            >
              {idCardImage ? (
                <Image source={{ uri: idCardImage }} style={styles.documentImage} />
              ) : (
                <View style={styles.documentPlaceholder}>
                  <Ionicons name="id-card-outline" size={40} color="#ccc" />
                  <Text style={styles.documentPlaceholderText}>Apasă pentru a încărca</Text>
                </View>
              )}
            </TouchableOpacity>
            {errors.idCardImage && (
              <Text style={styles.errorText}>{errors.idCardImage}</Text>
            )}
          </View>
        </View>
        
        <View style={styles.termsSection}>
          <Text style={styles.termsText}>
            Prin apăsarea butonului "Trimite cerere", confirm că toate informațiile furnizate sunt corecte și sunt de acord cu 
            <Text style={styles.termsLink}> Termenii și condițiile</Text> și 
            <Text style={styles.termsLink}> Politica de confidențialitate</Text>.
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Trimite cerere</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
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
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  profileImageSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconContainer: {
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
  profileImageLabel: {
    fontSize: 14,
    color: '#666',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
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
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 5,
  },
  documentSection: {
    marginBottom: 20,
  },
  documentLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  documentPickerButton: {
    width: '100%',
    height: 150,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  documentImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  documentPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentPlaceholderText: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
  },
  termsSection: {
    marginBottom: 20,
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  termsLink: {
    color: '#007BFF',
  },
  submitButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});