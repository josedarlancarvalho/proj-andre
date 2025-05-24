import React, { useState, useEffect } from "react";
import UserPanelLayout from "@/components/UserPanelLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Save, Image } from "lucide-react";

// Define interface for profile data
interface TalentProfileData {
  name: string;
  age: string;
  city: string;
  interests: string[];
  bio: string;
  avatarUrl: string; 
}

const TalentProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  // Initialize with default/empty values
  const [profile, setProfile] = useState<TalentProfileData>({
    name: "Carregando...",
    age: "",
    city: "",
    interests: [],
    bio: "",
    avatarUrl: "" // Default or placeholder avatar URL
  });

  // useEffect to fetch profile data
  useEffect(() => {
    const fetchTalentProfile = async () => {
      // const response = await fetch("/api/talent/profile");
      // const data = await response.json();
      // setProfile(data);
      // setUserName(data.name); // Assuming name is part of profile data
      // For demonstration - REMOVED
      // setTimeout(() => {
      //   setProfile({
      //     name: "Ana Silva", // Example data after fetch
      //     age: 17,
      //     city: "São Paulo",
      //     category: "Design Gráfico",
      //     bio: "Sou uma jovem apaixonada por design e tecnologia, sempre buscando aprender e criar soluções inovadoras. Adoro desafios e projetos que me permitam expandir minha criatividade.",
      //     skills: ["UI Design", "UX Research", "Prototipagem", "Figma", "Adobe XD"],
      //     interests: ["Arte Digital", "Fotografia", "Games", "Música"],
      //     linkedin: "https://linkedin.com/in/anasilva",
      //     github: "https://github.com/anasilva",
      //     portfolio: "https://anasilva.design",
      //     avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
      //   });
      //   setUserName("Ana Silva"); // Update userName from fetched profile
      // }, 1000);
    };
    fetchTalentProfile();
  }, []); // Empty dependency array means this runs once on mount

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would save the profile data
    console.log("Profile saved:", profile);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = () => {
    console.log("File upload triggered");
    // Implement file upload functionality here
  };

  return (
    <UserPanelLayout userType="jovem">
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

        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center space-y-3">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                  <AvatarFallback>{profile.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" onClick={handleFileUpload}>
                  <Image className="mr-2 h-4 w-4" />
                  Alterar Foto
                </Button>
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <label className="text-sm font-medium">Idade</label>
                    {isEditing ? (
                      <Input 
                        name="age" 
                        value={profile.age} 
                        onChange={handleChange} 
                      />
                    ) : (
                      <p>{profile.age} anos</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cidade</label>
                    {isEditing ? (
                      <Input 
                        name="city" 
                        value={profile.city} 
                        onChange={handleChange} 
                      />
                    ) : (
                      <p>{profile.city}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Áreas de Interesse</label>
                    {isEditing ? (
                      <Input 
                        name="interests" 
                        value={profile.interests.join(", ")} 
                        onChange={(e) => setProfile(prev => ({
                          ...prev, 
                          interests: e.target.value.split(",").map(item => item.trim())
                        }))} 
                      />
                    ) : (
                      <p>{profile.interests.join(", ")}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Biografia</label>
                  {isEditing ? (
                    <Textarea 
                      name="bio" 
                      value={profile.bio} 
                      onChange={handleChange} 
                      className="h-32"
                    />
                  ) : (
                    <p className="text-sm">{profile.bio}</p>
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

export default TalentProfile;
