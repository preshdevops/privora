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
      <nav className="border-b border-[var(--border-primary)] bg-[#14140F]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <PrivoraSeal variant="glyph" size={22} />
            <span className="font-headline text-lg sm:text-xl font-bold text-[#F2EFE6] tracking-tight">
              Privora
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-xs lg:text-sm text-[var(--text-secondary)]">
            <button onClick={() => scrollTo('vault-feature')} className="hover:text-[#F2EFE6] transition-colors cursor-pointer">
              The Vault
            </button>
            <button onClick={() => scrollTo('ledger-feature')} className="hover:text-[#F2EFE6] transition-colors cursor-pointer">
              The Ledger
            </button>
            <button onClick={() => scrollTo('score-feature')} className="hover:text-[#F2EFE6] transition-colors cursor-pointer">
              The Score
            </button>
            <button onClick={() => scrollTo('under-the-hood')} className="hover:text-[#F2EFE6] transition-colors cursor-pointer">
              Under the Hood
            </button>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
            <Link to="/login" className="text-[var(--text-secondary)] hover:text-[#F2EFE6] transition-colors font-medium touch-target px-1">
              Sign in
            </Link>
            <Link
              to="/register"
              className="btn-primary-brass text-xs !py-2 !px-3.5 sm:!px-4"
            >
              <span className="hidden sm:inline">Secure My First File</span>
              <span className="sm:hidden">Secure File</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section: Exact Plain Copy & Interactive Alive Vault Panel ─── */}
      <section className="py-10 sm:py-16 lg:py-24 border-b border-[var(--border-primary)] relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* Left Column: Plain Sellable Copy (No Jargon) */}
          <div className="w-full lg:col-span-6 space-y-4 sm:space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1C1C16] border border-[var(--border-primary)] text-[11px] sm:text-xs font-mono-ledger text-[var(--accent-brass)]">
              <span>REAL-TIME PROTECTION</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-headline font-bold text-[#F2EFE6] leading-[1.12] tracking-tight">
              Lock your files. <br />
              Track access. <br />
              <span className="text-[var(--accent-brass)]">Stay 100% safe.</span>
            </h1>

            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-xl">
              Privora locks your sensitive files, tracks every time someone opens them, and shows your real-time safety score.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2 w-full">
              <Link
                to="/register"
                className="btn-primary-brass text-sm font-semibold px-6 py-3.5 w-full sm:w-auto"
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

          {/* Right Column: Live Interactive Vault Demo Panel (Die-Cut Corner Container) */}
          <div className="w-full lg:col-span-6">
            <div className="die-cut-card die-cut-card-lg p-1 bg-[#1C1C16] relative shadow-2xl">
              <div className="die-cut-border-brass"></div>

              {/* Rubber Stamp Animation Overlay */}
              <StampEffect trigger={stampActive} onStampComplete={() => setStampActive(false)} label="LOCKED & SEALED" />

              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-[#14140F]">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#282820] pb-3 sm:pb-4 gap-2">
                  <div>
                    <span className="font-mono-ledger text-[10px] sm:text-[11px] text-[var(--text-tertiary)] uppercase tracking-wider block">
                      TRY IT NOW
                    </span>
                    <span className="font-headline text-sm sm:text-base font-semibold text-[#F2EFE6]">
                      Your Personal Vault
                    </span>
                  </div>
                  <button
                    onClick={handleLockSampleFile}
                    className="btn-primary-brass text-xs py-1.5 px-3 min-h-[36px] shrink-0"
                  >
                    <span>+ Lock a test file</span>
                  </button>
                </div>

                {/* Grid: Rising Liquid Score Dial + Stamped File */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 items-center bg-[#1C1C16] p-3.5 sm:p-4 die-cut-card-sm relative">
                  <div className="die-cut-border"></div>

                  <div className="sm:col-span-5 flex justify-center py-2">
                    {/* Signature Moment #4: Rising Liquid Score Dial */}
                    <RisingScoreDial score={score} size={130} label="SAFETY SCORE" />
                  </div>

                  <div className="sm:col-span-7 space-y-2.5">
                    <span className="font-mono-ledger text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider block">
                      LOCKED VAULT ITEMS
                    </span>

                    {[
                      { name: 'house_contract.pdf', label: 'LOCKED SAFE' },
                      { name: 'family_passport.pdf', label: 'LOCKED SAFE' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 sm:p-2.5 bg-[#14140F] border border-[#282820] text-xs font-mono-ledger">
                        <span className="text-[#F2EFE6] truncate max-w-[150px] sm:max-w-none">{item.name}</span>
                        <span className="text-[var(--accent-brass)] text-[10px] font-bold shrink-0 ml-2">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Signature Moment #3: Heartbeat Ledger Pulse */}
                <HeartbeatLedger entries={ledgerEntries} title="LIVE ACTIVITY STREAM" compact={true} />

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── Three Feature Sections: One Per Signature Moment ─── */}
      <div className="space-y-0">
        
        {/* Feature 1: The Vault (The Stamp Moment) */}
        <section id="vault-feature" className="py-12 sm:py-20 border-b border-[var(--border-primary)] bg-[#181813]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            
            <div className="md:col-span-6 space-y-4 text-left">
              <span className="font-mono-ledger text-xs text-[var(--accent-brass)] tracking-widest uppercase block">
                FEATURE 1 — INSTANT VAULT
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-headline font-bold text-[#F2EFE6]">
                Instant protection for every document
              </h2>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                Every file you upload is encrypted instantly. Nobody can open it without leaving a clear record.
              </p>
            </div>

            <div className="md:col-span-6">
              <div className="die-cut-card p-4 sm:p-6 bg-[#1C1C16] relative border border-[var(--border-primary)] text-center space-y-4">
                <div className="die-cut-border"></div>
                
                <span className="font-mono-ledger text-xs text-[var(--text-tertiary)] uppercase tracking-wider block">
                  LIVE DEMO — THE SEAL
                </span>

                <div className="py-4 sm:py-6 flex flex-col items-center justify-center space-y-3">
                  <StampEffect trigger={true} inline={true} label="INSTANTLY LOCKED" />
                  <p className="font-mono-ledger text-xs text-[var(--text-secondary)]">
                    Privora seals every item the moment it enters your vault.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Feature 2: The Ledger (The Heartbeat Pulse Moment) */}
        <section id="ledger-feature" className="py-12 sm:py-20 border-b border-[var(--border-primary)] bg-[#14140F]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            
            <div className="md:col-span-6 md:order-2 space-y-4 text-left">
              <span className="font-mono-ledger text-xs text-[var(--accent-brass)] tracking-widest uppercase block">
                FEATURE 2 — ACCESS TRACKER
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-headline font-bold text-[#F2EFE6]">
                Know every time your files are opened
              </h2>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                See every single time your files were opened, downloaded, or updated — completely transparent.
              </p>
            </div>

            <div className="md:col-span-6 md:order-1">
              <div className="die-cut-card p-1 bg-[#1C1C16] relative border border-[var(--border-primary)]">
                <div className="die-cut-border"></div>
                <HeartbeatLedger entries={ledgerEntries} title="LIVE ACCESS HISTORY" />
              </div>
            </div>

          </div>
        </section>

        {/* Feature 3: The Score (The Rising Score Moment) */}
        <section id="score-feature" className="py-12 sm:py-20 border-b border-[var(--border-primary)] bg-[#181813]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            
            <div className="md:col-span-6 space-y-4 text-left">
              <span className="font-mono-ledger text-xs text-[var(--accent-brass)] tracking-widest uppercase block">
                FEATURE 3 — SAFETY RATING
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-headline font-bold text-[#F2EFE6]">
                Know your exact security score at a glance
              </h2>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                Watch your protection score in real time. It goes up when you add protection steps, giving you total certainty.
              </p>
            </div>

            <div className="md:col-span-6 flex justify-center">
              <div className="die-cut-card p-6 sm:p-8 bg-[#1C1C16] relative border border-[var(--border-primary)] text-center w-full max-w-xs sm:max-w-none">
                <div className="die-cut-border"></div>
                <RisingScoreDial score={score} size={160} label="YOUR SAFETY RATING" />
              </div>
            </div>

          </div>
        </section>

      </div>

      {/* ─── Under the Hood Appendix Section ─── */}
      <section id="under-the-hood" className="py-12 sm:py-16 border-b border-[var(--border-primary)] bg-[#0F0F0B]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
          
          <div className="border-b border-[var(--border-primary)] pb-4 text-left">
            <span className="font-mono-ledger text-xs text-[var(--accent-brass)] tracking-widest uppercase block">
              HOW PRIVORA PROTECTS YOU
            </span>
            <h3 className="text-lg sm:text-xl font-headline font-bold text-[#F2EFE6] mt-1">
              Bank-grade privacy built for complete peace of mind
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-mono-ledger text-xs text-left">
            <div className="p-4 bg-[#14140F] border border-[#282820] space-y-1">
              <span className="text-[var(--accent-brass)] font-semibold block">BANK-GRADE ENCRYPTION</span>
              <span className="text-[#F2EFE6]">Locked on your device before saving</span>
            </div>

            <div className="p-4 bg-[#14140F] border border-[#282820] space-y-1">
              <span className="text-[var(--accent-brass)] font-semibold block">SECRET PASSWORD LOCK</span>
              <span className="text-[#F2EFE6]">Only your password can open files</span>
            </div>

            <div className="p-4 bg-[#14140F] border border-[#282820] space-y-1">
              <span className="text-[var(--accent-brass)] font-semibold block">SECURE SIGN-IN</span>
              <span className="text-[#F2EFE6]">Protected account sessions</span>
            </div>

            <div className="p-4 bg-[#14140F] border border-[#282820] space-y-1">
              <span className="text-[var(--accent-brass)] font-semibold block">ZERO LEAK GUARANTEE</span>
              <span className="text-[#F2EFE6]">No unencrypted copies on server</span>
            </div>
          </div>

        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="py-16 sm:py-24 bg-[#14140F] relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8 relative z-10">
          <PrivoraSeal variant="full" size={72} className="mx-auto sm:w-24 sm:h-24" />
          
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-headline font-bold text-[#F2EFE6]">
            Lock it. Watch it. Prove it.
          </h2>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed">
            Privora keeps your files locked away, keeps an eye on every move, and shows you — live — exactly how safe you are.
          </p>

          <div className="pt-2">
            <Link
              to="/register"
              className="btn-primary-brass text-sm sm:text-base font-semibold px-6 sm:px-8 py-3.5 sm:py-4 w-full sm:w-auto"
            >
              <span>Secure My First File</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Quiet Footer ─── */}
      <footer className="border-t border-[var(--border-primary)] bg-[#0A0A07] px-4 sm:px-6 py-6 sm:py-8 text-xs font-mono-ledger text-[var(--text-tertiary)]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <span>Privora — Built to Nigerian and international privacy standards</span>
          <span>© {new Date().getFullYear()} Privora. All rights reserved.</span>
        </div>
      </footer>

    </div>
  );
}
