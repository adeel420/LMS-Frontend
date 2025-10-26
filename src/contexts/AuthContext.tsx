import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { apiService } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string, captcha: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@lms.com',
    name: 'System Administrator',
    role: 'admin',
    registration_date: '2025-01-01',
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'hashim.yaqub@gmail.com',
    name: 'Hashim Yaqoob',
    role: 'learner',
    learner_id: 'LRN001',
    phone: '00923365555683',
    date_of_birth: '1983-01-25',
    ethnicity: 'Pakistan',
    registration_date: '18/03/2025',
    created_at: '2025-03-18T00:00:00Z'
  },
  {
    id: '3',
    email: 'accessor@lms.com',
    name: 'Dr. Sarah Johnson',
    role: 'accessor',
    registration_date: '2025-01-15',
    created_at: '2025-01-15T00:00:00Z'
  },
  {
    id: '4',
    email: 'iqa@lms.com',
    name: 'Prof. Michael Smith',
    role: 'iqa',
    registration_date: '2025-01-10',
    created_at: '2025-01-10T00:00:00Z'
  },
  {
    id: '5',
    email: 'eqa@lms.com',
    name: 'Board Representative',
    role: 'eqa',
    registration_date: '2025-01-05',
    created_at: '2025-01-05T00:00:00Z'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token and get user info
    const token = localStorage.getItem('token');
    if (token) {
      apiService.getMe()
        .then(response => {
          setUser({
            id: response.user.id,
            email: response.user.email || '',
            name: response.user.username,
            role: response.user.role,
            registration_date: new Date().toISOString().split('T')[0],
            created_at: new Date().toISOString()
          });
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username: string, password: string, captcha: string): Promise<boolean> => {
    try {
      const response = await apiService.login(username, password, captcha);
      localStorage.setItem('token', response.token);
      
      const userData: User = {
        id: response.user.id,
        email: response.user.email || '',
        name: response.user.username,
        role: response.user.role,
        registration_date: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString()
      };
      
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};