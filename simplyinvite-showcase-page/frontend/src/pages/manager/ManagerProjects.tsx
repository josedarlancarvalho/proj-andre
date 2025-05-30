import React, { useState, useEffect } from "react";
import UserPanelLayout from "@/components/UserPanelLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, MessageSquare, Award, ExternalLink } from "lucide-react";
import ProjectCard from "@/components/panels/ProjectCard";
import { useAuth } from "@/contexts/AuthContext";
import gestorService from "@/servicos/gestor";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// Interface para projetos avaliados
interface ProjetoAvaliado {
  id: string;
  title: string;
  image?: string;
  autor?: string;
  autorId?: number;
  tecnologias?: string[];
  descricao?: string;
  status: string;
  date: string;
  linkRepositorio?: string;
  linkDeploy?: string;
  avaliacoes?: Array<{
    id: number;
    nota: number;
    comentario: string;
    medalha?: "ouro" | "prata" | "bronze";
    avaliador: {
      id: number;
      nomeCompleto: string;
    };
  }>;
  feedbacks?: Array<{
    id: number;
    comentario: string;
    oportunidade?: {
      tipo: "estagio" | "trainee" | "junior";
      descricao: string;
    };
    gestor: {
      id: number;
      nomeCompleto: string;
    };
    createdAt: string;
  }>;
}

