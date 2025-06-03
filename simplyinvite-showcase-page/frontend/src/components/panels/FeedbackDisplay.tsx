import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Oportunidade {
  tipo: string;
  descricao: string;
}

interface FeedbackDisplayProps {
  author: string;
  authorRole?: string;
  content: string;
  date?: string;
  medal?: "ouro" | "prata" | "bronze" | null;
  rating?: number;
  company?: string;
  oportunidade?: Oportunidade;
  clickable?: boolean;
}

const FeedbackDisplay = ({
  author,
  authorRole,
  content,
  date,
  medal,
  rating,
  company,
  oportunidade,
  clickable = false,
}: FeedbackDisplayProps) => {
  return (
    <Card
      className={`w-full ${
        clickable ? "cursor-pointer hover:shadow-md transition-shadow" : ""
      }`}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="font-medium">{author}</p>
            {authorRole && (
              <p className="text-xs text-muted-foreground">
                {authorRole} {company && `- ${company}`}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {medal && (
              <Badge variant="outline" className="capitalize">
                {medal}
              </Badge>
            )}
            {rating && <Badge variant="secondary">Nota: {rating}/10</Badge>}
            {oportunidade && (
              <Badge
                variant="outline"
                className="bg-green-100 text-green-800 border-green-300"
              >
                Oportunidade
              </Badge>
            )}
          </div>
        </div>

        <ScrollArea
          className={`max-h-[200px] rounded-md border p-3 ${
            clickable ? "max-h-[100px]" : ""
          }`}
        >
          <div className="text-sm whitespace-pre-wrap">
            {clickable && content.length > 150
              ? `${content.substring(0, 150)}...`
              : content}
          </div>
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
          <div className="text-xs text-muted-foreground mt-2">
            {new Date(date).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeedbackDisplay;
