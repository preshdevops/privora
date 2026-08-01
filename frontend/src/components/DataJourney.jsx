import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, KeyRound, Cpu, HardDriveDownload, ChevronDown, ChevronUp, Stamp } from 'lucide-react';
import SealStamp from './SealStamp';

export default function DataJourney() {
  const [activeStage, setActiveStage] = useState(0);
  const [showTechnical, setShowTechnical] = useState(false);

  const stages = [
    {
      id: "ingest",
      entryNum: "STEP 1",
      title: "File Uploaded",
      icon: HardDriveDownload,
      subtitle: "Safe Receive",
      detail: "Your file is brought safely into Privora without leaving unencrypted copies anywhere.",
      sealText: "RECEIVED"
    },
    {
      id: "key",
      entryNum: "STEP 2",
      title: "Lock Key Created",
      icon: KeyRound,
      subtitle: "Private Password",
      detail: "A unique security key is generated from your password. Your password is never saved on any server.",
      sealText: "PROTECTED"
    },
    {
      id: "encrypt",
      entryNum: "STEP 3",
      title: "File Encrypted",
      icon: Cpu,
      subtitle: "Total Privacy",
      detail: "Your file is scrambled into unreadable data. Without your secret password, no one can read it.",
      sealText: "ENCRYPTED"
    },
    {
      id: "store",
      entryNum: "STEP 4",
      title: "Stored in Vault",
      icon: ShieldCheck,
      subtitle: "Locked & Saved",
      detail: "Your encrypted file is stored safely in your vault. You can unlock and download it whenever you need.",
      sealText: "STORED"
    }
  ];

  return (
    <div className="ledger-sheet p-4 sm:p-8 rounded-sm mb-8 relative overflow-hidden bg-[var(--bg-card)] border border-[var(--border-primary)]">
      {/* Ledger Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[var(--border-primary)]">
        <div>
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[var(--accent-brass)] font-mono font-semibold block">
            YOUR FILE PROTECTION PIPELINE
          </span>
          <h2 className="text-xl sm:text-2xl font-serif text-[var(--text-primary)] mt-0.5">
            How your files get locked step-by-step
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-tertiary)] bg-[var(--bg-input)] px-3 py-1.5 rounded border border-[var(--border-primary)] self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-[var(--status-success)] animate-pulse" />
          <span>Protection Active</span>
        </div>
      </div>

      {/* Ledger Entry List — Connected Vertical Flow on Mobile, Horizontal on Desktop */}
      <div className="divide-y divide-[var(--border-primary)] border border-[var(--border-primary)] rounded-sm bg-[var(--bg-primary)]/40 overflow-hidden relative">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isActive = idx === activeStage;
          return (
            <motion.div
              key={stage.id}
              onClick={() => setActiveStage(idx)}
              whileHover={{ backgroundColor: 'var(--bg-hover)' }}
              className={`p-3.5 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 cursor-pointer transition-colors relative ${
                isActive ? 'bg-[var(--bg-card-elevated)] border-l-2 border-l-[var(--accent-brass)]' : ''
              }`}
            >
              {/* Connector Vertical Line on Mobile */}
              {idx < stages.length - 1 && (
                <div className="md:hidden absolute left-[31px] top-[48px] bottom-[-16px] w-[1px] bg-[var(--border-primary)] z-0 pointer-events-none" />
              )}

              <div className="flex items-start md:items-center gap-3 sm:gap-4 relative z-10">
                <div className={`p-2 sm:p-2.5 rounded shrink-0 ${isActive ? 'bg-[var(--accent-brass)] text-[#12141C]' : 'bg-[var(--bg-input)] text-[var(--text-secondary)] border border-[var(--border-primary)]'}`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] sm:text-xs font-semibold text-[var(--accent-brass)]">
                      {stage.entryNum}
                    </span>
                    <span className="text-xs text-[var(--text-tertiary)] font-mono sm:hidden">
                      &middot; {stage.subtitle}
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-medium text-[var(--text-primary)]">
                    {stage.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-xl">
                    {stage.detail}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 self-stretch md:self-center pt-2 md:pt-0 border-t md:border-0 border-[var(--border-primary)]/40 ml-[40px] md:ml-0">
                <span className="font-mono text-[10px] text-[var(--text-tertiary)] uppercase hidden md:inline">
                  {stage.subtitle}
                </span>

                <span className={`px-2.5 py-0.5 sm:py-1 text-[10px] font-mono rounded uppercase border ${
                  isActive 
                    ? 'bg-[var(--vault-green-bg)] text-[var(--vault-green-bright)] border-[var(--vault-green)]' 
                    : 'bg-[var(--bg-input)] text-[var(--text-muted)] border-[var(--border-primary)]'
                }`}>
                  {stage.sealText}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Reassuring Assurance Banner */}
      <div className="mt-4 sm:mt-6 p-3.5 sm:p-4 rounded-sm bg-[var(--bg-input)] border border-[var(--border-primary)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[var(--text-secondary)]">
        <div className="flex items-start sm:items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[var(--accent-brass)] shrink-0 mt-0.5 sm:mt-0" />
          <span>All steps are locked with your secret password. Your data is always under your control.</span>
        </div>

        <button
          onClick={() => setShowTechnical(!showTechnical)}
          className="flex items-center gap-1 text-[11px] font-mono text-[var(--accent-brass)] hover:underline shrink-0 self-end sm:self-auto touch-target cursor-pointer"
        >
          <span>{showTechnical ? 'Hide Security Details' : 'Security Details'}</span>
          {showTechnical ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Expandable Technical Specification Drawer */}
      <AnimatePresence>
        {showTechnical && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 p-3.5 sm:p-4 rounded bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[11px] font-mono text-[var(--text-tertiary)] leading-relaxed space-y-1"
          >
            <p>• Cryptographic Algorithm: AES-256-CBC with PKCS#7 padding</p>
            <p>• Key Derivation Engine: PBKDF2-HMAC-SHA256 (600,000 iterations + 16-byte random salt)</p>
            <p>• Compliance Framework: Nigerian Data Protection Act (NDPR 2023 §2.4) & GDPR Article 32</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
