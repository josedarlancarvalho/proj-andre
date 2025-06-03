import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Oportunidade {
  tipo: string;
  descricao: string;
}

interface FeedbackPopupProps {
  author: string;
  authorRole?: string;
  content: string;
  date?: string;
  rating?: number;
  oportunidade?: Oportunidade;
  onClose: () => void;
}

const FeedbackPopup = ({
  author,
  authorRole,
  content,
  date,
  rating,
  oportunidade,
  onClose,
}: FeedbackPopupProps) => {
  return (
    <Card className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[500px] shadow-xl">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="font-medium text-lg">{author}</p>
            {authorRole && (
              <p className="text-sm text-muted-foreground">{authorRole}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {rating !== undefined && (
              <Badge variant="secondary">Nota: {rating}/10</Badge>
            )}
            {oportunidade && (
              <Badge
                variant="outline"
                className="bg-green-100 text-green-800 border-green-300"
              >
                Oportunidade
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="max-h-[300px] rounded-md border p-4 bg-slate-50">
          <div className="text-sm whitespace-pre-wrap">{content}</div>
        </ScrollArea>

        {oportunidade && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-xs font-medium">
              Oportunidade: {oportunidade.tipo}
            </p>
            <ScrollArea className="max-h-[100px] mt-1">
              <p className="text-xs whitespace-pre-wrap">
                {oportunidade.descricao}
              </p>
            </ScrollArea>
          </div>
        )}

        {date && (
          <div className="text-xs text-muted-foreground mt-3">
            {new Date(date).toLocaleDateString()}
          </div>
        )}

        <div className="flex justify-end mt-4">
          <Button onClick={onClose} variant="outline">
            Fechar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackPopup;
