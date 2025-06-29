export interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
}

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}
