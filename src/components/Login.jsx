import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Beer } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      setLoading(true);
      if (isSignup) {
        await signup(email, password);
        toast.success('Account aangemaakt! Welkom bij Drinking RPG!');
      } else {
        await login(email, password);
        toast.success('Welkom terug!');
      }
      navigate('/characters');
    } catch (error) {
      console.error('Auth error:', error);
      
      let errorMessage = isSignup ? 'Fout bij aanmaken account' : 'Fout bij inloggen';
      
      // Specifieke foutmeldingen
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Dit email adres is al in gebruik';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Wachtwoord moet minimaal 6 karakters zijn';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Ongeldig email adres';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'Gebruiker niet gevonden';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Verkeerd wachtwoord';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Te veel pogingen. Probeer het later opnieuw';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="pixel-card">
          <div className="flex items-center justify-center mb-8">
            <Beer className="w-12 h-12 text-yellow-400 mr-3" />
            <h1 className="font-pixel text-2xl text-yellow-400">
              DRINKING RPG
            </h1>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-pixel text-xs mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border-2 border-slate-600 text-white font-pixel text-xs"
                required
              />
            </div>
            
            <div>
              <label className="block font-pixel text-xs mb-2">
                Wachtwoord
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border-2 border-slate-600 text-white font-pixel text-xs"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full pixel-button"
            >
              {loading ? 'Even wachten...' : (isSignup ? 'Account maken' : 'Inloggen')}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="font-pixel text-xs text-blue-400 hover:text-blue-300"
            >
              {isSignup ? 'Al een account? Log in!' : 'Nog geen account? Maak er een!'}
            </button>
          </div>
          
          {/* Admin hint */}
          <div className="mt-4 text-center">
            <p className="font-pixel text-xs text-gray-500">
              Admin? Gebruik Hengselman@gmail.com
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}