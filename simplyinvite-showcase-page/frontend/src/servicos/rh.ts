import api from "./api";

// Interfaces
interface Projeto {
  id: number;
  titulo: string;
  descricao: string;
  tecnologias: string[];
  linkRepositorio?: string;
  linkDeploy?: string;
  status: "pendente" | "avaliado" | "destacado";
  usuarioId: number;
  autor?: {
    id: number;
    nomeCompleto: string;
    email: string;
  };
}

interface Avaliacao {
  id: number;
  projetoId: number;
  avaliadorId: number;
  nota: number;
  comentario: string;
  medalha?: "ouro" | "prata" | "bronze";
  encaminhadoParaGestor: boolean;
}

// Atualizar perfil do RH
export async function atualizarPerfilRh(dados: {
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
}) {
  const response = await api.put("/rh/perfil", dados);
  return response.data;
}

// Completar onboarding do RH
export async function completarOnboardingRh(dados: {
  empresa?: string;
  cargo?: string;
  departamento?: string;
  experienciaProfissional?: string;
}) {
  const response = await api.put("/rh/perfil", {
    ...dados,
    onboardingCompleto: true,
  });
  return response.data;
}

// Serviço RH
const rhService = {
  // Projetos
  buscarProjetosPendentes: async (): Promise<Projeto[]> => {
    const response = await api.get("/rh/projetos/pendentes");
    return response.data;
  },

  // Avaliações
  buscarHistoricoAvaliacoes: async (): Promise<Avaliacao[]> => {
    const response = await api.get("/rh/avaliacoes/historico");
    return response.data;
  },

  avaliarProjeto: async (
    projetoId: number,
    avaliacao: Omit<Avaliacao, "id" | "projetoId" | "avaliadorId">
  ): Promise<Avaliacao> => {
    const response = await api.post(
      `/rh/avaliacoes/projeto/${projetoId}`,
      avaliacao
    );
    return response.data;
  },

  encaminharParaGestor: async (avaliacaoId: number): Promise<Avaliacao> => {
    const response = await api.post(`/rh/avaliacoes/${avaliacaoId}/encaminhar`);
    return response.data;
  },

  // Estatísticas
  buscarEstatisticas: async () => {
    const response = await api.get("/rh/estatisticas");
    return response.data;
  },

  // Perfil e Onboarding
  buscarPerfil: async () => {
    const response = await api.get("/rh/perfil");
    return response.data;
  },

  atualizarPerfil: async (dados: any) => {
    const response = await api.put("/rh/perfil", dados);
    return response.data;
  },

  completarOnboarding: async (dados: any) => {
    const response = await api.put("/rh/perfil", {
      ...dados,
      onboardingCompleto: true,
    });
    return response.data;
  },
};

export default rhService;
