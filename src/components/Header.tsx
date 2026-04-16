import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Zap, Phone } from 'lucide-react';
import { BRAND } from '@/lib/constants';

const links = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const scrollTo = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0A1128] text-white shadow-lg">
      <div className="bg-[#FFD60A] text-[#0A1128] text-xs md:text-sm py-1.5 px-4 flex flex-wrap justify-center md:justify-between items-center gap-2">
        <div className="flex items-center gap-2 font-semibold">
          <Phone className="h-3.5 w-3.5" />
          <span>{BRAND.phones[0]} • {BRAND.phones[1]}</span>
        </div>
        <div className="hidden md:block font-medium">
          Serving {BRAND.locations.join(' • ')}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-10 w-10 rounded-lg bg-[#FFD60A] flex items-center justify-center group-hover:rotate-6 transition-transform">
            <Zap className="h-6 w-6 text-[#0A1128]" strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-extrabold text-lg leading-tight">DEWAS</div>
            <div className="text-[10px] tracking-widest text-[#FFD60A] font-semibold">TRADING</div>
          </div>
        </Link>
        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <button
              key={l.label}
              onClick={() => scrollTo(l.href)}
              className="text-sm font-medium hover:text-[#FFD60A] transition-colors"
            >
              {l.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={() => scrollTo('#contact')}
            className="hidden md:inline-flex px-4 py-2 rounded-lg bg-[#FFD60A] text-[#0A1128] font-bold text-sm hover:bg-yellow-300 transition-colors"
          >
            Get Quote
          </button>
          <button
            onClick={() => navigate('/admin')}
            className="hidden md:inline-flex text-xs text-gray-300 hover:text-[#FFD60A]"
          >
            Admin
          </button>
          <button className="lg:hidden" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden bg-[#0A1128] border-t border-white/10 px-4 py-3 space-y-2">
          {links.map((l) => (
            <button
              key={l.label}
              onClick={() => scrollTo(l.href)}
              className="block w-full text-left py-2 font-medium hover:text-[#FFD60A]"
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => { setOpen(false); navigate('/admin'); }}
            className="block w-full text-left py-2 text-gray-400 text-sm"
          >
            Admin Login
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
