// Este arquivo é mantido por compatibilidade, mas tudo foi migrado para o diretório backend
export {
  supabase,
  isSupabaseConfigured,
  setupDevelopmentUsers,
} from "@/backend/database/supabase";

export type {
  ProfileType,
  AuthUser,
  TalentProfile,
  HRProfile,
  ManagerProfile,
} from "@/backend/types/profiles";
