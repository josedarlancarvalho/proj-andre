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
<<<<<<< HEAD
  const response = await api.post("/projetos", projeto);
=======
  console.log("Submetendo projeto:", projeto);
  try {
    // Garantir que tecnologias seja um array
    if (projeto.tecnologias && !Array.isArray(projeto.tecnologias)) {
      if (typeof projeto.tecnologias === "string") {
        try {
          projeto.tecnologias = JSON.parse(
            projeto.tecnologias as unknown as string
          );
        } catch (e) {
          projeto.tecnologias = [projeto.tecnologias as unknown as string];
        }
      } else {
        projeto.tecnologias = [projeto.tecnologias as unknown as string];
      }
    }

    // Normalizar tecnologias
    projeto.tecnologias = (projeto.tecnologias || [])
      .map((tech: string) => tech.trim().toLowerCase())
      .filter((tech: string) => tech.length > 0);

    console.log("Projeto processado para envio:", projeto);

    // Validações adicionais
    if (!projeto.titulo || projeto.titulo.trim() === "") {
      throw new Error("Título do projeto é obrigatório");
    }

    if (!projeto.descricao || projeto.descricao.trim() === "") {
      throw new Error("Descrição do projeto é obrigatória");
    }

    if (projeto.tecnologias.length > 10) {
      throw new Error("Máximo de 10 tecnologias permitidas");
    }

    // Certifique-se de que a URL não tenha prefixo duplicado
    const response = await api.post("jovem/projetos", projeto);
    console.log("Projeto submetido com sucesso:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao submeter projeto:", error);

    // Tratamento de erros detalhado
    if (error.response) {
      console.error("Detalhes do erro da API:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });

      // Extrair mensagens de erro da resposta do servidor
      const errorMessages = error.response.data?.errors
        ? error.response.data.errors.map((err: any) => err.message).join(", ")
        : error.response.data?.message || "Erro desconhecido";

      throw {
        message: `Erro ao submeter projeto: ${errorMessages}`,
        details: error.response.data,
        status: error.response.status,
      };
    } else if (error.request) {
      console.error("Sem resposta do servidor:", error.request);
      throw {
        message: "Sem resposta do servidor. Verifique sua conexão.",
        details: error.request,
        status: 0,
      };
    } else {
      console.error("Erro na configuração da requisição:", error.message);
      throw {
        message: error.message || "Erro ao submeter projeto",
        details: error,
        status: 500,
      };
    }
  }
}

// Buscar projetos do jovem
export async function buscarMeusProjetos() {
  console.log("Buscando meus projetos");
  try {
    const response = await api.get("/api/jovem/projetos/meus");
    console.log("Projetos recebidos:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar projetos:", error);
    throw error;
  }
}

// Buscar feedbacks recebidos
export async function buscarFeedbacks() {
  const response = await api.get("/api/jovem/feedbacks");
>>>>>>> origin/producao1
  return response.data;
}

// Buscar convites recebidos
export async function buscarConvites() {
<<<<<<< HEAD
  const response = await api.get("/convites");
=======
  const response = await api.get("/api/jovem/convites");
>>>>>>> origin/producao1
  return response.data;
}

// Responder a um convite
export async function responderConvite(conviteId: string, aceito: boolean) {
<<<<<<< HEAD
  const response = await api.post(`/convites/${conviteId}/responder`, {
    aceito,
  });
=======
  const response = await api.post(
    `/api/jovem/convites/${conviteId}/responder`,
    {
      aceito,
    }
  );
>>>>>>> origin/producao1
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
<<<<<<< HEAD
  const response = await api.put("/jovem/perfil", dados);
=======
  const response = await api.put("/api/jovem/perfil", dados);
>>>>>>> origin/producao1
  return response.data;
}

// Completar onboarding
export async function completarOnboarding(dados: {
  experiences?: string;
  portfolioLinks?: string;
  educationalBackground?: string;
}) {
<<<<<<< HEAD
  const response = await api.post("/jovem/onboarding", dados);
=======
  const response = await api.post("/api/jovem/onboarding", dados);
>>>>>>> origin/producao1
  return response.data;
}

