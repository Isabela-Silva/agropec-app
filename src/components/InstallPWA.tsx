import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useBeforeInstallPrompt } from '../hooks/useBeforeInstallPrompt';
import { useAppStore } from '../stores/app.store';

const PWA_DISMISSED_KEY = 'pwa_dismissed';

export function InstallPWA() {
  const { isInstallable, handleInstall } = useBeforeInstallPrompt();
  const [showAnimation, setShowAnimation] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const location = useLocation();
  const { hasClosedPWA, setClosedPWA, hasSplashShown } = useAppStore();

  // Verifica se está na área administrativa
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Reset do estado hasClosedPWA quando o componente montar
  useEffect(() => {
    setClosedPWA(false);
  }, [setClosedPWA]);

  useEffect(() => {
    if (
      isInstallable &&
      !isAdminRoute &&
      !hasClosedPWA &&
      hasSplashShown &&
      localStorage.getItem(PWA_DISMISSED_KEY) !== 'true'
    ) {
      setTimeout(() => setShowAnimation(true), 100);
    } else {
      setShowAnimation(false);
    }
  }, [isInstallable, isAdminRoute, hasClosedPWA, hasSplashShown]);

  const handleClose = () => {
    setShowAnimation(false);
    setTimeout(() => {
      if (dontShowAgain) {
        localStorage.setItem(PWA_DISMISSED_KEY, 'true');
      } else {
        setClosedPWA(true);
      }
    }, 300);
  };

  const handleInstallClick = async () => {
    try {
      await handleInstall();
      setShowAnimation(false);
      setTimeout(() => {
        localStorage.setItem(PWA_DISMISSED_KEY, 'true');
      }, 300);
    } catch (error) {
      console.error('Erro ao instalar PWA:', error);
    }
  };

  if (isAdminRoute || !showAnimation) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 z-50 rounded-lg border border-gray-200 bg-white p-4 shadow-lg md:left-auto md:right-4 md:w-80 ${
        showAnimation ? 'animate-slide-up' : 'translate-y-full opacity-0'
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
            <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium text-gray-900">Instalar App AGRO PEC</h3>
          <p className="mt-1 text-sm text-gray-500">
            Instale o app para ter acesso rápido e offline aos recursos do evento.
          </p>
        </div>
        <button onClick={handleClose} className="flex-shrink-0 text-gray-400 hover:text-gray-600">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="mt-3 flex items-center px-1">
        <div className="relative">
          <input
            type="checkbox"
            id="dont-show-again"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
            className="sr-only"
          />
          <label
            htmlFor="dont-show-again"
            className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded border-2 transition-all duration-75 ${
              dontShowAgain
                ? 'scale-110 border-green-500 bg-green-gradient'
                : 'border-gray-300 bg-white hover:border-green-400'
            }`}
          >
            {dontShowAgain && (
              <svg
                className="h-3 w-3 text-white transition-opacity duration-75"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </label>
        </div>
        <label htmlFor="dont-show-again" className="ml-3 cursor-pointer select-none text-sm text-gray-600">
          Não mostrar novamente
        </label>
      </div>

      <div className="mt-4 flex space-x-3">
        <button
          onClick={handleInstallClick}
          className="flex-1 rounded-md bg-green-gradient px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
        >
          Instalar
        </button>
        <button
          onClick={handleClose}
          className="flex-1 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
        >
          Agora não
        </button>
      </div>
    </div>
  );
}
