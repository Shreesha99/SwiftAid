import React from 'react';
import { Phone, MessageCircle, Mail, HelpCircle, ShieldCheck, ChevronRight, HeartPulse, Wind, Droplets, Flame, Activity } from 'lucide-react';
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

      {/* Emergency First Aid Tips */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontSize: '13px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Emergency First Aid Tips</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { 
              title: 'Cardiac Arrest (CPR)', 
              tips: [
                'Call 108 immediately.',
                'Push hard and fast in the center of the chest (100-120 bpm).',
                'Use an AED if available.'
              ],
              icon: HeartPulse
            },
            { 
              title: 'Choking', 
              tips: [
                'Give 5 back blows.',
                'Give 5 abdominal thrusts (Heimlich maneuver).',
                'Repeat until the object is forced out.'
              ],
              icon: Wind
            },
            { 
              title: 'Heavy Bleeding', 
              tips: [
                'Apply direct pressure with a clean cloth.',
                'Elevate the wound above heart level.',
                'Do not remove the cloth if it becomes soaked; add more on top.'
              ],
              icon: Droplets
            },
            { 
              title: 'Burns', 
              tips: [
                'Run cool (not cold) water over the burn for 10-20 mins.',
                'Cover with a loose, sterile dressing.',
                'Do not apply ice, butter, or ointments.'
              ],
              icon: Flame
            },
            { 
              title: 'Fractures', 
              tips: [
                'Keep the injured area still.',
                'Apply a splint to support the limb.',
                'Use ice packs to reduce swelling (not directly on skin).'
              ],
              icon: Activity
            }
          ].map((tip, idx) => (
            <div key={idx} style={{ padding: '20px', background: 'white', border: '1px solid #F0F0F0', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E63946' }}>
                  <tip.icon size={18} />
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 700 }}>{tip.title}</h3>
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {tip.tips.map((t, i) => (
                  <li key={i} style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.4 }}>{t}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* What to do while waiting */}
      <div style={{ padding: '24px', background: '#1D3557', borderRadius: '16px', color: 'white', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700 }}>While waiting for help...</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            'Stay calm and stay on the line with the dispatcher.',
            'Clear a path for the paramedics to enter.',
            'Gather the patient\'s medications and ID.',
            'Unlock the front door and turn on outside lights.'
          ].map((text, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', lineHeight: 1.4 }}>{text}</p>
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
