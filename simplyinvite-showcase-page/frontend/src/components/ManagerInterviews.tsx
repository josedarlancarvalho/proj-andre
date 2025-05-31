import { agendarEntrevista } from "@/servicos/entrevistas";

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // Formatar os dados da entrevista
    const entrevistaDados = {
      talentoId: talentoId,
      talentoNome: talento.nome,
      data: entrevistaData,
      hora: entrevistaHora,
      tipo: entrevistaTipo,
      local: entrevistaLocal,
      link: entrevistaLink,
      observacoes: entrevistaObservacoes,
    };

    // Chamar o serviço para agendar a entrevista
    await agendarEntrevista(entrevistaDados);

    // Fechar o modal e limpar o formulário
    setLoading(false);
    setModalOpen(false);
    resetForm();

    // Mostrar mensagem de sucesso
    toast.success("Entrevista agendada com sucesso!");
  } catch (error) {
    console.error("Erro ao agendar entrevista:", error);
    setLoading(false);
    toast.error("Erro ao agendar entrevista. Tente novamente.");
  }
};
