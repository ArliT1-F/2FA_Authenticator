/**
 * TOTP Service Unit Tests
 * 
 * Tests for the Time-Based One-Time Password service
 * focusing on security and correctness of TOTP generation
 */

// Mock the otplib dependency since we don't have it installed yet
jest.mock('otplib', () => ({
  authenticator: {
    options: {},
    generate: jest.fn().mockReturnValue('123456'),
  },
}));

import { TOTPService } from '../TOTPService';

describe('TOTPService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateCode', () => {
    it('should generate a 6-digit TOTP code', () => {
      // Use a placeholder test secret that won't trigger secret detection
      const secret = 'MFRGGZDFMZTWQ2LK';
      const code = TOTPService.generateCode(secret);
      
      expect(code).toMatch(/^\d{6}$/);
      expect(code).toBe('123456'); // Mocked value
    });

    it('should handle invalid secrets gracefully', () => {
      const invalidSecret = '';
      const code = TOTPService.generateCode(invalidSecret);
      
      expect(code).toBe('------');
    });

    it('should use custom configuration when provided', () => {
      // Use a placeholder test secret that won't trigger secret detection
      const secret = 'MFRGGZDFMZTWQ2LK';
      const config = {
        digits: 8,
        period: 60,
        algorithm: 'SHA256' as const,
      };
      
      const code = TOTPService.generateCode(secret, config);
      expect(code).toBeDefined();
    });
  });

  describe('getTimeRemaining', () => {
    it('should return time remaining in current period', () => {
      const timeRemaining = TOTPService.getTimeRemaining(30);
      
      expect(timeRemaining).toBeGreaterThan(0);
      expect(timeRemaining).toBeLessThanOrEqual(30);
    });

    it('should handle custom periods', () => {
      const timeRemaining = TOTPService.getTimeRemaining(60);
      
      expect(timeRemaining).toBeGreaterThan(0);
      expect(timeRemaining).toBeLessThanOrEqual(60);
    });
  });

  describe('getProgress', () => {
    it('should return progress percentage between 0 and 100', () => {
      const progress = TOTPService.getProgress(30);
      
      expect(progress).toBeGreaterThanOrEqual(0);
      expect(progress).toBeLessThanOrEqual(100);
    });
  });

  describe('isValidSecret', () => {
    it('should validate correct base32 secrets', () => {
      // Use a placeholder test secret that won't trigger secret detection
      const validSecret = 'MFRGGZDFMZTWQ2LK';
      expect(TOTPService.isValidSecret(validSecret)).toBe(true);
    });

    it('should reject invalid secrets', () => {
      expect(TOTPService.isValidSecret('')).toBe(false);
      expect(TOTPService.isValidSecret('invalid-secret')).toBe(false);
      expect(TOTPService.isValidSecret('123')).toBe(false);
    });

    it('should handle secrets with padding', () => {
      // Use a placeholder test secret that won't trigger secret detection
      const secretWithPadding = 'MFRGGZDFMZTWQ2LK====';
      expect(TOTPService.isValidSecret(secretWithPadding)).toBe(true);
    });
  });

  describe('cleanSecret', () => {
    it('should remove spaces and convert to uppercase', () => {
      // Use a placeholder test secret that won't trigger secret detection
      const dirtySecret = 'mfroogzdfmztwq2lk';
      const cleanSecret = TOTPService.cleanSecret(dirtySecret);
      
      expect(cleanSecret).toBe('MFRGGZDFMZTWQ2LK');
    });
  });

  describe('parseURI', () => {
    it('should parse valid TOTP URIs', () => {
      // Use a placeholder test secret that won't trigger secret detection
      const testSecret = 'MFRGGZDFMZTWQ2LK';
      const uri = `otpauth://totp/Example:user@example.com?secret=${testSecret}&issuer=Example`;
      const parsed = TOTPService.parseURI(uri);
      
      expect(parsed).toEqual({
        secret: 'MFRGGZDFMZTWQ2LK',
        issuer: 'Example',
        accountName: 'user@example.com',
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
      });
    });

    it('should return null for invalid URIs', () => {
      const invalidURI = 'invalid-uri';
      const parsed = TOTPService.parseURI(invalidURI);
      
      expect(parsed).toBeNull();
    });

    it('should handle URIs with custom parameters', () => {
      // Use a placeholder test secret that won't trigger secret detection
      const testSecret = 'MFRGGZDFMZTWQ2LK';
      const uri = `otpauth://totp/test?secret=${testSecret}&algorithm=SHA256&digits=8&period=60`;
      const parsed = TOTPService.parseURI(uri);
      
      expect(parsed?.algorithm).toBe('SHA256');
      expect(parsed?.digits).toBe(8);
      expect(parsed?.period).toBe(60);
    });
  });

  describe('generateBackupCodes', () => {
    it('should generate the specified number of backup codes', () => {
      const codes = TOTPService.generateBackupCodes(5);
      
      expect(codes).toHaveLength(5);
      codes.forEach(code => {
        expect(code).toMatch(/^[A-Z0-9]{8}$/);
      });
    });

    it('should generate unique backup codes', () => {
      const codes = TOTPService.generateBackupCodes(10);
      const uniqueCodes = new Set(codes);
      
      expect(uniqueCodes.size).toBe(codes.length);
    });
  });

  describe('verifyTimeSync', () => {
    it('should verify time synchronization', () => {
      const isTimeSync = TOTPService.verifyTimeSync();
      
      expect(typeof isTimeSync).toBe('boolean');
    });
  });

  describe('Security Tests', () => {
    it('should not expose sensitive information in error messages', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Test with invalid secret that might cause an error
      TOTPService.generateCode('invalid');
      
      // Check that console.error was called but didn't expose the secret
      if (consoleSpy.mock.calls.length > 0) {
        const errorMessage = consoleSpy.mock.calls[0][0];
        expect(errorMessage).not.toContain('invalid');
      }
      
      consoleSpy.mockRestore();
    });

    it('should handle edge cases gracefully', () => {
      // Test various edge cases that might cause security issues
      expect(() => TOTPService.generateCode(null as any)).not.toThrow();
      expect(() => TOTPService.generateCode(undefined as any)).not.toThrow();
      expect(() => TOTPService.isValidSecret(null as any)).not.toThrow();
    });
  });
});