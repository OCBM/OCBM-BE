import { Role } from '@/common';

export interface TokenType {
  userId: number;
  userName: string;
  email: string;
  role: Role;
  accessToken: string;
}
