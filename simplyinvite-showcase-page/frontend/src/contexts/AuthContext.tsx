import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { login, registrar, getMeuPerfil, Usuario } from "@/servicos/usuario";

// Removidos imports do backend
// import { AuthUser, ProfileType } from "@/backend/types/profiles";
// import { supabase, isSupabaseConfigured } from "@/backend/database/supabase";
// import { signInWithEmail, signUpWithEmail, signOut as authSignOut, getCurrentSession, getUserProfile, createUserProfile } from "@/backend/auth/authService";
// import { simulateAuth, simulateGetProfile } from "@/backend/utils/developmentMode";

// TODO: Definir tipos locais ou importar de um arquivo local
// interface AuthUser { ... }
// type ProfileType = 'talent' | 'hr' | 'manager';

export type ProfileType = "jovem" | "rh" | "gestor";

interface AuthContextType {
  user: Usuario | null;
  loading: boolean;
  profileType: ProfileType | null;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error?: any }>;
  signUp: (
    email: string,
    password: string,
    profileType: ProfileType,
    userData: { fullName: string }
  ) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  getProfile: () => Promise<Usuario | null>;
  isDevMode: boolean;
  setUser: (user: Usuario | null) => void;
  setProfileType: (type: ProfileType | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [profileType, setProfileType] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const isDevMode = import.meta.env.DEV;

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const data = await getMeuPerfil();

          if (data && data.usuario) {
            setUser(data.usuario);
            setProfileType(data.tipoPerfil as ProfileType);
          } else {
            localStorage.removeItem("token");
            setUser(null);
            setProfileType(null);
          }
        } catch (error) {
          console.error("Erro ao validar token e buscar usuário:", error);
          localStorage.removeItem("token");
          setUser(null);
          setProfileType(null);
        }
      } else {
        setUser(null);
        setProfileType(null);
      }
      setLoading(false);
    }

    initializeAuth();
  }, []);

  const signIn = async (
    email: string,
    password: string
  ): Promise<{ error?: any }> => {
    try {
      setLoading(true);
      const data = await login(email, password);

      if (data && data.token && data.usuario) {
        localStorage.setItem("token", data.token);
        setUser(data.usuario);
        setProfileType(data.tipoPerfil as ProfileType);

        switch (data.tipoPerfil) {
          case "jovem":
            navigate("/jovem");
            break;
          case "rh":
            navigate("/rh");
            break;
          case "gestor":
            navigate("/gestor");
            break;
          default:
            navigate("/");
        }
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo(a) de volta!",
        });
        return {};
      } else {
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

  const signUp = async (
    email: string,
    password: string,
    profileType: ProfileType,
    userData: { fullName: string }
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

  const signOut = async () => {
    try {
      setLoading(true);
      localStorage.removeItem("token");
      if (isDevMode) {
        localStorage.removeItem("dev_user");
        localStorage.removeItem("dev_profile_type");
      }

      setUser(null);
      setProfileType(null);
      navigate("/");

      toast({
        title: "Logout realizado",
        description: "Você saiu da sua conta.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getProfile = async () => {
    if (!user) return null;
    return user;
  };

  const value = {
    user,
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
