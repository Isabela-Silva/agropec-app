import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Calendar, MapPin, Bell, Info } from "lucide-react";

const BottomNavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = location.pathname;

  const navItems = [
    { path: "/explore", icon: Home },
    { path: "/agenda", icon: Calendar },
    { path: "/map", icon: MapPin },
    { path: "/alerts", icon: Bell },
    { path: "/info", icon: Info },
  ];

  return (
    <div className="fixed bottom-4 inset-x-4 max-w-md mx-auto">
      <div className="bg-green-500 rounded-full px-6 py-4 flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePath === item.path;
          return (
            <Icon
              key={item.path}
              className={`w-6 h-6 cursor-pointer transition-colors ${
                isActive ? "text-base-white" : "text-base-gray-light"
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