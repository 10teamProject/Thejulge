import Cookies from 'js-cookie';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

interface User {
  id: string;
  email: string;
  type: 'employee' | 'employer';
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('user');
      const storedToken = Cookies.get('token');

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      if (storedToken) {
        setToken(storedToken);
      }

      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      if (user) {
        sessionStorage.setItem('user', JSON.stringify(user));
      } else {
        sessionStorage.removeItem('user');
      }
    }
  }, [user, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      if (token) {
        Cookies.set('token', token, {
          expires: 7,
          secure: true,
          sameSite: 'strict',
        });
      } else {
        Cookies.remove('token');
      }
    }
  }, [token, isLoaded]);

  const logout = () => {
    if (typeof window !== 'undefined') {
      Cookies.remove('token');
      sessionStorage.removeItem('user');
    }
    setUser(null);
    setToken(null);
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('AuthProvider 내에서 useAuth를 사용해주세요!');
  }
  return context;
};
