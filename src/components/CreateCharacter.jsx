import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { CHARACTER_CLASSES, HATS } from '../data/gameData';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateCharacter() {
  const { slotIndex } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [characterName, setCharacterName] = useState('');
  const [selectedClass, setSelectedClass] = useState('BARBAAR');
  const [loading, setLoading] = useState(false);

  async function handleCreateCharacter() {
    if (!characterName.trim()) {
      toast.error('Vul een naam in voor je karakter');
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      let userData = userDoc.exists() ? userDoc.data() : {};
      
      // Zorg ervoor dat characters array bestaat
      if (!userData.characters) {
        userData.characters = [];
      }
      
      const characters = userData.characters;

      const newCharacter = {
        name: characterName.trim(),
        class: CHARACTER_CLASSES[selectedClass],
        hat: HATS.VIKING, // Start met gratis Viking helm
        xp: 0,
        coins: 100, // Start met 100 munten
        level: 1,
        inventory: [],
        equipped: {
          hat: HATS.VIKING,
          armor: null,
          boots: null,
          gloves: null,
          accessory: null
        },
        stats: { ...CHARACTER_CLASSES[selectedClass].baseStats },
        createdAt: new Date().toISOString()
      };

      characters[parseInt(slotIndex)] = newCharacter;

      await setDoc(userRef, {
        email: currentUser.email,
        createdAt: userData.createdAt || new Date().toISOString(),
        isAdmin: userData.isAdmin || false,
        characters: characters
      }, { merge: true });

      toast.success('Karakter aangemaakt!');
      navigate(`/room/${slotIndex}`);
    } catch (error) {
      console.error('Error creating character:', error);
      toast.error('Fout bij aanmaken karakter');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 p-2 sm:p-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6 sm:mb-8"
        >
          <button
            onClick={() => navigate('/characters')}
            className="pixel-button mb-4 inline-flex items-center text-xs sm:text-sm"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Terug
          </button>
          <h1 className="font-pixel text-2xl sm:text-3xl text-yellow-400">
            NIEUW KARAKTER
          </h1>
          <p className="font-pixel text-xs sm:text-sm text-gray-400">
            Slot {parseInt(slotIndex) + 1}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Character Preview */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="pixel-card"
          >
            <h2 className="font-pixel text-lg text-white mb-4">Voorvertoning</h2>
            <div className="text-center">
              <div className="text-4xl sm:text-6xl mb-4">
                {CHARACTER_CLASSES[selectedClass]?.pixelArt || '👤'}
              </div>
              <h3 className="font-pixel text-lg text-white mb-2">
                {characterName || 'Naamloos'}
              </h3>
              <p className="font-pixel text-sm text-gray-400 mb-4">
                {CHARACTER_CLASSES[selectedClass]?.name}
              </p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-slate-700 p-2">
                  <p className="text-red-400">Alcohol</p>
                  <p className="text-white">{CHARACTER_CLASSES[selectedClass]?.baseStats.alcoholTolerance}</p>
                </div>
                <div className="bg-slate-700 p-2">
                  <p className="text-blue-400">Maag</p>
                  <p className="text-white">{CHARACTER_CLASSES[selectedClass]?.baseStats.stomachCapacity}</p>
                </div>
                <div className="bg-slate-700 p-2">
                  <p className="text-green-400">Energie</p>
                  <p className="text-white">{CHARACTER_CLASSES[selectedClass]?.baseStats.energy}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Character Creation Form */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Name Input */}
            <div>
              <label className="block font-pixel text-xs sm:text-sm text-white mb-2">
                Karakter Naam
              </label>
              <input
                type="text"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border-2 border-slate-600 text-white font-pixel text-xs sm:text-sm"
                placeholder="Jouw helden naam"
                maxLength={20}
              />
            </div>

            {/* Class Selection */}
            <div>
              <label className="block font-pixel text-xs sm:text-sm text-white mb-2">
                Kies je Class
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(CHARACTER_CLASSES).map(([key, charClass]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedClass(key)}
                    className={`p-3 text-left pixel-card transition-colors ${
                      selectedClass === key ? 'bg-blue-600' : 'hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-2">{charClass.pixelArt}</div>
                      <div>
                        <p className="font-pixel text-xs text-white">{charClass.name}</p>
                        <p className="font-pixel text-xs text-gray-400">{charClass.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Create Button */}
            <button
              onClick={handleCreateCharacter}
              disabled={loading || !characterName.trim()}
              className="w-full pixel-button flex items-center justify-center text-xs sm:text-sm"
            >
              <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              {loading ? 'Aanmaken...' : 'Karakter Aanmaken'}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}