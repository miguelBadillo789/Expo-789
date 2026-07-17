import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import VisitDetailScreen from '../screens/VisitDetailScreen';
import CheckInScreen from '../screens/CheckInScreen';
import CheckOutScreen from '../screens/CheckOutScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  VisitDetail: { visitId: string };
  CheckIn: { visitId: string };
  CheckOut: { visitId: string };
};

export type MainTabParamList = {
  Dashboard: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="VisitDetail"
          component={VisitDetailScreen}
          options={{ headerShown: true, title: 'Detalle de visita' }}
        />
        <Stack.Screen
          name="CheckIn"
          component={CheckInScreen}
          options={{ headerShown: true, title: 'Check-In' }}
        />
        <Stack.Screen
          name="CheckOut"
          component={CheckOutScreen}
          options={{ headerShown: true, title: 'Check-Out' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
