import api from "./api";
import { toast } from "sonner";

// Interface para entrevistas
interface Entrevista {
  id: string;
  talentoId: string;
  talentoNome: string;
  gestorId: string;
  gestorNome?: string;
  empresa?: string;
  data: string;
  hora: string;
  tipo: "online" | "presencial";
  local?: string;
  link?: string;
  observacoes?: string;
  status: "agendada" | "cancelada" | "realizada";
  dataCriacao: string;
}

// Chave para armazenamento local
const ENTREVISTAS_KEY = "simplyinvite_entrevistas";

// Função para obter entrevistas do localStorage
export const obterEntrevistasLocal = (): Entrevista[] => {
  try {
    const entrevistasString = localStorage.getItem(ENTREVISTAS_KEY);
    return entrevistasString ? JSON.parse(entrevistasString) : [];
  } catch (e) {
    console.error("Erro ao ler entrevistas do localStorage:", e);
    return [];
  }
};

// Função para salvar entrevistas no localStorage
const salvarEntrevistasLocal = (entrevistas: Entrevista[]): void => {
  try {
    localStorage.setItem(ENTREVISTAS_KEY, JSON.stringify(entrevistas));
  } catch (e) {
    console.error("Erro ao salvar entrevistas no localStorage:", e);
  }
};

// Gerar um link de reunião Google Meet simulado
const gerarLinkReuniao = (): string => {
  const letras = "abcdefghijklmnopqrstuvwxyz";
  let codigo = "";
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      codigo += letras.charAt(Math.floor(Math.random() * letras.length));
    }
    if (i < 2) codigo += "-";
  }
  return `https://meet.google.com/${codigo}`;
};

export const agendarEntrevista = async (entrevistaDados) => {
  try {
    // Garantir que temos a data e hora corretas
    if (!entrevistaDados.data || !entrevistaDados.hora) {
      throw new Error("Data e hora são obrigatórios para agendar entrevista");
    }

    // Tentar usar a API primeiro
    const response = await api.post(
      `/api/entrevistas/agendar/${entrevistaDados.talentoId}`,
      entrevistaDados
    );

    // Mesmo que a API tenha funcionado, salvamos localmente também
    const entrevistas = obterEntrevistasLocal();

    // Criar objeto de entrevista com ID único
    const novaEntrevista: Entrevista = {
      id: response.data?.id || `local_${Date.now()}`,
      talentoId: entrevistaDados.talentoId,
      talentoNome: entrevistaDados.talentoNome || "Candidato",
      gestorId: entrevistaDados.gestorId || "1", // ID do gestor logado (mock)
      gestorNome: entrevistaDados.gestorNome || "Gestor",
      empresa: entrevistaDados.empresa || "Empresa",
      data: entrevistaDados.data,
      hora: entrevistaDados.hora,
      tipo: entrevistaDados.tipo || "online",
      local: entrevistaDados.local,
      link:
        entrevistaDados.link ||
        (entrevistaDados.tipo === "online" ? gerarLinkReuniao() : undefined),
      observacoes: entrevistaDados.observacoes,
      status: "agendada",
      dataCriacao: new Date().toISOString(),
    };

    entrevistas.push(novaEntrevista);
    salvarEntrevistasLocal(entrevistas);

    // Emitir evento para atualização da interface
    const evento = new CustomEvent("entrevistaAgendada", {
      detail: { entrevista: novaEntrevista },
    });
    window.dispatchEvent(evento);

    return response.data;
  } catch (error) {
    console.error("Erro na API ao agendar entrevista:", error);

    // Se a API falhar, salvar apenas localmente
    const entrevistas = obterEntrevistasLocal();

    // Criar objeto de entrevista com ID único
    const novaEntrevista: Entrevista = {
      id: `local_${Date.now()}`,
      talentoId: entrevistaDados.talentoId,
      talentoNome: entrevistaDados.talentoNome || "Candidato",
      gestorId: entrevistaDados.gestorId || "1", // ID do gestor logado (mock)
      gestorNome: entrevistaDados.gestorNome || "Gestor",
      empresa: entrevistaDados.empresa || "Empresa",
      data: entrevistaDados.data,
      hora: entrevistaDados.hora,
      tipo: entrevistaDados.tipo || "online",
      local: entrevistaDados.local,
      link:
        entrevistaDados.link ||
        (entrevistaDados.tipo === "online" ? gerarLinkReuniao() : undefined),
      observacoes: entrevistaDados.observacoes,
      status: "agendada",
      dataCriacao: new Date().toISOString(),
    };

    entrevistas.push(novaEntrevista);
    salvarEntrevistasLocal(entrevistas);

    // Emitir evento para atualização da interface
    const evento = new CustomEvent("entrevistaAgendada", {
      detail: { entrevista: novaEntrevista },
    });
    window.dispatchEvent(evento);

    return {
      success: true,
      message: "Entrevista agendada localmente",
      data: novaEntrevista,
      localOnly: true,
    };
  }
};

