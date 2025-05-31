import { toast } from "sonner";
import api from "./api";

// Interface para favoritos
interface Favorito {
  id: string;
  talentoId: string;
  talentoNome: string;
  gestorId: string;
  dataCriacao: string;
}

// Chave para armazenamento local
const FAVORITOS_KEY = "simplyinvite_favoritos";

// Função para obter favoritos do localStorage
const obterFavoritosLocal = (): Favorito[] => {
  try {
    const favoritosString = localStorage.getItem(FAVORITOS_KEY);
    return favoritosString ? JSON.parse(favoritosString) : [];
  } catch (e) {
    console.error("Erro ao ler favoritos do localStorage:", e);
    return [];
  }
};

// Função para salvar favoritos no localStorage
const salvarFavoritosLocal = (favoritos: Favorito[]): void => {
  try {
    localStorage.setItem(FAVORITOS_KEY, JSON.stringify(favoritos));
  } catch (e) {
    console.error("Erro ao salvar favoritos no localStorage:", e);
  }
};

// Verificar se um talento já está favoritado
export const isFavorito = (talentoId: string): boolean => {
  const favoritos = obterFavoritosLocal();
  return favoritos.some((fav) => fav.talentoId === talentoId);
};

// Adicionar um talento aos favoritos
export const adicionarFavorito = async (talento: {
  id: string;
  nome?: string;
  nomeCompleto?: string;
}) => {
  try {
    console.log("Adicionando talento aos favoritos:", talento);

    // Salvar localmente primeiro para garantir
    const favoritos = obterFavoritosLocal();

    // Verificar se já existe este favorito
    if (!favoritos.some((fav) => fav.talentoId === talento.id)) {
      const novoFavorito: Favorito = {
        id: `local_${Date.now()}`,
        talentoId: talento.id,
        talentoNome: talento.nomeCompleto || talento.nome || "Talento",
        gestorId: "1", // ID do gestor logado (mock)
        dataCriacao: new Date().toISOString(),
      };

      favoritos.push(novoFavorito);
      salvarFavoritosLocal(favoritos);

      // Emitir evento para atualização da interface
      const evento = new CustomEvent("talentoFavoritado", {
        detail: { talentoId: talento.id },
      });
      window.dispatchEvent(evento);
    }

    // Tenta usar a API depois de já ter salvo localmente
    try {
      const response = await api.post(`/talentos/${talento.id}/favoritar`);
      return response.data;
    } catch (apiError) {
      console.error(
        "Erro na API ao favoritar, mas já salvou localmente:",
        apiError
      );
      // Retorna sucesso de qualquer forma pois já salvamos localmente
      return {
        success: true,
        message: "Talento favoritado localmente",
        localOnly: true,
      };
    }
  } catch (error) {
    console.error("Erro geral ao favoritar:", error);

    // Uma última tentativa de salvar localmente se algo deu errado
    try {
      const favoritos = obterFavoritosLocal();

      if (!favoritos.some((fav) => fav.talentoId === talento.id)) {
        const novoFavorito: Favorito = {
          id: `local_${Date.now()}`,
          talentoId: talento.id,
          talentoNome: talento.nomeCompleto || talento.nome || "Talento",
          gestorId: "1",
          dataCriacao: new Date().toISOString(),
        };

        favoritos.push(novoFavorito);
        salvarFavoritosLocal(favoritos);

        // Emitir evento para atualização da interface
        const evento = new CustomEvent("talentoFavoritado", {
          detail: { talentoId: talento.id },
        });
        window.dispatchEvent(evento);

        return {
          success: true,
          message: "Talento favoritado localmente (recuperação)",
          localOnly: true,
        };
      }
    } catch (fallbackError) {
      console.error("Erro na recuperação de favoritar:", fallbackError);
    }

    throw error;
  }
};

// Remover um talento dos favoritos
export const removerFavorito = async (talentoId: string) => {
  try {
    // Tenta usar a API primeiro
    const response = await api.delete(`/talentos/${talentoId}/favoritar`);

    // Se a API funcionou, tudo bem, mas ainda remove localmente como backup
    const favoritos = obterFavoritosLocal();
    const novosFavoritos = favoritos.filter(
      (fav) => fav.talentoId !== talentoId
    );
    salvarFavoritosLocal(novosFavoritos);

    // Emitir evento para atualização da interface
    const evento = new CustomEvent("talentoDesfavoritado", {
      detail: { talentoId },
    });
    window.dispatchEvent(evento);

    return response.data;
  } catch (error) {
    console.error("Erro na API ao remover favorito:", error);

    // Remover localmente se a API falhar
    const favoritos = obterFavoritosLocal();
    const novosFavoritos = favoritos.filter(
      (fav) => fav.talentoId !== talentoId
    );
    salvarFavoritosLocal(novosFavoritos);

    // Emitir evento para atualização da interface
    const evento = new CustomEvent("talentoDesfavoritado", {
      detail: { talentoId },
    });
    window.dispatchEvent(evento);

    return {
      success: true,
      message: "Talento removido dos favoritos localmente",
      localOnly: true,
    };
  }
};

// Listar todos os favoritos
export const listarFavoritos = async () => {
  try {
    // Tenta buscar da API primeiro
    const response = await api.get("/gestor/favoritos");

    // Se funcionou, ainda combina com locais
    const favoritosLocais = obterFavoritosLocal();
    const favoritosAPI = response.data || [];

    // Combinar, eliminando duplicados
    const idsAPI = new Set(favoritosAPI.map((f) => f.talentoId));
    const favoritosLocaisSemDuplicados = favoritosLocais.filter(
      (f) => !idsAPI.has(f.talentoId)
    );

    return [...favoritosAPI, ...favoritosLocaisSemDuplicados];
  } catch (error) {
    console.error("Erro ao buscar favoritos da API:", error);

    // Retorna apenas os locais se a API falhar
    return obterFavoritosLocal();
  }
};

export default {
  adicionarFavorito,
  removerFavorito,
  listarFavoritos,
  isFavorito,
};
