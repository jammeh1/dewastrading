import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Phone, MapPin, Mail, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { BRAND } from '@/lib/constants';

const Contact: React.FC = () => {
  const [form, setForm] = useState({ name: '', contact: '', location: BRAND.locations[0], message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.contact.trim() || !form.message.trim()) {
      setError('Please fill out all required fields.');
      return;
    }
    setStatus('sending');
    const { data, error } = await supabase
      .from('messages')
      .insert([form])
      .select()
      .single();
    if (error) {
      setStatus('error');
      setError(error.message);
    } else {
      // Fire-and-forget email notification to the admin via edge function
      supabase.functions
        .invoke('notify-new-message', { body: { record: data } })
        .catch((err) => console.warn('notify-new-message failed:', err));

      setStatus('success');
      setForm({ name: '', contact: '', location: BRAND.locations[0], message: '' });
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <section id="contact" className="py-20 bg-[#0A1128] text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD60A]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="text-center mb-14">
          <div className="inline-block text-[#FFD60A] font-bold text-sm tracking-widest mb-3">
            GET IN TOUCH
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
            Request a Free Quote Today
          </h2>
          <div className="w-24 h-1 bg-[#FFD60A] mx-auto" />
        </div>
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-xl bg-[#FFD60A] flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-[#0A1128]" />
                </div>
                <div>
                  <div className="font-bold mb-2">Call Us</div>
                  {BRAND.phones.map((p) => (
                    <a
                      key={p}
                      href={`tel:${p.replace(/\s/g, '')}`}
                      className="block text-gray-300 hover:text-[#FFD60A] transition"
                    >
                      {p}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-xl bg-[#FFD60A] flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-[#0A1128]" />
                </div>
                <div>
                  <div className="font-bold mb-2">Our Locations</div>
                  <div className="grid grid-cols-2 gap-2">
                    {BRAND.locations.map((l) => (
                      <div key={l} className="text-gray-300 text-sm">• {l}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-xl bg-[#FFD60A] flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-[#0A1128]" />
                </div>
                <div>
                  <div className="font-bold mb-2">Email</div>
                  <a href={`mailto:${BRAND.email}`} className="text-gray-300 hover:text-[#FFD60A]">
                    {BRAND.email}
                  </a>
                </div>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden h-56 border border-white/10">
              <iframe
                src="https://maps.google.com/maps?q=Brikama,Gambia&t=&z=11&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full"
                title="Map"
                loading="lazy"
              />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 md:p-8 text-[#0A1128] shadow-2xl">
            <h3 className="text-2xl font-extrabold mb-1">Send us a message</h3>
            <p className="text-gray-500 text-sm mb-6">We'll get back to you within 24 hours.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-semibold mb-1 block">Full Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/20 outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1 block">Phone / Email *</label>
                <input
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/20 outline-none"
                  placeholder="+220 000 0000 or email@example.com"
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1 block">Nearest Location</label>
                <select
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/20 outline-none bg-white"
                >
                  {BRAND.locations.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold mb-1 block">Message *</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/20 outline-none resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              {status === 'success' && (
                <div className="flex items-center gap-2 bg-green-50 text-green-700 p-3 rounded-lg">
                  <CheckCircle2 className="h-5 w-5" />
                  Message sent! We'll be in touch soon.
                </div>
              )}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-[#0A1128] hover:bg-[#1e3a8a] text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {status === 'sending' ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Sending...</>
                ) : (
                  <><Send className="h-5 w-5" /> Send Message</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
