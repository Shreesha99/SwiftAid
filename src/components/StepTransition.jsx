/* src/components/StepTransition.jsx */
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * StepTransition wraps booking steps to provide smooth slide-in/out animations.
 */
export const StepTransition = ({ children, stepKey }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepKey}
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '-100%', opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="w-full h-full flex flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default StepTransition;
