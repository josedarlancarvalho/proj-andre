import React, { useState, useEffect } from "react";
import UserPanelLayout from "@/components/UserPanelLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Video,
  MapPin,
} from "lucide-react";
import { buscarEntrevistas, agendarEntrevista } from "@/servicos/entrevistas";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLocation, useSearchParams } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

const formSchema = z.object({
  candidato: z.string().min(1, "Nome do candidato é obrigatório"),
  candidatoId: z.string().optional(),
  data: z.date({
    required_error: "Data da entrevista é obrigatória",
  }),
  hora: z.string().min(1, "Horário é obrigatório"),
  tipo: z.enum(["online", "presencial"], {
    required_error: "Tipo de entrevista é obrigatório",
  }),
  link: z.string().optional(),
  endereco: z.string().optional(),
  observacoes: z.string().optional(),
});

const ManagerInterviews = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [entrevistas, setEntrevistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAgendarDialogOpen, setIsAgendarDialogOpen] = useState(false);
  const [entrevistasDoDia, setEntrevistasDoDia] = useState([]);
  const [candidatoId, setCandidatoId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      candidato: "",
      candidatoId: "",
      hora: "09:00",
      tipo: "online",
      link: "",
      endereco: "",
      observacoes: "",
    },
  });

  useEffect(() => {
    const fetchEntrevistas = async () => {
      try {
        setLoading(true);
        const response = await buscarEntrevistas();
        setEntrevistas(response);
      } catch (error) {
        console.error("Erro ao buscar entrevistas:", error);
        toast.error("Não foi possível carregar as entrevistas");
      } finally {
        setLoading(false);
      }
    };

    fetchEntrevistas();
  }, []);

  useEffect(() => {
    if (date && entrevistas.length > 0) {
      const formattedDate = format(date, "yyyy-MM-dd");
      const filtradas = entrevistas.filter((entrevista) => {
        // Verificar se temos a data no formato apropriado
        const entrevistaData =
          entrevista.data?.substring(0, 10) ||
          (entrevista.data instanceof Date
            ? format(entrevista.data, "yyyy-MM-dd")
            : "");
        return entrevistaData === formattedDate;
      });
      setEntrevistasDoDia(filtradas);
    } else {
      setEntrevistasDoDia([]);
    }
  }, [date, entrevistas]);

  // Verificar se há parâmetros na URL para preencher o formulário
  useEffect(() => {
    const candidato = searchParams.get("candidato");
    const id = searchParams.get("id");

    if (candidato) {
      form.setValue("candidato", candidato);

      // Se houver um ID, armazenar para uso posterior
      if (id) {
        setCandidatoId(id);
        form.setValue("candidatoId", id);
        console.log("ID do candidato para agendamento:", id);
      }

      // Abrir automaticamente o modal de agendamento
      setIsAgendarDialogOpen(true);
    }
  }, [searchParams, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      // Verificar se temos um ID de candidato
      if (!values.candidatoId && !candidatoId) {
        toast.error(
          "ID do candidato não encontrado. Por favor, tente novamente."
        );
        return;
      }

      const talentoId = values.candidatoId || candidatoId;

      // Prepara o objeto para o novo serviço de entrevistas
      const entrevistaDados = {
        talentoId: talentoId!,
        talentoNome: values.candidato,
        gestorId: user?.id?.toString() || "1",
        gestorNome: user?.nomeCompleto || "Gestor",
        empresa: user?.empresa || "Empresa",
        data: format(values.data, "yyyy-MM-dd"),
        hora: values.hora,
        tipo: values.tipo,
        local: values.tipo === "presencial" ? values.endereco : undefined,
        link: values.tipo === "online" ? values.link : undefined,
        observacoes: values.observacoes,
      };

      console.log("Agendando entrevista com dados:", entrevistaDados);

      // Usar o toast.promise para mostrar o status do agendamento
      await toast.promise(agendarEntrevista(entrevistaDados), {
        loading: "Agendando entrevista...",
        success: "Entrevista agendada com sucesso!",
        error: "Não foi possível agendar a entrevista",
      });

      setIsAgendarDialogOpen(false);

      // Recarregar entrevistas
      const response = await buscarEntrevistas();
      setEntrevistas(response);

      // Limpar formulário e estados
      form.reset();
      setCandidatoId(null);
    } catch (error) {
      console.error("Erro ao agendar entrevista:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDayLabel = () => {
    if (!date) return "Selecione uma data";
    return format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      // Reset form and state when dialog is closed
      form.reset({
        candidato: "",
        candidatoId: "",
        hora: "09:00",
        tipo: "online",
        link: "",
        endereco: "",
        observacoes: "",
      });
      setCandidatoId(null);
    }

    setIsAgendarDialogOpen(open);
  };

  return (
    <UserPanelLayout userType="gestor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            Entrevistas Agendadas
          </h1>
          <Button onClick={() => setIsAgendarDialogOpen(true)}>
            Agendar Nova Entrevista
          </Button>
        </div>

        <Tabs defaultValue="calendario">
          <TabsList>
            <TabsTrigger value="calendario">Calendário</TabsTrigger>
            <TabsTrigger value="todas">Todas Entrevistas</TabsTrigger>
          </TabsList>
          <TabsContent value="calendario" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-7 lg:grid-cols-3">
              <Card className="col-span-2 md:col-span-3 lg:col-span-1">
                <CardHeader>
                  <CardTitle>Calendário de Entrevistas</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
              <Card className="col-span-5 md:col-span-4 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Entrevistas para {getDayLabel()}</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-10">
                      Carregando entrevistas...
                    </div>
                  ) : entrevistasDoDia.length > 0 ? (
                    <div className="space-y-4">
                      {entrevistasDoDia.map((entrevista, index) => (
                        <div
                          key={entrevista.id || index}
                          className="flex items-start space-x-4 border rounded-md p-4"
                        >
                          <div className="bg-primary/10 p-2 rounded-full">
                            {entrevista.tipo === "online" ? (
                              <Video className="h-5 w-5 text-primary" />
                            ) : (
                              <MapPin className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="font-medium">
                                  {entrevista.candidato}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {entrevista.hora}
                                </p>
                              </div>
                              <Badge>
                                {entrevista.tipo === "online"
                                  ? "Online"
                                  : "Presencial"}
                              </Badge>
                            </div>
                            {entrevista.detalhes && (
                              <div className="mt-2 text-sm">
                                {entrevista.tipo === "online" ? (
                                  <p>
                                    <span className="font-medium">Link: </span>
                                    <a
                                      href={entrevista.detalhes.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline"
                                    >
                                      {entrevista.detalhes.link}
                                    </a>
                                  </p>
                                ) : (
                                  <p>
                                    <span className="font-medium">
                                      Endereço:{" "}
                                    </span>
                                    {entrevista.detalhes.endereco}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">
                        Nenhuma entrevista agendada para este dia.
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setIsAgendarDialogOpen(true)}
                      >
                        Agendar Entrevista
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="todas">
            <Card>
              <CardHeader>
                <CardTitle>Todas as Entrevistas</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-10">
                    Carregando entrevistas...
                  </div>
                ) : entrevistas.length > 0 ? (
                  <div className="space-y-4">
                    {entrevistas.map((entrevista, index) => (
                      <div
                        key={entrevista.id || index}
                        className="flex items-start space-x-4 border rounded-md p-4"
                      >
                        <div className="bg-primary/10 p-2 rounded-full">
                          {entrevista.tipo === "online" ? (
                            <Video className="h-5 w-5 text-primary" />
                          ) : (
                            <MapPin className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium">
                                {entrevista.candidato}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {format(
                                  new Date(entrevista.data),
                                  "dd/MM/yyyy"
                                )}{" "}
                                às {entrevista.hora}
                              </p>
                            </div>
                            <Badge>
                              {entrevista.tipo === "online"
                                ? "Online"
                                : "Presencial"}
                            </Badge>
                          </div>
                          {entrevista.detalhes && (
                            <div className="mt-2 text-sm">
                              {entrevista.tipo === "online" ? (
                                <p>
                                  <span className="font-medium">Link: </span>
                                  <a
                                    href={entrevista.detalhes.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    {entrevista.detalhes.link}
                                  </a>
                                </p>
                              ) : (
                                <p>
                                  <span className="font-medium">
                                    Endereço:{" "}
                                  </span>
                                  {entrevista.detalhes.endereco}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">
                      Nenhuma entrevista agendada.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setIsAgendarDialogOpen(true)}
                    >
                      Agendar Entrevista
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isAgendarDialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Agendar Nova Entrevista</DialogTitle>
            <DialogDescription>
              Preencha os dados para agendar uma entrevista com um candidato.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="candidato"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Candidato</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do candidato" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="data"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data</FormLabel>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hora"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Entrevista</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="online">Online</SelectItem>
                          <SelectItem value="presencial">Presencial</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch("tipo") === "online" ? (
                  <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link da reunião</FormLabel>
                        <FormControl>
                          <Input placeholder="Link da reunião" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name="endereco"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereço</FormLabel>
                        <FormControl>
                          <Input placeholder="Endereço" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="observacoes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações (opcional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Informações adicionais para o candidato"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </ScrollArea>
          <DialogFooter className="mt-4 pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDialogOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Agendando..." : "Agendar Entrevista"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </UserPanelLayout>
  );
};

export default ManagerInterviews;
