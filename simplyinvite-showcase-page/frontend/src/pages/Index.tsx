import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Benefits from "@/components/Benefits";
import Footer from "@/components/Footer";
import InstitutionRanking from "@/components/InstitutionRanking";

const Index = () => {
  // Ajuste: showInfoHeader agora só depende do modo DEV
  const showInfoHeader = import.meta.env.DEV;
  
  return (
    <div className="min-h-screen">
      {/* {showInfoHeader && <InfoHeader />} */}
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <InstitutionRanking />
      <Testimonials />
      <Benefits />
      <Footer />
    </div>
  );
};

export default Index;
