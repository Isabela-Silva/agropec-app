import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../pages/Admin/components/Layout/Header';
import { Sidebar } from '../pages/Admin/components/Layout/Sidebar';

// Configuração dos títulos das páginas
const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/users': 'Usuários',
  '/admin/admins': 'Administradores',
  '/admin/companies': 'Empresas',
  '/admin/categories': 'Categorias',
  '/admin/activities': 'Atividades',
  '/admin/stands': 'Stands',
  '/admin/notifications': 'Notificações',
};

export function AdminLayout() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Admin';

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header title={title} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
