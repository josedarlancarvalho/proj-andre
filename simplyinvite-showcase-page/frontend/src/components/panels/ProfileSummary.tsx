
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ProfileSummaryProps {
  name: string;
  image?: string;
  stats: {
    label: string;
    value: string | number;
  }[];
  tags?: string[];
}

const ProfileSummary = ({ name, image, stats, tags }: ProfileSummaryProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
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
            <AvatarImage src={image} alt={name} />
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
          
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-semibold text-lg">{name}</h3>
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
                  <Badge key={index} variant="secondary">{tag}</Badge>
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
