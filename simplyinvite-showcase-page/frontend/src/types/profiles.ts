export type ProfileType = 'jovem' | 'rh' | 'gestor';

export interface AuthUser {
  id: string;
  email: string;
  nomeCompleto: string;
  tipoPerfil: ProfileType;
  onboardingComplete?: boolean;
  avatarUrl?: string;
}

export interface TalentProfile extends AuthUser {
  tipoPerfil: 'jovem';
  dataNascimento?: Date;
  cidade?: string;
  estado?: string;
  areasInteresse?: string[];
  habilidadesPrincipais?: string[];
  linkedin?: string;
  github?: string;
  experiencia?: string;
  formacao?: string;
}

export interface HRProfile extends AuthUser {
  tipoPerfil: 'rh';
  empresaId: number;
  cargoNaEmpresa?: string;
}

export interface ManagerProfile extends AuthUser {
  tipoPerfil: 'gestor';
  empresaId: number;
  cargoNaEmpresa?: string;
} 