import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Edit3, Save, X, Loader2 } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string | null;
}

const ICONS = ['Truck', 'Axe', 'Sun', 'Zap', 'Camera', 'Drill', 'Droplets', 'Wrench'];

const emptyForm = { title: '', description: '', icon: 'Zap' };

const AdminServices: React.FC = () => {
  const [list, setList] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('services').select('*').order('created_at', { ascending: true });
    setList((data as Service[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const startEdit = (s: Service) => {
    setEditId(s.id);
    setAdding(false);
    setForm({ title: s.title, description: s.description, icon: s.icon ?? 'Zap' });
  };

  const save = async () => {
    if (!form.title.trim() || !form.description.trim()) return;
    if (editId) {
      await supabase.from('services').update(form).eq('id', editId);
    } else {
      await supabase.from('services').insert([form]);
    }
    setEditId(null); setAdding(false); setForm(emptyForm); load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    await supabase.from('services').delete().eq('id', id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-[#0A1128]">Services</h2>
          <p className="text-sm text-gray-500">Manage the services shown on the home page.</p>
        </div>
        <button
          onClick={() => { setAdding(true); setEditId(null); setForm(emptyForm); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A1128] text-white font-bold rounded-lg hover:bg-[#1e3a8a] text-sm"
        >
          <Plus className="h-4 w-4" /> Add Service
        </button>
      </div>

      {(adding || editId) && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5">
          <div className="grid md:grid-cols-2 gap-3">
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Title"
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />
            <select
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
            >
              {ICONS.map((i) => <option key={i}>{i}</option>)}
            </select>
          </div>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
            rows={3}
            className="w-full mt-3 px-3 py-2 border border-gray-300 rounded-lg resize-none"
          />
          <div className="flex gap-2 mt-3">
            <button onClick={save} className="inline-flex items-center gap-1 px-4 py-2 bg-[#FFD60A] text-[#0A1128] font-bold rounded-lg text-sm">
              <Save className="h-4 w-4" /> {editId ? 'Update' : 'Create'}
            </button>
            <button onClick={() => { setEditId(null); setAdding(false); setForm(emptyForm); }} className="inline-flex items-center gap-1 px-4 py-2 bg-gray-200 rounded-lg text-sm font-bold">
              <X className="h-4 w-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : (
        <div className="space-y-2">
          {list.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono bg-[#0A1128] text-[#FFD60A] px-2 py-0.5 rounded">{s.icon}</span>
                  <h3 className="font-bold text-[#0A1128] truncate">{s.title}</h3>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">{s.description}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => startEdit(s)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg"><Edit3 className="h-4 w-4" /></button>
                <button onClick={() => remove(s.id)} className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminServices;
