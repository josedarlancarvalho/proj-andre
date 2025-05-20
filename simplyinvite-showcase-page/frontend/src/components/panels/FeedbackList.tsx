
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
            <p className="text-muted-foreground">Nenhum feedback recebido ainda.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <div 
                key={feedback.id} 
                className="border rounded-lg p-4 relative"
              >
                {feedback.isNew && (
                  <Badge className="absolute top-2 right-2 bg-si-accent">
                    Novo
                  </Badge>
                )}
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium">{feedback.from}</div>
                  <div className="text-xs text-muted-foreground">{feedback.date}</div>
                </div>
                <Badge variant="outline" className="mb-2">
                  {feedback.category}
                </Badge>
                <p className="text-sm">{feedback.text}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeedbackList;
