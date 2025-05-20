
import React from "react";
import { TrendingUp, Award, Handshake, Eye, MessageSquare, Check } from "lucide-react";

interface BenefitItemProps {
  icon: React.FC<{ className?: string }>;
  title: string;
  description: string;
}

const BenefitItem: React.FC<BenefitItemProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="flex gap-4 mb-6">
      <div className="flex-shrink-0">
        <Icon className="w-6 h-6 text-si-accent" />
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

const Benefits = () => {
  const benefits = {
    jovem: [
      { icon: Eye, title: "Visibilidade", description: "Exponha seu talento para empresas reais." },
      { icon: Award, title: "Reconhecimento", description: "Receba medalhas e feedback construtivo." },
      { icon: TrendingUp, title: "Crescimento", description: "Evolua baseado em avaliações profissionais." },
    ],
    rh: [
      { icon: Handshake, title: "Engajamento Social", description: "Contribua para o desenvolvimento de jovens talentos." },
      { icon: Check, title: "Seleção Humanizada", description: "Avalie pessoas reais, não apenas currículos." },
      { icon: MessageSquare, title: "Feedback Construtivo", description: "Ajude a moldar o futuro profissional dos jovens." },
    ],
    chefe: [
      { icon: Eye, title: "Acesso Direto", description: "Visualize talentos já pré-avaliados e ranqueados." },
      { icon: Award, title: "Talentos por Mérito", description: "Encontre jovens qualificados por desempenho real." },
      { icon: Handshake, title: "Impacto Social", description: "Contribua para o desenvolvimento de carreiras promissoras." },
    ]
  };

  return (
    <section id="benefits" className="py-20 bg-gray-50">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-si-blue mb-4">Benefícios por Perfil</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            O SimplyInvite foi desenhado para trazer vantagens específicas para cada tipo de usuário.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Jovem */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-si-blue mb-6 text-center">Para Jovens</h3>
            {benefits.jovem.map((benefit, index) => (
              <BenefitItem key={index} {...benefit} />
            ))}
          </div>

          {/* RH */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-si-blue mb-6 text-center">Para RH</h3>
            {benefits.rh.map((benefit, index) => (
              <BenefitItem key={index} {...benefit} />
            ))}
          </div>

          {/* Chefe */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-si-blue mb-6 text-center">Para Chefes</h3>
            {benefits.chefe.map((benefit, index) => (
              <BenefitItem key={index} {...benefit} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
