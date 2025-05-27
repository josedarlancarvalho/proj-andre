import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { completarOnboarding } from "@/servicos/jovem";
import { useNavigate } from "react-router-dom";

// Tipos para melhor tipagem
type EducationalBackground = "estudante" | "conclui" | "fora_escola";
type TalentSource = "autodidata" | "ong_projeto" | "faculdade_escola";
type HumanizedCategory =
  | "talento_reconstrucao"
  | "retomada_trajetoria"
  | "outra";
type RecognitionBadge = "talento_raiz" | "autodidata_destaque";
type Gender = "feminino" | "masculino" | "outro" | "prefiro_nao_dizer";

interface FormData {
  educationalBackground: EducationalBackground;
  institutionName: string;
  studyDetails: {
    course: string;
    yearOrPeriod: string;
  };
  talentSource: TalentSource;
  humanizedCategory: HumanizedCategory;
  customCategory: string;
  socialProgram: {
    participates: boolean;
    programName: string;
    authorizeMention: boolean;
  };
  experiences: string;
  portfolioLinks: string;
  supportPaths: {
    portfolioGuide: boolean;
    projectPresentation: boolean;
    freeCourses: boolean;
    mentorship: boolean;
  };
  recognitionBadge: RecognitionBadge;
  gender: Gender;
  genderOther: string;
  cidade: string;
  areasInteresse: string;
}

