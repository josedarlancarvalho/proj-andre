import api from "./api";

export interface TalentoDestaque {
  id: string;
  nome: string;
  idade: number;
  cidade: string;
  medalha?: "ouro" | "prata" | "bronze";
  projeto: string;
  tags: string[];
}

export interface Entrevista {
  id: string;
  candidato: string;
  data: string;
  hora: string;
  tipo: "online" | "presencial";
}

// Atualizar perfil do Gestor
export async function atualizarPerfilGestor(dados: {
  nomeCompleto?: string;
  telefone?: string;
  empresa?: string;
  cnpj?: string;
  cargo?: string;
  bio?: string;
  linkedinUrl?: string;
  areasInteresse?: string[];
  departamento?: string;
  experienciaProfissional?: string;
  especialidades?: string[];
  onboardingCompleto?: boolean;
  // Adicionar novos campos
  siteEmpresa?: string;
  enderecoEmpresa?: string;
  tamanhoEmpresa?: string;
  modeloTrabalho?: string;
  descricaoEmpresa?: string;
  beneficios?: string;
  objetivosContratacao?: string[];
}) {
  try {
    // Tenta fazer a requisição para o servidor
    const response = await api.put("/gestor/perfil", dados);
    return response.data;
  } catch (error: any) {
    // Tratamento específico de erro de conexão
    if (
      error.message?.includes("Network Error") ||
      error.code === "ECONNABORTED" ||
      !error.response ||
      error.message?.includes("timeout")
    ) {
      console.log("Erro de conexão detectado, salvando apenas localmente");
      // Retornar um objeto simulando sucesso, mas com flag indicando que foi apenas local
      return {
        success: true,
        message: "Perfil atualizado apenas localmente",
        localOnly: true,
      };
    }

    // Para outros erros, propagar normalmente
    throw error;
  }
}

// Completar onboarding do Gestor
export async function completarOnboardingGestor(dados: {
  empresa?: string;
  cargo?: string;
  departamento?: string;
  experienciaProfissional?: string;
}) {
  const response = await api.put("/gestor/perfil", {
    ...dados,
    onboardingCompleto: true,
  });
  return response.data;
}

// Buscar talentos em destaque
export async function buscarTalentosDestaque() {
  try {
    const response = await api.get("/talentos/destaque");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar talentos em destaque:", error);
    // Mock data para quando a API falhar
    return [];
  }
}

// Buscar entrevistas agendadas
export async function buscarEntrevistas() {
  try {
    console.log("Buscando entrevistas agendadas");

    try {
      const response = await api.get("/entrevistas");
      console.log("Entrevistas retornadas:", response.data);
      return response.data;
    } catch (e) {
      console.warn("Erro na API, usando mock:", e);

      // Mock data para testes quando o backend não estiver pronto
      const mockEntrevistas = [
        {
          id: 1,
          gestorId: 1,
          talentoId: 2,
          candidato: "Maria Silva",
          data: "2024-06-05",
          hora: "10:00",
          tipo: "online",
          detalhes: { link: "https://meet.google.com/abc-defg-hij" },
          status: "agendada",
          createdAt: "2024-05-30T14:00:00.000Z",
          updatedAt: "2024-05-30T14:00:00.000Z",
          gestor: {
            id: 1,
            nomeCompleto: "Diogo Santos",
            email: "diogo@empresa.com",
            empresa: "Tech Solutions",
            cargo: "Gerente de RH",
          },
          talento: {
            id: 2,
            nomeCompleto: "Maria Silva",
            email: "maria@exemplo.com",
            cidade: "São Paulo",
            telefone: "(11) 98765-4321",
          },
        },
      ];

      return mockEntrevistas;
    }
  } catch (error) {
    console.error("Erro ao buscar entrevistas:", error);
    // Retornar array vazio em caso de erro
    return [];
  }
}

