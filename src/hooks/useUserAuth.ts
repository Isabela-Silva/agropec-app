import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService, type ApiError } from '../services';
import type { ICreateUser, ILoginInput, IUser, UserRole } from '../services/interfaces/user';
import { useAppStore } from '../stores/app.store';

export function useUserAuth() {
  const navigate = useNavigate();
  const { user, isUserLoading, setUser, setUserLoading, logout: globalLogout } = useAppStore();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('auth_token');

      if (!token) {
        setUserLoading(false);
        return;
      }

      try {
        // Verifica se o token é válido e retorna os dados do usuário
        const response = await AuthService.validateToken();

        const userData = {
          uuid: response.user.uuid,
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          email: response.user.email,
          role: response.user.role as UserRole,
          activitiesId: response.user.activitiesId || [],
          standsId: response.user.standsId || [],
        };

        setUser(userData);
      } catch (error) {
        // Se o token for inválido, remove do localStorage
        localStorage.removeItem('auth_token');
        console.error('Token inválido:', error);
      } finally {
        setUserLoading(false);
      }
    };

    checkAuthStatus();
  }, [setUser, setUserLoading]);

  const login = async (credentials: ILoginInput) => {
    try {
      const response = await AuthService.signIn(credentials);

      const userData = {
        uuid: response.user.uuid,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        email: response.user.email,
        role: response.user.role as UserRole,
        activitiesId: response.user.activitiesId || [],
        standsId: response.user.standsId || [],
      };

      localStorage.setItem('auth_token', response.token);
      setUser(userData);

      // Redireciona para a tela principal após login bem-sucedido
      navigate('/explore', { replace: true });
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.error || 'Erro ao fazer login');
    }
  };

  const signUp = async (data: ICreateUser) => {
    try {
      const response = await AuthService.signUp(data);

      const userData = {
        uuid: response.user.uuid,
        firstName: data.firstName,
        lastName: data.lastName,
        email: response.user.email,
        role: 'user' as UserRole,
        activitiesId: response.user.activitiesId || [],
        standsId: response.user.standsId || [],
      };

      localStorage.setItem('auth_token', response.token);
      setUser(userData);

      // Redireciona para a tela principal após signup bem-sucedido
      navigate('/explore', { replace: true });
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.error || 'Erro ao criar conta');
    }
  };

  const logout = () => {
    globalLogout();
    // Redireciona para a tela de login após logout
    navigate('/login', { replace: true });
  };

  const updateUserData = (updatedUser: IUser) => {
    setUser({
      uuid: updatedUser.uuid,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      role: updatedUser.role as UserRole,
      activitiesId: updatedUser.activitiesId || [],
      standsId: updatedUser.standsId || [],
    });
  };

  return {
    user,
    isLoading: isUserLoading,
    login,
    signUp,
    logout,
    updateUserData,
  };
}
