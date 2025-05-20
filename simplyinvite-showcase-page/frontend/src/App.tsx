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
import NotificacoesPage from "@/pages/NotificacoesPage"; // Componente placeholder
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
              <ProtectedRoute requiredProfileType="talent">
                <TalentPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jovem/onboarding"
            element={
              <ProtectedRoute requiredProfileType="talent">
                <TalentOnboardingForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jovem/perfil"
            element={
              <ProtectedRoute requiredProfileType="talent">
                <TalentProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jovem/submissoes"
            element={
              <ProtectedRoute requiredProfileType="talent">
                <TalentSubmissions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jovem/feedbacks"
            element={
              <ProtectedRoute requiredProfileType="talent">
                <TalentFeedback />
              </ProtectedRoute>
            }
          />

          {/* Rotas para Minha Evolução e Convites (usando componentes reais) */}
          <Route
            path="/jovem/evolucao"
            element={
              <ProtectedRoute requiredProfileType="talent">
                <TalentProgress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jovem/convites"
            element={
              <ProtectedRoute requiredProfileType="talent">
                <TalentInvitations />
              </ProtectedRoute>
            }
          />

          {/* Rotas para Notificações e Configurações (placeholder) */}
          <Route
            path="/jovem/notificacoes"
            element={
              <ProtectedRoute requiredProfileType="talent">
                <NotificacoesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jovem/configuracoes"
            element={
              <ProtectedRoute requiredProfileType="talent">
                <ConfiguracoesPage />
              </ProtectedRoute>
            }
          />

          {/* Rotas do RH */}
          <Route
            path="/rh"
            element={
              <ProtectedRoute requiredProfileType="hr">
                <EvaluationPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rh/perfil"
            element={
              <ProtectedRoute requiredProfileType="hr">
                <HRProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rh/projetos-pendentes"
            element={
              <ProtectedRoute requiredProfileType="hr">
                <HRPendingProjects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rh/historico"
            element={
              <ProtectedRoute requiredProfileType="hr">
                <HREvaluationHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rh/mensagens"
            element={
              <ProtectedRoute requiredProfileType="hr">
                <HRMessages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rh/relatorios"
            element={
              <ProtectedRoute requiredProfileType="hr">
                <HRReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rh/notificacoes"
            element={
              <ProtectedRoute requiredProfileType="hr">
                <NotificacoesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rh/configuracoes"
            element={
              <ProtectedRoute requiredProfileType="hr">
                <ConfiguracoesPage />
              </ProtectedRoute>
            }
          />

          {/* Rotas do Gestor */}
          <Route
            path="/gestor"
            element={
              <ProtectedRoute requiredProfileType="manager">
                <ManagerPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gestor/explorar"
            element={
              <ProtectedRoute requiredProfileType="manager">
                <ManagerExplore />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gestor/favoritos"
            element={
              <ProtectedRoute requiredProfileType="manager">
                <ManagerFavorites />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gestor/entrevistas"
            element={
              <ProtectedRoute requiredProfileType="manager">
                <ManagerInterviews />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gestor/empresa"
            element={
              <ProtectedRoute requiredProfileType="manager">
                <ManagerCompany />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gestor/notificacoes"
            element={
              <ProtectedRoute requiredProfileType="manager">
                <NotificacoesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gestor/configuracoes"
            element={
              <ProtectedRoute requiredProfileType="manager">
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
