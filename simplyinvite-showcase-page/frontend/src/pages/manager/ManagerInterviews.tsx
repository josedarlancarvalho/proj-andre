import React, { useState, useEffect } from "react";
import UserPanelLayout from "@/components/UserPanelLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Edit, Trash2, Video, MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Interface for Interview
interface Interview {
  id: string;
  candidate: string;
  date: string; // Format DD/MM/YYYY
  time: string; // Format HH:MM
  type: "online" | "presencial";
  position: string;
  status: "agendado" | "confirmado" | "pendente" | "concluido" | "cancelado" | string; // Allow string for other potential statuses
  location?: string; // Optional for presencial
}

const ManagerInterviews = () => {
  const [userName, setUserName] = useState("Carregando...");
  const [interviewsList, setInterviewsList] = useState<Interview[]>([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState(new Date()); // For calendar selection

  useEffect(() => {
    // TODO: Replace with actual API calls
    const fetchInterviewsData = async () => {
      // Simulate fetching user name
      // const userResponse = await fetch("/api/manager/user-info");
      // const userData = await userResponse.json();
      // setUserName(userData.name);
      setUserName("Rodrigo Mendes"); // Placeholder

      // Simulate fetching interviews
      // const interviewsResponse = await fetch("/api/manager/interviews");
      // const interviewsData = await interviewsResponse.json();
      // setInterviewsList(interviewsData);
      setInterviewsList([]); // Initialize with empty or fetched data
    };
    fetchInterviewsData();
  }, []);

  const handleReschedule = (id: string) => {
    console.log("Reschedule", id);
  };

  const handleCancel = (id: string) => {
    console.log("Cancel", id);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "agendado":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Agendado</Badge>;
      case "confirmado":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Confirmado</Badge>;
      case "pendente":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">Aguardando Confirmação</Badge>;
      case "concluido":
        return <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300">Concluído</Badge>;
      case "cancelado":
        return <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-300">Cancelado</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  // Get dates for the calendar view
  const today = new Date();
  const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(selectedDate); // Use selectedDate for calendar navigation if implemented
    date.setDate(selectedDate.getDate() - selectedDate.getDay() + i); // Start week from Sunday of selectedDate's week
    return {
      day: weekdays[date.getDay()],
      date: date.getDate(),
      month: date.getMonth() + 1,
      fullDate: date, // Store full date object for easier comparison
      isToday: date.toDateString() === today.toDateString(),
      isSelected: date.toDateString() === selectedDate.toDateString(),
    };
  });

  // Filter interviews for the selectedDate in calendar
  const selectedDateFormatted = `${selectedDate.getDate().toString().padStart(2, '0')}/${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}/${selectedDate.getFullYear()}`;
  const interviewsForSelectedDate = interviewsList.filter(interview => {
    // Assuming interview.date is DD/MM/YYYY
    return interview.date === selectedDateFormatted;
  });
  
  // Filter for "Todas as Entrevistas" section based on filterStatus
  const filteredAllInterviews = interviewsList.filter(interview => {
    if (filterStatus === "all") return true;
    if (filterStatus === "upcoming") {
        // Basic upcoming: today or later. More complex logic might be needed.
        const [day, month, year] = interview.date.split('/').map(Number);
        const interviewDate = new Date(year, month - 1, day);
        return interviewDate >= today && (interview.status === "agendado" || interview.status === "confirmado" || interview.status === "pendente");
    }
    return interview.status === filterStatus;
  });

  return (
    <UserPanelLayout userType="gestor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Entrevistas Agendadas</h1>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Entrevistas</SelectItem>
              <SelectItem value="upcoming">Próximas</SelectItem>
              <SelectItem value="confirmado">Confirmadas</SelectItem>
              <SelectItem value="pendente">Aguardando</SelectItem>
              <SelectItem value="agendado">Agendadas</SelectItem>
              <SelectItem value="concluido">Concluídas</SelectItem>
              <SelectItem value="cancelado">Canceladas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Calendário de Entrevistas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex overflow-x-auto pb-2 mb-4">
              {weekDates.map((day, i) => (
                <div 
                  key={i}
                  className={`flex-shrink-0 w-20 h-24 border rounded-lg flex flex-col items-center justify-center mx-1 cursor-pointer hover:bg-muted/50 ${
                    day.isSelected ? "border-primary bg-primary/10" : day.isToday ? "border-gray-400 bg-gray-50" : ""
                  }`}
                  onClick={() => setSelectedDate(day.fullDate)}
                >
                  <div className="text-sm font-medium">{day.day}</div>
                  <div className={`text-2xl font-bold ${day.isSelected ? "text-primary" : ""}`}>{day.date}</div>
                  <div className="text-xs text-muted-foreground">{day.month < 10 ? `0${day.month}` : day.month}</div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">{selectedDate.toDateString() === today.toDateString() ? "Hoje" : selectedDateFormatted}, {weekdays[selectedDate.getDay()]}</h3>
              
              {interviewsForSelectedDate.length > 0 ? (
                interviewsForSelectedDate.map((interview) => (
                  <div 
                    key={interview.id}
                    className="flex items-center p-3 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{interview.candidate}</h4>
                      <div className="text-sm text-muted-foreground">
                        {interview.time} - {interview.position}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(interview.status)}
                      {interview.type === "online" ? (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Video className="h-3 w-3" /> Online
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> Presencial
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 border rounded-lg bg-muted/10">
                  <p className="text-muted-foreground">Nenhuma entrevista para a data selecionada.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Todas as Entrevistas</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredAllInterviews.length > 0 ? (
              <div className="space-y-4">
                {filteredAllInterviews.map((interview) => (
                  <div key={interview.id} className="border rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <h3 className="font-medium text-lg">{interview.candidate}</h3>
                          {getStatusBadge(interview.status)}
                        </div>
                        
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{interview.date} às {interview.time}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm">
                            {interview.type === "online" ? (
                              <>
                                <Video className="h-4 w-4 text-muted-foreground" />
                                <span>Entrevista Online</span>
                              </>
                            ) : (
                              <>
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{interview.location}</span>
                              </>
                            )}
                          </div>
                          
                          <div className="text-sm">
                            <span className="text-muted-foreground">Cargo: </span>
                            <span>{interview.position}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 min-w-[200px]">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleReschedule(interview.id)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Reagendar
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 text-destructive hover:text-destructive"
                          onClick={() => handleCancel(interview.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                Nenhuma entrevista encontrada para os filtros aplicados.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </UserPanelLayout>
  );
};

export default ManagerInterviews;
