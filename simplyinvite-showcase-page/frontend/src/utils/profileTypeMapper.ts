// Tipos usados no AuthContext
export type AuthProfileType = "jovem" | "rh" | "gestor";

// Tipos usados nos componentes
export type ComponentProfileType = "talent" | "hr" | "manager";

// Mapeamento de tipos do AuthContext para tipos de componentes
export function mapAuthToComponentType(
  authType: AuthProfileType
): ComponentProfileType {
  const mapping: Record<AuthProfileType, ComponentProfileType> = {
    jovem: "talent",
    rh: "hr",
    gestor: "manager",
  };
  return mapping[authType];
}

// Mapeamento de tipos de componentes para tipos do AuthContext
export function mapComponentToAuthType(
  componentType: ComponentProfileType
): AuthProfileType {
  const mapping: Record<ComponentProfileType, AuthProfileType> = {
    talent: "jovem",
    hr: "rh",
    manager: "gestor",
  };
  return mapping[componentType];
}
