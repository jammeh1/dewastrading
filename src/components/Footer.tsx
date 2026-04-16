import React from 'react';
import { Zap, Phone, MapPin, Mail, Facebook, Instagram, Twitter } from 'lucide-react';
import { BRAND } from '@/lib/constants';

const Footer: React.FC = () => {
  const scroll = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer className="bg-[#050914] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-lg bg-[#FFD60A] flex items-center justify-center">
                <Zap className="h-6 w-6 text-[#0A1128]" strokeWidth={2.5} />
              </div>
              <div>
                <div className="font-extrabold text-white text-lg">DEWAS</div>
                <div className="text-[10px] tracking-widest text-[#FFD60A] font-semibold">TRADING</div>
              </div>
            </div>
            <p className="text-sm mb-4">
              {BRAND.slogan}. Powering homes and businesses across The Gambia with quality
              electrical, solar, and water solutions.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <button
                  key={i}
                  className="h-9 w-9 rounded-full bg-white/10 hover:bg-[#FFD60A] hover:text-[#0A1128] flex items-center justify-center transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              {['Solar Installation', 'Electrical Installation', 'CCTV Installation', 'Borehole Drilling', 'Logistics', 'Lumberjack Services'].map((s) => (
                <li key={s}>
                  <button onClick={() => scroll('#services')} className="hover:text-[#FFD60A] transition-colors">{s}</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { l: 'Home', id: '#home' },
                { l: 'About', id: '#about' },
                { l: 'Pricing', id: '#pricing' },
                { l: 'Gallery', id: '#gallery' },
                { l: 'Contact', id: '#contact' },
              ].map((i) => (
                <li key={i.l}>
                  <button onClick={() => scroll(i.id)} className="hover:text-[#FFD60A] transition-colors">{i.l}</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-[#FFD60A] mt-1 flex-shrink-0" />
                <div>
                  {BRAND.phones.map((p) => <div key={p}>{p}</div>)}
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#FFD60A] mt-1 flex-shrink-0" />
                <span>{BRAND.locations.join(', ')}</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-[#FFD60A] mt-1 flex-shrink-0" />
                <a href={`mailto:${BRAND.email}`} className="hover:text-[#FFD60A]">{BRAND.email}</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div>© {new Date().getFullYear()} DEWAS Trading. All rights reserved.</div>
          <div>In partnership with <span className="text-[#FFD60A] font-semibold">{BRAND.partner}</span></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
