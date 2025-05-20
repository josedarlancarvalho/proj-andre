import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import OnboardingForm from "@/components/auth/OnboardingForm";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredProfileType: "talent" | "hr" | "manager";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredProfileType,
}) => {
  const { user, profileType, loading } = useAuth();
  const location = useLocation();

  // Se estiver carregando, mostra o spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-si-accent"></div>
      </div>
    );
  }

  // Se não houver usuário, redireciona para a página de login apropriada
  if (!user) {
    const authPath = {
      talent: "/jovem-auth",
      hr: "/rh-auth",
      manager: "/gestor-auth",
    }[requiredProfileType];

    return <Navigate to={authPath} state={{ from: location }} replace />;
  }

  // Se o tipo de perfil do usuário logado não corresponder ao tipo exigido pela rota, redireciona para a página correta do usuário
  if (profileType !== requiredProfileType) {
    const redirectPath = {
      talent: "/jovem",
      hr: "/rh",
      manager: "/gestor",
    }[profileType];

    return <Navigate to={redirectPath} replace />;
  }

  // Verifica se o usuário é do tipo talent, está na rota correta para talent, e precisa completar o onboarding
  // Assume-se que o objeto 'user' do contexto de autenticação tem a propriedade 'onboardingComplete' (booleano)
  const needsOnboarding =
    profileType === "talent" &&
    requiredProfileType === "talent" &&
    user &&
    !user.onboardingComplete;

  if (needsOnboarding) {
    // Se precisar de onboarding (e for talent na rota talent), renderiza o formulário de onboarding
    // Não renderizamos o formulário se for outro tipo de perfil, mesmo que 'needsOnboarding' fosse true por engano.
    return <OnboardingForm />;
  }

  // Se tudo estiver correto, o onboarding estiver completo (ou não for talent), renderiza o conteúdo protegido
  return <>{children}</>;
};

export default ProtectedRoute;
