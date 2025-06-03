import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ProfileSelector from "@/components/auth/ProfileSelector";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileSelectorOpen, setIsProfileSelectorOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-3"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center">
              <Link
                to="/"
                className="text-si-blue font-sans font-bold text-2xl"
              >
                SimplyInvite
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <a
                href="#how-it-works"
                className="text-si-blue hover:text-si-accent transition-colors"
              >
                Como Funciona
              </a>
              <a
                href="#testimonials"
                className="text-si-blue hover:text-si-accent transition-colors"
              >
                Depoimentos
              </a>
              <a
                href="#benefits"
                className="text-si-blue hover:text-si-accent transition-colors"
              >
                Benefícios
              </a>
              <a
                href="#institutions"
                className="text-si-blue hover:text-si-accent transition-colors"
              >
                Instituições que Transformam
              </a>
              <Button
                className="bg-si-accent hover:bg-si-accent/90"
                onClick={() => setIsProfileSelectorOpen(true)}
              >
                Entrar
              </Button>
            </div>

            <button
              className="md:hidden text-si-blue"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white shadow-md mt-2 py-3 px-4 rounded-lg">
              <div className="flex flex-col space-y-3">
                <a
                  href="#how-it-works"
                  className="text-si-blue hover:text-si-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Como Funciona
                </a>
                <a
                  href="#testimonials"
                  className="text-si-blue hover:text-si-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Depoimentos
                </a>
                <a
                  href="#benefits"
                  className="text-si-blue hover:text-si-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Benefícios
                </a>
                <a
                  href="#institutions"
                  className="text-si-blue hover:text-si-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Instituições que Transformam
                </a>
                <Button
                  className="bg-si-accent hover:bg-si-accent/90 w-full"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsProfileSelectorOpen(true);
                  }}
                >
                  Entrar
                </Button>
              </div>
            </div>
          )}
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
