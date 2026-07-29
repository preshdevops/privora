import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, KeyRound, EyeOff, ArrowRight, Check } from 'lucide-react';
import SecurityActionBtn from './SecurityActionBtn';
import SealStamp from './SealStamp';

export default function OnboardingFlow({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const steps = [
    {
      title: "Welcome to Privora Ledger Vault",
      subtitle: "Entry #001: System Principles",
      icon: ShieldCheck,
      description: "Privora is built as a vault and an immutable ledger. Every file you protect is encrypted with keys derived directly from your password, and every action is recorded.",
      badge: "Principle 1 of 3"
    },
    {
      title: "Your Password Is Your Key",
      subtitle: "Entry #002: Key Derivation",
      icon: KeyRound,
      description: "We turn your password into a unique private key in client memory. We never store or transmit your password — if you know it, you can unseal your data. If not, no one can.",
      badge: "Principle 2 of 3"
    },
    {
      title: "Automated Threat Monitoring",
      subtitle: "Entry #003: Audit Telemetry",
      icon: EyeOff,
      description: "Privora continuously logs access attempts and security alerts. Any unusual activity is recorded in your ledger automatically.",
      badge: "Principle 3 of 3"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setCompleted(true);
      localStorage.setItem('privora_onboarded', 'true');
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 2200);
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
        className="ledger-sheet p-8 sm:p-10 rounded-sm max-w-xl w-full relative bg-[var(--bg-card)] overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {completed ? (
            /* Signature Moment: The Ledger Seal Pressing Down */
            <motion.div
              key="celebration-seal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-10 space-y-6 flex flex-col items-center justify-center"
            >
              <SealStamp label="INITIALIZED" subtitle="LEDGER VAULT READY" size="lg" />

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <h2 className="text-2xl font-serif text-[var(--text-primary)]">
                  Vault Initialized & Sealed
                </h2>
                <p className="text-xs text-[var(--text-secondary)] font-mono">
                  Your private ledger is ready for file protection.
                </p>
              </motion.div>
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
                  <div className="w-12 h-12 rounded bg-[var(--bg-input)] border border-[var(--border-primary)] flex items-center justify-center text-[var(--accent-brass)]">
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
                  className="text-xs font-mono text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
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
                      <span>Next Principle</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Seal & Enter Vault</span>
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
