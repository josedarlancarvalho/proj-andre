import React from "react";
import UserPanelLayout from "@/components/UserPanelLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatCard from "@/components/panels/StatCard";
import { Star, Calendar, User, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import gestorService, {
  buscarEstatisticasGestor,
  buscarTalentosDestaque,
  buscarNovosTalentos,
} from "@/servicos/gestor";
import {
  buscarEntrevistas,
  cancelarEntrevista,
  excluirEntrevistaLocal,
} from "@/servicos/entrevistas";
import { adicionarFavorito, listarFavoritos } from "@/servicos/favoritos";
import { toast } from "sonner";

// Interfaces
interface RecentTalent {
  id: string;
  name: string;
  age: number;
  city: string;
  medal: "ouro" | "prata" | "bronze" | null;
  project: string;
  tags: string[];
}

interface UpcomingInterview {
  id: string;
  candidate: string;
  date: string;
  time: string;
  type: "online" | "presencial";
}

interface ActivityItem {
  id: string;
  type:
    | "interview_scheduled"
    | "favorited"
    | "viewed_profiles"
    | "interview_accepted"; // Example types
  text: string; // Or ReactNode for more complex rendering
  timeAgo: string;
  iconBadge: React.ReactNode; // For badges like ✓, ★ etc.
}

interface ManagerStats {
  exploredTalents: number;
  favoriteTalents: number;
  scheduledInterviews: number;
  newTalentsInArea: number; // Assuming this stat might not have a specific icon in the mock
}

const ManagerPanel = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [recentTalents, setRecentTalents] = useState<RecentTalent[]>([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState<
    UpcomingInterview[]
  >([]);
  const [activityLog, setActivityLog] = useState<ActivityItem[]>([]);
  const [stats, setStats] = useState<ManagerStats>({
    exploredTalents: 0,
    favoriteTalents: 0,
    scheduledInterviews: 0,
    newTalentsInArea: 0,
  });
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [talentosLoading, setTalentosLoading] = useState(true);
  const [projetosAvaliados, setProjetosAvaliados] = useState([]);
  const [projetosLoading, setProjetosLoading] = useState(true);
  const [novosTalentos, setNovosTalentos] = useState([]);
  const [novosTalentosLoading, setNovosTalentosLoading] = useState(true);

  // Função para formatar entrevistas para exibição
  const formatarEntrevistas = (entrevistasResponse) => {
    // Filtrar apenas entrevistas com status 'agendada'
    const entrevistasAgendadas = entrevistasResponse.filter(
      (entrevista) => entrevista.status === "agendada"
    );

    return entrevistasAgendadas.map((entrevista) => ({
      id: entrevista.id,
      candidate: entrevista.talentoNome || entrevista.candidato || "Candidato",
      date:
        entrevista.data instanceof Date
          ? entrevista.data.toLocaleDateString()
          : new Date(entrevista.data).toLocaleDateString(),
      time: entrevista.hora,
      type: entrevista.tipo,
    }));
  };

  // Função para buscar dados do gestor
  const fetchManagerData = async () => {
    try {
      // Inicializar com os valores padrão para evitar problemas se alguma chamada falhar
      let entrevistasFormatadas = [];
      let totalEntrevistas = 0;
      let totalFavoritos = 0;

      // Buscar favoritos
      try {
        const favoritos = await listarFavoritos();
        totalFavoritos = favoritos.length;
      } catch (erro) {
        console.error("Erro ao buscar favoritos:", erro);
      }

      try {
        // Buscar entrevistas agendadas primeiro
        const entrevistasResponse = await buscarEntrevistas();
        entrevistasFormatadas = formatarEntrevistas(entrevistasResponse);
        setUpcomingInterviews(entrevistasFormatadas);
        totalEntrevistas = entrevistasFormatadas.length;
      } catch (erro) {
        console.error("Erro ao buscar entrevistas:", erro);
        // Se falhou, usar os dados mockados
        const entrevistaMock = {
          id: "1",
          talentoNome: "Maria Silva",
          data: "2024-06-04",
          hora: "10:00",
          tipo: "online",
        };

        const entrevistasFormatadas = formatarEntrevistas([entrevistaMock]);
        setUpcomingInterviews(entrevistasFormatadas);
        totalEntrevistas = 1; // Temos pelo menos a entrevista da Maria Silva
      }

      try {
        // Buscar estatísticas do gestor
        const estatisticasResponse = await buscarEstatisticasGestor();

        setStats({
          exploredTalents: estatisticasResponse.totalTalentosExplorados || 0,
          favoriteTalents:
            totalFavoritos ||
            estatisticasResponse.totalTalentosFavoritados ||
            0,
          scheduledInterviews: totalEntrevistas,
          newTalentsInArea: estatisticasResponse.novosTalentos || 0,
        });
      } catch (erro) {
        console.error("Erro ao buscar estatísticas:", erro);
        // Se falhou, usar os dados que já temos
        setStats({
          exploredTalents: 0,
          favoriteTalents: totalFavoritos,
          scheduledInterviews: totalEntrevistas,
          newTalentsInArea: 0,
        });
      }

      try {
        // Buscar talentos em destaque
        const talentosResponse = await buscarTalentosDestaque();
        const talentosFormatados = talentosResponse.map((talento) => ({
          id: talento.id,
          name: talento.nome,
          age: talento.idade,
          city: talento.cidade,
          medal: talento.medalha || null,
          project: talento.projeto,
          tags: talento.tags || [],
        }));
        setRecentTalents(talentosFormatados);
      } catch (erro) {
        console.error("Erro ao buscar talentos em destaque:", erro);
        setRecentTalents([]);
      }

      try {
        // Buscar projetos avaliados pelo RH
        const projetosResponse = await gestorService.buscarProjetosAvaliados();
        setProjetosAvaliados(projetosResponse.slice(0, 3)); // Mostrar apenas os 3 mais recentes
      } catch (erro) {
        console.error("Erro ao buscar projetos avaliados:", erro);
        setProjetosAvaliados([]);
      }

      try {
        // Buscar novos talentos na área de interesse
        const novosTalentosResponse = await buscarNovosTalentos();
        setNovosTalentos(novosTalentosResponse.slice(0, 3)); // Mostrar apenas os 3 mais recentes
      } catch (erro) {
        console.error("Erro ao buscar novos talentos:", erro);
        setNovosTalentos([]);
      }
    } catch (error) {
      console.error("Erro geral ao buscar dados do gestor:", error);
      toast.error(
        "Não foi possível carregar todos os dados. Tente novamente mais tarde."
      );
    } finally {
      setTalentosLoading(false);
      setProjetosLoading(false);
      setNovosTalentosLoading(false);
    }
  };

  // Carregar dados na montagem inicial do componente
  useEffect(() => {
    fetchManagerData();
  }, []);

  // Atualizar dados quando o usuário voltar para esta página
  useEffect(() => {
    // Atualizar os dados quando o usuário navegar de volta para esta página
    if (location.pathname === "/") {
      fetchManagerData();
    }
  }, [location]);

  // Adicionar listeners para eventos de entrevista e favoritos
  useEffect(() => {
    // Listener para quando uma entrevista é agendada
    const handleEntrevistaAgendada = () => {
      fetchManagerData(); // Atualizar os dados do painel
    };

    // Listener para quando uma entrevista é cancelada
    const handleEntrevistaCancelada = () => {
      fetchManagerData(); // Atualizar os dados do painel
    };

    // Listener para quando um talento é favoritado
    const handleTalentoFavoritado = () => {
      // Atualizar apenas o contador de favoritos sem precisar recarregar tudo
      listarFavoritos()
        .then((favoritos) => {
          setStats((prevStats) => ({
            ...prevStats,
            favoriteTalents: favoritos.length,
          }));
        })
        .catch((err) => {
          console.error("Erro ao contar favoritos:", err);
        });
    };

    // Listener para quando um talento é desfavoritado
    const handleTalentoDesfavoritado = () => {
      // Atualizar apenas o contador de favoritos sem precisar recarregar tudo
      listarFavoritos()
        .then((favoritos) => {
          setStats((prevStats) => ({
            ...prevStats,
            favoriteTalents: favoritos.length,
          }));
        })
        .catch((err) => {
          console.error("Erro ao contar favoritos:", err);
        });
    };

    // Registrar os listeners
    window.addEventListener("entrevistaAgendada", handleEntrevistaAgendada);
    window.addEventListener("entrevistaCancelada", handleEntrevistaCancelada);
    window.addEventListener("talentoFavoritado", handleTalentoFavoritado);
    window.addEventListener("talentoDesfavoritado", handleTalentoDesfavoritado);

    // Cleanup ao desmontar o componente
    return () => {
      window.removeEventListener(
        "entrevistaAgendada",
        handleEntrevistaAgendada
      );
      window.removeEventListener(
        "entrevistaCancelada",
        handleEntrevistaCancelada
      );
      window.removeEventListener("talentoFavoritado", handleTalentoFavoritado);
      window.removeEventListener(
        "talentoDesfavoritado",
        handleTalentoDesfavoritado
      );
    };
  }, []);

  const getMedalBadge = (medal: string | null) => {
    if (medal === "ouro") {
      return <Badge className="bg-yellow-400 text-black">Ouro</Badge>;
    } else if (medal === "prata") {
      return <Badge className="bg-gray-300 text-black">Prata</Badge>;
    } else if (medal === "bronze") {
      return <Badge className="bg-amber-700 text-white">Bronze</Badge>;
    } else {
      return <Badge variant="outline">-</Badge>;
    }
  };

  // Função para formatar a data
  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR");
  };

  return (
    <UserPanelLayout userType="gestor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            Bem-vindo, {user?.nomeCompleto || "Gestor"}!
          </h1>
          <Link to="/gestor/explorar">
            <Button>
              <Search className="mr-2 h-4 w-4" />
              Explorar talentos
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            title="Talentos Explorados"
            value={String(stats.exploredTalents)}
            icon={<User className="h-4 w-4" />}
          />
          <StatCard
            title="Talentos Favoritos"
            value={String(stats.favoriteTalents)}
            icon={<Star className="h-4 w-4" />}
          />
          <StatCard
            title="Entrevistas"
            value={String(stats.scheduledInterviews)}
            description="Agendadas"
            icon={<Calendar className="h-4 w-4" />}
          />
          <StatCard
            title="Novos Talentos"
            value={String(stats.newTalentsInArea)}
            description="Em sua área"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Talentos em Destaque</CardTitle>
              <Link to="/gestor/explorar">
                <Button variant="outline" size="sm">
                  Ver mais
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {talentosLoading ? (
                <div className="text-center py-4">
                  Carregando talentos em destaque...
                </div>
              ) : recentTalents.length > 0 ? (
                <div className="space-y-4">
                  {recentTalents.map((talent) => (
                    <div key={talent.id} className="border rounded-lg p-4">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold">{talent.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {talent.age} anos • {talent.city}
                          </p>
                        </div>
                        <div>{getMedalBadge(talent.medal)}</div>
                      </div>
                      <div className="mt-2">
                        <div className="text-sm">
                          <span className="text-muted-foreground">
                            Projeto:{" "}
                          </span>
                          <span>{talent.project}</span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {talent.tags.map((tag, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            toast.promise(
                              adicionarFavorito({
                                id: talent.id,
                                nome: talent.name,
                              }),
                              {
                                loading: "Adicionando aos favoritos...",
                                success: "Talento adicionado aos favoritos!",
                                error: "Falha ao adicionar aos favoritos",
                              }
                            );
                          }}
                        >
                          <Star className="mr-1 h-3 w-3" />
                          Favoritar
                        </Button>
                        <Link to={`/gestor/explorar?id=${talent.id}`}>
                          <Button variant="default" size="sm">
                            Ver perfil
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Nenhum talento em destaque encontrado. Tente novamente mais
                  tarde.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Novos Talentos</CardTitle>
              <Link to="/gestor/explorar">
                <Button variant="outline" size="sm">
                  Ver todos
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {novosTalentosLoading ? (
                <div className="text-center py-4">
                  Carregando novos talentos...
                </div>
              ) : novosTalentos.length > 0 ? (
                <div className="space-y-4">
                  {novosTalentos.map((talento) => (
                    <div key={talento.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-sm">
                            {talento.nomeCompleto}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {talento.areasInteresse &&
                              talento.areasInteresse.join(", ")}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Novo
                        </Badge>
                      </div>
                      <div className="flex justify-between mt-2">
                        <Link to={`/gestor/explorar?id=${talento.id}`}>
                          <Button
                            variant="default"
                            size="sm"
                            className="text-xs"
                          >
                            Ver perfil
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => {
                            toast.promise(
                              adicionarFavorito({
                                id: talento.id,
                                nomeCompleto: talento.nomeCompleto,
                              }),
                              {
                                loading: "Adicionando aos favoritos...",
                                success: "Adicionado aos favoritos!",
                                error: "Falha ao adicionar",
                              }
                            );
                          }}
                        >
                          <Star className="mr-1 h-3 w-3" />
                          Favoritar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Nenhum novo talento encontrado em sua área.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Entrevistas Próximas</CardTitle>
            <Link to="/gestor/entrevistas">
              <Button variant="outline" size="sm">
                Ver agenda
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {upcomingInterviews.length > 0 ? (
              upcomingInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className="mb-4 p-3 border rounded-md flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium">{interview.candidate}</h3>
                    <p className="text-sm text-muted-foreground">
                      {interview.date} às {interview.time}
                    </p>
                    <Badge variant="outline" className="mt-1">
                      {interview.type === "online"
                        ? "Entrevista Online"
                        : "Entrevista Presencial"}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Primeiro, tentar excluir a entrevista
                        cancelarEntrevista(interview.id)
                          .then(() => {
                            // Após cancelar, atualizar a lista de entrevistas
                            // Remover imediatamente da interface para feedback visual
                            setUpcomingInterviews((prevInterviews) =>
                              prevInterviews.filter(
                                (i) => i.id !== interview.id
                              )
                            );

                            // E também atualizar todos os dados
                            fetchManagerData();

                            // Mostrar mensagem de sucesso
                            toast.success("Entrevista excluída com sucesso!");
                          })
                          .catch((error) => {
                            console.error(
                              "Erro ao cancelar entrevista via API:",
                              error
                            );

                            // Tentar excluir localmente como fallback
                            const sucesso = excluirEntrevistaLocal(
                              interview.id
                            );

                            if (sucesso) {
                              // Se conseguiu excluir localmente, atualizar a lista
                              // Remover imediatamente da interface para feedback visual
                              setUpcomingInterviews((prevInterviews) =>
                                prevInterviews.filter(
                                  (i) => i.id !== interview.id
                                )
                              );

                              // E também atualizar todos os dados
                              fetchManagerData();

                              // Mostrar mensagem de sucesso
                              toast.success("Entrevista excluída com sucesso!");
                            } else {
                              // Se falhou, mostrar erro
                              toast.error("Erro ao excluir entrevista");
                            }
                          });
                      }}
                    >
                      Excluir
                    </Button>
                    <Link
                      to={`/gestor/entrevistas?id=${interview.id}&edit=true`}
                    >
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </Link>
                    <Link to="/gestor/entrevistas">
                      <Button variant="outline" size="sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        Ver detalhes
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">
                Nenhuma entrevista próxima agendada.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            {activityLog.length > 0 ? (
              <div className="space-y-4">
                {activityLog.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-2 text-sm"
                  >
                    <div className="mt-0.5">{activity.iconBadge}</div>
                    <div>
                      <p>{activity.text}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.timeAgo}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Nenhuma atividade recente.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Projetos Avaliados pelo RH</CardTitle>
            <Link to="/gestor/projetos">
              <Button variant="outline" size="sm">
                Explorar Projetos
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {projetosLoading ? (
              <p className="text-center py-4">
                Carregando projetos avaliados...
              </p>
            ) : projetosAvaliados.length > 0 ? (
              <div className="space-y-4">
                {projetosAvaliados.map((projeto) => (
                  <div key={projeto.id} className="border rounded-lg p-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold">{projeto.titulo}</h3>
                        <p className="text-sm text-muted-foreground">
                          por {projeto.usuario?.nomeCompleto || "Jovem Talento"}{" "}
                          • {formatarData(projeto.createdAt)}
                        </p>
                      </div>
                      {projeto.avaliacoes && projeto.avaliacoes.length > 0 && (
                        <div>
                          {getMedalBadge(projeto.avaliacoes[0].medalha)}
                        </div>
                      )}
                    </div>
                    <div className="mt-2">
                      <p className="text-sm line-clamp-2">
                        {projeto.descricao}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {projeto.tecnologias &&
                          projeto.tecnologias.map((tech, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-xs"
                            >
                              {tech}
                            </Badge>
                          ))}
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Link to={`/gestor/projetos?id=${projeto.id}`}>
                        <Button variant="default" size="sm">
                          Ver detalhes
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
                <div className="text-center mt-4">
                  <Link to="/gestor/projetos">
                    <Button variant="outline">
                      Ver todos os projetos avaliados
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-center py-6">
                Nenhum projeto avaliado pelo RH ainda. Acompanhe projetos
                avaliados para adicionar seu feedback.
                <div className="flex justify-center mt-4">
                  <Link to="/gestor/projetos">
                    <Button>Ver Todos os Projetos</Button>
                  </Link>
                </div>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </UserPanelLayout>
  );
};

export default ManagerPanel;
