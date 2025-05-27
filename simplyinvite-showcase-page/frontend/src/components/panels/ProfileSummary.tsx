import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileSummaryProps {
  name: string;
  image?: string;
  stats: {
    label: string;
    value: string | number;
  }[];
  tags?: string[];
  useContextName?: boolean;
}

const ProfileSummary = ({
  name,
  image,
  stats,
  tags,
  useContextName = true,
}: ProfileSummaryProps) => {
  const { user } = useAuth();

  // Sempre dar prioridade para o nome do usuário do contexto de autenticação
  // Isso resolve o problema de mostrar "João Silva" quando o usuário logado é outro
  const displayName = user?.nomeCompleto || name;

  // Log para depuração
  useEffect(() => {
    console.log("ProfileSummary - Nome recebido via props:", name);
    console.log(
      "ProfileSummary - Nome do usuário no contexto:",
      user?.nomeCompleto
    );
    console.log("ProfileSummary - Nome que será exibido:", displayName);
  }, [name, user, displayName]);

  const getInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Resumo do Perfil</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={image || user?.avatarUrl} alt={displayName} />
            <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
          </Avatar>

          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-semibold text-lg">{displayName}</h3>
            <div className="flex flex-wrap gap-1">
              {stats.map((stat, index) => (
                <div key={index} className="text-sm">
                  <span className="text-muted-foreground">{stat.label}:</span>{" "}
                  <span className="font-medium">{stat.value}</span>
                  {index < stats.length - 1 && <span className="mx-1">•</span>}
                </div>
              ))}
            </div>

            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSummary;
