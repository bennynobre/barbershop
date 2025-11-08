'use client'; 
import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode'; 

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;       
  token: string | null;     
  isLoading: boolean;    
  login: (token: string) => void; 
  logout: () => void;            
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); 
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    if (storedToken) {
      try {
        const decodedUser = jwtDecode<User>(storedToken);
        setUser(decodedUser);
        setToken(storedToken);
      } catch (error) {
        localStorage.removeItem('access_token');
      }
    }
    setIsLoading(false); 
  }, []);

  const login = (newToken: string) => {
    try {
      const decodedUser = jwtDecode<User>(newToken);
      localStorage.setItem('access_token', newToken);
      setUser(decodedUser); 
      setToken(newToken); 
      router.push('/'); 
    } catch (error) {
      console.error("Erro ao decodificar token no login:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null); 
    setToken(null);
    router.push('/login'); 
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    logout,
  };

  if (isLoading) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}