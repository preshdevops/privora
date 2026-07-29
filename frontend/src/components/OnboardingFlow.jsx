import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, KeyRound, EyeOff, Lock, ArrowRight, Check } from 'lucide-react';
import SecurityActionBtn from './SecurityActionBtn';

export default function OnboardingFlow({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Privora Vault",
      subtitle: "Deliberate Personal Data Protection",
      icon: ShieldCheck,
      description: "Privora is designed to safeguard your personal data under the Nigeria Data Protection Act (NDPR 2023) and GAID framework. Every asset you upload is encrypted with zero-knowledge keys.",
      badge: "Step 1 of 3: Architecture"
    },
    {
      title: "AES-256 Zero-Knowledge Cryptography",
      subtitle: "Client & Memory Isolation",
      icon: KeyRound,
      description: "We use PBKDF2 with 600,000 iterations to derive a unique 256-bit key from your master password. Your password is never stored or transmitted in plain text.",
      badge: "Step 2 of 3: Key Derivation"
    },
    {
      title: "Real-Time Anomaly & Threat Detection",
      subtitle: "Active Audit Logging",
      icon: EyeOff,
      description: "Privora continuously monitors logins, access attempts, and asset downloads. Suspicious actions automatically generate alerts and invalidate compromised sessions.",
      badge: "Step 3 of 3: Compliance & Security"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      localStorage.setItem('privora_onboarded', 'true');
      if (onComplete) onComplete();
    }
  };

  const StepIcon = steps[currentStep].icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-modal-overlay)] backdrop-blur-none p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
        className="layered-card-accent p-8 rounded-sm max-w-xl w-full relative bg-[var(--bg-card)] overflow-hidden"
      >
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
            Skip Guided Reveal
          </button>

          <SecurityActionBtn
            onClick={handleNext}
            actionLabel="Processing..."
            delayMs={400}
          >
            {currentStep < steps.length - 1 ? (
              <>
                Next Principle
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                Enter Vault Dashboard
                <Check className="w-4 h-4" />
              </>
            )}
          </SecurityActionBtn>
        </div>
      </motion.div>
    </div>
  );
}
