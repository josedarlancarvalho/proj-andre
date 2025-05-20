
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured } from "@/backend/database/supabase";
import { useAuth } from "@/contexts/AuthContext";

// Este componente só deve ser usado em ambiente de desenvolvimento
const DevModeLogin = () => {
  const { toast } = useToast();
  const { signIn } = useAuth();
  
  // Apenas mostrar em ambiente de desenvolvimento e quando Supabase não estiver configurado
  if (import.meta.env.PROD || isSupabaseConfigured()) {
    return null;
  }

  const handleDevLogin = async (email: string, profileType: 'talent' | 'hr' | 'manager') => {
    // Alertar claramente que isso é apenas para desenvolvimento
    toast({
      title: "Modo de desenvolvimento",
      description: "Login simulado para desenvolvimento. Configure o Supabase para autenticação real.",
      variant: "default"
    });

    // Tenta fazer login com credenciais de teste
    const result = await signIn(email, 'senha123', profileType);
    
    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Erro no login de desenvolvimento",
        description: "Configure o Supabase corretamente ou crie os usuários de teste.",
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
            onClick={() => handleDevLogin('jovem@example.com', 'talent')}
          >
            Jovem
          </Button>
          <Button 
            variant="outline"
            className="border-orange-300 hover:bg-orange-100"
            onClick={() => handleDevLogin('rh@example.com', 'hr')}
          >
            RH
          </Button>
          <Button 
            variant="outline"
            className="border-orange-300 hover:bg-orange-100"
            onClick={() => handleDevLogin('gestor@example.com', 'manager')}
          >
            Gestor
          </Button>
        </div>
        <div className="text-xs text-orange-600 mt-4">
          Para usar autenticação real, configure as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.
        </div>
      </CardContent>
    </Card>
  );
};

export default DevModeLogin;
