import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useVisitContext } from '../context/VisitContext';

type Props = NativeStackScreenProps<RootStackParamList, 'CheckOut'>;

export default function CheckOutScreen({ navigation, route }: Props) {
  const { checkOutVisit } = useVisitContext();
  const [signature, setSignature] = useState('Firma digitalizada simulada');
  const [rating, setRating] = useState(4);
  const [notes, setNotes] = useState('Visita realizada con éxito.');

  const handleConfirm = () => {
    if (!signature) {
      Alert.alert('Firma requerida', 'Ingresa una firma digitalizada simulada para continuar.');
      return;
    }

    checkOutVisit(route.params.visitId, signature, rating, notes);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check-Out de visita</Text>
      <Text style={styles.subtitle}>Registra la firma, calificación y observaciones finales.</Text>

      <View style={styles.signatureBox}>
        <Text style={styles.signatureText}>{signature}</Text>
      </View>

      <Text style={styles.label}>Calificación</Text>
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Text style={[styles.star, star <= rating ? styles.starActive : styles.starInactive]}>★</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Observaciones"
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Confirmar Check-Out</Text>
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
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    color: '#64748b',
    marginTop: 6,
    marginBottom: 12,
  },
  signatureBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#dbe2ea',
    marginBottom: 12,
  },
  signatureText: {
    fontSize: 16,
    color: '#334155',
  },
  label: {
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  star: {
    fontSize: 28,
    marginRight: 6,
  },
  starActive: {
    color: '#f59e0b',
  },
  starInactive: {
    color: '#cbd5e1',
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    minHeight: 90,
    borderWidth: 1,
    borderColor: '#dbe2ea',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#0f766e',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
