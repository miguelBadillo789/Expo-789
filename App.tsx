import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { VisitProvider } from './src/context/VisitContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <VisitProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </VisitProvider>
  );
}
