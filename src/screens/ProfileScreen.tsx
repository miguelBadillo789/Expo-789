import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useVisitContext } from '../context/VisitContext';

export default function ProfileScreen() {
  const { isOffline, isSyncing, lastSyncAt, visits } = useVisitContext();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil del usuario</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Usuario</Text>
        <Text style={styles.value}>Administrador</Text>
        <Text style={styles.label}>Rol</Text>
        <Text style={styles.value}>Supervisor de campo</Text>
        <Text style={styles.label}>Estado de conexión</Text>
        <Text style={styles.value}>{isOffline ? 'Sin conexión' : 'Conectado'}</Text>
        <Text style={styles.label}>Última sincronización</Text>
        <Text style={styles.value}>{lastSyncAt ? new Date(lastSyncAt).toLocaleString() : 'Aún no sincronizado'}</Text>
        <Text style={styles.label}>Visitas cargadas</Text>
        <Text style={styles.value}>{visits.length}</Text>
      </View>

      {isSyncing ? <Text style={styles.syncing}>Sincronizando datos...</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  label: {
    color: '#64748b',
    marginTop: 8,
  },
  value: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '600',
  },
  syncing: {
    marginTop: 12,
    color: '#0f766e',
    fontWeight: '600',
  },
});
