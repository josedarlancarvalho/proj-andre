import React, { useState, useEffect } from "react";
import UserPanelLayout from "@/components/UserPanelLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

// Interface for evaluation history items (can be shared if identical to EvaluationPanel's)
interface EvaluationHistoryItem {
  id: string;
  projectTitle: string;
  author: string;
  date: string;
  medal: "ouro" | "prata" | "bronze" | "-"; 
  forwardedToManager: boolean;
}

const HREvaluationHistory = () => {
  const [historyList, setHistoryList] = useState<EvaluationHistoryItem[]>([]);
  const [userName, setUserName] = useState("Carregando...");

  useEffect(() => {
    // TODO: Replace with actual API calls
    const fetchUserData = async () => {
      // const userResponse = await fetch("/api/hr/user-info"); 
      // const userData = await userResponse.json();
      // setUserName(userData.name);
    };

    const fetchHistory = async () => {
      // const historyResponse = await fetch("/api/hr/evaluation-history");
      // const historyData = await historyResponse.json();
      // setHistoryList(historyData);
      setHistoryList([]); // Initialize with empty or fetched data
    };

    fetchUserData();
    fetchHistory();
  }, []);

  const handleForwardToManager = (id: string) => {
    console.log("Forward to manager", id);
  };

  const getMedalBadge = (medal: string) => {
    switch (medal) {
      case "ouro":
        return <Badge className="bg-yellow-400 text-black">Ouro</Badge>;
      case "prata":
        return <Badge className="bg-gray-300 text-black">Prata</Badge>;
      case "bronze":
        return <Badge className="bg-amber-700 text-white">Bronze</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  return (
    <UserPanelLayout userName={userName} userType="hr">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Histórico de Avaliações</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Avaliações Realizadas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Projeto</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Medalha</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historyList.length > 0 ? (
                  historyList.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.projectTitle}</TableCell>
                      <TableCell>{item.author}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{getMedalBadge(item.medal)}</TableCell>
                      <TableCell>
                        {item.forwardedToManager ? (
                          <Badge variant="outline" className="bg-green-50">Encaminhado</Badge>
                        ) : (
                          <Badge variant="outline">Pendente</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {!item.forwardedToManager && (
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => handleForwardToManager(item.id)}
                          >
                            <User className="mr-2 h-4 w-4" />
                            Encaminhar
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Nenhum histórico de avaliação encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </UserPanelLayout>
  );
};

export default HREvaluationHistory;
