import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AddAccountScreenProps {
  navigation: any;
}

export default function AddAccountScreen({ navigation }: AddAccountScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Account</Text>
      <Text style={styles.subtitle}>Coming soon...</Text>
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