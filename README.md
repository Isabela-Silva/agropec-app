# Agropec App

## 📱 Sobre o Projeto

Progressive Web App (PWA) desenvolvido para o Agropec, oferecendo funcionalidades como mapa interativo, agenda de eventos, informações e sistema de autenticação.

## 🗺️ Mapa Interativo

### ✅ Status: **IMPLEMENTADO COM SUCESSO**

O mapa interativo foi migrado do HTML/JavaScript original para React/TypeScript usando `react-leaflet` com sistema de coordenadas simples (`L.CRS.Simple`).

### 🚀 Funcionalidades Implementadas

- **✅ Renderização de polígonos**: 167 features carregadas do JSON
- **✅ Sistema de filtros**: Stands, Comida, Shows
- **✅ Busca textual**: Por nome, tipo ou localização
- **✅ Popups informativos**: Detalhes de cada local
- **✅ Contador de resultados**: Feedback visual de filtros aplicados
- **✅ Interface responsiva**: Design moderno e intuitivo

### 📁 Estrutura dos Arquivos

```
src/pages/Map/
├── components/
│   └── MapView.tsx          # Componente principal do mapa
├── data/
│   └── mapData.json         # Dados GeoJSON (167 features)
├── styles/
│   └── map.css              # Estilos customizados
├── types/
│   └── index.ts             # Interfaces TypeScript
└── index.tsx                # Página principal com filtros
```

### 🔧 Configuração Técnica

- **Leaflet**: v1.9.4 com React Leaflet v4.2.1
- **Sistema de Coordenadas**: `L.CRS.Simple` para coordenadas customizadas
- **Conversão de Coordenadas**: `[x, y] → [y, x]` para Leaflet
- **Bounds Automáticos**: Calculados dinamicamente baseado nos dados
- **Altura Fixa**: 500px para garantir renderização correta

### 🎨 Interface

- **Barra de Busca**: Input com ícone de lupa e botão de limpar
- **Filtros**: Botões com ícones para Stands, Comida e Shows
- **Contador**: Mostra quantos locais foram encontrados
- **Status Bar**: Exibe filtros e termos de busca ativos

### 🔍 Como Usar

1. **Buscar**: Digite o nome de um local na barra de busca
2. **Filtrar**: Clique nos botões de categoria (Stands, Comida, Shows)
3. **Ver Detalhes**: Clique em qualquer polígono para ver popup com informações
4. **Navegar**: Use os controles de zoom (+/-) ou mouse/touch
5. **Limpar**: Use o botão "Limpar filtro" ou "✕" na busca

### 📊 Dados do Mapa

O arquivo `mapData.json` contém:
- **167 features** no total
- **Tipos**: Stands, Comida, Shows, Banheiros, etc.
- **Propriedades**: nome, tipo, localização, cor, opacidade
- **Geometria**: Coordenadas de polígonos

### 🛠️ Resolução de Problemas

**Problema Resolvido**: Mapa não renderizava
- ✅ **Solução**: Definir altura fixa (`height: '500px'`) em vez de classes Tailwind
- ✅ **CSS do Leaflet**: Importação correta em `MapView.tsx`
- ✅ **Sistema de Coordenadas**: Configuração adequada do `CRS.Simple`

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca JavaScript para interfaces
- **TypeScript** - Superset tipado do JavaScript
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **React Router DOM** - Roteamento SPA
- **Leaflet + React Leaflet** - Mapas interativos
- **Lucide React** - Ícones SVG
- **React Hook Form** - Gerenciamento de formulários
- **Sonner** - Notificações toast

### PWA
- **Vite PWA Plugin** - Service Worker e manifesto
- **Workbox** - Estratégias de cache

### Build & Development
- **ESLint** - Linting JavaScript/TypeScript
- **PostCSS** - Processamento CSS
- **Yarn** - Gerenciador de pacotes

## 📋 Funcionalidades

