import api from "./api";

export interface Projeto {
  id: number;
  titulo: string;
  descricao: string;
  tecnologias: string[];
  linkRepositorio?: string;
  linkDeploy?: string;
  status: "pendente" | "avaliado" | "destacado";
  usuarioId: number;
}

export interface Feedback {
  id: string;
  projetoId: string;
  avaliadorNome: string;
  comentario: string;
  nota: number;
  medalha?: "ouro" | "prata" | "bronze";
  dataAvaliacao: string;
}

export interface Convite {
  id: string;
  empresa: string;
  cargo: string;
  descricao: string;
  tipo: "entrevista" | "projeto";
  status: "pendente" | "aceito" | "recusado";
  dataExpiracao: string;
}

interface ProjetoComAvaliacao extends Projeto {
  avaliacao?: {
    id: number;
    nota: number;
    comentario: string;
    medalha?: "ouro" | "prata" | "bronze";
    avaliador: {
      id: number;
      nomeCompleto: string;
    };
  };
  feedback?: {
    id: number;
    comentario: string;
    oportunidade?: {
      tipo: "estagio" | "trainee" | "junior";
      descricao: string;
    };
    gestor: {
      id: number;
      nomeCompleto: string;
    };
    createdAt: Date;
  };
}

// Submeter novo projeto
export async function submeterProjeto(projeto: Omit<Projeto, "id" | "status">) {
  const response = await api.post("/projetos", projeto);
  return response.data;
}

// Buscar projetos do jovem
export async function buscarMeusProjetos() {
  const response = await api.get("/projetos/meus");
  return response.data;
}

// Buscar feedbacks recebidos
export async function buscarFeedbacks() {
  const response = await api.get("/feedbacks");
  return response.data;
}

// Buscar convites recebidos
export async function buscarConvites() {
  const response = await api.get("/convites");
  return response.data;
}

// Responder a um convite
export async function responderConvite(conviteId: string, aceito: boolean) {
  const response = await api.post(`/convites/${conviteId}/responder`, {
    aceito,
  });
  return response.data;
}

// Atualizar perfil do jovem
export async function atualizarPerfil(dados: {
  nomeCompleto?: string;
  telefone?: string;
  cidade?: string;
  estado?: string;
  bio?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioLinks?: string;
  areasInteresse?: string[];
  habilidadesPrincipais?: string[];
  formacaoCurso?: string;
  formacaoInstituicao?: string;
  formacaoPeriodo?: string;
  gender?: string;
  genderOther?: string;
  collegeModality?: string;
  collegeType?: string;
  experienceDescription?: string;
  specialBadge?: string;
}) {
  const response = await api.put("/jovem/perfil", dados);
  return response.data;
}

// Completar onboarding
export async function completarOnboarding(dados: {
  experiences?: string;
  portfolioLinks?: string;
  educationalBackground?: string;
}) {
  const response = await api.post("/jovem/onboarding", dados);
  return response.data;
}

// Serviço Jovem
const jovemService = {
  // Projetos
  criarProjeto: async (
    projeto: Omit<Projeto, "id" | "status" | "usuarioId">
  ): Promise<Projeto> => {
    const response = await api.post("/jovem/projetos", projeto);
    return response.data;
  },

  atualizarProjeto: async (
    id: number,
    projeto: Partial<Omit<Projeto, "id" | "status" | "usuarioId">>
  ): Promise<Projeto> => {
    const response = await api.put(`/jovem/projetos/${id}`, projeto);
    return response.data;
  },

  excluirProjeto: async (id: number): Promise<void> => {
    await api.delete(`/jovem/projetos/${id}`);
  },

  buscarMeusProjetos: async (): Promise<ProjetoComAvaliacao[]> => {
    const response = await api.get("/jovem/projetos");
    return response.data;
  },

  buscarProjeto: async (id: number): Promise<ProjetoComAvaliacao> => {
    const response = await api.get(`/jovem/projetos/${id}`);
    return response.data;
  },

  // Perfil e Estatísticas
  buscarPerfil: async () => {
    const response = await api.get("/jovem/perfil");
    return response.data;
  },

  atualizarPerfil: async (dados: any) => {
    const response = await api.put("/jovem/perfil", dados);
    return response.data;
  },

  buscarEstatisticas: async () => {
    const response = await api.get("/jovem/estatisticas");
    return response.data;
  },
};

export default jovemService;
