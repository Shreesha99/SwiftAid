/* src/pages/Help.tsx */
import React from 'react';
import { Phone, HelpCircle, ShieldCheck, Mail, MapPin, ExternalLink, Info, CheckCircle } from 'lucide-react';
import { RotaryLogo } from '../components/RotaryLogo';

const Help: React.FC = () => {
  const faqs = [
    {
      q: "How fast will the ambulance arrive?",
      a: "Our average response time in Bengaluru is under 10 minutes. We connect you to the nearest available private ambulance in our Rotary-verified network."
    },
    {
      q: "Is Swift Aid free?",
      a: "No, Swift Aid is a private ambulance network. Fares typically range from ₹800 to ₹2,500 depending on distance and ambulance type (ALS/BLS). For free emergency services, call 108."
    },
    {
      q: "Which hospitals are connected?",
      a: "We are partnered with over 300+ private and government hospitals across Bengaluru, including Manipal, Apollo, Fortis, and St. John's."
    },
    {
      q: "What is ALS vs BLS?",
      a: "BLS (Basic Life Support) is for non-critical transport. ALS (Advanced Life Support) includes a paramedic and advanced equipment for critical emergencies."
    }
  ];

  return (
    <div className="flex flex-col min-h-full bg-white p-6 gap-8 overflow-y-auto">
      <div className="flex flex-col gap-2 mt-8">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
          <HelpCircle size={24} />
        </div>
        <h1 className="text-3xl font-black text-[#1D3557] tracking-tight">Help & Support</h1>
        <p className="text-gray-500 font-medium">Everything you need to know about Swift Aid.</p>
      </div>

      {/* Emergency Contacts */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Emergency Contacts</h2>
        <div className="grid grid-cols-2 gap-4">
          <a 
            href="tel:108"
            className="p-5 bg-red-50 border border-red-100 rounded-3xl flex flex-col items-center gap-2 text-center active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#E63946] shadow-sm">
              <Phone size={20} />
            </div>
            <span className="text-xl font-black text-[#E63946]">108</span>
            <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest">Govt. Emergency</span>
          </a>
          <a 
            href="tel:112"
            className="p-5 bg-gray-50 border border-gray-100 rounded-3xl flex flex-col items-center gap-2 text-center active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm">
              <ShieldCheck size={20} />
            </div>
            <span className="text-xl font-black text-[#1D3557]">112</span>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Police / Fire</span>
          </a>
        </div>
      </div>

      {/* FAQs */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Frequently Asked Questions</h2>
        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <div key={i} className="p-5 bg-white border border-gray-100 rounded-3xl flex flex-col gap-2 shadow-sm">
              <h3 className="font-black text-[#1D3557] text-sm leading-tight">{faq.q}</h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Info */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Contact Us</h2>
        <div className="flex flex-col gap-3">
          <div className="p-5 bg-gray-50 rounded-3xl flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm">
              <Mail size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Support</span>
              <span className="text-sm font-black text-[#1D3557]">support@swiftaid.in</span>
            </div>
          </div>
          <div className="p-5 bg-gray-50 rounded-3xl flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-orange-500 shadow-sm">
              <MapPin size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Headquarters</span>
              <span className="text-sm font-black text-[#1D3557]">Indiranagar, Bengaluru</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rotary Partnership Section */}
      <div className="mt-4 mb-12 flex flex-col gap-6 p-8 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-[40px] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <RotaryLogo size={120} />
        </div>
        
        <div className="flex items-center gap-4 relative z-10">
          <RotaryLogo size={48} className="shadow-xl" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Hospital Network powered by</span>
            <span className="text-xl font-black text-[#F7A600]">Rotary International</span>
          </div>
        </div>

        <p className="text-xs text-gray-500 font-medium leading-relaxed relative z-10">
          Swift Aid is proud to partner with Rotary International to provide a seamless emergency response network. Our partnership ensures that every hospital in our network is verified for quality and response times, giving you peace of mind during critical moments.
        </p>

        <div className="flex items-center gap-2 text-[10px] font-black text-green-600 uppercase tracking-widest relative z-10">
          <CheckCircle size={14} />
          <span>300+ Verified Hospitals in Bengaluru</span>
        </div>
      </div>
    </div>
  );
};

export default Help;
