import { ArrowLeft, Search } from 'lucide-react';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
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

  const title = propTitle || pageHeader.title;
  const showBackButton = propShowBackButton ?? pageHeader.showBackButton;
  const showSearch = propShowSearch ?? pageHeader.showSearch;

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-gray-200 bg-base-white-light/95 backdrop-blur-sm lg:bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 lg:h-16 lg:px-8">
          <div className="flex items-center gap-3">
            {/* Back Button - Mobile Only */}
            {showBackButton && (
              <button
                onClick={handleBackClick}
                className="flex items-center justify-center rounded-lg p-2 text-base-black hover:bg-gray-100 lg:hidden"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}

            {/* Title */}
            {title && <h1 className="text-lg font-semibold text-base-black lg:hidden">{title}</h1>}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            {showSearch && (
              <button
                onClick={() => setIsSearchModalOpen(true)}
                className="flex items-center justify-center rounded-lg p-2 text-base-black hover:bg-gray-100"
              >
                <Search className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Search Modal - Renderizado no nível do documento */}
      {isSearchModalOpen &&
        createPortal(
          <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />,
          document.body,
        )}
    </>
  );
};

export default Header;
