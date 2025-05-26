import React, { useState, useEffect } from "react";
import UserPanelLayout from "@/components/UserPanelLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/panels/StatCard";
import { Medal, Clock, FileText, Calendar, PieChart } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
// You would normally import these from recharts
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

// Interfaces for report data
interface ChartDataPoint {
  name: string; // For XAxis (e.g., month, category name)
  total: number; // For YAxis or Bar value
}

interface MedalDistributionPoint {
  name: "Ouro" | "Prata" | "Bronze";
  value: number;
  color: string; // Hex color for Pie chart cell
}

interface YearlyTrendPoint {
  year: string;
  total: number;
}

interface ReportStats {
  projectsEvaluatedMonthly: number;
  avgEvaluationTime: string; // e.g., "15min"
  medalsDistributed: number;
  interviewInvites: number;
}

const HRReports = () => {
  const [userName, setUserName] = useState("Carregando...");
  const [evaluationData, setEvaluationData] = useState<ChartDataPoint[]>([]);
  const [medalData, setMedalData] = useState<MedalDistributionPoint[]>([]);
  const [categoryData, setCategoryData] = useState<ChartDataPoint[]>([]);
  const [yearlyData, setYearlyData] = useState<YearlyTrendPoint[]>([]);
  const [reportStats, setReportStats] = useState<ReportStats>({
    projectsEvaluatedMonthly: 0,
    avgEvaluationTime: "0min",
    medalsDistributed: 0,
    interviewInvites: 0,
  });

  useEffect(() => {
    // TODO: Replace with actual API calls
    const fetchReportData = async () => {
      // const userResponse = await fetch("/api/hr/user-info");
      // const userData = await userResponse.json();
      // setUserName(userData.name);
      setEvaluationData([]);
      setMedalData([
        { name: "Ouro", value: 0, color: "#FFCD29" },
        { name: "Prata", value: 0, color: "#BFBFBF" },
        { name: "Bronze", value: 0, color: "#B87333" },
      ]);
      setCategoryData([]);
      setYearlyData([]);
      setReportStats({
        projectsEvaluatedMonthly: 0,
        avgEvaluationTime: "0min",
        medalsDistributed: 0,
        interviewInvites: 0,
      });
    };
    fetchReportData();
  }, []);

  // Mock data - REMOVED
  // const evaluationData = [...];
  // const medalData = [...];
  // const categoryData = [...];
  // const yearlyData = [...];

  return (
    <UserPanelLayout userName={userName} userType="hr">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            title="Projetos Avaliados"
            value={String(reportStats.projectsEvaluatedMonthly)}
            description="Total do mês atual"
            icon={<FileText className="h-4 w-4" />}
          />
          <StatCard
            title="Tempo Médio"
            value={reportStats.avgEvaluationTime}
            description="Por avaliação"
            icon={<Clock className="h-4 w-4" />}
          />
          <StatCard
            title="Medalhas"
            value={String(reportStats.medalsDistributed)}
            description="Distribuídas"
            icon={<Medal className="h-4 w-4" />}
          />
          <StatCard
            title="Convites"
            value={String(reportStats.interviewInvites)}
            description="Para entrevistas"
            icon={<Calendar className="h-4 w-4" />}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Avaliações Mensais</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              {evaluationData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={evaluationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="total"
                      name="Projetos Avaliados"
                      fill="#9b87f5"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted-foreground">
                  Dados de avaliações mensais indisponíveis.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Distribuição de Medalhas
              </CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              {medalData.some((m) => m.value > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={medalData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {medalData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted-foreground">
                  Dados de distribuição de medalhas indisponíveis.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Projetos por Categoria</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" name="Quantidade" fill="#0EA5E9" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground">
                Dados de projetos por categoria indisponíveis.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evolução Anual de Contratações (Exemplo)</CardTitle>{" "}
            {/* Adjusted title to reflect example if data is static-ish */}
          </CardHeader>
          <CardContent className="h-80">
            {yearlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={yearlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis domain={["dataMin - 10", "dataMax + 10"]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    name="Total de Contratações"
                    stroke="#9b87f5"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground">
                Dados de evolução anual indisponíveis.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </UserPanelLayout>
  );
};

export default HRReports;
