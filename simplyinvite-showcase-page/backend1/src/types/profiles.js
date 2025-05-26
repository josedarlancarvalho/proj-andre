export type ProfileType = 'jovem' | 'rh' | 'gestor';

export interface BaseUser {
  id: number;
  email: string;
  nomeCompleto: string;
  tipoPerfil: ProfileType;
  avatarUrl?: string;
  telefone?: string;
  cidade?: string;
  estado?: string;
  bio?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  dataNascimento?: Date;
  areasInteresse?: string[];
  habilidadesPrincipais?: string[];
  onboardingCompleto: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface JovemProfile extends BaseUser {
  tipoPerfil: 'jovem';
  projetos?: any[];
  avaliacoes?: any[];
}

export interface RHProfile extends BaseUser {
  tipoPerfil: 'rh';
  empresaId: number;
  cargoNaEmpresa: string;
}

export interface GestorProfile extends BaseUser {
  tipoPerfil: 'gestor';
  empresaId: number;
  cargoNaEmpresa: string;
} 