export const buscarEntrevistas = async () => {
  try {
    console.log("Buscando entrevistas...");
    // Tentar buscar da API primeiro
    const response = await api.get("/api/jovem/entrevistas");
    console.log("Resposta da API de entrevistas:", response.data);
    const entrevistasAPI = response.data || [];

    // Buscar entrevistas locais
    const entrevistasLocal = obterEntrevistasLocal();
    console.log("Entrevistas locais:", entrevistasLocal);

    // Combinar, eliminando duplicados (por ID)
    const idsAPI = new Set(entrevistasAPI.map((e) => e.id));
    const entrevistasLocalSemDuplicados = entrevistasLocal.filter(
      (e) => !idsAPI.has(e.id)
    );

    const todasEntrevistas = [
      ...entrevistasAPI,
      ...entrevistasLocalSemDuplicados,
    ];
    console.log(
      "Total de entrevistas após combinação:",
      todasEntrevistas.length
    );
    return todasEntrevistas;
  } catch (error) {
    console.error("Erro ao buscar entrevistas da API:", error);

    // Retornar entrevistas locais se a API falhar
    const entrevistasLocal = obterEntrevistasLocal();
    console.log("Usando apenas entrevistas locais:", entrevistasLocal);

    // Se não houver entrevistas locais, adicionar a entrevista da Maria Silva para exemplo
    if (entrevistasLocal.length === 0) {
      const entrevistaMaria: Entrevista = {
        id: "1",
        talentoId: "2",
        talentoNome: "Maria Silva",
        gestorId: "1",
        gestorNome: "Diogo Santos",
        empresa: "Tech Solutions",
        data: "2024-06-04",
        hora: "10:00",
        tipo: "online",
        link: "https://meet.google.com/abc-defg-hij",
        status: "agendada",
        dataCriacao: "2024-05-30T14:00:00.000Z",
      };

      entrevistasLocal.push(entrevistaMaria);
      salvarEntrevistasLocal(entrevistasLocal);
    }

    return entrevistasLocal;
  }
};

// Função para excluir uma entrevista localmente
export const excluirEntrevistaLocal = (entrevistaId: string): boolean => {
  try {
    console.log(
      `Excluindo entrevista ID: ${entrevistaId} diretamente do localStorage`
    );
    const entrevistas = obterEntrevistasLocal();
    const entrevistaIndex = entrevistas.findIndex((e) => e.id === entrevistaId);

    if (entrevistaIndex >= 0) {
      // Remover a entrevista do array
      entrevistas.splice(entrevistaIndex, 1);
      salvarEntrevistasLocal(entrevistas);

      // Emitir evento de entrevista cancelada
      const evento = new CustomEvent("entrevistaCancelada", {
        detail: { entrevistaId },
      });
      window.dispatchEvent(evento);

      return true;
    }

    return false;
  } catch (error) {
    console.error("Erro ao excluir entrevista localmente:", error);
    return false;
  }
};

