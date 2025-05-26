import React from "react";
import UserPanelLayout from "@/components/UserPanelLayout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import StatCard from "@/components/panels/StatCard";
import ProjectCard from "@/components/panels/ProjectCard";
import { Clock, Medal, User, Search } from "lucide-react";
import { useState, useEffect } from "react";

// Interfaces
interface PendingProject {
  id: string;
  title: string;
  author: string; // Potentially combine with a User object if more details needed
  // age: number; // Consider if these details are needed directly in the project list
  // city: string;
  image: string;
  // category: string;
  // For ProjectCard compatibility, assuming these might come from API or be set to default
  medalType: "ouro" | "prata" | "bronze" | null;
  hasFeedback: boolean; 
}

interface EvaluationHistoryItem {
  id: string;
  projectTitle: string;
  author: string;
  date: string;
  medal: "ouro" | "prata" | "bronze" | "-"; // Added '-' for no medal
  forwardedToManager: boolean;
}

interface HRStats {
  evaluatedProjects: number;
  goldMedals: number;
  silverMedals: number;
  bronzeMedals: number;
}

const EvaluationPanel = () => {
  const [userName, setUserName] = useState("Carregando...");
  const [pendingProjects, setPendingProjects] = useState<PendingProject[]>([]);
  const [evaluationHistory, setEvaluationHistory] = useState<EvaluationHistoryItem[]>([]);
  const [stats, setStats] = useState<HRStats>({
    evaluatedProjects: 0,
    goldMedals: 0,
    silverMedals: 0,
    bronzeMedals: 0,
  });

  useEffect(() => {
    // TODO: Replace with actual API calls
    const fetchHrData = async () => {
      // const userResponse = await fetch("/api/hr/user-info");
      // const userData = await userResponse.json();
      // setUserName(userData.name);
      setPendingProjects([]);
      setEvaluationHistory([]);
      setStats({ evaluatedProjects: 0, goldMedals: 0, silverMedals: 0, bronzeMedals: 0 });
    };
    fetchHrData();
  }, []);

  // Mock data - REMOVED
  // const pendingProjects = [
  //   {
  //     id: "1",
  //     title: "App Educacional",
  //     author: "Ana Silva",
  //     age: 17,
  //     city: "São Paulo",
  //     image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  //     category: "Tecnologia"
  //   },
  // ... (rest of mock pendingProjects)
  // ];

  // const evaluationHistory = [
  //   {
  //     id: "1",
  //     projectTitle: "App de Reciclagem",
  //     author: "Pedro Almeida",
  //     date: "12/05/2023",
  //     medal: "ouro",
  //     forwardedToManager: true
  //   },
  // ... (rest of mock evaluationHistory)
  // ];

  // Handlers
  const handleEvaluate = (id: string) => {
    console.log("Evaluate", id);
  };

  const getMedalBadge = (medal: string) => {
    switch (medal) {
      case "ouro":
        return <Badge className="bg-yellow-400 text-black">Ouro</Badge>;
      case "prata":
        return <Badge className="bg-gray-300 text-black">Prata</Badge>;
      case "bronze":
        return <Badge className="bg-amber-700 text-white">Bronze</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  return (
    <UserPanelLayout userType="rh">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Olá, {userName}!</h1>
          <Link to="/rh/projetos-pendentes">
            <Button>
              <Search className="mr-2 h-4 w-4" />
              Ver todos projetos
            </Button>
          </Link>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Projetos Avaliados"
            value={String(stats.evaluatedProjects)}
            icon={<Clock className="h-4 w-4" />}
          />
          <StatCard 
            title="Medalhas de Ouro"
            value={String(stats.goldMedals)}
            icon={<Medal className="h-4 w-4" />}
          />
          <StatCard 
            title="Medalhas de Prata"
            value={String(stats.silverMedals)}
            icon={<Medal className="h-4 w-4" />}
          />
          <StatCard 
            title="Medalhas de Bronze"
            value={String(stats.bronzeMedals)}
            icon={<Medal className="h-4 w-4" />}
          />
        </div>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Projetos Pendentes para Avaliação</CardTitle>
            <Link to="/rh/projetos-pendentes">
              <Button variant="outline" size="sm">
                Ver todos
              </Button>
            </Link>
          </CardHeader>
          <CardContent>            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pendingProjects.length > 0 ? (
                pendingProjects.slice(0, 3).map((project) => (
                  <ProjectCard
                    key={project.id}
                    title={`${project.title} - ${project.author}`}
                    image={project.image}
                    medalType={project.medalType}
                    hasFeedback={project.hasFeedback}
                    onViewDetails={() => handleEvaluate(project.id)}
                    userType="hr"
                  />
                ))
              ) : (
                <p>Nenhum projeto pendente no momento.</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Avaliações Recentes</CardTitle>
            <Link to="/rh/historico">
              <Button variant="outline" size="sm">
                Ver histórico completo
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {evaluationHistory.length > 0 ? (
                evaluationHistory.slice(0, 2).map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{item.projectTitle}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.author} • {item.date}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        {getMedalBadge(item.medal)}
                        {item.forwardedToManager ? (
                          <Badge variant="outline" className="bg-green-50">Encaminhado</Badge>
                        ) : (
                          <Badge variant="outline">Pendente</Badge>
                        )}
                      </div>
                    </div>
                    <Link to="/rh/historico">
                      <Button variant="outline" size="sm">
                        <User className="mr-2 h-4 w-4" />
                        Detalhes
                      </Button>
                    </Link>
                  </div>
                ))
              ) : (
                <p>Nenhuma avaliação recente no momento.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </UserPanelLayout>
  );
};

export default EvaluationPanel;
