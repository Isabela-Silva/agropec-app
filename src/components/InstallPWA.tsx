import { Download, X } from 'lucide-react';
import { useState } from 'react';
import { useBeforeInstallPrompt } from '../hooks/useBeforeInstallPrompt';
import { useAppStore } from '../stores/app.store';
import { Button } from './ui/button';

export function InstallPWA() {
  const { isInstallable, handleInstall } = useBeforeInstallPrompt();
  const hasSplashShown = useAppStore((state) => state.hasSplashShown);
  const [isDismissed, setIsDismissed] = useState(false);
  const [neverShowAgain, setNeverShowAgain] = useState(false);

  // Verifica se o usuário optou por não ver mais
  const hasOptedOut = localStorage.getItem('pwaInstallOptOut') === 'true';

  if (!isInstallable || !hasSplashShown || isDismissed || hasOptedOut) {
    return null;
  }

  const handleClose = () => {
    setIsDismissed(true);
    if (neverShowAgain) {
      localStorage.setItem('pwaInstallOptOut', 'true');
    }
  };

  const handleInstallClick = async () => {
    await handleInstall();
    handleClose();
  };

  return (
    <div className="animate-slide-up fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-sm rounded-lg bg-white p-4 shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="mb-1 text-lg font-semibold">Instalar AgroPec</h3>
          <p className="text-sm text-base-gray">Instale nosso app para ter uma experiência melhor.</p>
        </div>
        <button onClick={handleClose} className="rounded-full p-1 text-base-gray transition-colors hover:bg-gray-100">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4 space-y-3">
        <label className="flex items-center gap-2 text-sm text-base-gray">
          <input
            type="checkbox"
            checked={neverShowAgain}
            onChange={(e) => setNeverShowAgain(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          Não mostrar mais
        </label>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={handleClose}>
            Agora não
          </Button>
          <Button className="flex-1 bg-green-gradient" onClick={handleInstallClick}>
            <Download className="mr-2 h-4 w-4" />
            Instalar
          </Button>
        </div>
      </div>
    </div>
  );
}
