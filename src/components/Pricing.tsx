import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Sun, Zap, Check } from 'lucide-react';
import { formatGMD } from '@/lib/constants';

interface PricingItem {
  id: string;
  category: string;
  capacity: string;
  price: number;
}

const Pricing: React.FC = () => {
  const [items, setItems] = useState<PricingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('pricing')
        .select('*')
        .order('price', { ascending: true });
      if (data) setItems(data as PricingItem[]);
      setLoading(false);
    })();
  }, []);

  const electric = items.filter((i) => i.category === 'electric');
  const solar = items.filter((i) => i.category === 'solar');

  const PackageCard = ({
    title,
    subtitle,
    icon: Icon,
    items,
    highlight,
  }: {
    title: string;
    subtitle: string;
    icon: typeof Sun;
    items: PricingItem[];
    highlight?: boolean;
  }) => (
    <div
      className={`rounded-2xl p-8 border-2 shadow-lg ${
        highlight
          ? 'bg-[#0A1128] text-white border-[#FFD60A]'
          : 'bg-white text-[#0A1128] border-gray-200'
      }`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div
          className={`h-12 w-12 rounded-xl flex items-center justify-center ${
            highlight ? 'bg-[#FFD60A]' : 'bg-[#0A1128]'
          }`}
        >
          <Icon className={`h-6 w-6 ${highlight ? 'text-[#0A1128]' : 'text-[#FFD60A]'}`} />
        </div>
        <div>
          <h3 className="text-2xl font-extrabold">{title}</h3>
          <p className={`text-sm ${highlight ? 'text-gray-300' : 'text-gray-500'}`}>{subtitle}</p>
        </div>
      </div>
      <div className={`my-6 border-t ${highlight ? 'border-white/20' : 'border-gray-200'}`} />
      <ul className="space-y-3">
        {items.map((it) => (
          <li
            key={it.id}
            className={`flex items-center justify-between p-3 rounded-lg ${
              highlight ? 'bg-white/5' : 'bg-gray-50'
            } hover:scale-[1.02] transition-transform`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  highlight ? 'bg-[#FFD60A] text-[#0A1128]' : 'bg-[#0A1128] text-[#FFD60A]'
                }`}
              >
                <Check className="h-4 w-4" />
              </div>
              <span className="font-semibold">{it.capacity}</span>
            </div>
            <span className={`font-extrabold ${highlight ? 'text-[#FFD60A]' : 'text-[#0A1128]'}`}>
              {formatGMD(it.price)}
            </span>
          </li>
        ))}
      </ul>
      <button
        onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
        className={`w-full mt-6 py-3 rounded-lg font-bold transition-colors ${
          highlight
            ? 'bg-[#FFD60A] text-[#0A1128] hover:bg-yellow-300'
            : 'bg-[#0A1128] text-white hover:bg-[#1e3a8a]'
        }`}
      >
        Request This Package
      </button>
    </div>
  );

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-block text-[#FFD60A] font-bold text-sm tracking-widest mb-3">
            TRANSPARENT PRICING
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#0A1128] mb-4">
            Borehole Installation Packages
          </h2>
          <div className="w-24 h-1 bg-[#FFD60A] mx-auto mb-6" />
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Choose the right water tank capacity for your home, farm, or business.
            All packages include installation and warranty.
          </p>
        </div>
        {loading ? (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 animate-pulse rounded-2xl" />
            <div className="h-96 bg-gray-200 animate-pulse rounded-2xl" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <PackageCard
              title="Electric Package"
              subtitle="Grid-powered pumping system"
              icon={Zap}
              items={electric}
            />
            <PackageCard
              title="Solar Package"
              subtitle="Off-grid solar-powered system"
              icon={Sun}
              items={solar}
              highlight
            />
          </div>
        )}
        <p className="text-center text-sm text-gray-500 mt-8">
          * Prices in Gambian Dalasi (GMD). Custom capacities available on request.
        </p>
      </div>
    </section>
  );
};

export default Pricing;
