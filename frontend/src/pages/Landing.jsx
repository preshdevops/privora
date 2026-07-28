import { Link } from 'react-router-dom';

export default function Landing() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen themed-bg themed-text">
      {/* ─── Navigation ─── */}
      <nav className="sticky top-0 z-50 themed-bg border-b themed-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center">
              <svg className="w-6 h-6 text-[var(--accent-gold)]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.67-3.13 9.04-7 10.2-3.87-1.16-7-5.53-7-10.2V6.3l7-3.12z"/>
                <path d="M12 7a2 2 0 00-2 2v2a2 2 0 001 1.73V15a1 1 0 002 0v-2.27A2 2 0 0014 11V9a2 2 0 00-2-2z"/>
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight font-display">Privora</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <span onClick={() => scrollTo('features')} className="text-sm cursor-pointer themed-text-secondary hover:themed-text transition-colors font-medium border-b-2 border-[var(--accent-gold)] pb-0.5">Features</span>
            <span onClick={() => scrollTo('how-it-works')} className="text-sm cursor-pointer themed-text-muted hover:themed-text transition-colors">How It Works</span>
            <span onClick={() => scrollTo('features')} className="text-sm cursor-pointer themed-text-muted hover:themed-text transition-colors">Security</span>
            <span className="text-sm cursor-pointer themed-text-muted hover:themed-text transition-colors">About</span>
          </div>

          <div className="flex items-center gap-5">
            <Link to="/login" className="text-sm font-medium themed-text-secondary hover:themed-text transition-colors">
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 bg-[var(--text-primary)] text-[var(--bg-primary)] text-sm font-bold rounded-none hover:bg-[var(--accent-gold)] hover:text-white transition-colors duration-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative z-10 text-left">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8 font-display animate-fade-in-up text-[var(--text-primary)]">
              Your Data. <br />
              <span className="text-[var(--accent-gold)] italic font-light">Absolute Control.</span>
            </h1>
            <p className="text-[var(--text-secondary)] text-lg max-w-lg mb-10 animate-fade-in-up-delay font-sans">
              Privora is a zero-knowledge digital vault. We encrypt, monitor, and protect your most sensitive files so no one else can access them without your explicit cryptographic permission.
            </p>

            <div className="flex items-center gap-5 animate-fade-in-up-delay">
              <Link
                to="/register"
                className="px-8 py-4 bg-[var(--accent-gold)] text-white font-bold rounded-none hover:bg-[var(--accent-gold-bright)] transition-colors duration-200"
              >
                Secure Your Vault
              </Link>
              <span
                onClick={() => scrollTo('how-it-works')}
                className="px-8 py-4 border border-[var(--border-primary)] themed-text font-bold rounded-none cursor-pointer hover:bg-[var(--bg-hover)] transition-colors duration-200"
              >
                View Protocol
              </span>
            </div>
          </div>
          
          <div className="hidden md:flex justify-end animate-fade-in-up-delay">
             <div className="relative w-full max-w-md aspect-square bg-[var(--bg-card)] border border-[var(--border-primary)] shadow-[var(--shadow-card)] p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                   <span className="font-mono text-xs text-[var(--text-tertiary)] uppercase tracking-widest">Vault Status</span>
                   <span className="flex items-center gap-2 font-mono text-xs text-[var(--status-success)]">
                     <span className="w-2 h-2 rounded-full bg-[var(--status-success)] animate-pulse"></span>
                     SECURE
                   </span>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <svg className="w-32 h-32 text-[var(--border-secondary)]" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                        <path strokeLinecap="square" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                </div>
                <div className="border-t border-[var(--border-primary)] pt-4 mt-4 font-mono text-[10px] text-[var(--text-muted)] flex justify-between">
                    <span>SYS.ON</span>
                    <span>AES-256-CBC</span>
                    <span>{new Date().toISOString().split('T')[0]}</span>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
      <section className="border-y border-[var(--border-primary)] bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Encryption Standard', value: '256-bit AES-CBC' },
            { label: 'Key Architecture', value: 'Zero-Knowledge' },
            { label: 'System Uptime', value: '99.999%' },
            { label: 'Audit Logging', value: 'Immutable Ledger' },
          ].map((stat) => (
            <div key={stat.label} className="text-left border-l-2 border-[var(--border-primary)] pl-4">
              <p className="text-[10px] tracking-[0.2em] text-[var(--text-tertiary)] uppercase font-mono mb-2">{stat.label}</p>
              <p className="text-sm font-bold text-[var(--text-primary)] font-sans">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-4xl font-bold font-display mb-4">Core Infrastructure</h2>
            <p className="text-[var(--text-secondary)] max-w-2xl text-lg">Engineered for absolute privacy. Our systems are designed under the assumption that networks will be breached, ensuring your data remains secure regardless.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                ),
                title: 'Military-Grade Vault',
                desc: 'Your files are encrypted client-side using AES-256-CBC before they ever leave your device. We hold the encrypted ciphertext; only you hold the key.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                  </svg>
                ),
                title: 'Active Threat Detection',
                desc: 'Our autonomous audit system monitors every decryption attempt and login, triggering immediate account lockdowns upon detecting anomalous behavior.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M4 6h16M4 12h16m-7 6h7"/>
                  </svg>
                ),
                title: 'Immutable Ledger',
                desc: 'Every security event, from file access to privacy toggles, is recorded in a tamper-evident ledger. You always know exactly who accessed what, and when.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-8 bg-[var(--bg-card)] border border-[var(--border-primary)] hover:border-[var(--accent-gold)] transition-colors duration-300 rounded-none flex flex-col h-full"
              >
                <div className="mb-6 text-[var(--accent-gold)]">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4 font-display">{feature.title}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed flex-grow">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="py-24 border-t border-[var(--border-primary)] bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
             <div>
                <h2 className="text-4xl font-bold mb-4 font-display">Execution Protocol</h2>
                <p className="text-[var(--text-secondary)] max-w-lg">
                  Secure your digital assets in three distinct phases.
                </p>
             </div>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                title: 'Initialization',
                desc: 'Establish your cryptographic identity. Generate your master keys locally, ensuring zero-knowledge transfer to our servers.',
              },
              {
                step: '02',
                title: 'Encapsulation',
                desc: 'Upload your sensitive data. The client-side application encrypts the payload, transmitting only secure ciphertext to the vault.',
              },
              {
                step: '03',
                title: 'Surveillance',
                desc: 'The Privora audit engine actively monitors access patterns, logging all activity and blocking unauthorized decryption attempts.',
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col">
                <div className="font-mono text-4xl text-[var(--border-secondary)] font-bold mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3 font-display">
                  {item.title}
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] p-12 md:p-20 text-center shadow-[var(--shadow-card)]">
            <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-8 font-display">
              Ready to secure your vault?
            </h2>
            <p className="text-[var(--text-secondary)] mb-10 max-w-xl mx-auto">
              Stop relying on promises. Start relying on math. Deploy your personal Privora instance today.
            </p>
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <Link
                to="/register"
                className="px-8 py-4 bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold hover:bg-[var(--accent-gold)] hover:text-white transition-colors duration-200"
              >
                Initialize Vault
              </Link>
              <Link to="/login" className="px-8 py-4 border border-[var(--border-primary)] text-[var(--text-primary)] font-bold hover:bg-[var(--bg-hover)] transition-colors duration-200">
                Access Existing Vault
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-[var(--border-primary)] py-12 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="font-bold text-xl font-display">Privora</span>
            <p className="text-[10px] tracking-[0.1em] text-[var(--text-muted)] uppercase font-mono mt-2">
              © {new Date().getFullYear()} Privora Systems. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-8">
            <span className="text-[10px] tracking-[0.1em] text-[var(--text-muted)] font-mono uppercase cursor-pointer hover:text-[var(--text-primary)] transition-colors">Privacy Policy</span>
            <span className="text-[10px] tracking-[0.1em] text-[var(--text-muted)] font-mono uppercase cursor-pointer hover:text-[var(--text-primary)] transition-colors">Terms of Service</span>
            <span className="text-[10px] tracking-[0.1em] text-[var(--text-muted)] font-mono uppercase cursor-pointer hover:text-[var(--text-primary)] transition-colors">Compliance</span>
            <span className="text-[10px] tracking-[0.1em] text-[var(--text-muted)] font-mono uppercase cursor-pointer hover:text-[var(--text-primary)] transition-colors">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

