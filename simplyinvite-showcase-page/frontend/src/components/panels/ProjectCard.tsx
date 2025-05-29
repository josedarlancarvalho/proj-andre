
import React from "react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Eye, MessageSquare } from "lucide-react";

interface ProjectCardProps {
  title: string;
  image: string;
  medalType?: "ouro" | "prata" | "bronze" | null;
  hasFeedback?: boolean;
  onViewDetails?: () => void;
  onViewFeedback?: () => void;
  userType: "talent" | "hr" | "manager";
}

const ProjectCard = ({
  title,
  image,
  medalType,
  hasFeedback,
  onViewDetails,
  onViewFeedback,
  userType
}: ProjectCardProps) => {
  
  const getMedalColor = () => {
    switch (medalType) {
      case "ouro":
        return "bg-yellow-400 hover:bg-yellow-500";
      case "prata":
        return "bg-gray-300 hover:bg-gray-400";
      case "bronze":
        return "bg-amber-700 hover:bg-amber-800";
      default:
        return "bg-muted hover:bg-muted/80";
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative overflow-hidden bg-muted">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full"
        />
        {medalType && (
          <div className="absolute top-2 right-2">
            <Badge className={`${getMedalColor()} text-white`}>
              Medalha {medalType.charAt(0).toUpperCase() + medalType.slice(1)}
            </Badge>
          </div>
        )}
        {userType === "talent" && hasFeedback && (
          <div className="absolute bottom-2 right-2">
            <Badge className="bg-green-500 text-white">
              Feedback disponível
            </Badge>
          </div>
        )}
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {userType === "talent" && (
          <div className="text-sm text-muted-foreground">
            {medalType 
              ? `Medalha ${medalType.charAt(0).toUpperCase() + medalType.slice(1)}` 
              : "Aguardando avaliação"}
          </div>
        )}
        {userType === "hr" && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Video className="mr-2 h-4 w-4" />
            <span>Vídeo de apresentação disponível</span>
          </div>
        )}
        {userType === "manager" && medalType && (
          <div className="text-sm text-muted-foreground">
            Avaliado por RH com medalha {medalType.charAt(0).toUpperCase() + medalType.slice(1)}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onViewDetails}
          className="flex-1"
        >
          <Eye className="mr-2 h-4 w-4" />
          Ver detalhes
        </Button>
        
        {userType === "talent" && hasFeedback && (
          <Button 
            size="sm" 
            onClick={onViewFeedback}
            className="flex-1"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Ver feedback
          </Button>
        )}
        
        {userType === "hr" && (
          <Button 
            size="sm" 
            onClick={onViewDetails}
            className="flex-1"
          >
            Avaliar
          </Button>
        )}
        
        {userType === "manager" && (
          <Button 
            size="sm" 
            onClick={onViewDetails}
            className="flex-1"
          >
            Contactar
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
