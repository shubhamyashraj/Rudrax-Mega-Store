import React, { createContext, useContext, useState, useEffect } from 'react';
import { Batch } from '../models/types';
import { db, handleFirestoreError, OperationType } from '../firebase/firebase';
import { collection, onSnapshot, setDoc, deleteDoc, doc } from 'firebase/firestore';

interface InventoryContextType {
  batches: Batch[];
  addBatch: (batch: Omit<Batch, 'isActive'>) => Promise<void>;
  deleteBatch: (batchId: string) => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [batches, setBatches] = useState<Batch[]>([]);

  // Batches Real-time Snapshot
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'batches'), (snapshot) => {
      const items: Batch[] = [];
      snapshot.forEach(docSnap => {
        items.push(docSnap.data() as Batch);
      });
      setBatches(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'batches');
    });
    return () => unsub();
  }, []);

  const addBatch = async (b: Omit<Batch, 'isActive'>) => {
    const newBatch: Batch = {
      ...b,
      batchId: b.batchId || b.id,
      reservedQty: b.reservedQty || 0,
      damagedQty: b.damagedQty || 0,
      returnedQty: b.returnedQty || 0,
      availableQty: b.availableQty ?? b.quantity,
      status: b.status || 'Fresh',
      isActive: false
    };
    try {
      await setDoc(doc(db, 'batches', newBatch.id), newBatch);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `batches/${newBatch.id}`);
    }
  };

  const deleteBatch = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'batches', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `batches/${id}`);
    }
  };

  return (
    <InventoryContext.Provider value={{ batches, addBatch, deleteBatch }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) throw new Error('useInventory must be used within InventoryProvider');
  return context;
}
