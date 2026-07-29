import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, KeyRound, EyeOff, Activity, ArrowRight } from 'lucide-react';
import heroImg from '../assets/hero.png';

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

          <div className="hidden md:flex items-center gap-8 text-xs text-[var(--text-secondary)]">
            <button onClick={() => scrollTo('how-it-works')} className="hover:text-[var(--accent-brass)] transition-colors">
              How It Works
            </button>
            <button onClick={() => scrollTo('why-privora')} className="hover:text-[var(--accent-brass)] transition-colors">
              Why Privora
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link to="/login" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-[var(--accent-brass)] text-[#12141C] font-medium rounded-sm hover:bg-[var(--accent-brass-bright)] shadow-[var(--shadow-layered)] transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        {/* Ambient hero image with slow drift */}
        <motion.img
          src={heroImg}
          alt=""
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 2, ease: [0.25, 1, 0.5, 1] }}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          style={{ filter: 'saturate(0.2) blur(1px)' }}
        />
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: `url(${heroImg})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.06, filter: 'saturate(0) blur(2px)' }}
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
            className="max-w-2xl space-y-6 text-left"
          >
            <span className="text-xs font-mono text-[var(--accent-brass)] uppercase tracking-widest block">
              Personal Data Protection
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-semibold text-[var(--text-primary)] leading-[1.15]">
              Your Files, Protected{" "}
              <span className="text-[var(--accent-brass)] italic">Beyond Reach.</span>
            </h1>

            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-xl">
              Privora encrypts your personal files so that only you can read them — not us, not anyone else. 
              Built to meet Nigerian and international privacy law.
            </p>

            <div className="flex items-center gap-4 pt-4 text-xs">
              <Link
                to="/register"
                className="px-6 py-3 bg-[var(--accent-brass)] text-[#12141C] font-medium rounded-sm hover:bg-[var(--accent-brass-bright)] shadow-[var(--shadow-layered)] transition-all flex items-center gap-2"
              >
                <span>Get Started — Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => scrollTo('how-it-works')}
                className="px-6 py-3 layered-card rounded-sm text-[var(--text-primary)] hover:border-[var(--accent-brass)] transition-colors"
              >
                How It Works
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Metrics Bar */}
      <section className="border-y border-[var(--border-primary)] bg-[var(--bg-secondary)] py-6">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
          {[
            { label: "File Protection", value: "Bank-Grade Encryption" },
            { label: "Password Security", value: "Private Key from Your Password" },
            { label: "Legal Compliance", value: "Nigerian & International Law" },
            { label: "Activity Tracking", value: "Full Audit History" }
          ].map((item, i) => (
            <div key={i} className="space-y-1">
              <span className="text-[10px] text-[var(--text-tertiary)] uppercase block">{item.label}</span>
              <span className="text-[var(--text-primary)] font-medium block">{item.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div>
            <span className="text-xs font-mono text-[var(--accent-brass)] uppercase tracking-widest">
              How It Works
            </span>
            <h2 className="text-3xl font-serif text-[var(--text-primary)] mt-1">
              Protection You Can Trust
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "Only You Hold the Key",
                desc: "Your password is turned into a unique private key that never leaves your device. Not even Privora can read your files."
              },
              {
                icon: Activity,
                title: "Always Watching for Threats",
                desc: "Every login, download, and change is logged. Unusual activity triggers alerts automatically — no setup needed."
              },
              {
                icon: EyeOff,
                title: "Built for Privacy Laws",
                desc: "Configurable privacy controls for tracking, cookies, and fingerprint defense — designed to meet Nigerian and international data protection standards."
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
      <section id="why-privora" className="py-16 border-t border-[var(--border-primary)] bg-[var(--bg-secondary)] text-center">
        <div className="max-w-3xl mx-auto px-6 space-y-6">
          <h2 className="text-3xl font-serif text-[var(--text-primary)]">
            Take Control of Your Data.
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Start protecting your personal files today — it takes less than a minute.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent-brass)] text-[#12141C] text-xs font-medium rounded-sm hover:bg-[var(--accent-brass-bright)] shadow-[var(--shadow-layered)]"
            >
              <span>Create Your Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
