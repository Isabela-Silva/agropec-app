// Tipos básicos
export interface Admin {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface CreateAdmin {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface User {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  activitiesId?: string[];
  standsId?: string[];
}

export interface CreateUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface Company {
  uuid: string;
  name: string;
  description: string;
}

export interface CreateCompany {
  name: string;
  description: string;
}

export interface Category {
  uuid: string;
  name: string;
}

export interface CreateCategory {
  name: string;
}

export interface Activity {
  uuid: string;
  name: string;
  description: string;
  categoryId: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  companyId: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface CreateActivity {
  name: string;
  description: string;
  categoryId: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  companyId: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface Stand {
  uuid: string;
  name: string;
  description: string;
  categoryId: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  date: string;
  companyId: string;
  openingHours: {
    openingTime: string;
    closingTime: string;
  };
}

export interface CreateStand {
  name: string;
  description: string;
  categoryId: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  date: string;
  companyId: string;
  openingHours: {
    openingTime: string;
    closingTime: string;
  };
}

export interface Notification {
  uuid: string;
  title: string;
  message: string;
  type: 'alert' | 'announcement' | 'event';
  isScheduled: boolean;
  status: 'pending' | 'delivered' | 'read';
  date: string;
  time: string;
  targetAudience: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNotification {
  title: string;
  message: string;
  type: 'alert' | 'announcement' | 'event';
  isScheduled: boolean;
  date: string;
  time: string;
  targetAudience: string[];
}
