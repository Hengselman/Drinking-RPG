import { motion } from 'framer-motion';
import { X, BookOpen } from 'lucide-react';
import { GAME_RULES } from '../data/gameData';

export default function Rules({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="pixel-card max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <BookOpen className="w-6 h-6 mr-3 text-yellow-400" />
            <h2 className="font-pixel text-2xl text-yellow-400">
              {GAME_RULES.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="pixel-button bg-red-600 hover:bg-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {GAME_RULES.rules.map((rule, index) => (
            <motion.div
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-700 p-4 pixel-borders"
            >
              <p className="font-pixel text-sm text-white">
                {rule}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="pixel-button"
          >
            Begrepen!
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
} 