import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, GraduationCap, Bookmark } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SuccessStory {
  id: number;
  name: string;
  photo?: string;
  institution: string;
  course: string;
  graduationYear: string;
  currentRole: string;
  company: string;
  story: string;
}

const Testimonials = () => {
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulando uma chamada à API
    const loadSuccessStories = () => {
      setIsLoading(true);

      // Dados de histórias de sucesso
      const mockSuccessStories: SuccessStory[] = [
        {
          id: 1,
          name: "Ana Clara Silva",
          institution: "UFPE",
          course: "Ciência da Computação",
          graduationYear: "2021",
          currentRole: "Desenvolvedora Full Stack",
          company: "Accenture",
          story:
            "Depois de me formar na UFPE, consegui uma vaga como desenvolvedora júnior. Os projetos de pesquisa que participei durante a graduação foram fundamentais para meu currículo. Hoje trabalho com desenvolvimento de software em uma grande empresa e sou responsável por projetos importantes.",
        },
        {
          id: 2,
          name: "Thiago Pereira",
          institution: "Instituto Boa Vista",
          course: "Programação Web",
          graduationYear: "2022",
          currentRole: "Desenvolvedor Front-end",
          company: "Tempest Security",
          story:
            "Antes do Instituto Boa Vista, eu nunca tinha tocado em um computador. O curso gratuito mudou minha vida completamente. Hoje, trabalho como desenvolvedor front-end e posso ajudar minha família financeiramente. Estou realizando sonhos que antes pareciam impossíveis.",
        },
        {
          id: 3,
          name: "Mariana Alves",
          institution: "FBV",
          course: "Administração",
          graduationYear: "2020",
          currentRole: "Fundadora e CEO",
          company: "EcoRecicla",
          story:
            "A mentalidade empreendedora que desenvolvi na FBV me permitiu iniciar meu próprio negócio ainda durante a faculdade. Os mentores foram fundamentais nessa jornada. Hoje minha startup já recebeu dois aportes e emprega mais de 15 pessoas na área de sustentabilidade.",
        },
        {
          id: 4,
          name: "Lucas Santana",
          institution: "SENAI Pernambuco",
          course: "Automação Industrial",
          graduationYear: "2021",
          currentRole: "Especialista em Automação",
          company: "Stellantis",
          story:
            "A estrutura de laboratórios do SENAI é impressionante. Tive acesso a equipamentos modernos que me prepararam perfeitamente para o dia a dia da indústria. Consegui emprego logo após o estágio e hoje trabalho em uma multinacional do setor automotivo.",
        },
        {
          id: 5,
          name: "Fernanda Barros",
          institution: "Centro de Tecnologias Sociais Capibaribe",
          course: "Tecnologias Sustentáveis",
          graduationYear: "2022",
          currentRole: "Consultora de Sustentabilidade",
          company: "Verde Consultoria",
          story:
            "Participar dos projetos do Centro Capibaribe me mostrou como a tecnologia pode transformar comunidades inteiras. O conhecimento prático que adquiri me abriu portas para trabalhar como consultora, ajudando empresas a implementar soluções sustentáveis.",
        },
        {
          id: 6,
          name: "Rafael Mendonça",
          institution: "CESAR School",
          course: "Design de Interação",
          graduationYear: "2021",
          currentRole: "UX/UI Designer",
          company: "CESAR",
          story:
            "No CESAR School, aprendi na prática como funciona o mercado de tecnologia. Os projetos reais com empresas parceiras foram desafiadores e muito gratificantes. Fui contratado pela própria instituição e hoje trabalho em projetos internacionais.",
        },
      ];

      setTimeout(() => {
        setSuccessStories(mockSuccessStories);
        setIsLoading(false);
      }, 800); // Simulando um pequeno delay de carregamento
    };

    loadSuccessStories();
  }, []);

  if (isLoading) {
    return (
      <section id="testimonials" className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="section-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-si-blue mb-3 sm:mb-4">
            Histórias de Sucesso
          </h2>
          <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
            Carregando histórias de sucesso...
          </p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-si-blue"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="section-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-si-blue mb-3 sm:mb-4">
            Histórias de Sucesso
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Veja como a formação nas instituições de Recife transformou
            trajetórias profissionais.
          </p>
        </div>

        {/* Grid para desktop e tablet */}
        <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {successStories.map((story) => (
            <Card
              key={story.id}
              className="overflow-hidden hover:shadow-lg transition-all h-full"
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2"></div>
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <Avatar className="h-12 w-12 sm:h-16 sm:w-16 border-2 border-white shadow-sm">
                    <AvatarFallback className="bg-si-blue text-white text-sm sm:text-base">
                      {story.name.substring(0, 2)}
                    </AvatarFallback>
                    {story.photo && (
                      <AvatarImage src={story.photo} alt={story.name} />
                    )}
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg sm:text-xl">
                      {story.name}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm font-medium text-si-blue">
                      {story.currentRole}
                    </CardDescription>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {story.company}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                <div className="mb-3 sm:mb-4">
                  <div className="flex items-center gap-1 mb-1 sm:mb-2 flex-wrap">
                    <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 text-si-blue" />
                    <span className="text-xs sm:text-sm font-medium">
                      {story.institution}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">
                      • {story.course}
                    </span>
                  </div>
                  <Badge variant="outline" className="bg-gray-50 text-xs">
                    Formado em {story.graduationYear}
                  </Badge>
                </div>
                <p className="text-gray-700 text-xs sm:text-sm">
                  "{story.story}"
                </p>
              </CardContent>
              <CardFooter className="border-t p-4 sm:p-6 flex justify-between">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-amber-500" />
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-amber-500" />
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-amber-500" />
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-amber-500" />
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-amber-500" />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-si-blue flex items-center gap-1 text-xs sm:text-sm h-8 px-2 sm:px-3"
                >
                  <Bookmark className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Salvar história</span>
                  <span className="sm:hidden">Salvar</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Carrossel para mobile */}
        <div className="sm:hidden">
          <Carousel className="w-full">
            <CarouselContent>
              {successStories.map((story) => (
                <CarouselItem key={story.id} className="w-full">
                  <div className="p-1">
                    <Card className="overflow-hidden hover:shadow-lg transition-all">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2"></div>
                      <CardHeader className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                            <AvatarFallback className="bg-si-blue text-white text-sm">
                              {story.name.substring(0, 2)}
                            </AvatarFallback>
                            {story.photo && (
                              <AvatarImage src={story.photo} alt={story.name} />
                            )}
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">
                              {story.name}
                            </CardTitle>
                            <CardDescription className="text-xs font-medium text-si-blue">
                              {story.currentRole}
                            </CardDescription>
                            <p className="text-xs text-gray-500">
                              {story.company}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="mb-3">
                          <div className="flex items-center gap-1 mb-1 flex-wrap">
                            <GraduationCap className="h-3 w-3 text-si-blue" />
                            <span className="text-xs font-medium">
                              {story.institution}
                            </span>
                            <span className="text-xs text-gray-500 ml-1">
                              • {story.course}
                            </span>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-gray-50 text-xs"
                          >
                            Formado em {story.graduationYear}
                          </Badge>
                        </div>
                        <p className="text-gray-700 text-xs">"{story.story}"</p>
                      </CardContent>
                      <CardFooter className="border-t p-4 flex justify-between">
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="h-3 w-3 fill-amber-500" />
                          <Star className="h-3 w-3 fill-amber-500" />
                          <Star className="h-3 w-3 fill-amber-500" />
                          <Star className="h-3 w-3 fill-amber-500" />
                          <Star className="h-3 w-3 fill-amber-500" />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-si-blue flex items-center gap-1 text-xs h-8 px-2"
                        >
                          <Bookmark className="h-3 w-3" />
                          <span>Salvar</span>
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-4">
              <CarouselPrevious className="position-static transform-none mx-2 h-8 w-8" />
              <CarouselNext className="position-static transform-none mx-2 h-8 w-8" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
