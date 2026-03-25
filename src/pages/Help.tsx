import React, { useState, useEffect, useMemo } from 'react';
import { 
  Phone, MessageCircle, Mail, HelpCircle, ShieldCheck, ChevronRight, 
  HeartPulse, Wind, Droplets, Flame, Activity, Search, X, 
  Clock, MapPin, Key, Lightbulb, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROTARY_LOGO_URL } from '../utils/mapHelpers';
import Logo from '../components/Logo';

const FAQS = [
  { 
    id: 1,
    q: 'How long does an ambulance take?', 
    a: 'Typically 8-15 minutes in Bengaluru, depending on traffic and your location. Our system automatically dispatches the nearest available unit from our network of 300+ ambulances.' 
  },
  { 
    id: 2,
    q: 'Is the service available 24/7?', 
    a: 'Yes, Swift Aid operates 24/7. Our dispatch center and partner hospitals are always on standby to provide immediate medical assistance.' 
  },
  { 
    id: 3,
    q: 'What is the cost of an ambulance?', 
    a: 'Private ambulances start at ₹800 for basic life support. Advanced life support units may cost more. Government 108 service is free of charge.' 
  },
  { 
    id: 4,
    q: 'Can I choose the hospital?', 
    a: 'While we recommend the nearest verified hospital for critical emergencies, you can request a specific destination if the patient is stable.' 
  },
  {
    id: 5,
    q: 'What information should I provide?',
    a: 'Please provide the exact location, the nature of the emergency, and a contact number. Our app automatically shares your GPS location with the driver.'
  }
];

const FIRST_AID_TIPS = [
  { 
    id: 'cpr',
    title: 'Cardiac Arrest (CPR)', 
    category: 'Critical',
    tips: [
      'Call 108 immediately.',
      'Push hard and fast in the center of the chest (100-120 bpm).',
      'Use an AED if available.'
    ],
    icon: HeartPulse,
    color: '#E63946'
  },
  { 
    id: 'choking',
    title: 'Choking', 
    category: 'Respiratory',
    tips: [
      'Give 5 back blows.',
      'Give 5 abdominal thrusts (Heimlich maneuver).',
      'Repeat until the object is forced out.'
    ],
    icon: Wind,
    color: '#3B82F6'
  },
  { 
    id: 'bleeding',
    title: 'Heavy Bleeding', 
    category: 'Trauma',
    tips: [
      'Apply direct pressure with a clean cloth.',
      'Elevate the wound above heart level.',
      'Do not remove the cloth if it becomes soaked; add more on top.'
    ],
    icon: Droplets,
    color: '#10B981'
  },
  { 
    id: 'burns',
    title: 'Burns', 
    category: 'Environmental',
    tips: [
      'Run cool (not cold) water over the burn for 10-20 mins.',
      'Cover with a loose, sterile dressing.',
      'Do not apply ice, butter, or ointments.'
    ],
    icon: Flame,
    color: '#F59E0B'
  },
  { 
    id: 'fractures',
    title: 'Fractures', 
    category: 'Trauma',
    tips: [
      'Keep the injured area still.',
      'Apply a splint to support the limb.',
      'Use ice packs to reduce swelling (not directly on skin).'
    ],
    icon: Activity,
    color: '#8B5CF6'
  }
];

