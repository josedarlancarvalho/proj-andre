import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const HRAuth = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setIsAuthOpen(false);
    navigate("/");
  };

  if (!isAuthOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3')",
        }}
      >
        <div className="absolute inset-0 bg-si-blue/75 z-10"></div>
      </div>
      {/* Modal */}
      <div className="fixed left-[50%] top-[50%] z-20 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Login RH</h2>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <AuthForm userType="rh" isOpen={isAuthOpen} onClose={handleClose} />
      </div>
    </div>
  );
};

export default HRAuth;
