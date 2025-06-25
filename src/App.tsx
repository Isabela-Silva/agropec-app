import { AppRouter } from './AppRouter';
import PWABadge from './PWABadge';

export function App() {
  return (
    <div className="min-h-screen bg-base-white-light lg:max-w-7xl">
      <AppRouter />
      <PWABadge />
    </div>
  );
}
