import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Páginas de autenticação
import TalentAuth from "@/pages/TalentAuth";
import HRAuth from "@/pages/HRAuth";
import ManagerAuth from "@/pages/ManagerAuth";

// Páginas principais
import TalentPanel from "@/pages/TalentPanel";
import EvaluationPanel from "@/pages/EvaluationPanel";
import ManagerPanel from "@/pages/ManagerPanel";

// Páginas de perfil
import TalentProfile from "@/pages/talent/TalentProfile";
import HRProfile from "@/pages/hr/HRProfile";

// Páginas de onboarding
import TalentOnboardingForm from "@/pages/talent/TalentOnboardingForm";
import TalentOnboardingFormHr from "@/pages/hr/TalentOnboardingFormHr";
<<<<<<< HEAD
=======
import ManagerOnboardingForm from "@/pages/manager/ManagerOnboardingForm";
>>>>>>> origin/producao1

// Páginas de submissões
import TalentSubmissions from "@/pages/talent/TalentSubmissions";
import HRPendingProjects from "@/pages/hr/HRPendingProjects";

// Páginas de feedback
import TalentFeedback from "@/pages/talent/TalentFeedback";
import HREvaluationHistory from "@/pages/hr/HREvaluationHistory";

// Páginas de mensagens
import HRMessages from "@/pages/hr/HRMessages";

// Páginas de exploração
import ManagerExplore from "@/pages/manager/ManagerExplore";
import ManagerFavorites from "@/pages/manager/ManagerFavorites";

// Páginas de relatórios
import HRReports from "@/pages/hr/HRReports";

// Páginas de entrevistas e empresa
import ManagerInterviews from "@/pages/manager/ManagerInterviews";
import ManagerCompany from "@/pages/manager/ManagerCompany";

// Página inicial
import Index from "@/pages/Index";

// Importando componentes reais para Jovem Talento
import TalentProgress from "@/pages/talent/TalentProgress"; // Componente para Minha Evolução
import TalentInvitations from "@/pages/talent/TalentInvitations"; // Componente para Convites

// Importando componentes para Notificações e Configurações
import NotificacoesPage from "@/pages/NotificacoesPage";
import ConfiguracoesPage from "@/pages/ConfiguracoesPage"; // Componente placeholder

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rota inicial */}
          <Route path="/" element={<Index />} />

          {/* Rotas de autenticação */}
          <Route path="/jovem-auth" element={<TalentAuth />} />
          <Route path="/rh-auth" element={<HRAuth />} />
          <Route path="/gestor-auth" element={<ManagerAuth />} />

          {/* Rotas do Jovem */}
          <Route
            path="/jovem"
            element={
              <ProtectedRoute requiredProfileType="jovem">
                <TalentPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jovem/onboarding"
            element={
              <ProtectedRoute requiredProfileType="jovem">
                <TalentOnboardingForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jovem/perfil"
            element={
              <ProtectedRoute requiredProfileType="jovem">
                <TalentProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jovem/submissoes"
            element={
              <ProtectedRoute requiredProfileType="jovem">
                <TalentSubmissions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jovem/feedbacks"
            element={
              <ProtectedRoute requiredProfileType="jovem">
                <TalentFeedback />
              </ProtectedRoute>
            }
          />

          {/* Rotas para Minha Evolução e Convites (usando componentes reais) */}
          <Route
            path="/jovem/evolucao"
            element={
              <ProtectedRoute requiredProfileType="jovem">
                <TalentProgress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jovem/convites"
            element={
              <ProtectedRoute requiredProfileType="jovem">
                <TalentInvitations />
              </ProtectedRoute>
            }
          />

          {/* Rotas para Notificações e Configurações (placeholder) */}
          <Route
            path="/jovem/notificacoes"
            element={
              <ProtectedRoute requiredProfileType="jovem">
                <NotificacoesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jovem/configuracoes"
            element={
              <ProtectedRoute requiredProfileType="jovem">
                <ConfiguracoesPage />
              </ProtectedRoute>
            }
          />

          {/* Rotas do RH */}
          <Route
            path="/rh"
            element={
              <ProtectedRoute requiredProfileType="rh">
                <EvaluationPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rh/onboarding"
            element={
              <ProtectedRoute requiredProfileType="rh">
                <TalentOnboardingFormHr />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rh/perfil"
            element={
              <ProtectedRoute requiredProfileType="rh">
                <HRProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rh/projetos-pendentes"
            element={
              <ProtectedRoute requiredProfileType="rh">
                <HRPendingProjects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rh/historico"
            element={
              <ProtectedRoute requiredProfileType="rh">
                <HREvaluationHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rh/mensagens"
            element={
              <ProtectedRoute requiredProfileType="rh">
                <HRMessages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rh/relatorios"
            element={
              <ProtectedRoute requiredProfileType="rh">
                <HRReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rh/notificacoes"
            element={
              <ProtectedRoute requiredProfileType="rh">
                <NotificacoesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rh/configuracoes"
            element={
              <ProtectedRoute requiredProfileType="rh">
                <ConfiguracoesPage />
              </ProtectedRoute>
            }
          />

          {/* Rotas do Gestor */}
          <Route
            path="/gestor"
            element={
              <ProtectedRoute requiredProfileType="gestor">
                <ManagerPanel />
              </ProtectedRoute>
            }
          />
          <Route
<<<<<<< HEAD
=======
            path="/gestor/onboarding"
            element={
              <ProtectedRoute requiredProfileType="gestor">
                <ManagerOnboardingForm />
              </ProtectedRoute>
            }
          />
          <Route
>>>>>>> origin/producao1
            path="/gestor/explorar"
            element={
              <ProtectedRoute requiredProfileType="gestor">
                <ManagerExplore />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gestor/favoritos"
            element={
              <ProtectedRoute requiredProfileType="gestor">
                <ManagerFavorites />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gestor/entrevistas"
            element={
              <ProtectedRoute requiredProfileType="gestor">
                <ManagerInterviews />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gestor/empresa"
            element={
              <ProtectedRoute requiredProfileType="gestor">
                <ManagerCompany />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gestor/notificacoes"
            element={
              <ProtectedRoute requiredProfileType="gestor">
                <NotificacoesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gestor/configuracoes"
            element={
              <ProtectedRoute requiredProfileType="gestor">
                <ConfiguracoesPage />
              </ProtectedRoute>
            }
          />

          {/* Rota de fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
};

export default App;