### 🔐 Autenticação
- Login de usuários
- Login administrativo
- Contextos de autenticação separados
- Guards de rota

### 🗺️ Mapa Interativo
- Visualização de stands, comida e shows
- Sistema de filtros por categoria
- Busca textual por locais
- Popups informativos
- Interface responsiva

### 📱 PWA Features
- Instalação como app nativo
- Funcionamento offline
- Ícones personalizados
- Manifesto completo

### 🎯 Páginas Principais
- **Splash**: Tela inicial
- **Login/Signup**: Autenticação
- **Mapa**: Mapa interativo principal
- **Agenda**: Eventos programados
- **Explore**: Descoberta de conteúdo
- **Alerts**: Notificações
- **Info**: FAQ e informações
- **Admin**: Painel administrativo

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- Yarn ou npm

### Instalação
```bash
# Clonar o repositório
git clone <repo-url>

# Instalar dependências
yarn install
# ou
npm install

# Executar em desenvolvimento
yarn dev
# ou
npm run dev

# Build para produção
yarn build
# ou
npm run build
```

### Scripts Disponíveis
- `yarn dev` - Servidor de desenvolvimento
- `yarn build` - Build de produção
- `yarn preview` - Preview do build
- `yarn lint` - Verificar código com ESLint

## 📁 Estrutura do Projeto

```
src/
├── components/           # Componentes reutilizáveis
│   ├── ui/              # Componentes de interface
│   ├── AgropecLogo.tsx
│   ├── BottomNavBar.tsx
│   ├── Header.tsx
│   └── InstallPWA.tsx
├── contexts/            # Contextos React
├── guards/              # Guards de autenticação
├── hooks/               # Custom hooks
├── layouts/             # Layouts da aplicação
├── pages/               # Páginas da aplicação
│   ├── Admin/          # Painel administrativo
│   ├── Map/            # Mapa interativo ✅
│   ├── Login/
│   ├── Signup/
│   └── ...
├── services/           # Serviços e APIs
├── stores/             # Gerenciamento de estado
├── types/              # Definições TypeScript
└── utils/              # Utilitários
```

## 🔧 Configuração

### Ambiente
- Porta padrão: 3000 (ou próxima disponível)
- TypeScript strict mode habilitado
- ESLint configurado
- Tailwind CSS configurado

### PWA
- Service Worker automático
- Cache de recursos estáticos
- Manifesto com ícones personalizados
- Suporte a instalação

## 🎨 Design System

### Cores
- Documentação em `src/docs/colors.md`
- Paleta consistente no Tailwind

### Componentes
- Sistema modular em `src/components/ui/`
- Variantes configuráveis
- TypeScript strict

## 📝 Commits Recentes

### Mapa Interativo - Implementação Completa ✅
- **Migrado** HTML/JS original para React/TypeScript
- **Implementado** sistema de coordenadas simples (CRS.Simple)
- **Adicionado** filtros por categoria (Stands, Comida, Shows)
- **Criado** busca textual por nome/tipo/localização
- **Configurado** popups informativos para cada local
- **Resolvido** problema de renderização com altura fixa
- **Carregados** 167 features do arquivo JSON
- **Otimizada** interface responsiva com contador de resultados

### Melhorias de Qualidade
- **Atualizado** README.md com documentação completa
- **Organizada** estrutura de arquivos do mapa
- **Implementadas** interfaces TypeScript tipadas
- **Adicionados** estilos CSS customizados
- **Configurados** logs de debug para desenvolvimento

## 🤝 Contribuição

1. Siga as regras estabelecidas no início
2. Mantenha código limpo e bem documentado
3. Use TypeScript strict
4. Teste funcionalidades antes de commitar
5. Atualize README.md quando necessário

## 📄 Licença

Este projeto faz parte do programa Decola Grow.

---

**Desenvolvido pela equipe Decola Grow** 🚀
