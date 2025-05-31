import api from "./api";
import { toast } from "sonner";

// Interface para entrevistas
interface Entrevista {
  id: string;
  talentoId: string;
  talentoNome: string;
  gestorId: string;
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
const obterEntrevistasLocal = (): Entrevista[] => {
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
      `/entrevistas/agendar/${entrevistaDados.talentoId}`,
      entrevistaDados
    );

    // Mesmo que a API tenha funcionado, salvamos localmente também
    const entrevistas = obterEntrevistasLocal();

    // Criar objeto de entrevista com ID único
    const novaEntrevista: Entrevista = {
      id: `local_${Date.now()}`,
      talentoId: entrevistaDados.talentoId,
      talentoNome: entrevistaDados.talentoNome || "Candidato",
      gestorId: "1", // ID do gestor logado (mock)
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
      gestorId: "1", // ID do gestor logado (mock)
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
    // Tentar buscar da API primeiro
    const response = await api.get("/entrevistas");
    const entrevistasAPI = response.data || [];

    // Buscar entrevistas locais
    const entrevistasLocal = obterEntrevistasLocal();

    // Combinar, eliminando duplicados (por simplicidade, consideramos todas)
    return [...entrevistasAPI, ...entrevistasLocal];
  } catch (error) {
    console.error("Erro ao buscar entrevistas da API:", error);

    // Mock com dados da Maria Silva (para manter compatibilidade)
    const entrevistasLocal = obterEntrevistasLocal();

    // Se não houver entrevistas locais, adicionar a entrevista da Maria Silva
    if (entrevistasLocal.length === 0) {
      const entrevistaMaria: Entrevista = {
        id: "1",
        talentoId: "2",
        talentoNome: "Maria Silva",
        gestorId: "1",
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

export const cancelarEntrevista = async (entrevistaId) => {
  try {
    // Tentar usar a API primeiro
    const response = await api.put(`/entrevistas/${entrevistaId}/cancelar`);

    // Atualizar localmente também
    const entrevistas = obterEntrevistasLocal();
    const entrevistaIndex = entrevistas.findIndex((e) => e.id === entrevistaId);

    if (entrevistaIndex >= 0) {
      entrevistas[entrevistaIndex].status = "cancelada";
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
      entrevistas[entrevistaIndex].status = "cancelada";
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
    }

    throw new Error("Entrevista não encontrada");
  }
};

export default {
  agendarEntrevista,
  buscarEntrevistas,
  cancelarEntrevista,
};
