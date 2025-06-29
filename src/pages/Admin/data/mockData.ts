import type { Activity, Admin, Category, Company, Notification, Stand, User } from '../types';

export const mockAdmins: Admin[] = [
  {
    uuid: '1',
    firstName: 'Admin',
    lastName: 'Principal',
    email: 'admin@agropec.com',
    role: 'SUPER_ADMIN',
  },
  {
    uuid: '2',
    firstName: 'João',
    lastName: 'Silva',
    email: 'joao@agropec.com',
    role: 'admin',
  },
];

export const mockUsers: User[] = [
  {
    uuid: '1',
    firstName: 'Maria',
    lastName: 'Santos',
    email: 'maria@email.com',
    role: 'user',
    activitiesId: ['1', '2'],
    standsId: ['1'],
  },
  {
    uuid: '2',
    firstName: 'Pedro',
    lastName: 'Oliveira',
    email: 'pedro@email.com',
    role: 'user',
    activitiesId: ['1'],
    standsId: [],
  },
  {
    uuid: '3',
    firstName: 'Ana',
    lastName: 'Costa',
    email: 'ana@email.com',
    role: 'user',
    activitiesId: [],
    standsId: ['2'],
  },
];

export const mockCompanies: Company[] = [
  {
    uuid: '1',
    name: 'AgroPec Soluções',
    description: 'Empresa especializada em soluções tecnológicas para o agronegócio',
  },
  {
    uuid: '2',
    name: 'Verde Campo Ltda',
    description: 'Fornecedora de equipamentos agrícolas e fertilizantes',
  },
  {
    uuid: '3',
    name: 'Sementes Brasil',
    description: 'Produção e distribuição de sementes certificadas',
  },
];

export const mockCategories: Category[] = [
  { uuid: '1', name: 'Tecnologia Agrícola' },
  { uuid: '2', name: 'Pecuária' },
  { uuid: '3', name: 'Agricultura Sustentável' },
  { uuid: '4', name: 'Irrigação' },
  { uuid: '5', name: 'Fertilizantes' },
  { uuid: '6', name: 'Sementes' },
  { uuid: '7', name: 'Máquinas Agrícolas' },
  { uuid: '8', name: 'Controle de Pragas' },
];

export const mockActivities: Activity[] = [
  {
    uuid: '1',
    name: 'Workshop de Agricultura Sustentável',
    description: 'Aprenda técnicas modernas de agricultura sustentável',
    categoryId: '1',
    latitude: -23.5505,
    longitude: -46.6333,
    imageUrl: 'https://via.placeholder.com/300x200',
    companyId: '1',
    date: '2024-03-15',
    startTime: '09:00',
    endTime: '12:00',
  },
  {
    uuid: '2',
    name: 'Demonstração de Equipamentos',
    description: 'Veja os equipamentos mais modernos do agronegócio',
    categoryId: '2',
    latitude: -23.5505,
    longitude: -46.6333,
    companyId: '2',
    date: '2024-03-16',
    startTime: '14:00',
    endTime: '17:00',
  },
];

export const mockStands: Stand[] = [
  {
    uuid: '1',
    name: 'Stand AgroPec Tech',
    description: 'Tecnologias inovadoras para o agronegócio',
    categoryId: '1',
    latitude: -23.5505,
    longitude: -46.6333,
    imageUrl: 'https://via.placeholder.com/300x200',
    date: '2024-03-15',
    companyId: '1',
    openingHours: {
      openingTime: '08:00',
      closingTime: '18:00',
    },
  },
  {
    uuid: '2',
    name: 'Stand Verde Campo',
    description: 'Equipamentos e soluções para agricultura',
    categoryId: '2',
    latitude: -23.5505,
    longitude: -46.6333,
    imageUrl: 'https://via.placeholder.com/300x200',
    date: '2024-03-15',
    companyId: '2',
    openingHours: {
      openingTime: '09:00',
      closingTime: '17:00',
    },
  },
];

export const mockNotifications: Notification[] = [
  {
    uuid: '1',
    title: 'Bem-vindos ao AgroPec 2024',
    message: 'Feira começa amanhã às 8h!',
    type: 'announcement',
    isScheduled: false,
    status: 'delivered',
    date: '2024-03-15',
    time: '08:00',
    targetAudience: ['all'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    uuid: '2',
    title: 'Alerta de Chuva',
    message: 'Possibilidade de chuva no período da tarde',
    type: 'alert',
    isScheduled: true,
    status: 'pending',
    date: '2024-03-16',
    time: '12:00',
    targetAudience: ['visitors'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
