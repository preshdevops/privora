import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, KeyRound, Cpu, HardDriveDownload, ArrowRight } from 'lucide-react';

export default function DataJourney() {
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    {
      id: "ingest",
      title: "1. Payload Ingestion",
      icon: HardDriveDownload,
      subtitle: "Client-Side Buffer",
      detail: "Raw data payload is loaded into memory without writing unencrypted bytes to persistent local storage.",
      tag: "AES-256 Pre-Flight"
    },
    {
      id: "pbkdf2",
      title: "2. PBKDF2 Derivation",
      icon: KeyRound,
      subtitle: "600,000 Iterations",
      detail: "Derives a 256-bit key using HMAC-SHA256 with a unique 16-byte random salt. Password is never saved.",
      tag: "Salt + IV Generation"
    },
    {
      id: "cipher",
      title: "3. CBC Cipher Stream",
      icon: Cpu,
      subtitle: "PKCS#7 Padded Cipher",
      detail: "Data is processed in 128-bit blocks using PyCryptodome CBC mode. Ciphertext is cryptographically isolated.",
      tag: "AES-256-CBC Active"
    },
    {
      id: "vault",
      title: "4. Isolated Storage",
      icon: ShieldCheck,
      subtitle: "Zero-Knowledge Storage",
      detail: "Encrypted payload is stored in the database. Only owner holding the derived key can decrypt and read.",
      tag: "NDPR / GDPR Compliant"
    }
  ];

  return (
    <div className="layered-card p-6 rounded-sm mb-8 relative overflow-hidden">
      {/* Background Accent Lines */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-brass-glow)] rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--border-primary)]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[var(--accent-brass)] font-mono font-semibold">
            Cryptographic Pipeline
          </span>
          <h2 className="text-xl font-serif text-[var(--text-primary)] mt-1">
            Data Journey & Protection Flow
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-tertiary)] bg-[var(--bg-input)] px-3 py-1.5 rounded border border-[var(--border-primary)]">
          <span className="w-2 h-2 rounded-full bg-[var(--status-success)] animate-pulse" />
          AES-256-CBC Engine Active
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

      {/* Stage Detail Banner */}
      <div className="mt-6 p-4 rounded-sm bg-[var(--bg-input)] border border-[var(--border-primary)] flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[var(--accent-brass)] shrink-0 mt-0.5" />
        <div className="text-xs text-[var(--text-secondary)] leading-relaxed">
          <strong className="text-[var(--text-primary)] font-medium">Compliance Assurance:</strong>{" "}
          Privora’s zero-knowledge architecture guarantees that raw user data is encrypted client-side or in isolated server RAM using 600,000 PBKDF2 iterations, ensuring full compliance with NDPR Section 2.4 and GDPR Article 32 security obligations.
        </div>
      </div>
    </div>
  );
}
