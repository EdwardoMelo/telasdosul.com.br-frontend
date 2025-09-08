import { Usuario } from '@/models/Usuario';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type User = Usuario;

interface UserContextProps {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  

  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    const token = localStorage.getItem('token');
 
    if (storedUser && token) {
      setUser(new Usuario(JSON.parse(storedUser)));
    }
  }, []);

  const login = (userData: User, token: string) => {
    localStorage.setItem('usuario', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};