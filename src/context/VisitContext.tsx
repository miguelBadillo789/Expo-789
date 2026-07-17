import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Visit {
  id: string;
  clientName: string;
  company: string;
  address: string;
  status: 'pending' | 'checked_in' | 'checked_out';
  scheduledAt: string;
  priority: 'Alta' | 'Media' | 'Baja';
  syncStatus: 'pending_sync' | 'synced';
  notes?: string;
  checkInTime?: string;
  checkOutTime?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  photoUri?: string;
  signatureUri?: string;
  rating?: number;
}

export interface VisitContextType {
  visits: Visit[];
  isOffline: boolean;
  isSyncing: boolean;
  lastSyncAt?: string;
  syncData: () => Promise<void>;
  checkInVisit: (
    visitId: string,
    coordinates: { latitude: number; longitude: number; accuracy?: number },
    photoUri: string,
  ) => void;
  checkOutVisit: (visitId: string, signatureUri: string, rating: number, notes: string) => void;
  getVisitById: (visitId: string) => Visit | undefined;
}

const defaultVisits: Visit[] = [
  {
    id: 'vis-001',
    clientName: 'María González',
    company: 'Pinturas del Norte',
    address: 'Av. Central 123',
    status: 'pending',
    scheduledAt: '2026-07-16T09:00:00.000Z',
    priority: 'Alta',
    syncStatus: 'pending_sync',
    notes: 'Revisión de stock y firma de contrato.',
  },
  {
    id: 'vis-002',
    clientName: 'Luis Ortega',
    company: 'Soluciones Móviles',
    address: 'Calle Comercio 45',
    status: 'pending',
    scheduledAt: '2026-07-16T11:30:00.000Z',
    priority: 'Media',
    syncStatus: 'pending_sync',
    notes: 'Visita de seguimiento mensual.',
  },
  {
    id: 'vis-003',
    clientName: 'Ana Torres',
    company: 'Logística Verde',
    address: 'Ruta 7 km 12',
    status: 'pending',
    scheduledAt: '2026-07-16T15:00:00.000Z',
    priority: 'Baja',
    syncStatus: 'pending_sync',
    notes: 'Confirmación de entrega pendiente.',
  },
];

const VisitContext = createContext<VisitContextType | undefined>(undefined);
const STORAGE_KEY = '@fieldapp:visits';

export function VisitProvider({ children }: { children: ReactNode }) {
  const [visits, setVisits] = useState<Visit[]>(defaultVisits);
  const [isOffline, setIsOffline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncAt, setLastSyncAt] = useState<string | undefined>();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadVisits = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored && isMounted) {
          const parsed = JSON.parse(stored) as Visit[];
          setVisits(parsed);
        }
      } catch (error) {
        console.warn('No se pudieron cargar las visitas', error);
      } finally {
        if (isMounted) {
          setIsHydrated(true);
        }
      }
    };

    loadVisits();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(visits)).catch((error) => {
      console.warn('No se pudo persistir el estado de visitas', error);
    });
  }, [isHydrated, visits]);

  const syncData = async () => {
    setIsSyncing(true);
    setIsOffline(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setVisits((current) =>
      current.map((visit) => ({
        ...visit,
        syncStatus: 'synced' as const,
      })),
    );
    setLastSyncAt(new Date().toISOString());
    setIsSyncing(false);
    setIsOffline(false);
  };

  const checkInVisit = (
    visitId: string,
    coordinates: { latitude: number; longitude: number; accuracy?: number },
    photoUri: string,
  ) => {
    setVisits((current) =>
      current.map((visit) =>
        visit.id === visitId
          ? {
              ...visit,
              status: 'checked_in' as const,
              coordinates,
              photoUri,
              syncStatus: 'pending_sync' as const,
              checkInTime: new Date().toISOString(),
            }
          : visit,
      ),
    );
  };

  const checkOutVisit = (visitId: string, signatureUri: string, rating: number, notes: string) => {
    setVisits((current) =>
      current.map((visit) =>
        visit.id === visitId
          ? {
              ...visit,
              status: 'checked_out' as const,
              signatureUri,
              rating,
              notes,
              syncStatus: 'pending_sync' as const,
              checkOutTime: new Date().toISOString(),
            }
          : visit,
      ),
    );
  };

  const getVisitById = (visitId: string) => visits.find((visit) => visit.id === visitId);

  const value = useMemo<VisitContextType>(
    () => ({
      visits,
      isOffline,
      isSyncing,
      lastSyncAt,
      syncData,
      checkInVisit,
      checkOutVisit,
      getVisitById,
    }),
    [visits, isOffline, isSyncing, lastSyncAt],
  );

  return <VisitContext.Provider value={value}>{children}</VisitContext.Provider>;
}

export function useVisitContext() {
  const context = useContext(VisitContext);
  if (!context) {
    throw new Error('useVisitContext debe usarse dentro de VisitProvider');
  }
  return context;
}
