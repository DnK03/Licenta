import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';

// Define the user type
type User = {
  id: string;
  email: string;
  name: string;
} | null;

// Define the auth context type
type AuthContextType = {
  user: User;
  signIn: (userData: User) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
};

// Create the auth context
const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => {},
  signOut: async () => {},
  isLoading: true,
});

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  // Check if the user is authenticated
  useEffect(() => {
    const checkUser = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to get user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  // Handle routing based on authentication
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup && segments[0] !== 'login' && segments[0] !== 'register') {
      // Redirect to login if not authenticated
      router.replace('/login');
    } else if (user && (segments[0] === 'login' || segments[0] === 'register')) {
      // Redirect to home if authenticated and in auth group
      router.replace('/');
    }
  }, [user, segments, isLoading]);

  // Sign in function
  const signIn = async (userData: User) => {
    setUser(userData);
    if (userData) {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    }
  };

  // Sign out function
  const signOut = async () => {
    setUser(null);
    await AsyncStorage.removeItem('userData');
    router.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);