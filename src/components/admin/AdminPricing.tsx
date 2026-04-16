import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Edit3, Save, X, Loader2 } from 'lucide-react';
import { formatGMD } from '@/lib/constants';

interface PricingItem {
  id: string;
  category: string;
  capacity: string;
  price: number;
}

const emptyForm = { category: 'electric', capacity: '', price: 0 };

const AdminPricing: React.FC = () => {
  const [list, setList] = useState<PricingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('pricing').select('*').order('category').order('price');
    setList((data as PricingItem[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.capacity.trim() || form.price <= 0) return;
    if (editId) await supabase.from('pricing').update(form).eq('id', editId);
    else await supabase.from('pricing').insert([form]);
    setEditId(null); setAdding(false); setForm(emptyForm); load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this price?')) return;
    await supabase.from('pricing').delete().eq('id', id);
    load();
  };

  const startEdit = (p: PricingItem) => {
    setEditId(p.id); setAdding(false);
    setForm({ category: p.category, capacity: p.capacity, price: p.price });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-[#0A1128]">Pricing</h2>
          <p className="text-sm text-gray-500">Manage Electric & Solar borehole package prices (GMD).</p>
        </div>
        <button
          onClick={() => { setAdding(true); setEditId(null); setForm(emptyForm); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A1128] text-white font-bold rounded-lg text-sm"
        >
          <Plus className="h-4 w-4" /> Add Price
        </button>
      </div>

      {(adding || editId) && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5 grid md:grid-cols-4 gap-3">
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-lg bg-white">
            <option value="electric">Electric</option>
            <option value="solar">Solar</option>
          </select>
          <input value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} placeholder="Capacity e.g. 1000L" className="px-3 py-2 border border-gray-300 rounded-lg" />
          <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })} placeholder="Price GMD" className="px-3 py-2 border border-gray-300 rounded-lg" />
          <div className="flex gap-2">
            <button onClick={save} className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-[#FFD60A] text-[#0A1128] font-bold rounded-lg text-sm">
              <Save className="h-4 w-4" /> Save
            </button>
            <button onClick={() => { setEditId(null); setAdding(false); setForm(emptyForm); }} className="px-3 py-2 bg-gray-200 rounded-lg">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="p-3">Category</th>
                <th className="p-3">Capacity</th>
                <th className="p-3">Price</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {list.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${p.category === 'solar' ? 'bg-[#FFD60A] text-[#0A1128]' : 'bg-[#0A1128] text-white'}`}>
                      {p.category.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 font-semibold">{p.capacity}</td>
                  <td className="p-3 font-bold text-[#0A1128]">{formatGMD(p.price)}</td>
                  <td className="p-3 text-right">
                    <div className="inline-flex gap-2">
                      <button onClick={() => startEdit(p)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg"><Edit3 className="h-4 w-4" /></button>
                      <button onClick={() => remove(p.id)} className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPricing;
