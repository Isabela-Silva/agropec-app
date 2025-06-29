import { useContext } from 'react';
import { UserAuthContext } from '../contexts/UserAuthContext';
import type { UserAuthContextType } from '../types/auth';

export const useUserAuth = (): UserAuthContextType => {
  const context = useContext(UserAuthContext);
  if (context === undefined) {
    throw new Error('useUserAuth deve ser usado dentro de um UserAuthProvider');
  }
  return context;
};
