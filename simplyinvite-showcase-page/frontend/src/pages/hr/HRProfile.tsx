import React, { useState, useEffect } from "react";
import UserPanelLayout from "@/components/UserPanelLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Save, Building, Users, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// Interfaces
interface TeamMember {
  id: string;
  name: string;
  email?: string;
  role?: string;
  avatarFallback: string;
}

interface HRProfileData {
  name: string;
  email: string;
  position: string;
  company: string;
  cnpj: string;
  phone: string;
  team: TeamMember[];
  avatarUrl: string;
}

const HRProfile = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<HRProfileData>({
    name: user?.nomeCompleto || "Carregando...",
    email: user?.email || "",
    position: "",
    company: "",
    cnpj: "",
    phone: "",
    team: [],
    avatarUrl: user?.avatarUrl || "",
  });

  const [newTeamMember, setNewTeamMember] = useState({
    name: "",
    email: "",
    role: "Recrutador",
  });

  useEffect(() => {
    // Carregar dados do localStorage se existirem
    const savedProfile = localStorage.getItem("hrProfileData");
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile((prev) => ({
          ...prev,
          ...parsedProfile,
          // Manter dados do usuário atual
          name: user?.nomeCompleto || parsedProfile.name,
          email: user?.email || parsedProfile.email,
          avatarUrl: user?.avatarUrl || parsedProfile.avatarUrl,
        }));
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      }
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsSaving(true);

    // Simular um delay para dar feedback visual
    setTimeout(() => {
      // Salvar no localStorage
      localStorage.setItem("hrProfileData", JSON.stringify(profile));

      setIsEditing(false);
      setIsSaving(false);

      toast({
        title: "Perfil salvo com sucesso!",
        description: "As informações foram atualizadas.",
      });
    }, 800);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewMemberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTeamMember((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addTeamMember = () => {
    if (!newTeamMember.name.trim()) {
      toast({
        variant: "destructive",
        title: "Nome obrigatório",
        description: "Por favor, informe o nome do membro da equipe.",
      });
      return;
    }

    const avatarFallback = newTeamMember.name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: newTeamMember.name,
      email: newTeamMember.email,
      role: newTeamMember.role,
      avatarFallback,
    };

    setProfile((prev) => ({
      ...prev,
      team: [...prev.team, newMember],
    }));

    // Limpar o formulário
    setNewTeamMember({
      name: "",
      email: "",
      role: "Recrutador",
    });
  };

  const removeTeamMember = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      team: prev.team.filter((member) => member.id !== id),
    }));
  };

  return (
    <UserPanelLayout userType="rh">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            Perfil da Empresa
          </h1>
          {!isEditing ? (
            <Button onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Editar Informações
            </Button>
          ) : (
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Informações da Empresa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome da Empresa</label>
                {isEditing ? (
                  <Input
                    name="company"
                    value={profile.company}
                    onChange={handleChange}
                    placeholder="Nome da empresa"
                  />
                ) : (
                  <p className="p-2 border rounded-md bg-gray-50">
                    {profile.company || "Não informado"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">CNPJ</label>
                {isEditing ? (
                  <Input
                    name="cnpj"
                    value={profile.cnpj}
                    onChange={handleChange}
                    placeholder="00.000.000/0000-00"
                  />
                ) : (
                  <p className="p-2 border rounded-md bg-gray-50">
                    {profile.cnpj || "Não informado"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Telefone de Contato
                </label>
                {isEditing ? (
                  <Input
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                  />
                ) : (
                  <p className="p-2 border rounded-md bg-gray-50">
                    {profile.phone || "Não informado"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Equipe de RH
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.team.length > 0 ? (
                  profile.team.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-2 border rounded-md"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{member.avatarFallback}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {member.role || "Recrutador"}
                        </p>
                        {member.email && (
                          <p className="text-xs text-gray-500">
                            {member.email}
                          </p>
                        )}
                      </div>
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700"
                          onClick={() => removeTeamMember(member.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Nenhum membro na equipe
                  </div>
                )}

                {isEditing && (
                  <div className="mt-4 p-3 border rounded-md bg-gray-50">
                    <h4 className="font-medium mb-2">Adicionar novo membro</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium">Nome</label>
                        <Input
                          name="name"
                          value={newTeamMember.name}
                          onChange={handleNewMemberChange}
                          placeholder="Nome completo"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium">Email</label>
                        <Input
                          name="email"
                          value={newTeamMember.email}
                          onChange={handleNewMemberChange}
                          placeholder="email@exemplo.com"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium">Cargo</label>
                        <Input
                          name="role"
                          value={newTeamMember.role}
                          onChange={handleNewMemberChange}
                          placeholder="Cargo"
                          className="mt-1"
                        />
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={addTeamMember}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Membro
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Suas Informações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center space-y-3">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                  <AvatarFallback>
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    Alterar Foto
                  </Button>
                )}
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome Completo</label>
                  {isEditing ? (
                    <Input
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      placeholder="Seu nome completo"
                    />
                  ) : (
                    <p className="p-2 border rounded-md bg-gray-50">
                      {profile.name || "Não informado"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Email Corporativo
                  </label>
                  {isEditing ? (
                    <Input
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      placeholder="seu.email@empresa.com"
                    />
                  ) : (
                    <p className="p-2 border rounded-md bg-gray-50">
                      {profile.email || "Não informado"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Cargo</label>
                  {isEditing ? (
                    <Input
                      name="position"
                      value={profile.position}
                      onChange={handleChange}
                      placeholder="Seu cargo"
                    />
                  ) : (
                    <p className="p-2 border rounded-md bg-gray-50">
                      {profile.position || "Não informado"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </UserPanelLayout>
  );
};

export default HRProfile;
