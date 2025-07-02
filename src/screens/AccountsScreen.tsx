import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

import { Account } from '../types/Account';
import { TOTPService } from '../services/TOTPService';
import { StorageService } from '../services/StorageService';
import { AccountItem } from '../components/AccountItem';

interface AccountsScreenProps {
  navigation: any;
}

export default function AccountsScreen({ navigation }: AccountsScreenProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    loadAccounts();
    
    // Update time every second for TOTP countdown
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const loadAccounts = async () => {
    try {
      if (!refreshing) {
        setLoading(true);
      }
      const storedAccounts = await StorageService.getAccounts();
      setAccounts(storedAccounts);
    } catch (error) {
      console.error('Error loading accounts:', error);
      Alert.alert('Error', 'Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAccounts();
    setRefreshing(false);
  };

  const copyToClipboard = async (code: string, accountName: string) => {
    try {
      await Clipboard.setStringAsync(code);
      Alert.alert('Copied', `${accountName} code copied to clipboard`);
    } catch (error) {
      Alert.alert('Error', 'Failed to copy code');
    }
  };

  const deleteAccount = (accountId: string) => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete this account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.deleteAccount(accountId);
              await loadAccounts();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete account');
            }
          },
        },
      ]
    );
  };

  const renderAccount = ({ item }: { item: Account }) => {
    const code = useMemo(() => TOTPService.generateCode(item.secret), [item.secret, currentTime]);
    const timeLeft = useMemo(() => TOTPService.getTimeRemaining(), [currentTime]);

    return (
      <AccountItem
        account={item}
        code={code}
        timeLeft={timeLeft}
        onCopy={() => copyToClipboard(code, item.name)}
        onDelete={() => deleteAccount(item.id)}
      />
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="shield-outline" size={80} color="#ccc" />
      <Text style={styles.emptyTitle}>No Accounts Added</Text>
      <Text style={styles.emptySubtitle}>
        Tap the + button to add your first 2FA account
      </Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading accounts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={accounts}
        renderItem={renderAccount}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={accounts.length === 0 ? styles.emptyContainer : undefined}
      />
      
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddAccount')}
        accessibilityLabel="Add new account"
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});