import { createContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import type { IAdmin } from '../services/interfaces/admin';
import type { AdminAuthResponse } from '../services/interfaces/api';

// Tipo para admin logado (sem senha)
type LoggedInAdmin = Omit<IAdmin, 'password'>;

interface AdminAuthContextType {
  admin: LoggedInAdmin | null;
  isLoading: boolean;
  login: (adminData: AdminAuthResponse['admin']) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

function AdminAuthProvider() {
  const [admin, setAdmin] = useState<LoggedInAdmin | null>(null);
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

  const login = async (adminData: AdminAuthResponse['admin']) => {
    const admin: LoggedInAdmin = {
      uuid: adminData.uuid,
      firstName: adminData.firstName,
      lastName: adminData.lastName,
      email: adminData.email,
      role: adminData.role as 'SUPER_ADMIN' | 'admin',
    };
    setAdmin(admin);
    localStorage.setItem('admin_data', JSON.stringify(admin));
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

// Exportar o contexto e o provider
export { AdminAuthContext, AdminAuthProvider };
