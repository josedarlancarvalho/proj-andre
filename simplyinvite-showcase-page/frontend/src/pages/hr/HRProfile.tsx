import React, { useState, useEffect } from "react";
import UserPanelLayout from "@/components/UserPanelLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Save, Building, Users } from "lucide-react";

// Interfaces
interface TeamMember {
  id: string; // Or some unique identifier
  name: string;
  // role: string; // e.g., Recrutador, Gerente de RH - currently hardcoded as "Recrutador"
  avatarFallback: string; // For AvatarFallback
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
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<HRProfileData>({
    name: "Carregando...",
    email: "",
    position: "",
    company: "",
    cnpj: "",
    phone: "",
    team: [],
    avatarUrl: "" // Default or placeholder avatar URL
  });

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchHRProfileData = async () => {
      // const response = await fetch("/api/hr/profile"); 
      // const data = await response.json();
      // setProfile(data);
      // For demonstration - REMOVED
      // setTimeout(() => {
      //   setProfile({
      //     name: "Roberto Gomes",
      //     email: "roberto.gomes@techcorp.com",
      //     position: "Recrutador Sênior",
      //     company: "TechCorp",
      //     cnpj: "12.345.678/0001-90",
      //     phone: "(11) 98765-4321",
      //     team: [
      //       { id: "1", name: "Maria Oliveira", avatarFallback: "MO" }, 
      //       { id: "2", name: "João Silva", avatarFallback: "JS" }, 
      //       { id: "3", name: "Ana Souza", avatarFallback: "AS" }
      //     ],
      //     avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" 
      //   });
      // }, 1000);
    };
    fetchHRProfileData();
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
    <UserPanelLayout userType="rh">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Perfil da Empresa</h1>
          {!isEditing ? (
            <Button onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Editar Informações
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
                  />
                ) : (
                  <p>{profile.company}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">CNPJ</label>
                {isEditing ? (
                  <Input 
                    name="cnpj" 
                    value={profile.cnpj} 
                    onChange={handleChange} 
                  />
                ) : (
                  <p>{profile.cnpj}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Telefone de Contato</label>
                {isEditing ? (
                  <Input 
                    name="phone" 
                    value={profile.phone} 
                    onChange={handleChange} 
                  />
                ) : (
                  <p>{profile.phone}</p>
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
                {profile.team.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-2 border rounded-md">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{member.avatarFallback}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">Recrutador</p>
                    </div>
                    {isEditing && (
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}

                {isEditing && (
                  <Button variant="outline" className="w-full mt-2">
                    + Adicionar Membro
                  </Button>
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
                  <AvatarFallback>{profile.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
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
                    />
                  ) : (
                    <p>{profile.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Corporativo</label>
                  {isEditing ? (
                    <Input 
                      name="email" 
                      value={profile.email} 
                      onChange={handleChange} 
                    />
                  ) : (
                    <p>{profile.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Cargo</label>
                  {isEditing ? (
                    <Input 
                      name="position" 
                      value={profile.position} 
                      onChange={handleChange} 
                    />
                  ) : (
                    <p>{profile.position}</p>
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
