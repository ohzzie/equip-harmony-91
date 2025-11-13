import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  site: string;
  skills?: string[];
  certifications?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const MOCK_USERS: Record<string, User> = {
  'user@emms.com': {
    id: 'user-001',
    name: 'John Smith',
    email: 'user@emms.com',
    role: 'user',
    site: 'Site A',
    skills: ['Electrical', 'Mechanical', 'HVAC'],
    certifications: ['LOTO', 'Confined Space']
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('emms_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock authentication
    const user = MOCK_USERS[email.toLowerCase()];
    if (user) {
      setUser(user);
      localStorage.setItem('emms_user', JSON.stringify(user));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('emms_user');
  };

  const switchRole = (role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem('emms_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