// Serviço Jovem
const jovemService = {
  // Projetos
  criarProjeto: async (
    projeto: Omit<Projeto, "id" | "status" | "usuarioId">
  ): Promise<Projeto> => {
<<<<<<< HEAD
    const response = await api.post("/jovem/projetos", projeto);
    return response.data;
=======
    console.log("JovemService - Criando projeto:", projeto);
    try {
      const response = await api.post("jovem/projetos", projeto);
      console.log("JovemService - Projeto criado:", response.data);
      return response.data;
    } catch (error) {
      console.error("JovemService - Erro ao criar projeto:", error);
      throw error;
    }
>>>>>>> origin/producao1
  },

  atualizarProjeto: async (
    id: number,
    projeto: Partial<Omit<Projeto, "id" | "status" | "usuarioId">>
  ): Promise<Projeto> => {
<<<<<<< HEAD
    const response = await api.put(`/jovem/projetos/${id}`, projeto);
=======
    const response = await api.put(`jovem/projetos/${id}`, projeto);
>>>>>>> origin/producao1
    return response.data;
  },

  excluirProjeto: async (id: number): Promise<void> => {
<<<<<<< HEAD
    await api.delete(`/jovem/projetos/${id}`);
  },

  buscarMeusProjetos: async (): Promise<ProjetoComAvaliacao[]> => {
    const response = await api.get("/jovem/projetos/meus");
    return response.data;
  },

  buscarProjeto: async (id: number): Promise<ProjetoComAvaliacao> => {
    const response = await api.get(`/jovem/projetos/${id}`);
=======
    await api.delete(`jovem/projetos/${id}`);
  },

  buscarMeusProjetos: async (): Promise<ProjetoComAvaliacao[]> => {
    console.log("JovemService - Buscando meus projetos");
    try {
      const response = await api.get("/api/jovem/projetos/meus");
      console.log("JovemService - Projetos recebidos:", response.data);
      return response.data;
    } catch (error) {
      console.error("JovemService - Erro ao buscar projetos:", error);
      throw error;
    }
  },

  buscarProjeto: async (id: number): Promise<ProjetoComAvaliacao> => {
    const response = await api.get(`jovem/projetos/${id}`);
>>>>>>> origin/producao1
    return response.data;
  },

  // Perfil e Estatísticas
  buscarPerfil: async () => {
<<<<<<< HEAD
    const response = await api.get("/jovem/perfil");
=======
    const response = await api.get("/api/jovem/perfil");
>>>>>>> origin/producao1
    return response.data;
  },

  atualizarPerfil: async (dados: any) => {
<<<<<<< HEAD
    const response = await api.put("/jovem/perfil", dados);
=======
    const response = await api.put("/api/jovem/perfil", dados);
>>>>>>> origin/producao1
    return response.data;
  },

  buscarEstatisticas: async () => {
<<<<<<< HEAD
    const response = await api.get("/jovem/estatisticas");
    return response.data;
  },

  // Feedbacks
  buscarFeedbacks: async (): Promise<Feedback[]> => {
    const response = await api.get("/jovem/feedbacks");
    return response.data;
  },

  // Convites
  buscarConvites: async (): Promise<Convite[]> => {
    const response = await api.get("/jovem/convites");
    return response.data;
=======
    const response = await api.get("/api/jovem/estatisticas");
    return response.data;
  },

  // Serviço para buscar feedbacks de um projeto
  buscarFeedbackProjeto: async (projetoId: number): Promise<any> => {
    try {
      console.log(`Solicitando feedback para o projeto ID: ${projetoId}`);
      const response = await api.get(
        `/api/jovem/projetos/${projetoId}/feedback`
      );
      console.log(
        `Feedback recebido para o projeto ID: ${projetoId}:`,
        response.data
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar feedback do projeto:", error);
      throw error;
    }
>>>>>>> origin/producao1
  },
};

export default jovemService;
