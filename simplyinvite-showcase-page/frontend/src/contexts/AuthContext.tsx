import React, { createContext, useState, useEffect, useContext } from "react";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { login, registrar, getMeuPerfil } from "@/servicos/usuario";

// Removidos imports do backend
// import { AuthUser, ProfileType } from "@/backend/types/profiles";
// import { supabase, isSupabaseConfigured } from "@/backend/database/supabase";
// import { signInWithEmail, signUpWithEmail, signOut as authSignOut, getCurrentSession, getUserProfile, createUserProfile } from "@/backend/auth/authService";
// import { simulateAuth, simulateGetProfile } from "@/backend/utils/developmentMode";

// TODO: Definir tipos locais ou importar de um arquivo local
// interface AuthUser { ... }
// type ProfileType = 'talent' | 'hr' | 'manager';

interface AuthContextType {
  user: any; // Ajustar tipo
  session: Session | null;
  loading: boolean;
  profileType: any; // Ajustar tipo
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error?: any }>;
  signUp: (
    email: string,
    password: string,
    profileType: any,
    userData: any
  ) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  getProfile: () => Promise<any>;
  isDevMode: boolean;
  setUser: (user: any) => void;
  setProfileType: (type: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null);
  const [profileType, setProfileType] = useState<any>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const isDevMode = import.meta.env.DEV;

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true); // Inicia o carregamento
      const token = localStorage.getItem("token");

      if (token) {
        try {
          // Não precisamos mais remover 'dev_user' ou 'dev_profile_type' aqui,
          // pois a lógica de dev foi removida ou integrada com a real.
          
          // Tenta buscar os dados do usuário com o token armazenado
          const data = await getMeuPerfil(); 

          if (data && data.usuario) {
            setUser(data.usuario);
            setProfileType(data.tipoPerfil);
            // setSession(null); // Manter session como null ou reavaliar seu uso
          } else {
            // Se não houver dados do usuário, o token pode ser inválido ou expirado
            localStorage.removeItem("token");
            setUser(null);
            setProfileType(null);
            // setSession(null);
          }
        } catch (error) {
          console.error("Erro ao validar token e buscar usuário:", error);
          localStorage.removeItem("token"); // Limpa token em caso de erro na validação/busca
          setUser(null);
          setProfileType(null);
          // setSession(null);
        }
      } else {
        // Se não houver token, garante que o usuário está deslogado
        setUser(null);
        setProfileType(null);
        // setSession(null);
      }
      setLoading(false); // Finaliza o carregamento
    };

    initializeAuth();
  }, []); // Executar apenas uma vez na montagem do componente

  // Função de login
  const signIn = async (
    email: string,
    password: string
  ): Promise<{ error?: any }> => {
    try {
      setLoading(true);

      // --- Lógica real conectada ao backend ---
      const data = await login(email, password); // Chamada ao serviço de login

      if (data && data.token && data.usuario) {
        localStorage.setItem("token", data.token);
        setUser(data.usuario);
        setProfileType(data.tipoPerfil);
        // O objeto session do Supabase não é mais preenchido diretamente aqui.
        // Se precisarmos de algo similar, teria que ser com base no token/usuário.
        setSession(null); // Ou reavaliar o que 'session' significa neste contexto

        switch (data.tipoPerfil) {
          case "talent":
            navigate("/jovem");
            break;
          case "hr":
            navigate("/rh");
            break;
          case "manager":
            navigate("/gestor");
            break;
          default:
            navigate("/"); // Rota padrão ou de erro
        }
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo(a) de volta!",
        });
        return {};
      } else {
        // Se data não contiver token/usuário, mesmo que a chamada API não dê erro http
        throw new Error(data?.message || "Resposta inválida do servidor ao tentar fazer login.");
      }
    } catch (error: any) {
      console.error("Erro no login:", error);
      let errorMessage = "Ocorreu um erro ao tentar fazer login.";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        variant: "destructive",
        title: "Erro no Login",
        description: errorMessage,
      });
      return { error: { message: errorMessage } };
    } finally {
      setLoading(false);
    }
  };

  // Função de cadastro
  const signUp = async (
    email: string,
    password: string,
    profileType: any,
    userData: any
  ) => {
    try {
      setLoading(true);
      await registrar({
        email,
        senha: password,
        tipoPerfil: profileType,
        nomeCompleto: userData.fullName,
      });
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Você já pode fazer login!",
      });
      return { error: null };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro no Cadastro",
        description: error.message,
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const signOut = async () => {
    try {
      setLoading(true);
      localStorage.removeItem("token"); // Remove o token JWT
      // Limpa o localStorage em modo de desenvolvimento se ainda estiver usando
      if (isDevMode) {
        localStorage.removeItem("dev_user");
        localStorage.removeItem("dev_profile_type");
      }

      setUser(null);
      setProfileType(null);
      setSession(null); // Limpa a sessão
      navigate("/");

      toast({
        title: "Logout realizado",
        description: "Você saiu da sua conta.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para obter perfil do usuário
  const getProfile = async () => {
    // Esta função precisará ser implementada para buscar o perfil do usuário
    // autenticado usando o token JWT armazenado, se necessário.
    // Por enquanto, o 'user' no estado já contém os dados retornados pelo login.
    if (!user) return null; // Ou { data: null } como antes
    
    // Se precisar buscar dados mais detalhados do perfil:
    // try {
    //   const token = localStorage.getItem("token");
    //   if (!token) throw new Error("Não autenticado");
    //   // const profileData = await fetchProfileFromServer(token); // Função hipotética
    //   // return profileData; 
    // } catch (error) {
    //   console.error("Erro ao buscar perfil:", error);
    //   return null;
    // }

    // Retornando o usuário já em estado, que veio do login
    return user;
  };

  const value = {
    user,
    session,
    loading,
    profileType,
    signIn,
    signUp,
    signOut,
    getProfile,
    isDevMode,
    setUser,
    setProfileType,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
