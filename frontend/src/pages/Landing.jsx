import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import VaultDoorEntrance from '../components/VaultDoorEntrance';
import StampEffect from '../components/StampEffect';
import RisingScoreDial from '../components/RisingScoreDial';
import HeartbeatLedger from '../components/HeartbeatLedger';
import PrivoraSeal from '../components/PrivoraSeal';

export default function Landing() {
  const [doorOpened, setDoorOpened] = useState(false);
  const [stampActive, setStampActive] = useState(false);
  const [score, setScore] = useState(94);
  const [ledgerEntries, setLedgerEntries] = useState([
    { id: 1, time: 'Just now', text: 'Your contract file was locked and sealed in the vault.' },
    { id: 2, time: '2 mins ago', text: 'You viewed this file from your recognized phone.' },
    { id: 3, time: '14 mins ago', text: 'Protection score increased to 94 after key verification.' },
  ]);

  // Interactive demo action: Lock a sample file
  const handleLockSampleFile = () => {
    setStampActive(true);
    const newScore = Math.min(100, score + 2);
    setScore(newScore);

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    setLedgerEntries((prev) => [
      { id: Date.now(), time: timeStr, text: 'New file identity_card.pdf was locked instantly in your vault.' },
      ...prev,
    ]);
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans antialiased selection:bg-[var(--accent-brass)] selection:text-[#14140F] relative">
      
      {/* Signature Moment #1: Heavy Vault Door Entrance on page load */}
      <VaultDoorEntrance onComplete={() => setDoorOpened(true)} />

      {/* ─── Navigation Bar ─── */}
      <nav className="border-b border-[var(--border-primary)] bg-[var(--bg-sidebar)] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <PrivoraSeal variant="glyph" size={22} />
            <span className="font-display text-lg sm:text-xl font-bold text-[var(--text-primary)] tracking-tight">
              Privora
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-xs lg:text-sm text-[var(--text-secondary)] font-sans font-medium">
            <button onClick={() => scrollTo('vault-feature')} className="hover:text-[var(--text-primary)] transition-colors cursor-pointer">
              The Vault
            </button>
            <button onClick={() => scrollTo('ledger-feature')} className="hover:text-[var(--text-primary)] transition-colors cursor-pointer">
              The Ledger
            </button>
            <button onClick={() => scrollTo('score-feature')} className="hover:text-[var(--text-primary)] transition-colors cursor-pointer">
              The Score
            </button>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
            <Link to="/login" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-medium touch-target px-1">
              Sign in
            </Link>
            <Link
              to="/register"
              className="btn-primary-gold text-xs !py-2 !px-3.5 sm:!px-4"
            >
              <span className="hidden sm:inline">Secure My First File</span>
              <span className="sm:hidden">Secure File</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section: Clean Minimalist Asymmetric Layout ─── */}
      <section className="py-12 sm:py-16 lg:py-24 border-b border-[var(--border-primary)] relative overflow-hidden bg-[var(--bg-primary)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* Left Column: Minimalist Sellable Copy */}
          <div className="w-full lg:col-span-6 space-y-5 sm:space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--bg-card)] border border-[var(--border-primary)] text-[11px] font-mono text-[var(--accent-gold)] rounded-full">
              <span>REAL-TIME PROTECTION</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-headline font-bold text-[var(--text-primary)] leading-[1.08] tracking-tight">
              Lock it. <br />
              Watch it. <br />
              <span className="text-[var(--accent-gold)]">Prove it.</span>
            </h1>

            <p className="text-base sm:text-lg text-[var(--text-secondary)] font-sans leading-relaxed max-w-xl">
              Privora keeps your files locked away, keeps an eye on every move, and shows you — live — exactly how safe you are.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2 w-full">
              <Link
                to="/register"
                className="btn-primary-gold text-sm font-semibold px-6 py-3.5 w-full sm:w-auto"
              >
                <span>Secure My First File</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => scrollTo('vault-feature')}
                className="btn-secondary-vault text-sm px-6 py-3.5 w-full sm:w-auto"
              >
                <span>See It In Action</span>
              </button>
            </div>
          </div>

          {/* Right Column: Clean Product Demo Container */}
          <div className="w-full lg:col-span-6">
            <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl relative overflow-hidden">
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[var(--border-primary)] pb-3.5 gap-2">
                  <div>
                    <span className="font-mono text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider block">
                      LIVE VAULT DEMO
                    </span>
                    <span className="font-headline text-sm font-bold text-[var(--text-primary)]">
                      Your Personal Vault
                    </span>
                  </div>
                  <button
                    onClick={handleLockSampleFile}
                    className="btn-primary-gold text-xs py-1.5 px-3 min-h-[36px] shrink-0"
                  >
                    <span>+ Lock a test file</span>
                  </button>
                </div>

                {/* Grid: Score Gauge + Vault Items */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-[var(--bg-primary)] p-4 rounded-lg border border-[var(--border-primary)]">
                  <div className="sm:col-span-5 flex justify-center py-1">
                    <RisingScoreDial score={score} size={130} label="PROTECTION SCORE" />
                  </div>

                  <div className="sm:col-span-7 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider block">
                        LOCKED VAULT ITEMS
                      </span>
                      {stampActive && <StampEffect trigger={true} label="SEALED" />}
                    </div>

                    {[
                      { name: 'contract_file.pdf', label: 'LOCKED SAFE' },
                      { name: 'family_passport.pdf', label: 'LOCKED SAFE' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-[var(--bg-card)] border border-[var(--border-primary)] text-xs font-mono rounded">
                        <span className="text-[var(--text-primary)] truncate max-w-[150px] sm:max-w-none">{item.name}</span>
                        <span className="text-[var(--accent-gold)] text-[10px] font-medium shrink-0 ml-2">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activity Ledger Stream */}
                <HeartbeatLedger entries={ledgerEntries} title="LIVE ACTIVITY STREAM" compact={true} />

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── Three Clean Feature Sections ─── */}
      <div className="space-y-0">
        
        {/* Feature 1: The Vault */}
        <section id="vault-feature" className="py-12 sm:py-20 border-b border-[var(--border-primary)] bg-[var(--bg-primary)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            
            <div className="md:col-span-6 space-y-4 text-left">
              <span className="font-mono text-xs text-[var(--accent-gold)] tracking-widest uppercase block font-semibold">
                FEATURE 1 — THE VAULT
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-headline font-bold text-[var(--text-primary)]">
                Every file you upload gets locked instantly.
              </h2>
              <p className="text-base text-[var(--text-secondary)] font-sans leading-relaxed">
                Every file you upload gets locked instantly. Nobody opens it without leaving a trace.
              </p>
            </div>

            <div className="md:col-span-6">
              <div className="p-6 bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] text-center space-y-4">
                <span className="font-mono text-xs text-[var(--text-tertiary)] uppercase tracking-wider block">
                  VAULT STATUS
                </span>

                <div className="py-6 flex flex-col items-center justify-center space-y-3">
                  <StampEffect trigger={true} label="INSTANTLY LOCKED & PROTECTED" />
                  <p className="font-mono text-xs text-[var(--text-secondary)] pt-2">
                    Privora seals every item the moment it enters your vault.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Feature 2: The Ledger */}
        <section id="ledger-feature" className="py-12 sm:py-20 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            
            <div className="md:col-span-6 md:order-2 space-y-4 text-left">
              <span className="font-mono text-xs text-[var(--accent-gold)] tracking-widest uppercase block font-semibold">
                FEATURE 2 — THE LEDGER
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-headline font-bold text-[var(--text-primary)]">
                See every single time your files were touched.
              </h2>
              <p className="text-base text-[var(--text-secondary)] font-sans leading-relaxed">
                See every single time your files were touched, opened, or shared — nothing happens in the dark.
              </p>
            </div>

            <div className="md:col-span-6 md:order-1">
              <div className="p-1 bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)]">
                <HeartbeatLedger entries={ledgerEntries} title="HEARTBEAT AUDIT LEDGER" />
              </div>
            </div>

          </div>
        </section>

        {/* Feature 3: The Score */}
        <section id="score-feature" className="py-12 sm:py-20 border-b border-[var(--border-primary)] bg-[var(--bg-primary)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            
            <div className="md:col-span-6 space-y-4 text-left">
              <span className="font-mono text-xs text-[var(--accent-gold)] tracking-widest uppercase block font-semibold">
                FEATURE 3 — THE SCORE
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-headline font-bold text-[var(--text-primary)]">
                Watch your protection score in real time.
              </h2>
              <p className="text-base text-[var(--text-secondary)] font-sans leading-relaxed">
                Watch your protection score in real time. It goes up when you're safer. It never lies to you.
              </p>
            </div>

            <div className="md:col-span-6 flex justify-center">
              <div className="p-6 sm:p-8 bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] text-center w-full max-w-xs sm:max-w-none flex justify-center">
                <RisingScoreDial score={score} size={150} label="PROTECTION SCORE" />
              </div>
            </div>

          </div>
        </section>

      </div>

      {/* ─── Quiet Minimal CTA Section ─── */}
      <section className="py-16 sm:py-24 bg-[var(--bg-primary)] relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8 relative z-10">
          <PrivoraSeal variant="full" size={64} className="mx-auto" />
          
          <h2 className="text-3xl sm:text-5xl font-headline font-bold text-[var(--text-primary)]">
            Lock it. Watch it. Prove it.
          </h2>

          <p className="text-base sm:text-lg text-[var(--text-secondary)] font-sans max-w-xl mx-auto leading-relaxed">
            Privora keeps your files locked away, keeps an eye on every move, and shows you — live — exactly how safe you are.
          </p>

          <div className="pt-2">
            <Link
              to="/register"
              className="btn-primary-gold text-base font-semibold px-8 py-4 w-full sm:w-auto"
            >
              <span>Secure My First File</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Quiet Minimal Footer ─── */}
      <footer className="border-t border-[var(--border-primary)] bg-[var(--bg-sidebar)] px-4 sm:px-6 py-6 text-xs font-mono text-[var(--text-tertiary)]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <span>Privora — Built to Nigerian and international privacy standards</span>
          <span>© {new Date().getFullYear()} Privora. All rights reserved.</span>
        </div>
      </footer>

    </div>
  );
}
