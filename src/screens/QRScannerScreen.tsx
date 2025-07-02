import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface QRScannerScreenProps {
  navigation: any;
}

export default function QRScannerScreen({ navigation }: QRScannerScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>QR Code Scanner</Text>
      <Text style={styles.subtitle}>Camera integration coming soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});