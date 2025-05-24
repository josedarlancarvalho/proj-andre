import api from "./api";

// Interfaces
interface Projeto {
  id: number;
  titulo: string;
  descricao: string;
  tecnologias: string[];
  linkRepositorio?: string;
  linkDeploy?: string;
  status: 'pendente' | 'avaliado' | 'destacado';
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
  medalha?: 'ouro' | 'prata' | 'bronze';
  encaminhadoParaGestor: boolean;
}

// Serviço RH
const rhService = {
  // Projetos
  buscarProjetosPendentes: async (): Promise<Projeto[]> => {
    const response = await api.get('/rh/projetos/pendentes');
    return response.data;
  },

  // Avaliações
  buscarHistoricoAvaliacoes: async (): Promise<Avaliacao[]> => {
    const response = await api.get('/rh/avaliacoes/historico');
    return response.data;
  },

  avaliarProjeto: async (projetoId: number, avaliacao: Omit<Avaliacao, 'id' | 'projetoId' | 'avaliadorId'>): Promise<Avaliacao> => {
    const response = await api.post(`/rh/avaliacoes/projeto/${projetoId}`, avaliacao);
    return response.data;
  },

  encaminharParaGestor: async (avaliacaoId: number): Promise<Avaliacao> => {
    const response = await api.post(`/rh/avaliacoes/${avaliacaoId}/encaminhar`);
    return response.data;
  },

  // Estatísticas
  buscarEstatisticas: async () => {
    const response = await api.get('/rh/estatisticas');
    return response.data;
  }
};

export default rhService; 