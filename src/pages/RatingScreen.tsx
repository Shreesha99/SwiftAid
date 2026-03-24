import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, CheckCircle, ArrowLeft, MessageSquare, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const RATING_TAGS = [
  'Fast Arrival', 'Professional Crew', 'Clean Vehicle', 'Good Communication', 'Safe Driving'
];

export default function RatingScreen() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { bookings, addRating } = useAppStore();
  const booking = bookings.find(b => b.id === bookingId);

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!booking) return <div>Booking not found</div>;

  const handleSubmit = () => {
    if (rating === 0) return;
    addRating(booking.id, rating, feedback);
    setIsSubmitted(true);
    setTimeout(() => navigate('/bookings'), 2000);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  if (isSubmitted) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center', gap: '24px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', animation: 'scale-in 0.5s ease' }}>
          <CheckCircle size={48} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Thank you!</h1>
          <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: 1.5 }}>Your feedback helps us improve our emergency services.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'white' }}>
      <header style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => navigate('/bookings')} style={{ background: 'none', border: 'none', color: '#1D3557', cursor: 'pointer' }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: 700 }}>Rate your experience</h1>
      </header>

      <main style={{ flex: 1, padding: '0 20px 40px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {/* Driver Info Summary */}
        <div style={{ padding: '20px', background: '#F9FAFB', borderRadius: '16px', border: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'white', border: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>👨‍✈️</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 700, fontSize: '16px' }}>{booking.driver?.name}</span>
            <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 600 }}>{booking.driver?.vehicleNumber}</span>
          </div>
        </div>

        {/* Star Rating */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '15px', fontWeight: 600, color: '#1D3557' }}>How was the service?</span>
          <div style={{ display: 'flex', gap: '12px' }}>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => setRating(star)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', transition: 'transform 0.1s ease' }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <Star 
                  size={40} 
                  fill={star <= rating ? '#F7A600' : 'none'} 
                  color={star <= rating ? '#F7A600' : '#D1D5DB'} 
                  strokeWidth={1.5}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: 700 }}>What went well?</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {RATING_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '100px',
                  border: `1.5px solid ${selectedTags.includes(tag) ? '#E63946' : '#F0F0F0'}`,
                  background: selectedTags.includes(tag) ? '#fef2f2' : 'white',
                  color: selectedTags.includes(tag) ? '#E63946' : '#6B7280',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={16} color="#9CA3AF" />
            <span style={{ fontSize: '13px', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: 700 }}>Additional comments</span>
          </div>
          <textarea
            placeholder="Tell us more about your experience..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            style={{
              width: '100%',
              height: '100px',
              padding: '16px',
              borderRadius: '16px',
              border: '1px solid #F0F0F0',
              background: '#F9FAFB',
              fontSize: '15px',
              outline: 'none',
              resize: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', background: '#ecfdf5', padding: '12px', borderRadius: '12px', fontSize: '13px', fontWeight: 600 }}>
          <ShieldCheck size={16} />
          <span>Your feedback is shared with Rotary Quality Control</span>
        </div>
      </main>

      <footer style={{ padding: '20px', borderTop: '1px solid #F0F0F0' }}>
        <button 
          className="primary-button"
          disabled={rating === 0}
          onClick={handleSubmit}
        >
          Submit Feedback
        </button>
      </footer>
    </div>
  );
}
