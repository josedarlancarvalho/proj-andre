import api from "./api";

export interface Usuario {
  id?: string;
  email: string;
  senha?: string;
  tipoPerfil: "talent" | "hr" | "manager";
  nomeCompleto?: string;
}

export async function registrar(usuario: Usuario) {
  const response = await api.post("/usuarios", usuario);
  return response.data;
}

export async function login(email: string, senha: string) {
  const response = await api.post("/auth/login", { email, senha });
  return response.data;
}

export async function getMeuPerfil() {
  const response = await api.get("/auth/me");
  return response.data; // Espera-se que retorne { usuario: UsuarioLoginResponseDTO, tipoPerfil: string }
}
