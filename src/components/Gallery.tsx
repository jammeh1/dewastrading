import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { X, ImageIcon } from 'lucide-react';

interface Img {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
}

const fallbackImages: Img[] = [
  { id: 'f1', title: 'Solar Installation', description: 'Rooftop solar array — Brikama', image_url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80' },
  { id: 'f2', title: 'Borehole Drilling', description: 'Water solutions — Penyem', image_url: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=800&q=80' },
  { id: 'f3', title: 'Electrical Wiring', description: 'Commercial build — Somita', image_url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80' },
  { id: 'f4', title: 'CCTV Setup', description: 'Security cameras', image_url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&q=80' },
  { id: 'f5', title: 'Solar Farm', description: 'Off-grid systems', image_url: 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=800&q=80' },
  { id: 'f6', title: 'Panel Mounting', description: 'Professional team at work', image_url: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&q=80' },
  { id: 'f7', title: 'Water Tank', description: 'Elevated tank installation', image_url: 'https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=800&q=80' },
  { id: 'f8', title: 'Solar Panels', description: 'Clean energy for all', image_url: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80' },
];

const Gallery: React.FC = () => {
  const [images, setImages] = useState<Img[]>([]);
  const [active, setActive] = useState<Img | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('images')
        .select('*')
        .order('created_at', { ascending: false });
      if (data && data.length > 0) setImages(data as Img[]);
      else setImages(fallbackImages);
      setLoading(false);
    })();
  }, []);

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-block text-[#FFD60A] font-bold text-sm tracking-widest mb-3">
            OUR WORK
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#0A1128] mb-4">
            Project Gallery
          </h2>
          <div className="w-24 h-1 bg-[#FFD60A] mx-auto mb-6" />
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            A showcase of our completed projects across The Gambia.
          </p>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-300">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No images yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img) => (
              <button
                key={img.id}
                onClick={() => setActive(img)}
                className="group relative aspect-square overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all"
              >
                <img
                  src={img.image_url}
                  alt={img.title ?? 'Project'}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div className="text-left">
                    <div className="text-white font-bold text-sm">{img.title}</div>
                    {img.description && (
                      <div className="text-gray-300 text-xs mt-1">{img.description}</div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      {active && (
        <div
          onClick={() => setActive(null)}
          className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
        >
          <button
            onClick={() => setActive(null)}
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
          >
            <X />
          </button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={active.image_url} alt={active.title ?? ''} className="w-full max-h-[80vh] object-contain rounded-xl" />
            <div className="text-white text-center mt-4">
              <div className="text-lg font-bold">{active.title}</div>
              {active.description && <div className="text-sm text-gray-300">{active.description}</div>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
