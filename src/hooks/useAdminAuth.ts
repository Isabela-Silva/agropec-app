import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService, type ApiError } from '../services';
import type { ILoginInput } from '../services/interfaces/admin';
import { useAppStore } from '../stores/app.store';

export function useAdminAuth() {
  const navigate = useNavigate();
  const { admin, isAdminLoading, setAdmin, setAdminLoading, logout: globalLogout } = useAppStore();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('admin_token');

      if (!token) {
        setAdminLoading(false);
        return;
      }

      try {
        // Valida o token do admin e carrega os dados
        const response = await AuthService.validateAdminToken();

        const adminData = {
          uuid: response.admin.uuid,
          firstName: response.admin.firstName,
          lastName: response.admin.lastName,
          email: response.admin.email,
          role: response.admin.role as 'SUPER_ADMIN' | 'admin',
        };

        setAdmin(adminData);
      } catch (error) {
        // Se o token for inválido, remove do localStorage
        localStorage.removeItem('admin_token');
        console.error('Token de admin inválido:', error);
      } finally {
        setAdminLoading(false);
      }
    };

    checkAuthStatus();
  }, [setAdmin, setAdminLoading]);

  const login = async (credentials: ILoginInput) => {
    try {
      const response = await AuthService.adminSignIn(credentials);

      const adminData = {
        uuid: response.admin.uuid,
        firstName: response.admin.firstName,
        lastName: response.admin.lastName,
        email: response.admin.email,
        role: response.admin.role as 'SUPER_ADMIN' | 'admin',
      };

      localStorage.setItem('admin_token', response.token);
      setAdmin(adminData);

      // Redireciona para o dashboard do admin após login bem-sucedido
      navigate('/admin', { replace: true });
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.error || 'Erro ao fazer login');
    }
  };

  const logout = () => {
    globalLogout();
    // Redireciona para a tela de login do admin após logout
    navigate('/admin/login', { replace: true });
  };

  return {
    admin,
    isLoading: isAdminLoading,
    login,
    logout,
  };
}
