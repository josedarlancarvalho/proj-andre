import React, { useState, useEffect, useRef } from "react"; // adicionei useRef
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

// Interfaces
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
}

interface VideoDetails {
  title: string;
  videoUrl: string;
}

const TalentPanel = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [profileStats, setProfileStats] = useState<ProfileStats>({
    projectsSent: 0,
    feedbacksReceived: 0,
  });
  const [userProfile, setUserProfile] = useState<{
    name: string;
    tags: string[];
  }>({ name: "Carregando...", tags: [] });
  const [videoDetails, setVideoDetails] = useState<VideoDetails>({
    title: "Seu Vídeo de Apresentação",
    videoUrl: "",
  });

  // NOVO: Estado para ativar a webcam
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Simular API para carregar dados do usuário, projetos, feedbacks e convites
    const fetchData = async () => {
      // EXEMPLO: Dados carregados de uma API real (descomente e ajuste sua URL)
      /*
      const profileResponse = await fetch("/api/talent/profile");
      const profileData = await profileResponse.json();
      setUserProfile({ name: profileData.name, tags: profileData.tags });
      setProfileStats({ projectsSent: profileData.projectsSent, feedbacksReceived: profileData.feedbacksReceived });

      const projectsResponse = await fetch("/api/talent/projects");
      const projectsData = await projectsResponse.json();
      setProjects(projectsData);

      const feedbacksResponse = await fetch("/api/talent/feedbacks");
      const feedbacksData = await feedbacksResponse.json();
      setFeedbacks(feedbacksData);

      const invitesResponse = await fetch("/api/talent/invites");
      const invitesData = await invitesResponse.json();
      setInvites(invitesData);

      const videoResponse = await fetch("/api/talent/video");
      const videoData = await videoResponse.json();
      setVideoDetails(videoData);
      */

      // Simulação local enquanto API não está pronta
      setUserProfile({
        name: "João Silva",
        tags: ["React", "TypeScript", "UI/UX"],
      });
      setProfileStats({ projectsSent: 3, feedbacksReceived: 5 });
      setProjects([
        {
          id: "1",
          title: "App Educacional",
          image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
          medalType: "prata",
          hasFeedback: true,
        },
        {
          id: "2",
          title: "Projeto Social",
          image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
          medalType: null,
          hasFeedback: false,
        },
      ]);
      setFeedbacks([
        {
          id: "1",
          from: "Maria Silva (RH)",
          date: "12/05/2023",
          text: "Interface intuitiva!",
          category: "UX Design",
          isNew: true,
        },
        {
          id: "2",
          from: "Carlos Mendes (RH)",
          date: "05/04/2023",
          text: "Bom backend, adicione testes.",
          category: "Desenvolvimento",
          isNew: false,
        },
      ]);
      setInvites([
        {
          id: "1",
          company: "Tech Solutions",
          date: "15/05/2023 às 14:30",
          type: "Entrevista Online",
        },
      ]);
      setVideoDetails({ title: "Seu Vídeo de Apresentação", videoUrl: "" }); // vídeo vazio no começo
    };

    fetchData();
  }, []);

  // NOVO: Ativar webcam e mostrar no vídeo
  const handleRecordVideo = async () => {
    if (!isRecording) {
      // Ativar webcam
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsRecording(true);
      } catch (error) {
        console.error("Erro ao acessar webcam:", error);
      }
    } else {
      // Parar webcam
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsRecording(false);
    }
  };

  // Os handlers já estão ok, só reutilizar

  return (
    <UserPanelLayout userType="jovem">
      <div className="space-y-6">
        {/* Saudação personalizada (já pega o nome real do estado) */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            Bem-vindo(a), {userProfile.name}!
          </h1>
          <Link to="/jovem/submissoes">
            <Button onClick={() => console.log("New project")}>
              <Plus className="mr-2 h-4 w-4" />
              Enviar novo projeto
            </Button>
          </Link>
        </div>

        {/* Resumo do perfil dinâmico */}
        <ProfileSummary
          name={userProfile.name}
          stats={[
            { label: "Projetos enviados", value: profileStats.projectsSent },
            {
              label: "Feedbacks recebidos",
              value: profileStats.feedbacksReceived,
            },
          ]}
          tags={userProfile.tags}
        />

        {/* Estatísticas */}
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

        {/* Projetos */}
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
                  onViewDetails={() => console.log("View details", project.id)}
                  onViewFeedback={() =>
                    console.log("View feedback", project.id)
                  }
                  userType="talent"
                />
              ))
            ) : (
              <p>Nenhum projeto enviado ainda.</p>
            )}
          </div>
        </div>

        {/* Feedbacks e Vídeo */}
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
              <Button variant="outline" size="sm" onClick={handleRecordVideo}>
                {isRecording ? "Parar gravação" : "Gravar vídeo"}
              </Button>
            </div>

            {/* Exibir vídeo da webcam se estiver gravando, senão o vídeo normal */}
            {isRecording ? (
              <video
                ref={videoRef}
                className="w-full rounded-md border"
                autoPlay
                muted
                playsInline
              />
            ) : videoDetails.videoUrl ? (
              <VideoPlayer
                title={videoDetails.title}
                videoUrl={videoDetails.videoUrl}
                onRecord={handleRecordVideo}
              />
            ) : (
              <div className="flex h-60 items-center justify-center rounded-md border border-dashed border-gray-300 text-gray-400">
                Nenhum vídeo enviado ainda.
              </div>
            )}
          </div>
        </div>

        {/* Convites */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Convites</h2>
          {invites.length > 0 ? (
            <div className="space-y-4">
              {invites.map((invite) => (
                <div key={invite.id} className="rounded-md border p-4">
                  <p>
                    <strong>Empresa:</strong> {invite.company}
                  </p>
                  <p>
                    <strong>Data:</strong> {invite.date}
                  </p>
                  <p>
                    <strong>Tipo:</strong> {invite.type}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>Nenhum convite recebido.</p>
          )}
        </div>
      </div>
    </UserPanelLayout>
  );
};

export default TalentPanel;
