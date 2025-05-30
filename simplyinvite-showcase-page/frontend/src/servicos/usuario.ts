import type { AxiosResponse } from "axios";
import api from "./api";

export interface Usuario {
  id?: string;
  email: string;
  senha?: string;
  tipoPerfil: "jovem" | "rh" | "gestor";
  nomeCompleto?: string;
  onboardingCompleto?: boolean;
  avatarUrl?: string;
  cidade?: string;
  areasInteresse?: string[];
  bio?: string;
  formacaoCurso?: string;
  formacaoInstituicao?: string;
  formacaoPeriodo?: string;
  gender?: string;
  genderOther?: string;
  collegeModality?: string;
  collegeType?: string;
  experienceDescription?: string;
  specialBadge?: string;

  // Campos do onboarding
  studyDetails?: {
    course?: string;
    yearOrPeriod?: string;
  };
  institutionName?: string;
  experiences?: string;
  portfolioLinks?: string;
  recognitionBadge?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export interface UsuarioLoginResponseDTO {
  usuario: Usuario;
  token: string;
  tipoPerfil: "jovem" | "rh" | "gestor";
  message?: string;
}

export async function registrar(
  usuario: Usuario
): Promise<UsuarioLoginResponseDTO> {
  const response: AxiosResponse<UsuarioLoginResponseDTO> = await api.post(
<<<<<<< HEAD
    "/auth/register",
=======
    "/api/auth/register",
>>>>>>> origin/producao1
    usuario
  );
  return response.data;
}

export async function login(
  email: string,
  senha: string,
  tipoPerfil: "jovem" | "rh" | "gestor"
): Promise<UsuarioLoginResponseDTO> {
  const response: AxiosResponse<UsuarioLoginResponseDTO> = await api.post(
<<<<<<< HEAD
    "/auth/login",
=======
    "/api/auth/login",
>>>>>>> origin/producao1
    { email, senha, tipoPerfil }
  );
  return response.data;
}

export async function getMeuPerfil(): Promise<{
  usuario: Usuario;
  tipoPerfil: string;
}> {
  const response: AxiosResponse<{ usuario: Usuario; tipoPerfil: string }> =
<<<<<<< HEAD
    await api.get("/auth/me");
=======
    await api.get("/api/auth/me");
>>>>>>> origin/producao1
  return response.data;
}
