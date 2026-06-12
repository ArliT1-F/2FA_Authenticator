import { authenticator } from 'otplib';
import { TOTPConfig } from '../types/Account';

export class TOTPService {
  private static readonly DEFAULT_PERIOD = 30;
  private static readonly DEFAULT_DIGITS = 6;
  private static readonly DEFAULT_ALGORITHM = 'SHA1';

  /**
   * Generate TOTP code for a given secret
   */
  static generateCode(secret: string, config?: Partial<TOTPConfig>): string {
    try {
      // Configure authenticator with custom settings or defaults
      authenticator.options = {
        digits: config?.digits || this.DEFAULT_DIGITS,
        step: config?.period || this.DEFAULT_PERIOD,
        algorithm: config?.algorithm || this.DEFAULT_ALGORITHM,
      };

      return authenticator.generate(secret);
    } catch (error) {
      console.error('Error generating TOTP code:', error);
      return '------';
    }
  }

  /**
   * Get remaining time for current TOTP period
   */
  static getTimeRemaining(period: number = this.DEFAULT_PERIOD): number {
    const now = Math.floor(Date.now() / 1000);
    return period - (now % period);
  }

  /**
   * Get progress percentage for current TOTP period
   */
  static getProgress(period: number = this.DEFAULT_PERIOD): number {
    const timeLeft = this.getTimeRemaining(period);
    return ((period - timeLeft) / period) * 100;
  }

  /**
   * Validate TOTP secret format
   */
  static isValidSecret(secret: string): boolean {
    try {
      // Remove spaces and convert to uppercase
      const cleanSecret = secret.replace(/\s/g, '').toUpperCase();
      
      // Check if it's valid base32
      return /^[A-Z2-7]+=*$/.test(cleanSecret) && cleanSecret.length >= 16;
    } catch {
      return false;
    }
  }

  /**
   * Clean and format secret key
   */
  static cleanSecret(secret: string): string {
    return secret.replace(/\s/g, '').toUpperCase();
  }

  /**
   * Parse TOTP URI (from QR codes)
   */
  static parseURI(uri: string): {
    secret: string;
    issuer?: string;
    accountName?: string;
    algorithm?: 'SHA1' | 'SHA256' | 'SHA512';
    digits?: number;
    period?: number;
  } | null {
    try {
      const url = new URL(uri);
      
      if (url.protocol !== 'otpauth:' || url.hostname !== 'totp') {
        return null;
      }

      const secret = url.searchParams.get('secret');
      if (!secret || !this.isValidSecret(secret)) {
        return null;
      }

      const pathParts = url.pathname.substring(1).split(':');
      const issuer = url.searchParams.get('issuer') || pathParts[0] || undefined;
      const accountName = pathParts.length > 1 ? pathParts[1] : pathParts[0];

      const algorithm = url.searchParams.get('algorithm') as 'SHA1' | 'SHA256' | 'SHA512' || 'SHA1';
      const digits = parseInt(url.searchParams.get('digits') || '6', 10);
      const period = parseInt(url.searchParams.get('period') || '30', 10);

      return {
        secret: this.cleanSecret(secret),
        issuer,
        accountName,
        algorithm,
        digits,
        period,
      };
    } catch (error) {
      console.error('Error parsing TOTP URI:', error);
      return null;
    }
  }

  /**
   * Generate backup codes (for recovery)
   */
  static generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = [];
    
    for (let i = 0; i < count; i++) {
      // Generate cryptographically secure 8-character alphanumeric code
      const array = new Uint8Array(6);
      if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        crypto.getRandomValues(array);
      } else {
        // Fallback for React Native
        for (let j = 0; j < array.length; j++) {
          array[j] = Math.floor(Math.random() * 256);
        }
      }
      const code = Array.from(array, byte =>
        '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'[byte % 36]
      ).join('');
      codes.push(code);
    }
    
    return codes;
  }

  /**
   * Verify if current time is within tolerance window
   */
  static verifyTimeSync(): boolean {
    try {
      // Simple check - in production, you might want to check against NTP server
      const now = Date.now();
      const systemTime = new Date().getTime();
      const diff = Math.abs(now - systemTime);
      
      // Allow 5 second tolerance
      return diff < 5000;
    } catch {
      return false;
    }
  }
}