import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, ShieldCheck, LogOut, ChevronRight, Edit2, Plus, Trash2, Check, X, CheckCircle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { ROTARY_LOGO_URL } from '../utils/mapHelpers';
import Logo from '../components/Logo';

export default function Profile() {
  const { userProfile, updateProfile } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSave = () => {
    updateProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(userProfile);
    setIsEditing(false);
  };

  const handleAddContact = () => {
    setEditedProfile(prev => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, { name: '', phone: '' }]
    }));
  };

  const handleRemoveContact = (idx: number) => {
    setEditedProfile(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== idx)
    }));
  };

  const handleUpdateContact = (idx: number, field: 'name' | 'phone', value: string) => {
    setEditedProfile(prev => {
      const updated = [...prev.emergencyContacts];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, emergencyContacts: updated };
    });
  };

  return (
    <div style={{ padding: isDesktop ? '40px' : '0 20px 20px', background: '#FDFDFD', minHeight: '100%' }}>
      {/* Mobile Header */}
      {!isDesktop && (
        <header style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <Logo size={28} showText />
        </header>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1280px', margin: '0 auto' }}>
        <header style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          height: isDesktop ? 'auto' : '56px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1D3557' }}>Profile</h1>
            <p style={{ fontSize: '14px', color: '#6B7280' }}>Manage your account and emergency info</p>
          </div>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            style={{ 
              padding: '10px 16px', 
              background: 'white', 
              border: '1px solid #E5E7EB', 
              borderRadius: '12px', 
              color: '#1D3557', 
              fontSize: '14px', 
              fontWeight: 700, 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px'
            }}
          >
            <Edit2 size={16} />
            Edit
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={handleCancel}
              style={{ 
                width: '40px', 
                height: '40px', 
                background: '#F9FAFB', 
                border: '1px solid #E5E7EB', 
                borderRadius: '12px', 
                color: '#6B7280', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>
            <button 
              onClick={handleSave}
              style={{ 
                width: '40px', 
                height: '40px', 
                background: '#10B981', 
                border: 'none', 
                borderRadius: '12px', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Check size={20} />
            </button>
          </div>
        )}
      </header>

      {/* User Info Card */}
      <div style={{ 
        padding: '24px', 
        background: 'white', 
        border: '1px solid #F0F0F0', 
        borderRadius: '24px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '24px', 
            background: '#F3F4F6', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#1D3557'
          }}>
            <User size={40} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '200px' }}>
            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>Full Name</span>
                <input 
                  value={editedProfile.name || ''}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                  style={{ 
                    padding: '12px', 
                    borderRadius: '12px', 
                    border: '1px solid #E5E7EB', 
                    fontSize: '16px', 
                    fontWeight: 600, 
                    outline: 'none',
                    width: '100%',
                    background: '#F9FAFB'
                  }}
                />
              </div>
            ) : (
              <>
                <span style={{ fontWeight: 800, fontSize: '20px', color: '#1D3557' }}>{userProfile.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
                  <span style={{ fontSize: '13px', color: '#10B981', fontWeight: 700 }}>Verified Account</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '20px', 
          borderTop: '1px solid #F3F4F6', 
          paddingTop: '24px' 
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ padding: '10px', background: '#F9FAFB', borderRadius: '10px' }}>
              <Phone size={18} color="#6B7280" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>Phone Number</span>
              {isEditing ? (
                <input 
                  value={editedProfile.phone || ''}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, phone: e.target.value }))}
                  style={{ 
                    padding: '8px 0', 
                    border: 'none', 
                    borderBottom: '2px solid #E5E7EB', 
                    fontSize: '15px', 
                    fontWeight: 600, 
                    outline: 'none',
                    background: 'transparent',
                    width: '100%'
                  }}
                />
              ) : (
                <span style={{ fontSize: '15px', fontWeight: 600, color: '#1D3557' }}>{userProfile.phone}</span>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ padding: '10px', background: '#F9FAFB', borderRadius: '10px' }}>
              <Mail size={18} color="#6B7280" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>Email Address</span>
              {isEditing ? (
                <input 
                  value={editedProfile.email || ''}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, email: e.target.value }))}
                  style={{ 
                    padding: '8px 0', 
                    border: 'none', 
                    borderBottom: '2px solid #E5E7EB', 
                    fontSize: '15px', 
                    fontWeight: 600, 
                    outline: 'none',
                    background: 'transparent',
                    width: '100%'
                  }}
                />
              ) : (
                <span style={{ fontSize: '15px', fontWeight: 600, color: '#1D3557', wordBreak: 'break-all' }}>{userProfile.email}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contacts Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '12px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Emergency Contacts</h2>
          {isEditing && (
            <button 
              onClick={handleAddContact}
              style={{ 
                background: '#fef2f2', 
                border: 'none', 
                color: '#E63946', 
                padding: '6px 12px', 
                borderRadius: '8px', 
                fontSize: '12px', 
                fontWeight: 700, 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px', 
                cursor: 'pointer' 
              }}
            >
              <Plus size={14} /> Add Contact
            </button>
          )}
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {(isEditing ? editedProfile.emergencyContacts : userProfile.emergencyContacts).length === 0 ? (
            <div style={{ 
              padding: '40px 24px', 
              background: '#F9FAFB', 
              borderRadius: '20px', 
              border: '1px dashed #D1D5DB', 
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{ width: '48px', height: '48px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                <Phone size={20} color="#D1D5DB" />
              </div>
              <p style={{ fontSize: '14px', color: '#6B7280', fontWeight: 600 }}>No emergency contacts added</p>
              <p style={{ fontSize: '12px', color: '#9CA3AF' }}>Add contacts to notify them in case of emergency</p>
            </div>
          ) : (
            (isEditing ? editedProfile.emergencyContacts : userProfile.emergencyContacts).map((contact, idx) => (
              <div key={idx} style={{ 
                padding: '16px', 
                background: 'white', 
                border: '1px solid #F0F0F0', 
                borderRadius: '20px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                gap: '12px',
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: '200px' }}>
                  <div style={{ 
                    width: '44px', 
                    height: '44px', 
                    borderRadius: '14px', 
                    background: '#fef2f2', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: '#E63946' 
                  }}>
                    <Phone size={20} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                        <input 
                          placeholder="Contact Name"
                          value={contact.name || ''}
                          onChange={(e) => handleUpdateContact(idx, 'name', e.target.value)}
                          style={{ 
                            padding: '8px 12px', 
                            borderRadius: '10px', 
                            border: '1px solid #E5E7EB', 
                            fontSize: '14px', 
                            fontWeight: 700, 
                            outline: 'none',
                            background: '#F9FAFB',
                            width: '100%'
                          }}
                        />
                        <input 
                          placeholder="Phone Number"
                          value={contact.phone || ''}
                          onChange={(e) => handleUpdateContact(idx, 'phone', e.target.value)}
                          style={{ 
                            padding: '8px 12px', 
                            borderRadius: '10px', 
                            border: '1px solid #E5E7EB', 
                            fontSize: '13px', 
                            fontWeight: 600, 
                            outline: 'none',
                            background: '#F9FAFB',
                            width: '100%'
                          }}
                        />
                      </div>
                    ) : (
                      <>
                        <span style={{ fontWeight: 700, fontSize: '16px', color: '#1D3557' }}>{contact.name}</span>
                        <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: 500 }}>{contact.phone}</span>
                      </>
                    )}
                  </div>
                </div>
                {isEditing && (
                  <button 
                    onClick={() => handleRemoveContact(idx)} 
                    style={{ 
                      width: '36px', 
                      height: '36px', 
                      background: '#F9FAFB', 
                      border: 'none', 
                      borderRadius: '10px', 
                      color: '#9CA3AF', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      cursor: 'pointer' 
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Settings & Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button style={{ 
          padding: '18px', 
          borderRadius: '20px', 
          border: '1px solid #F0F0F0', 
          background: 'white', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          cursor: 'pointer'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', background: '#ECFDF5', borderRadius: '10px' }}>
              <ShieldCheck size={20} color="#10B981" />
            </div>
            <span style={{ fontWeight: 700, color: '#1D3557' }}>Privacy & Security</span>
          </div>
          <ChevronRight size={18} color="#D1D5DB" />
        </button>
        
        <button style={{ 
          padding: '18px', 
          borderRadius: '20px', 
          border: 'none', 
          background: '#fef2f2', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          color: '#E63946', 
          fontWeight: 700, 
          cursor: 'pointer' 
        }}>
          <div style={{ padding: '8px', background: 'white', borderRadius: '10px' }}>
            <LogOut size={20} />
          </div>
          <span>Log Out</span>
        </button>
      </div>

      {/* Partner Badge */}
      <div style={{ 
        padding: '24px', 
        background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)', 
        borderRadius: '24px', 
        border: '1px solid #F0F0F0',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        marginTop: '12px'
      }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          background: 'white', 
          borderRadius: '12px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '8px'
        }}>
          <img 
            src={ROTARY_LOGO_URL} 
            alt="Rotary" 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            onError={(e: any) => { e.target.style.display = 'none' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Official Partner</span>
          <span style={{ fontSize: '15px', fontWeight: 800, color: '#1D3557' }}>Rotary International</span>
          <span style={{ fontSize: '12px', color: '#6B7280' }}>Supporting emergency services in Bengaluru</span>
        </div>
      </div>
      </div>
    </div>
  );
}
