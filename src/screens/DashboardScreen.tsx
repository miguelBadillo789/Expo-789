import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { MainTabParamList, RootStackParamList } from '../navigation/AppNavigator';
import { useVisitContext } from '../context/VisitContext';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Dashboard'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function DashboardScreen({ navigation }: Props) {
  const { visits, syncData, isSyncing, isOffline, lastSyncAt } = useVisitContext();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Visitas pendientes</Text>
          <Text style={styles.subtitle}>
            {visits.length} visitas registradas · {isOffline ? 'Modo offline' : 'Conectado'}
          </Text>
        </View>
        <TouchableOpacity style={styles.syncButton} onPress={() => syncData()} disabled={isSyncing}>
          <Text style={styles.syncButtonText}>{isSyncing ? 'Sincronizando...' : 'Sincronizar'}</Text>
        </TouchableOpacity>
      </View>

      {lastSyncAt ? <Text style={styles.lastSync}>Última sincronización: {new Date(lastSyncAt).toLocaleString()}</Text> : null}

      <FlatList
        data={visits}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('VisitDetail', { visitId: item.id })}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.clientName}>{item.clientName}</Text>
              <Text style={styles.priority}>{item.priority}</Text>
            </View>
            <Text style={styles.company}>{item.company}</Text>
            <Text style={styles.address}>{item.address}</Text>
            <Text style={styles.status}>Estado: {item.status}</Text>
            <Text style={styles.sync}>Sincronización: {item.syncStatus}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    color: '#64748b',
    marginTop: 4,
  },
  syncButton: {
    backgroundColor: '#0f766e',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  syncButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  lastSync: {
    color: '#64748b',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  priority: {
    color: '#2563eb',
    fontWeight: '600',
  },
  company: {
    color: '#334155',
    marginBottom: 2,
  },
  address: {
    color: '#64748b',
    marginBottom: 4,
  },
  status: {
    color: '#0f766e',
    fontWeight: '600',
  },
  sync: {
    color: '#64748b',
    marginTop: 2,
  },
});
