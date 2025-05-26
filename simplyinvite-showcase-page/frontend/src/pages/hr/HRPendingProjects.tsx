import React from "react";
import UserPanelLayout from "@/components/UserPanelLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Check, MessageSquare, User } from "lucide-react";
import { useState, useEffect } from "react";

// Interface for pending projects on this specific page
interface HRPendingProjectDetail {
  id: string;
  title: string;
  author: string;
  age: number;
  city: string;
  image: string;
  category: string;
  date: string;
}

const HRPendingProjects = () => {
  const [pendingProjectsList, setPendingProjectsList] = useState<HRPendingProjectDetail[]>([]);
  const [userName, setUserName] = useState("Carregando...");
  // Add state for search query and filters if implementing search/filter logic
  // const [searchQuery, setSearchQuery] = useState("");
  // const [activeFilters, setActiveFilters] = useState<string[]>([]); 

  useEffect(() => {
    // TODO: Replace with actual API calls
    const fetchUserData = async () => {
      // const userResponse = await fetch("/api/hr/user-info"); 
      // const userData = await userResponse.json();
      // setUserName(userData.name);
    };

    const fetchPendingProjects = async () => {
      // const projectsResponse = await fetch("/api/hr/pending-projects"); // Add query params for search/filter
      // const projectsData = await projectsResponse.json();
      // setPendingProjectsList(projectsData);
      setPendingProjectsList([]); // Initialize with empty or fetched data
    };

    fetchUserData();
    fetchPendingProjects();
  }, []); // Consider adding dependencies if search/filters trigger refetch

  // Mock data - REMOVED
  // const pendingProjects = [
  //   {
  //     id: "1",
  //     title: "App Educacional",
  //     author: "Ana Silva",
  //     age: 17,
  //     city: "São Paulo",
  //     image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  //     category: "Tecnologia",
  //     date: "10/05/2023"
  //   },
  // ... (rest of mock data)
  // ];

  // Handlers
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search");
  };

  const handleEvaluate = (id: string) => {
    console.log("Evaluate", id);
  };

  const handleSendFeedback = (id: string) => {
    console.log("Send feedback", id);
  };

  const handleForwardToManager = (id: string) => {
    console.log("Forward to manager", id);
  };

  return (
    <UserPanelLayout userType="rh">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Projetos para Avaliar</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtrar Projetos</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
              <Input
                placeholder="Buscar por nome, cidade, categoria..."
                className="flex-1 min-w-[200px]"
              />
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">Tecnologia</Button>
                <Button variant="outline" size="sm">Design</Button>
                <Button variant="outline" size="sm">Impacto Social</Button>
                <Button variant="outline" size="sm">São Paulo</Button>
              </div>
              <Button type="submit">
                <Search className="mr-2 h-4 w-4" />
                Buscar
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pendingProjectsList.length > 0 ? (
            pendingProjectsList.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg">{project.title}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>{project.author}, {project.age} anos</span>
                      <span className="mx-2">•</span>
                      <span>{project.city}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="outline">{project.category}</Badge>
                      <span className="text-xs text-muted-foreground">{project.date}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button onClick={() => handleEvaluate(project.id)}>
                      <Check className="mr-2 h-4 w-4" />
                      Avaliar
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" onClick={() => handleSendFeedback(project.id)}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Feedback
                      </Button>
                      <Button variant="outline" onClick={() => handleForwardToManager(project.id)}>
                        <User className="mr-2 h-4 w-4" />
                        Encaminhar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>Nenhum projeto pendente para avaliação no momento.</p>
          )}
        </div>
      </div>
    </UserPanelLayout>
  );
};

export default HRPendingProjects;
