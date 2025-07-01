import { ArrowLeft, Search } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/app.store';
import { SearchModal } from './SearchModal';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  showSearch?: boolean;
  onBackClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title: propTitle,
  showBackButton: propShowBackButton,
  showSearch: propShowSearch,
  onBackClick,
}) => {
  const navigate = useNavigate();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { pageHeader } = useAppStore();

  // Usar props se fornecidas, senão usar configuração da store
  const title = propTitle ?? pageHeader.title;
  const showBackButton = propShowBackButton ?? pageHeader.showBackButton;
  const showSearch = propShowSearch ?? pageHeader.showSearch;

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  const handleSearchClick = () => {
    setIsSearchModalOpen(true);
  };

  const handleSearchModalClose = () => {
    setIsSearchModalOpen(false);
  };

  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-50 border-b border-gray-200 bg-base-white-light/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            {showBackButton && (
              <button
                onClick={handleBackClick}
                className="mr-3 flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5 text-base-black" />
              </button>
            )}
            <h1 className="text-xl font-bold text-base-black">{title}</h1>
          </div>

          {showSearch && (
            <button
              onClick={handleSearchClick}
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
            >
              <Search className="h-5 w-5 text-base-black" />
            </button>
          )}
        </div>
      </div>

      {showSearch && <SearchModal isOpen={isSearchModalOpen} onClose={handleSearchModalClose} />}
    </>
  );
};

export default Header;
