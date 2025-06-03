import React, { useState, useEffect } from "react";
import UserPanelLayout from "@/components/UserPanelLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Building,
  User,
  MapPin,
  Video,
  Check,
  X,
  ExternalLink,
  Clock,
  Info,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

// Importar o serviço de entrevistas
import {
  buscarEntrevistasJovem,
  cancelarEntrevista,
  obterEntrevistasLocal,
} from "@/servicos/entrevistas";

// Tooltip para informações adicionais
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Dialog para confirmação
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Interface para entrevistas
interface Entrevista {
  id: string;
  talentoId: string;
  talentoNome: string;
  gestorId: string;
  gestorNome?: string;
  empresa?: string;
  data: string;
  hora: string;
  tipo: "online" | "presencial";
  local?: string;
  link?: string;
  observacoes?: string;
  status: "agendada" | "cancelada" | "realizada";
  dataCriacao: string;
}

const ConvitesPage = () => {
  const { user } = useAuth();
  const [entrevistas, setEntrevistas] = useState<Entrevista[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    id: string;
    action: "aceitar" | "recusar";
  }>({
    open: false,
    id: "",
    action: "aceitar",
  });

  // Função para buscar entrevistas
  const fetchEntrevistas = async () => {
    try {
      if (!user?.id) {
        console.log("Usuário não identificado, impossível buscar entrevistas");
        setError("Usuário não identificado");
        setLoading(false);
        return;
      }

      console.log(`Buscando entrevistas para o usuário ID: ${user.id}`);
      setLoading(true);
      setError(null);

      // Buscar entrevistas do serviço
      const minhasEntrevistas = await buscarEntrevistasJovem(user.id);
      console.log(
        `Entrevistas recebidas para o usuário ${user.id}:`,
        minhasEntrevistas
      );

      if (minhasEntrevistas && minhasEntrevistas.length > 0) {
        setEntrevistas(minhasEntrevistas);
      } else {
        console.log(
          "Nenhuma entrevista encontrada através da API, verificando localStorage"
        );

        // Verificar diretamente no localStorage como fallback
        const todasEntrevistasLocal = obterEntrevistasLocal();
        const entrevistasDoUsuario = todasEntrevistasLocal.filter(
          (e) => e.talentoId === user.id.toString()
        );

        console.log(
          `Entrevistas encontradas no localStorage: ${entrevistasDoUsuario.length}`
        );
        if (entrevistasDoUsuario.length > 0) {
          setEntrevistas(entrevistasDoUsuario);
        } else {
          setEntrevistas([]);
        }
      }
    } catch (error) {
      console.error("Erro ao atualizar entrevistas:", error);
      setError(
        "Não foi possível carregar as entrevistas. Tente novamente mais tarde."
      );

      // Tentar recuperar do localStorage em caso de erro
      try {
        const todasEntrevistasLocal = obterEntrevistasLocal();
        const entrevistasDoUsuario = todasEntrevistasLocal.filter(
          (e) => e.talentoId === user?.id?.toString()
        );

        if (entrevistasDoUsuario.length > 0) {
          setEntrevistas(entrevistasDoUsuario);
          toast.info("Mostrando entrevistas salvas localmente");
        }
      } catch (e) {
        console.error("Erro ao recuperar entrevistas do localStorage:", e);
      }
    } finally {
      setLoading(false);
    }
  };

  // Evento para atualizar entrevistas quando uma nova é agendada
  useEffect(() => {
    const handleEntrevistaAgendada = (event: CustomEvent) => {
      console.log("Evento de entrevista agendada recebido:", event.detail);

      // Verificar se a entrevista é para este talento
      const entrevistaData = event.detail?.entrevista;
      if (entrevistaData && entrevistaData.talentoId === user?.id?.toString()) {
        console.log("Nova entrevista é para este usuário, atualizando lista");

        // Atualizar a lista de entrevistas
        fetchEntrevistas();

        // Notificar o usuário
        toast.success("Uma nova entrevista foi agendada para você!");
      }
    };

    console.log("Adicionando event listener para entrevistaAgendada");
    window.addEventListener(
      "entrevistaAgendada",
      handleEntrevistaAgendada as EventListener
    );

    return () => {
      console.log("Removendo event listener para entrevistaAgendada");
      window.removeEventListener(
        "entrevistaAgendada",
        handleEntrevistaAgendada as EventListener
      );
    };
  }, [user?.id]);

  // Carregar entrevistas iniciais
  useEffect(() => {
    console.log("useEffect para carregar entrevistas iniciais executado");
    if (user?.id) {
      console.log(`Usuário identificado: ${user.id}, buscando entrevistas...`);
      fetchEntrevistas();
    } else {
      console.log("Usuário não identificado ainda, aguardando...");
    }
  }, [user?.id]);

  const openConfirmDialog = (id: string, action: "aceitar" | "recusar") => {
    setConfirmDialog({
      open: true,
      id,
      action,
    });
  };

  const handleAccept = async (id: string) => {
    try {
      // Aqui você pode implementar a lógica para aceitar a entrevista
      // Por enquanto apenas atualizamos o estado local
      toast.success("Entrevista aceita com sucesso!");

      // Atualizar a lista de entrevistas
      setEntrevistas(
        entrevistas.map((entrevista) =>
          entrevista.id === id
            ? { ...entrevista, status: "agendada" }
            : entrevista
        )
      );
    } catch (error) {
      console.error("Erro ao aceitar entrevista:", error);
      toast.error("Não foi possível aceitar a entrevista");
    }
  };

  const handleDecline = async (id: string) => {
    try {
      await cancelarEntrevista(id);
      toast.success("Entrevista recusada com sucesso!");

      // Atualizar a lista de entrevistas
      setEntrevistas(
        entrevistas.map((entrevista) =>
          entrevista.id === id
            ? { ...entrevista, status: "cancelada" }
            : entrevista
        )
      );
    } catch (error) {
      console.error("Erro ao recusar entrevista:", error);
      toast.error("Não foi possível recusar a entrevista");
    }
  };

  const formatarData = (dataString: string) => {
    try {
      return format(parseISO(dataString), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      console.error("Erro ao formatar data:", dataString, error);
      return dataString;
    }
  };

  return (
    <UserPanelLayout userType="jovem">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            Convites para Entrevistas
          </h1>
          <Button
            variant="outline"
            onClick={() => fetchEntrevistas()}
            disabled={loading}
          >
            {loading ? "Atualizando..." : "Atualizar"}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Entrevistas Agendadas</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-10">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">
                  Carregando entrevistas...
                </p>
              </div>
            ) : error ? (
              <div className="text-center py-10 text-red-500">
                <p>{error}</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => fetchEntrevistas()}
                >
                  Tentar novamente
                </Button>
              </div>
            ) : entrevistas.length > 0 ? (
              <div className="space-y-4">
                {entrevistas.map((entrevista) => (
                  <div
                    key={entrevista.id}
                    className={`border rounded-lg p-4 shadow-sm ${
                      entrevista.status === "cancelada" ? "opacity-70" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {entrevista.empresa || "Empresa"}
                        </h3>
                        <p className="text-muted-foreground flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          Entrevista com {entrevista.gestorNome || "Gestor"}
                        </p>
                      </div>
                      <Badge
                        className={
                          entrevista.status === "agendada"
                            ? "bg-green-100 text-green-800"
                            : entrevista.status === "cancelada"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }
                      >
                        {entrevista.status === "agendada"
                          ? "Agendada"
                          : entrevista.status === "cancelada"
                          ? "Cancelada"
                          : "Realizada"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{formatarData(entrevista.data)}</span>
                      </div>

                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{entrevista.hora}</span>
                      </div>

                      <div className="flex items-center text-sm">
                        <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {entrevista.tipo === "presencial"
                            ? "Presencial"
                            : "Online"}
                        </span>
                      </div>

                      {entrevista.tipo === "presencial" && entrevista.local && (
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{entrevista.local}</span>
                        </div>
                      )}

                      {entrevista.tipo === "online" && entrevista.link && (
                        <div className="flex items-center text-sm">
                          <Video className="h-4 w-4 mr-2 text-muted-foreground" />
                          <a
                            href={entrevista.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center"
                          >
                            Link da reunião
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </div>
                      )}
                    </div>

                    {entrevista.observacoes && (
                      <div className="bg-muted p-2 rounded-md mb-4">
                        <div className="flex items-start">
                          <Info className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                          <p className="text-sm">{entrevista.observacoes}</p>
                        </div>
                      </div>
                    )}

                    {entrevista.status === "agendada" && (
                      <div className="flex justify-end space-x-2 mt-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  openConfirmDialog(entrevista.id, "recusar")
                                }
                              >
                                <X className="h-4 w-4 mr-1" />
                                Recusar
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Recusar esta entrevista</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() =>
                                  openConfirmDialog(entrevista.id, "aceitar")
                                }
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Confirmar presença
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Confirmar sua presença nesta entrevista</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">
                  Você ainda não tem entrevistas agendadas.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog para confirmação */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
      >
        <DialogContent className="sm:max-w-[425px] max-h-[85vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              {confirmDialog.action === "aceitar"
                ? "Aceitar Entrevista"
                : "Recusar Entrevista"}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.action === "aceitar"
                ? "Você está prestes a aceitar esta entrevista. Deseja continuar?"
                : "Você está prestes a recusar esta entrevista. Deseja continuar?"}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[50vh] pr-4">
            <p className="text-sm text-muted-foreground mb-4">
              {confirmDialog.action === "aceitar"
                ? "Ao aceitar, você confirma sua disponibilidade para a data e horário marcados."
                : "Ao recusar, a entrevista será cancelada e o gestor será notificado."}
            </p>
          </ScrollArea>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setConfirmDialog({ ...confirmDialog, open: false })
              }
            >
              Cancelar
            </Button>
            <Button
              variant={
                confirmDialog.action === "aceitar" ? "default" : "destructive"
              }
              onClick={() => {
                if (confirmDialog.action === "aceitar") {
                  handleAccept(confirmDialog.id);
                } else {
                  handleDecline(confirmDialog.id);
                }
              }}
            >
              {confirmDialog.action === "aceitar" ? "Aceitar" : "Recusar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </UserPanelLayout>
  );
};

export default ConvitesPage;
