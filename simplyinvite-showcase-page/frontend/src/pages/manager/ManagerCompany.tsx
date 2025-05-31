import React, { useState, useEffect } from "react";
import UserPanelLayout from "@/components/UserPanelLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Save, Building, Briefcase, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Interface for Company Profile
interface CompanyProfile {
  name: string;
  industry: string;
  size: string;
  website: string;
  about: string;
  address: string;
  positions: string[];
  areas: string[];
  foundingYear: string;
  workModel: string;
  benefits: string;
  commonPositions: string;
}

// Função para mostrar uma mensagem quando não há dados
const EmptyStateMessage = ({ field }: { field: string }) => (
  <p className="text-muted-foreground italic text-sm">
    {field === "positions"
      ? "Nenhuma posição cadastrada. Edite para adicionar."
      : "Informação não disponível. Clique em Editar para preencher."}
  </p>
);

// Melhorar a formatação do tamanho da empresa
const formatCompanySize = (size: string) => {
  if (!size) return "";

  // Se já tiver "funcionários" no texto, retornar como está
  if (size.toLowerCase().includes("funcionários")) {
    return size;
  }

  // Caso contrário, adicionar a palavra "funcionários"
  return `${size} funcionários`;
};

// Melhorar exibição do modelo de trabalho
const formatWorkModel = (model: string) => {
  if (!model) return "";

  const modelMap = {
    presencial: "Presencial",
    hibrido: "Híbrido",
    remoto: "Remoto",
    variado: "Varia por posição",
  };

  return modelMap[model as keyof typeof modelMap] || model;
};

