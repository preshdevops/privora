import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, KeyRound, EyeOff, Activity, ArrowRight } from 'lucide-react';

export default function Landing() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[var(--bg-primary)] border-b border-[var(--border-primary)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-[var(--accent-brass)] flex items-center justify-center text-[#12141C]">
              <Lock className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="text-lg font-serif font-semibold tracking-tight text-[var(--text-primary)]">
              Privora
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-mono text-[var(--text-secondary)]">
            <button onClick={() => scrollTo('architecture')} className="hover:text-[var(--accent-brass)] transition-colors">
              Architecture
            </button>
            <button onClick={() => scrollTo('protocol')} className="hover:text-[var(--accent-brass)] transition-colors">
              Protocol
            </button>
            <button onClick={() => scrollTo('compliance')} className="hover:text-[var(--accent-brass)] transition-colors">
              Compliance
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <Link to="/login" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-[var(--accent-brass)] text-[#12141C] font-medium rounded-sm hover:bg-[var(--accent-brass-bright)] shadow-[var(--shadow-layered)] transition-all"
            >
              Open Vault
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            <span className="text-xs font-mono text-[var(--accent-brass)] uppercase tracking-widest block">
              NDPR 2023 / GAID 2025 Standard
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-semibold text-[var(--text-primary)] leading-[1.15]">
              A Deliberate Vault for <br />
              <span className="text-[var(--accent-brass)] italic">Personal Data Integrity.</span>
            </h1>

            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-xl">
              Privora provides cryptographic file isolation, active threat detection, and audit ledger telemetry. Designed to give Nigerian citizens and data controllers absolute sovereignty over sensitive records.
            </p>

            <div className="flex items-center gap-4 pt-4 font-mono text-xs">
              <Link
                to="/register"
                className="px-6 py-3 bg-[var(--accent-brass)] text-[#12141C] font-medium rounded-sm hover:bg-[var(--accent-brass-bright)] shadow-[var(--shadow-layered)] transition-all flex items-center gap-2"
              >
                <span>Initialize Vault</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => scrollTo('architecture')}
                className="px-6 py-3 layered-card rounded-sm text-[var(--text-primary)] hover:border-[var(--accent-brass)] transition-colors"
              >
                Inspect Protocol
              </button>
            </div>
          </motion.div>

          {/* Custom Minimal SVG Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="layered-card-accent p-8 rounded-sm bg-[var(--bg-card)] flex flex-col justify-between aspect-square relative">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--text-tertiary)] uppercase">Cipher Stream</span>
                <span className="text-[var(--badge-success-text)] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[var(--status-success)] animate-pulse" />
                  AES-256-CBC
                </span>
              </div>

              {/* Minimal Line Vault Illustration */}
              <div className="my-auto py-6 flex justify-center">
                <svg className="w-48 h-48 text-[var(--accent-brass)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="20" y="30" width="60" height="50" rx="3" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M35 30V22C35 13.716 41.716 7 50 7C58.284 7 65 13.716 65 22V30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="50" cy="50" r="7" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="50" y1="57" x2="50" y2="67" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  {/* Concentric Security Lines */}
                  <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                  <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
                </svg>
              </div>

              <div className="pt-4 border-t border-[var(--border-primary)] flex items-center justify-between text-[11px] font-mono text-[var(--text-tertiary)]">
                <span>PBKDF2-HMAC-SHA256</span>
                <span>600,000 ITER</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Protocol Metrics Bar */}
      <section className="border-y border-[var(--border-primary)] bg-[var(--bg-secondary)] py-6">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-xs">
          {[
            { label: "Encryption Engine", value: "AES-256-CBC" },
            { label: "Key Derivation", value: "PBKDF2 SHA-256" },
            { label: "Compliance Standard", value: "NDPR 2023 / GAID" },
            { label: "Telemetry Ledger", value: "Immutable Audit" }
          ].map((item, i) => (
            <div key={i} className="space-y-1">
              <span className="text-[10px] text-[var(--text-tertiary)] uppercase block">{item.label}</span>
              <span className="text-[var(--text-primary)] font-medium block">{item.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture Highlights */}
      <section id="architecture" className="py-20">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div>
            <span className="text-xs font-mono text-[var(--accent-brass)] uppercase tracking-widest">
              Core Principles
            </span>
            <h2 className="text-3xl font-serif text-[var(--text-primary)] mt-1">
              Engineered for Sovereignty
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "Zero-Knowledge Encryption",
                desc: "Payloads are encrypted using AES-256-CBC with keys derived via 600,000 PBKDF2 iterations. Master passwords are never persisted."
              },
              {
                icon: Activity,
                title: "Autonomous Threat Detection",
                desc: "Rule-based audit checks analyze access frequencies and failed logins in real time, automatically invalidating compromised sessions."
              },
              {
                icon: EyeOff,
                title: "Privacy Minimization",
                desc: "Configurable protection controls for ad/tracker blocking, cookie isolation, and fingerprint defense built for NDPR compliance."
              }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="layered-card p-6 rounded-sm space-y-3">
                  <div className="p-3 rounded bg-[var(--bg-input)] text-[var(--accent-brass)] w-fit">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-serif text-[var(--text-primary)]">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-16 border-t border-[var(--border-primary)] bg-[var(--bg-secondary)] text-center">
        <div className="max-w-3xl mx-auto px-6 space-y-6">
          <h2 className="text-3xl font-serif text-[var(--text-primary)]">
            Take Control of Your Data Protection.
          </h2>
          <p className="text-xs font-mono text-[var(--text-secondary)]">
            Deploy your secure personal vault today under NDPR standards.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent-brass)] text-[#12141C] text-xs font-mono font-medium rounded-sm hover:bg-[var(--accent-brass-bright)] shadow-[var(--shadow-layered)]"
            >
              <span>Initialize Vault Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
