import type { AxiosResponse } from 'axios';
import api from './api';

export interface Usuario {
  id?: string;
  email: string;
  senha?: string;
  tipoPerfil: "jovem" | "rh" | "gestor";
  nomeCompleto?: string;
  onboardingComplete?: boolean;
  avatarUrl?: string;
}

export interface UsuarioLoginResponseDTO {
  usuario: Usuario;
  token: string;
  tipoPerfil: "jovem" | "rh" | "gestor";
  message?: string;
}

export async function registrar(usuario: Usuario): Promise<UsuarioLoginResponseDTO> {
  const response: AxiosResponse<UsuarioLoginResponseDTO> = await api.post("/auth/register", usuario);
  return response.data;
}

export async function login(email: string, senha: string, tipoPerfil: "jovem" | "rh" | "gestor"): Promise<UsuarioLoginResponseDTO> {
  const response: AxiosResponse<UsuarioLoginResponseDTO> = await api.post("/auth/login", { email, senha, tipoPerfil });
  return response.data;
}

export async function getMeuPerfil(): Promise<{ usuario: Usuario; tipoPerfil: string }> {
  const response: AxiosResponse<{ usuario: Usuario; tipoPerfil: string }> = await api.get("/auth/me");
  return response.data;
}
