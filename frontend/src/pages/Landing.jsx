import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  EyeOff, 
  Activity, 
  ArrowRight, 
  Sparkles,
  ChevronDown,
  Fingerprint,
  Zap
} from 'lucide-react';
import vaultHeroImg from '../assets/vault-hero.png';
import cyberShieldImg from '../assets/cyber-shield.png';

export default function Landing() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 100]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.2]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans overflow-x-hidden relative">
      {/* Dynamic Ambient Background Glow */}
      <div 
        className="fixed inset-0 pointer-events-none transition-transform duration-700 ease-out z-0"
        style={{
          background: `radial-gradient(circle 800px at ${50 + mousePos.x * 0.5}% ${30 + mousePos.y * 0.5}%, rgba(201, 161, 90, 0.08), transparent 70%)`
        }}
      />

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-[var(--border-primary)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-sm bg-[var(--accent-brass)] flex items-center justify-center text-[#12141C] shadow-[var(--shadow-layered)] group-hover:scale-105 transition-transform">
              <Lock className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-serif font-semibold tracking-tight text-[var(--text-primary)] block leading-none">
                Privora
              </span>
              <span className="text-[9px] font-mono text-[var(--accent-brass)] uppercase tracking-wider block mt-0.5">
                Data Protection Vault
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-xs text-[var(--text-secondary)] font-medium">
            <button onClick={() => scrollTo('experience')} className="hover:text-[var(--accent-brass)] transition-colors">
              The Experience
            </button>
            <button onClick={() => scrollTo('how-it-works')} className="hover:text-[var(--accent-brass)] transition-colors">
              How It Works
            </button>
            <button onClick={() => scrollTo('why-privora')} className="hover:text-[var(--accent-brass)] transition-colors">
              Why Privora
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link 
              to="/login" 
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-mono transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 bg-[var(--accent-brass)] text-[#12141C] font-medium rounded-sm hover:bg-[var(--accent-brass-bright)] shadow-[var(--shadow-layered)] transition-all flex items-center gap-2"
            >
              <span>Open Vault</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Experience Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center py-20 lg:py-32 overflow-hidden">
        {/* Photographic Hero Background with Parallax */}
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0 overflow-hidden"
        >
          <img
            src={vaultHeroImg}
            alt="Vault Atmosphere"
            className="w-full h-full object-cover opacity-25 scale-105 pointer-events-none"
            style={{
              filter: 'saturate(0.4) contrast(1.1)',
              transform: `translate3d(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px, 0)`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-[var(--bg-primary)]/80" />
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-12 gap-12 items-center">
          {/* Main Hero Copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--badge-success-bg)] border border-[var(--status-success)]/40 text-[var(--badge-success-text)] text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent-brass)]" />
              <span>Deliberate Data Protection Experience</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-semibold text-[var(--text-primary)] leading-[1.1] tracking-tight">
              A Personal Vault <br />
              <span className="text-[var(--accent-brass)] italic">For What Matters Most.</span>
            </h1>

            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl">
              Privora turns your personal data into an unbreachable private vault. 
              Protected by keys derived directly from your password — built to Nigerian and international privacy standards.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4 text-xs font-mono">
              <Link
                to="/register"
                className="px-7 py-3.5 bg-[var(--accent-brass)] text-[#12141C] font-semibold rounded-sm hover:bg-[var(--accent-brass-bright)] shadow-[var(--shadow-layered-lg)] transition-all flex items-center gap-2 text-sm"
              >
                <span>Initialize Vault</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => scrollTo('experience')}
                className="px-6 py-3.5 layered-card rounded-sm text-[var(--text-primary)] hover:border-[var(--accent-brass)] transition-colors flex items-center gap-2 text-xs"
              >
                <span>Explore Experience</span>
                <ChevronDown className="w-4 h-4 text-[var(--accent-brass)]" />
              </button>
            </div>

            <div className="pt-6 flex items-center gap-8 text-xs font-mono text-[var(--text-tertiary)] border-t border-[var(--border-primary)]/60">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--accent-brass)]" />
                <span>Zero Storage of Passwords</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[var(--accent-brass)]" />
                <span>Real-Time Threat Alerts</span>
              </div>
            </div>
          </motion.div>

          {/* Interactive Visual Card with Cyber Shield Asset */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
            className="lg:col-span-5"
          >
            <div className="layered-card-accent p-6 rounded-sm bg-[var(--bg-card)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--accent-brass-glow)] rounded-full blur-3xl -z-10 group-hover:scale-125 transition-transform duration-700" />
              
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border-primary)]">
                <span className="text-xs font-mono text-[var(--accent-brass)] uppercase tracking-wider">
                  Active Vault Shield
                </span>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-[var(--badge-success-bg)] text-[var(--badge-success-text)] border border-[var(--status-success)]/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-success)] animate-pulse" />
                  PROTECTED
                </span>
              </div>

              {/* 3D Shield Image Visual Anchor */}
              <div className="my-6 relative flex justify-center items-center py-4">
                <motion.img
                  src={cyberShieldImg}
                  alt="Cyber Security Shield"
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-56 h-56 object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
                />
              </div>

              <div className="p-3.5 rounded bg-[var(--bg-input)] border border-[var(--border-primary)] space-y-1 text-xs">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-[var(--text-tertiary)]">Protection Mode:</span>
                  <span className="text-[var(--accent-brass-bright)] font-semibold">Vault Isolated</span>
                </div>
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-[var(--text-tertiary)]">Legal Grounding:</span>
                  <span className="text-[var(--text-primary)]">Nigerian Privacy Law</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Experience Highlights Section */}
      <section id="experience" className="py-24 bg-[var(--bg-secondary)] border-y border-[var(--border-primary)] relative">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono text-[var(--accent-brass)] uppercase tracking-widest block">
              Built for Trust & Reassurance
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[var(--text-primary)]">
              An Experience Designed to Give You Peace of Mind
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Every detail in Privora is engineered to make security feel clear, deliberate, and absolute.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "Zero-Knowledge Storage",
                desc: "Your files are encrypted before they ever leave your device. We store only scrambled data — not even our servers can read your content.",
                accent: "File Sovereignty"
              },
              {
                icon: Fingerprint,
                title: "Password-Derived Key",
                desc: "Your master key is computed from your passphrase in memory and immediately discarded. Your password never lives in any database.",
                accent: "Private Authentication"
              },
              {
                icon: Activity,
                title: "Active Threat Defense",
                desc: "Real-time audit telemetry monitors every login and access attempt. Suspicious actions create immediate alerts to keep you informed.",
                accent: "Automated Vigilance"
              }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="layered-card p-8 rounded-sm space-y-4 relative group hover:border-[var(--accent-brass)] transition-colors"
                >
                  <div className="w-12 h-12 rounded bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--accent-brass)] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono text-[var(--accent-brass)] uppercase tracking-wider block">
                    {item.accent}
                  </span>
                  <h3 className="text-xl font-serif text-[var(--text-primary)]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section id="why-privora" className="py-20 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-6 space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-serif text-[var(--text-primary)]">
            Ready to Take Control of Your Personal Data?
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Create your account in seconds and protect your first file.
          </p>
          <div className="pt-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--accent-brass)] text-[#12141C] text-sm font-semibold rounded-sm hover:bg-[var(--accent-brass-bright)] shadow-[var(--shadow-layered-lg)] transition-all"
            >
              <span>Initialize Your Vault Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
