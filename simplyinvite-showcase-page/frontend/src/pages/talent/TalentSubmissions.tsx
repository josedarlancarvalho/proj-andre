import React, { useState, useEffect } from "react";
import UserPanelLayout from "@/components/UserPanelLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Video, Plus, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ProjectCard from "@/components/panels/ProjectCard";
import VideoPlayer from "@/components/panels/VideoPlayer";
import { useAuth } from "@/contexts/AuthContext";
import { buscarMeusProjetos } from "@/servicos/jovem";
import { mapAuthToComponentType } from "@/utils/profileTypeMapper";
import VideoRecorder from "@/components/VideoRecorder";
import { toast } from "sonner";

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
  const { user, profileType } = useAuth(); // Usando o contexto de autenticação
  const componentUserType = profileType
    ? mapAuthToComponentType(profileType)
    : "talent";
  // State for dynamic data
  const [projects, setProjects] = useState<SubmissionProject[]>([]);
  const [videoDetails, setVideoDetails] = useState<VideoSubmissionDetails>({
    title: "Seu Vídeo de Apresentação",
    videoUrl: "", // Initialize with empty or placeholder URL
  });
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // useEffect to fetch data
  useEffect(() => {
    const fetchSubmissionsData = async () => {
      try {
        // Buscar projetos do usuário
        const projetosData = await buscarMeusProjetos();
        console.log("Projetos carregados:", projetosData);

        if (projetosData && projetosData.length > 0) {
          // Mapear projetos para o formato esperado
          const projetosMapeados = projetosData.map((projeto) => ({
            id: projeto.id.toString(),
            title: projeto.titulo,
            image:
              "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b", // Imagem temporária
            medalType: projeto.avaliacao?.medalha || null,
            hasFeedback: projeto.feedback ? true : false,
            status: projeto.status,
            date: new Date(
              projeto.createdAt || Date.now()
            ).toLocaleDateString(),
          }));
          setProjects(projetosMapeados);
        }

        // Buscar informações do vídeo (quando disponível)
        // Por enquanto, deixamos o placeholder
      } catch (error) {
        console.error("Erro ao carregar dados de submissões:", error);
      }
    };

    if (user) {
      fetchSubmissionsData();
    }
  }, [user]);

  const handleViewDetails = (id: string) => {
    console.log("View details", id);
  };

  const handleViewFeedback = (id: string) => {
    console.log("View feedback", id);
  };

  const handleUploadVideo = () => {
    setIsRecording(true);
  };

  const handleCancelRecording = () => {
    setIsRecording(false);
  };

  const handleSaveVideo = async (videoBlob: Blob) => {
    try {
      setIsUploading(true);

      // Criar um FormData para enviar o vídeo
      const formData = new FormData();
      formData.append("video", videoBlob, "recorded-video.webm");

      // Simulando um delay de upload
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Atualizar a URL do vídeo (em produção, isso viria da resposta do servidor)
      const videoUrl = URL.createObjectURL(videoBlob);
      setVideoDetails({
        title: "Seu Vídeo de Apresentação",
        videoUrl: videoUrl,
      });

      setIsRecording(false);
      toast.success("Vídeo salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar vídeo:", error);
      toast.error("Erro ao salvar o vídeo. Tente novamente.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadProject = () => {
    console.log("Upload project");
  };

  return (
    <UserPanelLayout userType="jovem">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Meus Envios</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{videoDetails.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {isRecording ? (
              <VideoRecorder
                onSave={handleSaveVideo}
                onCancel={handleCancelRecording}
              />
            ) : (
              <>
                <VideoPlayer
                  title={videoDetails.title}
                  videoUrl={videoDetails.videoUrl}
                  onRecord={handleUploadVideo}
                />
                <div className="mt-4 flex justify-end">
                  <Button onClick={handleUploadVideo} disabled={isUploading}>
                    <Video className="mr-2 h-4 w-4" />
                    {isUploading ? "Salvando..." : "Gravar Vídeo"}
                  </Button>
                </div>
              </>
            )}
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
                    userType={componentUserType}
                  />
                ))
              ) : (
                <p>
                  Nenhum projeto enviado ainda. Clique em "Enviar Novo Projeto"
                  para começar.
                </p>
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
                <h3 className="text-lg font-medium">
                  Arraste seu projeto ou clique para enviar
                </h3>
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
