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

<<<<<<< HEAD
=======
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

>>>>>>> origin/producao1
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
<<<<<<< HEAD
export async function agendarEntrevista(talentoId: string, entrevista: Omit<Entrevista, "id">) {
  const response = await api.post(`/entrevistas/agendar/${talentoId}`, entrevista);
=======
export async function agendarEntrevista(
  talentoId: string,
  entrevista: Omit<Entrevista, "id">
) {
  const response = await api.post(
    `/entrevistas/agendar/${talentoId}`,
    entrevista
  );
>>>>>>> origin/producao1
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
<<<<<<< HEAD
  status: 'destacado';
=======
  status: "destacado";
>>>>>>> origin/producao1
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
<<<<<<< HEAD
    medalha?: 'ouro' | 'prata' | 'bronze';
=======
    medalha?: "ouro" | "prata" | "bronze";
>>>>>>> origin/producao1
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
<<<<<<< HEAD
    tipo: 'estagio' | 'trainee' | 'junior';
=======
    tipo: "estagio" | "trainee" | "junior";
>>>>>>> origin/producao1
    descricao: string;
  };
  createdAt: Date;
}

// Serviço Gestor
const gestorService = {
  // Projetos Destacados
  buscarProjetosDestacados: async (): Promise<ProjetoDestacado[]> => {
<<<<<<< HEAD
    const response = await api.get('/gestor/projetos/destacados');
=======
    const response = await api.get("/gestor/projetos/destacados");
>>>>>>> origin/producao1
    return response.data;
  },

  buscarProjetoDestacado: async (id: number): Promise<ProjetoDestacado> => {
    const response = await api.get(`/gestor/projetos/${id}`);
    return response.data;
  },

  // Feedback e Oportunidades
<<<<<<< HEAD
  enviarFeedback: async (projetoId: number, feedback: Omit<Feedback, 'id' | 'projetoId' | 'gestorId' | 'createdAt'>): Promise<Feedback> => {
    const response = await api.post(`/gestor/projetos/${projetoId}/feedback`, feedback);
=======
  enviarFeedback: async (
    projetoId: number,
    feedback: Omit<Feedback, "id" | "projetoId" | "gestorId" | "createdAt">
  ): Promise<Feedback> => {
    const response = await api.post(
      `/gestor/projetos/${projetoId}/feedback`,
      feedback
    );
>>>>>>> origin/producao1
    return response.data;
  },

  // Estatísticas
  buscarEstatisticas: async () => {
<<<<<<< HEAD
    const response = await api.get('/gestor/estatisticas');
=======
    const response = await api.get("/gestor/estatisticas");
>>>>>>> origin/producao1
    return response.data;
  },

  // Talentos
  buscarTalentos: async () => {
<<<<<<< HEAD
    const response = await api.get('/gestor/talentos');
=======
    const response = await api.get("/gestor/talentos");
>>>>>>> origin/producao1
    return response.data;
  },

  buscarHistoricoInteracoes: async (talentoId: number) => {
    const response = await api.get(`/gestor/talentos/${talentoId}/historico`);
    return response.data;
<<<<<<< HEAD
  }
};

export default gestorService; 
=======
  },
};

export default gestorService;
>>>>>>> origin/producao1
