import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { atualizarPerfilGestor } from "@/servicos/gestor";
import { getMeuPerfil } from "@/servicos/usuario";

// Tipo para os dados do formulário
type OnboardingFormDataGestor = {
  fullName: string;
  phoneNumber: string;

  // Informações profissionais
  company: string;
  position: string;
  industryArea: string;

  // Informações da empresa
  companyWebsite: string;
  companyAddress: string;
  companySize: string;
  workModel: string;
  companyDescription: string;
  companyBenefits: string;

  // Preferências de contratação
  hiringGoals: string[];
  commonOpenPositions: string;

  // Confirmação
  authorization: boolean;
};

// Componente principal
const ManagerOnboardingForm = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4; // Reduzido de 7 para 4 passos

  // Armazenar os dados do formulário entre etapas
  const [formData, setFormData] = useState<OnboardingFormDataGestor>({
    fullName: user?.nomeCompleto || "",
    phoneNumber: "",
    company: "",
    position: "",
    industryArea: "",
    companyWebsite: "",
    companyAddress: "",
    companySize: "",
    workModel: "",
    companyDescription: "",
    companyBenefits: "",
    hiringGoals: [],
    commonOpenPositions: "",
    authorization: false,
  });

  // Criar um formulário separado para cada etapa
  const form = useForm<OnboardingFormDataGestor>({
    defaultValues: formData,
  });

  // Atualizar os dados do formulário quando mudar de etapa
  useEffect(() => {
    const currentValues = form.getValues();
    setFormData((prev) => ({ ...prev, ...currentValues }));
  }, [currentStep]);

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      // Salvar os dados do formulário atual
      const currentValues = form.getValues();
      setFormData((prev) => ({ ...prev, ...currentValues }));

      // Avançar para o próximo passo
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));

      // Resetar o formulário para a próxima etapa (mas mantendo os dados salvos)
      form.reset();
    }
  };

  const handlePrevStep = () => {
    // Salvar os dados do formulário atual
    const currentValues = form.getValues();
    setFormData((prev) => ({ ...prev, ...currentValues }));

    // Voltar para o passo anterior
    setCurrentStep((prev) => Math.max(prev - 1, 1));

    // Resetar o formulário para a próxima etapa (mas mantendo os dados salvos)
    form.reset();
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1: // Dados pessoais básicos
        if (!form.getValues().fullName) {
          toast.error("Por favor, preencha seu nome completo.");
          return false;
        }
        if (!form.getValues().company) {
          toast.error("Por favor, informe o nome da empresa.");
          return false;
        }
        return true;

      case 2: // Informações da empresa
        if (!form.getValues().position) {
          toast.error("Por favor, informe seu cargo na empresa.");
          return false;
        }
        if (!form.getValues().companySize) {
          toast.error("Por favor, informe o tamanho da empresa.");
          return false;
        }
        return true;

      case 3: // Objetivos de Contratação
        if (!form.getValues().hiringGoals.length) {
          toast.error(
            "Por favor, selecione pelo menos um objetivo de contratação."
          );
          return false;
        }
        return true;

      case 4: // Finalização
        if (!form.getValues().authorization) {
          toast.error("Por favor, autorize o uso das informações.");
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  // Antes do método handleSubmit, adicionar verificação de dados completos
  const verificarDadosEmpresas = (finalData) => {
    // Verificar se as informações essenciais da empresa estão preenchidas
    const camposEssenciais = [
      { campo: "company", nome: "Nome da Empresa" },
      { campo: "companySize", nome: "Tamanho da Empresa" },
      { campo: "industryArea", nome: "Setor da Empresa" },
      { campo: "workModel", nome: "Modelo de Trabalho" },
    ];

    const camposVazios = camposEssenciais.filter(
      (item) => !finalData[item.campo]
    );

    if (camposVazios.length > 0) {
      const camposFaltando = camposVazios.map((item) => item.nome).join(", ");
      toast.warning(
        `Recomendamos preencher: ${camposFaltando} para seu perfil ficar completo.`
      );
    }
  };

  const handleSubmit = async () => {
    try {
      // Combinar todos os dados salvos
      const finalData = {
        ...formData,
        ...form.getValues(),
        // Garantir que temos o valor de commonOpenPositions
        commonOpenPositions: form.getValues().commonOpenPositions || "",
      };
      console.log("Form data submitted:", finalData);

      // Verificar se os dados da empresa estão completos
      verificarDadosEmpresas(finalData);

      // Verificar se o nome completo está preenchido
      if (!finalData.fullName && user?.nomeCompleto) {
        finalData.fullName = user.nomeCompleto;
      }

      // Preparar os dados para enviar ao servidor
      const dadosOnboarding = {
        // Dados pessoais
        nomeCompleto: finalData.fullName || user?.nomeCompleto || "",
        telefone: finalData.phoneNumber || "",

        // Informações profissionais
        empresa: finalData.company || "",
        cargo: finalData.position || "",

        // Informações da empresa
        siteEmpresa: finalData.companyWebsite || "",
        enderecoEmpresa: finalData.companyAddress || "",
        tamanhoEmpresa: finalData.companySize || "",
        modeloTrabalho: finalData.workModel || "",
        descricaoEmpresa: finalData.companyDescription || "",
        beneficios: finalData.companyBenefits || "",

        // Áreas de interesse e especialidades
        areasInteresse: finalData.industryArea ? [finalData.industryArea] : [],

        // Preferências de contratação
        objetivosContratacao: finalData.hiringGoals || [],

        // Marcar onboarding como completo
        onboardingCompleto: true,
      };

      console.log("Dados enviados para o servidor:", dadosOnboarding);

      // IMPORTANTE: Preparar os dados para o localStorage com os nomes de campos corretos
      // que a página ManagerCompany.tsx está esperando
      const dadosAdicionaisPerfil = {
        // Dados pessoais
        nomeCompleto: finalData.fullName || user?.nomeCompleto || "",
        phone: finalData.phoneNumber || "",
        position: finalData.position || "",

        // Dados da empresa - estes nomes precisam corresponder exatamente aos esperados
        company: finalData.company || "",
        companyWebsite: finalData.companyWebsite || "",
        companyAddress: finalData.companyAddress || "",
        companySize: finalData.companySize || "",
        workModel: finalData.workModel || "",
        companyDescription: finalData.companyDescription || "",
        companyBenefits: finalData.companyBenefits || "",
        commonOpenPositions: finalData.commonOpenPositions || "",
        industryArea: finalData.industryArea || "",
        foundingYear: "2020", // Valor padrão

        // Marcar onboarding como completo
        onboardingCompleto: true,
      };

      console.log(
        "*** DEBUG - Dados completos que serão salvos no localStorage:",
        dadosAdicionaisPerfil
      );

      // Salvar no localStorage - SEMPRE SALVAR PRIMEIRO
      try {
        // Garantir que os valores sejam strings vazias em vez de undefined
        Object.keys(dadosAdicionaisPerfil).forEach((key) => {
          if (dadosAdicionaisPerfil[key] === undefined) {
            dadosAdicionaisPerfil[key] = "";
          }
        });

        // Salvar no localStorage
        localStorage.setItem(
          "gestorProfileData",
          JSON.stringify(dadosAdicionaisPerfil)
        );
        console.log(
          "*** DEBUG - Dados salvos em gestorProfileData:",
          dadosAdicionaisPerfil
        );

        // Atualizar também o objeto user
        const userData = localStorage.getItem("user") || "{}";
        const userParsed = JSON.parse(userData);
        const userAtualizado = { ...userParsed, ...dadosAdicionaisPerfil };

        localStorage.setItem("user", JSON.stringify(userAtualizado));
        console.log(
          "*** DEBUG - Dados também salvos no objeto user:",
          userAtualizado
        );

        // Tentar atualizar no servidor
        try {
          const resultado = await atualizarPerfilGestor(dadosOnboarding);
          console.log("Resposta do servidor:", resultado);

          if (resultado.localOnly) {
            toast.warning(
              "Seus dados foram salvos localmente. A sincronização com o servidor será feita quando a conexão for restabelecida.",
              { duration: 5000 }
            );
          } else {
            toast.success("Perfil atualizado com sucesso!");
          }
        } catch (updateError) {
          console.error("Erro ao atualizar perfil no servidor:", updateError);
          toast.warning(
            "Seus dados foram salvos localmente. A sincronização com o servidor será feita quando possível.",
            { duration: 5000 }
          );
        }

        // Atualizar o contexto Auth
        setUser({ ...user, ...dadosAdicionaisPerfil });

        // Modificar o redirecionamento para garantir que os dados sejam carregados corretamente
        // Substituir o setTimeout existente por um que use sessionStorage para sinalizar uma transição recente
        setTimeout(() => {
          // Adicionar um sinalizador no sessionStorage para indicar que acabamos de preencher o formulário
          // Isso será usado pela página ManagerCompany para forçar um recarregamento se necessário
          sessionStorage.setItem("onboardingCompleted", "true");
          sessionStorage.setItem("onboardingTimestamp", Date.now().toString());

          // Forçar um refresh completo para garantir que os dados sejam carregados limpos na página de destino
          window.location.href = "/gestor/empresa?refresh=" + Date.now();
        }, 1500);
      } catch (e) {
        console.error("Erro ao salvar dados no localStorage:", e);
        toast.error("Ocorreu um erro ao salvar seus dados. Tente novamente.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        "Ocorreu um erro ao processar o formulário. Tente novamente."
      );
    }
  };

  // Adicionar função renderStepContent antes do return
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Dados pessoais e empresa (simplificado)
        return (
          <div className="space-y-6">
            <CardTitle className="text-xl text-center">
              Informações Básicas
            </CardTitle>
            <CardDescription className="text-center">
              Forneça as informações iniciais para começarmos.
            </CardDescription>

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Seu nome completo" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="(XX) XXXXX-XXXX" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Empresa</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nome da empresa" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 2: // Informações da empresa
        return (
          <div className="space-y-6">
            <CardTitle className="text-xl text-center">
              Informações da Empresa
            </CardTitle>
            <CardDescription className="text-center">
              Estas informações serão exibidas no perfil público da sua empresa
              e ajudarão talentos a conhecê-la melhor.
            </CardDescription>

            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seu Cargo</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ex: Gerente de RH, Diretor de Operações"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="industryArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Setor/Indústria</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o setor da empresa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tecnologia">Tecnologia</SelectItem>
                        <SelectItem value="saude">Saúde</SelectItem>
                        <SelectItem value="educacao">Educação</SelectItem>
                        <SelectItem value="financeiro">Financeiro</SelectItem>
                        <SelectItem value="varejo">Varejo</SelectItem>
                        <SelectItem value="industria">Indústria</SelectItem>
                        <SelectItem value="servicos">Serviços</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyWebsite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site da Empresa</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://www.empresa.com.br"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço da Empresa</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Av. Paulista, 1000 - São Paulo, SP"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companySize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tamanho da Empresa</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tamanho" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 funcionários</SelectItem>
                        <SelectItem value="11-50">
                          11-50 funcionários
                        </SelectItem>
                        <SelectItem value="51-200">
                          51-200 funcionários
                        </SelectItem>
                        <SelectItem value="201-500">
                          201-500 funcionários
                        </SelectItem>
                        <SelectItem value="501-1000">
                          501-1000 funcionários
                        </SelectItem>
                        <SelectItem value="1001+">
                          Mais de 1000 funcionários
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="workModel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo de Trabalho</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o modelo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="presencial">Presencial</SelectItem>
                        <SelectItem value="hibrido">Híbrido</SelectItem>
                        <SelectItem value="remoto">Remoto</SelectItem>
                        <SelectItem value="variado">
                          Varia por posição
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 3: // Objetivos de Contratação e Descrição
        return (
          <div className="space-y-6">
            <CardTitle className="text-xl text-center">
              Sobre a Empresa e Contratações
            </CardTitle>
            <CardDescription className="text-center">
              Descreva sua empresa e necessidades de contratação. Estas
              informações serão exibidas no seu perfil e ajudarão a atrair
              candidatos alinhados.
            </CardDescription>

            <FormField
              control={form.control}
              name="companyDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição da Empresa</FormLabel>
                  <FormDescription>
                    Conte um pouco sobre a missão, valores e cultura da empresa
                  </FormDescription>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Ex: Somos uma empresa de tecnologia focada em soluções inovadoras..."
                      className="min-h-[80px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyBenefits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Benefícios Oferecidos</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Ex: Vale-refeição, plano de saúde, horário flexível..."
                      className="min-h-[80px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="commonOpenPositions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vagas Comumente Abertas</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Ex: Desenvolvedores, Analistas de Marketing..."
                      className="min-h-[80px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hiringGoals"
              render={() => (
                <FormItem>
                  <div className="mb-2">
                    <FormLabel className="text-base">
                      Objetivos ao contratar novos talentos
                    </FormLabel>
                    <FormDescription>
                      Selecione todos que se aplicam
                    </FormDescription>
                  </div>
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="hiringGoals"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes("diversity")}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...field.value,
                                      "diversity",
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== "diversity"
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Aumentar a diversidade no time
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="hiringGoals"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes("innovation")}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...field.value,
                                      "innovation",
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== "innovation"
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Trazer novas perspectivas e inovação
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="hiringGoals"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes("digital_skills")}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...field.value,
                                      "digital_skills",
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== "digital_skills"
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Melhorar habilidades digitais da empresa
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </FormItem>
              )}
            />
          </div>
        );

      case 4: // Finalização
        return (
          <div className="space-y-6">
            <CardTitle className="text-xl text-center">
              Finalizar Cadastro
            </CardTitle>
            <CardDescription className="text-center">
              Estamos quase lá! Revise suas informações e confirme.
            </CardDescription>

            <FormField
              control={form.control}
              name="authorization"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1">
                    <FormLabel>
                      Autorizo o uso dessas informações para conectar nossa
                      empresa aos talentos mais adequados.
                    </FormLabel>
                    <FormDescription className="text-xs">
                      Estou ciente de que a plataforma valoriza perfis diversos
                      e trajetórias não convencionais, promovendo inclusão e
                      oportunidades reais.
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      default:
        return <div>Passo inválido</div>;
    }
  };

  return (
    <div
      className="min-h-screen bg-background flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?ixlib=rb-4.0.3')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="text-center border-b pb-4">
            <div className="flex justify-between items-center mb-2">
              <Button
                variant="outline"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                size="sm"
              >
                Anterior
              </Button>
              <div className="text-sm text-muted-foreground">
                Passo {currentStep} de {totalSteps}
              </div>
              <Button
                variant="outline"
                onClick={handleNextStep}
                disabled={currentStep === totalSteps}
                size="sm"
              >
                Próximo
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <Form {...form}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                {renderStepContent()}
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex justify-between border-t pt-4">
            {currentStep === totalSteps ? (
              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={!form.getValues().authorization}
              >
                Confirmar e Continuar
              </Button>
            ) : (
              <Button className="w-full" onClick={handleNextStep}>
                Continuar
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ManagerOnboardingForm;
