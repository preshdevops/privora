import { Link } from 'react-router-dom';

export default function Landing() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      {/* ─── Navigation ─── */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-navy-950/80 border-b border-navy-700/40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent-blue flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.67-3.13 9.04-7 10.2-3.87-1.16-7-5.53-7-10.2V6.3l7-3.12z"/>
                <path d="M12 7a2 2 0 00-2 2v2a2 2 0 001 1.73V15a1 1 0 002 0v-2.27A2 2 0 0014 11V9a2 2 0 00-2-2z"/>
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight">Privora</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <span onClick={() => scrollTo('features')} className="text-sm text-accent-light cursor-pointer hover:text-white transition-colors font-medium border-b-2 border-accent-blue pb-0.5">Features</span>
            <span onClick={() => scrollTo('how-it-works')} className="text-sm text-slate-400 cursor-pointer hover:text-white transition-colors">How It Works</span>
            <span onClick={() => scrollTo('features')} className="text-sm text-slate-400 cursor-pointer hover:text-white transition-colors">Security</span>
            <span className="text-sm text-slate-400 cursor-pointer hover:text-white transition-colors">Pricing</span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm text-slate-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 bg-accent-blue text-white text-sm font-semibold rounded-lg hover:bg-accent-glow transition-all duration-200 hover:shadow-lg hover:shadow-accent-blue/25"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          {/* Shield Icon */}
          <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-accent-blue/15 border border-accent-blue/30 flex items-center justify-center animate-pulse-glow">
            <svg className="w-10 h-10 text-accent-blue" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.67-3.13 9.04-7 10.2-3.87-1.16-7-5.53-7-10.2V6.3l7-3.12z"/>
              <path d="M12 7a2 2 0 00-2 2v2a2 2 0 001 1.73V15a1 1 0 002 0v-2.27A2 2 0 0014 11V9a2 2 0 00-2-2z"/>
            </svg>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in-up">
            Take Full Control of
            <br />
            Your Personal Data
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10 animate-fade-in-up-delay">
            Privora encrypts, monitors, and protects your data so no one else can
            use it without your permission.
          </p>

          <div className="flex items-center justify-center gap-4 animate-fade-in-up-delay">
            <Link
              to="/register"
              className="px-7 py-3.5 bg-accent-blue text-white font-semibold rounded-xl hover:bg-accent-glow transition-all duration-300 hover:shadow-xl hover:shadow-accent-blue/30 active:scale-[0.97]"
            >
              Get Protected
            </Link>
            <span
              onClick={() => scrollTo('how-it-works')}
              className="px-7 py-3.5 border border-navy-500 text-slate-300 font-semibold rounded-xl cursor-pointer hover:bg-navy-800 hover:border-navy-400 transition-all duration-200"
            >
              See How It Works
            </span>
          </div>
        </div>

        {/* Background radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-accent-blue/5 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* ─── Stats Bar ─── */}
      <section className="border-y border-navy-700/40 bg-navy-900/50">
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Standard', value: '256-bit AES Encryption' },
            { label: 'Governance', value: 'GDPR & NDPA Compliant' },
            { label: 'Reliability', value: '99.9% Uptime' },
            { label: 'Network', value: '10,000+ Users Protected' },
          ].map((stat) => (
            <div key={stat.label} className="text-center md:text-left">
              <p className="text-[10px] tracking-[0.2em] text-slate-500 uppercase font-semibold mb-1">{stat.label}</p>
              <p className="text-sm font-semibold text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                ),
                title: 'Military-Grade Encryption',
                desc: 'Your data is fragmented and encrypted with post-quantum algorithms before it ever leaves your device.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                  </svg>
                ),
                title: 'Real-Time Breach Alerts',
                desc: 'Get instant notifications the moment your credentials appear in dark web leaks or unauthorized access attempts.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                  </svg>
                ),
                title: 'Full Access Control',
                desc: 'Revoke access to your personal information for any service, any time, with a single cryptographic switch.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-8 rounded-2xl bg-navy-900/60 border border-navy-700/40 hover:border-navy-500/60 transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-xl bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center text-accent-blue mb-6 group-hover:bg-accent-blue/20 transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="py-20 md:py-28 border-t border-navy-700/40">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-slate-400 mb-16 max-w-lg mx-auto">
            Secure your digital footprint in three surgical steps.
          </p>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                step: '1',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"/>
                  </svg>
                ),
                title: 'Connect Identity',
                desc: 'Securely link your existing digital accounts through our zero-knowledge handshake protocol.',
              },
              {
                step: '2',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                ),
                title: 'Audit & Scan',
                desc: 'Our sentinel engine scans for vulnerabilities and existing data leaks across the open and dark web.',
              },
              {
                step: '3',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                ),
                title: 'Enforce Privacy',
                desc: 'Deploy active encryption layers and manage granular permissions for every third-party request.',
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center text-accent-blue mb-5">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {item.step}. {item.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed max-w-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="rounded-3xl bg-gradient-to-br from-accent-blue/20 via-navy-800 to-navy-900 border border-accent-blue/20 p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Ready to reclaim your privacy?
            </h2>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                to="/register"
                className="px-8 py-3.5 bg-white text-navy-950 font-semibold rounded-xl hover:bg-slate-100 transition-all duration-200"
              >
                Start Your Free Audit
              </Link>
              <span className="px-8 py-3.5 border border-accent-blue text-accent-light font-semibold rounded-xl cursor-pointer hover:bg-accent-blue/10 transition-all duration-200">
                Talk to Security Expert
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-navy-700/40 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-lg">Privora</span>
            <p className="text-[10px] tracking-[0.1em] text-slate-500 uppercase mt-1">
              © 2026 Privora Cybersecurity Inc. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-[10px] tracking-[0.1em] text-slate-500 uppercase cursor-pointer hover:text-slate-400 transition-colors">Privacy Policy</span>
            <span className="text-[10px] tracking-[0.1em] text-slate-500 uppercase cursor-pointer hover:text-slate-400 transition-colors">Terms of Service</span>
            <span className="text-[10px] tracking-[0.1em] text-slate-500 uppercase cursor-pointer hover:text-slate-400 transition-colors">Compliance</span>
            <span className="text-[10px] tracking-[0.1em] text-slate-500 uppercase cursor-pointer hover:text-slate-400 transition-colors">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
