// Tipos compartilhados para autenticação

export interface User {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface Admin {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignUpInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserAuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginInput) => Promise<void>;
  signUp: (data: SignUpInput) => Promise<void>;
  logout: () => void;
}

export interface AdminAuthContextType {
  admin: Admin | null;
  isLoading: boolean;
  login: (adminData: { uuid: string; email: string; role: string }) => Promise<void>;
  logout: () => void;
}
