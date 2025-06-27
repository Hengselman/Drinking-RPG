import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { SHOP_ITEMS, HATS, calculateLevel, getXpForNextLevel, WORLD_LEVELS } from '../data/gameData';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Package, Crown, Zap, Coins, Target, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Game() {
  const { slotIndex } = useParams();
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const worldLevel = searchParams.get('worldLevel');
  const roomId = searchParams.get('roomId');
  
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showShop, setShowShop] = useState(false);
  const [showInventory, setShowInventory] = useState(false);

  useEffect(() => {
    loadCharacter();
  }, [slotIndex]);

  async function loadCharacter() {
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const characters = userData.characters || [];
        const char = characters[parseInt(slotIndex)];
        if (char) {
          setCharacter(char);
        } else {
          navigate('/characters');
        }
      } else {
        navigate('/characters');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading character:', error);
      setLoading(false);
    }
  }

  // Functie om terug te gaan naar de kamer
  function goBackToRoom() {
    if (roomId) {
      // Ga terug naar de specifieke kamer
      navigate(`/room/${slotIndex}?roomId=${roomId}`);
    } else {
      // Fallback naar normale room lobby
      navigate(`/room/${slotIndex}`);
    }
  }

  async function buyItem(item) {
    if (character.coins < item.price) {
      toast.error('Niet genoeg munten!');
      return;
    }

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.exists() ? userDoc.data() : {};
      const characters = userData.characters || [];
      
      const updatedCharacter = {
        ...character,
        coins: character.coins - item.price,
        inventory: [...character.inventory, item]
      };

      characters[parseInt(slotIndex)] = updatedCharacter;
      
      await setDoc(userRef, {
        email: currentUser.email,
        createdAt: userData.createdAt || new Date().toISOString(),
        isAdmin: userData.isAdmin || false,
        characters: characters
      }, { merge: true });
      
      setCharacter(updatedCharacter);
      toast.success(`${item.name} gekocht!`);
    } catch (error) {
      console.error('Error buying item:', error);
      toast.error('Fout bij kopen item');
    }
  }

  async function equipItem(item) {
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.exists() ? userDoc.data() : {};
      const characters = userData.characters || [];
      
      const updatedCharacter = {
        ...character,
        equipped: {
          ...character.equipped,
          [item.type]: item
        }
      };

      characters[parseInt(slotIndex)] = updatedCharacter;
      
      await setDoc(userRef, {
        email: currentUser.email,
        createdAt: userData.createdAt || new Date().toISOString(),
        isAdmin: userData.isAdmin || false,
        characters: characters
      }, { merge: true });
      
      setCharacter(updatedCharacter);
      toast.success(`${item.name} uitgerust!`);
    } catch (error) {
      console.error('Error equipping item:', error);
      toast.error('Fout bij uitrusten item');
    }
  }

  async function useItem(item, index) {
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.exists() ? userDoc.data() : {};
      const characters = userData.characters || [];
      
      // Remove item from inventory
      const updatedInventory = [...character.inventory];
      updatedInventory.splice(index, 1);
      
      const updatedCharacter = {
        ...character,
        inventory: updatedInventory
      };

      characters[parseInt(slotIndex)] = updatedCharacter;
      
      await setDoc(userRef, {
        email: currentUser.email,
        createdAt: userData.createdAt || new Date().toISOString(),
        isAdmin: userData.isAdmin || false,
        characters: characters
      }, { merge: true });
      
      setCharacter(updatedCharacter);
      
      // Show effect message based on item type
      if (item.type === 'real_item') {
        toast.success(`${item.name} gebruikt! ${item.description}`);
      } else if (item.type === 'penalty') {
        toast.success(`${item.name} gebruikt! ${item.description}`);
      } else if (item.effect) {
        toast.success(`${item.name} gebruikt! ${item.description}`);
      } else {
        toast.success(`${item.name} gebruikt!`);
      }
    } catch (error) {
      console.error('Error using item:', error);
      toast.error('Fout bij gebruiken item');
    }
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

  if (!character) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="pixel-card">
          <p className="font-pixel text-lg">Karakter niet gevonden</p>
        </div>
      </div>
    );
  }

  const currentLevel = calculateLevel(character.xp);
  const xpForNextLevel = getXpForNextLevel(character.xp);
  
  // Als er een world level is, toon de opdracht
  if (worldLevel) {
    const level = WORLD_LEVELS[worldLevel];
    if (!level) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
          <div className="pixel-card">
            <p className="font-pixel text-lg">Level niet gevonden</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-slate-900 p-2 sm:p-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-6"
          >
            <button
              onClick={goBackToRoom}
              className="pixel-button inline-flex items-center text-xs sm:text-sm mb-4"
            >
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Terug naar Lobby
            </button>
            
            <h1 className="font-pixel text-2xl sm:text-3xl text-yellow-400 text-center">
              World Level {level.id}
            </h1>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="pixel-card text-center"
          >
            <div className="text-6xl sm:text-8xl mb-4">
              {level.icon}
            </div>
            
            <h2 className="font-pixel text-xl sm:text-2xl text-white mb-2">
              {level.name}
            </h2>
            
            <p className="font-pixel text-sm sm:text-base text-gray-400 mb-6">
              {level.description}
            </p>
            
            <div className="bg-slate-700 p-4 rounded mb-6">
              <h3 className="font-pixel text-sm text-yellow-400 mb-2">Opdracht:</h3>
              <p className="font-pixel text-xs sm:text-sm text-white">
                {level.task}
              </p>
            </div>
            
            <div className="bg-slate-800 p-3 rounded">
              <p className="font-pixel text-xs text-gray-400">
                Vraag de admin om XP wanneer je de opdracht hebt voltooid!
              </p>
            </div>
            
            {/* Terug naar kamer knop */}
            <div className="mt-6">
              <button
                onClick={goBackToRoom}
                className="w-full pixel-button flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Terug naar Kamer
              </button>
            </div>
          </motion.div>

          {/* Character Stats Mini View */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 pixel-card"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{character.hat?.sprite || '👤'}</span>
                <div>
                  <p className="font-pixel text-sm text-white">{character.name}</p>
                  <p className="font-pixel text-xs text-gray-400">Level {currentLevel}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-pixel text-xs text-yellow-400">{character.xp} XP</p>
                <p className="font-pixel text-xs text-gray-400">{character.coins} 🪙</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Normale game view (zonder world level)
  return (
    <div className="min-h-screen bg-slate-900 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4"
        >
          <button
            onClick={goBackToRoom}
            className="pixel-button inline-flex items-center text-xs sm:text-sm"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Terug
          </button>
          <h1 className="font-pixel text-xl sm:text-2xl text-yellow-400">
            {character.name}
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowInventory(!showInventory)}
              className="pixel-button inline-flex items-center text-xs sm:text-sm"
            >
              <Package className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Inventory
            </button>
            <button
              onClick={() => setShowShop(!showShop)}
              className="pixel-button inline-flex items-center text-xs sm:text-sm"
            >
              <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Shop
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Character Display */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="lg:col-span-2"
          >
            <div className="pixel-card">
              <div className="text-center mb-6">
                <div className="text-6xl sm:text-8xl mb-4">
                  {character.class.pixelArt}
                </div>
                <h2 className="font-pixel text-lg sm:text-xl text-white mb-2">
                  {character.name}
                </h2>
                <p className="font-pixel text-xs sm:text-sm text-gray-400 mb-4">
                  {character.class.name} - Level {currentLevel}
                </p>
                
                {/* XP Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-yellow-400">{character.xp} XP</span>
                    <span className="text-gray-400">Level {currentLevel + 1} in {xpForNextLevel} XP</span>
                  </div>
                  <div className="w-full bg-slate-700 h-4 pixel-borders">
                    <div 
                      className="bg-yellow-400 h-full transition-all duration-300"
                      style={{ width: `${(character.xp % 100) / 100 * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Coins */}
                <div className="mb-4 flex justify-center items-center">
                  <Coins className="w-4 h-4 text-yellow-400 mr-2" />
                  <span className="font-pixel text-sm text-yellow-400">
                    {character.coins} Munten
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  <div className="bg-slate-700 p-2 sm:p-3">
                    <p className="font-pixel text-xs text-red-400">Alcohol</p>
                    <p className="font-pixel text-sm sm:text-lg text-white">{character.stats.alcoholTolerance}</p>
                  </div>
                  <div className="bg-slate-700 p-2 sm:p-3">
                    <p className="font-pixel text-xs text-blue-400">Maag</p>
                    <p className="font-pixel text-sm sm:text-lg text-white">{character.stats.stomachCapacity}</p>
                  </div>
                  <div className="bg-slate-700 p-2 sm:p-3">
                    <p className="font-pixel text-xs text-green-400">Energie</p>
                    <p className="font-pixel text-sm sm:text-lg text-white">{character.stats.energy}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Shop/Inventory Panel */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="space-y-4"
          >
            {showShop && (
              <div className="pixel-card">
                <h3 className="font-pixel text-lg text-yellow-400 mb-4 flex items-center">
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Shop
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {Object.values(SHOP_ITEMS).map((item) => (
                    <div key={item.id} className="bg-slate-700 p-2 sm:p-3 flex justify-between items-center">
                      <div className="flex-1">
                        <p className="font-pixel text-xs text-white">{item.name}</p>
                        <p className="font-pixel text-xs text-gray-400">{item.description}</p>
                        {item.realItem && (
                          <span className="font-pixel text-xs text-green-400">Echt item</span>
                        )}
                        {item.penalty && (
                          <span className="font-pixel text-xs text-red-400">Penalty</span>
                        )}
                      </div>
                      <button
                        onClick={() => buyItem(item)}
                        disabled={character.coins < item.price}
                        className="pixel-button text-xs disabled:opacity-50 ml-2"
                      >
                        {item.price} 🪙
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showInventory && (
              <div className="pixel-card">
                <h3 className="font-pixel text-lg text-yellow-400 mb-4 flex items-center">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Inventory
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {character.inventory.length === 0 ? (
                    <p className="font-pixel text-xs text-gray-400">Lege inventory</p>
                  ) : (
                    character.inventory.map((item, index) => (
                      <div key={index} className="bg-slate-700 p-2 sm:p-3 flex justify-between items-center">
                        <div className="flex-1">
                          <p className="font-pixel text-xs text-white">{item.name}</p>
                          <p className="font-pixel text-xs text-gray-400">{item.description}</p>
                          {item.realItem && (
                            <span className="font-pixel text-xs text-green-400">Echt item</span>
                          )}
                          {item.penalty && (
                            <span className="font-pixel text-xs text-red-400">Penalty</span>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            // Equipment items can be equipped, others are used
                            if (item.type === 'armor' || item.type === 'boots' || item.type === 'gloves' || item.type === 'accessory') {
                              equipItem(item);
                            } else {
                              useItem(item, index);
                            }
                          }}
                          className={`pixel-button text-xs ml-2 ${
                            item.type === 'armor' || item.type === 'boots' || item.type === 'gloves' || item.type === 'accessory'
                              ? 'bg-blue-600 hover:bg-blue-700'
                              : 'bg-green-600 hover:bg-green-700'
                          }`}
                        >
                          {item.type === 'armor' || item.type === 'boots' || item.type === 'gloves' || item.type === 'accessory' ? 'Equip' : 'Gebruik'}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}