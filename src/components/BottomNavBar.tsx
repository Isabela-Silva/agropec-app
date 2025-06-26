import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, MapPin, Bell, Info } from 'lucide-react';

const BottomNavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = location.pathname;

  const navItems = [
    { path: '/explore', icon: Home },
    { path: '/agenda', icon: Calendar },
    { path: '/map', icon: MapPin },
    { path: '/alerts', icon: Bell },
    { path: '/info', icon: Info },
  ];

  return (
    <div className="fixed inset-x-4 bottom-4 mx-auto max-w-md">
      <div className="flex items-center justify-around rounded-full bg-green-500 px-6 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePath === item.path;
          return (
            <Icon
              key={item.path}
              className={`h-6 w-6 cursor-pointer transition-colors ${
                isActive ? 'text-base-white' : 'text-base-gray-light'
              }`}
              onClick={() => navigate(item.path)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavBar;
