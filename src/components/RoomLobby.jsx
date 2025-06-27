import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot, 
  collection, 
  query, 
  where, 
  getDocs,
  deleteDoc,
  updateDoc 
} from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Users, Copy, LogOut, Crown, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RoomLobby() {
  const { currentUser, isAdmin } = useAuth();
  const { slotIndex } = useParams();
  const navigate = useNavigate();
  
  const [character, setCharacter] = useState(null);
  const [showJoinRoom, setShowJoinRoom] = useState(true);
  const [roomCode, setRoomCode] = useState('');
  const [roomName, setRoomName] = useState('');
  const [currentRoom, setCurrentRoom] = useState(null);
  const [roomPlayers, setRoomPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    loadCharacter();
  }, []);

  useEffect(() => {
    if (currentRoom) {
      // Luister naar wijzigingen in de kamer
      const unsubscribe = onSnapshot(doc(db, 'rooms', currentRoom.id), (doc) => {
        if (doc.exists()) {
          const roomData = doc.data();
          setCurrentRoom({ id: doc.id, ...roomData });
          setRoomPlayers(roomData.players || []);
        } else {
          // Kamer is verwijderd
          toast.error('Kamer is gesloten');
          setCurrentRoom(null);
          setShowJoinRoom(true);
        }
      });

      return () => unsubscribe();
    }
  }, [currentRoom?.id]);

  async function loadCharacter() {
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const char = userData.characters?.[slotIndex];
        if (char) {
          setCharacter(char);
        } else {
          navigate('/characters');
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading character:', error);
      setLoading(false);
    }
  }

  function generateRoomCode() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return code;
  }

  async function createRoom() {
    if (!roomName.trim()) {
      toast.error('Voer een kamernaam in');
      return;
    }

    setJoining(true);
    try {
      let code;
      let exists = true;
      
      // Genereer unieke code
      while (exists) {
        code = generateRoomCode();
        const roomQuery = query(collection(db, 'rooms'), where('code', '==', code));
        const snapshot = await getDocs(roomQuery);
        exists = !snapshot.empty;
      }

      // Maak nieuwe kamer
      const roomRef = doc(collection(db, 'rooms'));
      const roomData = {
        name: roomName,
        code: code,
        createdBy: currentUser.uid,
        createdAt: new Date().toISOString(),
        players: [{
          uid: currentUser.uid,
          characterSlot: parseInt(slotIndex),
          character: character,
          worldLevel: 1,
          joinedAt: new Date().toISOString()
        }]
      };

      await setDoc(roomRef, roomData);
      
      setCurrentRoom({ id: roomRef.id, ...roomData });
      setShowJoinRoom(false);
      toast.success(`Kamer "${roomName}" aangemaakt!`);
    } catch (error) {
      console.error('Error creating room:', error);
      toast.error('Fout bij aanmaken kamer');
    } finally {
      setJoining(false);
    }
  }

  async function joinRoom() {
    if (roomCode.length !== 4) {
      toast.error('Voer een 4-letterige code in');
      return;
    }

    setJoining(true);
    try {
      // Zoek kamer met deze code
      const roomQuery = query(collection(db, 'rooms'), where('code', '==', roomCode.toUpperCase()));
      const snapshot = await getDocs(roomQuery);
      
      if (snapshot.empty) {
        toast.error('Kamer niet gevonden');
        setJoining(false);
        return;
      }

      const roomDoc = snapshot.docs[0];
      const roomData = roomDoc.data();
      
      // Check of speler al in de kamer zit
      const alreadyInRoom = roomData.players?.some(p => p.uid === currentUser.uid);
      
      if (!alreadyInRoom) {
        // Voeg speler toe aan kamer
        const updatedPlayers = [...(roomData.players || []), {
          uid: currentUser.uid,
          characterSlot: parseInt(slotIndex),
          character: character,
          worldLevel: 1,
          joinedAt: new Date().toISOString()
        }];

        await updateDoc(doc(db, 'rooms', roomDoc.id), {
          players: updatedPlayers
        });
      }

      setCurrentRoom({ id: roomDoc.id, ...roomData });
      setShowJoinRoom(false);
      toast.success(`Je bent toegevoegd aan "${roomData.name}"`);
    } catch (error) {
      console.error('Error joining room:', error);
      toast.error('Fout bij joinen kamer');
    } finally {
      setJoining(false);
    }
  }

  async function leaveRoom() {
    if (!currentRoom) return;

    try {
      const roomRef = doc(db, 'rooms', currentRoom.id);
      const roomDoc = await getDoc(roomRef);
      
      if (roomDoc.exists()) {
        const roomData = roomDoc.data();
        const updatedPlayers = roomData.players.filter(p => p.uid !== currentUser.uid);
        
        if (updatedPlayers.length === 0) {
          // Verwijder lege kamer
          await deleteDoc(roomRef);
        } else {
          // Update spelers lijst
          await updateDoc(roomRef, {
            players: updatedPlayers
          });
        }
      }

      setCurrentRoom(null);
      setShowJoinRoom(true);
      toast.success('Je hebt de kamer verlaten');
    } catch (error) {
      console.error('Error leaving room:', error);
      toast.error('Fout bij verlaten kamer');
    }
  }

  async function copyRoomCode() {
    if (currentRoom?.code) {
      try {
        await navigator.clipboard.writeText(currentRoom.code);
        toast.success('Code gekopieerd!');
      } catch (error) {
        toast.error('Kon code niet kopiëren');
      }
    }
  }

  function goToWorldLevel(level) {
    navigate(`/game/${slotIndex}?worldLevel=${level}`);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="pixel-card">
          <p className="font-pixel text-lg">Laden...</p>
        </div>
      </div>
    );
  }

  if (showJoinRoom) {
    return (
      <div className="min-h-screen bg-slate-900 p-2 sm:p-4">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-6 sm:mb-8"
          >
            <h1 className="font-pixel text-2xl sm:text-3xl text-yellow-400 mb-2">
              KAMER KIEZEN
            </h1>
            <p className="font-pixel text-xs sm:text-sm text-gray-400">
              Maak een nieuwe kamer of join met een code
            </p>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="pixel-card mb-4"
          >
            <h2 className="font-pixel text-lg mb-4 text-center">Nieuwe Kamer</h2>
            <input
              type="text"
              placeholder="Kamernaam..."
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full pixel-input mb-4"
              maxLength={20}
            />
            <button
              onClick={createRoom}
              disabled={joining}
              className="w-full pixel-button"
            >
              {joining ? 'Aanmaken...' : 'Kamer Maken'}
            </button>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="pixel-card"
          >
            <h2 className="font-pixel text-lg mb-4 text-center">Join Kamer</h2>
            <input
              type="text"
              placeholder="4-letterige code..."
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="w-full pixel-input mb-4 text-center text-2xl tracking-widest"
              maxLength={4}
            />
            <button
              onClick={joinRoom}
              disabled={joining}
              className="w-full pixel-button"
            >
              {joining ? 'Joinen...' : 'Join Kamer'}
            </button>
          </motion.div>

          <button
            onClick={() => navigate('/characters')}
            className="mt-4 w-full pixel-button text-xs"
          >
            Terug naar karakters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <h1 className="font-pixel text-2xl sm:text-3xl text-yellow-400 mb-2">
            {currentRoom?.name}
          </h1>
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="font-pixel text-lg text-gray-400">
              Code: <span className="text-white tracking-widest">{currentRoom?.code}</span>
            </span>
            <button
              onClick={copyRoomCode}
              className="pixel-button p-2"
              title="Kopieer code"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {roomPlayers.map((player, index) => {
            const isCurrentPlayer = player.uid === currentUser.uid;
            const playerWorldLevel = player.worldLevel || 1;
            
            return (
              <motion.div
                key={player.uid}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`pixel-card ${isCurrentPlayer ? 'border-yellow-400' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {player.character?.hat?.sprite || '👤'}
                    </span>
                    <div>
                      <h3 className="font-pixel text-sm">
                        {player.character?.name}
                      </h3>
                      <p className="font-pixel text-xs text-gray-400">
                        Level {player.character?.level}
                      </p>
                    </div>
                  </div>
                  {player.uid === currentRoom?.createdBy && (
                    <Crown className="w-4 h-4 text-yellow-400" />
                  )}
                </div>
                
                <div className="font-pixel text-xs text-center p-2 bg-slate-800 rounded">
                  World Level: {playerWorldLevel}
                </div>

                {isCurrentPlayer && playerWorldLevel > 0 && (
                  <button
                    onClick={() => goToWorldLevel(playerWorldLevel)}
                    className="w-full mt-2 pixel-button text-xs flex items-center justify-center gap-1"
                  >
                    Ga naar Level {playerWorldLevel}
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="flex gap-2">
          <button
            onClick={leaveRoom}
            className="pixel-button flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Verlaat Kamer
          </button>
        </div>
      </div>
    </div>
  );
}