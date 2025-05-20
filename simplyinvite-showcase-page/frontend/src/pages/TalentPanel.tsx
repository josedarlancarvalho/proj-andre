import React from "react";
import UserPanelLayout from "@/components/UserPanelLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProfileSummary from "@/components/panels/ProfileSummary";
import ProjectCard from "@/components/panels/ProjectCard";
import VideoPlayer from "@/components/panels/VideoPlayer";
import FeedbackList from "@/components/panels/FeedbackList";
import StatCard from "@/components/panels/StatCard";
import { Plus, FileVideo, Medal, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

// Define interfaces for the data structures (optional, but good practice)
interface Project {
  id: string;
  title: string;
  image: string;
  medalType: "ouro" | "prata" | "bronze" | null;
  hasFeedback: boolean;
}

interface Feedback {
  id: string;
  from: string;
  date: string;
  text: string;
  category: string;
  isNew: boolean;
}

interface Invite {
  id: string;
  company: string;
  date: string;
  type: string;
}

interface ProfileStats {
  projectsSent: number;
  feedbacksReceived: number;
  // Add other relevant stats
}

interface VideoDetails {
  title: string;
  videoUrl: string;
}

const TalentPanel = () => {
  // State for dynamic data
  const [projects, setProjects] = useState<Project[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [profileStats, setProfileStats] = useState<ProfileStats>({ projectsSent: 0, feedbacksReceived: 0 });
  const [userProfile, setUserProfile] = useState({ name: "Carregando...", tags: [] });
  const [videoDetails, setVideoDetails] = useState<VideoDetails>({ title: "Seu Vídeo de Apresentação", videoUrl: "" });

  // useEffect to fetch data
  useEffect(() => {
    // TODO: Replace with actual API calls
    const fetchProjects = async () => {
      // const response = await fetch("/api/talent/projects");
      // const data = await response.json();
      // setProjects(data);
      setProjects([]); // Initialize with empty array or fetched data
    };

    const fetchFeedbacks = async () => {
      // const response = await fetch("/api/talent/feedbacks");
      // const data = await response.json();
      // setFeedbacks(data);
      setFeedbacks([]); // Initialize with empty array or fetched data
    };

    const fetchInvites = async () => {
      // const response = await fetch("/api/talent/invites");
      // const data = await response.json();
      // setInvites(data);
      setInvites([]); // Initialize with empty array or fetched data
    };

    const fetchProfileData = async () => {
      // Example: Fetching user name, tags, and stats
      // const response = await fetch("/api/talent/profile");
      // const data = await response.json();
      // setUserProfile({ name: data.name, tags: data.tags });
      // setProfileStats({ projectsSent: data.projectsSent, feedbacksReceived: data.feedbacksReceived });
      // setUserProfile({ name: "Carregando...", tags: [] }); // Linha já consistente com a inicialização, pode ser removida se a API for implementada diretamente
      // setProfileStats({ projectsSent: 0, feedbacksReceived: 0 }); // Mesma observação
    };
    
    const fetchVideoDetails = async () => {
      // const response = await fetch("/api/talent/video");
      // const data = await response.json();
      // setVideoDetails(data);
      setVideoDetails({ title: "Seu Vídeo de Apresentação", videoUrl: "" }); // Placeholder
    };

    fetchProjects();
    fetchFeedbacks();
    fetchInvites();
    fetchProfileData();
    fetchVideoDetails();
  }, []);

  // Mock data
  // const mockProjects = [
  //   {
  //     id: "1",
  //     title: "App Educacional",
  //     image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  //     medalType: "prata" as const,
  //     hasFeedback: true,
  //   },
  //   {
  //     id: "2",
  //     title: "Projeto Social",
  //     image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
  //     medalType: null,
  //     hasFeedback: false,
  //   },
  // ];

  // const mockFeedbacks = [
  //   {
  //     id: "1",
  //     from: "Maria Silva (RH)",
  //     date: "12/05/2023",
  //     text: "Seu app tem uma interface muito intuitiva! Continue trabalhando na documentação do projeto.",
  //     category: "UX Design",
  //     isNew: true,
  //   },
  //   {
  //     id: "2",
  //     from: "Carlos Mendes (RH)",
  //     date: "05/04/2023",
  //     text: "Bom trabalho na implementação do backend. Sugiro adicionar mais testes.",
  //     category: "Desenvolvimento",
  //     isNew: false,
  //   },
  // ];

  // const mockInvites = [
  //   {
  //     id: "1",
  //     company: "Tech Solutions",
  //     date: "15/05/2023 às 14:30",
  //     type: "Entrevista Online",
  //   },
  // ];

  // Handlers
  const handleNewProject = () => {
    console.log("New project");
  };

  const handleViewDetails = (id: string) => {
    console.log("View details", id);
  };

  const handleViewFeedback = (id: string) => {
    console.log("View feedback", id);
  };

  return (
    <UserPanelLayout userName={userProfile.name} userType="talent">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            Bem-vindo(a), {userProfile.name}!
          </h1>
          <Link to="/jovem/submissoes">
            <Button onClick={handleNewProject}>
              <Plus className="mr-2 h-4 w-4" />
              Enviar novo projeto
            </Button>
          </Link>
        </div>

        <ProfileSummary
          name={userProfile.name}
          stats={[
            { label: "Projetos enviados", value: profileStats.projectsSent },
            { label: "Feedbacks recebidos", value: profileStats.feedbacksReceived },
          ]}
          tags={userProfile.tags}
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Projetos Enviados"
            value={String(profileStats.projectsSent)}
            description="Continue compartilhando seu talento!"
            icon={<FileVideo className="h-4 w-4" />}
          />
          <StatCard
            title="Medalhas Recebidas"
            value="0"
            description="Medalhas ainda não contabilizadas"
            icon={<Medal className="h-4 w-4" />}
          />
          <StatCard
            title="Visualizações"
            value="0"
            description="Seu vídeo ainda não foi visualizado"
            icon={<Eye className="h-4 w-4" />}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Seus Projetos</h2>
            <Link to="/jovem/submissoes">
              <Button variant="outline" size="sm">
                Ver todos
              </Button>
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.length > 0 ? (
              projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  title={project.title}
                  image={project.image}
                  medalType={project.medalType}
                  hasFeedback={project.hasFeedback}
                  onViewDetails={() => handleViewDetails(project.id)}
                  onViewFeedback={() => handleViewFeedback(project.id)}
                  userType="talent"
                />
              ))
            ) : (
              <p>Nenhum projeto enviado ainda.</p>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Feedbacks Recebidos</h2>
              <Link to="/jovem/feedbacks">
                <Button variant="outline" size="sm">
                  Ver todos
                </Button>
              </Link>
            </div>
            {feedbacks.length > 0 ? (
              <FeedbackList feedbacks={feedbacks.slice(0, 1)} />
            ) : (
              <p>Nenhum feedback recebido ainda.</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Seu Vídeo</h2>
              <Link to="/jovem/submissoes">
                <Button variant="outline" size="sm">
                  Atualizar
                </Button>
              </Link>
            </div>
            <VideoPlayer
              title={videoDetails.title}
              videoUrl={videoDetails.videoUrl}
              onRecord={() => console.log("Record new video")}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Convites Recebidos</h2>
            <Link to="/jovem/convites">
              <Button variant="outline" size="sm">
                Ver todos
              </Button>
            </Link>
          </div>
          {invites.length > 0 ? (
            <div className="rounded-md border">
              <div className="p-4">
                {invites.map((invite) => (
                  <div
                    key={invite.id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-medium">{invite.company}</h3>
                      <p className="text-sm text-muted-foreground">
                        {invite.date}
                      </p>
                      <Badge className="mt-1">{invite.type}</Badge>
                    </div>
                    <Link to="/jovem/convites">
                      <Button variant="outline" size="sm">
                        Ver detalhes
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p>Nenhum convite recebido ainda.</p>
          )}
        </div>
      </div>
    </UserPanelLayout>
  );
};

export default TalentPanel;
