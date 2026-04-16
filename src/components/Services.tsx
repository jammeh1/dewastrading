import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Truck, Axe, Sun, Zap, Camera, Drill, Droplets, LucideIcon, Wrench } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Truck, Axe, Sun, Zap, Camera, Drill, Droplets, Wrench,
};

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string | null;
}

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: true });
      if (data) setServices(data as Service[]);
      setLoading(false);
    })();
  }, []);

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-block text-[#FFD60A] font-bold text-sm tracking-widest mb-3">
            WHAT WE DO
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#0A1128] mb-4">
            Our Professional Services
          </h2>
          <div className="w-24 h-1 bg-[#FFD60A] mx-auto mb-6" />
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            From solar systems to borehole drilling, we deliver end-to-end solutions
            tailored to your needs.
          </p>
        </div>
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, idx) => {
              const Icon = iconMap[s.icon ?? 'Zap'] ?? Zap;
              return (
                <div
                  key={s.id}
                  className="group relative bg-white border border-gray-200 rounded-2xl p-7 hover:border-[#FFD60A] hover:shadow-2xl transition-all hover:-translate-y-1"
                >
                  <div className="absolute top-4 right-4 text-6xl font-extrabold text-gray-100 group-hover:text-[#FFD60A]/20 transition-colors">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div className="h-14 w-14 rounded-xl bg-[#0A1128] group-hover:bg-[#FFD60A] flex items-center justify-center mb-5 transition-colors">
                    <Icon className="h-7 w-7 text-[#FFD60A] group-hover:text-[#0A1128]" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-bold text-[#0A1128] mb-3">{s.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{s.description}</p>
                  <button
                    onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-sm font-bold text-[#0A1128] hover:text-[#FFD60A] transition-colors inline-flex items-center gap-1"
                  >
                    Request Service →
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;
