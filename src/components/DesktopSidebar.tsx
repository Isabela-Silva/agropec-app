import { Bell, Calendar, Home, Info, MapPin } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../hooks/useUserAuth';
import { AgropecLogo } from './AgropecLogo';

const navItems = [
  { path: '/explore', label: 'Explorar', icon: Home },
  { path: '/agenda', label: 'Agenda', icon: Calendar },
  { path: '/map', label: 'Mapa', icon: MapPin },
  { path: '/notificacoes', label: 'Notificações', icon: Bell },
  { path: '/info', label: 'Info', icon: Info },
];

export function DesktopSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { user } = useUserAuth();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 lg:block">
      <div className="flex h-full flex-col border-r border-gray-200 bg-white">
        {/* Logo */}
        <div className="flex h-16 flex-shrink-0 items-center border-b border-gray-200 px-4">
          <AgropecLogo className="h-8 w-auto" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-green-50 text-green-600' : 'text-base-gray hover:bg-gray-50 hover:text-base-black'
                }`}
              >
                <Icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive ? 'text-green-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        {user && (
          <div className="flex-shrink-0 border-t border-gray-200 px-3 py-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-sm font-medium text-white">
                {user.firstName[0]}
                {user.lastName[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-base-black">
                  {user.firstName} {user.lastName}
                </p>
                <p className="truncate text-xs text-base-gray">{user.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
