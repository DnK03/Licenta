import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView, 
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/auth';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const router = useRouter();
  const { signIn } = useAuth();

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Validate name
    if (!name.trim()) {
      newErrors.name = 'Numele este obligatoriu';
    }

    // Validate email
    if (!email.trim()) {
      newErrors.email = 'Email-ul este obligatoriu';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Adresa de email este invalidă';
    }

    // Validate password
    if (!password) {
      newErrors.password = 'Parola este obligatorie';
    } else if (password.length < 6) {
      newErrors.password = 'Parola trebuie să aibă minim 6 caractere';
    }

    // Validate confirm password
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Parolele nu coincid';
    }

    // Validate phone (optional)
    if (phone && !/^(\+4|)?(07[0-8]{1}[0-9]{1}|02[0-9]{2}|03[0-9]{2}){1}?(\s|\.|\-)?([0-9]{3}(\s|\.|\-|)){2}$/.test(phone)) {
      newErrors.phone = 'Numărul de telefon este invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const API_URL = 'http://10.0.2.2/transport-api/'; // Pentru emulator Android
      // Pentru dispozitive fizice, folosiți IP-ul computerului
      // const API_URL = 'http://192.168.1.100/transport-api/';

      const response = await fetch(`${API_URL}register.php`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, phone }),
      });

      // Pentru debugging
      const responseText = await response.text();

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        Alert.alert(
          'Eroare server', 
          'Serverul nu a returnat un răspuns valid. Verificați configurarea PHP.',
          [
            { text: 'Detalii', onPress: () => console.log(responseText) },
            { text: 'OK' }
          ]
        );
        return;
      }

      if (result.success) {
        // Apelăm funcția signIn din contextul de autentificare
        await signIn(result.user);
        // Navigăm către ecranul principal
        router.replace('/');
      } else {
        Alert.alert('Eroare', result.message || 'Înregistrarea a eșuat');
      }
    } catch (error) {
      Alert.alert('Eroare de rețea', 'Verificați conexiunea la internet și serverul PHP.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/images/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Creează cont nou</Text>
        <Text style={styles.subtitle}>Înregistrează-te pentru a începe</Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={22} color="#666" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, errors.name ? styles.inputError : null]}
              placeholder="Nume complet *"
              value={name}
              onChangeText={setName}
            />
          </View>
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={22} color="#666" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, errors.email ? styles.inputError : null]}
              placeholder="Email *"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={22} color="#666" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, errors.phone ? styles.inputError : null]}
              placeholder="Telefon (opțional)"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
          {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={22} color="#666" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, errors.password ? styles.inputError : null]}
              placeholder="Parolă *"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={22} color="#666" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, errors.confirmPassword ? styles.inputError : null]}
              placeholder="Confirmă parola *"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>
          {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Înregistrare</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Ai deja un cont? </Text>
          <Link href="/login" asChild>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Conectează-te</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  form: {
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
  },
  button: {
    backgroundColor: '#007BFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    fontSize: 16,
    color: '#666',
  },
  footerLink: {
    fontSize: 16,
    color: '#007BFF',
    fontWeight: 'bold',
  },
});
