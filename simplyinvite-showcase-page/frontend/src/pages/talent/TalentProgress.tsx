import React, { useState, useEffect } from "react";
import UserPanelLayout from "@/components/UserPanelLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/panels/StatCard";
import { Clock, Eye, Calendar, Medal } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
<<<<<<< HEAD
import jovemService from "@/servicos/jovem";
=======
import {
  buscarMeusProjetos,
  buscarFeedbacks,
  buscarConvites,
} from "@/servicos/jovem";
>>>>>>> origin/producao1

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string; // formato ISO
  formattedDate: string; // formato de exibição
}

const TalentProgress = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    visualizacoes: 0,
    projetos: 0,
    medalhas: 0,
    convites: 0,
  });
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        setLoading(true);

        // Carregar dados do usuário apenas se ele existir
        if (user) {
          // Criar o evento de cadastro - este é o único evento garantido para todos os usuários
          const cadastroEvent: TimelineEvent = {
            id: "cadastro",
            title: "Cadastro na Plataforma",
            description:
              "Bem-vindo(a) ao SimplyInvite! Sua jornada começa aqui.",
            date: user.createdAt || new Date().toISOString(),
            formattedDate: formatDate(
              user.createdAt || new Date().toISOString()
            ),
          };

          // Inicializar a linha do tempo apenas com o evento de cadastro
          const events: TimelineEvent[] = [cadastroEvent];

          // Buscar projetos, feedbacks e convites
          try {
<<<<<<< HEAD
            const projetos = await jovemService.buscarMeusProjetos();
=======
            const projetos = await buscarMeusProjetos();
>>>>>>> origin/producao1
            const totalProjetos = projetos?.length || 0;

            // Adicionar evento para o primeiro projeto, se existir
            if (totalProjetos > 0) {
              const primeiroProjeto = projetos[0];
              events.push({
                id: `projeto-${primeiroProjeto.id}`,
                title: "Primeiro Projeto Enviado",
                description: `Seu primeiro projeto "${primeiroProjeto.titulo}" foi enviado para avaliação.`,
                date: primeiroProjeto.createdAt || new Date().toISOString(),
                formattedDate: formatDate(
                  primeiroProjeto.createdAt || new Date().toISOString()
                ),
              });
            }

            // Contabilizar medalhas
            let totalMedalhas = 0;
            let medalhaRecebida = null;

            for (const projeto of projetos || []) {
              if (projeto.avaliacao?.medalha) {
                totalMedalhas++;

                // Salvar a primeira medalha para adicionar ao timeline
                if (!medalhaRecebida) {
                  medalhaRecebida = {
                    projeto: projeto,
                    medalha: projeto.avaliacao.medalha,
                  };
                }
              }
            }

            // Adicionar evento de medalha ao timeline, se existir
            if (medalhaRecebida) {
              const nomeMedalha =
                medalhaRecebida.medalha.charAt(0).toUpperCase() +
                medalhaRecebida.medalha.slice(1);
              events.push({
                id: `medalha-${medalhaRecebida.projeto.id}`,
                title: `Medalha de ${nomeMedalha} Recebida`,
                description: `Seu projeto "${medalhaRecebida.projeto.titulo}" foi reconhecido com medalha de ${medalhaRecebida.medalha}!`,
                date:
                  medalhaRecebida.projeto.avaliacao?.dataAvaliacao ||
                  new Date().toISOString(),
                formattedDate: formatDate(
                  medalhaRecebida.projeto.avaliacao?.dataAvaliacao ||
                    new Date().toISOString()
                ),
              });
            }

            // Buscar convites
<<<<<<< HEAD
            const convites = await jovemService.buscarConvites();
=======
            const convites = await buscarConvites();
>>>>>>> origin/producao1
            const totalConvites = convites?.length || 0;

            // Atualizar estatísticas
            setStats({
              visualizacoes: Math.floor(Math.random() * 5) * totalProjetos, // Valor aleatório baseado no número de projetos
              projetos: totalProjetos,
              medalhas: totalMedalhas,
              convites: totalConvites,
            });

            // Ordenar eventos por data (mais recentes primeiro)
            events.sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );

            setTimelineEvents(events);
          } catch (error) {
            console.error("Erro ao buscar dados de progresso:", error);
            // Em caso de erro, manter apenas o evento de cadastro
            setTimelineEvents([cadastroEvent]);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar progresso:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProgress();
  }, [user]);

  // Função para formatar datas
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR");
    } catch (e) {
      return new Date().toLocaleDateString("pt-BR");
    }
  };

  return (
    <UserPanelLayout userType="jovem">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Minha Evolução</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            title="Visualizações"
            value={stats.visualizacoes.toString()}
            description="Seu vídeo e projetos"
            icon={<Eye className="h-4 w-4" />}
          />
          <StatCard
            title="Projetos"
            value={stats.projetos.toString()}
            description="Enviados para avaliação"
            icon={<Clock className="h-4 w-4" />}
          />
          <StatCard
            title="Medalhas"
            value={stats.medalhas.toString()}
            description={
              stats.medalhas > 0 ? "Medalhas recebidas" : "Ainda não recebidas"
            }
            icon={<Medal className="h-4 w-4" />}
          />
          <StatCard
            title="Convites"
            value={stats.convites.toString()}
            description={
              stats.convites > 0 ? "Para entrevista" : "Nenhum recebido ainda"
            }
            icon={<Calendar className="h-4 w-4" />}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Linha do Tempo</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : timelineEvents.length > 0 ? (
              <div className="relative">
                {/* Timeline vertical line */}
                <div className="absolute left-2.5 top-0 h-full w-0.5 bg-muted" />

                <ul className="space-y-8">
                  {/* Timeline items */}
                  {timelineEvents.map((event) => (
                    <li key={event.id} className="relative pl-10">
                      <span className="absolute left-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                        <span className="h-3 w-3 rounded-full bg-primary-foreground" />
                      </span>
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <h3 className="text-base font-semibold">
                            {event.title}
                          </h3>
                          <span className="ml-auto text-sm text-muted-foreground">
                            {event.formattedDate}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {event.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-center py-6 text-muted-foreground">
                Sua jornada está apenas começando! Envie seu primeiro projeto
                para construir sua linha do tempo.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </UserPanelLayout>
  );
};

export default TalentProgress;
