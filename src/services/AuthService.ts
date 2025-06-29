import { api } from './api';

interface SignInCredentials {
  email: string;
  password: string;
}

interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    uuid: string;
    email: string;
    role: string;
  };
  token: string;
}

export const AuthService = {
  async signIn({ email, password }: SignInCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/users/login', {
      email,
      password,
    });

    return response.data;
  },

  async signUp(data: SignUpData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/users/signup', data);

    return response.data;
  },

  async signOut(): Promise<void> {
    localStorage.removeItem('auth_token');
  },

  async me(): Promise<AuthResponse['user']> {
    const response = await api.get<AuthResponse['user']>('/auth/me');

    return response.data;
  },
};
