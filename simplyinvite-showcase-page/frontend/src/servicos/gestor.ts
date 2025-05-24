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

// Buscar talentos em destaque
export async function buscarTalentosDestaque() {
  const response = await api.get("/talentos/destaque");
  return response.data;
}

// Buscar entrevistas agendadas
export async function buscarEntrevistas() {
  const response = await api.get("/entrevistas");
  return response.data;
}

// Agendar entrevista
export async function agendarEntrevista(talentoId: string, entrevista: Omit<Entrevista, "id">) {
  const response = await api.post(`/entrevistas/agendar/${talentoId}`, entrevista);
  return response.data;
}

// Favoritar um talento
export async function favoritarTalento(talentoId: string) {
  const response = await api.post(`/talentos/${talentoId}/favoritar`);
  return response.data;
}

// Remover dos favoritos
export async function removerFavorito(talentoId: string) {
  const response = await api.delete(`/talentos/${talentoId}/favoritar`);
  return response.data;
}

// Buscar estatísticas do gestor
export async function buscarEstatisticasGestor() {
  const response = await api.get("/gestor/estatisticas");
  return response.data;
}

// Buscar talentos por área
export async function buscarTalentosPorArea(area: string) {
  const response = await api.get(`/talentos/area/${area}`);
  return response.data;
}

// Interfaces
interface ProjetoDestacado {
  id: number;
  titulo: string;
  descricao: string;
  tecnologias: string[];
  linkRepositorio?: string;
  linkDeploy?: string;
  status: 'destacado';
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
    medalha?: 'ouro' | 'prata' | 'bronze';
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
    tipo: 'estagio' | 'trainee' | 'junior';
    descricao: string;
  };
  createdAt: Date;
}

// Serviço Gestor
const gestorService = {
  // Projetos Destacados
  buscarProjetosDestacados: async (): Promise<ProjetoDestacado[]> => {
    const response = await api.get('/gestor/projetos/destacados');
    return response.data;
  },

  buscarProjetoDestacado: async (id: number): Promise<ProjetoDestacado> => {
    const response = await api.get(`/gestor/projetos/${id}`);
    return response.data;
  },

  // Feedback e Oportunidades
  enviarFeedback: async (projetoId: number, feedback: Omit<Feedback, 'id' | 'projetoId' | 'gestorId' | 'createdAt'>): Promise<Feedback> => {
    const response = await api.post(`/gestor/projetos/${projetoId}/feedback`, feedback);
    return response.data;
  },

  // Estatísticas
  buscarEstatisticas: async () => {
    const response = await api.get('/gestor/estatisticas');
    return response.data;
  },

  // Talentos
  buscarTalentos: async () => {
    const response = await api.get('/gestor/talentos');
    return response.data;
  },

  buscarHistoricoInteracoes: async (talentoId: number) => {
    const response = await api.get(`/gestor/talentos/${talentoId}/historico`);
    return response.data;
  }
};

export default gestorService; 