import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

interface TestimonialProps {
  name: string;
  age?: string;
  role: string;
  quote: string;
  avatar: string;
  institution?: string;
  isSuccess?: boolean;
  rating?: number;
}

const TestimonialCard: React.FC<TestimonialProps> = ({ 
  name, 
  age, 
  role, 
  quote, 
  avatar, 
  institution, 
  isSuccess,
  rating = 5
}) => {
  return (
    <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow h-full">
      <CardContent className="pt-6 px-6">
        <div className="flex items-start mb-4">
          <Avatar className="h-12 w-12 mr-4">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-si-blue">{name} {age && <span className="text-gray-500">({age})</span>}</p>
            <p className="text-sm text-gray-500">{role}</p>
            {institution && <p className="text-xs text-si-accent font-medium">{institution}</p>}
            {isSuccess && (
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3 h-3 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <p className="text-gray-600 italic">{quote}</p>
      </CardContent>
    </Card>
  );
};

const Testimonials = () => {
  const [testimonialsList, setTestimonialsList] = useState<TestimonialProps[]>([]);

  useEffect(() => {
    // TODO: Substituir pela chamada real da API
    const fetchTestimonials = async () => {
      // const response = await fetch("/api/testimonials");
      // const data = await response.json();
      // setTestimonialsList(data);
      setTestimonialsList([]); // Inicializa com array vazio ou dados buscados
    };
    fetchTestimonials();
  }, []);

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="section-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-si-blue mb-4">Histórias de Sucesso</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Veja como o SimplyInvite está transformando carreiras e processos de seleção.
          </p>
        </div>

        {/* Versão para desktop - grid com todos os depoimentos */}
        <div className="hidden lg:grid grid-cols-4 gap-6">
          {testimonialsList.length > 0 ? (
            testimonialsList.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))
          ) : (
            <p className="col-span-4 text-center text-gray-500">Nenhum depoimento disponível no momento.</p>
          )}
        </div>

        {/* Versão para mobile e tablet - carrossel */}
        <div className="lg:hidden">
          {testimonialsList.length > 0 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {testimonialsList.map((testimonial, index) => (
                  <CarouselItem key={index} className="md:basis-1/2">
                    <div className="p-1">
                      <TestimonialCard {...testimonial} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-6">
                <CarouselPrevious className="position-static transform-none mx-2" />
                <CarouselNext className="position-static transform-none mx-2" />
              </div>
            </Carousel>
          ) : (
            <p className="text-center text-gray-500">Nenhum depoimento disponível no momento.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
