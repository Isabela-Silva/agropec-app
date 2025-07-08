import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppStore } from '../stores/app.store';

// Configuração dos títulos das páginas
const pageTitles: Record<string, string> = {
  '/explore': 'AgroPec',
  '/agenda': 'Agenda',
  '/map': 'Mapa',
  '/notificacoes': 'Notificações',
  '/info': 'AgroPec 2025',
  '/login': 'Entrar',
  '/signup': 'Cadastro',
};

// Configuração de quais páginas mostram botão voltar
const showBackButtonPages = ['/map', '/notificacoes', '/info', '/login', '/signup'];

// Configuração de páginas com header customizado (que não usam o header padrão)
const customHeaderPages: string[] = [
  // Removido '/explore' - agora usa header padrão
];

// Páginas que mostram botão de busca
const showSearchPages = ['/explore'];

export function usePageHeader() {
  const location = useLocation();
  const { setPageHeader } = useAppStore();

  useEffect(() => {
    const path = location.pathname;

    // Verificar se é uma página de detalhes dinâmica
    const detailsMatch = path.match(/^\/detalhes\/(\w+)\/(.+)$/);
    if (detailsMatch) {
      const [, type] = detailsMatch;
      const title = type === 'activity' ? 'Detalhes da Atividade' : 'Detalhes do Stand';
      setPageHeader({
        title,
        showBackButton: true,
        showSearch: false,
        hasCustomHeader: false, // Usar header padrão
      });
      return;
    }

    // Configurar header baseado na rota
    const title = pageTitles[path] || 'AgroPec';
    const showBackButton = showBackButtonPages.includes(path);
    const showSearch = showSearchPages.includes(path);
    const hasCustomHeader = customHeaderPages.includes(path);

    setPageHeader({
      title,
      showBackButton,
      showSearch,
      hasCustomHeader,
    });
  }, [location.pathname, setPageHeader]);

  return useAppStore((state) => state.pageHeader);
}
