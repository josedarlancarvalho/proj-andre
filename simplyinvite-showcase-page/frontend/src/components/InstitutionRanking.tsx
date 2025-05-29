import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Building,
  GraduationCap,
  Users,
  Laptop,
  Briefcase,
  Heart,
  Globe,
  Lightbulb,
  BookOpen,
  Handshake,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Institution {
  id: number;
  name: string;
  type: "Pública" | "Privada" | "ONG" | "Instituto";
  category:
    | "Universidade"
    | "Faculdade"
    | "Instituto Técnico"
    | "Organização Social"
    | "Centro de Pesquisa";
  location: string;
  impactArea: string;
  impactDescription: string;
  iconType:
    | "education"
    | "tech"
    | "social"
    | "business"
    | "health"
    | "global"
    | "research"
    | "community";
}

const InstitutionRanking = () => {
  const [activeFilter, setActiveFilter] = useState("todas");
  const [institutionsList, setInstitutionsList] = useState<Institution[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulando uma chamada à API
    const loadInstitutions = () => {
      setIsLoading(true);

      // Dados de exemplo para demonstração - Instituições de Recife
      const mockInstitutions: Institution[] = [
        {
          id: 1,
          name: "Universidade Federal de Pernambuco (UFPE)",
          type: "Pública",
          category: "Universidade",
          location: "Recife",
          impactArea: "Pesquisa e Inovação",
          impactDescription:
            "Referência em pesquisa científica e formação profissional, com mais de 40 mil alunos em diversos cursos de graduação e pós-graduação.",
          iconType: "education",
        },
        {
          id: 2,
          name: "Universidade de Pernambuco (UPE)",
          type: "Pública",
          category: "Universidade",
          location: "Recife",
          impactArea: "Formação Profissional",
          impactDescription:
            "Instituição estadual com forte atuação nas áreas de saúde, educação e tecnologia, formando profissionais para o mercado regional.",
          iconType: "education",
        },
        {
          id: 3,
          name: "Instituto Federal de Pernambuco (IFPE)",
          type: "Pública",
          category: "Instituto Técnico",
          location: "Recife",
          impactArea: "Educação Técnica",
          impactDescription:
            "Oferece formação técnica e tecnológica de qualidade, com foco na inserção rápida dos estudantes no mercado de trabalho.",
          iconType: "education",
        },
        {
          id: 4,
          name: "Universidade Católica de Pernambuco (UNICAP)",
          type: "Privada",
          category: "Universidade",
          location: "Recife",
          impactArea: "Formação Humanística",
          impactDescription:
            "Instituição jesuíta com mais de 70 anos de tradição, formando profissionais com visão humanística e compromisso social.",
          iconType: "education",
        },
        {
          id: 5,
          name: "FBV - Faculdade Boa Viagem",
          type: "Privada",
          category: "Faculdade",
          location: "Recife",
          impactArea: "Empreendedorismo",
          impactDescription:
            "Referência em cursos de gestão e negócios, com forte conexão com o mercado empresarial local e programas de aceleração de startups.",
          iconType: "business",
        },
        {
          id: 6,
          name: "CESAR School",
          type: "Privada",
          category: "Faculdade",
          location: "Recife",
          impactArea: "Inovação Tecnológica",
          impactDescription:
            "Instituição educacional do Porto Digital focada na formação de profissionais para a economia criativa e digital.",
          iconType: "tech",
        },
        {
          id: 7,
          name: "Porto Digital",
          type: "Instituto",
          category: "Centro de Pesquisa",
          location: "Recife",
          impactArea: "Ecossistema de Inovação",
          impactDescription:
            "Parque tecnológico que abriga mais de 300 empresas e instituições, gerando oportunidades em tecnologia e economia criativa.",
          iconType: "tech",
        },
        {
          id: 8,
          name: "Instituto Fecomércio",
          type: "Instituto",
          category: "Centro de Pesquisa",
          location: "Recife",
          impactArea: "Capacitação Profissional",
          impactDescription:
            "Desenvolve programas de qualificação profissional para o setor de comércio e serviços, beneficiando milhares de pessoas anualmente.",
          iconType: "business",
        },
        {
          id: 9,
          name: "SENAC Pernambuco",
          type: "Instituto",
          category: "Instituto Técnico",
          location: "Recife",
          impactArea: "Formação Técnica",
          impactDescription:
            "Oferece cursos profissionalizantes em diversas áreas, preparando jovens e adultos para o mercado de trabalho.",
          iconType: "education",
        },
        {
          id: 10,
          name: "SENAI Pernambuco",
          type: "Instituto",
          category: "Instituto Técnico",
          location: "Recife",
          impactArea: "Formação Industrial",
          impactDescription:
            "Referência em educação profissional para o setor industrial, com laboratórios modernos e parcerias com empresas.",
          iconType: "business",
        },
        {
          id: 11,
          name: "Instituto Boa Vista",
          type: "ONG",
          category: "Organização Social",
          location: "Recife",
          impactArea: "Inclusão Digital",
          impactDescription:
            "Promove a inclusão digital em comunidades carentes, beneficiando mais de 2.000 jovens anualmente com cursos gratuitos de tecnologia.",
          iconType: "social",
        },
        {
          id: 12,
          name: "Centro de Tecnologias Sociais Capibaribe",
          type: "ONG",
          category: "Organização Social",
          location: "Recife",
          impactArea: "Inovação Social",
          impactDescription:
            "Desenvolve soluções tecnológicas para problemas sociais, com foco em sustentabilidade e melhoria da qualidade de vida em comunidades.",
          iconType: "community",
        },
      ];

      setTimeout(() => {
        setInstitutionsList(mockInstitutions);
        setIsLoading(false);
      }, 800); // Simulando um pequeno delay de carregamento
    };

    loadInstitutions();
  }, []);

  // Função para renderizar o ícone com base no tipo
  const getIconByType = (type: string) => {
    switch (type) {
      case "education":
        return <GraduationCap className="h-10 w-10 text-blue-500" />;
      case "tech":
        return <Laptop className="h-10 w-10 text-purple-500" />;
      case "social":
        return <Heart className="h-10 w-10 text-pink-500" />;
      case "business":
        return <Briefcase className="h-10 w-10 text-amber-500" />;
      case "health":
        return <Heart className="h-10 w-10 text-red-500" />;
      case "global":
        return <Globe className="h-10 w-10 text-green-500" />;
      case "research":
        return <BookOpen className="h-10 w-10 text-indigo-500" />;
      case "community":
        return <Handshake className="h-10 w-10 text-emerald-500" />;
      default:
        return <Building className="h-10 w-10 text-gray-500" />;
    }
  };

  const filteredInstitutions =
    activeFilter === "todas"
      ? institutionsList
      : institutionsList.filter(
          (inst) =>
            inst.type.toLowerCase() === activeFilter.toLowerCase() ||
            inst.category.toLowerCase() === activeFilter.toLowerCase() ||
            inst.impactArea.toLowerCase().includes(activeFilter.toLowerCase())
        );

  if (isLoading) {
    return (
      <section id="institutions" className="py-20 bg-gray-50">
        <div className="section-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-si-blue mb-4">
            Instituições que Transformam
          </h2>
          <p className="text-gray-600 mb-8">
            Carregando informações das instituições...
          </p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-si-blue"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="institutions" className="py-20 bg-gray-50">
      <div className="section-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-si-blue mb-4">
            Instituições que Transformam
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Conheça as organizações de Recife que estão promovendo oportunidades
            e mudando trajetórias.
          </p>
        </div>

        <div className="mb-8">
          <Tabs defaultValue="todas" onValueChange={setActiveFilter}>
            <div className="flex justify-center mb-6 flex-wrap gap-2">
              <TabsList className="mb-2">
                <TabsTrigger value="todas">Todas</TabsTrigger>
                <TabsTrigger value="pública">Instituições Públicas</TabsTrigger>
                <TabsTrigger value="privada">Instituições Privadas</TabsTrigger>
                <TabsTrigger value="ong">ONGs</TabsTrigger>
                <TabsTrigger value="instituto">Institutos</TabsTrigger>
              </TabsList>
              <TabsList>
                <TabsTrigger value="universidade">Universidades</TabsTrigger>
                <TabsTrigger value="faculdade">Faculdades</TabsTrigger>
                <TabsTrigger value="instituto técnico">
                  Institutos Técnicos
                </TabsTrigger>
                <TabsTrigger value="inovação">Inovação</TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstitutions.length > 0 ? (
            filteredInstitutions.map((institution) => (
              <Card
                key={institution.id}
                className="overflow-hidden transition-all hover:shadow-lg flex flex-col"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getIconByType(institution.iconType)}
                      <div>
                        <CardTitle className="text-lg">
                          {institution.name}
                        </CardTitle>
                        <div className="flex gap-2 mt-1 flex-wrap">
                          <Badge
                            variant={
                              institution.type === "Pública"
                                ? "secondary"
                                : institution.type === "ONG"
                                ? "destructive"
                                : institution.type === "Instituto"
                                ? "outline"
                                : "default"
                            }
                          >
                            {institution.type}
                          </Badge>
                          <Badge variant="outline" className="bg-gray-50">
                            {institution.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-3">
                    <Badge variant="default" className="bg-si-blue text-white">
                      {institution.impactArea}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {institution.impactDescription}
                  </CardDescription>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <Building className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">
                Nenhuma instituição encontrada com os filtros selecionados.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default InstitutionRanking;
