/* src/pages/RatingScreen.tsx */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, CheckCircle, MessageSquare, Heart } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const FEEDBACK_TAGS = [
  'Driver was helpful',
  'Arrived on time',
  'Vehicle was clean',
  'Needed more equipment',
  'Driver was rude',
  'Arrived late'
];

const RatingScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentBooking, completeBooking } = useAppStore();
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (currentBooking) {
      completeBooking(currentBooking.id, rating, feedback, selectedTags);
      setIsSubmitted(true);
      setTimeout(() => navigate('/'), 2000);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6 h-full bg-white">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center text-green-500 shadow-xl shadow-green-100"
        >
          <CheckCircle size={64} />
        </motion.div>
        <div className="text-center flex flex-col gap-3">
          <h2 className="text-3xl font-black text-[#1D3557] tracking-tight">Thank You!</h2>
          <p className="text-gray-500 font-medium leading-relaxed max-w-[240px] mx-auto">
            Your feedback helps us improve emergency response times in Bengaluru.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-6 gap-8 bg-white min-h-full overflow-y-auto pb-24">
      <div className="mt-8 flex flex-col gap-2">
        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shadow-sm">
          <Heart size={24} />
        </div>
        <h1 className="text-3xl font-black text-[#1D3557] tracking-tight">How was your experience?</h1>
        <p className="text-gray-500 font-medium">Rate your recent ambulance service</p>
      </div>

      {/* Star Rating */}
      <div className="flex justify-center gap-3 py-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className="p-1 transition-all active:scale-75"
          >
            <Star
              size={44}
              fill={star <= rating ? '#FFC107' : 'none'}
              stroke={star <= rating ? '#FFC107' : '#E2E8F0'}
              strokeWidth={1.5}
              className={cn(
                "transition-all",
                star <= rating && "scale-110 drop-shadow-lg"
              )}
            />
          </button>
        ))}
      </div>

      {/* Tags */}
      <div className="flex flex-col gap-4">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">What went well (or didn't)?</h3>
        <div className="flex flex-wrap gap-2">
          {FEEDBACK_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={cn(
                "px-5 py-3 rounded-2xl text-xs font-black border transition-all active:scale-95",
                selectedTags.includes(tag)
                  ? 'bg-[#1D3557] border-[#1D3557] text-white shadow-lg shadow-blue-100'
                  : 'bg-white border-gray-100 text-gray-400'
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Text */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
          <MessageSquare size={14} />
          <span>Any other feedback?</span>
        </div>
        <textarea
          className="w-full p-5 bg-gray-50 rounded-[32px] text-sm font-bold border border-gray-100 focus:outline-none focus:border-[#E63946] min-h-[140px] transition-colors"
          placeholder="Tell us more about your experience..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={rating === 0}
        className={cn(
          "w-full py-5 rounded-[24px] font-black text-lg shadow-2xl transition-all active:scale-95",
          rating === 0
            ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
            : 'bg-[#E63946] text-white shadow-red-100'
        )}
      >
        SUBMIT FEEDBACK
      </button>
    </div>
  );
};

export default RatingScreen;
