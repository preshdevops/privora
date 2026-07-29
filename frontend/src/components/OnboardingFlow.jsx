import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, KeyRound, EyeOff, Lock, ArrowRight, Check, Sparkles } from 'lucide-react';
import SecurityActionBtn from './SecurityActionBtn';

export default function OnboardingFlow({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const steps = [
    {
      title: "Welcome to Privora",
      subtitle: "Your private vault",
      icon: ShieldCheck,
      description: "Privora protects your personal data under Nigerian and international privacy law. Every file you upload is encrypted so that only you can read it.",
      badge: "Step 1 of 3"
    },
    {
      title: "Your Password Is Your Key",
      subtitle: "Only you can unlock your files",
      icon: KeyRound,
      description: "We turn your password into a unique private key. Your password is never stored or sent anywhere — if you know it, you can access your files. If you don't, no one can.",
      badge: "Step 2 of 3"
    },
    {
      title: "We Watch for Threats",
      subtitle: "Automatic protection",
      icon: EyeOff,
      description: "Privora monitors every login, access attempt, and download. Suspicious activity triggers alerts automatically — you'll always know what's happening with your data.",
      badge: "Step 3 of 3"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setCompleted(true);
      localStorage.setItem('privora_onboarded', 'true');
      // Celebratory moment before closing
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 1800);
    }
  };

  const StepIcon = steps[currentStep]?.icon || ShieldCheck;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-modal-overlay)] backdrop-blur-none p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
        className="layered-card-accent p-8 rounded-sm max-w-xl w-full relative bg-[var(--bg-card)] overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {completed ? (
            /* Celebratory completion moment */
            <motion.div
              key="celebration"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
              className="text-center py-8 space-y-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 15 }}
                className="w-16 h-16 mx-auto rounded-full bg-[var(--accent-brass)] flex items-center justify-center text-[#12141C]"
              >
                <Sparkles className="w-8 h-8" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-serif text-[var(--text-primary)]"
              >
                You're all set
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-[var(--text-secondary)]"
              >
                Your vault is ready. Upload your first file to start protecting it.
              </motion.p>
            </motion.div>
          ) : (
            /* Step content */
            <React.Fragment key="steps">
              {/* Step Indicator Badges */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border-primary)]">
                <span className="text-xs font-mono text-[var(--accent-brass)] uppercase tracking-wider">
                  {steps[currentStep].badge}
                </span>
                <div className="flex gap-1.5">
                  {steps.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === currentStep
                          ? 'w-6 bg-[var(--accent-brass)]'
                          : i < currentStep
                          ? 'w-2 bg-[var(--accent-brass-dim)]'
                          : 'w-2 bg-[var(--border-primary)]'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Content Slide */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 my-6"
                >
                  <div className="w-12 h-12 rounded bg-[var(--bg-input)] border border-[var(--border-accent)] flex items-center justify-center text-[var(--accent-brass)]">
                    <StepIcon className="w-6 h-6" />
                  </div>

                  <div>
                    <span className="text-xs font-mono text-[var(--text-tertiary)]">
                      {steps[currentStep].subtitle}
                    </span>
                    <h2 className="text-2xl font-serif text-[var(--text-primary)] mt-1">
                      {steps[currentStep].title}
                    </h2>
                  </div>

                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed pt-2">
                    {steps[currentStep].description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Action Controls */}
              <div className="flex items-center justify-between pt-6 border-t border-[var(--border-primary)]">
                <button
                  onClick={() => {
                    localStorage.setItem('privora_onboarded', 'true');
                    if (onComplete) onComplete();
                  }}
                  className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  Skip
                </button>

                <SecurityActionBtn
                  onClick={handleNext}
                  actionLabel="Loading…"
                  delayMs={400}
                >
                  {currentStep < steps.length - 1 ? (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Get Started
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </SecurityActionBtn>
              </div>
            </React.Fragment>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
