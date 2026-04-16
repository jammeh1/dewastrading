import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Zap, LogOut, Image as ImageIcon, MessageSquare, Package, DollarSign, Loader2 } from 'lucide-react';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminImages from '@/components/admin/AdminImages';
import AdminServices from '@/components/admin/AdminServices';
import AdminPricing from '@/components/admin/AdminPricing';
import AdminMessages from '@/components/admin/AdminMessages';

type Tab = 'images' | 'services' | 'pricing' | 'messages';

const Admin: React.FC = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('images');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#0A1128]" />
      </div>
    );
  }

  if (!user) return <AdminLogin />;

  const tabs: { id: Tab; label: string; icon: typeof ImageIcon }[] = [
    { id: 'images', label: 'Images', icon: ImageIcon },
    { id: 'services', label: 'Services', icon: Package },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#0A1128] text-white sticky top-0 z-30 shadow">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-[#FFD60A] flex items-center justify-center">
              <Zap className="h-5 w-5 text-[#0A1128]" strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-extrabold">DEWAS Admin</div>
              <div className="text-[10px] text-[#FFD60A]">DASHBOARD</div>
            </div>
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-300 hidden sm:inline">{user.email}</span>
            <button
              onClick={() => navigate('/')}
              className="text-xs text-gray-300 hover:text-[#FFD60A]"
            >
              View Site
            </button>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-[#0A1128]">Dashboard</h1>
          <p className="text-gray-500">Manage your website content in real-time</p>
        </div>
        <div className="flex flex-wrap gap-2 mb-6 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                tab === t.id
                  ? 'bg-[#0A1128] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {tab === 'images' && <AdminImages />}
          {tab === 'services' && <AdminServices />}
          {tab === 'pricing' && <AdminPricing />}
          {tab === 'messages' && <AdminMessages />}
        </div>
      </div>
    </div>
  );
};

export default Admin;
