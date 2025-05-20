
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ProfileSelector from "@/components/auth/ProfileSelector";

const HeroSection = () => {
  const [isProfileSelectorOpen, setIsProfileSelectorOpen] = useState(false);
  
  const handleOpenProfileSelector = () => {
    setIsProfileSelectorOpen(true);
  };

  return (
    <div className="relative min-h-screen flex items-center">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3')",
        }}
      >
        <div className="absolute inset-0 bg-si-blue/75 z-10"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Conecte-se. Apresente-se.<br />
            <span className="text-si-accent">Cresça com o SimplyInvite.</span>
          </h1>
          
          <p className="text-white text-lg md:text-xl max-w-3xl mx-auto mb-10">
            A plataforma que conecta jovens talentos a oportunidades reais através da apresentação de vídeos e projetos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-si-accent hover:bg-si-accent/90 text-white px-8 py-6 text-lg" onClick={handleOpenProfileSelector}>
              Começar Agora
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Selector Modal */}
      <ProfileSelector 
        isOpen={isProfileSelectorOpen} 
        onOpenChange={setIsProfileSelectorOpen} 
      />
    </div>
  );
};

export default HeroSection;
