export interface ApiError {
  response?: {
    status?: number;
    data?: {
      error?: string;
      message?: string;
    };
  };
}

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

export interface AuthResponse {
  user: {
    uuid: string;
    email: string;
    role: string;
  };
  token: string;
}

export interface AdminAuthResponse {
  admin: {
    uuid: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  token: string;
}
