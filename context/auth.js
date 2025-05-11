import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Creăm contextul de autentificare
const AuthContext = createContext();

// Hook pentru a utiliza contextul de autentificare
export const useAuth = () => useContext(AuthContext);

// Provider pentru contextul de autentificare
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'user' sau 'driver'

  // Verificăm starea de autentificare la încărcarea aplicației
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const storedUserType = await AsyncStorage.getItem('userType');
        const userData = await AsyncStorage.getItem('userData');
        
        if (token && storedUserType) {
          setIsAuthenticated(true);
          setUserType(storedUserType);
          
          if (userData) {
            setUser(JSON.parse(userData));
          }
        }
      } catch (error) {
        console.error('Eroare la verificarea stării de autentificare:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  // Funcție pentru autentificare
  const login = async (email, password, type = 'user') => {
    try {
      // Aici ar trebui să facem un apel API către server pentru autentificare
      // Pentru exemplu, simulăm un răspuns de succes
      
      // În aplicația reală, aceste date ar veni de la server
      const mockUserData = {
        id: '123',
        name: 'John Doe',
        email: email,
        // alte date ale utilizatorului
      };
      
      // Salvăm token-ul și datele utilizatorului în AsyncStorage
      await AsyncStorage.setItem('authToken', 'mock-token-123');
      await AsyncStorage.setItem('userType', type);
      await AsyncStorage.setItem('userData', JSON.stringify(mockUserData));
      
      // Actualizăm starea
      setIsAuthenticated(true);
      setUserType(type);
      setUser(mockUserData);
      
      return true;
    } catch (error) {
      console.error('Eroare la autentificare:', error);
      throw error;
    }
  };

  // Funcție pentru înregistrare
  const register = async (userData, type = 'user') => {
    try {
      // Aici ar trebui să facem un apel API către server pentru înregistrare
      // Pentru exemplu, simulăm un răspuns de succes
      
      // În aplicația reală, aceste date ar veni de la server
      const mockUserData = {
        id: '123',
        name: userData.name,
        email: userData.email,
        // alte date ale utilizatorului
      };
      
      // Salvăm token-ul și datele utilizatorului în AsyncStorage
      await AsyncStorage.setItem('authToken', 'mock-token-123');
      await AsyncStorage.setItem('userType', type);
      await AsyncStorage.setItem('userData', JSON.stringify(mockUserData));
      
      // Actualizăm starea
      setIsAuthenticated(true);
      setUserType(type);
      setUser(mockUserData);
      
      return true;
    } catch (error) {
      console.error('Eroare la înregistrare:', error);
      throw error;
    }
  };

  // Funcție pentru deconectare
  const logout = async () => {
    try {
      // Ștergem datele de autentificare din AsyncStorage
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userType');
      await AsyncStorage.removeItem('userData');
      
      // Actualizăm starea
      setIsAuthenticated(false);
      setUserType(null);
      setUser(null);
    } catch (error) {
      console.error('Eroare la deconectare:', error);
    }
  };

  // Funcție pentru actualizarea datelor utilizatorului
  const updateUserData = async (newData) => {
    try {
      // Aici ar trebui să facem un apel API către server pentru actualizarea datelor
      // Pentru exemplu, simulăm un răspuns de succes
      
      const updatedUserData = { ...user, ...newData };
      
      // Salvăm datele actualizate în AsyncStorage
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
      
      // Actualizăm starea
      setUser(updatedUserData);
      
      return true;
    } catch (error) {
      console.error('Eroare la actualizarea datelor utilizatorului:', error);
      throw error;
    }
  };

  // Valoarea contextului
  const value = {
    isAuthenticated,
    isLoading,
    user,
    userType,
    login,
    register,
    logout,
    updateUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};