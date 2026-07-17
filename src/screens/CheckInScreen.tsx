import React, { useEffect, useRef, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { CameraView, Camera } from 'expo-camera';
import * as Location from 'expo-location';
import { useVisitContext } from '../context/VisitContext';

type Props = NativeStackScreenProps<RootStackParamList, 'CheckIn'>;

export default function CheckInScreen({ navigation, route }: Props) {
  const { checkInVisit } = useVisitContext();
  const cameraRef = useRef<any>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [location, setLocation] = useState<{ latitude: number; longitude: number; accuracy?: number } | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // En SDK moderno la función sigue estando en el objeto Camera estático o se pide directamente
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      } catch (e) {
        console.warn('Error pidiendo permiso de cámara', e);
        setHasPermission(false);
      }

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso de ubicación', 'No se pudo obtener acceso a la ubicación.');
          return;
        }

        const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setLocation({
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
          accuracy: current.coords.accuracy ?? undefined,
        });
      } catch (e) {
        console.warn('Error obteniendo ubicación', e);
      }
    })();
  }, []);

  const takePhoto = async () => {
    if (hasPermission !== true) {
      const result = await Camera.requestCameraPermissionsAsync();
      setHasPermission(result.status === 'granted');
      if (result.status !== 'granted') {
        Alert.alert('Permiso de cámara', 'Se requiere acceso a la cámara para tomar evidencia.');
        return;
      }
    }

    if (!location) {
      Alert.alert('Ubicación', 'No se pudo recuperar la ubicación actual.');
      return;
    }

    if (!cameraRef.current) {
      Alert.alert('Cámara', 'La cámara no está lista. Intenta de nuevo.');
      return;
    }

    try {
      // Tomar foto con la nueva API CameraView
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.6 });
      setPhotoUri(photo.uri);
    } catch (e) {
      console.warn('Error al tomar la foto', e);
      Alert.alert('Error', 'No se pudo tomar la foto.');
    }
  };

  const handleConfirm = () => {
    if (!location || !photoUri) {
      Alert.alert('Datos incompletos', 'Captura la foto y verifica la ubicación antes de continuar.');
      return;
    }

    checkInVisit(route.params.visitId, location, photoUri);
    navigation.goBack();
  };

  if (hasPermission === null) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#64748b' }}>Cargando módulos de cámara y GPS...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check-In de visita</Text>
      <Text style={styles.subtitle}>Captura la ubicación y una foto de evidencia.</Text>

      <View style={styles.cameraBox}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.camera} />
        ) : hasPermission ? (
          <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
        ) : (
          <View style={[styles.camera, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' }]}>
            <Text style={{ color: '#fff', paddingHorizontal: 20, textAlign: 'center' }}>
              Permiso de cámara denegado o no disponible.
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (photoUri) {
            setPhotoUri(null);
            return;
          }
          void takePhoto();
        }}
      >
        <Text style={styles.buttonText}>{photoUri ? 'Volver a tomar foto' : 'Capturar foto'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => setFacing((current) => (current === 'back' ? 'front' : 'back'))}
      >
        <Text style={styles.buttonText}>Cambiar cámara</Text>
      </TouchableOpacity>

      <Text style={styles.info}>
        Ubicación: {location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 'Obteniendo...'}
      </Text>
      <Text style={styles.info}>Foto: {photoUri ? 'Capturada' : 'Pendiente'}</Text>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmButtonText}>Confirmar Check-In</Text>
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
  cameraBox: {
    height: 260,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: '#0f172a',
  },
  camera: {
    flex: 1,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  secondaryButton: {
    backgroundColor: '#64748b',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  info: {
    color: '#334155',
    marginTop: 8,
  },
  confirmButton: {
    marginTop: 12,
    backgroundColor: '#0f766e',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});