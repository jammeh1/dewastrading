import React from 'react';
import { ArrowRight, Phone, Shield, Award, Users } from 'lucide-react';
import { BRAND } from '@/lib/constants';

const Hero: React.FC = () => {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative overflow-hidden bg-[#0A1128] text-white">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1920&q=80"
          alt="Solar panels"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A1128] via-[#0A1128]/90 to-[#1e3a8a]/80" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28 lg:py-36">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#FFD60A]/10 border border-[#FFD60A]/30 text-[#FFD60A] px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              <Shield className="h-4 w-4" />
              The Gambia's Trusted Installer
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Powering Homes &<br />
              <span className="text-[#FFD60A]">Businesses</span> Across<br />
              The Gambia
            </h1>
            <p className="text-xl md:text-2xl font-semibold text-gray-200 mb-4">
              "{BRAND.slogan}"
            </p>
            <p className="text-gray-300 mb-8 max-w-xl text-base md:text-lg">
              Solar, Electrical, CCTV, Borehole & Logistics. Licensed experts delivering
              quality installations in Brikama, Penyem, Somita, Bwiam and beyond.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollTo('#contact')}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#FFD60A] text-[#0A1128] font-bold rounded-lg hover:bg-yellow-300 transition-all hover:scale-105 shadow-lg"
              >
                Get Free Quote <ArrowRight className="h-5 w-5" />
              </button>
              <a
                href={`tel:${BRAND.phones[0].replace(/\s/g, '')}`}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 backdrop-blur border border-white/20 text-white font-bold rounded-lg hover:bg-white/20 transition-all"
              >
                <Phone className="h-5 w-5" /> Call Now
              </a>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-12 max-w-lg">
              {[
                { icon: Users, label: 'Happy Clients', val: '500+' },
                { icon: Award, label: 'Years Experience', val: '10+' },
                { icon: Shield, label: 'Warranty', val: '100%' },
              ].map((s) => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center backdrop-blur">
                  <s.icon className="h-5 w-5 text-[#FFD60A] mx-auto mb-1" />
                  <div className="text-2xl font-extrabold">{s.val}</div>
                  <div className="text-xs text-gray-400">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:block relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-[#FFD60A]/20">
              <img
                src="https://images.unsplash.com/photo-1605152276897-4f618f831968?w=800&q=80"
                alt="Solar installation"
                className="w-full h-[520px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-[#FFD60A] text-[#0A1128] p-5 rounded-xl shadow-xl max-w-[220px]">
              <div className="text-3xl font-extrabold">24/7</div>
              <div className="text-sm font-semibold">Emergency Support Available</div>
            </div>
            <div className="absolute -top-4 -right-4 bg-white text-[#0A1128] p-4 rounded-xl shadow-xl">
              <div className="text-xs text-gray-500 font-semibold">PARTNERED WITH</div>
              <div className="font-bold text-sm">Lambatino S&N</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
