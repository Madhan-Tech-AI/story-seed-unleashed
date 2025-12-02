import React, { createContext, useContext, useState, useCallback } from 'react';

type UserRole = 'user' | 'judge' | 'admin' | null;

interface User {
  email: string;
  role: UserRole;
  name: string;
  userId: string;
  avatar?: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => boolean;
  register: (payload: RegisterPayload) => void;
  logout: () => void;
  role: UserRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const VALID_CREDENTIALS = {
  email: 'madhankumar070406@gmail.com',
  password: 'Madhan@2407',
};

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('storyseed_user');
    if (!stored) return null;
    try {
      const parsed = JSON.parse(stored);
      if (!parsed.userId) {
        parsed.userId = 'SSU-' + Math.floor(Math.random() * 9000 + 1000);
        localStorage.setItem('storyseed_user', JSON.stringify(parsed));
      }
      return parsed;
    } catch {
      return null;
    }
  });

  const login = useCallback((email: string, password: string, role: UserRole): boolean => {
    const storedSignup = localStorage.getItem('storyseed_signup_credentials');
    const parsedSignup = storedSignup ? JSON.parse(storedSignup) : null;

    const isDefaultUser =
      email === VALID_CREDENTIALS.email && password === VALID_CREDENTIALS.password;
    const isRegisteredUser =
      parsedSignup && email === parsedSignup.email && password === parsedSignup.password;

    if (isDefaultUser || isRegisteredUser) {
      const userData: User =
        isRegisteredUser && parsedSignup
          ? {
              email: parsedSignup.email,
              name: parsedSignup.name,
              role: 'user',
              userId: parsedSignup.userId || 'SSU-' + Math.floor(Math.random() * 9000 + 1000),
              avatar: DEFAULT_AVATAR,
            }
          : {
              email: VALID_CREDENTIALS.email,
              role,
              name: 'Madhan Kumar',
              userId: 'SSU-1001',
              avatar: DEFAULT_AVATAR,
            };
      setUser(userData);
      localStorage.setItem('storyseed_user', JSON.stringify(userData));
      return true;
    }
    return false;
  }, []);

  const register = useCallback(({ name, email, password }: RegisterPayload) => {
    const userData: User = {
      email,
      role: 'user',
      name,
      userId: 'SSU-' + Math.floor(Math.random() * 9000 + 1000),
      avatar: DEFAULT_AVATAR,
    };
    setUser(userData);
    localStorage.setItem('storyseed_user', JSON.stringify(userData));
    localStorage.setItem(
      'storyseed_signup_credentials',
      JSON.stringify({ name, email, password, userId: userData.userId })
    );
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('storyseed_user');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        role: user?.role || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
