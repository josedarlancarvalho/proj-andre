import React, { useState, useEffect } from "react";
import UserPanelLayout from "@/components/UserPanelLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Eye, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ProjectCard from "@/components/panels/ProjectCard";
import { useAuth } from "@/contexts/AuthContext";
import {
  buscarMeusProjetos,
  submeterProjeto,
} from "@/servicos/jovem";
import jovemService from "@/servicos/jovem";
import { mapAuthToComponentType } from "@/utils/profileTypeMapper";
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
  linkYoutube?: string;
}

interface ProjetoDetalhe {
  id: number;
  titulo: string;
  descricao: string;
  tecnologias: string[];
  linkRepositorio?: string;
  linkYoutube?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const TalentSubmissions = () => {
  const { user, profileType } = useAuth();
  const componentUserType = profileType
    ? mapAuthToComponentType(profileType)
    : "talent";
  const [projects, setProjects] = useState<SubmissionProject[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmissionDialogOpen, setIsSubmissionDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] =
    useState<SubmissionProject | null>(null);
  const [newProject, setNewProject] = useState({
    titulo: "",
    descricao: "",
    tecnologias: "",
    linkRepositorio: "",
    linkYoutube: "",
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
      const projetosData = await jovemService.buscarMeusProjetos();
      console.log("Projetos recarregados:", projetosData);

      if (projetosData && Array.isArray(projetosData)) {
        const projetosMapeados = projetosData.map((projeto) => ({
          id: projeto.id.toString(),
          title: projeto.titulo,
          image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
          medalType: (projeto as any).avaliacao?.medalha || null,
          hasFeedback: (projeto as any).feedback ? true : false,
          status: projeto.status,
          date: new Date((projeto as any).createdAt || Date.now()).toLocaleDateString(),
          tecnologias: projeto.tecnologias,
          descricao: projeto.descricao,
          linkRepositorio: projeto.linkRepositorio,
          linkYoutube: projeto.linkYoutube,
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
        const projetosData = await jovemService.buscarMeusProjetos();
        console.log("Projetos carregados:", projetosData);

        if (projetosData && Array.isArray(projetosData)) {
          // Mapear projetos para o formato esperado
          const projetosMapeados = projetosData.map((projeto) => ({
            id: projeto.id.toString(),
            title: projeto.titulo,
            image:
              "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b", // Imagem temporária
            medalType: (projeto as any).avaliacao?.medalha || null,
            hasFeedback: (projeto as any).feedback ? true : false,
            status: projeto.status,
            date: new Date(
              (projeto as any).createdAt || Date.now() // Acessar createdAt via any temporariamente
            ).toLocaleDateString(),
            tecnologias: projeto.tecnologias,
            descricao: projeto.descricao,
            linkRepositorio: projeto.linkRepositorio,
            linkYoutube: projeto.linkYoutube,
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
      console.log("Dados do projeto selecionado:", projeto);
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

  const handleUploadProject = () => {
    setIsSubmissionDialogOpen(true);
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

  const handleProjectSubmit = async () => {
    try {
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

      // Enviar projeto para a API com tratamento de erros detalhado
      try {
        const response = await submeterProjeto({
          titulo: newProject.titulo,
          descricao: newProject.descricao,
          tecnologias: tecnologiasArray,
          linkRepositorio: newProject.linkRepositorio || undefined,
          linkYoutube: newProject.linkYoutube || undefined,
        });

        toast.success("Projeto enviado com sucesso!");

        // Limpar formulário e fechar diálogo
        setNewProject({
          titulo: "",
          descricao: "",
          tecnologias: "",
          linkRepositorio: "",
          linkYoutube: "",
        });
        setIsSubmissionDialogOpen(false);

        // Recarregar a lista de projetos
        await recarregarProjetos();
      } catch (apiError: any) {
        console.error("Erro detalhado na API:", apiError);

        // Tratamento de erros específicos da API
        if (apiError.response) {
          const errorDetails = apiError.response.data;
          if (errorDetails.errors && Array.isArray(errorDetails.errors)) {
            const errorMessages = errorDetails.errors
              .map((err: any) => err.message)
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

  return (
    <UserPanelLayout userType="jovem">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Meus Envios</h1>
        </div>

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
              <Label htmlFor="linkYoutube">
                Link do YouTube (opcional)
              </Label>
              <Input
                id="linkYoutube"
                name="linkYoutube"
                value={newProject.linkYoutube}
                onChange={handleInputChange}
                placeholder="Ex: https://youtube.com/watch?v=..."
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

            {selectedProject?.linkYoutube && (
              <div className="space-y-2">
                <h4 className="font-medium">Link do YouTube</h4>
                <a
                  href={selectedProject.linkYoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline flex items-center"
                >
                  {selectedProject.linkYoutube}
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
