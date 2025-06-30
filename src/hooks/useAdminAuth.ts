import { useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminAuthContext } from '../contexts/AdminAuthContext';
import { AuthService } from '../services/AuthService';
import type { ILoginInput } from '../services/interfaces/admin';
import { toastUtils } from '../utils/toast';

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error('useAdminAuth deve ser usado dentro de um AdminAuthProvider');
  }

  const { admin, isLoading, login: contextLogin, logout: contextLogout } = context;

  const login = useCallback(
    async (credentials: ILoginInput) => {
      try {
        const loadingToast = toastUtils.loading('Entrando...');

        const response = await AuthService.adminSignIn(credentials);

        // Salva o token e dados do admin
        localStorage.setItem('admin_token', response.token);
        localStorage.setItem('admin_data', JSON.stringify(response.admin));

        toastUtils.success('Login realizado com sucesso!', {
          id: loadingToast,
        });

        // Atualiza o contexto
        contextLogin(response.admin);

        // Redireciona para o dashboard
        navigate('/admin', { replace: true });
      } catch (error: unknown) {
        const apiError = error as { response?: { data?: { error?: string } } };
        const errorMessage = apiError.response?.data?.error || 'Erro ao fazer login';

        toastUtils.error(errorMessage);
        throw error;
      }
    },
    [contextLogin, navigate],
  );

  const logout = useCallback(async () => {
    // Remove dados locais
    AuthService.signOut();

    // Atualiza o contexto
    contextLogout();

    // Redireciona para login
    navigate('/admin/login', { replace: true });
  }, [contextLogout, navigate]);

  return {
    admin,
    isLoading,
    login,
    logout,
  };
}