// Adicionar um componente de diagnóstico
const MostrarDiagnostico = ({ data }) => {
  const [mostrar, setMostrar] = useState(false);

  return (
    <div className="mt-4 p-2 border border-yellow-400 bg-yellow-50 rounded-md">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-yellow-800">
          Diagnóstico de Dados
        </h3>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs"
          onClick={() => setMostrar(!mostrar)}
        >
          {mostrar ? "Ocultar" : "Mostrar"} Detalhes
        </Button>
      </div>

      {mostrar && (
        <div className="mt-2 text-xs font-mono overflow-x-auto">
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

const ManagerCompany = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState("Carregando...");
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>({
    name: "",
    industry: "",
    size: "",
    website: "",
    about: "",
    address: "",
    positions: [],
    areas: [],
    foundingYear: "",
    workModel: "",
    benefits: "",
    commonPositions: "",
  });

  useEffect(() => {
    // Verificar se viemos do onboarding
    const onboardingCompleted =
      sessionStorage.getItem("onboardingCompleted") === "true";
    const onboardingTimestamp = sessionStorage.getItem("onboardingTimestamp");
    const isRecentOnboarding =
      onboardingTimestamp && Date.now() - parseInt(onboardingTimestamp) < 10000; // 10 segundos

    // Verificar se há query param de refresh para garantir dados frescos
    const urlParams = new URLSearchParams(window.location.search);
    const hasRefreshParam = urlParams.has("refresh");

    console.log(
      "*** DEBUG - Verificando origem: onboardingCompleted=",
      onboardingCompleted,
      "isRecentOnboarding=",
      isRecentOnboarding,
      "hasRefreshParam=",
      hasRefreshParam
    );

    // Se viemos do onboarding recentemente, limpar os sinalizadores
    if (onboardingCompleted && isRecentOnboarding) {
      console.log(
        "*** DEBUG - Detectada navegação do onboarding, garantindo dados atualizados"
      );
      sessionStorage.removeItem("onboardingCompleted");
      sessionStorage.removeItem("onboardingTimestamp");

      // Programar uma verificação automática dos dados após o carregamento inicial
      setTimeout(() => {
        console.log(
          "Verificando dados automaticamente após navegação do onboarding..."
        );
        verificarDadosSemReload();
      }, 500);
    }

    const fetchCompanyData = async () => {
      try {
        console.log("Buscando dados da empresa no localStorage...");

        // Verificar se há query param de refresh - isso indica que viemos do formulário
        if (hasRefreshParam) {
          console.log(
            "*** DEBUG - Detectado parâmetro de refresh, garantindo dados atualizados"
          );
          // Limpar o parâmetro da URL para evitar problemas com refresh
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        }

        // Depurar o conteúdo completo do localStorage
        Object.keys(localStorage).forEach((key) => {
          try {
            console.log(`Chave: ${key}, Valor:`, localStorage.getItem(key));
          } catch (e) {
            console.log(`Erro ao ler chave ${key}:`, e);
          }
        });

        // Variável para armazenar os dados encontrados
        let dadosEmpresa = null;

        // ESTRATÉGIA 1: Tentar buscar diretamente do gestorProfileData
        // Usar getItem direto para garantir que estamos pegando os dados mais recentes
        const gestorProfileData = localStorage.getItem("gestorProfileData");
        console.log(
          "*** DEBUG - localStorage gestorProfileData:",
          gestorProfileData
        );

        if (gestorProfileData) {
          try {
            dadosEmpresa = JSON.parse(gestorProfileData);
            console.log(
              "*** DEBUG - Dados encontrados em gestorProfileData:",
              dadosEmpresa
            );
          } catch (e) {
            console.error("Erro ao processar gestorProfileData:", e);
          }
        }

        // ESTRATÉGIA 2: Se não encontrou dados válidos, tentar no objeto user
        if (!dadosEmpresa || !dadosEmpresa.company) {
          const userData = localStorage.getItem("user");
          console.log("*** DEBUG - localStorage user:", userData);

          if (userData) {
            try {
              const userObject = JSON.parse(userData);
              // Usar os dados do usuário se tiver pelo menos um nome de empresa
              if (
                userObject &&
                (userObject.company || userObject.nomeCompleto)
              ) {
                dadosEmpresa = userObject;
                console.log(
                  "*** DEBUG - Dados encontrados em user:",
                  dadosEmpresa
                );
              }
            } catch (e) {
              console.error("Erro ao processar userData:", e);
            }
          }
        }

        // ESTRATÉGIA 3: Se ainda não temos dados, usar dados de teste
        if (
          !dadosEmpresa ||
          (!dadosEmpresa.company && !dadosEmpresa.nomeCompleto)
        ) {
          console.log(
            "*** DEBUG - Nenhum dado válido encontrado, usando dados de teste"
          );
          dadosEmpresa = {
            nomeCompleto: "Usuario Teste",
            phone: "81999999999",
            position: "CEO",
            company: "Empresa Teste",
            companyWebsite: "www.empresateste.com.br",
            companyAddress: "Rua Teste, 123",
            companySize: "11-50",
            workModel: "hibrido",
            companyDescription: "Uma empresa focada em inovação e qualidade",
            companyBenefits: "Vale refeição, Plano de saúde, Home office",
            commonOpenPositions: "Desenvolvedor, Designer, Marketing",
            industryArea: "Tecnologia",
            foundingYear: "2020",
          };
        }

        console.log("*** DEBUG - Dados finais que serão usados:", dadosEmpresa);

        // Definir o nome de usuário se disponível
        if (dadosEmpresa.nomeCompleto) {
          setUserName(dadosEmpresa.nomeCompleto);
        }

        // Atualizar o perfil da empresa com os dados encontrados
        const profileData = {
          name: dadosEmpresa.company || "",
          industry: dadosEmpresa.industryArea || "",
          size: dadosEmpresa.companySize || "",
          website: dadosEmpresa.companyWebsite || "",
          about: dadosEmpresa.companyDescription || "",
          address: dadosEmpresa.companyAddress || "",
          foundingYear: dadosEmpresa.foundingYear || "2020",
          workModel: dadosEmpresa.workModel || "",
          benefits: dadosEmpresa.companyBenefits || "",
          commonPositions: dadosEmpresa.commonOpenPositions || "",
          positions: dadosEmpresa.commonOpenPositions
            ? dadosEmpresa.commonOpenPositions
                .split(",")
                .map((p: string) => p.trim())
            : [],
          areas: dadosEmpresa.industryArea ? [dadosEmpresa.industryArea] : [],
        };

        console.log(
          "*** DEBUG - Perfil atualizado que será exibido:",
          profileData
        );

        // Atualizar o estado do componente
        setCompanyProfile(profileData);
      } catch (error) {
        console.error("Erro ao buscar dados da empresa:", error);
        // Em caso de erro, usar dados de teste
        toast?.error("Erro ao carregar dados. Usando valores padrão.");

        setCompanyProfile({
          name: "Empresa Padrão",
          industry: "Tecnologia",
          size: "1-10",
          website: "www.exemplo.com.br",
          about: "Descrição padrão da empresa",
          address: "Endereço padrão",
          foundingYear: "2020",
          workModel: "hibrido",
          benefits: "Benefícios padrão",
          commonPositions: "Posições padrão",
          positions: ["Desenvolvedor", "Designer"],
          areas: ["Tecnologia"],
        });
      }
    };

    fetchCompanyData();

    // Se temos o parâmetro de refresh, programar uma verificação adicional após o carregamento inicial
    if (hasRefreshParam) {
      // Programar uma verificação adicional após 1 segundo
      setTimeout(() => {
        console.log("Verificação adicional devido ao parâmetro de refresh...");
        verificarDadosSemReload();
      }, 1000);
    }
  }, []);

  // Adicionar evento de storage para detectar mudanças no localStorage
  useEffect(() => {
    // Função para lidar com mudanças no localStorage
    const handleStorageChange = (e) => {
      console.log("Storage changed:", e);
      if (e.key === "gestorProfileData" || e.key === "user") {
        console.log(`${e.key} foi alterado, recarregando dados...`);
        window.location.reload();
      }
    };

    // Adicionar event listener
    window.addEventListener("storage", handleStorageChange);

    // Limpar event listener
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);

    try {
      // Preparar os dados atualizados
      const updatedData = {
        company: companyProfile.name,
        industryArea: companyProfile.industry,
        companySize: companyProfile.size,
        companyWebsite: companyProfile.website,
        companyAddress: companyProfile.address,
        foundingYear: companyProfile.foundingYear,
        workModel: companyProfile.workModel,
        companyDescription: companyProfile.about,
        companyBenefits: companyProfile.benefits,
        commonOpenPositions: companyProfile.positions.join(", "),
      };

      console.log("*** DEBUG - Dados a serem salvos:", updatedData);

      // Salvar diretamente no localStorage
      localStorage.setItem("gestorProfileData", JSON.stringify(updatedData));
      console.log("*** DEBUG - Dados salvos em gestorProfileData");

      // Atualizar também o user
      const userData = localStorage.getItem("user") || "{}";
      const parsedUserData = JSON.parse(userData);
      const updatedUserData = { ...parsedUserData, ...updatedData };
      localStorage.setItem("user", JSON.stringify(updatedUserData));
      console.log("*** DEBUG - Dados salvos no user");

      // Exibir mensagem de sucesso
      toast?.success("Informações da empresa salvas com sucesso!");

      // Recarregar a página para mostrar as mudanças
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (e) {
      console.error("Erro ao salvar dados:", e);
      toast?.error(
        "Erro ao salvar as informações. Por favor, tente novamente."
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCompanyProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddPosition = () => {
    setCompanyProfile((prev) => ({
      ...prev,
      positions: [...prev.positions, "Nova Posição"],
    }));
  };

  const handlePositionChange = (index: number, value: string) => {
    const newPositions = [...companyProfile.positions];
    newPositions[index] = value;
    setCompanyProfile((prev) => ({
      ...prev,
      positions: newPositions,
    }));
  };

  const handleRemovePosition = (index: number) => {
    const newPositions = companyProfile.positions.filter((_, i) => i !== index);
    setCompanyProfile((prev) => ({
      ...prev,
      positions: newPositions,
    }));
  };

  // Adicionar botão de forçar atualização
  const forceRefresh = () => {
    console.log("Forçando atualização da página...");
    window.location.reload();
  };

  // Adicionar método para depuração - preenchimento de dados de exemplo
  const preencherDadosExemplo = () => {
    const dadosExemplo = {
      name: "Empresa Exemplo",
      industry: "Tecnologia",
      size: "11-50",
      website: "www.empresaexemplo.com.br",
      address: "Av. Paulista, 1000 - São Paulo",
      foundingYear: "2020",
      workModel: "hibrido",
      about: "Somos uma empresa inovadora no segmento de tecnologia.",
      benefits: "Vale refeição, Vale transporte, Home office, Plano de saúde",
      positions: ["Desenvolvedor", "Designer", "Analista de Marketing"],
    };

    // Se estiver no modo de edição, apenas atualiza o estado
    if (isEditing) {
      setCompanyProfile(dadosExemplo);
      return;
    }

    // Se não estiver no modo de edição, salvar diretamente no localStorage
    try {
      const dadosSalvar = {
        company: dadosExemplo.name,
        industryArea: dadosExemplo.industry,
        companySize: dadosExemplo.size,
        companyWebsite: dadosExemplo.website,
        companyAddress: dadosExemplo.address,
        foundingYear: dadosExemplo.foundingYear,
        workModel: dadosExemplo.workModel,
        companyDescription: dadosExemplo.about,
        companyBenefits: dadosExemplo.benefits,
        commonOpenPositions: dadosExemplo.positions.join(", "),
      };

      // Salvar no localStorage
      localStorage.setItem("gestorProfileData", JSON.stringify(dadosSalvar));
      console.log("Dados de exemplo salvos no localStorage");

      // Atualizar também o objeto user
      const userData = localStorage.getItem("user") || "{}";
      const parsedUserData = JSON.parse(userData);
      const updatedUserData = { ...parsedUserData, ...dadosSalvar };
      localStorage.setItem("user", JSON.stringify(updatedUserData));

      toast?.success("Dados de exemplo salvos com sucesso!");

      // Recarregar a página
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (e) {
      console.error("Erro ao salvar dados de exemplo:", e);
      toast?.error("Erro ao salvar dados de exemplo");
    }
  };

  // Adicionar função para limpar e preencher o localStorage com dados de teste válidos
  const preencherDadosLocalmente = () => {
    // Criar dados de teste completos
    const dadosTeste = {
      nomeCompleto: "Jonas Jonas",
      phone: "81999999999",
      position: "CEO",
      company: "Empresa Teste",
      companyWebsite: "www.empresateste.com.br",
      companyAddress: "Rua Teste, 123",
      companySize: "11-50",
      workModel: "hibrido",
      companyDescription: "Uma empresa focada em inovação e qualidade",
      companyBenefits: "Vale refeição, Plano de saúde, Home office",
      commonOpenPositions: "Desenvolvedor, Designer, Marketing",
      industryArea: "Tecnologia",
      foundingYear: "2020",
      onboardingCompleto: true,
    };

    console.log("Preenchendo dados de teste:", dadosTeste);

    // Salvar no localStorage com os nomes exatos que usamos para buscar
    localStorage.setItem("gestorProfileData", JSON.stringify(dadosTeste));
    localStorage.setItem("user", JSON.stringify(dadosTeste));

    // Mostrar mensagem de sucesso
    toast?.success("Dados de teste preenchidos com sucesso!");

    // Recarregar a página
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  // Adicionar função para limpar dados
  const limparDados = () => {
    // Confirmação para evitar limpeza acidental
    if (
      confirm(
        "Tem certeza que deseja limpar todos os dados da empresa? Esta ação não pode ser desfeita."
      )
    ) {
      try {
        // Remover apenas dados específicos, mantendo o token de autenticação
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if (user) {
          // Preservar apenas dados essenciais do usuário
          const userData = JSON.parse(user);
          const dadosPreservados = {
            nomeCompleto: userData.nomeCompleto || "",
            email: userData.email || "",
            onboardingCompleto: userData.onboardingCompleto,
          };

          // Salvar versão limpa
          localStorage.setItem("user", JSON.stringify(dadosPreservados));
        }

        // Remover dados específicos da empresa
        localStorage.removeItem("gestorProfileData");

        toast?.success("Dados da empresa foram limpos com sucesso!");

        // Recarregar a página
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } catch (e) {
        console.error("Erro ao limpar dados:", e);
        toast?.error("Erro ao limpar dados");
      }
    }
  };

  // Função para verificar dados sem recarregar a página - movida para dentro do componente
  const verificarDadosSemReload = () => {
    console.log("Verificando dados sem recarregar a página...");

    try {
      // Buscar os dados mais recentes do localStorage
      const dadosGestor = localStorage.getItem("gestorProfileData");
      const dadosUser = localStorage.getItem("user");

      if (dadosGestor) {
        const dadosParsed = JSON.parse(dadosGestor);
        console.log(
          "*** DEBUG - Dados mais recentes encontrados:",
          dadosParsed
        );

        // Criar o objeto de perfil com os dados encontrados
        const perfilAtualizado = {
          name: dadosParsed.company || "",
          industry: dadosParsed.industryArea || "",
          size: dadosParsed.companySize || "",
          website: dadosParsed.companyWebsite || "",
          about: dadosParsed.companyDescription || "",
          address: dadosParsed.companyAddress || "",
          foundingYear: dadosParsed.foundingYear || "2020",
          workModel: dadosParsed.workModel || "",
          benefits: dadosParsed.companyBenefits || "",
          commonPositions: dadosParsed.commonOpenPositions || "",
          positions: dadosParsed.commonOpenPositions
            ? dadosParsed.commonOpenPositions
                .split(",")
                .map((p: string) => p.trim())
            : [],
          areas: dadosParsed.industryArea ? [dadosParsed.industryArea] : [],
        };

        // Atualizar o estado diretamente
        setCompanyProfile(perfilAtualizado);

        // Atualizar nome de usuário se disponível
        if (dadosUser) {
          const userParsed = JSON.parse(dadosUser);
          if (userParsed.nomeCompleto) {
            setUserName(userParsed.nomeCompleto);
          }
        }

        toast?.success("Dados atualizados com sucesso!");
      } else {
        toast?.warning("Nenhum dado encontrado no localStorage.");
      }
    } catch (e) {
      console.error("Erro ao verificar dados:", e);
      toast?.error("Erro ao verificar dados");
    }
  };

  return (
    <UserPanelLayout userType="gestor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Minha Empresa</h1>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Editar Informações
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={preencherDadosExemplo}>
                  Preencher Exemplo
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Alterações
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {!isEditing && (
            <>
              <Button
                variant="default"
                onClick={verificarDadosSemReload}
                className="ml-2 bg-blue-600 hover:bg-blue-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M21 2v6h-6"></path>
                  <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                  <path d="M3 22v-6h6"></path>
                  <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
                </svg>
                Verificar Dados (Sem Reload)
              </Button>
              <Button variant="outline" onClick={forceRefresh} className="ml-2">
                Atualizar Página
              </Button>
              <Button
                variant="outline"
                onClick={preencherDadosLocalmente}
                className="ml-2 bg-yellow-100"
              >
                Corrigir Dados Localmente
              </Button>
              <Button
                variant="outline"
                onClick={preencherDadosExemplo}
                className="ml-2"
              >
                Preencher Exemplo
              </Button>
              <Button
                variant="outline"
                onClick={limparDados}
                className="ml-2 bg-red-100 text-red-800"
              >
                Limpar Dados
              </Button>
            </>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Informações da Empresa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome da Empresa</label>
                {isEditing ? (
                  <Input
                    name="name"
                    value={companyProfile.name}
                    onChange={handleChange}
                  />
                ) : companyProfile.name ? (
                  <p>{companyProfile.name}</p>
                ) : (
                  <EmptyStateMessage field="name" />
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Setor</label>
                {isEditing ? (
                  <Select
                    value={companyProfile.industry}
                    onValueChange={(value) =>
                      setCompanyProfile((prev) => ({
                        ...prev,
                        industry: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                      <SelectItem value="Saúde">Saúde</SelectItem>
                      <SelectItem value="Educação">Educação</SelectItem>
                      <SelectItem value="Finanças">Finanças</SelectItem>
                      <SelectItem value="Varejo">Varejo</SelectItem>
                    </SelectContent>
                  </Select>
                ) : companyProfile.industry ? (
                  <p>{companyProfile.industry}</p>
                ) : (
                  <EmptyStateMessage field="industry" />
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Tamanho da Empresa
                </label>
                {isEditing ? (
                  <Select
                    value={companyProfile.size}
                    onValueChange={(value) =>
                      setCompanyProfile((prev) => ({ ...prev, size: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 funcionários</SelectItem>
                      <SelectItem value="11-50">11-50 funcionários</SelectItem>
                      <SelectItem value="51-200">
                        51-200 funcionários
                      </SelectItem>
                      <SelectItem value="201-500">
                        201-500 funcionários
                      </SelectItem>
                      <SelectItem value="501+">
                        Mais de 500 funcionários
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : companyProfile.size ? (
                  <p>{formatCompanySize(companyProfile.size)}</p>
                ) : (
                  <EmptyStateMessage field="size" />
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Website</label>
                {isEditing ? (
                  <Input
                    name="website"
                    value={companyProfile.website}
                    onChange={handleChange}
                  />
                ) : companyProfile.website ? (
                  <p>{companyProfile.website}</p>
                ) : (
                  <EmptyStateMessage field="website" />
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Endereço</label>
                {isEditing ? (
                  <Input
                    name="address"
                    value={companyProfile.address}
                    onChange={handleChange}
                  />
                ) : companyProfile.address ? (
                  <p>{companyProfile.address}</p>
                ) : (
                  <EmptyStateMessage field="address" />
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Ano de Fundação</label>
                {isEditing ? (
                  <Input
                    name="foundingYear"
                    value={companyProfile.foundingYear}
                    onChange={handleChange}
                  />
                ) : companyProfile.foundingYear ? (
                  <p>{companyProfile.foundingYear}</p>
                ) : (
                  <EmptyStateMessage field="foundingYear" />
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Modelo de Trabalho
                </label>
                {isEditing ? (
                  <Select
                    value={companyProfile.workModel}
                    onValueChange={(value) =>
                      setCompanyProfile((prev) => ({
                        ...prev,
                        workModel: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="presencial">Presencial</SelectItem>
                      <SelectItem value="hibrido">Híbrido</SelectItem>
                      <SelectItem value="remoto">Remoto</SelectItem>
                      <SelectItem value="variado">Varia por posição</SelectItem>
                    </SelectContent>
                  </Select>
                ) : companyProfile.workModel ? (
                  <p>{formatWorkModel(companyProfile.workModel)}</p>
                ) : (
                  <EmptyStateMessage field="workModel" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sobre a Empresa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Descrição</label>
                  {isEditing ? (
                    <Textarea
                      name="about"
                      value={companyProfile.about}
                      onChange={handleChange}
                      className="min-h-[150px]"
                    />
                  ) : companyProfile.about ? (
                    <p className="whitespace-pre-wrap">
                      {companyProfile.about}
                    </p>
                  ) : (
                    <EmptyStateMessage field="about" />
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Áreas de Interesse da Empresa
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {companyProfile.areas.map((area, index) => (
                      <Badge key={index} variant="secondary">
                        {area}
                      </Badge>
                    ))}
                  </div>
                  {isEditing && (
                    <Button variant="outline" size="sm" className="mt-2">
                      + Adicionar Área de Interesse
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Benefícios e Ambiente de Trabalho
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Benefícios Oferecidos
                </label>
                {isEditing ? (
                  <Textarea
                    name="benefits"
                    value={companyProfile.benefits}
                    onChange={handleChange}
                    className="min-h-[100px]"
                  />
                ) : companyProfile.benefits ? (
                  <p className="whitespace-pre-wrap">
                    {companyProfile.benefits}
                  </p>
                ) : (
                  <EmptyStateMessage field="benefits" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Posições Abertas/Frequentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {isEditing ? (
                <div className="space-y-2">
                  {companyProfile.positions.map((position, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={position}
                        onChange={(e) =>
                          handlePositionChange(index, e.target.value)
                        }
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemovePosition(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddPosition}
                    className="mt-2"
                  >
                    + Adicionar Posição
                  </Button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {companyProfile.positions.map((position, index) => (
                    <Badge key={index} variant="outline">
                      {position}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Diagnóstico do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <MostrarDiagnostico
              data={{
                localStorageData: {
                  gestorProfileData: localStorage.getItem("gestorProfileData")
                    ? JSON.parse(localStorage.getItem("gestorProfileData"))
                    : null,
                  user: localStorage.getItem("user")
                    ? JSON.parse(localStorage.getItem("user"))
                    : null,
                },
                estadoAtual: {
                  userName,
                  companyProfile,
                },
              }}
            />
          </CardContent>
        </Card>
      </div>
    </UserPanelLayout>
  );
};

export default ManagerCompany;
