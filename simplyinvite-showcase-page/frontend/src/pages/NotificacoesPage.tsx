import React, { useState, useEffect } from "react";
import UserPanelLayout from "@/components/UserPanelLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  Check,
  Clock,
  FileText,
  Medal,
  MessageSquare,
  Trash2,
  User,
  Heart,
} from "lucide-react";

// Tipos de notificações
type NotificationType =
  | "projeto"
  | "feedback"
  | "convite"
  | "sistema"
  | "mensagem"
  | "boas-vindas";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  date: string;
  link?: string;
}

// Componente para exibir uma notificação individual
const NotificationItem = ({
  notification,
  onMarkAsRead,
  onDelete,
}: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case "projeto":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "feedback":
        return <Medal className="h-5 w-5 text-yellow-500" />;
      case "convite":
        return <User className="h-5 w-5 text-green-500" />;
      case "sistema":
        return <Bell className="h-5 w-5 text-gray-500" />;
      case "mensagem":
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
      case "boas-vindas":
        return <Heart className="h-5 w-5 text-pink-500" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  return (
    <Card
      className={`mb-3 ${
        !notification.isRead ? "border-l-4 border-l-primary" : ""
      }`}
    >
      <CardHeader className="py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getIcon()}
            <CardTitle className="text-base">{notification.title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {!notification.isRead && (
              <Badge variant="outline" className="bg-primary/10">
                Nova
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {notification.date}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-2">
        <CardDescription>{notification.message}</CardDescription>
      </CardContent>
      <CardFooter className="border-t pt-3 flex justify-between">
        {notification.link && (
          <Button variant="link" size="sm" className="p-0">
            Ver detalhes
          </Button>
        )}
        <div className="flex gap-2 ml-auto">
          {!notification.isRead && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMarkAsRead(notification.id)}
            >
              <Check className="h-4 w-4 mr-1" />
              Marcar como lida
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(notification.id)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Excluir
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const NotificacoesPage = () => {
  const { profileType, user } = useAuth();
  const [initialNotificationsLoaded, setInitialNotificationsLoaded] =
    useState(false);

  // Notificações de exemplo - em produção seriam buscadas de uma API
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Seu projeto foi avaliado",
      message:
        "O avaliador deixou um feedback para seu projeto 'Website Responsivo'.",
      type: "feedback",
      isRead: false,
      date: "Hoje, 14:30",
      link: "/jovem/feedbacks",
    },
    {
      id: "2",
      title: "Novo convite para entrevista",
      message:
        "Você recebeu um convite para entrevista da empresa TechSolutions.",
      type: "convite",
      isRead: false,
      date: "Hoje, 10:15",
      link: "/jovem/convites",
    },
    {
      id: "3",
      title: "Lembrete de submissão",
      message: "Você tem um projeto em rascunho que ainda não foi enviado.",
      type: "projeto",
      isRead: true,
      date: "Ontem, 16:45",
      link: "/jovem/submissoes",
    },
    {
      id: "4",
      title: "Medalha recebida",
      message:
        "Parabéns! Você recebeu uma medalha de ouro pelo seu projeto 'App Mobile'.",
      type: "feedback",
      isRead: true,
      date: "3 dias atrás",
      link: "/jovem/feedbacks",
    },
    {
      id: "5",
      title: "Atualização do sistema",
      message:
        "SimplyInvite foi atualizado com novas funcionalidades. Confira as novidades!",
      type: "sistema",
      isRead: true,
      date: "1 semana atrás",
    },
  ]);

  // Adicionar notificação de boas-vindas para novos usuários
  useEffect(() => {
    if (!initialNotificationsLoaded && user) {
      setInitialNotificationsLoaded(true);

      // Verifica se o usuário é novo (criado nos últimos 3 dias)
      const isNewUser = user.createdAt
        ? new Date().getTime() - new Date(user.createdAt).getTime() <
          3 * 24 * 60 * 60 * 1000
        : true;

      if (isNewUser) {
        const welcomeNotification: Notification = {
          id: "welcome-" + new Date().getTime(),
          title: "Bem-vindo(a) ao SimplyInvite!",
          message: `Olá ${
            user.nomeCompleto || ""
          }! Estamos felizes em tê-lo(a) em nossa plataforma. Aqui você poderá enviar seus projetos, receber feedbacks e interagir com empresas interessadas no seu perfil. Explore todas as funcionalidades disponíveis!`,
          type: "boas-vindas",
          isRead: false,
          date: "Agora",
          link: "/jovem/perfil",
        };

        // Adicionar a notificação de boas-vindas ao topo da lista
        setNotifications((prev) => [welcomeNotification, ...prev]);
      }
    }
  }, [user, initialNotificationsLoaded]);

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <UserPanelLayout userType={profileType || "jovem"}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Notificações</h1>
            {unreadCount > 0 && (
              <Badge variant="secondary">{unreadCount} não lidas</Badge>
            )}
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead}>
                <Check className="h-4 w-4 mr-1" />
                Marcar todas como lidas
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="todas">
          <TabsList>
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="nao-lidas">Não lidas</TabsTrigger>
            <TabsTrigger value="projetos">Projetos</TabsTrigger>
            <TabsTrigger value="feedbacks">Feedbacks</TabsTrigger>
            <TabsTrigger value="convites">Convites</TabsTrigger>
          </TabsList>

          <TabsContent value="todas" className="mt-4">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                />
              ))
            ) : (
              <div className="text-center py-10">
                <Bell className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  Você não tem notificações
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="nao-lidas" className="mt-4">
            {notifications.filter((n) => !n.isRead).length > 0 ? (
              notifications
                .filter((n) => !n.isRead)
                .map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                  />
                ))
            ) : (
              <div className="text-center py-10">
                <Check className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  Não há notificações não lidas
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="projetos" className="mt-4">
            {notifications.filter((n) => n.type === "projeto").length > 0 ? (
              notifications
                .filter((n) => n.type === "projeto")
                .map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                  />
                ))
            ) : (
              <div className="text-center py-10">
                <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  Não há notificações de projetos
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="feedbacks" className="mt-4">
            {notifications.filter((n) => n.type === "feedback").length > 0 ? (
              notifications
                .filter((n) => n.type === "feedback")
                .map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                  />
                ))
            ) : (
              <div className="text-center py-10">
                <Medal className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  Não há notificações de feedbacks
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="convites" className="mt-4">
            {notifications.filter((n) => n.type === "convite").length > 0 ? (
              notifications
                .filter((n) => n.type === "convite")
                .map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                  />
                ))
            ) : (
              <div className="text-center py-10">
                <User className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  Não há notificações de convites
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </UserPanelLayout>
  );
};

export default NotificacoesPage;
