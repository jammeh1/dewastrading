import React, { useState } from 'react';
import { supabaseAdmin as supabase } from '@/lib/supabase';
import { Droplets, Shield, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (session: any) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      onLogin(data.session);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1f16] via-[#1a3a2a] to-[#0d2a3a] flex items-center justify-center px-4">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, #7CB342 0%, transparent 50%), 
                          radial-gradient(circle at 75% 75%, #0077BE 0%, transparent 50%)`
      }} />

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <img
                src="https://d64gsuwffb70l.cloudfront.net/6891fba9e84754e0b0fc9f86_1768205885796_f2d4cfcb.jpg"
                alt="Bati-Ngalun"
                className="h-20 w-auto bg-white rounded-2xl p-2 shadow-2xl"
              />
              <div className="absolute -top-1 -right-1 bg-[#0077BE] rounded-full p-1">
                <Shield className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">BATI-NGALUN</h1>
          <p className="text-[#7CB342] text-sm font-medium mt-1">Admin Control Panel</p>
          <p className="text-gray-400 text-xs mt-2">Authorized personnel only</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Droplets className="h-5 w-5 text-[#0077BE]" />
            <h2 className="text-white font-semibold text-lg">Sign In</h2>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bati-ngalun.com"
                required
                className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0077BE] focus:bg-white/15 transition-all"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:border-[#0077BE] focus:bg-white/15 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#1a5f2a] to-[#0077BE] text-white font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  Access Dashboard
                </>
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 text-xs mt-6">
            Secure admin access · Bati-Ngalun Company Limited
          </p>
        </div>

        <p className="text-center text-gray-600 text-xs mt-4">
          This panel is not publicly accessible.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
