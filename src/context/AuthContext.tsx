import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../models/types';
import { auth, db, handleFirestoreError, OperationType } from '../firebase/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User as FirebaseUser, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, onSnapshot, setDoc, updateDoc, query, collection, where, limit, getDocs } from 'firebase/firestore';

interface AuthContextType {
  currentUser: UserProfile | null;
  authLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string, phone: string) => Promise<void>;
  resetPasswordLink: (email: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  updateUserProfile: (profileData: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [fbUser, setFbUser] = useState<FirebaseUser | null>(null);
  const [dbProfile, setDbProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFbUser(user);
      if (!user) {
        setDbProfile(null);
        setAuthLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Listen to Firestore Profile document
  useEffect(() => {
    if (!fbUser) return;

    const userDocRef = doc(db, 'users', fbUser.uid);
    const unsub = onSnapshot(userDocRef, async (docSnap) => {
      if (docSnap.exists()) {
        setDbProfile(docSnap.data() as UserProfile);
      } else {
        // Find if a SuperAdmin exists
        let assignedRole: UserRole = 'Customer';
        try {
          const q = query(collection(db, 'users'), where('role', '==', 'SuperAdmin'), limit(1));
          const snapshot = await getDocs(q);
          if (snapshot.empty) {
            assignedRole = 'SuperAdmin';
          }
        } catch (e) {
          console.error("SuperAdmin search on setup failed:", e);
        }

        const newProfile: UserProfile = {
          uid: fbUser.uid,
          email: fbUser.email || '',
          name: fbUser.displayName || 'Valued Customer',
          phone: fbUser.phoneNumber || '',
          role: assignedRole,
          loyaltyPoints: 350,
          photoURL: fbUser.photoURL || undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        try {
          await setDoc(userDocRef, newProfile);
          setDbProfile(newProfile);
        } catch (e) {
          console.error("Error writing initial profile:", e);
        }
      }
      setAuthLoading(false);
    }, (error) => {
      console.error("Profile sync exception:", error);
      setAuthLoading(false);
    });

    return () => unsub();
  }, [fbUser]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    setAuthLoading(true);
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error('Google Auth Failed:', e);
      setAuthLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    setAuthLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      setAuthLoading(false);
      throw e;
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string, phone: string) => {
    setAuthLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      let assignedRole: UserRole = 'Customer';
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'SuperAdmin'), limit(1));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          assignedRole = 'SuperAdmin';
        }
      } catch (e) {
        console.error("SuperAdmin search failed:", e);
      }

      const newProfile: UserProfile = {
        uid: cred.user.uid,
        email: email,
        name: name || 'Valued Customer',
        phone: phone || '',
        role: assignedRole,
        loyaltyPoints: 350,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', cred.user.uid), newProfile);
      setDbProfile(newProfile);
    } catch (e) {
      setAuthLoading(false);
      throw e;
    }
  };

  const resetPasswordLink = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (e) {
      throw e;
    }
  };

  const signOutUser = async () => {
    setAuthLoading(true);
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Sign-out Failed:', e);
      setAuthLoading(false);
    }
  };

  const updateUserProfile = async (profileData: Partial<UserProfile>) => {
    if (!fbUser) return;
    const userDocRef = doc(db, 'users', fbUser.uid);
    try {
      await updateDoc(userDocRef, {
        ...profileData,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${fbUser.uid}`);
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser: dbProfile,
      authLoading,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      resetPasswordLink,
      signOutUser,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
