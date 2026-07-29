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
      entryNum: "ENTRY #001",
      title: "File Upload & Ingestion",
      icon: HardDriveDownload,
      subtitle: "Memory Buffer",
      detail: "Your raw file is received directly in memory — no unencrypted data is ever written to disk.",
      sealText: "RECEIVED"
    },
    {
      id: "key",
      entryNum: "ENTRY #002",
      title: "Master Key Generation",
      icon: KeyRound,
      subtitle: "Password Derivation",
      detail: "We derive a unique private key from your passphrase. Your password is never stored or sent anywhere.",
      sealText: "DERIVED"
    },
    {
      id: "encrypt",
      entryNum: "ENTRY #003",
      title: "Data Scrambling",
      icon: Cpu,
      subtitle: "Payload Protection",
      detail: "Your content is transformed into unreadable data blocks. Without your key, recovery is mathematically impossible.",
      sealText: "SEALED"
    },
    {
      id: "store",
      entryNum: "ENTRY #004",
      title: "Ledger Vault Storage",
      icon: ShieldCheck,
      subtitle: "Zero-Knowledge Record",
      detail: "The protected record is logged in the vault ledger. Only you holding your password key can unlock it.",
      sealText: "RECORDED"
    }
  ];

  return (
    <div className="ledger-sheet p-6 sm:p-8 rounded-sm mb-8 relative overflow-hidden">
      {/* Ledger Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--border-primary)]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[var(--accent-brass)] font-mono font-semibold">
            Sequential Protection Ledger
          </span>
          <h2 className="text-2xl font-serif text-[var(--text-primary)] mt-1">
            Data Journey & Verification Trail
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-tertiary)] bg-[var(--bg-input)] px-3.5 py-1.5 rounded border border-[var(--border-primary)]">
          <span className="w-2 h-2 rounded-full bg-[var(--status-success)] animate-pulse" />
          <span>Ledger Protection Active</span>
        </div>
      </div>

      {/* Ledger Entry List — Sequential Ledger Lines, Not Generic Cards */}
      <div className="divide-y divide-[var(--border-primary)] border border-[var(--border-primary)] rounded-sm bg-[var(--bg-primary)]/40 overflow-hidden">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isActive = idx === activeStage;
          return (
            <motion.div
              key={stage.id}
              onClick={() => setActiveStage(idx)}
              whileHover={{ backgroundColor: 'var(--bg-hover)' }}
              className={`p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer transition-colors relative ${
                isActive ? 'bg-[var(--bg-card-elevated)]/90 border-l-2 border-l-[var(--accent-brass)]' : ''
              }`}
            >
              <div className="flex items-start md:items-center gap-4">
                <span className="font-mono text-xs font-semibold text-[var(--accent-brass)] w-20 shrink-0">
                  {stage.entryNum}
                </span>

                <div className={`p-2.5 rounded shrink-0 ${isActive ? 'bg-[var(--accent-brass)] text-[#12141C]' : 'bg-[var(--bg-input)] text-[var(--text-secondary)]'}`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="space-y-0.5">
                  <h3 className="text-sm font-medium text-[var(--text-primary)]">
                    {stage.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-xl">
                    {stage.detail}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                <span className="font-mono text-[10px] text-[var(--text-tertiary)] uppercase">
                  {stage.subtitle}
                </span>

                <span className={`px-2.5 py-1 text-[10px] font-mono rounded uppercase border ${
                  isActive 
                    ? 'bg-[var(--badge-success-bg)] text-[var(--badge-success-text)] border-[var(--status-success)]/40' 
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
      <div className="mt-6 p-4 rounded-sm bg-[var(--bg-input)] border border-[var(--border-primary)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[var(--accent-brass)] shrink-0" />
          <span>Every ledger entry is signed in memory using keys derived strictly from your master password.</span>
        </div>

        <button
          onClick={() => setShowTechnical(!showTechnical)}
          className="flex items-center gap-1 text-[11px] font-mono text-[var(--accent-brass)] hover:underline shrink-0 ml-4 cursor-pointer"
        >
          <span>{showTechnical ? 'Hide Technical Spec' : 'Technical Spec'}</span>
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
            className="mt-3 p-4 rounded bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[11px] font-mono text-[var(--text-tertiary)] leading-relaxed space-y-1"
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
