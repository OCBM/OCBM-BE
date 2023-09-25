import { Role } from '@/common';

export interface TokenType {
  userid: number;
  username: string;
  email: string;
  role: Role;
  accessToken: string;
}
