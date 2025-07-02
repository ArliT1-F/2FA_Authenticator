import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import AccountsScreen from './screens/AccountsScreen';
import AddAccountScreen from './screens/AddAccountScreen';
import SettingsScreen from './screens/SettingsScreen';
import QRScannerScreen from './screens/QRScannerScreen';

// Import providers
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function AccountsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="AccountsList" 
        component={AccountsScreen}
        options={{ title: '2FA Accounts' }}
      />
      <Stack.Screen 
        name="AddAccount" 
        component={AddAccountScreen}
        options={{ title: 'Add Account' }}
      />
      <Stack.Screen 
        name="QRScanner" 
        component={QRScannerScreen}
        options={{ title: 'Scan QR Code' }}
      />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Accounts') {
            iconName = focused ? 'shield' : 'shield-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Accounts" component={AccountsStack} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <TabNavigator />
        </NavigationContainer>
      </AuthProvider>
    </ThemeProvider>
  );
}