import React from "react";
import UserPanelLayout from "@/components/UserPanelLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/panels/StatCard";
import { Clock, Eye, Calendar, Medal } from "lucide-react";

const TalentProgress = () => {
  return (
    <UserPanelLayout userType="jovem">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Minha Evolução</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard 
            title="Visualizações"
            value="32"
            description="Seu vídeo e projetos"
            icon={<Eye className="h-4 w-4" />}
          />
          <StatCard 
            title="Projetos"
            value="2"
            description="Enviados para avaliação"
            icon={<Clock className="h-4 w-4" />}
          />
          <StatCard 
            title="Medalhas"
            value="2"
            description="Prata e Bronze"
            icon={<Medal className="h-4 w-4" />}
          />
          <StatCard 
            title="Convites"
            value="1"
            description="Para entrevista"
            icon={<Calendar className="h-4 w-4" />}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Linha do Tempo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Timeline vertical line */}
              <div className="absolute left-2.5 top-0 h-full w-0.5 bg-muted" />
              
              <ul className="space-y-8">
                {/* Timeline items */}
                <li className="relative pl-10">
                  <span className="absolute left-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                    <span className="h-3 w-3 rounded-full bg-primary-foreground" />
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <h3 className="text-base font-semibold">Medalha de Prata Recebida</h3>
                      <span className="ml-auto text-sm text-muted-foreground">12/05/2023</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Seu App Educacional foi reconhecido com medalha de prata!</p>
                  </div>
                </li>
                
                <li className="relative pl-10">
                  <span className="absolute left-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                    <span className="h-3 w-3 rounded-full bg-primary-foreground" />
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <h3 className="text-base font-semibold">Primeiro Projeto Enviado</h3>
                      <span className="ml-auto text-sm text-muted-foreground">05/04/2023</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Seu primeiro projeto "App Educacional" foi enviado para avaliação.</p>
                  </div>
                </li>
                
                <li className="relative pl-10">
                  <span className="absolute left-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                    <span className="h-3 w-3 rounded-full bg-primary-foreground" />
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <h3 className="text-base font-semibold">Cadastro na Plataforma</h3>
                      <span className="ml-auto text-sm text-muted-foreground">01/04/2023</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Bem-vindo(a) ao SimplyInvite! Sua jornada começa aqui.</p>
                  </div>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </UserPanelLayout>
  );
};

export default TalentProgress;
