import React, { useState, useEffect } from "react";
import UserPanelLayout from "@/components/UserPanelLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Save, Building, Briefcase, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Interface for Company Profile
interface CompanyProfile {
  name: string;
  industry: string;
  size: string;
  website: string;
  about: string;
  address: string;
  positions: string[];
  areas: string[];
}

const ManagerCompany = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState("Carregando...");
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>({
    name: "",
    industry: "",
    size: "",
    website: "",
    about: "",
    address: "",
    positions: [],
    areas: []
  });

  useEffect(() => {
    // TODO: Replace with actual API calls
    const fetchCompanyData = async () => {
      // const userResponse = await fetch("/api/manager/user-info");
      // const userData = await userResponse.json();
      // setUserName(userData.name);
      // setUserName("Rodrigo Mendes"); // Example // REMOVED

      // const companyResponse = await fetch("/api/manager/company-profile");
      // const companyData = await companyResponse.json();
      // setCompanyProfile(companyData);
      // Example of setting profile data after fetch, if needed for dev // REMOVED BLOCK BELOW
      // setCompanyProfile({
      //   name: "Tech Solutions",
      //   industry: "Tecnologia",
      //   size: "51-200",
      //   website: "www.techsolutions.com",
      //   about: "Tech Solutions é uma empresa de tecnologia focada em desenvolvimento de software e soluções digitais inovadoras. Estamos sempre em busca de novos talentos para compor nossa equipe diversa e dinâmica.",
      //   address: "Av. Paulista, 1000 - São Paulo, SP",
      //   positions: ["Desenvolvedor Frontend", "Designer UX/UI", "Desenvolvedor Mobile", "Analista de Dados"],
      //   areas: ["Tecnologia", "Design", "Dados"]
      // });
    };
    fetchCompanyData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would save the company data
    console.log("Company saved:", companyProfile);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanyProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddPosition = () => {
    setCompanyProfile(prev => ({
      ...prev,
      positions: [...prev.positions, "Nova Posição"]
    }));
  };

  const handlePositionChange = (index: number, value: string) => {
    const newPositions = [...companyProfile.positions];
    newPositions[index] = value;
    setCompanyProfile(prev => ({
      ...prev,
      positions: newPositions
    }));
  };

  const handleRemovePosition = (index: number) => {
    const newPositions = companyProfile.positions.filter((_, i) => i !== index);
    setCompanyProfile(prev => ({
      ...prev,
      positions: newPositions
    }));
  };

  return (
    <UserPanelLayout userType="gestor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Minha Empresa</h1>
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
                    name="name" 
                    value={companyProfile.name} 
                    onChange={handleChange} 
                  />
                ) : (
                  <p>{companyProfile.name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Setor</label>
                {isEditing ? (
                  <Select 
                    value={companyProfile.industry} // Controlled component
                    onValueChange={(value) => setCompanyProfile(prev => ({ ...prev, industry: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                      <SelectItem value="Saúde">Saúde</SelectItem>
                      <SelectItem value="Educação">Educação</SelectItem>
                      <SelectItem value="Finanças">Finanças</SelectItem>
                      <SelectItem value="Varejo">Varejo</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p>{companyProfile.industry}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tamanho da Empresa</label>
                {isEditing ? (
                  <Select 
                    value={companyProfile.size} // Controlled component
                    onValueChange={(value) => setCompanyProfile(prev => ({ ...prev, size: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 funcionários</SelectItem>
                      <SelectItem value="11-50">11-50 funcionários</SelectItem>
                      <SelectItem value="51-200">51-200 funcionários</SelectItem>
                      <SelectItem value="201-500">201-500 funcionários</SelectItem>
                      <SelectItem value="501+">Mais de 500 funcionários</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p>{companyProfile.size} funcionários</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Website</label>
                {isEditing ? (
                  <Input 
                    name="website" 
                    value={companyProfile.website} 
                    onChange={handleChange} 
                  />
                ) : (
                  <p>{companyProfile.website}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Endereço</label>
                {isEditing ? (
                  <Input 
                    name="address" 
                    value={companyProfile.address} 
                    onChange={handleChange} 
                  />
                ) : (
                  <p>{companyProfile.address}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sobre a Empresa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Descrição</label>
                  {isEditing ? (
                    <Textarea 
                      name="about" 
                      value={companyProfile.about} 
                      onChange={handleChange}
                      className="min-h-[150px]"
                    />
                  ) : (
                    <p className="whitespace-pre-wrap">{companyProfile.about}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Áreas de Interesse da Empresa</label>
                  <div className="flex flex-wrap gap-2">
                    {companyProfile.areas.map((area, index) => (
                      <Badge key={index} variant="secondary">{area}</Badge>
                    ))}
                  </div>
                  {isEditing && (
                    <Button variant="outline" size="sm" className="mt-2">
                      + Adicionar Área de Interesse
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Posições Abertas/Frequentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {isEditing ? (
                <div className="space-y-2">
                  {companyProfile.positions.map((position, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input 
                        value={position} 
                        onChange={(e) => handlePositionChange(index, e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRemovePosition(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={handleAddPosition} className="mt-2">
                    + Adicionar Posição
                  </Button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {companyProfile.positions.map((position, index) => (
                    <Badge key={index} variant="outline">{position}</Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </UserPanelLayout>
  );
};

export default ManagerCompany;
