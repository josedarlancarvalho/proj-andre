import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FeedbackItem {
  id: string;
  from: string;
  date: string;
  text: string;
  category: string;
  isNew?: boolean;
  nota?: number;
  medalha?: "ouro" | "prata" | "bronze";
  oportunidade?: {
    tipo: "estagio" | "trainee" | "junior";
    descricao: string;
  };
}

interface FeedbackListProps {
  feedbacks: FeedbackItem[];
}

const FeedbackList = ({ feedbacks }: FeedbackListProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Feedbacks Recebidos</CardTitle>
      </CardHeader>
      <CardContent>
        {feedbacks.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">
              Nenhum feedback recebido ainda.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className="border rounded-lg p-4 relative hover:shadow-md transition-shadow"
              >
                {feedback.isNew && (
                  <Badge className="absolute top-2 right-2 bg-si-accent">
                    Novo
                  </Badge>
                )}
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium text-lg">{feedback.from}</div>
                  <div className="text-xs text-muted-foreground">
                    {feedback.date}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline" className="bg-muted">
                    {feedback.category}
                  </Badge>
                  {feedback.medalha && (
                    <Badge
                      className={`
                        ${
                          feedback.medalha === "ouro"
                            ? "bg-yellow-400 text-black"
                            : feedback.medalha === "prata"
                            ? "bg-gray-300 text-black"
                            : "bg-amber-700 text-white"
                        }
                      `}
                    >
                      Medalha{" "}
                      {feedback.medalha.charAt(0).toUpperCase() +
                        feedback.medalha.slice(1)}
                    </Badge>
                  )}
                  {feedback.nota && (
                    <Badge variant="outline" className="font-medium">
                      Nota: {feedback.nota}/10
                    </Badge>
                  )}
                </div>
                <div className="mt-2 p-3 bg-muted/30 rounded-md text-sm">
                  {feedback.text}
                </div>
                {feedback.oportunidade && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-green-600">Oportunidade</Badge>
                      <span className="font-medium">
                        {feedback.oportunidade.tipo.charAt(0).toUpperCase() +
                          feedback.oportunidade.tipo.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm">{feedback.oportunidade.descricao}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeedbackList;
