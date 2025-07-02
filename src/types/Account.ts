export interface Account {
  id: string;
  name: string;
  issuer: string;
  secret: string;
  algorithm: 'SHA1' | 'SHA256' | 'SHA512';
  digits: number;
  period: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAccountData {
  name: string;
  issuer: string;
  secret: string;
  algorithm?: 'SHA1' | 'SHA256' | 'SHA512';
  digits?: number;
  period?: number;
}

export interface TOTPConfig {
  secret: string;
  algorithm: 'SHA1' | 'SHA256' | 'SHA512';
  digits: number;
  period: number;
}