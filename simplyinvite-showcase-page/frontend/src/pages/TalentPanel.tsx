import React, { useState, useEffect, useRef } from "react"; // adicionei useRef
import UserPanelLayout from "@/components/UserPanelLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProfileSummary from "@/components/panels/ProfileSummary";
import ProjectCard from "@/components/panels/ProjectCard";
import VideoPlayer from "@/components/panels/VideoPlayer";
import FeedbackList from "@/components/panels/FeedbackList";
import StatCard from "@/components/panels/StatCard";
import { Plus, FileVideo, Medal, Eye, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext"; // Importar o contexto de autenticação
import { getMeuPerfil } from "@/servicos/usuario"; // Importar o serviço para obter dados do perfil
import { buscarMeusProjetos, buscarFeedbacks } from "@/servicos/jovem"; // Importar serviços do jovem
import { buscarEntrevistasJovem } from "@/servicos/entrevistas"; // Importar serviço de entrevistas
import VideoRecorder from "@/components/VideoRecorder";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  // Adicionar campos para feedbacks do RH
  nota?: number;
  medalha?: "ouro" | "prata" | "bronze";
  // Adicionar campos para feedbacks do Gestor
  oportunidade?: {
    tipo: "estagio" | "trainee" | "junior";
    descricao: string;
  };
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

interface Entrevista {
  id: string;
  gestorNome: string;
  data: string;
  hora: string;
  tipo: "online" | "presencial";
  link?: string;
  local?: string;
  observacoes?: string;
  status: "agendada" | "cancelada" | "realizada";
  empresa?: string;
}

const TalentPanel = () => {
  const { user } = useAuth(); // Usar o hook de autenticação para obter o usuário logado
  const [projects, setProjects] = useState<Project[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [entrevistas, setEntrevistas] = useState<Entrevista[]>([]);
  const [profileStats, setProfileStats] = useState<ProfileStats>({
    projectsSent: 0,
    feedbacksReceived: 0,
  });
  const [userProfile, setUserProfile] = useState<{
    name: string;
    tags: string[];
  }>({
    name: "",
    tags: [],
  });
  const [videoDetails, setVideoDetails] = useState<VideoDetails>({
    title: "Seu Vídeo de Apresentação",
    videoUrl: "",
  });

  // NOVO: Estado para ativar a webcam
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Atualizar o userProfile imediatamente quando o user do contexto mudar
  useEffect(() => {
    if (user) {
      console.log("TalentPanel - Usuário autenticado:", user);
      // Forçar a atualização do perfil com os dados do usuário autenticado
      setUserProfile({
        name: user.nomeCompleto || "Usuário",
        tags: user.areasInteresse || [],
      });

      // Log para depuração
      console.log("TalentPanel - userProfile atualizado:", {
        name: user.nomeCompleto || "Usuário",
        tags: user.areasInteresse || [],
      });
    }
  }, [user]);

  useEffect(() => {
    // Carregar dados reais do usuário
    const fetchData = async () => {
      try {
        console.log("Iniciando carregamento de dados para o painel");

        // Usar diretamente os dados do usuário autenticado para o nome e tags básicas
        // para evitar inconsistências se a API retornar dados diferentes

        // Obter projetos do usuário
        try {
          const projetosData = await buscarMeusProjetos();
          console.log("Projetos carregados:", projetosData);

          // Mapear projetos para o formato esperado
          const projetosMapeados = projetosData.map((projeto) => ({
            id: projeto.id.toString(),
            title: projeto.titulo,
            image:
              "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b", // Imagem temporária
            medalType: projeto.avaliacao?.medalha || null,
            hasFeedback: projeto.feedback ? true : false,
          }));
          setProjects(projetosMapeados);

          // Atualizar estatísticas parcialmente
          setProfileStats((prev) => ({
            ...prev,
            projectsSent: projetosData.length,
          }));
        } catch (projetosError) {
          console.error("Erro ao carregar projetos:", projetosError);
        }

        // Obter feedbacks - em uma chamada separada para não bloquear tudo se uma falhar
        try {
          const feedbacksData = await buscarFeedbacks();
          console.log("Feedbacks carregados:", feedbacksData);

          // Mapear feedbacks para o formato esperado
          const feedbacksMapeados = feedbacksData.map((feedback) => ({
            id: feedback.id.toString(),
            from: feedback.gestor?.nomeCompleto || "Avaliador",
            date: new Date(feedback.createdAt).toLocaleDateString(),
            text: feedback.comentario,
            category: "Feedback",
            isNew: false,
            // Adicionar campos para feedbacks do RH
            nota: feedback.nota,
            medalha: feedback.medalha,
            // Adicionar campos para feedbacks do Gestor
            oportunidade: feedback.oportunidade,
          }));
          setFeedbacks(feedbacksMapeados);

          // Atualizar estatísticas parcialmente
          setProfileStats((prev) => ({
            ...prev,
            feedbacksReceived: feedbacksData.length,
          }));
        } catch (feedbacksError) {
          console.error("Erro ao carregar feedbacks:", feedbacksError);
        }

        // Obter entrevistas do jovem
        try {
          const entrevistasData = await buscarEntrevistasJovem(user?.id);
          console.log("Entrevistas carregadas:", entrevistasData);
          // Filtrar apenas entrevistas agendadas (não canceladas)
          const entrevistasAgendadas = entrevistasData.filter(
            (entrevista) => entrevista.status === "agendada"
          );
          setEntrevistas(entrevistasAgendadas);
        } catch (entrevistasError) {
          console.error("Erro ao carregar entrevistas:", entrevistasError);
        }
      } catch (error) {
        console.error("Erro geral ao carregar dados do usuário:", error);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  // Adicionar listeners para eventos de entrevista
  useEffect(() => {
    // Função para atualizar entrevistas quando uma nova for agendada
    const handleEntrevistaAgendada = (event) => {
      console.log("Evento de entrevista agendada recebido:", event.detail);
      // Buscar entrevistas novamente
      if (user) {
        buscarEntrevistasJovem(user.id)
          .then((entrevistasData) => {
            // Filtrar apenas entrevistas agendadas (não canceladas)
            const entrevistasAgendadas = entrevistasData.filter(
              (entrevista) => entrevista.status === "agendada"
            );
            setEntrevistas(entrevistasAgendadas);
            toast.success("Nova entrevista agendada!");
          })
          .catch((error) => {
            console.error("Erro ao atualizar entrevistas:", error);
          });
      }
    };

    // Função para atualizar entrevistas quando uma for atualizada
    const handleEntrevistaAtualizada = (event) => {
      console.log("Evento de entrevista atualizada recebido:", event.detail);
      // Buscar entrevistas novamente
      if (user) {
        buscarEntrevistasJovem(user.id)
          .then((entrevistasData) => {
            // Filtrar apenas entrevistas agendadas (não canceladas)
            const entrevistasAgendadas = entrevistasData.filter(
              (entrevista) => entrevista.status === "agendada"
            );
            setEntrevistas(entrevistasAgendadas);
            toast.success("Detalhes da entrevista foram atualizados!");
          })
          .catch((error) => {
            console.error("Erro ao atualizar entrevistas:", error);
          });
      }
    };

    // Função para atualizar entrevistas quando uma for cancelada
    const handleEntrevistaCancelada = (event) => {
      console.log("Evento de entrevista cancelada recebido:", event.detail);
      // Remover a entrevista cancelada da lista
      const entrevistaId = event.detail.entrevistaId;
      setEntrevistas((prevEntrevistas) =>
        prevEntrevistas.filter((entrevista) => entrevista.id !== entrevistaId)
      );
      toast.info("Uma entrevista foi cancelada");
    };

    // Registrar os listeners
    window.addEventListener("entrevistaAgendada", handleEntrevistaAgendada);
    window.addEventListener("entrevistaAtualizada", handleEntrevistaAtualizada);
    window.addEventListener("entrevistaCancelada", handleEntrevistaCancelada);

    // Cleanup ao desmontar o componente
    return () => {
      window.removeEventListener(
        "entrevistaAgendada",
        handleEntrevistaAgendada
      );
      window.removeEventListener(
        "entrevistaAtualizada",
        handleEntrevistaAtualizada
      );
      window.removeEventListener(
        "entrevistaCancelada",
        handleEntrevistaCancelada
      );
    };
  }, [user]);

  const handleRecordVideo = () => {
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

      // Aqui você implementaria o envio para o servidor
      // const response = await fetch('/api/jovem/video', {
      //   method: 'POST',
      //   body: formData
      // });

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

  // Função para formatar data
  const formatarData = (dataString: string) => {
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString("pt-BR");
    } catch (error) {
      return dataString;
    }
  };

  return (
    <UserPanelLayout userType="jovem">
      <div className="space-y-6">
        {/* Saudação personalizada - Usar diretamente o nome do usuário do contexto de autenticação */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            Bem-vindo(a), {user?.nomeCompleto || ""}!
          </h1>
          <Link to="/jovem/submissoes">
            <Button onClick={() => console.log("New project")}>
              <Plus className="mr-2 h-4 w-4" />
              Enviar novo projeto
            </Button>
          </Link>
        </div>

        {/* Resumo do perfil dinâmico - Usar diretamente o usuário do contexto */}
        <ProfileSummary
          name=""
          stats={[
            { label: "Projetos enviados", value: profileStats.projectsSent },
            {
              label: "Feedbacks recebidos",
              value: profileStats.feedbacksReceived,
            },
          ]}
          tags={user?.areasInteresse || []}
          useContextName={true}
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
            title="Entrevistas"
            value={String(entrevistas.length)}
            description="Entrevistas agendadas"
            icon={<Calendar className="h-4 w-4" />}
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

        {/* Entrevistas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Entrevistas Agendadas</CardTitle>
          </CardHeader>
          <CardContent>
            {entrevistas.length > 0 ? (
              entrevistas.map((entrevista) => (
                <div
                  key={entrevista.id}
                  className="mb-4 p-3 border rounded-lg flex flex-col"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">
                        Entrevista com {entrevista.gestorNome}
                      </h3>
                      {entrevista.empresa && (
                        <p className="text-sm text-muted-foreground">
                          Empresa: {entrevista.empresa}
                        </p>
                      )}
                    </div>
                    <Badge className="bg-blue-500 text-white">
                      {formatarData(entrevista.data)}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="outline" className="font-medium">
                      Horário: {entrevista.hora}
                    </Badge>
                    <Badge variant="outline">
                      {entrevista.tipo === "online"
                        ? "Entrevista Online"
                        : "Entrevista Presencial"}
                    </Badge>
                    {entrevista.tipo === "presencial" && entrevista.local && (
                      <Badge variant="outline">Local: {entrevista.local}</Badge>
                    )}
                  </div>

                  {entrevista.observacoes && (
                    <div className="mt-2 p-3 bg-muted rounded-md">
                      <h4 className="font-medium mb-1">Observações:</h4>
                      <p className="text-sm italic">
                        "{entrevista.observacoes}"
                      </p>
                    </div>
                  )}

                  <div className="mt-3 flex justify-end">
                    {entrevista.tipo === "online" && entrevista.link && (
                      <Button variant="default" size="sm" asChild>
                        <a
                          href={entrevista.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          Participar da Reunião
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">
                Nenhuma entrevista agendada no momento.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Feedbacks */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Feedbacks Recebidos</h2>
          </div>
          {feedbacks.length > 0 ? (
            <FeedbackList feedbacks={feedbacks} />
          ) : (
            <p>Nenhum feedback recebido ainda.</p>
          )}
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
