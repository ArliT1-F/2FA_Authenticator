import * as SecureStore from 'expo-secure-store';
import CryptoJS from 'crypto-js';
import { Account, CreateAccountData } from '../types/Account';

export class StorageService {
  private static readonly ACCOUNTS_KEY = 'twofa_accounts';
  private static readonly MASTER_KEY = 'twofa_master_key';
  private static readonly SETTINGS_KEY = 'twofa_settings';

  /**
   * Initialize storage with master encryption key
   */
  static async initializeStorage(masterPassword?: string): Promise<void> {
    try {
      let encryptionKey = await SecureStore.getItemAsync(this.MASTER_KEY);
      
      if (!encryptionKey) {
        // Generate new encryption key
        encryptionKey = CryptoJS.lib.WordArray.random(256/8).toString();
        await SecureStore.setItemAsync(this.MASTER_KEY, encryptionKey);
      }
    } catch (error) {
      console.error('Error initializing storage:', error);
      throw new Error('Failed to initialize secure storage');
    }
  }

  /**
   * Get encryption key
   */
  private static async getEncryptionKey(): Promise<string> {
    const key = await SecureStore.getItemAsync(this.MASTER_KEY);
    if (!key) {
      throw new Error('Encryption key not found. Storage not initialized.');
    }
    return key;
  }

  /**
   * Encrypt data
   */
  private static encrypt(data: string, key: string): string {
    return CryptoJS.AES.encrypt(data, key).toString();
  }

  /**
   * Decrypt data
   */
  private static decrypt(encryptedData: string, key: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  /**
   * Get all accounts
   */
  static async getAccounts(): Promise<Account[]> {
    try {
      const encryptionKey = await this.getEncryptionKey();
      const encryptedData = await SecureStore.getItemAsync(this.ACCOUNTS_KEY);
      
      if (!encryptedData) {
        return [];
      }

      const decryptedData = this.decrypt(encryptedData, encryptionKey);
      const accounts = JSON.parse(decryptedData);
      
      // Convert date strings back to Date objects
      return accounts.map((account: any) => ({
        ...account,
        createdAt: new Date(account.createdAt),
        updatedAt: new Date(account.updatedAt),
      }));
    } catch (error) {
      console.error('Error getting accounts:', error);
      return [];
    }
  }

  /**
   * Save accounts
   */
  static async saveAccounts(accounts: Account[]): Promise<void> {
    try {
      const encryptionKey = await this.getEncryptionKey();
      const data = JSON.stringify(accounts);
      const encryptedData = this.encrypt(data, encryptionKey);
      
      await SecureStore.setItemAsync(this.ACCOUNTS_KEY, encryptedData);
    } catch (error) {
      console.error('Error saving accounts:', error);
      throw new Error('Failed to save accounts');
    }
  }

  /**
   * Add new account
   */
  static async addAccount(accountData: CreateAccountData): Promise<Account> {
    try {
      const accounts = await this.getAccounts();
      
      const newAccount: Account = {
        id: this.generateId(),
        name: accountData.name,
        issuer: accountData.issuer,
        secret: accountData.secret,
        algorithm: accountData.algorithm || 'SHA1',
        digits: accountData.digits || 6,
        period: accountData.period || 30,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      accounts.push(newAccount);
      await this.saveAccounts(accounts);
      
      return newAccount;
    } catch (error) {
      console.error('Error adding account:', error);
      throw new Error('Failed to add account');
    }
  }

  /**
   * Update account
   */
  static async updateAccount(accountId: string, updates: Partial<CreateAccountData>): Promise<void> {
    try {
      const accounts = await this.getAccounts();
      const accountIndex = accounts.findIndex(account => account.id === accountId);
      
      if (accountIndex === -1) {
        throw new Error('Account not found');
      }

      accounts[accountIndex] = {
        ...accounts[accountIndex],
        ...updates,
        updatedAt: new Date(),
      };

      await this.saveAccounts(accounts);
    } catch (error) {
      console.error('Error updating account:', error);
      throw new Error('Failed to update account');
    }
  }

  /**
   * Delete account
   */
  static async deleteAccount(accountId: string): Promise<void> {
    try {
      const accounts = await this.getAccounts();
      const filteredAccounts = accounts.filter(account => account.id !== accountId);
      
      await this.saveAccounts(filteredAccounts);
    } catch (error) {
      console.error('Error deleting account:', error);
      throw new Error('Failed to delete account');
    }
  }

  /**
   * Get account by ID
   */
  static async getAccount(accountId: string): Promise<Account | null> {
    try {
      const accounts = await this.getAccounts();
      return accounts.find(account => account.id === accountId) || null;
    } catch (error) {
      console.error('Error getting account:', error);
      return null;
    }
  }

  /**
   * Export accounts (encrypted backup)
   */
  static async exportAccounts(): Promise<string> {
    try {
      const accounts = await this.getAccounts();
      const exportData = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        accounts: accounts,
      };
      
      // Create additional encryption for export
      const exportKey = CryptoJS.lib.WordArray.random(256/8).toString();
      const encryptedExport = this.encrypt(JSON.stringify(exportData), exportKey);
      
      return JSON.stringify({
        data: encryptedExport,
        key: exportKey,
      });
    } catch (error) {
      console.error('Error exporting accounts:', error);
      throw new Error('Failed to export accounts');
    }
  }

  /**
   * Import accounts from backup
   */
  static async importAccounts(backupData: string): Promise<void> {
    try {
      const backup = JSON.parse(backupData);
      const decryptedData = this.decrypt(backup.data, backup.key);
      const importData = JSON.parse(decryptedData);
      
      if (!importData.accounts || !Array.isArray(importData.accounts)) {
        throw new Error('Invalid backup format');
      }

      // Convert imported accounts and merge with existing
      const existingAccounts = await this.getAccounts();
      const importedAccounts = importData.accounts.map((account: any) => ({
        ...account,
        id: this.generateId(), // Generate new IDs to avoid conflicts
        createdAt: new Date(account.createdAt),
        updatedAt: new Date(),
      }));

      const allAccounts = [...existingAccounts, ...importedAccounts];
      await this.saveAccounts(allAccounts);
    } catch (error) {
      console.error('Error importing accounts:', error);
      throw new Error('Failed to import accounts');
    }
  }

  /**
   * Clear all data (for app reset)
   */
  static async clearAllData(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(this.ACCOUNTS_KEY);
      await SecureStore.deleteItemAsync(this.MASTER_KEY);
      await SecureStore.deleteItemAsync(this.SETTINGS_KEY);
    } catch (error) {
      console.error('Error clearing data:', error);
      throw new Error('Failed to clear data');
    }
  }

  /**
   * Generate unique ID
   */
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Get app settings
   */
  static async getSettings(): Promise<any> {
    try {
      const settings = await SecureStore.getItemAsync(this.SETTINGS_KEY);
      return settings ? JSON.parse(settings) : {};
    } catch (error) {
      console.error('Error getting settings:', error);
      return {};
    }
  }

  /**
   * Save app settings
   */
  static async saveSettings(settings: any): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw new Error('Failed to save settings');
    }
  }
}