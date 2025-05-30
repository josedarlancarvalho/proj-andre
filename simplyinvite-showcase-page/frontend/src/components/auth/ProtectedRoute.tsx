import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import OnboardingForm from "@/components/auth/OnboardingForm";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredProfileType: "jovem" | "rh" | "gestor";
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
      jovem: "/jovem-auth",
      rh: "/rh-auth",
      gestor: "/gestor-auth",
    }[requiredProfileType];

    return <Navigate to={authPath} state={{ from: location }} replace />;
  }

  // Se o tipo de perfil do usuário logado não corresponder ao tipo exigido pela rota, redireciona para a página correta do usuário
  if (profileType !== requiredProfileType) {
    const redirectPath = {
      jovem: "/jovem",
      rh: "/rh",
      gestor: "/gestor",
    }[profileType];

    return <Navigate to={redirectPath} replace />;
  }

  // Verifica se o usuário precisa completar o onboarding (jovem ou rh)
  const needsOnboardingJovem =
    profileType === "jovem" &&
    requiredProfileType === "jovem" &&
    user &&
    !user.onboardingCompleto;

  // Verifica se o usuário do tipo RH precisa completar o onboarding
  const needsOnboardingRh =
    profileType === "rh" &&
    requiredProfileType === "rh" &&
    user &&
    !user.onboardingCompleto;

<<<<<<< HEAD
=======
  // Verifica se o usuário do tipo Gestor precisa completar o onboarding
  const needsOnboardingGestor =
    profileType === "gestor" &&
    requiredProfileType === "gestor" &&
    user &&
    !user.onboardingCompleto;

>>>>>>> origin/producao1
  // Se o usuário jovem precisa de onboarding e não está na rota de onboarding, redireciona para lá
  if (needsOnboardingJovem && location.pathname !== "/jovem/onboarding") {
    console.log(
      "Usuário jovem precisa completar onboarding, redirecionando..."
    );
    return <OnboardingForm />;
  }

  // Se o usuário RH precisa de onboarding e não está na rota de onboarding, redireciona para lá
  if (needsOnboardingRh && location.pathname !== "/rh/onboarding") {
    console.log("Usuário RH precisa completar onboarding, redirecionando...");
    return <Navigate to="/rh/onboarding" replace />;
  }

<<<<<<< HEAD
=======
  // Se o usuário Gestor precisa de onboarding e não está na rota de onboarding, redireciona para lá
  if (needsOnboardingGestor && location.pathname !== "/gestor/onboarding") {
    console.log(
      "Usuário Gestor precisa completar onboarding, redirecionando..."
    );
    return <Navigate to="/gestor/onboarding" replace />;
  }

>>>>>>> origin/producao1
  return <>{children}</>;
};

export default ProtectedRoute;
