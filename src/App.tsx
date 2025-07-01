import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AppRouter } from './AppRouter';
import PWABadge from './PWABadge';
import { toastConfig } from './config/toast.config';

// Configuração do React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
      <Toaster {...toastConfig} />
      <PWABadge />
    </QueryClientProvider>
  );
}

export default App;
