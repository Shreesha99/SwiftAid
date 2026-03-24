import React, { useState } from 'react';
import { User, Phone, Mail, ShieldCheck, LogOut, ChevronRight, Edit2, Plus, Trash2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { ROTARY_LOGO_URL } from '../utils/mapHelpers';

export default function Profile() {
  const { userProfile, updateProfile } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile);

  const handleSave = () => {
    updateProfile(editedProfile);
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
    <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700 }}>Profile</h1>
          <p style={{ fontSize: '14px', color: '#6B7280' }}>Manage your account and emergency info</p>
        </div>
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          style={{ padding: '8px 16px', background: isEditing ? '#10B981' : '#F9FAFB', border: '1px solid #F0F0F0', borderRadius: '8px', color: isEditing ? 'white' : '#1D3557', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          {isEditing ? <CheckCircle size={16} /> : <Edit2 size={16} />}
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </header>

      {/* User Info */}
      <div style={{ padding: '24px', background: 'white', border: '1px solid #F0F0F0', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#F9FAFB', border: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={32} color="#1D3557" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {isEditing ? (
              <input 
                value={editedProfile.name}
                onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                style={{ padding: '8px', borderRadius: '8px', border: '1px solid #F0F0F0', fontSize: '18px', fontWeight: 700, outline: 'none' }}
              />
            ) : (
              <span style={{ fontWeight: 700, fontSize: '18px' }}>{userProfile.name}</span>
            )}
            <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 600 }}>Verified User</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid #F9FAFB', paddingTop: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Phone size={18} color="#6B7280" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>Phone</span>
              {isEditing ? (
                <input 
                  value={editedProfile.phone}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, phone: e.target.value }))}
                  style={{ padding: '4px', borderRadius: '4px', border: '1px solid #F0F0F0', fontSize: '14px', fontWeight: 600, outline: 'none' }}
                />
              ) : (
                <span style={{ fontSize: '14px', fontWeight: 600 }}>{userProfile.phone}</span>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Mail size={18} color="#6B7280" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>Email</span>
              {isEditing ? (
                <input 
                  value={editedProfile.email}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, email: e.target.value }))}
                  style={{ padding: '4px', borderRadius: '4px', border: '1px solid #F0F0F0', fontSize: '14px', fontWeight: 600, outline: 'none' }}
                />
              ) : (
                <span style={{ fontSize: '14px', fontWeight: 600 }}>{userProfile.email}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '13px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Emergency Contacts</h2>
          {isEditing && (
            <button 
              onClick={handleAddContact}
              style={{ background: 'none', border: 'none', color: '#E63946', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
            >
              <Plus size={16} /> Add
            </button>
          )}
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {(isEditing ? editedProfile.emergencyContacts : userProfile.emergencyContacts).length === 0 ? (
            <div style={{ padding: '24px', background: '#F9FAFB', borderRadius: '12px', border: '1px dashed #D1D5DB', textAlign: 'center' }}>
              <p style={{ fontSize: '13px', color: '#6B7280', fontWeight: 600 }}>No emergency contacts added</p>
            </div>
          ) : (
            (isEditing ? editedProfile.emergencyContacts : userProfile.emergencyContacts).map((contact, idx) => (
              <div key={idx} style={{ padding: '16px', background: 'white', border: '1px solid #F0F0F0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E63946' }}>
                    <Phone size={18} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <input 
                          placeholder="Name"
                          value={contact.name}
                          onChange={(e) => handleUpdateContact(idx, 'name', e.target.value)}
                          style={{ padding: '4px', borderRadius: '4px', border: '1px solid #F0F0F0', fontSize: '14px', fontWeight: 700, outline: 'none' }}
                        />
                        <input 
                          placeholder="Phone"
                          value={contact.phone}
                          onChange={(e) => handleUpdateContact(idx, 'phone', e.target.value)}
                          style={{ padding: '4px', borderRadius: '4px', border: '1px solid #F0F0F0', fontSize: '12px', fontWeight: 600, outline: 'none' }}
                        />
                      </div>
                    ) : (
                      <>
                        <span style={{ fontWeight: 700, fontSize: '15px' }}>{contact.name}</span>
                        <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 600 }}>{contact.phone}</span>
                      </>
                    )}
                  </div>
                </div>
                {isEditing && (
                  <button onClick={() => handleRemoveContact(idx)} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}>
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Account Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
        <button style={{ padding: '16px', borderRadius: '12px', border: '1px solid #F0F0F0', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldCheck size={20} color="#10B981" />
            <span style={{ fontWeight: 600 }}>Privacy & Data</span>
          </div>
          <ChevronRight size={18} color="#D1D5DB" />
        </button>
        <button style={{ padding: '16px', borderRadius: '12px', border: '1px solid #fee2e2', background: '#fef2f2', display: 'flex', alignItems: 'center', gap: '12px', color: '#E63946', fontWeight: 700, cursor: 'pointer' }}>
          <LogOut size={20} />
          <span>Log Out</span>
        </button>
      </div>

      {/* Partner Badge */}
      <div style={{ 
        padding: '20px', 
        background: '#F9FAFB', 
        borderRadius: '16px', 
        border: '1px solid #F0F0F0',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginTop: '12px'
      }}>
        <img 
          src={ROTARY_LOGO_URL} 
          alt="Rotary International" 
          height="32" 
          style={{ objectFit: 'contain' }}
          onError={(e: any) => { e.target.style.display = 'none' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase' }}>Official Partner</span>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#1D3557' }}>Rotary International</span>
        </div>
      </div>
    </div>
  );
}

function CheckCircle({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
}
