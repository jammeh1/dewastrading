import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Upload, Trash2, Edit3, Loader2, Save, X } from 'lucide-react';

interface Img {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  created_at: string;
}

const AdminImages: React.FC = () => {
  const [images, setImages] = useState<Img[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('images').select('*').order('created_at', { ascending: false });
    setImages((data as Img[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from('dewas-images').upload(path, file);
      if (uploadErr) { alert(uploadErr.message); continue; }
      const { data: urlData } = supabase.storage.from('dewas-images').getPublicUrl(path);
      await supabase.from('images').insert([{
        title: file.name.replace(/\.[^.]+$/, ''),
        description: '',
        image_url: urlData.publicUrl,
      }]);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
    load();
  };

  const remove = async (img: Img) => {
    if (!confirm('Delete this image?')) return;
    // Extract path from public URL
    const match = img.image_url.match(/dewas-images\/(.+)$/);
    if (match) await supabase.storage.from('dewas-images').remove([match[1]]);
    await supabase.from('images').delete().eq('id', img.id);
    load();
  };

  const startEdit = (img: Img) => {
    setEditId(img.id);
    setEditForm({ title: img.title ?? '', description: img.description ?? '' });
  };

  const saveEdit = async () => {
    if (!editId) return;
    await supabase.from('images').update(editForm).eq('id', editId);
    setEditId(null);
    load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl font-bold text-[#0A1128]">Image Management</h2>
          <p className="text-sm text-gray-500">Upload project photos to the gallery.</p>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFD60A] text-[#0A1128] font-bold rounded-lg hover:bg-yellow-300 disabled:opacity-60"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? 'Uploading...' : 'Upload Images'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={handleUpload} />
      </div>
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="aspect-square bg-gray-100 animate-pulse rounded-xl" />)}
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
          <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No images yet. Upload your first project photo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="group relative rounded-xl overflow-hidden border border-gray-200 bg-white">
              <img src={img.image_url} alt={img.title ?? ''} className="w-full aspect-square object-cover" />
              {editId === img.id ? (
                <div className="p-3 space-y-2">
                  <input
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    placeholder="Title"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                  />
                  <input
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder="Description"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                  />
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="flex-1 inline-flex items-center justify-center gap-1 bg-[#0A1128] text-white py-1.5 rounded text-xs font-bold">
                      <Save className="h-3 w-3" /> Save
                    </button>
                    <button onClick={() => setEditId(null)} className="flex-1 bg-gray-200 py-1.5 rounded text-xs font-bold">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3">
                  <div className="font-semibold text-sm text-[#0A1128] truncate">{img.title || 'Untitled'}</div>
                  <div className="text-xs text-gray-500 truncate">{img.description || 'No description'}</div>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => startEdit(img)} className="flex-1 inline-flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 py-1.5 rounded text-xs font-bold text-gray-700">
                      <Edit3 className="h-3 w-3" /> Edit
                    </button>
                    <button onClick={() => remove(img)} className="flex-1 inline-flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 py-1.5 rounded text-xs font-bold">
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminImages;
