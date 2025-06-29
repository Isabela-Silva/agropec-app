import { Navigate, Outlet } from 'react-router-dom';

interface AuthGuardProps {
  isPrivate?: boolean;
  redirectTo?: string;
  tokenKey?: string;
  children?: React.ReactNode;
}

export function AuthGuard({
  isPrivate = true,
  redirectTo = '/login',
  tokenKey = 'auth_token',
  children,
}: AuthGuardProps) {
  const isAuthenticated = localStorage.getItem(tokenKey) !== null;

  if (isPrivate && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!isPrivate && isAuthenticated) {
    // Se não é privada mas está autenticado, redireciona para dashboard
    const dashboardPath = tokenKey === 'admin_token' ? '/admin' : '/explore';
    return <Navigate to={dashboardPath} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
