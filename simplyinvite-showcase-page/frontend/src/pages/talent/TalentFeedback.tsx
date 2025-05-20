import React from "react";
import UserPanelLayout from "@/components/UserPanelLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FeedbackList from "@/components/panels/FeedbackList";
import { Medal } from "lucide-react";
import { useState, useEffect } from "react";

// Define interfaces
interface FeedbackData {
  id: string;
  from: string;
  date: string;
  text: string;
  category: string;
  isNew: boolean;
  medal?: "ouro" | "prata" | "bronze" | null; // Medal is optional
}

interface MedalData {
  type: "ouro" | "prata" | "bronze";
  count: number;
  label: string;
  color: string; // Tailwind CSS classes for color
}

const TalentFeedback = () => {
  // State for dynamic data
  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);
  const [medals, setMedals] = useState<MedalData[]>([]);
  const [userName, setUserName] = useState("Carregando...");

  // useEffect to fetch data
  useEffect(() => {
    const fetchFeedbackData = async () => {
      // const userResponse = await fetch("/api/talent/user-info");
      // const userData = await userResponse.json();
      // setUserName(userData.name);
    };

    const fetchFeedbacksAndMedals = async () => {
      // const response = await fetch("/api/talent/feedbacks-summary");
      // const data = await response.json();
      // setFeedbacks(data.feedbacks);
      // setMedals(data.medals);
      setFeedbacks([]); // Initialize with empty array or fetched data
      setMedals([
        { type: "ouro", count: 0, label: "Ouro", color: "bg-yellow-400 text-black" },
        { type: "prata", count: 0, label: "Prata", color: "bg-gray-300 text-black" },
        { type: "bronze", count: 0, label: "Bronze", color: "bg-amber-700 text-white" }
      ]); // Initialize with zero counts, or fetched data
    };

    fetchFeedbackData();
    fetchFeedbacksAndMedals();
  }, []);

  return (
    <UserPanelLayout userName={userName} userType="talent">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Feedbacks Recebidos</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Medal className="mr-2 h-5 w-5" />
              Minhas Medalhas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              {medals.length > 0 ? (
                medals.map((medal) => (
                  <div key={medal.type} className="flex flex-col items-center p-4 rounded-lg border">
                    <div className={`rounded-full w-16 h-16 ${medal.color} flex items-center justify-center mb-2`}>
                      <span className="text-2xl font-bold">{medal.count}</span>
                    </div>
                    <p className="font-medium">{medal.label}</p>
                  </div>
                ))
              ) : (
                <p>Nenhuma medalha contabilizada ainda.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comentários dos Avaliadores</CardTitle>
          </CardHeader>
          <CardContent>
            {feedbacks.length > 0 ? (
              <FeedbackList feedbacks={feedbacks} />
            ) : (
              <p>Nenhum feedback recebido ainda.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </UserPanelLayout>
  );
};

export default TalentFeedback;
