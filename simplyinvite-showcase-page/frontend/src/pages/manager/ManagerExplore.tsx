import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import UserPanelLayout from "@/components/UserPanelLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Star, Calendar, MessageSquare, User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import gestorService, { registrarVisualizacaoTalento } from "@/servicos/gestor";
import { adicionarFavorito, isFavorito } from "@/servicos/favoritos";
import { toast } from "sonner";

// Interfaces
interface ExplorableTalent {
  id: string;
  name: string;
  age: number;
  city: string;
  image?: string; // Optional image
  category: string;
  medal: "ouro" | "prata" | "bronze" | null;
  project: string;
  tags: string[];
}

interface FilterOptions {
  id: string;
  label: string;
}

const ManagerExplore = () => {
  const [userName, setUserName] = useState("Carregando...");
  const [allTalents, setAllTalents] = useState<ExplorableTalent[]>([]); // Holds all fetched talents
  const [filteredTalents, setFilteredTalents] = useState<ExplorableTalent[]>(
    []
  ); // Holds talents after filtering
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const [selectedTalent, setSelectedTalent] = useState(null);

  const [filters, setFilters] = useState({
    medal: "all", // Default to all
    category: "all",
    location: "all",
  });

  // Options for filters - these could also be fetched from an API
  const [medalOptions, setMedalOptions] = useState<FilterOptions[]>([
    { id: "all", label: "Todas Medalhas" },
    { id: "ouro", label: "Ouro" },
    { id: "prata", label: "Prata" },
    { id: "bronze", label: "Bronze" },
  ]);
  const [categoryOptions, setCategoryOptions] = useState<FilterOptions[]>([
    { id: "all", label: "Todas Categorias" },
    // Example categories, fetch dynamically if possible
  ]);
  const [locationOptions, setLocationOptions] = useState<FilterOptions[]>([
    { id: "all", label: "Todas Localizações" },
    // Example locations, fetch dynamically if possible
  ]);

  useEffect(() => {
    // TODO: Replace with actual API calls
    const fetchPageData = async () => {
      // Fetch user info
      // const userResponse = await fetch("/api/manager/user-info");
      // const userData = await userResponse.json();
      // setUserName(userData.name);

      // Fetch all talents initially
      // const talentsResponse = await fetch("/api/manager/explore-talents");
      // const talentsData = await talentsResponse.json();
      // setAllTalents(talentsData);
      // setFilteredTalents(talentsData); // Initially, all talents are shown
      setAllTalents([]);
      setFilteredTalents([]);

      // Fetch filter options (example for categories and locations)
      // const filterOptionsResponse = await fetch("/api/filters/explore");
      // const filterOpts = await filterOptionsResponse.json();
      // setCategoryOptions([{ id: "all", label: "Todas Categorias" }, ...filterOpts.categories]);
      // setLocationOptions([{ id: "all", label: "Todas Localizações" }, ...filterOpts.locations]);
      setCategoryOptions([
        { id: "all", label: "Todas Categorias" },
        { id: "Design", label: "Design" },
        { id: "Desenvolvimento", label: "Desenvolvimento" },
        { id: "Impacto Social", label: "Impacto Social" },
        { id: "Educação", label: "Educação" },
      ]);
      setLocationOptions([
        { id: "all", label: "Todas Localizações" },
        { id: "São Paulo", label: "São Paulo" },
        { id: "Rio de Janeiro", label: "Rio de Janeiro" },
        { id: "Curitiba", label: "Curitiba" },
      ]);
    };
    fetchPageData();
  }, []);

  // Effect to apply filters when filters or searchTerm change
  useEffect(() => {
    let talentsToFilter = [...allTalents];

    if (filters.medal !== "all") {
      talentsToFilter = talentsToFilter.filter(
        (talent) => talent.medal === filters.medal
      );
    }
    if (filters.category !== "all") {
      talentsToFilter = talentsToFilter.filter(
        (talent) => talent.category === filters.category
      );
    }
    if (filters.location !== "all") {
      talentsToFilter = talentsToFilter.filter(
        (talent) => talent.city === filters.location
      );
    }
    if (searchTerm) {
      talentsToFilter = talentsToFilter.filter(
        (talent) =>
          talent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          talent.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }
    setFilteredTalents(talentsToFilter);
  }, [filters, searchTerm, allTalents]);

  // Verificar se há um ID na URL para visualizar um talento específico
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const talentoId = params.get("id");

    if (talentoId) {
      // Buscar dados do talento específico
      const fetchTalentoEspecifico = async () => {
        try {
          const talento = await gestorService.buscarTalentos();
          const talentoEncontrado = talento.find(
            (t) => t.id.toString() === talentoId
          );

          if (talentoEncontrado) {
            setSelectedTalent(talentoEncontrado);
            // Registrar visualização
            await gestorService.registrarVisualizacao(talentoEncontrado.id);
            toast.success(
              `Visualizando perfil de ${
                talentoEncontrado.nomeCompleto || "Talento"
              }`
            );
          }
        } catch (error) {
          console.error("Erro ao buscar talento específico:", error);
        }
      };

      fetchTalentoEspecifico();
    }
  }, [location]);

  const handleAddToFavorites = (id: string) => {
    console.log("Add to favorites", id);
  };

  const handleScheduleInterview = (id: string) => {
    console.log("Schedule interview", id);
  };

  const handleContact = (id: string) => {
    console.log("Contact", id);
  };

  const handleFavoritarTalento = async (talentoId) => {
    try {
      toast.promise(adicionarFavorito({ id: talentoId, nome: "Talento" }), {
        loading: "Adicionando aos favoritos...",
        success: "Talento adicionado aos favoritos!",
        error: "Não foi possível adicionar aos favoritos",
      });
    } catch (error) {
      console.error("Erro ao favoritar talento:", error);
    }
  };

  const handleVisualizarPerfil = async (talento) => {
    setSelectedTalent(talento);
    try {
      await gestorService.registrarVisualizacao(talento.id);
    } catch (error) {
      console.error("Erro ao registrar visualização:", error);
    }
  };

  const getMedalBadge = (medal: string | null) => {
    if (!medal) return <Badge variant="outline">-</Badge>;
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
    <UserPanelLayout userType="gestor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            Explorar Talentos
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtrar Talentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="w-full md:w-auto">
                <Select
                  value={filters.medal}
                  onValueChange={(value) =>
                    setFilters({ ...filters, medal: value })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Medalha" />
                  </SelectTrigger>
                  <SelectContent>
                    {medalOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full md:w-auto">
                <Select
                  value={filters.category}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      category: value === "all" ? "all" : value,
                    })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full md:w-auto">
                <Select
                  value={filters.location}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      location: value === "all" ? "all" : value,
                    })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Localização" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <Input
                  placeholder="Buscar por nome, habilidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Button
                onClick={() => {
                  /* Trigger filter application, already handled by useEffect */
                }}
              >
                <Search className="mr-2 h-4 w-4" />
                Buscar
              </Button>
            </div>
          </CardContent>
        </Card>

        {filteredTalents.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTalents.map((talent) => (
              <Card key={talent.id} className="overflow-hidden">
                <div className="relative p-6 pb-0">
                  <div className="flex items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{talent.name}</h3>
                      <div className="text-sm text-muted-foreground">
                        {talent.age} anos • {talent.city}
                      </div>
                    </div>
                    <div>{getMedalBadge(talent.medal)}</div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="text-sm font-medium mb-1">
                      Projeto em destaque:
                    </div>
                    <div className="text-sm">{talent.project}</div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {talent.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      variant="default"
                      className="w-full"
                      onClick={() => handleScheduleInterview(talent.id)}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Agendar Entrevista
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleFavoritarTalento(talent.id)}
                      >
                        <Star className="mr-2 h-4 w-4" />
                        Favoritar
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleContact(talent.id)}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Contatar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Nenhum talento encontrado com os filtros aplicados.
            </CardContent>
          </Card>
        )}
      </div>
    </UserPanelLayout>
  );
};

export default ManagerExplore;
