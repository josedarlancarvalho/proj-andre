import React from "react";
import UserPanelLayout from "@/components/UserPanelLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatCard from "@/components/panels/StatCard";
import { Star, Calendar, User, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

// Interfaces
interface RecentTalent {
  id: string;
  name: string;
  age: number;
  city: string;
  medal: "ouro" | "prata" | "bronze" | null;
  project: string;
  tags: string[];
}

interface UpcomingInterview {
  id: string;
  candidate: string;
  date: string;
  time: string;
  type: "online" | "presencial";
}

interface ActivityItem {
  id: string;
  type: "interview_scheduled" | "favorited" | "viewed_profiles" | "interview_accepted"; // Example types
  text: string; // Or ReactNode for more complex rendering
  timeAgo: string;
  iconBadge: React.ReactNode; // For badges like ✓, ★ etc.
}

interface ManagerStats {
  exploredTalents: number;
  favoriteTalents: number;
  scheduledInterviews: number;
  newTalentsInArea: number; // Assuming this stat might not have a specific icon in the mock
}

const ManagerPanel = () => {
  const [userName, setUserName] = useState("Carregando...");
  const [recentTalents, setRecentTalents] = useState<RecentTalent[]>([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState<UpcomingInterview[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityItem[]>([]);
  const [stats, setStats] = useState<ManagerStats>({
    exploredTalents: 0,
    favoriteTalents: 0,
    scheduledInterviews: 0,
    newTalentsInArea: 0,
  });

  useEffect(() => {
    // TODO: Replace with actual API calls
    const fetchManagerData = async () => {
      // const userResponse = await fetch("/api/manager/user-info");
      // const userData = await userResponse.json();
      // setUserName(userData.name);
      setRecentTalents([]);
      setUpcomingInterviews([]);
      setActivityLog([]);
      setStats({ exploredTalents: 0, favoriteTalents: 0, scheduledInterviews: 0, newTalentsInArea: 0 });
    };
    fetchManagerData();
  }, []);

  const getMedalBadge = (medal: string | null) => {
    if (medal === "ouro") {
      return <Badge className="bg-yellow-400 text-black">Ouro</Badge>;
    } else if (medal === "prata") {
      return <Badge className="bg-gray-300 text-black">Prata</Badge>;
    } else if (medal === "bronze") {
      return <Badge className="bg-amber-700 text-white">Bronze</Badge>;
    } else {
      return <Badge variant="outline">-</Badge>;
    }
  };

  return (
    <UserPanelLayout userType="gestor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Bem-vindo, {userName}!</h1>
          <Link to="/gestor/explorar">
            <Button>
              <Search className="mr-2 h-4 w-4" />
              Explorar talentos
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard 
            title="Talentos Explorados"
            value={String(stats.exploredTalents)}
            icon={<User className="h-4 w-4" />}
          />
          <StatCard 
            title="Talentos Favoritos"
            value={String(stats.favoriteTalents)}
            icon={<Star className="h-4 w-4" />}
          />
          <StatCard 
            title="Entrevistas"
            value={String(stats.scheduledInterviews)}
            description="Agendadas"
            icon={<Calendar className="h-4 w-4" />}
          />
          <StatCard 
            title="Novos Talentos"
            value={String(stats.newTalentsInArea)}
            description="Em sua área"
          />
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Talentos em Destaque</CardTitle>
            <Link to="/gestor/explorar">
              <Button variant="outline" size="sm">
                Ver mais
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTalents.map((talent) => (
                <div key={talent.id} className="border rounded-lg p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">{talent.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {talent.age} anos • {talent.city}
                      </p>
                    </div>
                    <div>{getMedalBadge(talent.medal)}</div>
                  </div>
                  <div className="mt-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Projeto: </span>
                      <span>{talent.project}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {talent.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Link to="/gestor/explorar">
                      <Button variant="outline" size="sm">
                        Ver perfil
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Entrevistas Próximas</CardTitle>
            <Link to="/gestor/entrevistas">
              <Button variant="outline" size="sm">
                Ver agenda
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {upcomingInterviews.length > 0 ? (
              upcomingInterviews.map((interview) => (
                <div 
                  key={interview.id}
                  className="mb-4 p-3 border rounded-md flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium">{interview.candidate}</h3>
                    <p className="text-sm text-muted-foreground">
                      {interview.date} às {interview.time}
                    </p>
                    <Badge 
                      variant="outline" 
                      className="mt-1"
                    >
                      {interview.type === "online" ? "Entrevista Online" : "Entrevista Presencial"}
                    </Badge>
                  </div>
                  <Link to="/gestor/entrevistas">
                    <Button variant="outline" size="sm">
                      <Calendar className="mr-2 h-4 w-4" />
                      Ver detalhes
                    </Button>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">Nenhuma entrevista próxima agendada.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            {activityLog.length > 0 ? (
              <ul className="space-y-4">
                {activityLog.map((activity) => (
                  <li key={activity.id} className="flex gap-3">
                    {activity.iconBadge}
                    <div className="space-y-1">
                      <p className="text-sm">
                        {activity.text}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.timeAgo}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Nenhuma atividade recente.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </UserPanelLayout>
  );
};

export default ManagerPanel;
