import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface AuthGuardProps {
  isPrivate?: boolean;
}

export function AuthGuard({ isPrivate = true }: AuthGuardProps) {
  const location = useLocation();
  const token = localStorage.getItem('auth_token');
  const isAuthenticated = !!token;

  if (!isAuthenticated && isPrivate) {
    // Redireciona para o login, mas salva a rota que o usuário tentou acessar
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isAuthenticated && !isPrivate) {
    // Se estiver autenticado e tentar acessar uma rota pública (login/signup)
    // redireciona para a home
    return <Navigate to="/explore" replace />;
  }

  return <Outlet />;
}
