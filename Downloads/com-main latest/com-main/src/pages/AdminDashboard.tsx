import React, { useState, useEffect, useRef } from 'react';
import { supabaseAdmin as supabase } from '@/lib/supabase';
import {
  LayoutDashboard, Images, FileText, LogOut, Upload, Trash2, Edit3,
  Plus, Save, X, Loader2, CheckCircle, AlertCircle, Menu, ChevronRight,
  Search, Droplets, Home, Info, Building2, Sprout, Heart,
  FolderOpen, GraduationCap, Phone, Globe, ExternalLink, RefreshCw,
  Shield, Camera, ArrowUpRight, Activity, Clock, Image as ImageIcon,
  Settings, AlignLeft, Tag, User, BookOpen, Calendar, ChevronDown
} from 'lucide-react';

const NAV_SECTIONS = [
  { id: 'dashboard',   label: 'Dashboard',     icon: LayoutDashboard, type: 'dashboard' },
  { id: 'home',        label: 'Home',           icon: Home,            type: 'page' },
  { id: 'about',       label: 'About',          icon: Info,            type: 'page' },
  { id: 'waterworks',  label: 'Waterworks',     icon: Droplets,        type: 'page' },
  { id: 'realestate',  label: 'Real Estate',    icon: Building2,       type: 'page' },
  { id: 'agriculture', label: 'Agriculture',    icon: Sprout,          type: 'page' },
  { id: 'foundation',  label: 'Foundation',     icon: Heart,           type: 'page' },
  { id: 'careers',     label: 'Careers',        icon: GraduationCap,   type: 'page' },
  { id: 'contact',     label: 'Contact',        icon: Phone,           type: 'page' },
  { id: 'projects',    label: 'Projects',       icon: FolderOpen,      type: 'projects' },
  { id: 'media',       label: 'Media Library',  icon: Images,          type: 'media' },
];

const PROJECT_CATEGORIES = [
  { id: 'water',       label: 'Water Projects',  color: 'bg-[#0077BE]' },
  { id: 'realestate',  label: 'Real Estate',     color: 'bg-amber-600' },
  { id: 'agriculture', label: 'Agriculture',     color: 'bg-[#2D5016]' },
  { id: 'social',      label: 'Social Impact',   color: 'bg-rose-600'  },
  { id: 'news',        label: 'News',            color: 'bg-gray-600'  },
];

interface Post {
  id: string;
  title: string;
  content: string;
  section: string;
  category: string;
  excerpt: string;
  author: string;
  read_time: number;
  featured_image_url: string;
  status: 'published' | 'draft' | 'scheduled';
  scheduled_at?: string;
  featured?: boolean;
  created_at: string;
  updated_at: string;
}

interface PageSetting {
  id?: string;
  page: string;
  hero_image: string;
  hero_title: string;
  hero_subtitle: string;
  body_content: string;
  updated_at?: string;
}

interface MediaItem {
  name: string;
  url: string;
  created_at: string;
  size?: number;
}

