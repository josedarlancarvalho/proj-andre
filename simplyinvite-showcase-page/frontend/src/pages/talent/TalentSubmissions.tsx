import React, { useState, useEffect } from "react";
import UserPanelLayout from "@/components/UserPanelLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Video, Plus, Eye, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ProjectCard from "@/components/panels/ProjectCard";
import VideoPlayer from "@/components/panels/VideoPlayer";
import { useAuth } from "@/contexts/AuthContext";
import {
  buscarMeusProjetos,
  submeterProjeto,
  buscarProjeto,
} from "@/servicos/jovem";
import jovemService from "@/servicos/jovem";
import { mapAuthToComponentType } from "@/utils/profileTypeMapper";
import VideoRecorder from "@/components/VideoRecorder";
import FileUploader from "@/components/FileUploader";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import FeedbackModal from "@/components/panels/FeedbackModal";

// Define interfaces for the data structures
interface SubmissionProject {
  id: string;
  title: string;
  image: string;
  medalType: "ouro" | "prata" | "bronze" | null;
  hasFeedback: boolean;
  status: string; // e.g., "avaliado", "em avaliação"
  date: string;
  tecnologias?: string[];
  descricao?: string;
  linkRepositorio?: string;
  linkDeploy?: string;
}

interface ProjetoDetalhe {
  id: number;
  titulo: string;
  descricao: string;
  tecnologias: string[];
  linkRepositorio?: string;
  linkDeploy?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmissionDialogOpen, setIsSubmissionDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] =
    useState<SubmissionProject | null>(null);
  const [newProject, setNewProject] = useState({
    titulo: "",
    descricao: "",
    tecnologias: "",
    linkRepositorio: "",
    linkDeploy: "",
  });

  // Adicionar novos estados para o feedback
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedProjectForFeedback, setSelectedProjectForFeedback] =
    useState<SubmissionProject | null>(null);
  const [feedbackData, setFeedbackData] = useState<{
    avaliacoes: any[];
    feedbacks: any[];
  }>({
    avaliacoes: [],
    feedbacks: [],
  });
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  // Função para recarregar a lista de projetos
  const recarregarProjetos = async () => {
    try {
      console.log("Recarregando projetos...");
      const projetosData = await buscarMeusProjetos();
      console.log("Projetos recarregados:", projetosData);

      if (projetosData && Array.isArray(projetosData)) {
        const projetosMapeados = projetosData.map((projeto) => ({
          id: projeto.id.toString(),
          title: projeto.titulo,
          image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
          medalType: projeto.avaliacao?.medalha || null,
          hasFeedback: projeto.feedback ? true : false,
          status: projeto.status,
          date: new Date(projeto.createdAt || Date.now()).toLocaleDateString(),
          tecnologias: projeto.tecnologias,
          descricao: projeto.descricao,
          linkRepositorio: projeto.linkRepositorio,
          linkDeploy: projeto.linkDeploy,
        }));
        setProjects(projetosMapeados);
      } else {
        console.log(
          "Não foram encontrados projetos ou o formato é inválido após recarregamento"
        );
        setProjects([]);
      }
    } catch (error) {
      console.error("Erro ao recarregar projetos:", error);
    }
  };

  // useEffect to fetch data
  useEffect(() => {
    const fetchSubmissionsData = async () => {
      try {
        // Buscar projetos do usuário
        const projetosData = await buscarMeusProjetos();
        console.log("Projetos carregados:", projetosData);

        if (projetosData && Array.isArray(projetosData)) {
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
            tecnologias: projeto.tecnologias,
            descricao: projeto.descricao,
            linkRepositorio: projeto.linkRepositorio,
            linkDeploy: projeto.linkDeploy,
          }));
          setProjects(projetosMapeados);
        } else {
          console.log(
            "Não foram encontrados projetos ou o formato é inválido:",
            projetosData
          );
          setProjects([]);
        }

        // Buscar informações do vídeo (quando disponível)
        // Por enquanto, deixamos o placeholder
      } catch (error) {
        console.error("Erro ao carregar dados de submissões:", error);
        setProjects([]);
      }
    };

    if (user) {
      console.log("Carregando projetos do usuário:", user);
      fetchSubmissionsData();
    }
  }, [user]);

  const handleViewDetails = (id: string) => {
    console.log("View details", id);
    // Encontrar o projeto selecionado
    const projeto = projects.find((p) => p.id === id);
    if (projeto) {
      setSelectedProject(projeto);
      setIsDetailsDialogOpen(true);
    }
  };

  const handleViewFeedback = async (projectId: string) => {
    try {
      console.log(
        `Iniciando busca de feedback para o projeto ID: ${projectId}`
      );
      setLoadingFeedback(true);
      setIsFeedbackModalOpen(true);

      // Encontrar o projeto selecionado
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        console.log(`Projeto encontrado localmente: ${project.title}`);
        setSelectedProjectForFeedback(project);
      } else {
        console.log(`Projeto não encontrado localmente para ID: ${projectId}`);
      }

      // Buscar os feedbacks da API usando o método do serviço
      console.log(
        `Chamando API para buscar feedback do projeto ID: ${projectId}`
      );
      const feedbacksData = await jovemService.buscarFeedbackProjeto(
        parseInt(projectId)
      );

      console.log(`Feedback recebido:`, feedbacksData);
      setFeedbackData(feedbacksData);
    } catch (error: any) {
      console.error("Erro ao carregar feedbacks:", error);

      // Mensagem de erro mais informativa
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Não foi possível carregar os feedbacks";
      toast.error(`Erro: ${errorMessage}. Tente novamente.`);

      // Fechamos o modal em caso de erro
      setIsFeedbackModalOpen(false);
    } finally {
      setLoadingFeedback(false);
    }
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
    setIsSubmissionDialogOpen(true);
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleProjectSubmit = async () => {
    try {
      if (!selectedFile) {
        toast.error("Por favor, selecione um arquivo para enviar");
        return;
      }

      // Validação mais robusta de tecnologias
      const tecnologiasArray = newProject.tecnologias
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
        .map((tag) => tag.toLowerCase());

      // Validar campos obrigatórios
      if (!newProject.titulo || !newProject.descricao) {
        toast.error("Título e descrição são obrigatórios");
        return;
      }

      // Limitar número de tecnologias
      if (tecnologiasArray.length > 10) {
        toast.error("Máximo de 10 tecnologias permitidas");
        return;
      }

      setIsUploading(true);

      // Criar FormData para enviar o arquivo
      const formData = new FormData();
      formData.append("arquivo", selectedFile);
      formData.append("titulo", newProject.titulo);
      formData.append("descricao", newProject.descricao);
      formData.append("tecnologias", JSON.stringify(tecnologiasArray));

      if (newProject.linkRepositorio) {
        // Validação básica de URL removida
        formData.append("linkRepositorio", newProject.linkRepositorio);
      }

      if (newProject.linkDeploy) {
        // Validação de URL de deploy removida
        formData.append("linkDeploy", newProject.linkDeploy);
      }

      // Enviar projeto para a API com tratamento de erros detalhado
      try {
        const response = await submeterProjeto({
          titulo: newProject.titulo,
          descricao: newProject.descricao,
          tecnologias: tecnologiasArray,
          linkRepositorio: newProject.linkRepositorio || undefined,
          linkDeploy: newProject.linkDeploy || undefined,
        });

        toast.success("Projeto enviado com sucesso!");

        // Limpar formulário e fechar diálogo
        setSelectedFile(null);
        setNewProject({
          titulo: "",
          descricao: "",
          tecnologias: "",
          linkRepositorio: "",
          linkDeploy: "",
        });
        setIsSubmissionDialogOpen(false);

        // Recarregar a lista de projetos
        await recarregarProjetos();
      } catch (apiError) {
        console.error("Erro detalhado na API:", apiError);

        // Tratamento de erros específicos da API
        if (apiError.response) {
          const errorDetails = apiError.response.data;
          if (errorDetails.errors && Array.isArray(errorDetails.errors)) {
            const errorMessages = errorDetails.errors
              .map((err) => err.message)
              .join(", ");
            toast.error(`Erro na submissão: ${errorMessages}`);
          } else {
            toast.error(errorDetails.message || "Erro ao enviar projeto");
          }
        } else {
          toast.error("Erro de conexão. Verifique sua internet.");
        }
      }
    } catch (error) {
      console.error("Erro inesperado:", error);
      toast.error("Erro inesperado ao processar o projeto");
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({
      ...prev,
      [name]: value,
    }));
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
            <FileUploader
              onFileSelect={handleFileSelect}
              maxSizeMB={20}
              allowedFileTypes={[
                ".pdf",
                ".ppt",
                ".pptx",
                ".doc",
                ".docx",
                ".zip",
              ]}
              title="Arraste seu projeto ou clique para enviar"
              description="Suporta arquivos PDF, PPT, DOC ou ZIP"
            />
            <div className="mt-4 flex justify-end">
              <Button onClick={handleUploadProject} disabled={!selectedFile}>
                <Plus className="mr-2 h-4 w-4" />
                Continuar Envio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Diálogo para detalhes do projeto */}
      <Dialog
        open={isSubmissionDialogOpen}
        onOpenChange={setIsSubmissionDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Projeto</DialogTitle>
            <DialogDescription>
              Preencha as informações sobre seu projeto para submissão
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título do Projeto</Label>
              <Input
                id="titulo"
                name="titulo"
                value={newProject.titulo}
                onChange={handleInputChange}
                placeholder="Ex: Sistema de Gerenciamento de Tarefas"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                name="descricao"
                value={newProject.descricao}
                onChange={handleInputChange}
                placeholder="Descreva seu projeto, objetivos e funcionalidades..."
                rows={5}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tecnologias">Tecnologias Utilizadas</Label>
              <Input
                id="tecnologias"
                name="tecnologias"
                value={newProject.tecnologias}
                onChange={handleInputChange}
                placeholder="Ex: React, Node.js, MongoDB (separados por vírgula)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkRepositorio">
                Link do Repositório (opcional)
              </Label>
              <Input
                id="linkRepositorio"
                name="linkRepositorio"
                value={newProject.linkRepositorio}
                onChange={handleInputChange}
                placeholder="Ex: https://github.com/seu-usuario/projeto"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkDeploy">
                Link de Demonstração (opcional)
              </Label>
              <Input
                id="linkDeploy"
                name="linkDeploy"
                value={newProject.linkDeploy}
                onChange={handleInputChange}
                placeholder="Ex: https://seu-projeto.vercel.app"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSubmissionDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleProjectSubmit}
              disabled={
                isUploading || !newProject.titulo || !newProject.descricao
              }
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando...
                </>
              ) : (
                "Enviar Projeto"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para visualizar detalhes do projeto */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedProject?.title}</DialogTitle>
            <DialogDescription>Detalhes do projeto</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium">Descrição</h4>
              <p className="text-sm text-muted-foreground">
                {selectedProject?.descricao || "Sem descrição disponível"}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Tecnologias</h4>
              <div className="flex flex-wrap gap-2">
                {selectedProject?.tecnologias &&
                selectedProject.tecnologias.length > 0 ? (
                  selectedProject.tecnologias.map((tech, index) => (
                    <Badge key={index} variant="secondary">
                      {tech}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Nenhuma tecnologia especificada
                  </span>
                )}
              </div>
            </div>

            {selectedProject?.linkRepositorio && (
              <div className="space-y-2">
                <h4 className="font-medium">Link do Repositório</h4>
                <a
                  href={selectedProject.linkRepositorio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline flex items-center"
                >
                  {selectedProject.linkRepositorio}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            )}

            {selectedProject?.linkDeploy && (
              <div className="space-y-2">
                <h4 className="font-medium">Link de Demonstração</h4>
                <a
                  href={selectedProject.linkDeploy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline flex items-center"
                >
                  {selectedProject.linkDeploy}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            )}

            <div className="space-y-2">
              <h4 className="font-medium">Status</h4>
              <Badge
                variant={
                  selectedProject?.status === "pendente"
                    ? "outline"
                    : selectedProject?.status === "avaliado"
                    ? "secondary"
                    : "default"
                }
              >
                {selectedProject?.status === "pendente"
                  ? "Aguardando avaliação"
                  : selectedProject?.status === "avaliado"
                  ? "Avaliado"
                  : selectedProject?.status === "destacado"
                  ? "Destacado"
                  : selectedProject?.status}
              </Badge>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Data de Submissão</h4>
              <p className="text-sm text-muted-foreground">
                {selectedProject?.date}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDetailsDialogOpen(false)}
            >
              Fechar
            </Button>
            {selectedProject?.linkRepositorio && (
              <Button
                onClick={() =>
                  window.open(selectedProject.linkRepositorio, "_blank")
                }
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Visitar Repositório
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Feedbacks */}
      {selectedProjectForFeedback && (
        <FeedbackModal
          open={isFeedbackModalOpen}
          onOpenChange={setIsFeedbackModalOpen}
          projetoId={selectedProjectForFeedback.id}
          projetoTitulo={selectedProjectForFeedback.title}
          avaliacoes={feedbackData.avaliacoes}
          feedbacks={feedbackData.feedbacks}
          isLoading={loadingFeedback}
        />
      )}
    </UserPanelLayout>
  );
};

export default TalentSubmissions;
