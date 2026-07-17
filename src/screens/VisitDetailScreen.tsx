import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useVisitContext } from '../context/VisitContext';

type Props = NativeStackScreenProps<RootStackParamList, 'VisitDetail'>;

export default function VisitDetailScreen({ navigation, route }: Props) {
  const { getVisitById } = useVisitContext();
  const visit = getVisitById(route.params.visitId);

  if (!visit) {
    return (
      <View style={styles.container}>
        <Text>No se encontró la visita.</Text>
      </View>
    );
  }

  const handleAction = () => {
    if (visit.status === 'pending') {
      navigation.navigate('CheckIn', { visitId: visit.id });
      return;
    }

    if (visit.status === 'checked_in') {
      navigation.navigate('CheckOut', { visitId: visit.id });
      return;
    }

    Alert.alert('Visita finalizada', 'Esta visita ya fue cerrada correctamente.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{visit.clientName}</Text>
        <Text style={styles.company}>{visit.company}</Text>
        <Text style={styles.address}>{visit.address}</Text>
        <Text style={styles.detail}>Prioridad: {visit.priority}</Text>
        <Text style={styles.detail}>Estado: {visit.status}</Text>
        <Text style={styles.detail}>Programada: {new Date(visit.scheduledAt).toLocaleString()}</Text>
        <Text style={styles.detail}>Notas: {visit.notes ?? 'Sin observaciones'}</Text>
        {visit.coordinates ? (
          <Text style={styles.detail}>
            Coordenadas: {visit.coordinates.latitude.toFixed(4)}, {visit.coordinates.longitude.toFixed(4)}
          </Text>
        ) : null}
        {visit.photoUri ? <Text style={styles.detail}>Foto capturada: Sí</Text> : null}
        {visit.signatureUri ? <Text style={styles.detail}>Firma registrada: Sí</Text> : null}
        {visit.rating ? <Text style={styles.detail}>Calificación: {visit.rating} estrellas</Text> : null}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleAction}>
        <Text style={styles.buttonText}>
          {visit.status === 'pending'
            ? 'Registrar Check-In'
            : visit.status === 'checked_in'
              ? 'Registrar Check-Out'
              : 'Visita cerrada'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
  },
  company: {
    color: '#334155',
    marginTop: 4,
  },
  address: {
    color: '#64748b',
    marginTop: 6,
  },
  detail: {
    color: '#334155',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