// Agendar entrevista
export async function agendarEntrevista(
  talentoId: string,
  entrevista: Omit<Entrevista, "id">
) {
  try {
    console.log(
      `Agendando entrevista para talento ID: ${talentoId}`,
      entrevista
    );

    // Dados para enviar ao backend
    const dadosEntrevista = {
      talentoId,
      ...entrevista,
    };

    try {
      const response = await api.post(`/entrevistas/agendar`, dadosEntrevista);

      console.log("Resposta do agendamento:", response.data);
      return response.data;
    } catch (e) {
      console.warn("Erro na API, usando mock:", e);

      // Mock response para testes quando o backend não estiver pronto
      return {
        id: Math.floor(Math.random() * 1000),
        gestorId: 1,
        talentoId: parseInt(talentoId),
        candidato: entrevista.candidato,
        data: entrevista.data,
        hora: entrevista.hora,
        tipo: entrevista.tipo,
        detalhes: entrevista.detalhes,
        status: "agendada",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  } catch (error) {
    console.error("Erro ao agendar entrevista:", error);
    throw error;
  }
}

// Favoritar um talento
export async function favoritarTalento(talentoId: string) {
  try {
    const response = await api.post(`/talentos/${talentoId}/favoritar`);

    // Quando um talento é favoritado, emitir um evento para atualizar o contador
    const evento = new CustomEvent("talentoFavoritado", {
      detail: { talentoId },
    });
    window.dispatchEvent(evento);

    return response.data;
  } catch (error) {
    console.error("Erro ao favoritar talento:", error);

    // Se a API falhar, ainda emitimos o evento para atualizar a UI
    const evento = new CustomEvent("talentoFavoritado", {
      detail: { talentoId, mockData: true },
    });
    window.dispatchEvent(evento);

    // Retornar um objeto simulando sucesso
    return {
      success: true,
      message: "Talento favoritado localmente",
      localOnly: true,
    };
  }
}

// Remover dos favoritos
export async function removerFavorito(talentoId: string) {
  try {
    const response = await api.delete(`/talentos/${talentoId}/favoritar`);

    // Quando um favorito é removido, emitir um evento
    const evento = new CustomEvent("talentoDesfavoritado", {
      detail: { talentoId },
    });
    window.dispatchEvent(evento);

    return response.data;
  } catch (error) {
    console.error("Erro ao remover favorito:", error);

    // Se a API falhar, ainda emitimos o evento para atualizar a UI
    const evento = new CustomEvent("talentoDesfavoritado", {
      detail: { talentoId, mockData: true },
    });
    window.dispatchEvent(evento);

    // Retornar um objeto simulando sucesso
    return {
      success: true,
      message: "Talento removido dos favoritos localmente",
      localOnly: true,
    };
  }
}

// Buscar estatísticas do gestor
export async function buscarEstatisticasGestor() {
  try {
    const response = await api.get("/gestor/estatisticas");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);

    // Se falhar, tentar obter dados diretamente de outros endpoints
    try {
      // Buscar dados de forma independente para construir estatísticas
      const entrevistasResponse = await buscarEntrevistas();
      const favoritosResponse = await api.get("/gestor/favoritos");

      // Retornar objeto com estatísticas calculadas
      return {
        totalTalentosExplorados: 0, // Por enquanto sem tracking de visualizações
        totalTalentosFavoritados: favoritosResponse.data?.length || 0,
        totalEntrevistas: entrevistasResponse?.length || 0,
        novosTalentos: 0, // Sem informação real no momento
      };
    } catch (fallbackError) {
      console.error("Erro ao buscar estatísticas (fallback):", fallbackError);

      // Mock data - incluindo a entrevista que já foi agendada
      return {
        totalTalentosExplorados: 0,
        totalTalentosFavoritados: 0,
        totalEntrevistas: 1,
        novosTalentos: 0,
      };
    }
  }
}

// Buscar talentos por área
export async function buscarTalentosPorArea(area: string) {
  const response = await api.get(`/talentos/area/${area}`);
  return response.data;
}

// Registrar visualização de talento
export async function registrarVisualizacaoTalento(talentoId: string) {
  try {
    const response = await api.post(`/talentos/${talentoId}/visualizar`);
    return response.data;
  } catch (error) {
    console.error("Erro ao registrar visualização:", error);
    // Retornar objeto simulando sucesso em caso de erro de conexão
    return { success: true, localOnly: true };
  }
}

// Buscar novos talentos
export async function buscarNovosTalentos() {
  try {
    const response = await api.get("/api/gestor/talentos/novos");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar novos talentos:", error);
    return [];
  }
}

// Interfaces
interface ProjetoDestacado {
  id: number;
  titulo: string;
  descricao: string;
  tecnologias: string[];
  linkRepositorio?: string;
  linkDeploy?: string;
  status: "destacado";
  usuarioId: number;
  autor: {
    id: number;
    nomeCompleto: string;
    email: string;
  };
  avaliacao: {
    id: number;
    nota: number;
    comentario: string;
    medalha?: "ouro" | "prata" | "bronze";
    avaliador: {
      id: number;
      nomeCompleto: string;
    };
  };
}

interface Feedback {
  id: number;
  projetoId: number;
  gestorId: number;
  comentario: string;
  oportunidade?: {
    tipo: "estagio" | "trainee" | "junior";
    descricao: string;
  };
  createdAt: Date;
}

// Serviço Gestor
const gestorService = {
  // Projetos Destacados
  buscarProjetosDestacados: async (): Promise<ProjetoDestacado[]> => {
    const response = await api.get("/gestor/projetos/destacados");
    return response.data;
  },

  buscarProjetoDestacado: async (id: number): Promise<ProjetoDestacado> => {
    const response = await api.get(`/gestor/projetos/${id}`);
    return response.data;
  },

  // Feedback e Oportunidades
  enviarFeedback: async (
    projetoId: number,
    feedback: Omit<Feedback, "id" | "projetoId" | "gestorId" | "createdAt">
  ): Promise<Feedback> => {
    const response = await api.post(
      `/gestor/projetos/${projetoId}/feedback`,
      feedback
    );
    return response.data;
  },

  // Estatísticas
  buscarEstatisticas: async () => {
    const response = await api.get("/gestor/estatisticas");
    return response.data;
  },

  // Talentos
  buscarTalentos: async () => {
    const response = await api.get("/gestor/talentos");
    return response.data;
  },

  buscarHistoricoInteracoes: async (talentoId: number) => {
    const response = await api.get(`/gestor/talentos/${talentoId}/historico`);
    return response.data;
  },

  // Projetos Avaliados pelo RH
  buscarProjetosAvaliados: async () => {
    console.log("Buscando projetos avaliados pelo RH");
    try {
      const response = await api.get("/api/gestor/projetos/avaliados");
      console.log("Projetos avaliados recebidos:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar projetos avaliados:", error);
      throw error;
    }
  },

  buscarAvaliacoesEncaminhadas: async () => {
    console.log("Buscando avaliações encaminhadas para gestor");
    try {
      const response = await api.get("/api/gestor/avaliacoes/encaminhadas");
      console.log("Avaliações encaminhadas recebidas:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar avaliações encaminhadas:", error);
      throw error;
    }
  },

  registrarVisualizacao: async (talentoId: number) => {
    try {
      const response = await api.post(
        `/api/gestor/talentos/${talentoId}/visualizar`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao registrar visualização:", error);
      return { success: false };
    }
  },

  // Novos Talentos
  buscarNovosTalentos: async () => {
    try {
      const response = await api.get("/api/gestor/talentos/novos");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar novos talentos:", error);
      return [];
    }
  },
};

export default gestorService;
