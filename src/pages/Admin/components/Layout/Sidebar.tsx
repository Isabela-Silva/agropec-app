import { AgropecLogo } from '@/components/AgropecLogo';
import { Bell, Building2, Calendar, LayoutDashboard, LogOut, Star, Store, Tags, UserCheck, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAdminAuth } from '../../../../hooks/useAdminAuth';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Usuários', href: '/admin/users', icon: Users },
  { name: 'Administradores', href: '/admin/admins', icon: UserCheck },
  { name: 'Empresas', href: '/admin/companies', icon: Building2 },
  { name: 'Categorias', href: '/admin/categories', icon: Tags },
  { name: 'Atividades', href: '/admin/activities', icon: Calendar },
  { name: 'Stands', href: '/admin/stands', icon: Store },
  { name: 'Destaques', href: '/admin/highlights', icon: Star },
  { name: 'Notificações', href: '/admin/notifications', icon: Bell },
];

export function Sidebar() {
  const { admin, logout } = useAdminAuth();

  return (
    <div className="flex h-full flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-20 items-center justify-center border-b border-gray-200 px-4">
        <AgropecLogo className="w-20 max-w-full" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-4 py-6">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/admin'}
            className={({ isActive }) =>
              `flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-r-2 border-admin-primary-600 bg-admin-primary-50 text-admin-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="border-t border-gray-200 p-4">
        <div className="mb-3 flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-admin-primary-100">
            <span className="text-sm font-medium text-admin-primary-700">
              {admin?.firstName?.charAt(0) || admin?.email?.charAt(0) || '?'}
              {admin?.lastName?.charAt(0) || ''}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">
              {admin?.firstName || admin?.lastName
                ? `${admin?.firstName ?? ''} ${admin?.lastName ?? ''}`.trim()
                : admin?.email}
            </p>
            <p className="truncate text-xs text-gray-500">{admin?.email}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sair
        </button>
      </div>
    </div>
  );
}
