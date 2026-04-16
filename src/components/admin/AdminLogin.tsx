import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Zap, Loader2, ArrowLeft } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);
    const fn = mode === 'login' ? signIn : signUp;
    const { error } = await fn(email, password);
    setLoading(false);
    if (error) setError(error);
    else if (mode === 'signup') {
      setInfo('Account created. Check your email to confirm, or sign in if confirmation is disabled.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1128] to-[#1e3a8a] flex items-center justify-center p-4">
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-white/80 hover:text-white text-sm"
      >
        <ArrowLeft className="h-4 w-4" /> Back to site
      </button>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="flex items-center gap-2 justify-center mb-2">
          <div className="h-10 w-10 rounded-lg bg-[#FFD60A] flex items-center justify-center">
            <Zap className="h-6 w-6 text-[#0A1128]" strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-extrabold text-[#0A1128]">DEWAS</div>
            <div className="text-[10px] tracking-widest text-[#FFD60A] font-semibold">ADMIN</div>
          </div>
        </div>
        <h1 className="text-2xl font-extrabold text-[#0A1128] text-center mb-1">
          {mode === 'login' ? 'Welcome back' : 'Create admin account'}
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          {mode === 'login' ? 'Sign in to manage your website' : 'Set up the first admin'}
        </p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/20 outline-none"
              placeholder="admin@dewastrading.gm"
            />
          </div>
          <div>
            <label className="text-sm font-semibold block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/20 outline-none"
              placeholder="••••••••"
            />
          </div>
          {error && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>}
          {info && <div className="text-green-700 text-sm bg-green-50 p-2 rounded">{info}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0A1128] hover:bg-[#1e3a8a] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        <div className="text-center text-sm text-gray-500 mt-6">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          <button
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setInfo(''); }}
            className="ml-1 text-[#0A1128] font-bold hover:text-[#FFD60A]"
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
