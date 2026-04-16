import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, Loader2, Mail, MailOpen, MapPin, User, Phone } from 'lucide-react';

interface Msg {
  id: string;
  name: string;
  contact: string;
  location: string | null;
  message: string;
  read: boolean;
  created_at: string;
}

const AdminMessages: React.FC = () => {
  const [list, setList] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    setList((data as Msg[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleRead = async (m: Msg) => {
    await supabase.from('messages').update({ read: !m.read }).eq('id', m.id);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    await supabase.from('messages').delete().eq('id', id);
    load();
  };

  const filtered = filter === 'unread' ? list.filter((m) => !m.read) : list;
  const unreadCount = list.filter((m) => !m.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#0A1128]">Messages / Leads</h2>
          <p className="text-sm text-gray-500">{list.length} total • {unreadCount} unread</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-lg text-sm font-bold ${filter === 'all' ? 'bg-[#0A1128] text-white' : 'bg-gray-100'}`}>All</button>
          <button onClick={() => setFilter('unread')} className={`px-3 py-1.5 rounded-lg text-sm font-bold ${filter === 'unread' ? 'bg-[#0A1128] text-white' : 'bg-gray-100'}`}>Unread ({unreadCount})</button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
          <Mail className="h-10 w-10 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No messages to display.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((m) => (
            <div key={m.id} className={`p-4 rounded-xl border ${m.read ? 'bg-white border-gray-200' : 'bg-yellow-50 border-[#FFD60A]'}`}>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <User className="h-4 w-4 text-[#0A1128]" />
                    <span className="font-bold text-[#0A1128]">{m.name}</span>
                    {!m.read && <span className="bg-[#FFD60A] text-[#0A1128] px-2 py-0.5 rounded text-[10px] font-bold">NEW</span>}
                    <span className="text-xs text-gray-400">{new Date(m.created_at).toLocaleString()}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                    <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" /> {m.contact}</span>
                    {m.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {m.location}</span>}
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{m.message}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleRead(m)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg" title={m.read ? 'Mark unread' : 'Mark read'}>
                    {m.read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                  </button>
                  <button onClick={() => remove(m.id)} className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
