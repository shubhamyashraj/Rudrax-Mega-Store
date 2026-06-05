import React, { createContext, useContext, useState, useEffect } from 'react';
import { SystemSettings } from '../models/types';
import { INITIAL_SETTINGS } from '../inventory/initialData';
import { db, handleFirestoreError, OperationType } from '../firebase/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

interface SettingsContextType {
  settings: SystemSettings;
  updateSettings: (newSettings: SystemSettings) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SystemSettings>(INITIAL_SETTINGS);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'config'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data() as SystemSettings);
      } else {
        setSettings(INITIAL_SETTINGS);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'settings/config');
    });
    return () => unsub();
  }, []);

  const updateSettings = async (newSettings: SystemSettings) => {
    try {
      await setDoc(doc(db, 'settings', 'config'), newSettings);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'settings/config');
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
}
