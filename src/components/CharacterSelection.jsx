import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from 'framer-motion';
import { Plus, User, Crown, Trash2, BookOpen, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Rules from './Rules';

export default function CharacterSelection() {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRules, setShowRules] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [characterToDelete, setCharacterToDelete] = useState(null);

  useEffect(() => {
    loadCharacters();
  }, []);

  async function loadCharacters() {
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setCharacters(userData.characters || []);
      } else {
        setCharacters([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading characters:', error);
      setCharacters([]);
      setLoading(false);
    }
  }

  function handleSlotClick(slotIndex) {
    const character = characters[slotIndex];
    if (character) {
      navigate(`/game/${slotIndex}`);
    } else {
      navigate(`/create-character/${slotIndex}`);
    }
  }

  function openDeleteModal(slotIndex, character, e) {
    e.stopPropagation();
    setCharacterToDelete({ slotIndex, character });
    setShowDeleteModal(true);
  }

  function closeDeleteModal() {
    setShowDeleteModal(false);
    setCharacterToDelete(null);
  }

  async function confirmDeleteCharacter() {
    if (!characterToDelete) return;

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.exists() ? userDoc.data() : {};
      const updatedCharacters = [...(userData.characters || [])];
      
      updatedCharacters[characterToDelete.slotIndex] = null;
      
      await setDoc(userRef, {
        email: currentUser.email,
        createdAt: userData.createdAt || new Date().toISOString(),
        isAdmin: userData.isAdmin || false,
        characters: updatedCharacters
      }, { merge: true });
      
      setCharacters(updatedCharacters);
      toast.success('Karakter verwijderd!');
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting character:', error);
      toast.error('Fout bij verwijderen karakter');
    }
  }

  function handleAdminClick() {
    if (isAdmin) {
      navigate('/admin');
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

  return (
    <div className="min-h-screen bg-slate-900 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h1 className="font-pixel text-2xl sm:text-3xl text-yellow-400 mb-2 sm:mb-4">
            KIES JE KARAKTER
          </h1>
          <p className="font-pixel text-xs sm:text-sm text-gray-400 mb-4">
            Selecteer een save slot om te spelen
          </p>
          
          <div className="flex justify-center gap-2 mb-4">
            <button
              onClick={() => setShowRules(true)}
              className="pixel-button inline-flex items-center text-xs"
            >
              <BookOpen className="w-3 h-3 mr-1" />
              Regels
            </button>
            {isAdmin && (
              <button
                onClick={handleAdminClick}
                className="pixel-button inline-flex items-center text-xs"
              >
                <Crown className="w-3 h-3 mr-1" />
                Admin
              </button>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4 mb-6 sm:mb-8">
          {[0, 1, 2, 3, 4].map((slotIndex) => {
            const character = characters[slotIndex];
            return (
              <motion.div
                key={slotIndex}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: slotIndex * 0.1 }}
                onClick={() => handleSlotClick(slotIndex)}
                className="pixel-card cursor-pointer hover:bg-slate-700 transition-colors relative"
              >
                {character ? (
                  <div className="text-center">
                    <div className="text-2xl sm:text-4xl mb-1 sm:mb-2">
                      {character.hat?.sprite || '👤'}
                    </div>
                    <h3 className="font-pixel text-xs sm:text-sm text-white mb-1">
                      {character.name}
                    </h3>
                    <p className="font-pixel text-xs text-gray-400 mb-1 sm:mb-2">
                      Level {character.level}
                    </p>
                    <div className="flex justify-center space-x-1">
                      <span className="font-pixel text-xs text-yellow-400">
                        {character.xp} XP
                      </span>
                    </div>
                    
                    {/* Delete button */}
                    <button
                      onClick={(e) => openDeleteModal(slotIndex, character, e)}
                      className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 pixel-borders"
                      title="Verwijder karakter"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4 sm:py-8">
                    <Plus className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 text-gray-500" />
                    <p className="font-pixel text-xs text-gray-500">
                      Lege Slot
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && characterToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="pixel-card max-w-md w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-pixel text-lg text-red-400">Karakter Verwijderen</h3>
              <button
                onClick={closeDeleteModal}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">
                {characterToDelete.character.hat?.sprite || '👤'}
              </div>
              <p className="font-pixel text-white mb-2">
                Weet je zeker dat je <span className="text-yellow-400">{characterToDelete.character.name}</span> wilt verwijderen?
              </p>
              <p className="font-pixel text-xs text-gray-400">
                Dit kan niet ongedaan worden gemaakt!
              </p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={closeDeleteModal}
                className="flex-1 pixel-button text-xs"
              >
                Annuleren
              </button>
              <button
                onClick={confirmDeleteCharacter}
                className="flex-1 pixel-button text-xs bg-red-600 hover:bg-red-700"
              >
                Verwijderen
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <Rules isOpen={showRules} onClose={() => setShowRules(false)} />
    </div>
  );
}