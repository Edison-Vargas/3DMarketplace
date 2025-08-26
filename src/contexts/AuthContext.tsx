import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  type: 'buyer' | 'seller';
  avatar?: string;
  bio?: string;
  location?: string;
  rating?: number;
  totalSales?: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User> & { email: string; password: string }) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users based on personas
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    email: 'maria.designer@email.com',
    password: '123456',
    name: 'Manuela Costa',
    type: 'buyer',
    avatar: '',
    bio: 'Designer de produto apaixonada por detalhes e inovação. Sempre em busca de peças únicas para meus projetos.',
    location: 'São Paulo, SP',
    rating: 4.9
  },
  {
    id: '2',
    email: 'fabricio.3d@email.com',
    password: '123456',
    name: 'Ricardo Almeida',
    type: 'seller',
    avatar: '',
    bio: 'Empreendedor e tutor de impressão 3D. Especialista em modelos de alta qualidade e projetos personalizados.',
    location: 'Rio de Janeiro, RJ',
    rating: 4.8,
    totalSales: 247
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('marketplace3d_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('marketplace3d_user', JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (userData: Partial<User> & { email: string; password: string }): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    if (mockUsers.find(u => u.email === userData.email)) {
      setIsLoading(false);
      return false;
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      name: userData.name || 'Usuário',
      type: userData.type || 'buyer',
      avatar: userData.avatar,
      bio: userData.bio,
      location: userData.location,
      rating: 5.0
    };
    
    mockUsers.push({ ...newUser, password: userData.password });
    setUser(newUser);
    localStorage.setItem('marketplace3d_user', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('marketplace3d_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
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