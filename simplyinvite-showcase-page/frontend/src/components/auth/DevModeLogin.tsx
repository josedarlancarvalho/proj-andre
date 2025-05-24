import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import type { ProfileType } from "@/types/profiles";

// Este componente só deve ser usado em ambiente de desenvolvimento
const DevModeLogin = () => {
  const { toast } = useToast();
  const { signIn } = useAuth();
  
  // Apenas mostrar em ambiente de desenvolvimento
  if (import.meta.env.PROD) {
    return null;
  }

  const handleDevLogin = async (email: string, profileType: ProfileType) => {
    // Alertar claramente que isso é apenas para desenvolvimento
    toast({
      title: "Modo de desenvolvimento",
      description: "Login simulado para desenvolvimento.",
      variant: "default"
    });

    // Tenta fazer login com credenciais de teste
    const result = await signIn(email, 'senha123');
    
    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Erro no login de desenvolvimento",
        description: "Erro ao fazer login com as credenciais de teste.",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mb-8 border-orange-300 bg-orange-50">
      <CardHeader className="bg-orange-100 border-b border-orange-200">
        <CardTitle className="text-orange-800">⚠️ Modo de Desenvolvimento</CardTitle>
        <CardDescription className="text-orange-700">
          Autenticação simulada para testes. NÃO use em produção!
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="text-sm text-orange-700 mb-4">
          Selecione um perfil para login rápido de teste:
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button 
            variant="outline" 
            className="border-orange-300 hover:bg-orange-100"
            onClick={() => handleDevLogin('jovem@example.com', 'jovem')}
          >
            Jovem
          </Button>
          <Button 
            variant="outline"
            className="border-orange-300 hover:bg-orange-100"
            onClick={() => handleDevLogin('rh@example.com', 'rh')}
          >
            RH
          </Button>
          <Button 
            variant="outline"
            className="border-orange-300 hover:bg-orange-100"
            onClick={() => handleDevLogin('gestor@example.com', 'gestor')}
          >
            Gestor
          </Button>
        </div>
        <div className="text-xs text-orange-600 mt-4">
          Para usar autenticação real, configure as variáveis de ambiente do backend.
        </div>
      </CardContent>
    </Card>
  );
};

export default DevModeLogin;