function AccordionItem({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) {
  return (
    <div style={{ borderBottom: '1px solid #F3F4F6', overflow: 'hidden' }}>
      <button 
        onClick={onClick}
        style={{ 
          width: '100%', 
          padding: '20px 0', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer',
          textAlign: 'left'
        }}
      >
        <span style={{ fontSize: '15px', fontWeight: 600, color: '#1D3557', paddingRight: '16px' }}>{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={18} color="#9CA3AF" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div style={{ paddingBottom: '20px', fontSize: '14px', color: '#6B7280', lineHeight: 1.6 }}>
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Help() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredFaqs = useMemo(() => {
    if (!searchQuery) return FAQS;
    return FAQS.filter(f => 
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      f.a.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredTips = useMemo(() => {
    if (!searchQuery) return FIRST_AID_TIPS;
    return FIRST_AID_TIPS.filter(t => 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.tips.some(tip => tip.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  return (
    <div style={{ 
      padding: isDesktop ? '40px' : '0 20px 40px',
      maxWidth: '1280px',
      margin: '0 auto',
      background: '#ffffff',
      minHeight: '100%'
    }}>
      {/* Mobile Header */}
      {!isDesktop && (
        <header style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <Logo size={28} showText />
        </header>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        
        {/* Header Section */}
        <header style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px', 
          height: isDesktop ? 'auto' : '56px',
          justifyContent: 'center'
        }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#1D3557', letterSpacing: '-0.03em' }}>Help Center</h1>
            <p style={{ fontSize: '16px', color: '#6B7280', fontWeight: 500 }}>How can we help you today?</p>
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
            <div style={{ 
              position: 'absolute', 
              left: '16px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: '#9CA3AF' 
            }}>
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Search for questions or first aid tips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '16px 16px 16px 48px', 
                borderRadius: '16px', 
                border: '1px solid #E5E7EB', 
                fontSize: '15px',
                background: '#F9FAFB',
                outline: 'none'
              }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ 
                  position: 'absolute', 
                  right: '16px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  color: '#9CA3AF'
                }}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </header>

        {/* Emergency Quick Actions */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isDesktop ? 'repeat(2, 1fr)' : '1fr', 
          gap: '16px' 
        }}>
          <div 
            style={{ 
              padding: '24px', 
              background: '#FEF2F2', 
              borderRadius: '24px', 
              border: '1px solid #FEE2E2',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#E63946', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <Phone size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#E63946' }}>Emergency 108</h3>
                <p style={{ fontSize: '13px', color: '#B91C1C', fontWeight: 500 }}>Immediate assistance</p>
              </div>
            </div>
            <a href="tel:108" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '14px', 
              background: '#E63946', 
              color: 'white', 
              borderRadius: '12px', 
              textDecoration: 'none', 
              fontWeight: 700,
              fontSize: '15px'
            }}>Call Now</a>
          </div>

          <div 
            style={{ 
              padding: '24px', 
              background: '#F8FAFC', 
              borderRadius: '24px', 
              border: '1px solid #F1F5F9',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <Mail size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1E293B' }}>Email Us</h3>
                <p style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>Response in 24 hours</p>
              </div>
            </div>
            <a href="mailto:support@swiftaid.com" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '14px', 
              background: '#64748B', 
              color: 'white', 
              borderRadius: '12px', 
              textDecoration: 'none', 
              fontWeight: 700,
              fontSize: '15px'
            }}>Send Email</a>
          </div>
        </div>

        {/* FAQs Section */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <HelpCircle size={20} color="#1D3557" />
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1D3557' }}>Common Questions</h2>
          </div>
          <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #F3F4F6', padding: '0 24px' }}>
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <AccordionItem 
                  key={faq.id} 
                  question={faq.q} 
                  answer={faq.a} 
                  isOpen={openFaqId === faq.id}
                  onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                />
              ))
            ) : (
              <div style={{ padding: '40px 0', textAlign: 'center', color: '#9CA3AF' }}>
                No questions found matching "{searchQuery}"
              </div>
            )}
          </div>
        </section>

        {/* First Aid Tips Section */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity size={20} color="#1D3557" />
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1D3557' }}>First Aid Guide</h2>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isDesktop ? 'repeat(auto-fill, minmax(340px, 1fr))' : '1fr', 
            gap: '20px' 
          }}>
            {filteredTips.length > 0 ? (
              filteredTips.map((tip) => (
                <motion.div 
                  key={tip.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ 
                    padding: '24px', 
                    background: '#ffffff', 
                    borderRadius: '24px', 
                    border: '1px solid #F3F4F6',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: '14px', 
                      background: `${tip.color}15`, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: tip.color 
                    }}>
                      <tip.icon size={24} />
                    </div>
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: 700, 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.05em',
                      color: tip.color,
                      background: `${tip.color}10`,
                      padding: '4px 8px',
                      borderRadius: '6px'
                    }}>{tip.category}</span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1D3557', marginBottom: '8px' }}>{tip.title}</h3>
                    <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {tip.tips.map((t, i) => (
                        <li key={i} style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.5 }}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', padding: '40px 0', textAlign: 'center', color: '#9CA3AF' }}>
                No first aid tips found matching "{searchQuery}"
              </div>
            )}
          </div>
        </section>

        {/* While Waiting Guide */}
        <section style={{ 
          padding: '32px', 
          background: '#1D3557', 
          borderRadius: '32px', 
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '24px', letterSpacing: '-0.02em' }}>While waiting for help...</h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: isDesktop ? 'repeat(2, 1fr)' : '1fr', 
              gap: '24px' 
            }}>
              {[
                { icon: Phone, text: 'Stay calm and stay on the line with the dispatcher.' },
                { icon: MapPin, text: 'Clear a path for the paramedics to enter.' },
                { icon: Activity, text: 'Gather the patient\'s medications and ID.' },
                { icon: Lightbulb, text: 'Unlock the front door and turn on outside lights.' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '12px', 
                    background: 'rgba(255,255,255,0.1)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    flexShrink: 0 
                  }}>
                    <item.icon size={20} color="white" />
                  </div>
                  <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, fontWeight: 500 }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Decorative background element */}
          <div style={{ 
            position: 'absolute', 
            right: '-40px', 
            bottom: '-40px', 
            width: '200px', 
            height: '200px', 
            borderRadius: '50%', 
            background: 'rgba(255,255,255,0.03)' 
          }} />
        </section>

        {/* Partnership Footer */}
        <footer style={{ 
          padding: '32px', 
          background: '#F8FAFC', 
          borderRadius: '32px', 
          border: '1px solid #F1F5F9',
          display: 'flex',
          flexDirection: isDesktop ? 'row' : 'column',
          alignItems: 'center',
          gap: '32px',
          textAlign: isDesktop ? 'left' : 'center'
        }}>
          <div style={{ 
            width: '120px', 
            height: '120px', 
            background: 'white', 
            borderRadius: '24px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '20px',
            border: '1px solid #F1F5F9',
            flexShrink: 0
          }}>
            <img 
              src={ROTARY_LOGO_URL} 
              alt="Rotary International" 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              onError={(e: any) => { e.target.style.display = 'none' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: isDesktop ? 'flex-start' : 'center' }}>
              <ShieldCheck size={20} color="#F7A600" />
              <span style={{ fontWeight: 800, fontSize: '18px', color: '#1D3557' }}>Verified & Trusted Service</span>
            </div>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, fontWeight: 500 }}>
              Swift Aid is powered by Rotary International's network of 300+ verified hospitals and ambulance services across Bengaluru. We ensure the highest standards of emergency care.
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
}
