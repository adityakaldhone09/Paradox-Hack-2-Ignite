import { UserRole } from './roles';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  centre_id?: string;
  is_active: boolean;
  created_at?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface LoginResponse extends AuthTokens {
  user: User;
}

export interface DemoUser {
  email: string;
  name: string;
  role: UserRole;
  description: string;
}
