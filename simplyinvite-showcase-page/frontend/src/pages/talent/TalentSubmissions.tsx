import React, { useState, useEffect } from "react";
import UserPanelLayout from "@/components/UserPanelLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Eye, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ProjectCard from "@/components/panels/ProjectCard";
import { useAuth } from "@/contexts/AuthContext";
import { buscarMeusProjetos, submeterProjeto } from "@/servicos/jovem";
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
import { buscarFeedbackProjeto } from "@/servicos/gestor";
import { FeedbackGestor, Feedback } from "@/servicos/jovem";

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

interface ProjetoFeedback {
  id: number;
  comentario: string;
  nota?: number;
  avaliador?: {
    nome: string;
    tipoUsuario: string;
  };
  medalha?: "ouro" | "prata" | "bronze";
  createdAt: string;
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

  // Adicionar estado para o modal de feedback
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [projetoFeedback, setProjetoFeedback] =
    useState<ProjetoFeedback | null>(null);

  // No estado do componente, adicionar:
  const [feedbackGestor, setFeedbackGestor] = useState<FeedbackGestor | null>(
    null
  );
  const [isFeedbackGestorModalOpen, setIsFeedbackGestorModalOpen] =
    useState(false);

  // No estado do componente, adicionar:
  const [avaliacoesRH, setAvaliacoesRH] = useState<Feedback[]>([]);
  const [isAvaliacoesRHModalOpen, setIsAvaliacoesRHModalOpen] = useState(false);

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
          date: new Date(
            (projeto as any).createdAt || Date.now()
          ).toLocaleDateString(),
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

  // Função para buscar e exibir feedback
  const handleVerFeedback = async (projetoId) => {
    try {
      console.log(
        `Iniciando busca de feedback para o projeto ID: ${projetoId}`
      );
      const feedbacks: ProjetoFeedback[] = await buscarFeedbackProjeto(
        projetoId
      );

      console.log("Feedbacks recebidos:", feedbacks);

      if (!feedbacks || feedbacks.length === 0) {
        toast.warning("Nenhum feedback encontrado para este projeto");
        return;
      }

      // Selecionar o primeiro feedback (pode ser modificado para mostrar todos)
      setProjetoFeedback(feedbacks[0]);
      setFeedbackModal(true);
    } catch (error) {
      console.error("Erro completo ao buscar feedback:", error);
      toast.error(`Não foi possível carregar o feedback: ${error.message}`);
    }
  };

  // Método para buscar feedback do gestor
  const handleVerFeedbackGestor = async (projetoId: string) => {
    try {
      console.log(
        `Buscando feedback do gestor para o projeto ID: ${projetoId}`
      );
      const feedback = await jovemService.buscarFeedbackGestor(
        parseInt(projetoId)
      );

      if (feedback) {
        console.log("Feedback do gestor encontrado:", feedback);
        setFeedbackGestor(feedback);
        setIsFeedbackGestorModalOpen(true);
      } else {
        toast.warning("Nenhum feedback do gestor encontrado para este projeto");
      }
    } catch (error) {
      console.error("Erro ao buscar feedback do gestor:", error);
      toast.error(`Não foi possível carregar o feedback: ${error.message}`);
    }
  };

