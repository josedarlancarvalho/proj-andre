import React, { useState } from "react";
import UserPanelLayout from "@/components/UserPanelLayout";
import { useAuth } from "@/contexts/AuthContext";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Shield,
  Laptop,
  User,
  Settings,
  Lock,
  Eye,
  HelpCircle,
  LogOut,
  Phone,
  Mail,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

// Componente de Seção de Configurações
const ConfigSection = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="space-y-4 mb-8">
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Separator />
      <div className="space-y-4">{children}</div>
    </div>
  );
};

// Componente de Item de Configuração
const ConfigItem = ({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 bg-muted rounded-md p-2">{icon}</div>
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-sm text-muted-foreground">{description}</div>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};

const ConfiguracoesPage = () => {
  const { profileType, user, signOut } = useAuth();

  // Estados para controlar as configurações
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState("public");
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("pt-BR");
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  // Email para notificações
  const [email, setEmail] = useState(user?.email || "");
  const [fullName, setFullName] = useState(user?.nomeCompleto || "");
  const [username, setUsername] = useState(user?.username || "");
  const [phone, setPhone] = useState("");

  // Senhas
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Função para salvar as configurações
  const saveSettings = () => {
    toast.success("Configurações salvas com sucesso!");
  };

  // Ação para excluir conta
  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita."
      )
    ) {
      toast.error(
        "Funcionalidade em desenvolvimento. Sua conta não foi excluída."
      );
    }
  };

  return (
    <UserPanelLayout userType={profileType || "jovem"}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
          <Button onClick={saveSettings}>Salvar alterações</Button>
        </div>

        <Tabs defaultValue="perfil">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="perfil">
              <User className="h-4 w-4 mr-2" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="notificacoes">
              <Bell className="h-4 w-4 mr-2" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="privacidade">
              <Shield className="h-4 w-4 mr-2" />
              Privacidade
            </TabsTrigger>
            <TabsTrigger value="preferencias">
              <Settings className="h-4 w-4 mr-2" />
              Preferências
            </TabsTrigger>
          </TabsList>

          {/* Tab de Perfil */}
          <TabsContent value="perfil">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Perfil</CardTitle>
                <CardDescription>
                  Gerencie suas informações pessoais e configurações de conta.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Seção de Informações da Conta */}
                <ConfigSection
                  title="Informações da Conta"
                  description="Atualize suas informações básicas de conta"
                >
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Nome completo</Label>
                        <Input
                          id="fullName"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Seu nome completo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Nome de usuário</Label>
                        <Input
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="seu.usuario"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seuemail@exemplo.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(11) 98765-4321"
                      />
                    </div>
                  </div>
                </ConfigSection>

                {/* Seção de Senha e Segurança */}
                <ConfigSection
                  title="Senha e Segurança"
                  description="Atualize sua senha e configure opções de segurança"
                >
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Senha atual</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="••••••••"
                        />
                      </div>
                      <div></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Nova senha</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Confirmar nova senha
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={saveSettings}>Alterar senha</Button>
                    </div>
                  </div>
                </ConfigSection>

                {/* Sessão de Conta */}
                <ConfigSection
                  title="Gerenciamento de Conta"
                  description="Opções para gerenciar sua conta"
                >
                  <div className="flex justify-between">
                    <Button variant="destructive" onClick={handleDeleteAccount}>
                      Excluir minha conta
                    </Button>
                    <Button variant="outline" onClick={() => signOut()}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair da conta
                    </Button>
                  </div>
                </ConfigSection>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Notificações */}
          <TabsContent value="notificacoes">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Notificações</CardTitle>
                <CardDescription>
                  Escolha como e quando deseja receber notificações.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ConfigSection
                  title="Canais de Notificação"
                  description="Escolha como deseja ser notificado"
                >
                  <ConfigItem
                    icon={<Bell className="h-4 w-4" />}
                    title="Notificações no aplicativo"
                    description="Receba notificações diretamente na plataforma"
                  >
                    <Switch
                      checked={appNotifications}
                      onCheckedChange={setAppNotifications}
                    />
                  </ConfigItem>

                  <ConfigItem
                    icon={<Mail className="h-4 w-4" />}
                    title="Notificações por e-mail"
                    description="Receba notificações no seu e-mail cadastrado"
                  >
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </ConfigItem>
                </ConfigSection>

                <ConfigSection
                  title="Tipos de Notificação"
                  description="Personalize quais notificações deseja receber"
                >
                  <ConfigItem
                    icon={<Eye className="h-4 w-4" />}
                    title="Visualizações do perfil"
                    description="Notificações quando seu perfil for visualizado"
                  >
                    <Switch defaultChecked />
                  </ConfigItem>

                  <ConfigItem
                    icon={<Mail className="h-4 w-4" />}
                    title="Novos convites"
                    description="Notificações de convites para entrevista"
                  >
                    <Switch defaultChecked />
                  </ConfigItem>

                  <ConfigItem
                    icon={<Eye className="h-4 w-4" />}
                    title="Feedback em projetos"
                    description="Notificações quando receber feedbacks em seus projetos"
                  >
                    <Switch defaultChecked />
                  </ConfigItem>

                  <ConfigItem
                    icon={<RefreshCw className="h-4 w-4" />}
                    title="Resumo semanal"
                    description="Receba um resumo semanal de atividades"
                  >
                    <Switch
                      checked={weeklyDigest}
                      onCheckedChange={setWeeklyDigest}
                    />
                  </ConfigItem>
                </ConfigSection>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Privacidade */}
          <TabsContent value="privacidade">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Privacidade</CardTitle>
                <CardDescription>
                  Gerencie quem pode ver seu perfil e projetos.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ConfigSection
                  title="Visibilidade do Perfil"
                  description="Controle quem pode visualizar seu perfil e portfólio"
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="profileVisibility">
                        Visibilidade do perfil
                      </Label>
                      <Select
                        value={profileVisibility}
                        onValueChange={setProfileVisibility}
                      >
                        <SelectTrigger id="profileVisibility">
                          <SelectValue placeholder="Selecione uma opção" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">
                            Público (Todos podem ver)
                          </SelectItem>
                          <SelectItem value="recruiters">
                            Apenas recrutadores
                          </SelectItem>
                          <SelectItem value="invite">
                            Apenas com convite
                          </SelectItem>
                          <SelectItem value="private">Privado</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        Defina quem pode visualizar seu perfil na plataforma.
                      </p>
                    </div>
                  </div>
                </ConfigSection>

                <ConfigSection
                  title="Segurança da Conta"
                  description="Configure opções adicionais de segurança"
                >
                  <ConfigItem
                    icon={<Lock className="h-4 w-4" />}
                    title="Autenticação de dois fatores"
                    description="Adicione uma camada extra de segurança"
                  >
                    <Switch
                      checked={twoFactorAuth}
                      onCheckedChange={setTwoFactorAuth}
                    />
                  </ConfigItem>

                  <ConfigItem
                    icon={<Shield className="h-4 w-4" />}
                    title="Histórico de login"
                    description="Veja os dispositivos que acessaram sua conta"
                  >
                    <Button variant="outline" size="sm">
                      Visualizar
                    </Button>
                  </ConfigItem>
                </ConfigSection>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Preferências */}
          <TabsContent value="preferencias">
            <Card>
              <CardHeader>
                <CardTitle>Preferências do Sistema</CardTitle>
                <CardDescription>
                  Personalize a aparência e comportamento da plataforma.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ConfigSection
                  title="Aparência"
                  description="Personalize a aparência da plataforma"
                >
                  <ConfigItem
                    icon={<Laptop className="h-4 w-4" />}
                    title="Modo escuro"
                    description="Ative o modo escuro para menos brilho"
                  >
                    <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                  </ConfigItem>
                </ConfigSection>

                <ConfigSection
                  title="Idioma e Região"
                  description="Configure suas preferências regionais"
                >
                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Selecione um idioma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">
                          Português (Brasil)
                        </SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </ConfigSection>

                <ConfigSection
                  title="Ajuda e Suporte"
                  description="Obtenha ajuda e suporte para utilizar a plataforma"
                >
                  <ConfigItem
                    icon={<HelpCircle className="h-4 w-4" />}
                    title="Centro de ajuda"
                    description="Acesse artigos e tutoriais de ajuda"
                  >
                    <Button variant="outline" size="sm">
                      Acessar
                    </Button>
                  </ConfigItem>

                  <ConfigItem
                    icon={<Mail className="h-4 w-4" />}
                    title="Contato com suporte"
                    description="Entre em contato com nossa equipe de suporte"
                  >
                    <Button variant="outline" size="sm">
                      Contatar
                    </Button>
                  </ConfigItem>
                </ConfigSection>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">
                  SimplyInvite versão 1.0.0 • {new Date().getFullYear()} © Todos
                  os direitos reservados
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </UserPanelLayout>
  );
};

export default ConfiguracoesPage;
