import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginDto, RegisterDto } from '@/types/api';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  login: (data: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.getProfile()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (data: LoginDto) => {
    try {
      console.log('Login request data:', data);
      const response = await api.login(data);
      console.log('Login response:', response);
      
      if (!response.access_token) {
        throw new Error('Token não recebido da API');
      }
      
      localStorage.setItem('token', response.access_token);
      
      // Buscar perfil do usuário
      const userProfile = await api.getProfile();
      console.log('User profile:', userProfile);
      setUser(userProfile);
      
      toast({
        title: 'Login realizado',
        description: 'Bem-vindo de volta!',
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Erro ao fazer login',
        description: error instanceof Error ? error.message : 'Credenciais inválidas',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const register = async (data: RegisterDto) => {
    try {
      console.log('Register request data:', data);
      const response = await api.register(data);
      console.log('Register response:', response);
      
      if (!response.access_token) {
        throw new Error('Token não recebido da API');
      }
      
      localStorage.setItem('token', response.access_token);
      
      // Buscar perfil do usuário
      const userProfile = await api.getProfile();
      console.log('User profile:', userProfile);
      setUser(userProfile);
      
      toast({
        title: 'Cadastro realizado',
        description: 'Sua conta foi criada com sucesso!',
      });
    } catch (error) {
      console.error('Register error:', error);
      toast({
        title: 'Erro ao cadastrar',
        description: error instanceof Error ? error.message : 'Verifique os dados informados',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast({
      title: 'Logout realizado',
      description: 'Até logo!',
    });
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