export const cancelarEntrevista = async (entrevistaId) => {
  try {
    console.log(`Tentando cancelar entrevista ID: ${entrevistaId}`);
    // Tentar usar a API primeiro
    const response = await api.put(`/api/entrevistas/${entrevistaId}/cancelar`);
    console.log("Resposta da API ao cancelar entrevista:", response.data);

    // Remover do localStorage (em vez de apenas atualizar o status)
    const entrevistas = obterEntrevistasLocal();
    const entrevistaIndex = entrevistas.findIndex((e) => e.id === entrevistaId);

    if (entrevistaIndex >= 0) {
      console.log(`Entrevista encontrada localmente. Removendo...`);
      // Remover a entrevista do array
      entrevistas.splice(entrevistaIndex, 1);
      salvarEntrevistasLocal(entrevistas);
    }

    // Emitir evento de entrevista cancelada
    const evento = new CustomEvent("entrevistaCancelada", {
      detail: { entrevistaId },
    });
    window.dispatchEvent(evento);

    return response.data;
  } catch (error) {
    console.error("Erro na API ao cancelar entrevista:", error);

    // Atualizar localmente
    const entrevistas = obterEntrevistasLocal();
    const entrevistaIndex = entrevistas.findIndex((e) => e.id === entrevistaId);

    if (entrevistaIndex >= 0) {
      console.log(
        `Falha na API, mas entrevista encontrada localmente. Removendo...`
      );
      // Remover a entrevista do array
      entrevistas.splice(entrevistaIndex, 1);
      salvarEntrevistasLocal(entrevistas);

      // Emitir evento de entrevista cancelada
      const evento = new CustomEvent("entrevistaCancelada", {
        detail: { entrevistaId },
      });
      window.dispatchEvent(evento);

      return {
        success: true,
        message: "Entrevista cancelada localmente",
        localOnly: true,
      };
    } else {
      throw new Error("Entrevista não encontrada");
    }
  }
};

// Função para buscar entrevistas para um jovem específico
export const buscarEntrevistasJovem = async (talentoId) => {
  try {
    console.log(`Buscando entrevistas para o jovem ID: ${talentoId}`);
    // Tentar buscar da API primeiro
    const response = await api.get(`/api/jovem/entrevistas`);
    console.log("Resposta da API de entrevistas do jovem:", response.data);
    const entrevistasAPI = response.data || [];

    // Buscar entrevistas locais
    const todasEntrevistasLocal = obterEntrevistasLocal();
    console.log("Todas entrevistas locais:", todasEntrevistasLocal);

    // Filtrar apenas as entrevistas do jovem específico
    const entrevistasLocalJovem = todasEntrevistasLocal.filter(
      (e) => e.talentoId === talentoId
    );
    console.log("Entrevistas locais do jovem:", entrevistasLocalJovem);

    // Combinar, eliminando duplicados (por ID)
    const idsAPI = new Set(entrevistasAPI.map((e) => e.id));
    const entrevistasLocalSemDuplicados = entrevistasLocalJovem.filter(
      (e) => !idsAPI.has(e.id)
    );

    const todasEntrevistas = [
      ...entrevistasAPI,
      ...entrevistasLocalSemDuplicados,
    ];
    console.log(
      "Total de entrevistas do jovem após combinação:",
      todasEntrevistas.length
    );
    return todasEntrevistas;
  } catch (error) {
    console.error("Erro ao buscar entrevistas do jovem da API:", error);

    // Retornar entrevistas locais se a API falhar
    const todasEntrevistasLocal = obterEntrevistasLocal();

    // Filtrar apenas as entrevistas do jovem específico
    const entrevistasLocalJovem = todasEntrevistasLocal.filter(
      (e) => e.talentoId === talentoId
    );
    console.log(
      "Usando apenas entrevistas locais do jovem:",
      entrevistasLocalJovem
    );

    // Se não houver entrevistas locais para este jovem, adicionar uma entrevista de exemplo
    if (entrevistasLocalJovem.length === 0 && talentoId) {
      const entrevistaExemplo: Entrevista = {
        id: `mock_${Date.now()}`,
        talentoId: talentoId,
        talentoNome: "Jovem Talento",
        gestorId: "1",
        gestorNome: "Diogo Santos",
        empresa: "Tech Solutions",
        data: "2024-06-15",
        hora: "14:30",
        tipo: "online",
        link: "https://meet.google.com/abc-defg-hij",
        observacoes:
          "Venha preparado para falar sobre seus projetos e experiências. Estamos ansiosos para conhecer seu trabalho!",
        status: "agendada",
        dataCriacao: new Date().toISOString(),
      };

      entrevistasLocalJovem.push(entrevistaExemplo);

      // Adicionar às entrevistas locais armazenadas
      todasEntrevistasLocal.push(entrevistaExemplo);
      salvarEntrevistasLocal(todasEntrevistasLocal);
    }

    return entrevistasLocalJovem;
  }
};