// Implementação real da função para salvar os dados do onboarding
const saveOnboardingData = async (userId: string, data: any) => {
  console.log("Salvando dados de onboarding para usuário", userId, data);

  try {
    // Chamada real para a API
    const result = await completarOnboarding({
      experiences: data.experiences,
      portfolioLinks: data.portfolioLinks,
      educationalBackground: data.educationalBackground,
      institutionName: data.institutionName,
      studyDetails: data.studyDetails,
      talentSource: data.talentSource,
      humanizedCategory: data.humanizedCategory,
      customCategory: data.customCategory,
      recognitionBadge: data.recognitionBadge,
      gender: data.gender,
      genderOther: data.genderOther,
      cidade: data.cidade,
      areasInteresse: data.areasInteresse
        .split(",")
        .map((item: string) => item.trim()),
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Erro ao salvar dados de onboarding:", error);
    return { success: false, error };
  }
};

const OnboardingForm = () => {
  const { user, setUser } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    educationalBackground: "" as EducationalBackground,
    institutionName: "",
    studyDetails: {
      course: "",
      yearOrPeriod: "",
    },
    talentSource: "" as TalentSource,
    humanizedCategory: "" as HumanizedCategory,
    customCategory: "",
    socialProgram: {
      participates: false,
      programName: "",
      authorizeMention: false,
    },
    experiences: "",
    portfolioLinks: "",
    supportPaths: {
      portfolioGuide: false,
      projectPresentation: false,
      freeCourses: false,
      mentorship: false,
    },
    recognitionBadge: "" as RecognitionBadge,
    gender: "" as Gender,
    genderOther: "",
    cidade: "",
    areasInteresse: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div>Erro: Usuário não autenticado no formulário de onboarding.</div>
    );
  }

  const handleInputChange = (name: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStudyDetailsChange = (
    name: keyof FormData["studyDetails"],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      studyDetails: { ...prev.studyDetails, [name]: value },
    }));
  };

  const handleSocialProgramChange = (
    name: keyof FormData["socialProgram"],
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      socialProgram: { ...prev.socialProgram, [name]: value },
    }));
  };

  const handleSupportPathsChange = (
    name: keyof FormData["supportPaths"],
    value: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      supportPaths: { ...prev.supportPaths, [name]: value },
    }));
  };

  const validateStep = (): boolean => {
    switch (step) {
      case 1:
        if (!formData.educationalBackground) {
          toast.error("Por favor, selecione sua situação educacional.");
          return false;
        }
        break;

      case 2:
        if (formData.educationalBackground !== "fora_escola") {
          if (!formData.institutionName.trim()) {
            toast.error("Por favor, insira o nome da sua instituição.");
            return false;
          }
        } else {
          if (!formData.talentSource) {
            toast.error(
              "Por favor, selecione como você desenvolveu suas habilidades."
            );
            return false;
          }
        }
        break;

      case 3:
        if (formData.educationalBackground !== "fora_escola") {
          if (
            !formData.studyDetails.course ||
            !formData.studyDetails.yearOrPeriod
          ) {
            toast.error("Por favor, preencha os detalhes do seu curso.");
            return false;
          }
        } else if (formData.talentSource === "ong_projeto") {
          if (!formData.institutionName.trim()) {
            toast.error("Por favor, insira o nome da ONG ou Projeto Social.");
            return false;
          }
        } else if (!formData.recognitionBadge) {
          toast.error("Por favor, selecione um selo de reconhecimento.");
          return false;
        }
        break;

      case 4:
        if (formData.educationalBackground === "fora_escola") {
          if (!formData.humanizedCategory) {
            toast.error("Por favor, selecione uma categoria.");
            return false;
          }
          if (
            formData.humanizedCategory === "outra" &&
            !formData.customCategory.trim()
          ) {
            toast.error("Por favor, descreva sua categoria.");
            return false;
          }
        }
        break;

      case 5:
        if (!formData.experiences.trim()) {
          toast.error("Por favor, compartilhe suas experiências.");
          return false;
        }
        break;

      case 6:
        if (!formData.gender) {
          toast.error("Por favor, selecione seu gênero.");
          return false;
        }
        if (formData.gender === "outro" && !formData.genderOther.trim()) {
          toast.error("Por favor, especifique seu gênero.");
          return false;
        }
        if (!formData.cidade.trim()) {
          toast.error("Por favor, informe sua cidade.");
          return false;
        }
        if (!formData.areasInteresse.trim()) {
          toast.error("Por favor, informe pelo menos uma área de interesse.");
          return false;
        }
        break;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);
    try {
      if (!user || !user.id) {
        throw new Error("Usuário não autenticado");
      }

      const result = await saveOnboardingData(user.id, formData);
      if (result.success) {
        // Atualize o contexto do usuário para refletir que o onboarding foi completado
        if (setUser && user) {
          setUser({
            ...user,
            onboardingCompleto: true,
          });
        }

        toast.success("Perfil criado com sucesso!");

        // Aguardar um momento para o toast aparecer antes de redirecionar
        setTimeout(() => {
          navigate("/jovem");
        }, 1500);
      } else {
        throw new Error("Falha ao salvar dados");
      }
    } catch (error) {
      console.error("Erro ao finalizar onboarding:", error);
      toast.error(
        "Ocorreu um erro ao salvar seu perfil. Por favor, tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <CardTitle className="text-2xl font-bold text-center">
              Como você se define hoje?
            </CardTitle>
            <CardDescription className="text-center">
              Compartilhe sua situação atual para que possamos entender melhor
              seu momento.
            </CardDescription>
            <RadioGroup
              value={formData.educationalBackground}
              onValueChange={(value) =>
                handleInputChange("educationalBackground", value)
              }
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="estudante" id="estudante" />
                <Label htmlFor="estudante" className="text-base">
                  Sou estudante
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="conclui" id="conclui" />
                <Label htmlFor="conclui" className="text-base">
                  Já concluí meus estudos
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fora_escola" id="fora_escola" />
                <Label htmlFor="fora_escola" className="text-base">
                  Estou fora da escola no momento
                </Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 2:
        if (formData.educationalBackground === "fora_escola") {
          return (
            <div className="space-y-4">
              <CardTitle className="text-2xl font-bold text-center">
                Qual destas opções melhor descreve sua trajetória?
              </CardTitle>
              <CardDescription className="text-center">
                Valorizamos todas as formas de aprendizado. Selecione a opção
                que melhor descreve sua trajetória.
              </CardDescription>
              <RadioGroup
                value={formData.talentSource}
                onValueChange={(value) =>
                  handleInputChange("talentSource", value)
                }
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="autodidata" id="autodidata" />
                  <Label htmlFor="autodidata" className="text-base">
                    Autodidata
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ong_projeto" id="ong_projeto" />
                  <Label htmlFor="ong_projeto" className="text-base">
                    ONG / Projeto Social
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="faculdade_escola"
                    id="faculdade_escola"
                  />
                  <Label htmlFor="faculdade_escola" className="text-base">
                    Faculdade / Escola
                  </Label>
                </div>
              </RadioGroup>
            </div>
          );
        }
        return (
          <div className="space-y-4">
            <CardTitle className="text-2xl font-bold text-center">
              Instituição de Ensino
            </CardTitle>
            <CardDescription className="text-center">
              Ajude-nos a reconhecer as instituições que formam talentos
              incríveis!
            </CardDescription>
            <Input
              placeholder="Digite o nome da sua escola, faculdade ou curso técnico"
              value={formData.institutionName}
              onChange={(e) =>
                handleInputChange("institutionName", e.target.value)
              }
            />
          </div>
        );

      case 3:
        if (formData.educationalBackground !== "fora_escola") {
          return (
            <div className="space-y-4">
              <CardTitle className="text-2xl font-bold text-center">
                Detalhes do Curso
              </CardTitle>
              <CardDescription className="text-center">
                Compartilhe mais sobre seu curso para encontrarmos oportunidades
                relevantes.
              </CardDescription>
              <div className="space-y-4">
                <Input
                  placeholder="Nome do Curso"
                  value={formData.studyDetails.course}
                  onChange={(e) =>
                    handleStudyDetailsChange("course", e.target.value)
                  }
                />
                <Input
                  placeholder="Período atual ou ano de conclusão"
                  value={formData.studyDetails.yearOrPeriod}
                  onChange={(e) =>
                    handleStudyDetailsChange("yearOrPeriod", e.target.value)
                  }
                />
              </div>
            </div>
          );
        }
        if (formData.talentSource === "ong_projeto") {
          return (
            <div className="space-y-4">
              <CardTitle className="text-2xl font-bold text-center">
                Nome da ONG ou Projeto Social
              </CardTitle>
              <CardDescription className="text-center">
                Seu esforço conta, e o apoio que você teve também. Gostaríamos
                de dar o devido crédito!
              </CardDescription>
              <Input
                placeholder="Digite o nome da ONG ou Projeto Social"
                value={formData.institutionName}
                onChange={(e) =>
                  handleInputChange("institutionName", e.target.value)
                }
              />
            </div>
          );
        }
        return (
          <div className="space-y-4">
            <CardTitle className="text-2xl font-bold text-center">
              Você gostaria de receber um selo de reconhecimento?
            </CardTitle>
            <CardDescription className="text-center">
              Reconhecemos seu esforço e dedicação!
            </CardDescription>
            <RadioGroup
              value={formData.recognitionBadge}
              onValueChange={(value) =>
                handleInputChange("recognitionBadge", value)
              }
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="talento_raiz" id="talento_raiz" />
                <Label htmlFor="talento_raiz" className="text-base">
                  Talento Raiz
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="autodidata_destaque"
                  id="autodidata_destaque"
                />
                <Label htmlFor="autodidata_destaque" className="text-base">
                  Autodidata em Destaque
                </Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 4:
        if (formData.educationalBackground === "fora_escola") {
          return (
            <div className="space-y-4">
              <CardTitle className="text-2xl font-bold text-center">
                Escolha uma categoria que valorize seu momento
              </CardTitle>
              <CardDescription className="text-center">
                Essa categoria ajuda empresas e RHs a entenderem e valorizarem
                sua jornada.
              </CardDescription>
              <RadioGroup
                value={formData.humanizedCategory}
                onValueChange={(value) =>
                  handleInputChange("humanizedCategory", value)
                }
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="talento_reconstrucao"
                    id="talento_reconstrucao"
                  />
                  <Label htmlFor="talento_reconstrucao" className="text-base">
                    Talento em Reconstrução
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="retomada_trajetoria"
                    id="retomada_trajetoria"
                  />
                  <Label htmlFor="retomada_trajetoria" className="text-base">
                    Em Retomada de Trajetória
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="outra" id="outra" />
                  <Label htmlFor="outra" className="text-base">
                    Outra
                  </Label>
                </div>
              </RadioGroup>
              {formData.humanizedCategory === "outra" && (
                <Input
                  placeholder="Descreva sua categoria"
                  value={formData.customCategory}
                  onChange={(e) =>
                    handleInputChange("customCategory", e.target.value)
                  }
                />
              )}
            </div>
          );
        }
        return (
          <div className="space-y-4">
            <CardTitle className="text-2xl font-bold text-center">
              Parcerias e Crédito Social
            </CardTitle>
            <CardDescription className="text-center">
              Você participa ou participou de algum programa social ou ONG?
            </CardDescription>
            <RadioGroup
              value={formData.socialProgram.participates ? "sim" : "nao"}
              onValueChange={(value) =>
                handleSocialProgramChange("participates", value === "sim")
              }
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sim" id="sim" />
                <Label htmlFor="sim" className="text-base">
                  Sim
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nao" id="nao" />
                <Label htmlFor="nao" className="text-base">
                  Não
                </Label>
              </div>
            </RadioGroup>
            {formData.socialProgram.participates && (
              <>
                <Input
                  placeholder="Qual programa ou ONG?"
                  value={formData.socialProgram.programName}
                  onChange={(e) =>
                    handleSocialProgramChange("programName", e.target.value)
                  }
                />
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="authorizeMention"
                    checked={formData.socialProgram.authorizeMention}
                    onCheckedChange={(checked: boolean) =>
                      handleSocialProgramChange("authorizeMention", checked)
                    }
                  />
                  <Label htmlFor="authorizeMention">
                    Autorizo que o nome da ONG/projeto apareça no meu perfil
                    como apoiador
                  </Label>
                </div>
              </>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <CardTitle className="text-2xl font-bold text-center">
              Experiências e Portfólio
            </CardTitle>
            <CardDescription className="text-center">
              Conte suas principais experiências e compartilhe seus links
            </CardDescription>
            <Textarea
              placeholder="Conte suas principais experiências (acadêmicas, voluntárias, projetos próprios)"
              value={formData.experiences}
              onChange={(e) => handleInputChange("experiences", e.target.value)}
              className="min-h-[100px]"
            />
            <Input
              placeholder="Links úteis (portfólio, GitHub, LinkedIn, trabalhos) - opcional"
              value={formData.portfolioLinks}
              onChange={(e) =>
                handleInputChange("portfolioLinks", e.target.value)
              }
            />
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <CardTitle className="text-2xl font-bold text-center">
              Informações Adicionais
            </CardTitle>
            <CardDescription className="text-center">
              Estas informações nos ajudam a personalizar sua experiência
            </CardDescription>

            <div className="space-y-2">
              <Label className="text-base font-medium">Gênero</Label>
              <RadioGroup
                value={formData.gender}
                onValueChange={(value) => handleInputChange("gender", value)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="feminino" id="feminino" />
                  <Label htmlFor="feminino" className="text-sm">
                    Feminino
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="masculino" id="masculino" />
                  <Label htmlFor="masculino" className="text-sm">
                    Masculino
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="outro" id="outro" />
                  <Label htmlFor="outro" className="text-sm">
                    Outro
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="prefiro_nao_dizer"
                    id="prefiro_nao_dizer"
                  />
                  <Label htmlFor="prefiro_nao_dizer" className="text-sm">
                    Prefiro não dizer
                  </Label>
                </div>
              </RadioGroup>

              {formData.gender === "outro" && (
                <Input
                  placeholder="Especifique seu gênero"
                  value={formData.genderOther}
                  onChange={(e) =>
                    handleInputChange("genderOther", e.target.value)
                  }
                  className="mt-2"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cidade" className="text-base font-medium">
                Cidade
              </Label>
              <Input
                id="cidade"
                placeholder="Em qual cidade você mora?"
                value={formData.cidade}
                onChange={(e) => handleInputChange("cidade", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="areasInteresse" className="text-base font-medium">
                Áreas de Interesse
              </Label>
              <Input
                id="areasInteresse"
                placeholder="Ex: Programação, Design, Marketing (separadas por vírgula)"
                value={formData.areasInteresse}
                onChange={(e) =>
                  handleInputChange("areasInteresse", e.target.value)
                }
              />
              <p className="text-xs text-gray-500">
                Separe suas áreas de interesse por vírgulas
              </p>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <CardTitle className="text-2xl font-bold text-center">
              Trilhas de Apoio
            </CardTitle>
            <CardDescription className="text-center">
              Quais conteúdos de apoio você gostaria de acessar?
            </CardDescription>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="portfolioGuide"
                  checked={formData.supportPaths.portfolioGuide}
                  onCheckedChange={(checked: boolean) =>
                    handleSupportPathsChange("portfolioGuide", checked)
                  }
                />
                <Label htmlFor="portfolioGuide">
                  Como montar um portfólio sem formação formal
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="projectPresentation"
                  checked={formData.supportPaths.projectPresentation}
                  onCheckedChange={(checked: boolean) =>
                    handleSupportPathsChange("projectPresentation", checked)
                  }
                />
                <Label htmlFor="projectPresentation">
                  Como apresentar seu projeto com criatividade
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="freeCourses"
                  checked={formData.supportPaths.freeCourses}
                  onCheckedChange={(checked: boolean) =>
                    handleSupportPathsChange("freeCourses", checked)
                  }
                />
                <Label htmlFor="freeCourses">
                  Sugestões de cursos online gratuitos
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mentorship"
                  checked={formData.supportPaths.mentorship}
                  onCheckedChange={(checked: boolean) =>
                    handleSupportPathsChange("mentorship", checked)
                  }
                />
                <Label htmlFor="mentorship">
                  Mentoria leve em parceria com ONGs
                </Label>
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-4">
            <CardTitle className="text-2xl font-bold text-center">
              Quase lá!
            </CardTitle>
            <CardDescription className="text-center">
              Você não está estudando no momento? Sem problema. Seu talento
              continua valendo. O SimplyInvite é para você também.
            </CardDescription>
            <div className="space-y-4">
              <p className="text-sm font-medium">
                Resumo das suas informações:
              </p>
              <ul className="list-disc list-inside text-sm ml-4 space-y-1">
                <li>
                  Situação Educacional:{" "}
                  {formData.educationalBackground === "estudante"
                    ? "Estudante"
                    : formData.educationalBackground === "conclui"
                    ? "Concluiu Estudos"
                    : "Fora da Escola"}
                </li>
                {formData.institutionName && (
                  <li>Instituição: {formData.institutionName}</li>
                )}
                {formData.studyDetails.course && (
                  <li>Curso: {formData.studyDetails.course}</li>
                )}
                {formData.studyDetails.yearOrPeriod && (
                  <li>Período/Ano: {formData.studyDetails.yearOrPeriod}</li>
                )}
                {formData.talentSource && (
                  <li>Origem das Habilidades: {formData.talentSource}</li>
                )}
                {formData.humanizedCategory && (
                  <li>
                    Categoria:{" "}
                    {formData.humanizedCategory === "outra"
                      ? formData.customCategory
                      : formData.humanizedCategory}
                  </li>
                )}
                {formData.socialProgram.participates && (
                  <li>Programa Social: {formData.socialProgram.programName}</li>
                )}
                {formData.recognitionBadge && (
                  <li>Selo de Reconhecimento: {formData.recognitionBadge}</li>
                )}
                {formData.cidade && <li>Cidade: {formData.cidade}</li>}
                {formData.gender && (
                  <li>
                    Gênero:{" "}
                    {formData.gender === "outro"
                      ? formData.genderOther
                      : formData.gender}
                  </li>
                )}
                {formData.areasInteresse && (
                  <li>Áreas de Interesse: {formData.areasInteresse}</li>
                )}
              </ul>
            </div>
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handlePreviousStep}>
                Anterior
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Finalizando..." : "Enviar meu perfil"}
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <CardTitle className="text-2xl font-bold text-center">
              Ops!
            </CardTitle>
            <CardDescription className="text-center">
              Ocorreu um erro no formulário de onboarding. Por favor, tente
              novamente ou entre em contato com o suporte.
            </CardDescription>
          </div>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Card className="w-full max-w-md p-6 space-y-6">
        <CardHeader className="flex justify-between items-center mb-4 p-0">
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="outline"
              onClick={handlePreviousStep}
              disabled={step === 1}
            >
              Anterior
            </Button>
            <span className="text-sm text-gray-500">Passo {step} de 8</span>
            <Button
              variant="outline"
              onClick={handleNextStep}
              disabled={step === 8}
            >
              Próximo
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">{renderStepContent()}</CardContent>
      </Card>
    </div>
  );
};

export default OnboardingForm;
