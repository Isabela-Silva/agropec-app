import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AppRouter } from './AppRouter';
import { toastConfig } from './config/toast.config';
import { UserAuthProvider } from './contexts/UserAuthContext';

// Configuração do QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserAuthProvider>
        <AppRouter />
        <Toaster {...toastConfig} />
      </UserAuthProvider>
    </QueryClientProvider>
  );
}
