/* src/pages/Profile.tsx */
import React, { useState } from 'react';
import { User, Phone, Droplet, AlertCircle, Save, Plus, Trash2, ShieldCheck, Heart } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Profile: React.FC = () => {
  const { userProfile, updateProfile } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userProfile);
  const [newContact, setNewContact] = useState({ name: '', phone: '' });
  const [showAddContact, setShowAddContact] = useState(false);

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
    // Using a custom toast-like alert would be better, but keeping it simple for now
  };

  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      const updatedContacts = [...formData.emergencyContacts, newContact];
      setFormData({ ...formData, emergencyContacts: updatedContacts });
      setNewContact({ name: '', phone: '' });
      setShowAddContact(false);
    }
  };

  const removeContact = (index: number) => {
    const updatedContacts = formData.emergencyContacts.filter((_, i) => i !== index);
    setFormData({ ...formData, emergencyContacts: updatedContacts });
  };

  return (
    <div className="flex flex-col p-6 gap-8 min-h-full bg-white overflow-y-auto pb-24">
      <div className="flex items-center justify-between mt-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black text-[#1D3557] tracking-tight">Profile</h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Medical ID & Settings</p>
        </div>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={cn(
            "px-6 py-2.5 rounded-2xl font-black text-xs transition-all active:scale-95",
            isEditing 
              ? "bg-green-500 text-white shadow-lg shadow-green-100" 
              : "bg-gray-100 text-[#1D3557]"
          )}
        >
          {isEditing ? 'SAVE CHANGES' : 'EDIT PROFILE'}
        </button>
      </div>

      {/* Personal Info */}
      <div className="flex flex-col gap-4">
        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Personal Information</h2>
        <div className="flex flex-col gap-6 bg-white border border-gray-100 p-6 rounded-[32px] shadow-sm">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <User size={12} /> Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                className="w-full p-4 bg-gray-50 rounded-2xl text-sm font-bold border border-gray-100 focus:outline-none focus:border-[#E63946] transition-colors"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            ) : (
              <span className="text-lg font-black text-[#1D3557] px-1">{userProfile.name || 'Not set'}</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Phone size={12} /> Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                className="w-full p-4 bg-gray-50 rounded-2xl text-sm font-bold border border-gray-100 focus:outline-none focus:border-[#E63946] transition-colors"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            ) : (
              <span className="text-lg font-black text-[#1D3557] px-1">{userProfile.phone || 'Not set'}</span>
            )}
          </div>
        </div>
      </div>

      {/* Medical Info */}
      <div className="flex flex-col gap-4">
        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Medical Information</h2>
        <div className="flex flex-col gap-6 bg-white border border-gray-100 p-6 rounded-[32px] shadow-sm">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Droplet size={12} className="text-red-500" /> Blood Group
            </label>
            {isEditing ? (
              <select
                className="w-full p-4 bg-gray-50 rounded-2xl text-sm font-bold border border-gray-100 focus:outline-none focus:border-[#E63946] transition-colors appearance-none"
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              >
                <option value="">Select</option>
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            ) : (
              <div className="flex items-center gap-2 px-1">
                <span className="text-lg font-black text-[#1D3557]">{userProfile.bloodGroup || 'Not set'}</span>
                {userProfile.bloodGroup && <ShieldCheck size={16} className="text-green-500" />}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <AlertCircle size={12} className="text-orange-500" /> Allergies & Conditions
            </label>
            {isEditing ? (
              <textarea
                className="w-full p-4 bg-gray-50 rounded-2xl text-sm font-bold border border-gray-100 focus:outline-none focus:border-[#E63946] transition-colors min-h-[100px]"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                placeholder="e.g. Penicillin, Peanuts, Heart Condition"
              />
            ) : (
              <span className="text-sm font-bold text-[#1D3557] leading-relaxed px-1">{userProfile.allergies || 'No allergies reported'}</span>
            )}
          </div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Emergency Contacts</h2>
          {isEditing && formData.emergencyContacts.length < 2 && (
            <button
              onClick={() => setShowAddContact(true)}
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-black text-[10px] flex items-center gap-1 uppercase tracking-widest"
            >
              <Plus size={12} /> ADD NEW
            </button>
          )}
        </div>
        <div className="flex flex-col gap-3">
          {formData.emergencyContacts.map((contact, i) => (
            <div key={i} className="p-5 bg-white border border-gray-100 rounded-[24px] flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                  <Heart size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-[#1D3557] text-sm">{contact.name}</span>
                  <span className="text-xs text-gray-400 font-bold tracking-tight">{contact.phone}</span>
                </div>
              </div>
              {isEditing && (
                <button 
                  onClick={() => removeContact(i)} 
                  className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center active:bg-red-50 active:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}

          {showAddContact && (
            <div className="p-6 bg-gray-50 rounded-[32px] flex flex-col gap-4 border-2 border-dashed border-gray-200">
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Contact Name"
                  className="w-full p-4 bg-white rounded-2xl text-sm font-bold border border-gray-100"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full p-4 bg-white rounded-2xl text-sm font-bold border border-gray-100"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddContact}
                  className="flex-1 bg-[#457B9D] text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-100"
                >
                  ADD CONTACT
                </button>
                <button
                  onClick={() => setShowAddContact(false)}
                  className="px-6 py-4 text-gray-500 text-xs font-black uppercase tracking-widest"
                >
                  CANCEL
                </button>
              </div>
            </div>
          )}

          {formData.emergencyContacts.length === 0 && !showAddContact && (
            <div className="p-12 border-2 border-dashed border-gray-100 rounded-[32px] text-center flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                <Heart size={24} />
              </div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No emergency contacts added</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
