import React, { useState, useEffect } from "react";
import UserPanelLayout from "@/components/UserPanelLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatCard from "@/components/panels/StatCard";
import { FileText, Clock, MessageSquare, Building } from "lucide-react";
import { Link } from "react-router-dom";

// Interfaces
interface PendingProject {
  id: string;
  title: string;
  talent: string;
  submittedDate: string;
  category: string;
  status: "pending" | "in_progress" | "completed";
}

interface HRStats {
  pendingProjects: number;
  evaluatedProjects: number;
  forwardedToManager: number;
  totalMessages: number;
}

const HRPanel = () => {
  const [pendingProjects, setPendingProjects] = useState<PendingProject[]>([]);
  const [stats, setStats] = useState<HRStats>({
    pendingProjects: 0,
    evaluatedProjects: 0,
    forwardedToManager: 0,
    totalMessages: 0,
  });

  useEffect(() => {
    // Fetch data
    const fetchData = async () => {
      // Simulated data
      setPendingProjects([
        {
          id: "1",
          title: "App de Gestão Financeira",
          talent: "Ana Silva",
          submittedDate: "2024-03-24",
          category: "Desenvolvimento Mobile",
          status: "pending",
        },
        {
          id: "2",
          title: "Redesign de E-commerce",
          talent: "Pedro Santos",
          submittedDate: "2024-03-23",
          category: "UI/UX Design",
          status: "in_progress",
        },
      ]);

      setStats({
        pendingProjects: 5,
        evaluatedProjects: 12,
        forwardedToManager: 8,
        totalMessages: 3,
      });
    };

    fetchData();
  }, []);

  return (
    <UserPanelLayout userType="rh">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            Painel de Avaliação
          </h1>
          <Link to="/rh/projetos-pendentes">
            <Button>Ver todos os projetos</Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Projetos Pendentes"
            value={stats.pendingProjects.toString()}
            description="Aguardando avaliação"
            icon={<FileText className="h-4 w-4" />}
          />
          <StatCard
            title="Projetos Avaliados"
            value={stats.evaluatedProjects.toString()}
            description="Total de avaliações realizadas"
            icon={<Clock className="h-4 w-4" />}
          />
          <StatCard
            title="Encaminhados"
            value={stats.forwardedToManager.toString()}
            description="Enviados para gestores"
            icon={<Building className="h-4 w-4" />}
          />
          <StatCard
            title="Mensagens"
            value={stats.totalMessages.toString()}
            description="Novas mensagens"
            icon={<MessageSquare className="h-4 w-4" />}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Projetos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      por {project.talent}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{project.category}</Badge>
                      <Badge
                        variant={
                          project.status === "pending"
                            ? "destructive"
                            : project.status === "in_progress"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {project.status === "pending"
                          ? "Pendente"
                          : project.status === "in_progress"
                          ? "Em Avaliação"
                          : "Concluído"}
                      </Badge>
                    </div>
                  </div>
                  <Link to={`/rh/projetos-pendentes/${project.id}`}>
                    <Button variant="outline" size="sm">
                      Avaliar
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </UserPanelLayout>
  );
};

export default HRPanel; 