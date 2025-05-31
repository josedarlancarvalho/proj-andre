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
import { atualizarPerfilRh } from "@/servicos/rh";
import { getMeuPerfil } from "@/servicos/usuario";

type OnboardingFormDataHr = {
  fullName: string;
  phoneNumber: string;
  cityState: string;

  // Informações profissionais
  company: string;
  cnpj: string;
  position: string;
  department: string;
  yearsExperience: string;
  industryArea: string;
  specialties: string;

  // LinkedIn
  linkedinUrl: string;

  // Preferências de contratação
  hiringPreferences: string[];
  hiringFocus: string;
  keySkillsLooking: string;

  // Confirmação
  authorization: boolean;
};

// Componente principal
const TalentOnboardingFormHr = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6; // Reduzi de 7 para 6 passos (removendo o bio)

  // Armazenar os dados do formulário entre etapas
  const [formData, setFormData] = useState<OnboardingFormDataHr>({
    fullName: user?.nomeCompleto || "",
    phoneNumber: "",
    cityState: user?.cidade || "",
    company: "",
    cnpj: "",
    position: "",
    department: "",
    yearsExperience: "",
    industryArea: "",
    specialties: "",
    linkedinUrl: user?.linkedinUrl || "",
    hiringPreferences: [],
    hiringFocus: "",
    keySkillsLooking: "",
    authorization: false,
  });

  // Criar um formulário separado para cada etapa
  const form = useForm<OnboardingFormDataHr>({
    defaultValues: formData,
  });

  // Atualizar os dados do formulário quando mudar de etapa
  useEffect(() => {
    const currentValues = form.getValues();
    setFormData((prev) => ({ ...prev, ...currentValues }));
  }, [currentStep]);

  const hiringPreferences = form.watch("hiringPreferences", []);

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
      case 1: // Dados pessoais
        if (!form.getValues().fullName) {
          toast.error("Por favor, preencha seu nome completo.");
          return false;
        }
        return true;

      case 2: // Empresa
        if (!form.getValues().company) {
          toast.error("Por favor, informe o nome da empresa.");
          return false;
        }
        return true;

      case 3: // Cargo e departamento
        if (!form.getValues().position) {
          toast.error("Por favor, informe seu cargo na empresa.");
          return false;
        }
        return true;

      case 4: // Anos de experiência e setor
        return true;

      case 5: // LinkedIn e Especialidades
        return true;

      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    try {
      // Combinar todos os dados salvos
      const finalData = { ...formData, ...form.getValues() };
      console.log("Form data submitted:", finalData);

      // Verificar se o nome completo está preenchido, caso contrário usar o do usuário
      if (!finalData.fullName && user?.nomeCompleto) {
        finalData.fullName = user.nomeCompleto;
      }

      // Preparar os dados para enviar ao servidor - garantindo que todos os campos existam
      const dadosOnboarding = {
        // Dados pessoais
        nomeCompleto: finalData.fullName || user?.nomeCompleto || "",
        telefone: finalData.phoneNumber || "",
        cidade: finalData.cityState || user?.cidade || "",

        // Informações profissionais
        empresa: finalData.company || "",
        cnpj: finalData.cnpj || "",
        cargo: finalData.position || "",
        departamento: finalData.department || "",
        experienciaProfissional: finalData.yearsExperience || "",

        // Áreas de interesse e especialidades
        areasInteresse: finalData.industryArea ? [finalData.industryArea] : [],
        especialidades: finalData.specialties
          ? finalData.specialties.split(",").map((item) => item.trim())
          : [],

        // LinkedIn
        linkedinUrl: finalData.linkedinUrl || "",

        // Informações sobre contratação (podem ser armazenadas como campos JSON)
        hiringPreferences: finalData.hiringPreferences || [],
        hiringFocus: finalData.hiringFocus || "",
        keySkillsLooking: finalData.keySkillsLooking || "",

        // Marcar onboarding como completo - ESTE É O CAMPO CRUCIAL
        onboardingCompleto: true,
      };

      console.log("Dados enviados para o servidor:", dadosOnboarding);

      try {
        // Tentar atualizar o perfil
        const resultado = await atualizarPerfilRh(dadosOnboarding);
        console.log("Resposta do servidor:", resultado);

        // Atualizar também os campos específicos para exibição no perfil
        const dadosAdicionaisPerfil = {
          phone: finalData.phoneNumber || "", // Garantir que o telefone seja atualizado no perfil
          position: finalData.position || "", // Garantir que o cargo seja atualizado no perfil
          company: finalData.company || "", // Garantir que a empresa seja atualizada no perfil
          cnpj: finalData.cnpj || "", // Garantir que o CNPJ seja atualizado no perfil
        };

        // Salvar esses dados no localStorage para o HRProfile usar
        try {
          const perfilExistente = localStorage.getItem("hrProfileData");
          const perfilParsed = perfilExistente
            ? JSON.parse(perfilExistente)
            : {};
          const perfilAtualizado = {
            ...perfilParsed,
            ...dadosAdicionaisPerfil,
          };
          localStorage.setItem(
            "hrProfileData",
            JSON.stringify(perfilAtualizado)
          );
          console.log(
            "Dados adicionais salvos no localStorage para o perfil:",
            perfilAtualizado
          );
        } catch (e) {
          console.error("Erro ao salvar dados adicionais no localStorage:", e);
        }

        // Se bem-sucedido, atualizar o contexto
        try {
          const updatedUserData = await getMeuPerfil();
          if (updatedUserData && updatedUserData.usuario) {
            console.log(
              "Dados atualizados do usuário após onboarding:",
              updatedUserData.usuario
            );
            // Atualizar o contexto com o usuário que já tem onboardingCompleto = true
            setUser(updatedUserData.usuario);
          }
        } catch (profileError) {
          console.error(
            "Erro ao buscar perfil atualizado, mas onboarding foi concluído:",
            profileError
          );
        }

        toast.success("Perfil atualizado com sucesso!");
      } catch (updateError) {
        console.error(
          "Erro ao atualizar perfil, mas tentando prosseguir:",
          updateError
        );

        // Tentar forçar a atualização do onboarding de forma mais direta
        try {
          await atualizarPerfilRh({ onboardingCompleto: true });
          console.log("Tentativa direta de marcar onboarding como completo");
        } catch (e) {
          console.error("Erro na tentativa direta:", e);
        }

        toast.warning(
          "Alguns dados podem não ter sido salvos corretamente, mas você pode continuar."
        );
      }

      // Sempre navegar para /rh, mesmo se houver algum erro
      setTimeout(() => {
        // Forçar a atualização do usuário no contexto antes de navegar
        getMeuPerfil()
          .then((data) => {
            if (data && data.usuario) {
              setUser(data.usuario);
            }
          })
          .catch((err) => console.error("Erro final ao buscar perfil:", err))
          .finally(() => {
            navigate("/rh");
          });
      }, 1500);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        "Ocorreu um erro ao salvar seu perfil, mas tentaremos continuar."
      );

      // Mesmo com erro geral, tentar redirecionamento após um breve delay
      setTimeout(() => {
        navigate("/rh");
      }, 2000);
    }
  };

  // Conteúdo dos passos
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Dados pessoais
        return (
          <div className="space-y-6">
            <CardTitle className="text-2xl text-center">
              Como você se define profissionalmente?
            </CardTitle>
            <CardDescription className="text-center">
              Compartilhe suas informações pessoais para começarmos a conhecer
              você.
            </CardDescription>

            <FormField
              control={form.control}
              name="fullName"
              rules={{ required: "Nome completo é obrigatório" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite seu nome completo"
                      {...field}
                      defaultValue={formData.fullName}
                    />
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
                    <Input
                      placeholder="(XX) XXXXX-XXXX"
                      {...field}
                      defaultValue={formData.phoneNumber}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cityState"
              rules={{ required: "Cidade/Estado é obrigatório" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade/Estado</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: São Paulo, SP"
                      {...field}
                      defaultValue={formData.cityState}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 2: // Empresa
        return (
          <div className="space-y-6">
            <CardTitle className="text-2xl text-center">
              Qual empresa você representa?
            </CardTitle>
            <CardDescription className="text-center">
              Conte-nos sobre a empresa em que você trabalha.
            </CardDescription>

            <FormField
              control={form.control}
              name="company"
              rules={{ required: "Nome da empresa é obrigatório" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Empresa</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o nome da sua empresa"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cnpj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CNPJ da Empresa</FormLabel>
                  <FormControl>
                    <Input placeholder="XX.XXX.XXX/XXXX-XX" {...field} />
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
          </div>
        );

      case 3: // Cargo e departamento
        return (
          <div className="space-y-6">
            <CardTitle className="text-2xl text-center">
              Qual sua posição na empresa?
            </CardTitle>
            <CardDescription className="text-center">
              Informe-nos sobre seu cargo e departamento.
            </CardDescription>

            <FormField
              control={form.control}
              name="position"
              rules={{ required: "Cargo é obrigatório" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Analista de RH, Gerente de Recrutamento"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departamento</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Recursos Humanos, Recrutamento e Seleção"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="yearsExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Anos de Experiência na Função</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-2">Menos de 2 anos</SelectItem>
                        <SelectItem value="3-5">3-5 anos</SelectItem>
                        <SelectItem value="6-10">6-10 anos</SelectItem>
                        <SelectItem value="10+">Mais de 10 anos</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 4: // LinkedIn e Especialidades
        return (
          <div className="space-y-6">
            <CardTitle className="text-2xl text-center">
              Suas especialidades profissionais
            </CardTitle>
            <CardDescription className="text-center">
              Compartilhe suas habilidades e conecte-se profissionalmente.
            </CardDescription>

            <FormField
              control={form.control}
              name="linkedinUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Perfil do LinkedIn</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://www.linkedin.com/in/seu-perfil"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialties"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Especialidades Profissionais</FormLabel>
                  <FormDescription>
                    Separar por vírgulas (ex: recrutamento, seleção, onboarding)
                  </FormDescription>
                  <FormControl>
                    <Textarea
                      placeholder="Suas especialidades..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 5: // Preferências de contratação 1
        return (
          <div className="space-y-6">
            <CardTitle className="text-2xl text-center">
              Quais perfis sua empresa busca?
            </CardTitle>
            <CardDescription className="text-center">
              Conte-nos quais tipos de profissionais você está procurando.
            </CardDescription>

            <FormField
              control={form.control}
              name="hiringPreferences"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">
                      Selecione todos os perfis que sua empresa busca
                    </FormLabel>
                  </div>
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="hiringPreferences"
                      render={({ field }) => {
                        return (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes("internship")}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        "internship",
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== "internship"
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Estágio
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="hiringPreferences"
                      render={({ field }) => {
                        return (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes("trainee")}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        "trainee",
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== "trainee"
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Trainee
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="hiringPreferences"
                      render={({ field }) => {
                        return (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes("junior")}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, "junior"])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== "junior"
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Júnior
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="hiringPreferences"
                      render={({ field }) => {
                        return (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes("first_job")}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        "first_job",
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== "first_job"
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Primeiro Emprego
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="hiringPreferences"
                      render={({ field }) => {
                        return (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(
                                  "career_transition"
                                )}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        "career_transition",
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) =>
                                            value !== "career_transition"
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Transição de Carreira
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                </FormItem>
              )}
            />
          </div>
        );

      case 6: // Preferências de contratação 2 e confirmação
        return (
          <div className="space-y-6">
            <CardTitle className="text-2xl text-center">
              Finalizando seu perfil
            </CardTitle>
            <CardDescription className="text-center">
              Áreas de contratação e confirmação final.
            </CardDescription>

            <FormField
              control={form.control}
              name="hiringFocus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Principais áreas de contratação</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a área prioritária" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tech">Tecnologia</SelectItem>
                        <SelectItem value="business">Negócios</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="sales">Vendas</SelectItem>
                        <SelectItem value="customer_service">
                          Atendimento ao Cliente
                        </SelectItem>
                        <SelectItem value="logistics">Logística</SelectItem>
                        <SelectItem value="operations">Operações</SelectItem>
                        <SelectItem value="administrative">
                          Administrativo
                        </SelectItem>
                        <SelectItem value="finance">Financeiro</SelectItem>
                        <SelectItem value="others">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="keySkillsLooking"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Habilidades-chave que buscam nos candidatos
                  </FormLabel>
                  <FormDescription>
                    Informe as principais habilidades técnicas e comportamentais
                  </FormDescription>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Trabalho em equipe, comunicação, proatividade, conhecimento em Excel..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="authorization"
              rules={{
                required: "Você precisa autorizar para continuar",
              }}
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
                    <FormDescription>
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
          "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3')",
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

export default TalentOnboardingFormHr;
