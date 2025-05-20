import React, { useState, useEffect } from "react";
import UserPanelLayout from "@/components/UserPanelLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Video, Plus, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ProjectCard from "@/components/panels/ProjectCard";
import VideoPlayer from "@/components/panels/VideoPlayer";

// Define interfaces for the data structures
interface SubmissionProject {
  id: string;
  title: string;
  image: string;
  medalType: "ouro" | "prata" | "bronze" | null;
  hasFeedback: boolean;
  status: string; // e.g., "avaliado", "em avaliação"
  date: string;
}

interface VideoSubmissionDetails {
  title: string;
  videoUrl: string;
}

const TalentSubmissions = () => {
  // State for dynamic data
  const [projects, setProjects] = useState<SubmissionProject[]>([]);
  const [videoDetails, setVideoDetails] = useState<VideoSubmissionDetails>({
    title: "Seu Vídeo de Apresentação",
    videoUrl: "", // Initialize with empty or placeholder URL
  });
  const [userName, setUserName] = useState("Carregando..."); // State for user name

  // useEffect to fetch data
  useEffect(() => {
    const fetchSubmissionsData = async () => {
      // const userResponse = await fetch("/api/talent/user-info");
      // const userData = await userResponse.json();
      // setUserName(userData.name);
      // setUserName("Ana Silva"); // Example // REMOVE THIS LINE

      // const submissionsResponse = await fetch("/api/talent/submissions");

      const fetchProjects = async () => {
        // const response = await fetch("/api/talent/submissions/projects");
        // const data = await response.json();
        // setProjects(data);
        setProjects([]); // Initialize with empty array or fetched data
      };

      const fetchVideoDetails = async () => {
        // const response = await fetch("/api/talent/submissions/video");
        // const data = await response.json();
        // setVideoDetails(data);
        setVideoDetails({ title: "Seu Vídeo de Apresentação", videoUrl: "" }); // Placeholder
      };
      
      fetchProjects();
      fetchVideoDetails();
    };

    fetchSubmissionsData();
  }, []);

  const handleViewDetails = (id: string) => {
    console.log("View details", id);
  };

  const handleViewFeedback = (id: string) => {
    console.log("View feedback", id);
  };

  const handleUploadVideo = () => {
    console.log("Upload video");
  };

  const handleUploadProject = () => {
    console.log("Upload project");
  };

  return (
    <UserPanelLayout userName={userName} userType="talent">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Meus Envios</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{videoDetails.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <VideoPlayer
              title={videoDetails.title}
              videoUrl={videoDetails.videoUrl}
              onRecord={handleUploadVideo}
            />
            <div className="mt-4 flex justify-end">
              <Button onClick={handleUploadVideo}>
                <Video className="mr-2 h-4 w-4" />
                Atualizar Vídeo
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Meus Projetos</CardTitle>
            <Button onClick={handleUploadProject}>
              <Plus className="mr-2 h-4 w-4" />
              Enviar Novo Projeto
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
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
                <p>Nenhum projeto enviado ainda. Clique em "Enviar Novo Projeto" para começar.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enviar Novo Projeto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4 items-center justify-center p-8 border-2 border-dashed rounded-lg">
              <FileText size={48} className="text-muted-foreground" />
              <div className="text-center">
                <h3 className="text-lg font-medium">Arraste seu projeto ou clique para enviar</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Suporta arquivos PDF, PPT, DOC ou ZIP (máximo 20MB)
                </p>
              </div>
              <Button onClick={handleUploadProject}>Selecionar Arquivo</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </UserPanelLayout>
  );
};

export default TalentSubmissions;