// Toast
const Toast: React.FC<{ message: string; type: 'success' | 'error'; onClose: () => void }> = ({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl z-50 text-white text-sm font-medium ${type === 'success' ? 'bg-gradient-to-r from-[#1a5f2a] to-[#2d7a40]' : 'bg-gradient-to-r from-red-600 to-red-700'}`}>
      {type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
      {message}
      <button onClick={onClose} className="ml-2 hover:opacity-70"><X className="h-3 w-3" /></button>
    </div>
  );
};

// ConfirmDialog
const ConfirmDialog: React.FC<{ message: string; onConfirm: () => void; onCancel: () => void }> = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
    <div className="bg-[#1a2a20] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-red-500/20 p-2 rounded-lg"><Trash2 className="h-5 w-5 text-red-400" /></div>
        <h3 className="text-white font-semibold">Confirm Delete</h3>
      </div>
      <p className="text-gray-300 text-sm mb-6">{message}</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 px-4 py-2 rounded-lg border border-white/20 text-gray-300 hover:bg-white/5 text-sm">Cancel</button>
        <button onClick={onConfirm} className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium">Delete</button>
      </div>
    </div>
  </div>
);

// ImagePicker
const ImagePicker: React.FC<{ onSelect: (url: string) => void; onClose: () => void; uploadImage: (file: File) => Promise<string | null>; }> = ({ onSelect, onClose, uploadImage }) => {
  const [images, setImages] = React.useState<MediaItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [uploading, setUploading] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.storage.from('blog-images').list('', { limit: 200, sortBy: { column: 'created_at', order: 'desc' } })
      .then(({ data }) => {
        setImages((data || []).filter(i => i.name !== '.emptyFolderPlaceholder').map(i => ({
          name: i.name,
          url: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/blog-images/${i.name}`,
          created_at: i.created_at || '',
        })));
        setLoading(false);
      });
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage(file);
    if (url) { onSelect(url); onClose(); }
    setUploading(false);
  };

  const filtered = images.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] px-4">
      <div className="bg-[#0f1e15] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h3 className="text-white font-semibold flex items-center gap-2"><Images className="h-5 w-5 text-[#0077BE]" /> Select Image</h3>
          <div className="flex items-center gap-2">
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#0077BE]/20 border border-[#0077BE]/40 text-[#4A90E2] rounded-lg text-sm hover:bg-[#0077BE]/30 disabled:opacity-50">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload New
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="h-5 w-5" /></button>
          </div>
        </div>
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search images..."
              className="w-full bg-white/5 border border-white/15 text-white placeholder-gray-500 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#0077BE]" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 text-[#0077BE] animate-spin" /></div> : (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {filtered.map(img => (
                <button key={img.name} onClick={() => { onSelect(img.url); onClose(); }}
                  className="group relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-[#0077BE] transition-all">
                  <img src={img.url} alt={img.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ProjectEditor
const ProjectEditor: React.FC<{ post: Partial<Post> | null; onSave: (p: Partial<Post>) => Promise<void>; onClose: () => void; uploadImage: (f: File) => Promise<string | null>; }> = ({ post, onSave, onClose, uploadImage }) => {
  const [title, setTitle]       = useState(post?.title || '');
  const [content, setContent]   = useState(post?.content || '');
  const [excerpt, setExcerpt]   = useState(post?.excerpt || '');
  const [author, setAuthor]     = useState(post?.author || '');
  const [readTime, setReadTime] = useState(post?.read_time || 0);
  const [imageUrl, setImageUrl] = useState(post?.featured_image_url || '');
  const [category, setCategory] = useState(post?.category || '');
  const [status, setStatus]     = useState<'published'|'draft'|'scheduled'>(post?.status || 'draft');
  const [scheduledAt, setScheduledAt] = useState(post?.scheduled_at?.slice(0,16) || '');
  const [isFeatured, setIsFeatured] = useState(post?.featured || false);
  const [saving, setSaving]     = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [htmlPreview, setHtmlPreview] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !category) return;
    setSaving(true);
    await onSave({ ...post, title, content, excerpt, author, read_time: readTime, featured_image_url: imageUrl, category, status, section: 'projects', scheduled_at: status === 'scheduled' && scheduledAt ? new Date(scheduledAt).toISOString() : undefined, featured: isFeatured });
    setSaving(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-center z-50 px-4 py-6 overflow-y-auto">
        <div className="bg-[#0f1e15] border border-white/10 rounded-2xl w-full max-w-3xl shadow-2xl mb-6">
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="bg-[#0077BE]/20 p-2 rounded-lg"><FolderOpen className="h-5 w-5 text-[#4A90E2]" /></div>
              <div>
                <h3 className="text-white font-semibold">{post?.id ? 'Edit Project Post' : 'New Project Post'}</h3>
                <p className="text-gray-400 text-xs">Appears on the Projects page under the selected category</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="h-5 w-5" /></button>
          </div>

          <div className="p-6 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Title *</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Project title..."
                className="w-full bg-white/5 border border-white/15 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0077BE] transition-all" />
            </div>

            {/* Category + Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-300 text-sm font-medium mb-2 flex items-center gap-1"><Tag className="h-3.5 w-3.5" /> Category *</label>
                <div className="relative mt-2">
                  <select value={category} onChange={e => setCategory(e.target.value)}
                    className="w-full bg-[#0a1510] border border-white/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0077BE] appearance-none cursor-pointer">
                    <option value="">Select category</option>
                    {PROJECT_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {!category && <p className="text-amber-400 text-xs mt-1">Required — sets which filter tab shows this</p>}
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Status</label>
                <div className="relative">
                  <select value={status} onChange={e => setStatus(e.target.value as any)}
                    className="w-full bg-[#0a1510] border border-white/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0077BE] appearance-none cursor-pointer">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Scheduled date */}
            {status === 'scheduled' && (
              <div>
                <label className="text-gray-300 text-sm font-medium mb-2 flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Publish Date & Time</label>
                <input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0077BE] mt-2" />
              </div>
            )}


            {/* Feature on Home Page */}
            <div
              onClick={() => setIsFeatured(!isFeatured)}
              className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all select-none ${
                isFeatured
                  ? 'bg-amber-900/20 border-amber-500/40'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">⭐</span>
                <div>
                  <p className={`text-sm font-medium ${isFeatured ? 'text-amber-300' : 'text-gray-300'}`}>
                    Feature on Home Page
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    Pinned posts appear in the Featured Projects section on the home page
                  </p>
                </div>
              </div>
              <div className={`w-11 h-6 rounded-full transition-all flex-shrink-0 relative ${isFeatured ? 'bg-amber-500' : 'bg-white/15'}`}>
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${isFeatured ? 'left-5.5 left-[22px]' : 'left-0.5'}`} />
              </div>
            </div>

            {/* Featured Image */}
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 flex items-center gap-1"><ImageIcon className="h-3.5 w-3.5" /> Featured Image</label>
              <div className="mt-2">
                {imageUrl ? (
                  <div className="relative rounded-xl overflow-hidden h-48 bg-black/30 group">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button onClick={() => setShowPicker(true)} className="px-3 py-2 bg-[#0077BE] text-white rounded-lg text-sm flex items-center gap-1.5"><Images className="h-4 w-4" /> Change</button>
                      <button onClick={() => setImageUrl('')} className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm flex items-center gap-1.5"><X className="h-4 w-4" /> Remove</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setShowPicker(true)}
                    className="w-full h-36 border-2 border-dashed border-white/20 hover:border-[#0077BE]/60 rounded-xl flex flex-col items-center justify-center gap-2 transition-all group">
                    <Camera className="h-8 w-8 text-gray-500 group-hover:text-[#4A90E2] transition-colors" />
                    <span className="text-gray-400 text-sm">Select Image</span>
                  </button>
                )}
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 flex items-center gap-1"><AlignLeft className="h-3.5 w-3.5" /> Excerpt</label>
              <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Short summary shown on project cards..."
                rows={2} className="w-full bg-white/5 border border-white/15 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0077BE] resize-none mt-2" />
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-gray-300 text-sm font-medium flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> Content <span className="text-gray-500 font-normal">(HTML supported)</span></label>
                <button onClick={() => setHtmlPreview(!htmlPreview)} className="text-xs text-[#4A90E2] hover:text-[#0077BE] flex items-center gap-1">
                  {htmlPreview ? <><Edit3 className="h-3 w-3" /> Edit</> : <><ExternalLink className="h-3 w-3" /> Preview</>}
                </button>
              </div>
              {htmlPreview ? (
                <div className="bg-white rounded-xl p-4 min-h-[160px] text-gray-900 text-sm prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: content || '<p style="color:#9ca3af">Nothing to preview yet...</p>' }} />
              ) : (
                <textarea value={content} onChange={e => setContent(e.target.value)}
                  placeholder={"<h2>Project Overview</h2>\n<p>Describe your project here...</p>"}
                  rows={8} className="w-full bg-white/5 border border-white/15 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0077BE] resize-none font-mono leading-relaxed" />
              )}
              <p className="text-gray-500 text-xs mt-1">Tip: Use HTML tags for formatting. Example: <span className="text-gray-400">&lt;h2&gt;Heading&lt;/h2&gt;</span>, <span className="text-gray-400">&lt;p&gt;Paragraph&lt;/p&gt;</span></p>
            </div>

            {/* Author + Read time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-300 text-sm font-medium mb-2 flex items-center gap-1"><User className="h-3.5 w-3.5" /> Author</label>
                <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Author name..."
                  className="w-full bg-white/5 border border-white/15 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0077BE] mt-2" />
              </div>
              <div>
                <label className="text-gray-300 text-sm font-medium mb-2 flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Read Time (minutes)</label>
                <input type="number" min={0} value={readTime || ''} onChange={e => setReadTime(Number(e.target.value))} placeholder="e.g. 3"
                  className="w-full bg-white/5 border border-white/15 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0077BE] mt-2" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-6 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {category && <span className={`px-2 py-1 rounded-full text-white text-xs ${PROJECT_CATEGORIES.find(c => c.id === category)?.color || 'bg-gray-600'}`}>{PROJECT_CATEGORIES.find(c => c.id === category)?.label}</span>}
              {status === 'published' && <span className="text-[#7CB342]">● Visible on Projects page</span>}
              {status === 'draft'     && <span className="text-amber-400">○ Draft — not visible</span>}
              {status === 'scheduled' && <span className="text-blue-400">◷ Scheduled</span>}
            </div>
            <div className="flex gap-3">
              <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-white/20 text-gray-300 hover:bg-white/5 text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving || !title.trim() || !category}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1a5f2a] to-[#0077BE] text-white text-sm font-medium flex items-center gap-2 hover:opacity-90 disabled:opacity-50">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? 'Saving...' : 'Save Post'}
              </button>
            </div>
          </div>
        </div>
      </div>
      {showPicker && <ImagePicker onSelect={setImageUrl} onClose={() => setShowPicker(false)} uploadImage={uploadImage} />}
    </>
  );
};

// PageSettingsEditor
const PageSettingsEditor: React.FC<{ pageId: string; pageLabel: string; uploadImage: (f: File) => Promise<string | null>; showToast: (m: string, t?: 'success'|'error') => void; }> = ({ pageId, pageLabel, uploadImage, showToast }) => {
  const [settings, setSettings] = useState<PageSetting>({ page: pageId, hero_image: '', hero_title: '', hero_subtitle: '', body_content: '' });
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [htmlPreview, setHtmlPreview] = useState(false);

  useEffect(() => {
    supabase.from('page_settings').select('*').eq('page', pageId).single()
      .then(({ data }) => { if (data) setSettings(data as PageSetting); setLoading(false); });
  }, [pageId]);

  const handleSave = async () => {
    setSaving(true);
    const payload = { ...settings, updated_at: new Date().toISOString() };
    // Clean payload — only known DB columns, no undefined id on insert
    const cleanPayload = {
      page:          settings.page,
      hero_image:    settings.hero_image || '',
      hero_title:    settings.hero_title || '',
      hero_subtitle: settings.hero_subtitle || '',
      body_content:  settings.body_content || '',
      updated_at:    new Date().toISOString(),
    };
    if (settings.id) {
      const { error } = await supabase.from('page_settings').update(cleanPayload).eq('id', settings.id);
      if (error) showToast('Failed to save: ' + error.message, 'error'); else showToast('Page settings saved!');
    } else {
      const { data, error } = await supabase.from('page_settings').insert(cleanPayload).select().single();
      if (error) showToast('Failed to save: ' + error.message, 'error');
      else { setSettings(data as PageSetting); showToast('Page settings saved!'); }
    }
    setSaving(false);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 text-[#0077BE] animate-spin" /></div>;

  return (
    <>
      <div className="p-8 max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#1a5f2a] to-[#0077BE] p-2.5 rounded-xl"><Settings className="h-5 w-5 text-white" /></div>
            <div>
              <h2 className="text-xl font-bold text-white">{pageLabel} — Page Settings</h2>
              <p className="text-gray-400 text-sm">Edit content shown on the {pageLabel} page</p>
            </div>
          </div>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#1a5f2a] to-[#0077BE] text-white rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="space-y-6">
          {/* Hero Image */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2"><Camera className="h-4 w-4 text-[#0077BE]" /> Hero / Banner Image</h3>
            {settings.hero_image ? (
              <div className="relative rounded-xl overflow-hidden h-48 mb-3 group">
                <img src={settings.hero_image} alt="Hero" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button onClick={() => setShowPicker(true)} className="px-3 py-2 bg-[#0077BE] text-white rounded-lg text-sm flex items-center gap-1.5"><Images className="h-4 w-4" /> Change</button>
                  <button onClick={() => setSettings(s => ({ ...s, hero_image: '' }))} className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm"><X className="h-4 w-4" /></button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowPicker(true)}
                className="w-full h-36 border-2 border-dashed border-white/20 hover:border-[#0077BE]/60 rounded-xl flex flex-col items-center justify-center gap-2 transition-all group mb-3">
                <Camera className="h-8 w-8 text-gray-500 group-hover:text-[#4A90E2]" />
                <span className="text-gray-400 text-sm">Select Hero Image</span>
              </button>
            )}
            <input value={settings.hero_image} onChange={e => setSettings(s => ({ ...s, hero_image: e.target.value }))} placeholder="Or paste image URL..."
              className="w-full bg-white/5 border border-white/15 text-white placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0077BE]" />
          </div>

          {/* Hero Text */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <h3 className="text-white font-medium flex items-center gap-2"><AlignLeft className="h-4 w-4 text-[#0077BE]" /> Hero Text</h3>
            <div>
              <label className="block text-gray-400 text-xs mb-1.5">Page Title / Heading</label>
              <input value={settings.hero_title} onChange={e => setSettings(s => ({ ...s, hero_title: e.target.value }))} placeholder={`${pageLabel} heading...`}
                className="w-full bg-white/5 border border-white/15 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0077BE]" />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1.5">Subtitle / Tagline</label>
              <textarea value={settings.hero_subtitle} onChange={e => setSettings(s => ({ ...s, hero_subtitle: e.target.value }))} placeholder="Short subtitle..." rows={2}
                className="w-full bg-white/5 border border-white/15 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0077BE] resize-none" />
            </div>
          </div>

          {/* Body Content */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium flex items-center gap-2"><BookOpen className="h-4 w-4 text-[#0077BE]" /> Body Content <span className="text-gray-500 font-normal text-sm">(HTML supported)</span></h3>
              <button onClick={() => setHtmlPreview(!htmlPreview)} className="text-xs text-[#4A90E2] hover:text-[#0077BE] flex items-center gap-1">
                {htmlPreview ? <><Edit3 className="h-3 w-3" /> Edit</> : <><ExternalLink className="h-3 w-3" /> Preview</>}
              </button>
            </div>
            {htmlPreview ? (
              <div className="bg-white rounded-xl p-4 min-h-[200px] text-gray-900 text-sm prose max-w-none"
                dangerouslySetInnerHTML={{ __html: settings.body_content || '<p style="color:#9ca3af">Nothing to preview...</p>' }} />
            ) : (
              <textarea value={settings.body_content} onChange={e => setSettings(s => ({ ...s, body_content: e.target.value }))}
                placeholder={"<h2>Section Heading</h2>\n<p>Add content here...</p>"} rows={10}
                className="w-full bg-white/5 border border-white/15 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0077BE] resize-none font-mono leading-relaxed" />
            )}
            <p className="text-gray-500 text-xs mt-2">Tip: Use HTML tags. Example: <span className="text-gray-400">&lt;h2&gt;Heading&lt;/h2&gt;</span>, <span className="text-gray-400">&lt;p&gt;Paragraph&lt;/p&gt;</span></p>
          </div>
        </div>
      </div>
      {showPicker && <ImagePicker onSelect={url => setSettings(s => ({ ...s, hero_image: url }))} onClose={() => setShowPicker(false)} uploadImage={uploadImage} />}
    </>
  );
};

// Main Dashboard
interface AdminDashboardProps { onLogout: () => void; }

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [posts, setPosts]       = useState<Post[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading]   = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingPost, setEditingPost] = useState<Partial<Post> | null | undefined>(undefined);
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'post'|'media'; id: string; name?: string } | null>(null);
  const [toast, setToast]       = useState<{ message: string; type: 'success'|'error' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const [filterStatus, setFilterStatus]   = useState<'all'|'published'|'draft'|'scheduled'>('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const mediaFileRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: 'success'|'error' = 'success') => setToast({ message, type });

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase.from('posts').select('*').eq('section', 'projects').order('created_at', { ascending: false });
    if (data) setPosts(data as Post[]);
    setLoading(false);
  };

  const fetchMedia = async () => {
    setLoading(true);
    const { data } = await supabase.storage.from('blog-images').list('', { limit: 200, sortBy: { column: 'created_at', order: 'desc' } });
    if (data) setMediaItems(data.filter(i => i.name !== '.emptyFolderPlaceholder').map(i => ({
      name: i.name, url: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/blog-images/${i.name}`, created_at: i.created_at || '', size: i.metadata?.size,
    })));
    setLoading(false);
  };

  useEffect(() => {
    if (activeSection === 'projects') fetchPosts();
    else if (activeSection === 'media') fetchMedia();
    setSearchQuery(''); setFilterStatus('all'); setFilterCategory('all');
  }, [activeSection]);

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const { error } = await supabase.storage.from('blog-images').upload(fileName, file);
    if (error) { showToast('Upload failed: ' + error.message, 'error'); return null; }
    showToast('Image uploaded!');
    return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/blog-images/${fileName}`;
  };

  const savePost = async (postData: Partial<Post>) => {
    const now = new Date().toISOString();

    // Build a clean payload — only columns that exist in the DB
    const payload = {
      title:              postData.title || '',
      content:            postData.content || '',
      excerpt:            postData.excerpt || '',
      author:             postData.author || '',
      read_time:          postData.read_time || 0,
      featured_image_url: postData.featured_image_url || '',
      category:           postData.category || '',
      section:            'projects',
      status:             postData.status || 'draft',
      scheduled_at:       postData.scheduled_at || null,
      featured:           postData.featured || false,
      updated_at:         now,
    };

    if (postData.id) {
      const { error } = await supabase.from('posts').update(payload).eq('id', postData.id);
      if (error) { showToast('Failed to update: ' + error.message, 'error'); return; }
      showToast('Post updated!');
    } else {
      const slug = (postData.title || 'post')
        .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        + '-' + Date.now();
      const { error } = await supabase.from('posts').insert({ ...payload, slug, created_at: now });
      if (error) { showToast('Failed to create: ' + error.message, 'error'); return; }
      showToast('Post created!');
    }
    fetchPosts();
  };

  const deletePost = async (id: string) => {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) { showToast('Failed to delete.', 'error'); return; }
    showToast('Post deleted.'); fetchPosts();
  };

  const deleteMedia = async (name: string) => {
    const { error } = await supabase.storage.from('blog-images').remove([name]);
    if (error) { showToast('Failed to delete.', 'error'); return; }
    showToast('Image deleted.'); fetchMedia();
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    let count = 0;
    for (const file of files) { if (await uploadImage(file)) count++; }
    showToast(`${count} image(s) uploaded!`); setUploading(false); fetchMedia();
    if (mediaFileRef.current) mediaFileRef.current.value = '';
  };

  const filteredPosts = posts.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || (p.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchCat    = filterCategory === 'all' || p.category === filterCategory;
    return matchSearch && matchStatus && matchCat;
  });

  // Dashboard
  const DashboardView = () => {
    const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, images: 0 });
    useEffect(() => {
      Promise.all([
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.storage.from('blog-images').list('', { limit: 1000 }),
      ]).then(([{ count: total }, { count: pub }, { data: media }]) =>
        setStats({ total: total||0, published: pub||0, drafts: (total||0)-(pub||0), images: media?.filter(i=>i.name!=='.emptyFolderPlaceholder').length||0 })
      );
    }, []);
    const cards = [
      { label: 'Total Posts', value: stats.total,     icon: FileText,     color: 'from-[#0077BE] to-[#4A90E2]', bg: 'bg-[#0077BE]/10 border-[#0077BE]/20' },
      { label: 'Published',   value: stats.published, icon: CheckCircle,  color: 'from-[#1a5f2a] to-[#7CB342]', bg: 'bg-[#1a5f2a]/20 border-[#7CB342]/20' },
      { label: 'Drafts',      value: stats.drafts,    icon: Edit3,        color: 'from-amber-600 to-amber-400',  bg: 'bg-amber-900/20 border-amber-600/20' },
      { label: 'Images',      value: stats.images,    icon: Images,       color: 'from-purple-700 to-purple-500',bg: 'bg-purple-900/20 border-purple-600/20' },
    ];
    return (
      <div className="p-8">
        <div className="relative bg-gradient-to-r from-[#1a3a2a] to-[#0d2a3a] border border-white/10 rounded-2xl p-8 mb-8 overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #0077BE 0%, transparent 60%)' }} />
          <div className="relative flex items-center gap-6">
            <img src="https://d64gsuwffb70l.cloudfront.net/6891fba9e84754e0b0fc9f86_1768205885796_f2d4cfcb.jpg" alt="Logo" className="h-16 w-auto bg-white rounded-xl p-1.5 shadow-lg" />
            <div>
              <h2 className="text-2xl font-bold text-white">Welcome back, Admin</h2>
              <p className="text-gray-300 text-sm mt-1">Bati-Ngalun Company Limited · Admin Control Panel</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-[#7CB342] rounded-full animate-pulse" />
                <span className="text-[#7CB342] text-xs font-medium">bati-ngalun.com is live</span>
                <a href="https://bati-ngalun.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><ExternalLink className="h-3 w-3" /></a>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {cards.map(c => { const Icon = c.icon; return (
            <div key={c.label} className={`${c.bg} border rounded-xl p-5 flex flex-col gap-3`}>
              <div className={`bg-gradient-to-br ${c.color} p-2 rounded-lg w-fit`}><Icon className="h-5 w-5 text-white" /></div>
              <div><p className="text-3xl font-bold text-white">{c.value}</p><p className="text-gray-400 text-sm">{c.label}</p></div>
            </div>
          );})}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><Activity className="h-4 w-4 text-[#0077BE]" /> Quick Actions</h3>
            <div className="space-y-2">
              {[
                { id: 'projects', label: 'Manage Project Posts', icon: FolderOpen, color: 'bg-[#0077BE]/20', iconColor: 'text-[#4A90E2]' },
                { id: 'media',    label: 'Media Library',        icon: Images,     color: 'bg-purple-900/30', iconColor: 'text-purple-400' },
                ...NAV_SECTIONS.filter(s => s.type === 'page').slice(0, 5).map(s => ({ id: s.id, label: `Edit ${s.label} Page`, icon: s.icon, color: 'bg-[#1a5f2a]/30', iconColor: 'text-[#7CB342]' })),
              ].map(item => { const Icon = item.icon; return (
                <button key={item.id} onClick={() => setActiveSection(item.id)}
                  className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all text-left group">
                  <div className={`${item.color} p-2 rounded-lg`}><Icon className={`h-4 w-4 ${item.iconColor}`} /></div>
                  <span className="text-gray-300 text-sm font-medium group-hover:text-white">{item.label}</span>
                  <ArrowUpRight className="h-3 w-3 text-gray-500 ml-auto group-hover:text-white" />
                </button>
              );})}
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><Globe className="h-4 w-4 text-[#7CB342]" /> Site Info</h3>
            <div className="space-y-3 text-sm">
              {[['Domain','bati-ngalun.com'],['Hosting','GitHub Pages'],['Database','Supabase (PostgreSQL)'],['Storage','Supabase (blog-images)'],['Stack','React + Vite + TypeScript']].map(([k,v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-gray-400">{k}</span><span className="text-gray-200 font-medium">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Projects Manager
  const ProjectsManager = () => (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-[#1a5f2a] to-[#0077BE] p-2.5 rounded-xl"><FolderOpen className="h-5 w-5 text-white" /></div>
          <div>
            <h2 className="text-xl font-bold text-white">Project Posts</h2>
            <p className="text-gray-400 text-sm">{filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} · shown on Projects page by category</p>
          </div>
        </div>
        <button onClick={() => setEditingPost({})} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#1a5f2a] to-[#0077BE] text-white rounded-xl text-sm font-medium hover:opacity-90">
          <Plus className="h-4 w-4" /> New Post
        </button>
      </div>
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search posts..."
            className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#0077BE]" />
        </div>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
          className="bg-[#0a1510] border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0077BE]">
          <option value="all">All Categories</option>
          {PROJECT_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)}
          className="bg-[#0a1510] border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0077BE]">
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
        </select>
      </div>
      {loading ? <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 text-[#0077BE] animate-spin" /></div>
      : filteredPosts.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-2xl">
          <div className="bg-white/5 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"><FolderOpen className="h-8 w-8 text-gray-500" /></div>
          <p className="text-gray-400 text-lg font-medium">No posts yet</p>
          <p className="text-gray-500 text-sm mt-1 mb-4">Create project posts that appear on the Projects page</p>
          <button onClick={() => setEditingPost({})} className="inline-flex items-center gap-2 px-4 py-2 bg-[#0077BE]/20 border border-[#0077BE]/40 text-[#4A90E2] rounded-lg text-sm">
            <Plus className="h-4 w-4" /> Create First Post
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPosts.map(post => {
            const cat = PROJECT_CATEGORIES.find(c => c.id === post.category);
            return (
              <div key={post.id} className="group flex items-start gap-4 bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 rounded-xl p-4 transition-all">
                <div className="flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden bg-black/30">
                  {post.featured_image_url ? <img src={post.featured_image_url} alt={post.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="h-6 w-6 text-gray-600" /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap">
                    <h3 className="text-white font-medium text-sm leading-snug flex-1 truncate">{post.title}</h3>
                    {cat && <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full text-white ${cat.color}`}>{cat.label}</span>}
                    <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium border ${post.status === 'published' ? 'bg-[#1a5f2a]/40 text-[#7CB342] border-[#7CB342]/30' : post.status === 'scheduled' ? 'bg-blue-900/30 text-blue-400 border-blue-500/30' : 'bg-amber-900/30 text-amber-400 border-amber-500/30'}`}>
                      {post.status}
                    </span>
                    {post.featured && <span className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium bg-amber-900/30 text-amber-300 border border-amber-500/30" title="Featured on Home Page">⭐ Featured</span>}
                  </div>
                  {post.excerpt && <p className="text-gray-500 text-xs mt-1 line-clamp-1">{post.excerpt}</p>}
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    {post.author    && <span className="text-gray-600 text-xs flex items-center gap-1"><User className="h-3 w-3" />{post.author}</span>}
                    {post.read_time > 0 && <span className="text-gray-600 text-xs flex items-center gap-1"><Clock className="h-3 w-3" />{post.read_time} min read</span>}
                    <span className="text-gray-600 text-xs flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(post.updated_at||post.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</span>
                  </div>
                </div>
                <div className="flex-shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditingPost(post)} className="p-2 bg-[#0077BE]/20 hover:bg-[#0077BE]/40 border border-[#0077BE]/30 text-[#4A90E2] rounded-lg"><Edit3 className="h-4 w-4" /></button>
                  <button onClick={() => setConfirmDelete({ type: 'post', id: post.id })} className="p-2 bg-red-900/20 hover:bg-red-900/40 border border-red-700/30 text-red-400 rounded-lg"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // Media Library
  const MediaLibrary = () => {
    const filtered = mediaItems.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return (
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-700 to-purple-500 p-2.5 rounded-xl"><Images className="h-5 w-5 text-white" /></div>
            <div><h2 className="text-xl font-bold text-white">Media Library</h2><p className="text-gray-400 text-sm">{filtered.length} image{filtered.length!==1?'s':''}</p></div>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchMedia} className="p-2.5 bg-white/5 border border-white/10 text-gray-400 hover:text-white rounded-xl"><RefreshCw className="h-4 w-4" /></button>
            <button onClick={() => mediaFileRef.current?.click()} disabled={uploading}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#1a5f2a] to-[#0077BE] text-white rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
            <input ref={mediaFileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleMediaUpload} />
          </div>
        </div>
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search images..."
            className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#0077BE]" />
        </div>
        <div onClick={() => mediaFileRef.current?.click()} className="border-2 border-dashed border-white/15 rounded-2xl p-6 text-center mb-6 hover:border-[#0077BE]/50 cursor-pointer group">
          <Camera className="h-8 w-8 text-gray-500 group-hover:text-[#4A90E2] mx-auto mb-2 transition-colors" />
          <p className="text-gray-400 text-sm">Click or drag images here to upload · Multiple files supported</p>
        </div>
        {loading ? <div className="flex items-center justify-center py-16"><Loader2 className="h-8 w-8 text-[#0077BE] animate-spin" /></div> : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(item => (
              <div key={item.name} className="group relative rounded-xl overflow-hidden bg-black/30 border border-white/10 hover:border-white/30 aspect-square transition-all">
                <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <div className="flex justify-end gap-1">
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg"><ExternalLink className="h-3.5 w-3.5 text-white" /></a>
                    <button onClick={() => { navigator.clipboard.writeText(item.url); showToast('URL copied!'); }} className="p-1.5 bg-[#0077BE]/60 hover:bg-[#0077BE] rounded-lg text-white text-xs px-2">Copy</button>
                    <button onClick={() => setConfirmDelete({ type: 'media', id: item.name, name: item.name })} className="p-1.5 bg-red-600/70 hover:bg-red-600 rounded-lg"><Trash2 className="h-3.5 w-3.5 text-white" /></button>
                  </div>
                  <p className="text-white/70 text-xs truncate">{item.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const currentSection = NAV_SECTIONS.find(s => s.id === activeSection);

  return (
    <div className="min-h-screen bg-[#0a1510] flex font-sans">
      {/* Sidebar */}
      <aside className={`flex-shrink-0 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'} bg-[#0d1f16] border-r border-white/10 flex flex-col min-h-screen`}>
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          {sidebarOpen && (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <img src="https://d64gsuwffb70l.cloudfront.net/6891fba9e84754e0b0fc9f86_1768205885796_f2d4cfcb.jpg" alt="Logo" className="h-9 w-auto bg-white rounded-lg p-0.5 flex-shrink-0" />
              <div className="min-w-0"><p className="text-white font-bold text-sm">BATI-NGALUN</p><p className="text-[#7CB342] text-xs">Admin Panel</p></div>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white ${!sidebarOpen ? 'mx-auto' : ''}`}>
            <Menu className="h-4 w-4" />
          </button>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          {sidebarOpen && <p className="text-gray-600 text-xs font-medium uppercase tracking-wider px-4 mb-2">Navigation</p>}
          <div className="space-y-0.5 px-2">
            {NAV_SECTIONS.map(item => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button key={item.id} onClick={() => setActiveSection(item.id)} title={!sidebarOpen ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-gradient-to-r from-[#1a5f2a]/60 to-[#0077BE]/20 text-white border border-[#7CB342]/20' : 'text-gray-400 hover:text-white hover:bg-white/5'} ${!sidebarOpen ? 'justify-center' : ''}`}>
                  <Icon className={`flex-shrink-0 h-4 w-4 ${isActive ? 'text-[#7CB342]' : ''}`} />
                  {sidebarOpen && <span className="truncate flex-1 text-left">{item.label}</span>}
                  {sidebarOpen && item.type === 'page' && !isActive && <span className="text-gray-600 text-xs">Settings</span>}
                  {sidebarOpen && isActive && <ChevronRight className="ml-auto h-3 w-3 text-[#7CB342]" />}
                </button>
              );
            })}
          </div>
        </nav>
        <div className="p-3 border-t border-white/10">
          <a href="https://bati-ngalun.com" target="_blank" rel="noopener noreferrer"
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 text-sm mb-1 ${!sidebarOpen ? 'justify-center' : ''}`}>
            <Globe className="flex-shrink-0 h-4 w-4" />
            {sidebarOpen && <><span>View Live Site</span><ExternalLink className="ml-auto h-3 w-3" /></>}
          </a>
          <button onClick={onLogout} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-400 hover:text-red-300 hover:bg-red-900/20 text-sm ${!sidebarOpen ? 'justify-center' : ''}`}>
            <LogOut className="flex-shrink-0 h-4 w-4" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 bg-[#0a1510]/80 backdrop-blur-xl border-b border-white/10 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Admin</span><ChevronRight className="h-3 w-3" />
            <span className="text-white">{currentSection?.label}</span>
            {currentSection?.type === 'page'     && <span className="text-gray-500">— Page Settings</span>}
            {currentSection?.type === 'projects' && <span className="text-gray-500">— Post Manager</span>}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#1a5f2a]/20 border border-[#7CB342]/20 px-3 py-1.5 rounded-full">
              <div className="w-1.5 h-1.5 bg-[#7CB342] rounded-full animate-pulse" />
              <span className="text-[#7CB342] text-xs font-medium">bati-ngalun.com live</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
              <Shield className="h-3 w-3 text-[#0077BE]" /><span className="text-gray-400 text-xs">Secured</span>
            </div>
          </div>
        </div>

        {activeSection === 'dashboard' && <DashboardView />}
        {activeSection === 'projects'  && <ProjectsManager />}
        {activeSection === 'media'     && <MediaLibrary />}
        {currentSection?.type === 'page' && (
          <PageSettingsEditor key={activeSection} pageId={activeSection} pageLabel={currentSection.label} uploadImage={uploadImage} showToast={showToast} />
        )}
      </main>

      {editingPost !== undefined && (
        <ProjectEditor post={editingPost} onSave={savePost} onClose={() => setEditingPost(undefined)} uploadImage={uploadImage} />
      )}
      {confirmDelete && (
        <ConfirmDialog
          message={confirmDelete.type === 'post' ? 'Delete this post? This cannot be undone.' : `Delete "${confirmDelete.name}"? This permanently removes it from the media library.`}
          onConfirm={() => { if (confirmDelete.type === 'post') deletePost(confirmDelete.id); else deleteMedia(confirmDelete.id); setConfirmDelete(null); }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminDashboard;
