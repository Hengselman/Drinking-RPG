import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Login';
import CharacterSelection from './components/CharacterSelection';
import CreateCharacter from './components/CreateCharacter';
import Game from './components/Game';
import Admin from './components/Admin';
import PrivateRoute from './components/PrivateRoute';

// Globale admin functie voor browser console
window.makeAdmin = async () => {
  try {
    const { auth, db } = await import('./firebase');
    const { doc, setDoc } = await import('firebase/firestore');
    
    const user = auth.currentUser;
    if (!user) {
      console.log('❌ Je moet eerst inloggen!');
      return;
    }
    
    console.log('👤 Gebruiker:', user.email);
    console.log('🆔 UID:', user.uid);
    
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
};

window.checkAdminStatus = async () => {
  try {
    const { auth, db } = await import('./firebase');
    const { doc, getDoc } = await import('firebase/firestore');
    
    const user = auth.currentUser;
    if (!user) {
      console.log('❌ Je moet eerst inloggen!');
      return;
    }
    
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      const isAdmin = userDoc.data().isAdmin || false;
      console.log('👑 Admin status:', isAdmin ? '✅ JA' : '❌ NEE');
    } else {
      console.log('📄 Gebruiker document niet gevonden');
    }
  } catch (error) {
    console.error('❌ Fout bij controleren admin status:', error);
  }
};

console.log('🍺 Drinking RPG Admin Commands geladen!');
console.log('Gebruik: makeAdmin() om admin te worden');
console.log('Gebruik: checkAdminStatus() om status te controleren');

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '2px solid #fff',
              fontFamily: '"Press Start 2P", cursive',
              fontSize: '12px',
              padding: '16px',
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/characters" element={
            <PrivateRoute>
              <CharacterSelection />
            </PrivateRoute>
          } />
          <Route path="/create-character/:slotIndex" element={
            <PrivateRoute>
              <CreateCharacter />
            </PrivateRoute>
          } />
          <Route path="/game/:slotIndex" element={
            <PrivateRoute>
              <Game />
            </PrivateRoute>
          } />
          <Route path="/admin" element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
