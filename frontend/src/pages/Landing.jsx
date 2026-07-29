import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, KeyRound, EyeOff, Activity } from 'lucide-react';
import vaultHeroImg from '../assets/vault-hero.png';

export default function Landing() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans antialiased">
      {/* Navigation Bar */}
      <nav className="border-b border-[var(--border-primary)] bg-[var(--bg-primary)]">
        <div className="max-w-[1080px] mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-serif text-xl font-semibold text-[var(--text-primary)] tracking-tight">
              Privora
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm text-[var(--text-secondary)]">
            <button onClick={() => scrollTo('how-it-works')} className="hover:text-[var(--text-primary)] transition-colors">
              How it works
            </button>
            <button onClick={() => scrollTo('why-privora')} className="hover:text-[var(--text-primary)] transition-colors">
              Why Privora
            </button>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <Link to="/login" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Sign in
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-[var(--accent-brass)] text-[#14171F] font-semibold rounded-sm hover:bg-[var(--accent-brass-bright)] transition-colors"
            >
              Open vault
            </Link>
          </div>
        </div>
      </nav>

      {/* Asymmetric Hero Section */}
      <section className="py-16 sm:py-24 border-b border-[var(--border-primary)]">
        <div className="max-w-[1080px] mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-xs font-mono text-[var(--accent-brass)] tracking-widest uppercase block">
              PERSONAL DATA PROTECTION
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[var(--text-primary)] leading-[1.15]">
              A personal vault <br />
              <span className="italic font-normal">for what matters most.</span>
            </h1>

            <p className="text-base text-[var(--text-secondary)] leading-relaxed max-w-xl">
              Privora turns your sensitive personal files into an unbreachable private vault. Encrypted with keys derived directly from your password — built to Nigerian and international privacy standards.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <Link
                to="/register"
                className="px-6 py-3 bg-[var(--accent-brass)] text-[#14171F] font-semibold text-sm rounded-sm hover:bg-[var(--accent-brass-bright)] transition-colors flex items-center gap-2"
              >
                <span>Get started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => scrollTo('how-it-works')}
                className="px-6 py-3 border border-[var(--border-primary)] text-sm text-[var(--text-primary)] rounded-sm hover:border-[var(--text-primary)] transition-colors"
              >
                How it works
              </button>
            </div>
          </div>

          {/* Right Column: Proportional Integrated Hero Illustration */}
          <div className="lg:col-span-5 border border-[var(--border-primary)] p-2 rounded-sm bg-[var(--bg-secondary)]">
            <img
              src={vaultHeroImg}
              alt="Privora Vault Illustration"
              className="w-full h-auto object-cover rounded-sm border border-[var(--border-primary)]"
            />
          </div>
        </div>
      </section>

      {/* Principles Section */}
      <section id="how-it-works" className="py-20 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
        <div className="max-w-[1080px] mx-auto px-6 space-y-12">
          <div className="space-y-2">
            <span className="text-xs font-mono text-[var(--accent-brass)] tracking-widest uppercase block">
              SYSTEM PRINCIPLES
            </span>
            <h2 className="text-3xl font-serif text-[var(--text-primary)]">
              Engineered for data sovereignty
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "Zero-knowledge storage",
                desc: "Your files are encrypted on your device before storage. Not even our servers can read your content."
              },
              {
                icon: KeyRound,
                title: "Password-derived key",
                desc: "Your key is computed from your passphrase in memory and immediately discarded. Your password is never stored."
              },
              {
                icon: Activity,
                title: "Active audit ledger",
                desc: "Every login, file action, and settings change is logged automatically to give you complete visibility."
              }
            ].map((item, i) => (
              <div key={i} className="space-y-3 p-6 border border-[var(--border-primary)] bg-[var(--bg-primary)] rounded-sm">
                <item.icon className="w-5 h-5 text-[var(--accent-brass)]" />
                <h3 className="text-lg font-serif text-[var(--text-primary)]">
                  {item.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section id="why-privora" className="py-20 text-center">
        <div className="max-w-[760px] mx-auto px-6 space-y-6">
          <h2 className="text-3xl font-serif text-[var(--text-primary)]">
            Ready to protect your data?
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Create your account in seconds and protect your first file.
          </p>
          <div>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent-brass)] text-[#14171F] text-sm font-semibold rounded-sm hover:bg-[var(--accent-brass-bright)] transition-colors"
            >
              <span>Initialize your vault</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Quiet Footer */}
      <footer className="border-t border-[var(--border-primary)] px-6 py-6 text-xs text-[var(--text-tertiary)]">
        <div className="max-w-[1080px] mx-auto flex items-center justify-between">
          <span>Privora — Built to Nigerian and international privacy standards</span>
          <span>© {new Date().getFullYear()} Privora. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
