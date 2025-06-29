import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function useBeforeInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Verifica se já está instalado
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (window.navigator as { standalone?: boolean }).standalone === true;

    if (isStandalone || isIOSStandalone) {
      return;
    }

    const handler = (e: Event) => {
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Para iOS Safari e Android Chrome, verifica se pode ser instalado
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    const isChrome = /Chrome/.test(navigator.userAgent);
    const isSafari = /Safari/.test(navigator.userAgent);

    const isIOSSafari = isIOS && isSafari;
    const isAndroidChrome = isAndroid && isChrome;

    if (isIOSSafari || isAndroidChrome) {
      setIsInstallable(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // Para iOS Safari, mostra instruções manuais
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        alert('Para instalar no iOS:\n1. Toque no botão de compartilhar\n2. Selecione "Adicionar à Tela de Início"');
        return;
      }

      // Para outros casos sem prompt nativo
      alert(
        'Para instalar este app:\n1. Clique no menu do navegador (⋮)\n2. Selecione "Instalar app" ou "Adicionar à tela inicial"',
      );
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsInstallable(false);
      }
    } catch (error) {
      console.error('Erro durante instalação:', error);
    }
  };

  return { isInstallable, handleInstall };
}
