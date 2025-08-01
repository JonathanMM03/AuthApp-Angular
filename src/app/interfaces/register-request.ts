export interface RegisterRequest {
    email: string;
    fullName: string;
    roles?: string[];
    password: string;
    confirmPassword: string;
  }