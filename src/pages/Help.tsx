import React from 'react';
import { Phone, MessageCircle, Mail, HelpCircle, ShieldCheck, ChevronRight } from 'lucide-react';
import { ROTARY_LOGO_URL } from '../utils/mapHelpers';

export default function Help() {
  const faqs = [
    { q: 'How long does an ambulance take?', a: 'Typically 8-15 minutes in Bengaluru, depending on traffic and your location.' },
    { q: 'Is the service available 24/7?', a: 'Yes, Swift Aid operates 24/7 with a network of verified hospitals.' },
    { q: 'What is the cost of an ambulance?', a: 'Private ambulances start at ₹800. Govt 108 service is free.' },
    { q: 'Can I choose the hospital?', a: 'We recommend the nearest verified hospital, but you can request a specific one.' },
  ];

  return (
    <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700 }}>Help & Support</h1>
        <p style={{ fontSize: '14px', color: '#6B7280' }}>We're here to assist you 24/7</p>
      </header>

      {/* Urgent Help */}
      <div style={{ padding: '24px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#E63946', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Phone size={20} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 700, fontSize: '16px', color: '#E63946' }}>Emergency? Call 108</span>
            <span style={{ fontSize: '13px', color: '#6B7280' }}>Direct line for immediate assistance</span>
          </div>
        </div>
        <a href="tel:108" className="primary-button" style={{ textDecoration: 'none', background: '#E63946' }}>Call Now</a>
      </div>

      {/* Contact Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h2 style={{ fontSize: '13px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact us</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { icon: MessageCircle, label: 'Chat with Support', color: '#3B82F6' },
            { icon: Mail, label: 'Email Support', color: '#6B7280' },
          ].map((item, idx) => (
            <div key={idx} style={{ padding: '16px', background: 'white', border: '1px solid #F0F0F0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <item.icon size={20} color={item.color} />
                <span style={{ fontWeight: 600 }}>{item.label}</span>
              </div>
              <ChevronRight size={18} color="#D1D5DB" />
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h2 style={{ fontSize: '13px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} style={{ padding: '16px', background: '#F9FAFB', borderRadius: '12px', border: '1px solid #F0F0F0' }}>
              <p style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{faq.q}</p>
              <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.5 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Partnership */}
      <div style={{ marginTop: 'auto', padding: '24px', background: '#FFF8E7', borderRadius: '16px', border: '1px solid #F7A600', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', textAlign: 'center' }}>
        <img 
          src={ROTARY_LOGO_URL} 
          alt="Rotary International" 
          height="32" 
          style={{ objectFit: 'contain' }}
          onError={(e: any) => { e.target.style.display = 'none' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontWeight: 700, fontSize: '16px' }}>Rotary International Partnership</span>
          <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.5 }}>
            Swift Aid is powered by Rotary's network of 300+ verified hospitals and ambulance services across Bengaluru.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#F7A600', fontSize: '13px', fontWeight: 700 }}>
          <ShieldCheck size={16} />
          <span>Verified & Trusted Service</span>
        </div>
      </div>
    </div>
  );
}
