import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, KeyRound, Cpu, HardDriveDownload, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

export default function DataJourney() {
  const [activeStage, setActiveStage] = useState(0);
  const [showTechnical, setShowTechnical] = useState(false);

  const stages = [
    {
      id: "ingest",
      title: "1. Upload",
      icon: HardDriveDownload,
      subtitle: "Your file is received",
      detail: "Your file is loaded securely into memory — nothing is saved unprotected at any point.",
      tag: "Ready to Protect"
    },
    {
      id: "key",
      title: "2. Key Creation",
      icon: KeyRound,
      subtitle: "Your password becomes a private key",
      detail: "We turn your password into a unique private key that only you can use. Your password is never saved.",
      tag: "Private Key Generated"
    },
    {
      id: "encrypt",
      title: "3. Encryption",
      icon: Cpu,
      subtitle: "Your data is scrambled",
      detail: "Your file is transformed into unreadable data. Without your password, it's impossible to recover.",
      tag: "Protected"
    },
    {
      id: "store",
      title: "4. Safe Storage",
      icon: ShieldCheck,
      subtitle: "Not even we can read it",
      detail: "The protected file is stored securely. Only someone with your exact password can ever open it again.",
      tag: "Stored Safely"
    }
  ];

  return (
    <div className="layered-card p-6 rounded-sm mb-8 relative overflow-hidden">
      {/* Background Accent Lines */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-brass-glow)] rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--border-primary)]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[var(--accent-brass)] font-mono font-semibold">
            How Your Data Is Protected
          </span>
          <h2 className="text-xl font-serif text-[var(--text-primary)] mt-1">
            Your Privacy, at a Glance
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-tertiary)] bg-[var(--bg-input)] px-3 py-1.5 rounded border border-[var(--border-primary)]">
          <span className="w-2 h-2 rounded-full bg-[var(--status-success)] animate-pulse" />
          Your data is protected
        </div>
      </div>

      {/* Stage Stepper Diagram */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isActive = idx === activeStage;
          return (
            <motion.div
              key={stage.id}
              onClick={() => setActiveStage(idx)}
              whileHover={{ y: -2 }}
              className={`p-4 rounded-sm border transition-all duration-300 cursor-pointer relative ${
                isActive
                  ? 'bg-[var(--bg-card-elevated)] border-[var(--accent-brass)] shadow-[var(--shadow-layered)]'
                  : 'bg-[var(--bg-secondary)] border-[var(--border-primary)] hover:border-[var(--border-secondary)]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`p-2 rounded ${
                    isActive
                      ? 'bg-[var(--accent-brass)] text-[#12141C]'
                      : 'bg-[var(--bg-input)] text-[var(--text-secondary)]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                  {stage.tag}
                </span>
              </div>

              <h3 className="text-sm font-medium text-[var(--text-primary)] mb-0.5">
                {stage.title}
              </h3>
              <p className="text-xs text-[var(--accent-brass)] font-mono mb-2">
                {stage.subtitle}
              </p>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {stage.detail}
              </p>

              {idx < stages.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-[var(--border-secondary)]">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Bottom assurance banner */}
      <div className="mt-6 p-4 rounded-sm bg-[var(--bg-input)] border border-[var(--border-primary)] flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[var(--accent-brass)] shrink-0 mt-0.5" />
        <div className="text-xs text-[var(--text-secondary)] leading-relaxed flex-1">
          <strong className="text-[var(--text-primary)] font-medium">Your data stays private:</strong>{" "}
          Every file is encrypted with a key derived from your password. We never store your password and can never read your files.
        </div>
      </div>

      {/* Optional technical detail — expandable */}
      <button
        onClick={() => setShowTechnical(!showTechnical)}
        className="mt-3 flex items-center gap-1.5 text-[11px] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors font-mono cursor-pointer"
      >
        {showTechnical ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        How this works (technical detail)
      </button>
      {showTechnical && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-2 p-3 rounded bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[11px] font-mono text-[var(--text-tertiary)] leading-relaxed"
        >
          Encryption: AES-256-CBC &middot; Key derivation: PBKDF2-HMAC-SHA256 with 600,000 iterations &middot; 
          Unique 16-byte random salt per file &middot; PKCS#7 padding &middot; Compliant with NDPR 2023 Section 2.4 and GDPR Article 32.
        </motion.div>
      )}
    </div>
  );
}
