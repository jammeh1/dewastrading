import React, { useState, useEffect } from 'react';
import { supabaseAdmin as supabase } from '@/lib/supabase';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import { Loader2 } from 'lucide-react';

const Loader = () => (
  <div className="min-h-screen bg-[#0d1f16] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <img
        src="https://d64gsuwffb70l.cloudfront.net/6891fba9e84754e0b0fc9f86_1768205885796_f2d4cfcb.jpg"
        alt="Bati-Ngalun"
        className="h-16 w-auto bg-white rounded-xl p-1.5 animate-pulse"
      />
      <Loader2 className="h-6 w-6 text-[#0077BE] animate-spin" />
      <p className="text-gray-400 text-sm">Loading admin panel...</p>
    </div>
  </div>
);

const AdminPage: React.FC = () => {
  // undefined = still checking, null = not logged in, object = logged in
  const [session, setSession] = useState<any>(undefined);

  useEffect(() => {
    // Check once on mount — single source of truth
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
    });
  }, []);

  const handleLogin = (newSession: any) => {
    setSession(newSession);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (session === undefined) return <Loader />;
  if (session === null) return <AdminLogin onLogin={handleLogin} />;
  return <AdminDashboard onLogout={handleLogout} />;
};

export default AdminPage;
