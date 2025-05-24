import React, { useState } from "react";
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
} from "@/components/ui/card";

type OnboardingFormData = {
  fullName: string;
  age: string;
  gender: string;
  genderOther?: string;
  cityState: string;

  // Formação
  educationStatus: string[];
  collegeName?: string;
  collegeCourse?: string;
  collegePeriod?: string;
  collegeModality?: string;
  collegeType?: string;
  collegeScholarship?: string;
  collegeScholarshipName?: string;
  collegeGraduatedName?: string;
  collegeGraduatedCourse?: string;
  collegeGraduationYear?: string;
  highSchoolName?: string;
  highSchoolType?: string;
  highSchoolGraduationYear?: string;
  outOfSchoolLastYear?: string;
  outOfSchoolReason?: string;
  autodidactMethod?: string;
  ngoName?: string;
  ngoParticipation?: string;

  // Experiência
  hasExperience: string;
  experienceDescription?: string;
  experienceType?: string;

  // Destaque
  highlightDescription: string;

  // Badge especial
  specialBadge: string;

  // Confirmação
  authorization: boolean;
};

const TalentOnboardingForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const form = useForm<OnboardingFormData>({
    defaultValues: {
      fullName: "",
      age: "",
      gender: "",
      cityState: "",
      educationStatus: [],
      hasExperience: "no",
      highlightDescription: "",
      specialBadge: "",
      authorization: false,
    },
  });

  const educationStatus = form.watch("educationStatus", []);
  const gender = form.watch("gender", "");
  const hasExperience = form.watch("hasExperience", "no");

  const handleSubmit = async (data: OnboardingFormData) => {
    try {
      console.log("Form data submitted:", data);

      // Em uma implementação real, você enviaria esses dados para o backend
      // await api.post('/jovem/onboarding', formData);
      
      // Simulando um delay para feedback visual
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Perfil atualizado com sucesso!");
      navigate("/jovem");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Ocorreu um erro ao salvar seu perfil. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">SimplyInvite</h1>
          <p className="text-muted-foreground mt-2">
            Vamos conhecer melhor sua jornada para valorizar sua história
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              📋 Formulário de Identificação e Trajetória
            </CardTitle>
            <CardDescription>
              Esse formulário nos ajuda a conhecer melhor sua jornada e
              valorizar sua história. Todos os perfis são bem-vindos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-8"
              >
                {/* Seção: Informações Pessoais */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">
                    👤 Informações Pessoais
                  </h3>

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
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="age"
                    rules={{ required: "Idade é obrigatória" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Idade</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Ex: 18"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    rules={{ required: "Gênero é obrigatório" }}
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Gênero</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="feminino" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Feminino
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="masculino" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Masculino
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="prefiro_nao_dizer" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Prefiro não dizer
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="outro" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Outro
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {gender === "outro" && (
                    <FormField
                      control={form.control}
                      name="genderOther"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Especifique seu gênero</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Especifique seu gênero"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="cityState"
                    rules={{ required: "Cidade/Estado é obrigatório" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade / Estado</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: São Paulo/SP" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Seção: Formação */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">
                    🎓 Como você se define hoje em relação à sua formação?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Escolha as opções que melhor representam sua situação atual.
                  </p>

                  <FormField
                    control={form.control}
                    name="educationStatus"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid gap-4">
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(
                                  "college_current"
                                )}
                                onCheckedChange={(checked) => {
                                  const current = field.value || [];
                                  return checked
                                    ? field.onChange([
                                        ...current,
                                        "college_current",
                                      ])
                                    : field.onChange(
                                        current.filter(
                                          (value) => value !== "college_current"
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1">
                              <FormLabel>Faço faculdade atualmente</FormLabel>
                            </div>
                          </FormItem>

                          {educationStatus.includes("college_current") && (
                            <div className="ml-7 space-y-4">
                              <FormField
                                control={form.control}
                                name="collegeName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Nome da faculdade</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="collegeCourse"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Curso</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="collegePeriod"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Período</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="collegeModality"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Modalidade</FormLabel>
                                    <FormControl>
                                      <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="flex space-x-4"
                                      >
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                          <FormControl>
                                            <RadioGroupItem value="ead" />
                                          </FormControl>
                                          <FormLabel className="font-normal">
                                            EAD
                                          </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                          <FormControl>
                                            <RadioGroupItem value="presencial" />
                                          </FormControl>
                                          <FormLabel className="font-normal">
                                            Presencial
                                          </FormLabel>
                                        </FormItem>
                                      </RadioGroup>
                                    </FormControl>
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="collegeType"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Tipo</FormLabel>
                                    <FormControl>
                                      <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="flex space-x-4"
                                      >
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                          <FormControl>
                                            <RadioGroupItem value="publica" />
                                          </FormControl>
                                          <FormLabel className="font-normal">
                                            Pública
                                          </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                          <FormControl>
                                            <RadioGroupItem value="particular" />
                                          </FormControl>
                                          <FormLabel className="font-normal">
                                            Particular
                                          </FormLabel>
                                        </FormItem>
                                      </RadioGroup>
                                    </FormControl>
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="collegeScholarship"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Bolsa de estudos</FormLabel>
                                    <FormControl>
                                      <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="flex space-x-4"
                                      >
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                          <FormControl>
                                            <RadioGroupItem value="sim" />
                                          </FormControl>
                                          <FormLabel className="font-normal">
                                            Sim
                                          </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                          <FormControl>
                                            <RadioGroupItem value="nao" />
                                          </FormControl>
                                          <FormLabel className="font-normal">
                                            Não
                                          </FormLabel>
                                        </FormItem>
                                      </RadioGroup>
                                    </FormControl>
                                  </FormItem>
                                )}
                              />

                              {form.watch("collegeScholarship") === "sim" && (
                                <FormField
                                  control={form.control}
                                  name="collegeScholarshipName"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Qual bolsa?</FormLabel>
                                      <FormControl>
                                        <Input {...field} />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              )}
                            </div>
                          )}

                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(
                                  "college_graduated"
                                )}
                                onCheckedChange={(checked) => {
                                  const current = field.value || [];
                                  return checked
                                    ? field.onChange([
                                        ...current,
                                        "college_graduated",
                                      ])
                                    : field.onChange(
                                        current.filter(
                                          (value) =>
                                            value !== "college_graduated"
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1">
                              <FormLabel>Já concluí uma faculdade</FormLabel>
                            </div>
                          </FormItem>

                          {educationStatus.includes("college_graduated") && (
                            <div className="ml-7 space-y-4">
                              <FormField
                                control={form.control}
                                name="collegeGraduatedName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Nome da faculdade</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="collegeGraduatedCourse"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Curso</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="collegeGraduationYear"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Ano de conclusão</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                          )}

                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(
                                  "high_school_completed"
                                )}
                                onCheckedChange={(checked) => {
                                  const current = field.value || [];
                                  return checked
                                    ? field.onChange([
                                        ...current,
                                        "high_school_completed",
                                      ])
                                    : field.onChange(
                                        current.filter(
                                          (value) =>
                                            value !== "high_school_completed"
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1">
                              <FormLabel>Concluí o ensino médio</FormLabel>
                            </div>
                          </FormItem>

                          {educationStatus.includes(
                            "high_school_completed"
                          ) && (
                            <div className="ml-7 space-y-4">
                              <FormField
                                control={form.control}
                                name="highSchoolName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Escola</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="highSchoolType"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Tipo</FormLabel>
                                    <FormControl>
                                      <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="flex space-x-4"
                                      >
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                          <FormControl>
                                            <RadioGroupItem value="publica" />
                                          </FormControl>
                                          <FormLabel className="font-normal">
                                            Pública
                                          </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                          <FormControl>
                                            <RadioGroupItem value="particular" />
                                          </FormControl>
                                          <FormLabel className="font-normal">
                                            Particular
                                          </FormLabel>
                                        </FormItem>
                                      </RadioGroup>
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="highSchoolGraduationYear"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Ano de conclusão</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                          )}

                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes("out_of_school")}
                                onCheckedChange={(checked) => {
                                  const current = field.value || [];
                                  return checked
                                    ? field.onChange([
                                        ...current,
                                        "out_of_school",
                                      ])
                                    : field.onChange(
                                        current.filter(
                                          (value) => value !== "out_of_school"
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1">
                              <FormLabel>
                                Estou fora da escola atualmente
                              </FormLabel>
                            </div>
                          </FormItem>

                          {educationStatus.includes("out_of_school") && (
                            <div className="ml-7 space-y-4">
                              <FormField
                                control={form.control}
                                name="outOfSchoolLastYear"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Último ano cursado</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="outOfSchoolReason"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Motivo (opcional)</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                          )}

                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes("autodidact")}
                                onCheckedChange={(checked) => {
                                  const current = field.value || [];
                                  return checked
                                    ? field.onChange([...current, "autodidact"])
                                    : field.onChange(
                                        current.filter(
                                          (value) => value !== "autodidact"
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1">
                              <FormLabel>Sou autodidata</FormLabel>
                            </div>
                          </FormItem>

                          {educationStatus.includes("autodidact") && (
                            <div className="ml-7">
                              <FormField
                                control={form.control}
                                name="autodidactMethod"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>
                                      Como você aprende? (ex: vídeos, livros,
                                      prática)
                                    </FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                          )}

                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes("ngo_project")}
                                onCheckedChange={(checked) => {
                                  const current = field.value || [];
                                  return checked
                                    ? field.onChange([
                                        ...current,
                                        "ngo_project",
                                      ])
                                    : field.onChange(
                                        current.filter(
                                          (value) => value !== "ngo_project"
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1">
                              <FormLabel>
                                Faço/fiz parte de ONG ou Projeto Social
                              </FormLabel>
                            </div>
                          </FormItem>

                          {educationStatus.includes("ngo_project") && (
                            <div className="ml-7 space-y-4">
                              <FormField
                                control={form.control}
                                name="ngoName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Nome da ONG / projeto</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="ngoParticipation"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Ainda participa?</FormLabel>
                                    <FormControl>
                                      <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="flex space-x-4"
                                      >
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                          <FormControl>
                                            <RadioGroupItem value="sim" />
                                          </FormControl>
                                          <FormLabel className="font-normal">
                                            Sim
                                          </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                          <FormControl>
                                            <RadioGroupItem value="nao" />
                                          </FormControl>
                                          <FormLabel className="font-normal">
                                            Não
                                          </FormLabel>
                                        </FormItem>
                                      </RadioGroup>
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                          )}

                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(
                                  "no_formal_education"
                                )}
                                onCheckedChange={(checked) => {
                                  const current = field.value || [];
                                  return checked
                                    ? field.onChange([
                                        ...current,
                                        "no_formal_education",
                                      ])
                                    : field.onChange(
                                        current.filter(
                                          (value) =>
                                            value !== "no_formal_education"
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1">
                              <FormLabel>
                                Nunca tive formação formal (escola ou faculdade)
                              </FormLabel>
                            </div>
                          </FormItem>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Seção: Experiência */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">
                    💼 Você já teve alguma experiência com trabalho, projetos ou
                    atividades?
                  </h3>

                  <FormField
                    control={form.control}
                    name="hasExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex space-x-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="yes" />
                              </FormControl>
                              <FormLabel className="font-normal">Sim</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="no" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Ainda não
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {hasExperience === "yes" && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="experienceDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Qual(is)?</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="experienceType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Era voluntário, remunerado ou pessoal?
                            </FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                {/* Seção: Destaque */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">
                    🧩 Deseja nos contar algo que você acredita que te destaque?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Exemplo: superação, projeto pessoal, habilidade especial,
                    etc.
                  </p>

                  <FormField
                    control={form.control}
                    name="highlightDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Conte-nos um pouco sobre você..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Seção: Badge Especial */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">
                    🌟 Exibir meu perfil com destaque especial (baseado na minha
                    história):
                  </h3>

                  <FormField
                    control={form.control}
                    name="specialBadge"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-col space-y-2"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="talent_rebuilding" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                "Talento em Reconstrução" (retomando os estudos
                                ou projetos)
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="autodidact_highlight" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                "Autodidata em Destaque"
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="social_connected" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                "Conectado com Projeto Social"
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="root_talent" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                "Talento Raiz" (trajetória independente)
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Confirmação */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">✅ Confirmação</h3>

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
                            Autorizo o uso dessas informações para análise de
                            oportunidades e possíveis parcerias.
                          </FormLabel>
                          <FormDescription>
                            Estou ciente de que minha trajetória será respeitada
                            e valorizada, independente da formação tradicional.
                          </FormDescription>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Confirmar e Continuar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => navigate("/jovem-auth")}
                >
                  Voltar para a tela de login
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TalentOnboardingForm;
