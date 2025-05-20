
import React from "react";
import { Facebook, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-si-blue text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">SimplyInvite</h3>
            <p className="text-gray-300 mb-6 max-w-sm">
              Conectando jovens talentos a oportunidades reais por meio da apresentação de vídeos e projetos.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-si-accent transition-colors">
                <Facebook />
              </a>
              <a href="#" className="text-white hover:text-si-accent transition-colors">
                <Instagram />
              </a>
              <a href="#" className="text-white hover:text-si-accent transition-colors">
                <Linkedin />
              </a>
            </div>
          </div>
          
          {/* Navigation */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Início</a></li>
              <li><a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">Como Funciona</a></li>
              <li><a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Depoimentos</a></li>
              <li><a href="#benefits" className="text-gray-300 hover:text-white transition-colors">Benefícios</a></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contato</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} SimplyInvite. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
