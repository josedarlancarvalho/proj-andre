
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ProfileSelector from "@/components/auth/ProfileSelector";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileSelectorOpen, setIsProfileSelectorOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="text-si-blue font-sans font-bold text-2xl">
                SimplyInvite
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <a href="#how-it-works" className="text-si-blue hover:text-si-accent transition-colors">Como Funciona</a>
              <a href="#testimonials" className="text-si-blue hover:text-si-accent transition-colors">Depoimentos</a>
              <a href="#benefits" className="text-si-blue hover:text-si-accent transition-colors">Benefícios</a>
              <a href="#ranking" className="text-si-blue hover:text-si-accent transition-colors">Ranking de Instituições</a>
              <Button 
                className="bg-si-accent hover:bg-si-accent/90"
                onClick={() => setIsProfileSelectorOpen(true)}
              >
                Entrar
              </Button>
            </div>
            
            <button className="md:hidden text-si-blue">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Profile Selector Modal */}
      <ProfileSelector 
        isOpen={isProfileSelectorOpen} 
        onOpenChange={setIsProfileSelectorOpen} 
      />
    </>
  );
};

export default Navbar;