// Função para editar uma entrevista
export const editarEntrevista = async (
  entrevistaId: string,
  dadosAtualizados: Partial<Entrevista>
) => {
  try {
    console.log(
      `Tentando editar entrevista ID: ${entrevistaId}`,
      dadosAtualizados
    );
    // Tentar usar a API primeiro
    const response = await api.put(
      `/api/entrevistas/${entrevistaId}`,
      dadosAtualizados
    );
    console.log("Resposta da API ao editar entrevista:", response.data);

    // Atualizar localmente também
    const entrevistas = obterEntrevistasLocal();
    const entrevistaIndex = entrevistas.findIndex((e) => e.id === entrevistaId);

    if (entrevistaIndex >= 0) {
      console.log(`Entrevista encontrada localmente. Atualizando...`);
      entrevistas[entrevistaIndex] = {
        ...entrevistas[entrevistaIndex],
        ...dadosAtualizados,
        // Preservar o ID da entrevista
        id: entrevistaId,
      };
      salvarEntrevistasLocal(entrevistas);
    }

    // Emitir evento de entrevista atualizada
    const evento = new CustomEvent("entrevistaAtualizada", {
      detail: { entrevistaId, dadosAtualizados },
    });
    window.dispatchEvent(evento);

    return response.data;
  } catch (error) {
    console.error("Erro na API ao editar entrevista:", error);

    // Atualizar localmente
    const entrevistas = obterEntrevistasLocal();
    const entrevistaIndex = entrevistas.findIndex((e) => e.id === entrevistaId);

    if (entrevistaIndex >= 0) {
      console.log(
        `Falha na API, mas entrevista encontrada localmente. Atualizando...`
      );
      entrevistas[entrevistaIndex] = {
        ...entrevistas[entrevistaIndex],
        ...dadosAtualizados,
        // Preservar o ID da entrevista
        id: entrevistaId,
      };
      salvarEntrevistasLocal(entrevistas);

      // Emitir evento de entrevista atualizada
      const evento = new CustomEvent("entrevistaAtualizada", {
        detail: { entrevistaId, dadosAtualizados },
      });
      window.dispatchEvent(evento);

      return {
        success: true,
        message: "Entrevista atualizada localmente",
        localOnly: true,
        entrevista: entrevistas[entrevistaIndex],
      };
    } else {
      throw new Error("Entrevista não encontrada");
    }
  }
};

// Exportar a interface Entrevista para ser usada em outros componentes
export type { Entrevista };

export default {
  agendarEntrevista,
  buscarEntrevistas,
  buscarEntrevistasJovem,
  cancelarEntrevista,
  obterEntrevistasLocal,
  excluirEntrevistaLocal,
  editarEntrevista,
};
