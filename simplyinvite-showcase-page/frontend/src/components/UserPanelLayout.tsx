import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarGroup,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  Home,
  Settings,
  User,
  LogOut,
  FileText,
  Medal,
  Clock,
  Inbox,
  Search,
  Star,
  Calendar,
  Building,
  MessageSquare,
  Heart,
  Building2,
  CalendarClock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import type { ProfileType } from "@/types/profiles";
import { Badge } from "@/components/ui/badge";

interface UserPanelLayoutProps {
  children: React.ReactNode;
  userType: ProfileType;
}

// Simulação de API para buscar o número de notificações não lidas
const fetchUnreadNotificationsCount = async (
  userId: string,
  isNewUser: boolean
): Promise<number> => {
  // Em produção, isso seria uma chamada real à API
  // Por enquanto, vamos retornar um valor simulado para demonstração
  return new Promise((resolve) => {
    setTimeout(() => {
      // Se for um novo usuário (baseado em alguma lógica, por exemplo data de criação recente)
      // Garantimos que tenha pelo menos uma notificação (de boas-vindas)
      if (isNewUser) {
        resolve(1);
      } else {
        // Número aleatório entre 0 e 2 para simular notificações
        const count = Math.floor(Math.random() * 3);
        resolve(count);
      }
    }, 500);
  });
};

const UserPanelLayout = ({ children, userType }: UserPanelLayoutProps) => {
  const location = useLocation();
  const { user, profileType, signOut, loading: authLoading } = useAuth();
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const currentUserName = user?.nomeCompleto || "Usuário";
  const currentUserImage = user?.avatarUrl;

  // Buscar contagem de notificações não lidas quando o usuário mudar
  useEffect(() => {
    if (user?.id) {
      // Verifica se o usuário é novo (criado nos últimos 3 dias)
      const isNewUser = user.createdAt
        ? new Date().getTime() - new Date(user.createdAt).getTime() <
          3 * 24 * 60 * 60 * 1000
        : true;

      fetchUnreadNotificationsCount(user.id, isNewUser)
        .then((count) => setUnreadNotifications(count))
        .catch((error) => console.error("Erro ao buscar notificações:", error));
    }
  }, [user?.id]);

  const getUserInitials = () => {
    return currentUserName
      ? currentUserName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "U";
  };

  const userTypeLabel = {
    jovem: "Jovem Talento",
    rh: "Profissional RH",
    gestor: "Gestor",
  };

  const getBasePath = () => {
    switch (profileType) {
      case "jovem":
        return "/jovem";
      case "rh":
        return "/rh";
      case "gestor":
        return "/gestor";
      default:
        return "/";
    }
  };

  const basePath = getBasePath();

  const getMenuItems = () => {
    switch (profileType) {
      case "jovem":
        return [
          {
            path: "/jovem",
            label: "Painel Principal",
            icon: <Home className="h-4 w-4" />,
          },
          {
            path: "/jovem/perfil",
            label: "Meu Perfil",
            icon: <User className="h-4 w-4" />,
          },
          {
            path: "/jovem/submissoes",
            label: "Meus Envios",
            icon: <FileText className="h-4 w-4" />,
          },
          {
            path: "/jovem/convites",
            label: "Convites",
            icon: <Inbox className="h-4 w-4" />,
          },
        ];
      case "rh":
        return [
          {
            path: "/rh",
            label: "Painel Principal",
            icon: <Home className="h-4 w-4" />,
          },
          {
            path: "/rh/projetos-pendentes",
            label: "Projetos para Avaliar",
            icon: <FileText className="h-4 w-4" />,
          },
          {
            path: "/rh/historico",
            label: "Histórico de Avaliações",
            icon: <Clock className="h-4 w-4" />,
          },
          {
            path: "/rh/mensagens",
            label: "Mensagens",
            icon: <MessageSquare className="h-4 w-4" />,
          },
          {
            path: "/rh/perfil",
            label: "Perfil da Empresa",
            icon: <Building className="h-4 w-4" />,
          },
          {
            path: "/rh/relatorios",
            label: "Relatórios",
            icon: <FileText className="h-4 w-4" />,
          },
        ];
      case "gestor":
        return [
          {
            path: "/gestor",
            label: "Painel Principal",
            icon: <Home className="h-4 w-4" />,
          },
          {
            path: "/gestor/explorar",
            label: "Explorar Talentos",
            icon: <Search className="h-4 w-4" />,
          },
          {
            path: "/gestor/projetos",
            label: "Projetos Avaliados",
            icon: <FileText className="h-4 w-4" />,
          },
          {
            path: "/gestor/favoritos",
            label: "Favoritos",
            icon: <Star className="h-4 w-4" />,
          },
          {
            path: "/gestor/entrevistas",
            label: "Entrevistas",
            icon: <Calendar className="h-4 w-4" />,
          },
          {
            path: "/gestor/empresa",
            label: "Empresa",
            icon: <Building className="h-4 w-4" />,
          },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const content = (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="py-4">
            <div className="flex flex-col items-center justify-center gap-2 px-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={currentUserImage} alt={currentUserName} />
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="text-sm font-medium">
                  {authLoading ? "Carregando..." : currentUserName}
                </p>
                {profileType && (
                  <p className="text-xs text-muted-foreground">
                    {userTypeLabel[profileType]}
                  </p>
                )}
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.label}
                      isActive={isActive(item.path)}
                    >
                      <Link to={item.path}>
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Notificações">
                    <Link to={`/${profileType}/notificacoes`}>
                      <Bell className="h-4 w-4" />
                      <span>Notificações</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Configurações">
                    <Link to={`/${profileType}/configuracoes`}>
                      <Settings className="h-4 w-4" />
                      <span>Configurações</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarSeparator />
            <div className="p-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={signOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 overflow-auto">
          <div className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-xl font-semibold">SimplyInvite</h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                // Redirecionar para a página de notificações
                window.location.href = `/${profileType}/notificacoes`;
              }}
              className="relative"
            >
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] font-bold"
                >
                  {unreadNotifications}
                </Badge>
              )}
            </Button>
          </div>
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {authLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-si-accent"></div>
              </div>
            ) : (
              children
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );

  return (
    <ProtectedRoute requiredProfileType={userType}>{content}</ProtectedRoute>
  );
};

export default UserPanelLayout;
