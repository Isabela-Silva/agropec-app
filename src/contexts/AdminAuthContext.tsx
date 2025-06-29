import { createContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import type { Admin, AdminAuthContextType, LoginInput } from '../types/auth';

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verifica se há um admin logado no localStorage
    const adminToken = localStorage.getItem('admin_token');
    const adminData = localStorage.getItem('admin_data');

    if (adminToken && adminData) {
      try {
        const parsedAdmin = JSON.parse(adminData);
        setAdmin(parsedAdmin);
      } catch (error) {
        console.error('Erro ao parsear dados do admin:', error);
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_data');
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginInput) => {
    // Simula uma chamada de API
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // Para desenvolvimento, aceita qualquer credencial
        const mockAdmin: Admin = {
          uuid: '1',
          firstName: 'Admin',
          lastName: 'Principal',
          email: credentials.email,
          role: 'SUPER_ADMIN',
        };

        // Salva o token e dados do admin
        localStorage.setItem('admin_token', 'mock-admin-token');
        localStorage.setItem('admin_data', JSON.stringify(mockAdmin));

        setAdmin(mockAdmin);
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_data');
    setAdmin(null);
  };

  const value: AdminAuthContextType = {
    admin,
    isLoading,
    login,
    logout,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      <Outlet />
    </AdminAuthContext.Provider>
  );
}

// Exportar o contexto para uso no hook
export { AdminAuthContext };
