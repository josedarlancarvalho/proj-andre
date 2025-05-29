import React, { useState, useEffect } from "react";
import UserPanelLayout from "@/components/UserPanelLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Save, Building, Users } from "lucide-react";

interface ManagerProfileData {
  name: string;
  email: string;
  position: string;
  company: string;
  phone: string;
  avatarUrl: string;
}

const ManagerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ManagerProfileData>({
    name: "",
    email: "",
    position: "",
    company: "",
    phone: "",
    avatarUrl: "",
  });

  useEffect(() => {
    // Simulated profile data fetch
    setProfile({
      name: "João Silva",
      email: "joao.silva@empresa.com",
      position: "Gerente de Projetos",
      company: "Tech Solutions",
      phone: "(11) 98765-4321",
      avatarUrl: "",
    });
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would save the profile data
    console.log("Profile saved:", profile);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <UserPanelLayout userType="gestor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Meu Perfil</h1>
          {!isEditing ? (
            <Button onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Editar Perfil
            </Button>
          ) : (
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Salvar Alterações
            </Button>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                  <AvatarFallback>
                    {profile.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nome Completo</label>
                  <Input
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Telefone</label>
                  <Input
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Informações Profissionais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Empresa</label>
                <Input
                  name="company"
                  value={profile.company}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Cargo</label>
                <Input
                  name="position"
                  value={profile.position}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </UserPanelLayout>
  );
};

export default ManagerProfile; 