import { createContext, ReactNode, useEffect, useState } from 'react';
import { AuthService, type ApiError } from '../services';
import type { LoginInput, SignUpInput, User, UserAuthContextType } from '../types/auth';

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

interface UserAuthProviderProps {
  children: ReactNode;
}

export function UserAuthProvider({ children }: UserAuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verifica se há um usuário logado no localStorage
    const userToken = localStorage.getItem('auth_token');

    if (userToken) {
      // Em produção, você pode fazer uma chamada para verificar se o token ainda é válido
      // Por enquanto, vamos simular um usuário logado
      const mockUser: User = {
        uuid: '1',
        firstName: 'Usuário',
        lastName: 'Teste',
        email: 'usuario@teste.com',
        role: 'user',
      };
      setUser(mockUser);
    }

    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginInput) => {
    try {
      const response = await AuthService.signIn(credentials);

      // Em produção, você pode fazer uma chamada para buscar dados completos do usuário
      const userData: User = {
        uuid: response.user.uuid,
        firstName: 'Usuário', // Buscar do backend
        lastName: 'Teste', // Buscar do backend
        email: response.user.email,
        role: response.user.role,
      };

      setUser(userData);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.error || 'Erro ao fazer login');
    }
  };

  const signUp = async (data: SignUpInput) => {
    try {
      const response = await AuthService.signUp(data);

      const userData: User = {
        uuid: response.user.uuid,
        firstName: data.firstName,
        lastName: data.lastName,
        email: response.user.email,
        role: response.user.role,
      };

      setUser(userData);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.error || 'Erro ao criar conta');
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const value: UserAuthContextType = {
    user,
    isLoading,
    login,
    signUp,
    logout,
  };

  return <UserAuthContext.Provider value={value}>{children}</UserAuthContext.Provider>;
}

// Exportar o contexto para uso no hook
export { UserAuthContext };
