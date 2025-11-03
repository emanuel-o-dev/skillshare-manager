import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, LoginDto, RegisterDto } from "@/types/api";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  login: (data: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAdmin: boolean;
  isInstructor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Normalize different shapes returned by the API into the app's `User` type
  const normalizeUser = (p: any): User | null => {
    if (!p) return null;
    const raw = p && (p as any).user ? (p as any).user : p;
    const id = raw.userId ?? raw.id;
    if (typeof id === "undefined" || id === null) return null;
    return {
      id: Number(id),
      name: raw.name ?? raw.fullName ?? raw.username ?? raw.email ?? "",
      email: raw.email ?? "",
      role: raw.role ?? "USER",
    };
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .getProfile()
        .then((profile) => {
          // profile can be { message, user } or the user object directly
          const rawUser =
            profile && (profile as any).user ? (profile as any).user : profile;
          const normalized = normalizeUser(rawUser);
          setUser(normalized);
        })
        .catch(() => {
          localStorage.removeItem("token");
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (data: LoginDto) => {
    try {
      const response = await api.login(data);

      if (!response.access_token) {
        throw new Error("Token não recebido da API");
      }

      localStorage.setItem("token", response.access_token);

      // Buscar perfil do usuário
      const userProfile = await api.getProfile();
      const rawUser =
        userProfile && (userProfile as any).user
          ? (userProfile as any).user
          : userProfile;
      setUser(normalizeUser(rawUser));

      toast({
        title: "Login realizado",
        description: "Bem-vindo de volta!",
      });
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Erro ao fazer login",
        description:
          error instanceof Error ? error.message : "Credenciais inválidas",
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (data: RegisterDto) => {
    try {
      const response = await api.register(data);

      if (!response.access_token) {
        throw new Error("Token não recebido da API");
      }

      localStorage.setItem("token", response.access_token);

      // Buscar perfil do usuário
      const userProfile = await api.getProfile();
      const rawUser =
        userProfile && (userProfile as any).user
          ? (userProfile as any).user
          : userProfile;
      setUser(normalizeUser(rawUser));

      toast({
        title: "Cadastro realizado",
        description: "Sua conta foi criada com sucesso!",
      });
    } catch (error) {
      console.error("Register error:", error);
      toast({
        title: "Erro ao cadastrar",
        description:
          error instanceof Error
            ? error.message
            : "Verifique os dados informados",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
  };

  const isAdmin = user?.role === "ADMIN";
  const isInstructor = user?.role === "INSTRUCTOR";

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isLoading,
        isAdmin,
        isInstructor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
