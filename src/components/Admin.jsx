import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, getDocs, doc, updateDoc, getDoc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from 'framer-motion';
import { ArrowLeft, Crown, Plus, Minus, Users, Home, Copy, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Admin() {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [xpAmount, setXpAmount] = useState(50);
  const [activeTab, setActiveTab] = useState('players'); // 'players' or 'rooms'

  useEffect(() => {
    if (!isAdmin) {
      navigate('/characters');
      return;
    }
    loadUsers();
    const unsubscribe = loadRooms();
    return () => unsubscribe?.();
  }, [isAdmin]);

  async function loadUsers() {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = [];
      
      usersSnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.characters && userData.characters.length > 0) {
          usersData.push({
            id: doc.id,
            ...userData,
            totalXp: userData.characters.reduce((sum, char) => sum + (char.xp || 0), 0)
          });
        }
      });
      
      setUsers(usersData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading users:', error);
      setLoading(false);
    }
  }

  function loadRooms() {
    // Real-time listener voor kamers
    const unsubscribe = onSnapshot(collection(db, 'rooms'), (snapshot) => {
      const roomsData = [];
      snapshot.forEach((doc) => {
        roomsData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setRooms(roomsData);
    });
    return unsubscribe;
  }

  async function addXpToCharacter(userId, slotIndex, amount) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.exists() ? userDoc.data() : {};
      const characters = userData.characters || [];
      
      if (characters[slotIndex]) {
        characters[slotIndex].xp = (characters[slotIndex].xp || 0) + amount;
        
        await setDoc(userRef, {
          email: userData.email,
          createdAt: userData.createdAt || new Date().toISOString(),
          isAdmin: userData.isAdmin || false,
          characters: characters
        }, { merge: true });
        
        // Update local state
        setUsers(users.map(user => {
          if (user.id === userId) {
            return {
              ...user,
              characters,
              totalXp: characters.reduce((sum, char) => sum + (char.xp || 0), 0)
            };
          }
          return user;
        }));
        
        toast.success(`${amount} XP toegevoegd aan ${characters[slotIndex].name}!`);
      }
    } catch (error) {
      console.error('Error adding XP:', error);
      toast.error('Fout bij toevoegen XP');
    }
  }

  async function updatePlayerWorldLevel(roomId, playerUid, newLevel) {
    try {
      const roomRef = doc(db, 'rooms', roomId);
      const roomDoc = await getDoc(roomRef);
      
      if (roomDoc.exists()) {
        const roomData = roomDoc.data();
        const updatedPlayers = roomData.players.map(player => {
          if (player.uid === playerUid) {
            return { ...player, worldLevel: newLevel };
          }
          return player;
        });
        
        await updateDoc(roomRef, { players: updatedPlayers });
        toast.success('World level bijgewerkt!');
      }
    } catch (error) {
      console.error('Error updating world level:', error);
      toast.error('Fout bij bijwerken world level');
    }
  }

  async function deleteRoom(roomId) {
    if (!confirm('Weet je zeker dat je deze kamer wilt verwijderen?')) {
      return;
    }
    
    try {
      await deleteDoc(doc(db, 'rooms', roomId));
      toast.success('Kamer verwijderd');
    } catch (error) {
      console.error('Error deleting room:', error);
      toast.error('Fout bij verwijderen kamer');
    }
  }

  async function copyRoomCode(code) {
    try {
      await navigator.clipboard.writeText(code);
      toast.success('Code gekopieerd!');
    } catch (error) {
      toast.error('Kon code niet kopiëren');
    }
  }

  if (!isAdmin) {
    return null;
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

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center mb-8"
        >
          <button
            onClick={() => navigate('/characters')}
            className="pixel-button inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug
          </button>
          <h1 className="font-pixel text-3xl text-yellow-400 flex items-center">
            <Crown className="w-8 h-8 mr-3" />
            ADMIN PANEL
          </h1>
          <div className="text-right">
            <p className="font-pixel text-sm text-gray-400">
              {activeTab === 'players' ? `${users.length} Spelers` : `${rooms.length} Kamers`}
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('players')}
            className={`pixel-button ${activeTab === 'players' ? 'bg-yellow-600' : ''}`}
          >
            <Users className="w-4 h-4 mr-2" />
            Spelers
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`pixel-button ${activeTab === 'rooms' ? 'bg-yellow-600' : ''}`}
          >
            <Home className="w-4 h-4 mr-2" />
            Kamers
          </button>
        </div>

        {activeTab === 'players' ? (
          <>
            {/* XP Controls */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="pixel-card mb-8"
            >
              <h2 className="font-pixel text-lg text-white mb-4">XP Toewijzen</h2>
              <div className="flex items-center gap-4">
                <div>
                  <label className="block font-pixel text-xs text-gray-400 mb-1">
                    XP Bedrag
                  </label>
                  <input
                    type="number"
                    value={xpAmount}
                    onChange={(e) => setXpAmount(parseInt(e.target.value) || 0)}
                    className="w-24 px-3 py-2 bg-slate-700 border-2 border-slate-600 text-white font-pixel text-sm"
                    min="1"
                    max="1000"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setXpAmount(Math.max(1, xpAmount - 10))}
                    className="pixel-button"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setXpAmount(xpAmount + 10)}
                    className="pixel-button"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Users List */}
            <div className="space-y-4">
              {users.map((user, userIndex) => (
                <motion.div
                  key={user.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: userIndex * 0.1 }}
                  className="pixel-card"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-pixel text-lg text-white">
                        {user.email}
                      </h3>
                      <p className="font-pixel text-xs text-gray-400">
                        {user.characters.filter(char => char).length} karakters • {user.totalXp} totaal XP
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                      className="pixel-button"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      {selectedUser === user.id ? 'Verberg' : 'Toon'} Karakters
                    </button>
                  </div>

                  {selectedUser === user.id && (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {user.characters.map((character, slotIndex) => (
                        character ? (
                          <div key={slotIndex} className="bg-slate-700 p-3">
                            <div className="text-center mb-3">
                              <div className="text-3xl mb-1">
                                {character.hat?.sprite || '👤'}
                              </div>
                              <h4 className="font-pixel text-xs text-white">
                                {character.name}
                              </h4>
                              <p className="font-pixel text-xs text-gray-400">
                                Level {Math.floor(character.xp / 100) + 1}
                              </p>
                              <p className="font-pixel text-xs text-yellow-400">
                                {character.xp} XP
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => addXpToCharacter(user.id, slotIndex, xpAmount)}
                                className="flex-1 pixel-button text-xs"
                              >
                                +{xpAmount}
                              </button>
                              <button
                                onClick={() => addXpToCharacter(user.id, slotIndex, -xpAmount)}
                                className="flex-1 pixel-button text-xs bg-red-600 hover:bg-red-700"
                              >
                                -{xpAmount}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div key={slotIndex} className="bg-slate-700 p-3 flex items-center justify-center">
                            <p className="font-pixel text-xs text-gray-500">Leeg</p>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {users.length === 0 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center pixel-card"
              >
                <p className="font-pixel text-lg text-gray-400">
                  Nog geen spelers gevonden
                </p>
              </motion.div>
            )}
          </>
        ) : (
          <>
            {/* Rooms List */}
            <div className="space-y-4">
              {rooms.map((room, roomIndex) => (
                <motion.div
                  key={room.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: roomIndex * 0.1 }}
                  className="pixel-card"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-pixel text-lg text-white">
                        {room.name}
                      </h3>
                      <div className="flex items-center gap-4">
                        <p className="font-pixel text-xs text-gray-400">
                          Code: <span className="text-yellow-400 tracking-wider">{room.code}</span>
                        </p>
                        <button
                          onClick={() => copyRoomCode(room.code)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="font-pixel text-xs text-gray-400">
                        {room.players?.length || 0} spelers
                      </p>
                    </div>
                    <button
                      onClick={() => deleteRoom(room.id)}
                      className="pixel-button bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Players in Room */}
                  {room.players && room.players.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {room.players.map((player) => (
                        <div key={player.uid} className="bg-slate-700 p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">
                              {player.character?.hat?.sprite || '👤'}
                            </span>
                            <div className="flex-1">
                              <h4 className="font-pixel text-xs text-white">
                                {player.character?.name}
                              </h4>
                              <p className="font-pixel text-xs text-gray-400">
                                Level {player.character?.level || 1}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="font-pixel text-xs text-gray-400">
                              World Level: {player.worldLevel || 1}
                            </span>
                            <div className="flex gap-1">
                              <button
                                onClick={() => updatePlayerWorldLevel(room.id, player.uid, (player.worldLevel || 1) - 1)}
                                disabled={(player.worldLevel || 1) <= 1}
                                className="p-1 bg-slate-600 hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <ChevronDown className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => updatePlayerWorldLevel(room.id, player.uid, (player.worldLevel || 1) + 1)}
                                className="p-1 bg-slate-600 hover:bg-slate-500"
                              >
                                <ChevronUp className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {rooms.length === 0 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center pixel-card"
              >
                <p className="font-pixel text-lg text-gray-400">
                  Nog geen kamers actief
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}