import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Medal } from "lucide-react";

interface Avaliador {
  id: number;
  nomeCompleto: string;
  tipoUsuario: string;
  fotoPerfil?: string;
}

interface Avaliacao {
  id: number;
  projetoId: number;
  avaliadorId: number;
  nota: number;
  comentario: string;
  medalha?: "ouro" | "prata" | "bronze";
  createdAt: string;
  avaliador?: Avaliador;
}

interface Feedback {
  id: number;
  projetoId: number;
  gestorId: number;
  comentario: string;
  oportunidade?: any;
  createdAt: string;
  gestor?: Avaliador;
}

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projetoId: string;
  projetoTitulo: string;
  avaliacoes: Avaliacao[];
  feedbacks: Feedback[];
  isLoading: boolean;
}

const FeedbackModal = ({
  open,
  onOpenChange,
  projetoId,
  projetoTitulo,
  avaliacoes = [],
  feedbacks = [],
  isLoading,
}: FeedbackModalProps) => {
  console.log("Renderizando FeedbackModal", {
    open,
    projetoId,
    projetoTitulo,
    avaliacoes: avaliacoes.length,
    feedbacks: feedbacks.length,
    isLoading,
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const getMedalColor = (medalha?: string) => {
    switch (medalha) {
      case "ouro":
        return "bg-yellow-400 text-yellow-950";
      case "prata":
        return "bg-gray-300 text-gray-950";
      case "bronze":
        return "bg-amber-700 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Feedbacks do Projeto</DialogTitle>
          <DialogDescription>
            Feedbacks e avaliações para o projeto "{projetoTitulo}"
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Carregando feedbacks...</p>
          </div>
        ) : (
          <>
            {avaliacoes.length === 0 && feedbacks.length === 0 ? (
              <div className="text-center py-6">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  Ainda não há feedbacks para este projeto.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {avaliacoes.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      Avaliações de Profissionais RH
                    </h3>
                    <div className="space-y-3">
                      {avaliacoes.map((avaliacao) => (
                        <Card key={avaliacao.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <Avatar>
                                {avaliacao.avaliador?.fotoPerfil ? (
                                  <AvatarImage
                                    src={avaliacao.avaliador.fotoPerfil}
                                  />
                                ) : (
                                  <AvatarFallback>
                                    {avaliacao.avaliador?.nomeCompleto
                                      ? getInitials(
                                          avaliacao.avaliador.nomeCompleto
                                        )
                                      : "RH"}
                                  </AvatarFallback>
                                )}
                              </Avatar>

                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium">
                                      {avaliacao.avaliador?.nomeCompleto ||
                                        "Profissional RH"}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {formatDate(avaliacao.createdAt)}
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    {avaliacao.medalha && (
                                      <Badge
                                        className={getMedalColor(
                                          avaliacao.medalha
                                        )}
                                      >
                                        <Medal className="h-3 w-3 mr-1" />
                                        Medalha{" "}
                                        {avaliacao.medalha
                                          .charAt(0)
                                          .toUpperCase() +
                                          avaliacao.medalha.slice(1)}
                                      </Badge>
                                    )}
                                    <Badge variant="outline">
                                      Nota: {avaliacao.nota}/10
                                    </Badge>
                                  </div>
                                </div>

                                <div className="mt-2 text-sm">
                                  {avaliacao.comentario}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {feedbacks.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      Feedback de Gestores
                    </h3>
                    <div className="space-y-3">
                      {feedbacks.map((feedback) => (
                        <Card key={feedback.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <Avatar>
                                {feedback.gestor?.fotoPerfil ? (
                                  <AvatarImage
                                    src={feedback.gestor.fotoPerfil}
                                  />
                                ) : (
                                  <AvatarFallback>
                                    {feedback.gestor?.nomeCompleto
                                      ? getInitials(
                                          feedback.gestor.nomeCompleto
                                        )
                                      : "GM"}
                                  </AvatarFallback>
                                )}
                              </Avatar>

                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium">
                                      {feedback.gestor?.nomeCompleto ||
                                        "Gestor"}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {formatDate(feedback.createdAt)}
                                    </p>
                                  </div>
                                </div>

                                <div className="mt-2 text-sm">
                                  {feedback.comentario}
                                </div>

                                {feedback.oportunidade && (
                                  <div className="mt-3 p-3 bg-primary/10 rounded-md">
                                    <p className="font-medium text-sm">
                                      Oportunidade
                                    </p>
                                    <p className="text-sm">
                                      {typeof feedback.oportunidade === "string"
                                        ? feedback.oportunidade
                                        : JSON.stringify(feedback.oportunidade)}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
