import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Check of het Hengselman@gmail.com is voor admin rechten
    const isAdmin = email.toLowerCase() === 'hengselman@gmail.com';
    
    // Maak een gebruikersdocument aan in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: email,
      createdAt: new Date().toISOString(),
      isAdmin: isAdmin,
      characters: []
    });
    
    return userCredential;
  }

  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            // Check of het Hengselman@gmail.com is voor admin rechten
            const isAdmin = user.email.toLowerCase() === 'hengselman@gmail.com' || data.isAdmin;
            setUserData({ ...data, isAdmin });
          } else {
            // Maak document aan als het niet bestaat
            const isAdmin = user.email.toLowerCase() === 'hengselman@gmail.com';
            await setDoc(doc(db, 'users', user.uid), {
              email: user.email,
              createdAt: new Date().toISOString(),
              isAdmin: isAdmin,
              characters: []
            });
            setUserData({ email: user.email, isAdmin, characters: [] });
          }
        } catch (error) {
          console.error('Fout bij ophalen gebruikersdata:', error);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    signup,
    login,
    logout,
    isAdmin: userData?.isAdmin || false
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 