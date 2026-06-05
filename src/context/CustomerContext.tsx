import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, ShippingAddress } from '../models/types';
import { useAuth } from './AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase/firebase';
import { doc, onSnapshot, collection, updateDoc } from 'firebase/firestore';

interface CustomerContextType {
  allUsers: UserProfile[];
  addresses: ShippingAddress[];
  loyaltyPoints: number;
  updateUserRole: (targetUid: string, targetRole: UserRole) => Promise<void>;
  addAddress: (addr: ShippingAddress) => void;
  setLoyaltyPoints: (points: number) => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(350);

  // Load Addresses & Points locally
  useEffect(() => {
    const localAddrs = localStorage.getItem('rdx_addrs_v1');
    const localPoints = localStorage.getItem('rdx_points_v1');

    if (localAddrs) {
      try {
        setAddresses(JSON.parse(localAddrs));
      } catch (e) {
        console.error("Address Hydration error: ", e);
      }
    }
    if (localPoints) {
      setLoyaltyPoints(Number(localPoints));
    }
  }, []);

  // Sync Loyalty points from database profile
  useEffect(() => {
    if (currentUser) {
      setLoyaltyPoints(currentUser.loyaltyPoints);
      localStorage.setItem('rdx_points_v1', String(currentUser.loyaltyPoints));
    }
  }, [currentUser]);

  // Synchronize Users for Admin dashboard
  useEffect(() => {
    if (!currentUser || (currentUser.role !== 'Admin' && currentUser.role !== 'SuperAdmin')) {
      setAllUsers([]);
      return;
    }

    const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      const uList: UserProfile[] = [];
      snapshot.forEach(docSnap => {
        uList.push(docSnap.data() as UserProfile);
      });
      setAllUsers(uList);
    }, (error) => {
      console.error("Failed to fetch user directory listing: ", error);
    });

    return () => unsub();
  }, [currentUser]);

  const updateUserRole = async (targetUid: string, targetRole: UserRole) => {
    if (!currentUser || currentUser.role !== 'SuperAdmin') {
      console.error("Unauthorized: Role modification requires SuperAdmin clearance.");
      return;
    }
    if (targetUid === currentUser.uid) {
      console.error("SuperAdmin cannot modify their own role.");
      return;
    }
    const targetUser = allUsers.find(u => u.uid === targetUid);
    if (!targetUser) return;

    if (targetUser.role === 'SuperAdmin') {
      console.error("Constraint Violation: Cannot change another SuperAdmin's role.");
      return;
    }
    if (targetRole === 'SuperAdmin') {
      console.error("Constraint Violation: There can only be one SuperAdmin/Owner.");
      return;
    }

    const userDocRef = doc(db, 'users', targetUid);
    try {
      await updateDoc(userDocRef, {
        role: targetRole,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${targetUid}`);
    }
  };

  const addAddress = (addr: ShippingAddress) => {
    const updated = [addr, ...addresses];
    setAddresses(updated);
    localStorage.setItem('rdx_addrs_v1', JSON.stringify(updated));
  };

  return (
    <CustomerContext.Provider value={{
      allUsers,
      addresses,
      loyaltyPoints,
      updateUserRole,
      addAddress,
      setLoyaltyPoints
    }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const context = useContext(CustomerContext);
  if (!context) throw new Error('useCustomer must be used within CustomerProvider');
  return context;
}
