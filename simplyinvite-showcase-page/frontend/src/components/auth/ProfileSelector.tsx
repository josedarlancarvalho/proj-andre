
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

interface ProfileSelectorProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfileSelector = ({ isOpen, onOpenChange }: ProfileSelectorProps) => {
  const navigate = useNavigate();
  
  const handleProfileSelect = (profileType: string) => {
    switch (profileType) {
      case 'talent':
        navigate('/jovem-auth');
        break;
      case 'hr':
        navigate('/rh-auth');
        break;
      case 'manager':
        navigate('/gestor-auth');
        break;
      default:
        break;
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Escolha seu perfil</DialogTitle>
          <DialogDescription className="text-center">
            Selecione como você quer acessar o SimplyInvite
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          <Card className="cursor-pointer hover:border-si-accent transition-all" 
                onClick={() => handleProfileSelect('talent')}>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <User className="h-12 w-12 text-si-accent mb-4" />
              <h3 className="text-lg font-medium">Sou Jovem</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Quero mostrar meus talentos
              </p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:border-si-accent transition-all"
                onClick={() => handleProfileSelect('hr')}>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Users className="h-12 w-12 text-si-accent mb-4" />
              <h3 className="text-lg font-medium">Sou RH</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Quero avaliar talentos
              </p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:border-si-accent transition-all"
                onClick={() => handleProfileSelect('manager')}>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Briefcase className="h-12 w-12 text-si-accent mb-4" />
              <h3 className="text-lg font-medium">Sou Chefe</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Quero contratar talentos
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSelector;
