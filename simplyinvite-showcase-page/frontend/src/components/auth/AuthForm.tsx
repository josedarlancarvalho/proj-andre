import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";

// Tipos para os diferentes perfis de usuário
type CommonFields = {
  fullName: string;
  email: string;
  password: string;
};

type AuthFormProps = {
  userType: "jovem" | "rh" | "gestor";
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
};

// Esquema de validação para login
const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

// Esquema de validação para registro de jovem talento
const talentSchema = loginSchema.extend({
  fullName: z.string().min(3, "Nome completo é obrigatório"),
});

// Esquema de validação para registro de RH
const hrSchema = talentSchema.extend({
  company: z.string().min(2, "Nome da empresa é obrigatório"),
  position: z.string().min(2, "Cargo é obrigatório"),
});

// Esquema de validação para registro de gestor
const managerSchema = hrSchema;

const AuthForm = ({ userType, isOpen, onClose, onSubmit }: AuthFormProps) => {
  const [isLogin, setIsLogin] = React.useState(true);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  
  // Define o esquema baseado no tipo de usuário e se é login ou registro
  const getSchema = () => {
    if (isLogin) {
      return loginSchema;
    }
    
    switch (userType) {
      case "jovem":
        return talentSchema;
      case "rh":
        return hrSchema;
      case "gestor":
        return managerSchema;
      default:
        return loginSchema;
    }
  };
  
  // Form setup com react-hook-form e zod
  const form = useForm({
    resolver: zodResolver(getSchema()),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      company: "",
      position: "",
    },
  });
  
  const handleSubmit = async (data: any) => {
    try {
      if (isLogin) {
        const result = await signIn(data.email, data.password, userType);
        if (!result.error) {
          if (onSubmit) onSubmit(data);
        }
      } else {
        const { error } = await signUp(data.email, data.password, userType, {
          fullName: data.fullName,
        });
        if (!error) {
          onClose();
          if (onSubmit) onSubmit(data);
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Ocorreu um erro. Tente novamente."
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{
            userType === "jovem"
              ? "Área do Jovem Talento"
              : userType === "rh"
              ? "Área do Profissional de RH"
              : "Área do Gestor"
          }</DialogTitle>
          <DialogDescription>{
            userType === "jovem"
              ? isLogin
                ? "Entre para acompanhar seus projetos e feedbacks."
                : "Crie sua conta para começar a mostrar seu talento."
              : userType === "rh"
              ? isLogin
                ? "Entre para avaliar e fornecer feedback aos jovens talentos."
                : "Crie sua conta para começar a avaliar projetos."
              : isLogin
              ? "Entre para buscar novos talentos para sua empresa."
              : "Crie sua conta para começar a buscar talentos."
          }</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {!isLogin && (
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="seu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isLogin && (userType === "rh" || userType === "gestor") && (
              <>
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Empresa</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da empresa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cargo</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu cargo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <div className="flex flex-col space-y-2">
              <Button type="submit" className="w-full">
                {isLogin ? "Entrar" : "Cadastrar"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Criar conta" : "Já tenho conta"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthForm;
