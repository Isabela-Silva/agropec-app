# Agropec App

**Progressive Web App (PWA)** para o evento Agropec, oferecendo mapa interativo, agenda de eventos e sistema administrativo.

## ✨ Principais Funcionalidades

- 🗺️ **Mapa Interativo** - Visualização de stands, restaurantes e shows com sistema de filtros
- 📅 **Agenda** - Programação completa de eventos
- 🔐 **Autenticação** - Login para usuários e administradores
- 📱 **PWA** - Instalação como app nativo e funcionamento offline
- ⚙️ **Painel Admin** - Gerenciamento completo do evento

## 🛠️ Tecnologias

- **React 18** + **TypeScript**
- **Vite** + **Tailwind CSS**
- **React Leaflet** (mapas)
- **React Hook Form** + **React-hot-toasts**

## 🚀 Executar o Projeto

```bash
# Instalar dependências
yarn install

# Executar em desenvolvimento
yarn dev

# Build para produção
yarn build
```

## 📁 Estrutura Principal

```
src/
├── pages/                    # Páginas da aplicação
│   ├── Map/                 # 🗺️ Mapa interativo
│   │   ├── components/      # Componentes do mapa
│   │   ├── data/           # Dados dos stands e locais
│   │   └── types/          # Tipos TypeScript do mapa
│   ├── Admin/              # ⚙️ Painel administrativo
│   │   ├── components/     # Componentes admin (modais, forms)
│   │   └── pages/          # Páginas de gerenciamento
│   ├── Agenda/             # 📅 Agenda de eventos
│   ├── Login/ & Signup/    # 🔐 Autenticação
│   └── Explore/ Info/ Notifications/
│
├── components/              # 🧩 Componentes reutilizáveis
│   ├── ui/                 # Componentes base (Button, Input, etc)
│   ├── Header.tsx          # Cabeçalho principal
│   ├── BottomNavBar.tsx    # Navegação mobile
│   └── DesktopSidebar.tsx  # Sidebar desktop
│
├── services/               # 🌐 APIs e serviços
│   ├── interfaces/         # Tipos TypeScript
│   ├── AuthService.ts      # Autenticação
│   ├── *Service.ts         # CRUD de cada entidade
│   └── api.ts              # Cliente HTTP base
│
├── hooks/                  # 🪝 Custom hooks
│   ├── useUserAuth.ts      # Hook de autenticação usuário
│   ├── useAdminAuth.ts     # Hook de autenticação admin
│   └── usePageHeader.ts    # Hook para header dinâmico
│
├── layouts/                # 📐 Layouts base
│   ├── AppLayout.tsx       # Layout principal do app
│   ├── AdminLayout.tsx     # Layout do painel admin
│   └── AuthLayout.tsx      # Layout das telas de login
│
├── guards/                 # 🛡️ Proteção de rotas
└── stores/                 # 🗄️ Gerenciamento de estado
```

## 📱 PWA

O app funciona como Progressive Web App, permitindo:

- Instalação no dispositivo
- Funcionamento offline
- Notificações push
- Interface nativa
