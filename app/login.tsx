import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/auth';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  
  // State pentru datele de login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userTypeSelection, setUserTypeSelection] = useState('user'); // 'user' sau 'driver'
  
  // Funcție pentru autentificare
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Eroare', 'Te rugăm să completezi toate câmpurile.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Apelăm funcția de login din contextul de autentificare
      await login(email, password, userTypeSelection);
      
      // Redirecționăm utilizatorul în funcție de tipul de cont
      if (userTypeSelection === 'driver') {
        router.replace('/driver-profile');
      } else {
        router.replace('/(tabs)');
      }
    } catch (error) {
      Alert.alert('Eroare de autentificare', 'Email sau parolă incorectă. Te rugăm să încerci din nou.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>AplicatieLicenta</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.title}>Autentificare</Text>
          
          {/* Selector pentru tipul de utilizator */}
          <View style={styles.userTypeContainer}>
            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userTypeSelection === 'user' && styles.userTypeButtonActive
              ]}
              onPress={() => setUserTypeSelection('user')}
            >
              <Ionicons
                name="person"
                size={20}
                color={userTypeSelection === 'user' ? '#fff' : '#007BFF'}
              />
              <Text
                style={[
                  styles.userTypeText,
                  userTypeSelection === 'user' && styles.userTypeTextActive
                ]}
              >
                Pasager
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userTypeSelection === 'driver' && styles.userTypeButtonActive
              ]}
              onPress={() => setUserTypeSelection('driver')}
            >
              <Ionicons
                name="car"
                size={20}
                color={userTypeSelection === 'driver' ? '#fff' : '#007BFF'}
              />
              <Text
                style={[
                  styles.userTypeText,
                  userTypeSelection === 'driver' && styles.userTypeTextActive
                ]}
              >
                Șofer
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Parolă"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.passwordToggle}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => router.push('/forgot-password')}
          >
            <Text style={styles.forgotPasswordText}>Ai uitat parola?</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Autentificare</Text>
            )}
          </TouchableOpacity>
          
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Nu ai un cont? </Text>
            <TouchableOpacity onPress={() => {
              if (userTypeSelection === 'driver') {
                router.push('/driver-register');
              } else {
                router.push('/register');
              }
            }}>
              <Text style={styles.registerLink}>Înregistrează-te</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007BFF',
    marginTop: 10,
  },
  formContainer: {
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  userTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  userTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007BFF',
  },
  userTypeButtonActive: {
    backgroundColor: '#007BFF',
  },
  userTypeText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#007BFF',
  },
  userTypeTextActive: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  passwordToggle: {
    padding: 5,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#007BFF',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    color: '#666',
    fontSize: 14,
  },
  registerLink: {
    color: '#007BFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});