import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = false }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center border-b border-gray-800 p-4">
      {showBackButton && <ArrowLeft className="mr-4 h-6 w-6 cursor-pointer" onClick={() => navigate('/explore')} />}
      <div className="text-xl font-bold">{title}</div>
    </div>
  );
};

export default Header;