  // Método para buscar avaliações do RH
  const handleVerAvaliacoesRH = async (projetoId: string) => {
    try {
      console.log(`Buscando avaliações do RH para o projeto ID: ${projetoId}`);
      const avaliacoes = await jovemService.buscarAvaliacoesRH(
        parseInt(projetoId)
      );

      if (avaliacoes && avaliacoes.length > 0) {
        console.log("Avaliações do RH encontradas:", avaliacoes);
        setAvaliacoesRH(avaliacoes);
        setIsAvaliacoesRHModalOpen(true);
      } else {
        toast.warning("Nenhuma avaliação do RH encontrada para este projeto");
      }
    } catch (error) {
      console.error("Erro ao buscar avaliações do RH:", error);
      toast.error(`Não foi possível carregar as avaliações: ${error.message}`);
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
                  >
                    {project.hasFeedback && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerFeedbackGestor(project.id)}
                      >
                        Ver Feedback do Gestor
                      </Button>
                    )}
                    {project.status === "avaliado" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerAvaliacoesRH(project.id)}
                      >
                        Ver Avaliações do RH
                      </Button>
                    )}
                  </ProjectCard>
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
              <Label htmlFor="linkYoutube">Link do YouTube (opcional)</Label>
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

      {/* Adicionar modal de feedback */}
      {feedbackModal && projetoFeedback && (
        <Dialog open={feedbackModal} onOpenChange={setFeedbackModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Feedback do Projeto</DialogTitle>
              {projetoFeedback.avaliador && (
                <DialogDescription>
                  Avaliado por {projetoFeedback.avaliador.nome}
                  {projetoFeedback.avaliador.tipoUsuario &&
                    ` (${projetoFeedback.avaliador.tipoUsuario})`}
                </DialogDescription>
              )}
            </DialogHeader>
            <div className="space-y-4">
              {projetoFeedback.nota && (
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Nota:</span>
                  <Badge variant="secondary">{projetoFeedback.nota}/10</Badge>
                </div>
              )}

              {projetoFeedback.medalha && (
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Medalha:</span>
                  <Badge variant="outline">{projetoFeedback.medalha}</Badge>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-2">Comentário</h4>
                <p className="text-sm text-muted-foreground">
                  {projetoFeedback.comentario}
                </p>
              </div>

              <div className="text-xs text-muted-foreground">
                Recebido em:{" "}
                {new Date(projetoFeedback.createdAt).toLocaleDateString()}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setFeedbackModal(false)}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* No render, adicionar o modal de feedback do gestor */}
      {feedbackGestor && (
        <Dialog
          open={isFeedbackGestorModalOpen}
          onOpenChange={setIsFeedbackGestorModalOpen}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Feedback do Gestor</DialogTitle>
              {feedbackGestor.avaliador && (
                <DialogDescription>
                  Por {feedbackGestor.avaliador.nome}
                  {feedbackGestor.avaliador.cargo &&
                    ` (${feedbackGestor.avaliador.cargo})`}
                </DialogDescription>
              )}
            </DialogHeader>
            <div className="space-y-4">
              {feedbackGestor.nota && (
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Nota:</span>
                  <Badge variant="secondary">{feedbackGestor.nota}/10</Badge>
                </div>
              )}

              {feedbackGestor.oportunidade && (
                <div className="space-y-2">
                  <h4 className="font-medium">Oportunidade</h4>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      {feedbackGestor.oportunidade.tipo}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {feedbackGestor.oportunidade.descricao}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-2">Comentário</h4>
                <p className="text-sm text-muted-foreground">
                  {feedbackGestor.comentario}
                </p>
              </div>

              <div className="text-xs text-muted-foreground">
                Recebido em:{" "}
                {new Date(feedbackGestor.createdAt).toLocaleDateString()}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsFeedbackGestorModalOpen(false)}>
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* No render, adicionar o modal de avaliações do RH */}
      {avaliacoesRH.length > 0 && (
        <Dialog
          open={isAvaliacoesRHModalOpen}
          onOpenChange={setIsAvaliacoesRHModalOpen}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Avaliações do RH</DialogTitle>
              <DialogDescription>
                Comentários e notas da equipe de Recursos Humanos
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {avaliacoesRH.map((avaliacao) => (
                <Card key={avaliacao.id} className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="font-medium">
                        {avaliacao.avaliador.nome}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {avaliacao.avaliador.tipoUsuario}
                      </p>
                    </div>
                    {avaliacao.nota && (
                      <Badge variant="secondary">
                        Nota: {avaliacao.nota}/10
                      </Badge>
                    )}
                  </div>

                  {avaliacao.medalha && (
                    <div className="mb-2">
                      <Badge variant="outline">
                        {avaliacao.medalha.charAt(0).toUpperCase() +
                          avaliacao.medalha.slice(1)}
                      </Badge>
                    </div>
                  )}

                  <p className="text-sm text-muted-foreground">
                    {avaliacao.comentario}
                  </p>

                  <div className="text-xs text-muted-foreground mt-2">
                    Avaliado em:{" "}
                    {new Date(avaliacao.createdAt).toLocaleDateString()}
                  </div>
                </Card>
              ))}
            </div>
            <DialogFooter>
              <Button onClick={() => setIsAvaliacoesRHModalOpen(false)}>
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </UserPanelLayout>
  );
};

export default TalentSubmissions;
