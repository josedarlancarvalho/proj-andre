import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { User, Briefcase, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProfileSelectorProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfileSelector = ({ isOpen, onOpenChange }: ProfileSelectorProps) => {
  const navigate = useNavigate();

  const handleProfileSelect = (profileType: string) => {
    switch (profileType) {
      case "jovem":
        navigate("/jovem-auth");
        break;
      case "rh":
        navigate("/rh-auth");
        break;
      case "gestor":
        navigate("/gestor-auth");
        break;
      default:
        break;
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Escolha seu perfil
          </DialogTitle>
          <DialogDescription className="text-center">
            Selecione o tipo de perfil que deseja acessar
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
            <Link
              to="/jovem/login"
              className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              onClick={() => onOpenChange(false)}
            >
              <div className="w-16 h-16 bg-si-accent rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-medium">Jovem Talento</h3>
              <p className="text-sm text-muted-foreground text-center">
                Para candidatos buscando oportunidades
              </p>
            </Link>

            <Link
              to="/rh/login"
              className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              onClick={() => onOpenChange(false)}
            >
              <div className="w-16 h-16 bg-si-blue rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-medium">Recursos Humanos</h3>
              <p className="text-sm text-muted-foreground text-center">
                Para profissionais de RH
              </p>
            </Link>

            <Link
              to="/gestor/login"
              className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              onClick={() => onOpenChange(false)}
            >
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-medium">Gestor</h3>
              <p className="text-sm text-muted-foreground text-center">
                Para gestores e recrutadores
              </p>
            </Link>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSelector;
