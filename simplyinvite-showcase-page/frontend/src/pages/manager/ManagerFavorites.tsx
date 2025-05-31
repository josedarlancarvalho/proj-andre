import React, { useState, useEffect } from "react";
import UserPanelLayout from "@/components/UserPanelLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MessageSquare,
  Star,
  Trash2,
  CheckCircle,
  Clock,
  MessageCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { listarFavoritos, removerFavorito } from "@/servicos/favoritos";
import { toast } from "sonner";

// Interface for Favorite Talent
interface FavoriteTalent {
  id: string;
  name: string;
  age: number;
  city: string;
  image?: string; // Optional image
  category: string;
  medal: "ouro" | "prata" | "bronze" | null;
  project: string;
  status: "avaliando" | "em contato" | "convidado" | string; // Allow string for other potential statuses
  dateAdded: string;
}

const ManagerFavorites = () => {
  const [userName, setUserName] = useState("Carregando...");
  const [favoritesList, setFavoritesList] = useState<FavoriteTalent[]>([]);
  const [statusFilter, setStatusFilter] = useState("all"); // Default to 'all'
  const [loading, setLoading] = useState(true);
  const [favoriteTalents, setFavoriteTalents] = useState<FavoriteTalent[]>([]);
  const [filteredTalents, setFilteredTalents] = useState<FavoriteTalent[]>([]);

  useEffect(() => {
    const carregarFavoritos = async () => {
      setLoading(true);
      try {
        const favoritos = await listarFavoritos();

        // Transformar os favoritos para o formato esperado pelo componente
        const favoritosFormatados = favoritos.map((fav) => ({
          id: fav.id,
          name: fav.talentoNome,
          // Valores padrão para as outras propriedades que não temos
          age: 0,
          city: "",
          category: "",
          medal: null,
          project: "",
          status: "favorito",
          dateAdded: fav.dataCriacao || new Date().toISOString(),
        }));

        setFavoriteTalents(favoritosFormatados);
        setFilteredTalents(favoritosFormatados);
      } catch (error) {
        console.error("Erro ao carregar favoritos:", error);
        toast.error(
          "Não foi possível carregar os favoritos. Tente novamente mais tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    carregarFavoritos();
  }, []);

  const handleScheduleInterview = (id: string) => {
    console.log("Schedule interview", id);
  };

  const handleContact = (id: string) => {
    console.log("Contact", id);
  };

  const handleRemoveFavorite = async (id: string) => {
    try {
      await toast.promise(removerFavorito(id), {
        loading: "Removendo dos favoritos...",
        success: "Talento removido dos favoritos!",
        error: "Não foi possível remover dos favoritos",
      });

      // Atualizar a lista local
      setFavoriteTalents((prevFavorites) =>
        prevFavorites.filter((favorite) => favorite.id !== id)
      );
      setFilteredTalents((prevFiltered) =>
        prevFiltered.filter((talent) => talent.id !== id)
      );
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
    }
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "avaliando":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> Avaliando
          </Badge>
        );
      case "em contato":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 flex items-center gap-1"
          >
            <MessageCircle className="h-3 w-3" /> Em Contato
          </Badge>
        );
      case "convidado":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 flex items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" /> Convidado
          </Badge>
        );
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const filteredFavorites =
    statusFilter === "all"
      ? favoritesList
      : favoritesList.filter((fav) => fav.status === statusFilter);

  return (
    <UserPanelLayout userType="gestor">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Favoritos</h1>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Filtrar por status:
            </span>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="avaliando">Avaliando</SelectItem>
                <SelectItem value="em contato">Em Contato</SelectItem>
                <SelectItem value="convidado">Convidado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredFavorites.length > 0 ? (
          <div className="space-y-4">
            {filteredFavorites.map((favorite) => (
              <Card key={favorite.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">
                          {favorite.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          {getMedalBadge(favorite.medal)}
                          {getStatusBadge(favorite.status)}
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground mb-2">
                        {favorite.age} anos • {favorite.city} •{" "}
                        {favorite.category}
                      </div>

                      <div className="text-sm">
                        <span className="font-medium">Projeto: </span>
                        {favorite.project}
                      </div>

                      <div className="text-xs text-muted-foreground mt-1">
                        Adicionado em {favorite.dateAdded}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 min-w-[200px]">
                      <Button
                        variant="default"
                        onClick={() => handleScheduleInterview(favorite.id)}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Agendar Entrevista
                      </Button>

                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handleContact(favorite.id)}
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Contatar
                        </Button>

                        <Button
                          variant="outline"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleRemoveFavorite(favorite.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remover
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <Star className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">
                Nenhum favorito encontrado
              </h3>
              <p className="text-sm text-muted-foreground">
                {statusFilter === "all"
                  ? "Você ainda não adicionou nenhum talento aos seus favoritos."
                  : "Nenhum talento encontrado com o status selecionado."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </UserPanelLayout>
  );
};

export default ManagerFavorites;
