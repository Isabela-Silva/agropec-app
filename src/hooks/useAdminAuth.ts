import { useContext } from 'react';
import { AdminAuthContext } from '../contexts/AdminAuthContext';
import type { AdminAuthContextType } from '../types/auth';

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth deve ser usado dentro de um AdminAuthProvider');
  }
  return context;
};
