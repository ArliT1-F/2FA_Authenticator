import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Account } from '../types/Account';

interface AccountItemProps {
  account: Account;
  code: string;
  timeLeft: number;
  onCopy: () => void;
  onDelete: () => void;
}

export function AccountItem({ 
  account, 
  code, 
  timeLeft, 
  onCopy, 
  onDelete 
}: AccountItemProps) {
  const progress = ((account.period - timeLeft) / account.period) * 100;
  const isExpiringSoon = timeLeft <= 5;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.accountInfo}>
          <Text style={styles.accountName} numberOfLines={1}>
            {account.name}
          </Text>
          <Text style={styles.issuer} numberOfLines={1}>
            {account.issuer}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={onDelete}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      <View style={styles.codeSection}>
        <TouchableOpacity style={styles.codeContainer} onPress={onCopy}>
          <Text style={[styles.code, isExpiringSoon && styles.codeExpiring]}>
            {code}
          </Text>
          <View style={styles.copyIcon}>
            <Ionicons name="copy-outline" size={18} color="#007AFF" />
          </View>
        </TouchableOpacity>

        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                  backgroundColor: isExpiringSoon ? '#FF3B30' : '#007AFF',
                },
              ]}
            />
          </View>
          <Text style={[styles.timeLeft, isExpiringSoon && styles.timeLeftExpiring]}>
            {timeLeft}s
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  accountInfo: {
    flex: 1,
    marginRight: 12,
  },
  accountName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  issuer: {
    fontSize: 14,
    color: '#8E8E93',
  },
  deleteButton: {
    padding: 4,
  },
  codeSection: {
    gap: 12,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
  },
  code: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: '#1C1C1E',
    letterSpacing: 2,
  },
  codeExpiring: {
    color: '#FF3B30',
  },
  copyIcon: {
    marginLeft: 12,
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  timeLeft: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    minWidth: 30,
    textAlign: 'right',
  },
  timeLeftExpiring: {
    color: '#FF3B30',
  },
});