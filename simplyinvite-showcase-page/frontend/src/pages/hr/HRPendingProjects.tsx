import React from "react";
import UserPanelLayout from "@/components/UserPanelLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Check,
  MessageSquare,
  User,
  ExternalLink,
  Eye,
  Star,
  Award,
  ChevronRight,
  X,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import rhService from "@/servicos/rh";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import ProjectCard from "@/components/panels/ProjectCard";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

// Interface for pending projects on this specific page
interface HRPendingProjectDetail {
  id: string;
  title: string;
  author?: string;
  authorId?: number;
  age?: number;
  city?: string;
  image?: string;
  category?: string;
  date: string;
  descricao?: string;
  tecnologias?: string[];
  linkRepositorio?: string;
  linkYoutube?: string;
}

interface ProjetoAvaliacao {
  nota: number;
  comentario: string;
  medalha?: "ouro" | "prata" | "bronze";
  encaminhadoParaGestor: boolean;
}

const HRPendingProjects = () => {
  const { user } = useAuth();
  const [pendingProjectsList, setPendingProjectsList] = useState<
    HRPendingProjectDetail[]
  >([]);
  const [userName, setUserName] = useState("Carregando...");
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] =
    useState<HRPendingProjectDetail | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isEvaluationDialogOpen, setIsEvaluationDialogOpen] = useState(false);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [quickFeedback, setQuickFeedback] = useState("");
  const [projectsWithFeedback, setProjectsWithFeedback] = useState<string[]>(
    []
  );
  const [avaliacao, setAvaliacao] = useState<ProjetoAvaliacao>({
    nota: 7,
    comentario: "",
    medalha: undefined,
    encaminhadoParaGestor: false,
  });
  const [isSubmittingEvaluation, setIsSubmittingEvaluation] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  // Add state for search query and filters if implementing search/filter logic
  const [searchQuery, setSearchQuery] = useState("");
  // const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Adicionar um novo estado para o diálogo de confirmação de exclusão
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Set user name from auth context
    if (user) {
      setUserName(user.nomeCompleto || "Usuário");
    }

    const fetchPendingProjects = async () => {
      setLoading(true);
      try {
        const projectsData = await rhService.buscarProjetosPendentes();
        console.log("Projetos na vitrine:", projectsData);

        // Map API data to our component's expected format
        const mappedProjects = projectsData.map((project) => ({
          id: project.id.toString(),
          title: project.titulo,
          author: project.usuario?.nomeCompleto || "Jovem",
          authorId: project.usuario?.id,
          image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b", // Placeholder image
          category: project.tecnologias?.[0] || "Tecnologia",
          date: new Date(project.createdAt || Date.now()).toLocaleDateString(),
          descricao: project.descricao,
          tecnologias: project.tecnologias,
          linkRepositorio: project.linkRepositorio,
          linkYoutube: project.linkYoutube,
          city: project.usuario?.cidade || "",
        }));

        setPendingProjectsList(mappedProjects);
      } catch (error) {
        console.error("Erro ao buscar projetos:", error);
        toast.error("Falha ao carregar projetos. Tente novamente.");
        setPendingProjectsList([]); // Initialize with empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchPendingProjects();
  }, [user]);

  // Handlers
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter projects based on search query
    // This is client-side filtering. For larger datasets, consider API filtering
    console.log("Searching for:", searchQuery);
  };

  const handleEvaluate = (project: HRPendingProjectDetail) => {
    setSelectedProject(project);
    setAvaliacao({
      nota: 7,
      comentario: "",
      medalha: undefined,
      encaminhadoParaGestor: false,
    });
    setIsEvaluationDialogOpen(true);
  };

  const handleViewDetails = (project: HRPendingProjectDetail) => {
    setSelectedProject(project);
    setIsDetailsDialogOpen(true);
  };

  const handleSendFeedback = (id: string) => {
    console.log("Send feedback", id);
  };

  const handleForwardToManager = (id: string) => {
    console.log("Forward to manager", id);
  };

  const handleAvaliacaoChange = (
    field: keyof ProjetoAvaliacao,
    value: string | number | boolean
  ) => {
    setAvaliacao((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitAvaliacao = async () => {
    if (!selectedProject) return;

    // Validar campos obrigatórios
    if (!avaliacao.comentario) {
      toast.error("Por favor, adicione um comentário para a avaliação");
      return;
    }

    setIsSubmittingEvaluation(true);

    try {
      const response = await rhService.avaliarProjeto(
        parseInt(selectedProject.id),
        {
          nota: avaliacao.nota,
          comentario: avaliacao.comentario,
          medalha: avaliacao.medalha,
          encaminhadoParaGestor: avaliacao.encaminhadoParaGestor,
        }
      );

      toast.success("Projeto avaliado com sucesso!");
      setIsEvaluationDialogOpen(false);

      // Atualizar a lista de projetos
      const updatedProjects = pendingProjectsList.filter(
        (p) => p.id !== selectedProject.id
      );
      setPendingProjectsList(updatedProjects);
    } catch (error) {
      console.error("Erro ao avaliar projeto:", error);
      toast.error("Falha ao enviar avaliação. Tente novamente.");
    } finally {
      setIsSubmittingEvaluation(false);
    }
  };

  const handleQuickFeedback = (project: HRPendingProjectDetail) => {
    console.log("handleQuickFeedback chamado com projeto:", project);
    setSelectedProject(project);
    setQuickFeedback("");
    setIsFeedbackDialogOpen(true);
    console.log("isFeedbackDialogOpen definido como true");
  };

  const handleSubmitFeedback = async () => {
    console.log(
      "handleSubmitFeedback chamado. selectedProject:",
      selectedProject,
      "quickFeedback:",
      quickFeedback
    );
    if (!selectedProject || !quickFeedback.trim()) {
      toast.error("Por favor, adicione um feedback antes de enviar");
      return;
    }

    setIsSubmittingFeedback(true);

    try {
      console.log("Enviando feedback para o backend...");
      await rhService.salvarFeedbackUsuario(
        parseInt(selectedProject.id),
        quickFeedback
      );

      toast.success("Feedback enviado com sucesso!");
      setIsFeedbackDialogOpen(false);

      // Marcar o projeto como avaliado na interface
      setProjectsWithFeedback((prev) => [...prev, selectedProject.id]);
      console.log("Projeto marcado como avaliado:", selectedProject.id);
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
      toast.error("Falha ao enviar feedback. Tente novamente.");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // Adicionar handler para excluir projeto
  const handleDeleteProject = (projectId: string) => {
    setProjectToDelete(projectId);
    setIsDeleteDialogOpen(true);
  };

  // Adicionar handler para confirmar exclusão
  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;

    setIsDeleting(true);
    try {
      await rhService.excluirProjeto(parseInt(projectToDelete));
      toast.success("Projeto excluído com sucesso");

      // Atualizar a lista de projetos
      setPendingProjectsList((prevList) =>
        prevList.filter((project) => project.id !== projectToDelete)
      );

      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Erro ao excluir projeto:", error);
      toast.error("Erro ao excluir projeto. Tente novamente.");
    } finally {
      setIsDeleting(false);
      setProjectToDelete(null);
    }
  };

  return (
    <UserPanelLayout userType="rh">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            Vitrine de Projetos
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Explorar Projetos</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
              <Input
                placeholder="Buscar por título, tecnologia..."
                className="flex-1 min-w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  Tecnologia
                </Button>
                <Button variant="outline" size="sm">
                  Design
                </Button>
                <Button variant="outline" size="sm">
                  Impacto Social
                </Button>
                <Button variant="outline" size="sm">
                  Mais Recentes
                </Button>
              </div>
              <Button type="submit">
                <Search className="mr-2 h-4 w-4" />
                Buscar
              </Button>
            </form>
          </CardContent>
        </Card>

        {loading ? (
          <div className="text-center py-10">Carregando projetos...</div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {pendingProjectsList.length > 0 ? (
              pendingProjectsList.map((project) => (
                <div key={project.id} className="col-span-1">
                  <ProjectCard
                    title={project.title}
                    image={project.image || ""}
                    userType="hr"
                    onViewDetails={() => handleViewDetails(project)}
                    onEvaluate={() => handleQuickFeedback(project)}
                    isEvaluated={projectsWithFeedback.includes(project.id)}
                    onDelete={() => handleDeleteProject(project.id)}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                Nenhum projeto encontrado. Tente ajustar os filtros de busca.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Diálogo para visualizar detalhes do projeto */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>{selectedProject?.title}</DialogTitle>
            <DialogDescription>
              por {selectedProject?.author} - {selectedProject?.date}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
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
            </div>
          </ScrollArea>
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
                setIsEvaluationDialogOpen(true);
              }}
            >
              Avaliar Projeto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para avaliar projeto */}
      <Dialog
        open={isEvaluationDialogOpen}
        onOpenChange={setIsEvaluationDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Avaliar Projeto</DialogTitle>
            <DialogDescription>
              Avalie o projeto "{selectedProject?.title}" de{" "}
              {selectedProject?.author}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nota">Nota (1-10)</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="nota"
                    type="number"
                    min="1"
                    max="10"
                    value={avaliacao.nota}
                    onChange={(e) =>
                      handleAvaliacaoChange(
                        "nota",
                        Math.min(10, Math.max(1, Number(e.target.value)))
                      )
                    }
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">/10</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Medalha (opcional)</Label>
                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant={
                      avaliacao.medalha === "ouro" ? "default" : "outline"
                    }
                    className={
                      avaliacao.medalha === "ouro"
                        ? "bg-yellow-400 text-yellow-950 hover:bg-yellow-500"
                        : "border-yellow-400 text-yellow-600 hover:bg-yellow-50"
                    }
                    onClick={() =>
                      handleAvaliacaoChange(
                        "medalha",
                        avaliacao.medalha === "ouro" ? null : "ouro"
                      )
                    }
                  >
                    <Award className="mr-2 h-4 w-4" />
                    Ouro
                  </Button>
                  <Button
                    type="button"
                    variant={
                      avaliacao.medalha === "prata" ? "default" : "outline"
                    }
                    className={
                      avaliacao.medalha === "prata"
                        ? "bg-gray-300 text-gray-950 hover:bg-gray-400"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50"
                    }
                    onClick={() =>
                      handleAvaliacaoChange(
                        "medalha",
                        avaliacao.medalha === "prata" ? null : "prata"
                      )
                    }
                  >
                    <Award className="mr-2 h-4 w-4" />
                    Prata
                  </Button>
                  <Button
                    type="button"
                    variant={
                      avaliacao.medalha === "bronze" ? "default" : "outline"
                    }
                    className={
                      avaliacao.medalha === "bronze"
                        ? "bg-amber-700 text-white hover:bg-amber-800"
                        : "border-amber-700 text-amber-700 hover:bg-amber-50"
                    }
                    onClick={() =>
                      handleAvaliacaoChange(
                        "medalha",
                        avaliacao.medalha === "bronze" ? null : "bronze"
                      )
                    }
                  >
                    <Award className="mr-2 h-4 w-4" />
                    Bronze
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comentario">Comentário</Label>
                <Textarea
                  id="comentario"
                  placeholder="Compartilhe sua avaliação sobre este projeto..."
                  rows={5}
                  value={avaliacao.comentario}
                  onChange={(e) =>
                    handleAvaliacaoChange("comentario", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destacar">Destacar Projeto</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="destacar"
                    checked={avaliacao.encaminhadoParaGestor}
                    onCheckedChange={(checked) =>
                      handleAvaliacaoChange("encaminhadoParaGestor", !!checked)
                    }
                  />
                  <Label
                    htmlFor="destacar"
                    className="text-sm font-normal leading-none"
                  >
                    Destacar este projeto para gestores
                  </Label>
                </div>
                {avaliacao.encaminhadoParaGestor && (
                  <p className="text-xs text-muted-foreground">
                    Projetos destacados aparecem no topo da lista para gestores.
                  </p>
                )}
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEvaluationDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmitAvaliacao}
              disabled={isSubmittingEvaluation}
            >
              {isSubmittingEvaluation ? "Enviando..." : "Enviar Avaliação"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Implementação alternativa de modal de feedback */}
      {isFeedbackDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsFeedbackDialogOpen(false)}
          ></div>
          <div className="bg-white p-6 rounded-lg w-full max-w-md mx-auto z-50 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setIsFeedbackDialogOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-4">
              <h2 className="text-lg font-semibold">Avaliar Projeto</h2>
              <p className="text-sm text-gray-500">
                Deixe seu feedback para o projeto "{selectedProject?.title}".
              </p>
            </div>

            <div className="mb-4">
              <Label htmlFor="feedback-alt">Seu feedback</Label>
              <Textarea
                id="feedback-alt"
                placeholder="Deixe suas impressões sobre o projeto..."
                value={quickFeedback}
                onChange={(e) => setQuickFeedback(e.target.value)}
                rows={5}
                className="mt-1 w-full"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsFeedbackDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmitFeedback}
                disabled={isSubmittingFeedback || !quickFeedback.trim()}
              >
                {isSubmittingFeedback ? "Enviando..." : "Enviar Feedback"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Adicionar o diálogo de confirmação de exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmação de Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este projeto? Esta ação não pode
              ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Excluindo..." : "Excluir Projeto"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </UserPanelLayout>
  );
};

export default HRPendingProjects;
