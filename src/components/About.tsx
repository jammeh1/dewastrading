import React from 'react';
import { CheckCircle2, Target, Eye, Handshake } from 'lucide-react';
import { BRAND } from '@/lib/constants';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=600&q=80"
                alt="Electrical work"
                className="rounded-2xl h-64 w-full object-cover shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=600&q=80"
                alt="Solar panel"
                className="rounded-2xl h-64 w-full object-cover shadow-lg mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1581092918484-8313e9c68b8f?w=600&q=80"
                alt="Team"
                className="rounded-2xl h-64 w-full object-cover shadow-lg -mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80"
                alt="Installation"
                className="rounded-2xl h-64 w-full object-cover shadow-lg"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-[#FFD60A] text-[#0A1128] p-6 rounded-2xl shadow-xl hidden md:block">
              <div className="text-4xl font-extrabold">10+</div>
              <div className="text-sm font-bold">Years of Excellence</div>
            </div>
          </div>
          <div>
            <div className="inline-block text-[#FFD60A] font-bold text-sm tracking-widest mb-3">
              ABOUT DEWAS TRADING
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0A1128] mb-6">
              Your Trusted Partner in Power & Water Solutions
            </h2>
            <div className="w-24 h-1 bg-[#FFD60A] mb-6" />
            <p className="text-gray-600 mb-5 leading-relaxed">
              DEWAS TRADING is a full-service electrical and solar installation company
              based in The Gambia. We specialize in delivering reliable, professional,
              and accessible energy and water solutions across Brikama, Penyem, Somita,
              Bwiam, and surrounding regions.
            </p>
            <div className="bg-gradient-to-br from-[#0A1128] to-[#1e3a8a] text-white p-5 rounded-xl mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Handshake className="h-5 w-5 text-[#FFD60A]" />
                <div className="font-bold">Official Partnership</div>
              </div>
              <p className="text-sm text-gray-200">
                Proudly partnered with <strong className="text-[#FFD60A]">{BRAND.partner}</strong> to
                deliver premium borehole drilling and water installation services.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#FFD60A] flex items-center justify-center flex-shrink-0">
                  <Target className="h-5 w-5 text-[#0A1128]" />
                </div>
                <div>
                  <div className="font-bold text-[#0A1128]">Our Mission</div>
                  <p className="text-xs text-gray-600">
                    Provide quality, accessible, and professional services.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#FFD60A] flex items-center justify-center flex-shrink-0">
                  <Eye className="h-5 w-5 text-[#0A1128]" />
                </div>
                <div>
                  <div className="font-bold text-[#0A1128]">Our Vision</div>
                  <p className="text-xs text-gray-600">
                    Lead The Gambia in sustainable energy & water solutions.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {[
                'Licensed & insured technicians',
                'Locally-owned with community roots',
                'Affordable pricing with quality guarantee',
                'Full after-sales support & maintenance',
              ].map((p) => (
                <div key={p} className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#FFD60A]" />
                  <span className="text-gray-700 text-sm font-medium">{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
