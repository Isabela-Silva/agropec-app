import { AppRouter } from './AppRouter';
import PWABadge from './PWABadge';

export function App() {
  return (
    <div className="mx-auto min-h-[100dvh] max-w-screen-lg bg-base-white-light">
      <AppRouter />
      <PWABadge />
    </div>
  );
}
