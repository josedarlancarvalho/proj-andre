import React from "react";
import UserPanelLayout from "@/components/UserPanelLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Calendar, Building, User } from "lucide-react";
import { useState, useEffect } from "react";

// Interface
interface Invitation {
  id: string;
  company: string;
  date: string;
  time: string;
  type: string; // e.g., "Entrevista Online", "Entrevista Presencial"
  contact: string;
  position: string;
  status: "pendente" | "aceito" | "recusado"; // Added "recusado"
}

const TalentInvitations = () => {
  const [invites, setInvites] = useState<Invitation[]>([]);
  const [userName, setUserName] = useState("Carregando...");

  useEffect(() => {
    const fetchUserData = async () => {
      // const userResponse = await fetch("/api/talent/user-info"); 
      // const userData = await userResponse.json();
      // setUserName(userData.name);
    };

    const fetchInvites = async () => {
      // const response = await fetch("/api/talent/invitations");
      // const data = await response.json();
      // setInvites(data);
      setInvites([]); // Initialize with empty or fetched data
    };

    fetchUserData();
    fetchInvites();
  }, []);

  const handleAccept = (id: string) => {
    console.log("Accepted invite", id);
  };

  const handleDecline = (id: string) => {
    console.log("Declined invite", id);
  };

  return (
    <UserPanelLayout userName={userName} userType="talent">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Convites Recebidos</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Entrevistas Agendadas</CardTitle>
          </CardHeader>
          <CardContent>
            {invites.length > 0 ? (
              <div className="space-y-4">
                {invites.map((invite) => (
                  <div 
                    key={invite.id} 
                    className="border rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{invite.company}</h3>
                        <p className="text-muted-foreground">{invite.position}</p>
                      </div>
                      <Badge 
                        className={{
                          pendente: "bg-amber-100 text-amber-800",
                          aceito: "bg-green-100 text-green-800",
                          recusado: "bg-red-100 text-red-800"
                        }[invite.status]}
                      >
                        {invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {invite.date} às {invite.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{invite.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{invite.contact}</span>
                      </div>
                    </div>

                    {invite.status === "pendente" && (
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDecline(invite.id)}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Recusar
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm" 
                          onClick={() => handleAccept(invite.id)}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Aceitar
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">Nenhum convite recebido ainda.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Continue enviando projetos para aumentar suas chances!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </UserPanelLayout>
  );
};

export default TalentInvitations;