const ManagerProjects = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<ProjetoAvaliado[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjetoAvaliado[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("avaliados");

  // Estado para o projeto selecionado e modais
  const [selectedProject, setSelectedProject] =
    useState<ProjetoAvaliado | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const projectsData = await gestorService.buscarProjetosAvaliados();
        console.log("Projetos avaliados:", projectsData);

        // Mapear dados da API para o formato esperado pelo componente
        const mappedProjects = projectsData.map((project) => ({
          id: project.id.toString(),
          title: project.titulo,
          autor: project.usuario?.nomeCompleto || "Jovem",
          autorId: project.usuario?.id,
          image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b", // Placeholder image
          tecnologias: project.tecnologias,
          descricao: project.descricao,
          status: project.status,
          date: new Date(project.createdAt || Date.now()).toLocaleDateString(),
          linkRepositorio: project.linkRepositorio,
          linkDeploy: project.linkDeploy,
          avaliacoes: project.avaliacoes,
          feedbacks: project.feedbacks,
        }));

        setProjects(mappedProjects);
        setFilteredProjects(mappedProjects);
      } catch (error) {
        console.error("Erro ao buscar projetos:", error);
        toast.error("Falha ao carregar projetos. Tente novamente.");
        setProjects([]);
        setFilteredProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filtrar projetos quando a pesquisa mudar
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProjects(projects);
      return;
    }

    const filtered = projects.filter((project) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        project.title.toLowerCase().includes(searchLower) ||
        project.autor?.toLowerCase().includes(searchLower) ||
        project.tecnologias?.some((tech) =>
          tech.toLowerCase().includes(searchLower)
        )
      );
    });

    setFilteredProjects(filtered);
  }, [searchQuery, projects]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // A filtragem é feita no useEffect
  };

  const handleViewDetails = (project: ProjetoAvaliado) => {
    setSelectedProject(project);
    setIsDetailsDialogOpen(true);
  };

  const handleAddFeedback = (project: ProjetoAvaliado) => {
    setSelectedProject(project);
    setFeedback("");
    setIsFeedbackDialogOpen(true);
  };

  const handleSubmitFeedback = async () => {
    if (!selectedProject || !feedback.trim()) {
      toast.error("Por favor, adicione um feedback antes de enviar");
      return;
    }

    setIsSubmittingFeedback(true);

    try {
      await gestorService.enviarFeedback(parseInt(selectedProject.id), {
        comentario: feedback,
      });

      toast.success("Feedback enviado com sucesso!");
      setIsFeedbackDialogOpen(false);

      // Recarregar os projetos para mostrar o feedback adicionado
      const projectsData = await gestorService.buscarProjetosAvaliados();
      const mappedProjects = projectsData.map((project) => ({
        id: project.id.toString(),
        title: project.titulo,
        autor: project.usuario?.nomeCompleto || "Jovem",
        autorId: project.usuario?.id,
        image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
        tecnologias: project.tecnologias,
        descricao: project.descricao,
        status: project.status,
        date: new Date(project.createdAt || Date.now()).toLocaleDateString(),
        linkRepositorio: project.linkRepositorio,
        linkDeploy: project.linkDeploy,
        avaliacoes: project.avaliacoes,
        feedbacks: project.feedbacks,
      }));

      setProjects(mappedProjects);
      setFilteredProjects(mappedProjects);
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
      toast.error("Falha ao enviar feedback. Tente novamente.");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  return (
    <UserPanelLayout userType="gestor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            Projetos Avaliados
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Explorar Projetos</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex flex-wrap gap-4 mb-6">
              <Input
                placeholder="Buscar por título, autor, tecnologia..."
                className="flex-1 min-w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit">
                <Search className="mr-2 h-4 w-4" />
                Buscar
              </Button>
            </form>

            <Tabs
              defaultValue="avaliados"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="mb-4">
                <TabsTrigger value="avaliados">Todos Avaliados</TabsTrigger>
                <TabsTrigger value="feedback">Com Meu Feedback</TabsTrigger>
                <TabsTrigger value="encaminhados">
                  Encaminhados para Mim
                </TabsTrigger>
              </TabsList>

              <TabsContent value="avaliados" className="mt-0">
                {loading ? (
                  <div className="text-center py-10">
                    Carregando projetos...
                  </div>
                ) : (
                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {filteredProjects.length > 0 ? (
                      filteredProjects.map((project) => (
                        <ProjectCard
                          key={project.id}
                          title={project.title}
                          image={project.image || ""}
                          userType="gestor"
                          onViewDetails={() => handleViewDetails(project)}
                          onEvaluate={() => handleAddFeedback(project)}
                          isEvaluated={project.feedbacks?.some(
                            (f) => f.gestor.id === user?.id
                          )}
                        />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-10">
                        Nenhum projeto encontrado. Tente ajustar os filtros de
                        busca.
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="feedback" className="mt-0">
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {filteredProjects.filter((p) =>
                    p.feedbacks?.some((f) => f.gestor.id === user?.id)
                  ).length > 0 ? (
                    filteredProjects
                      .filter((p) =>
                        p.feedbacks?.some((f) => f.gestor.id === user?.id)
                      )
                      .map((project) => (
                        <ProjectCard
                          key={project.id}
                          title={project.title}
                          image={project.image || ""}
                          userType="gestor"
                          onViewDetails={() => handleViewDetails(project)}
                          onEvaluate={() => handleAddFeedback(project)}
                          isEvaluated={true}
                        />
                      ))
                  ) : (
                    <div className="col-span-full text-center py-10">
                      Você ainda não deu feedback em nenhum projeto.
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="encaminhados" className="mt-0">
                <div className="text-center py-10">
                  Funcionalidade em desenvolvimento.
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Diálogo para visualizar detalhes do projeto */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedProject?.title}</DialogTitle>
            <DialogDescription>
              por {selectedProject?.autor} - {selectedProject?.date}
            </DialogDescription>
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

            {/* Avaliações do RH */}
            <div className="space-y-2 mt-4">
              <h4 className="font-medium">Avaliações do RH</h4>
              {selectedProject?.avaliacoes &&
              selectedProject.avaliacoes.length > 0 ? (
                <div className="space-y-3">
                  {selectedProject.avaliacoes.map((avaliacao) => (
                    <Card key={avaliacao.id} className="p-3">
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">
                              {avaliacao.avaliador?.nomeCompleto ||
                                "Avaliador RH"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {avaliacao.medalha && (
                              <Badge
                                className={
                                  avaliacao.medalha === "ouro"
                                    ? "bg-yellow-400 text-yellow-950"
                                    : avaliacao.medalha === "prata"
                                    ? "bg-gray-300 text-gray-950"
                                    : "bg-amber-700 text-white"
                                }
                              >
                                <Award className="h-3 w-3 mr-1" />
                                Medalha{" "}
                                {avaliacao.medalha.charAt(0).toUpperCase() +
                                  avaliacao.medalha.slice(1)}
                              </Badge>
                            )}
                            <Badge variant="outline">
                              Nota: {avaliacao.nota}/10
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm mt-2">{avaliacao.comentario}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">
                  Nenhuma avaliação disponível
                </span>
              )}
            </div>

            {/* Feedbacks dos Gestores */}
            <div className="space-y-2 mt-4">
              <h4 className="font-medium">Feedbacks dos Gestores</h4>
              {selectedProject?.feedbacks &&
              selectedProject.feedbacks.length > 0 ? (
                <div className="space-y-3">
                  {selectedProject.feedbacks.map((feedback) => (
                    <Card key={feedback.id} className="p-3">
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">
                              {feedback.gestor?.nomeCompleto || "Gestor"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(
                                feedback.createdAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm mt-2">{feedback.comentario}</p>
                        {feedback.oportunidade && (
                          <div className="mt-2 p-2 bg-primary/10 rounded-md">
                            <p className="text-xs font-medium">
                              Oportunidade: {feedback.oportunidade.tipo}
                            </p>
                            <p className="text-xs">
                              {feedback.oportunidade.descricao}
                            </p>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">
                  Nenhum feedback dos gestores ainda
                </span>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDetailsDialogOpen(false)}
            >
              Fechar
            </Button>
            <Button
              onClick={() => {
                setIsDetailsDialogOpen(false);
                handleAddFeedback(selectedProject!);
              }}
            >
              Adicionar Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para adicionar feedback */}
      <Dialog
        open={isFeedbackDialogOpen}
        onOpenChange={setIsFeedbackDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Feedback</DialogTitle>
            <DialogDescription>
              Dê seu feedback para o projeto "{selectedProject?.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="feedback">Seu Feedback</Label>
              <Textarea
                id="feedback"
                placeholder="Compartilhe suas impressões sobre este projeto..."
                rows={5}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsFeedbackDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmitFeedback}
              disabled={isSubmittingFeedback || !feedback.trim()}
            >
              {isSubmittingFeedback ? "Enviando..." : "Enviar Feedback"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </UserPanelLayout>
  );
};

export default ManagerProjects;
