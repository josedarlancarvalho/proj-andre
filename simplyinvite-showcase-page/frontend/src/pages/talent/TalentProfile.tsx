import React, { useState, useEffect, useRef } from "react";
import UserPanelLayout from "@/components/UserPanelLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Edit, Save, Image, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getMeuPerfil } from "@/servicos/usuario";
import { atualizarPerfil } from "@/servicos/jovem";
import { FormItem } from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";

// Define interface for profile data
interface TalentProfileData {
  name: string;
  city: string;
  interests: string[];
  bio: string;
  avatarUrl: string;
  formacaoCurso: string;
  formacaoInstituicao: string;
  formacaoPeriodo: string;
  gender: string;
  genderOther?: string;
  collegeModality?: string;
  collegeType?: string;
  experienceDescription?: string;
  specialBadge?: string;
  portfolioUrl?: string;
  isLoading?: boolean;
}

const TalentProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { setUser } = useAuth();

  // Initialize with default/empty values
  const [profile, setProfile] = useState<TalentProfileData>({
    name: "Carregando...",
    city: "",
    interests: [],
    bio: "",
    avatarUrl: "",
    formacaoCurso: "",
    formacaoInstituicao: "",
    formacaoPeriodo: "",
    gender: "",
    genderOther: "",
    collegeModality: "",
    collegeType: "",
    experienceDescription: "",
    specialBadge: "",
    portfolioUrl: "",
    isLoading: true,
  });

  // useEffect to fetch profile data
  useEffect(() => {
    const fetchTalentProfile = async () => {
      try {
        const data = await getMeuPerfil();
        console.log("Dados recebidos de /api/auth/me:", data);

        // Mapeando os dados do onboarding para os campos do perfil
        const usuario = data.usuario;

        if (!usuario) {
          console.error("Dados do usuário não encontrados");
          toast({
            title: "Erro",
            description: "Não foi possível carregar os dados do usuário.",
            variant: "destructive",
          });
          return;
        }

        console.log("Dados do usuário para o perfil:", usuario);

        // Mapeamento para formação acadêmica
        let formacaoCurso = "";
        let formacaoInstituicao = "";
        let formacaoPeriodo = "";

        // Verificar se os dados vêm do onboarding ou já estão nos campos esperados
        if (usuario.studyDetails?.course) {
          formacaoCurso = usuario.studyDetails.course;
        } else if (usuario.formacaoCurso) {
          formacaoCurso = usuario.formacaoCurso;
        }

        if (usuario.institutionName) {
          formacaoInstituicao = usuario.institutionName;
        } else if (usuario.formacaoInstituicao) {
          formacaoInstituicao = usuario.formacaoInstituicao;
        }

        if (usuario.studyDetails?.yearOrPeriod) {
          formacaoPeriodo = usuario.studyDetails.yearOrPeriod;
        } else if (usuario.formacaoPeriodo) {
          formacaoPeriodo = usuario.formacaoPeriodo;
        }

        // Experiência
        const experienceDescription =
          usuario.experiences || usuario.experienceDescription || "";

        // Links de portfólio podem estar em portfolioLinks ou em outro campo
        const portfolioUrl = usuario.portfolioLinks || usuario.githubUrl || "";

        // Badge especial
        const specialBadge =
          usuario.recognitionBadge || usuario.specialBadge || "";

        // Objeto de perfil atualizado
        const updatedProfile = {
          name: usuario.nomeCompleto || "",
          city: usuario.cidade || "",
          interests: usuario.areasInteresse || [],
          bio: usuario.bio || "",
          avatarUrl: usuario.avatarUrl || "",
          formacaoCurso: formacaoCurso,
          formacaoInstituicao: formacaoInstituicao,
          formacaoPeriodo: formacaoPeriodo,
          gender: usuario.gender || "",
          genderOther: usuario.genderOther || "",
          collegeModality: usuario.collegeModality || "",
          collegeType: usuario.collegeType || "",
          experienceDescription: experienceDescription,
          specialBadge: specialBadge,
          portfolioUrl: portfolioUrl,
          isLoading: false,
        };

        console.log("Perfil processado:", updatedProfile);
        setProfile(updatedProfile);
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        toast({
          title: "Erro",
          description:
            "Não foi possível carregar seu perfil. Tente novamente mais tarde.",
          variant: "destructive",
        });
      }
    };
    fetchTalentProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const dadosAtualizados = {
        nomeCompleto: profile.name,
        cidade: profile.city,
        areasInteresse: profile.interests,
        bio: profile.bio,
        formacaoCurso: profile.formacaoCurso,
        formacaoInstituicao: profile.formacaoInstituicao,
        formacaoPeriodo: profile.formacaoPeriodo,
        gender: profile.gender,
        genderOther: profile.genderOther,
        collegeModality: profile.collegeModality,
        collegeType: profile.collegeType,
        experienceDescription: profile.experienceDescription,
        specialBadge: profile.specialBadge,
        portfolioLinks: profile.portfolioUrl,
      };

      console.log(
        "Salvando perfil com dados:",
        JSON.stringify(dadosAtualizados, null, 2)
      );

      const result = await atualizarPerfil(dadosAtualizados);

      console.log("Resposta da API:", JSON.stringify(result, null, 2));
      setIsEditing(false);

      // Atualizar os dados do usuário no contexto de autenticação para refletir as mudanças em todo o aplicativo
      const updatedUserData = await getMeuPerfil();
      if (updatedUserData && updatedUserData.usuario) {
        console.log("Dados atualizados do usuário:", updatedUserData.usuario);
        setUser(updatedUserData.usuario);
      }

      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as alterações. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "A imagem deve ter no máximo 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch("/api/jovem/avatar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Erro ao fazer upload");

      const data = await response.json();
      setProfile((prev) => ({
        ...prev,
        avatarUrl: data.avatarUrl,
      }));

      toast({
        title: "Sucesso",
        description: "Foto atualizada com sucesso!",
      });
    } catch (error) {
      console.error("Erro no upload:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar sua foto. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (profile.isLoading) {
    return (
      <UserPanelLayout userType="jovem">
        <div className="flex justify-center items-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </UserPanelLayout>
    );
  }

  return (
    <UserPanelLayout userType="jovem">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Meu Perfil</h1>
          {!isEditing ? (
            <Button onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Editar Perfil
            </Button>
          ) : (
            <Button onClick={handleSave} disabled={isUploading}>
              <Save className="mr-2 h-4 w-4" />
              Salvar Alterações
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center space-y-3">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                  <AvatarFallback>
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelected}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFileUpload}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Image className="mr-2 h-4 w-4" />
                  )}
                  {isUploading ? "Enviando..." : "Alterar Foto"}
                </Button>
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome Completo</label>
                    {isEditing ? (
                      <Input
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                      />
                    ) : (
                      <p>{profile.name || "Não informado"}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Gênero</label>
                    {isEditing ? (
                      <>
                        <RadioGroup
                          name="gender"
                          value={profile.gender}
                          onValueChange={(value) =>
                            handleChange({
                              target: { name: "gender", value },
                            } as any)
                          }
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2">
                            <RadioGroupItem value="feminino" id="feminino" />
                            <label htmlFor="feminino" className="font-normal">
                              Feminino
                            </label>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <RadioGroupItem value="masculino" id="masculino" />
                            <label htmlFor="masculino" className="font-normal">
                              Masculino
                            </label>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <RadioGroupItem value="outro" id="outro" />
                            <label htmlFor="outro" className="font-normal">
                              Outro
                            </label>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="prefiro_nao_dizer"
                              id="prefiro_nao_dizer"
                            />
                            <label
                              htmlFor="prefiro_nao_dizer"
                              className="font-normal"
                            >
                              Prefiro não dizer
                            </label>
                          </FormItem>
                        </RadioGroup>
                        {profile.gender === "outro" && (
                          <Input
                            name="genderOther"
                            value={profile.genderOther || ""}
                            onChange={handleChange}
                            placeholder="Especifique seu gênero"
                            className="mt-2"
                          />
                        )}
                      </>
                    ) : (
                      <p>
                        {profile.genderOther && profile.gender === "outro"
                          ? profile.genderOther
                          : profile.gender || "Não informado"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cidade</label>
                    {isEditing ? (
                      <Input
                        name="city"
                        value={profile.city}
                        onChange={handleChange}
                      />
                    ) : (
                      <p>{profile.city || "Não informado"}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Áreas de Interesse
                    </label>
                    {isEditing ? (
                      <Input
                        name="interests"
                        value={profile.interests.join(", ")}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            interests: e.target.value
                              .split(",")
                              .map((item) => item.trim()),
                          }))
                        }
                        placeholder="Ex: React, Node.js, Design"
                      />
                    ) : (
                      <p>{profile.interests.join(", ") || "Não informado"}</p>
                    )}
                  </div>
                </div>

                {/* Formação Acadêmica Section */}
                <div className="space-y-2 pt-4 border-t mt-4">
                  <h3 className="text-md font-semibold">Formação Acadêmica</h3>
                  {/* Curso */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Curso</label>
                    {isEditing ? (
                      <Input
                        name="formacaoCurso"
                        value={profile.formacaoCurso}
                        onChange={handleChange}
                        placeholder="Ex: Ciência da Computação"
                      />
                    ) : (
                      <p>{profile.formacaoCurso || "Não informado"}</p>
                    )}
                  </div>
                  {/* Instituição */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Instituição (Faculdade)
                    </label>
                    {isEditing ? (
                      <Input
                        name="formacaoInstituicao"
                        value={profile.formacaoInstituicao}
                        onChange={handleChange}
                        placeholder="Ex: Universidade XYZ"
                      />
                    ) : (
                      <p>{profile.formacaoInstituicao || "Não informado"}</p>
                    )}
                  </div>
                  {/* Período/Semestre */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Período/Semestre
                    </label>
                    {isEditing ? (
                      <Input
                        name="formacaoPeriodo"
                        value={profile.formacaoPeriodo}
                        onChange={handleChange}
                        placeholder="Ex: 8º Semestre"
                      />
                    ) : (
                      <p>{profile.formacaoPeriodo || "Não informado"}</p>
                    )}
                  </div>

                  {/* Modalidade da Faculdade */}
                  {(isEditing || profile.collegeModality) && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Modalidade (Faculdade)
                      </label>
                      {isEditing ? (
                        <RadioGroup
                          name="collegeModality"
                          value={profile.collegeModality || ""}
                          onValueChange={(value) =>
                            handleChange({
                              target: { name: "collegeModality", value },
                            } as any)
                          }
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2">
                            <RadioGroupItem value="ead" id="modality_ead" />
                            <label
                              htmlFor="modality_ead"
                              className="font-normal"
                            >
                              EAD
                            </label>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="presencial"
                              id="modality_presencial"
                            />
                            <label
                              htmlFor="modality_presencial"
                              className="font-normal"
                            >
                              Presencial
                            </label>
                          </FormItem>
                        </RadioGroup>
                      ) : (
                        <p>{profile.collegeModality || "Não informado"}</p>
                      )}
                    </div>
                  )}

                  {/* Tipo da Faculdade (Pública/Particular) */}
                  {(isEditing || profile.collegeType) && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Tipo de Instituição (Faculdade)
                      </label>
                      {isEditing ? (
                        <RadioGroup
                          name="collegeType"
                          value={profile.collegeType || ""}
                          onValueChange={(value) =>
                            handleChange({
                              target: { name: "collegeType", value },
                            } as any)
                          }
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2">
                            <RadioGroupItem value="publica" id="type_publica" />
                            <label
                              htmlFor="type_publica"
                              className="font-normal"
                            >
                              Pública
                            </label>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="particular"
                              id="type_particular"
                            />
                            <label
                              htmlFor="type_particular"
                              className="font-normal"
                            >
                              Particular
                            </label>
                          </FormItem>
                        </RadioGroup>
                      ) : (
                        <p>{profile.collegeType || "Não informado"}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Experiência */}
                {(isEditing || profile.experienceDescription) && (
                  <div className="space-y-2 pt-4 border-t mt-4">
                    <h3 className="text-md font-semibold">Experiência</h3>
                    <label className="text-sm font-medium">
                      Descrição da Experiência
                    </label>
                    {isEditing ? (
                      <Textarea
                        name="experienceDescription"
                        value={profile.experienceDescription || ""}
                        onChange={handleChange}
                        placeholder="Descreva suas experiências profissionais, projetos ou atividades relevantes..."
                        className="min-h-[100px]"
                      />
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">
                        {profile.experienceDescription || "Não informado"}
                      </p>
                    )}
                  </div>
                )}

                {/* Link de Portfólio */}
                {(isEditing || profile.portfolioUrl) && (
                  <div className="space-y-2 pt-4 border-t mt-4">
                    <h3 className="text-md font-semibold">Portfólio</h3>
                    <label className="text-sm font-medium">
                      Link do Portfólio/GitHub
                    </label>
                    {isEditing ? (
                      <Input
                        name="portfolioUrl"
                        value={profile.portfolioUrl || ""}
                        onChange={handleChange}
                        placeholder="Ex: https://github.com/seu-usuario"
                      />
                    ) : (
                      <p className="text-sm">
                        {profile.portfolioUrl ? (
                          <a
                            href={profile.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {profile.portfolioUrl}
                          </a>
                        ) : (
                          "Não informado"
                        )}
                      </p>
                    )}
                  </div>
                )}

                {/* Badge Especial */}
                {(isEditing || profile.specialBadge) && (
                  <div className="space-y-2 pt-4 border-t mt-4">
                    <h3 className="text-md font-semibold">Destaque Especial</h3>
                    <label className="text-sm font-medium">
                      Selo de Destaque
                    </label>
                    {isEditing ? (
                      <RadioGroup
                        name="specialBadge"
                        value={profile.specialBadge || ""}
                        onValueChange={(value) =>
                          handleChange({
                            target: { name: "specialBadge", value },
                          } as any)
                        }
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="talent_rebuilding"
                            id="badge_rebuilding"
                          />
                          <label
                            htmlFor="badge_rebuilding"
                            className="font-normal"
                          >
                            Talento em Reconstrução
                          </label>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="autodidact_highlight"
                            id="badge_autodidact"
                          />
                          <label
                            htmlFor="badge_autodidact"
                            className="font-normal"
                          >
                            Autodidata em Destaque
                          </label>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="social_connected"
                            id="badge_social"
                          />
                          <label htmlFor="badge_social" className="font-normal">
                            Conectado com Projeto Social
                          </label>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <RadioGroupItem value="root_talent" id="badge_root" />
                          <label htmlFor="badge_root" className="font-normal">
                            Talento Raiz
                          </label>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <RadioGroupItem value="" id="badge_none" />
                          <label htmlFor="badge_none" className="font-normal">
                            Nenhum
                          </label>
                        </FormItem>
                      </RadioGroup>
                    ) : (
                      <p className="text-sm">
                        {profile.specialBadge
                          ?.replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase()) ||
                          "Não informado"}
                      </p>
                    )}
                  </div>
                )}

                {/* Biografia */}
                <div className="space-y-2 pt-4 border-t mt-4">
                  <label className="text-md font-semibold">Biografia</label>
                  {isEditing ? (
                    <Textarea
                      name="bio"
                      value={profile.bio}
                      onChange={handleChange}
                      className="h-32"
                      placeholder="Fale um pouco sobre você..."
                    />
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">
                      {profile.bio || "Não informado"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </UserPanelLayout>
  );
};

export default TalentProfile;
