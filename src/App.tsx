import { Toaster } from 'react-hot-toast';
import { AppRouter } from './AppRouter';
import { InstallPWA } from './components/InstallPWA';
import { toastConfig } from './config/toast.config';
import PWABadge from './PWABadge';

export function App() {
  return (
    <div className="mx-auto min-h-[100dvh] max-w-screen-lg overflow-x-hidden bg-base-white-light">
      <AppRouter />
      <PWABadge />
      <InstallPWA />
      <Toaster {...toastConfig} />
    </div>
  );
}
