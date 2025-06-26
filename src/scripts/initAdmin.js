// Admin script - Voer dit uit in de browser console
// Nadat je bent ingelogd met Hengselman@gmail.com

import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { auth } from '../firebase';

// Functie om admin te worden
async function makeAdmin() {
  try {
    // Haal huidige gebruiker op
    const user = auth.currentUser;
    if (!user) {
      console.log('Je moet eerst inloggen!');
      return;
    }
    
    console.log('Gebruiker ID:', user.uid);
    console.log('Email:', user.email);
    
    // Maak gebruiker admin
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      createdAt: new Date().toISOString(),
      isAdmin: true,
      characters: []
    }, { merge: true });
    
    console.log('✅ Je bent nu admin!');
    console.log('🔄 Refresh de pagina om de admin panel te zien.');
    
  } catch (error) {
    console.error('❌ Fout bij admin maken:', error);
  }
}

// Functie om admin status te controleren
async function checkAdminStatus() {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.log('Je moet eerst inloggen!');
      return;
    }
    
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      const isAdmin = userDoc.data().isAdmin || false;
      console.log('Admin status:', isAdmin ? '✅ JA' : '❌ NEE');
    } else {
      console.log('Gebruiker document niet gevonden');
    }
  } catch (error) {
    console.error('Fout bij controleren admin status:', error);
  }
}

console.log('🍺 Drinking RPG Admin Script geladen!');
console.log('Gebruik: makeAdmin() om admin te worden');
console.log('Gebruik: checkAdminStatus() om status te controleren');