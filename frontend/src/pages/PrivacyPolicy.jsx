import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Lock, EyeOff, Server, FileText } from 'lucide-react';
import PrivoraSeal from '../components/PrivoraSeal';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans antialiased selection:bg-[var(--accent-brass)] selection:text-[#14140F]">
      
      {/* Navigation Header */}
      <nav className="border-b border-[var(--border-primary)] bg-[var(--bg-sidebar)] sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Privora</span>
          </Link>
          <div className="flex items-center gap-2">
            <PrivoraSeal variant="glyph" size={20} />
            <span className="font-display text-base font-bold text-[var(--text-primary)]">Privora</span>
          </div>
        </div>
      </nav>

      {/* Main Document Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
        
        {/* Document Header */}
        <header className="space-y-3 border-b border-[var(--border-primary)] pb-8 text-left">
          <span className="text-xs font-mono text-[var(--accent-gold)] tracking-widest uppercase block font-semibold">
            PRIVACY STANDARDS & LEGAL COMPLIANCE
          </span>
          <h1 className="text-3xl sm:text-5xl font-headline font-bold text-[var(--text-primary)] tracking-tight">
            Privacy Policy & Data Security
          </h1>
          <p className="text-xs font-mono text-[var(--text-tertiary)] pt-1">
            Last Updated: August 2, 2026 &middot; Compliant with NDPR & International Privacy Frameworks
          </p>
        </header>

        {/* Executive Summary Alert Box */}
        <div className="p-5 sm:p-6 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl space-y-3 text-left">
          <div className="flex items-center gap-2 text-[var(--accent-gold)] font-headline font-bold text-base sm:text-lg">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <span>Our Core Commitment to You</span>
          </div>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
            Privora is engineered as a <strong>Zero-Knowledge Digital Vault</strong>. Every file you upload is encrypted directly on your device before it ever reaches our servers. We cannot read your files, sell your data, or access your secret keys — because we never possess them.
          </p>
        </div>

        {/* Section 1: Zero-Knowledge Architecture */}
        <section className="space-y-4 text-left">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-[var(--accent-gold)] shrink-0" />
            <h2 className="text-xl sm:text-2xl font-headline font-bold text-[var(--text-primary)]">
              1. Zero-Knowledge Encryption
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-sans">
            Your files are locked using AES-256 client-side encryption. The secret key is derived directly from your secret password in your browser. Privora servers store only encrypted blobs. Even under legal subpoena or server inspection, your raw file contents remain mathematically unreadable to anyone except you.
          </p>
        </section>

        {/* Section 2: Data We Collect & What We Never Collect */}
        <section className="space-y-4 text-left">
          <div className="flex items-center gap-2.5">
            <EyeOff className="w-5 h-5 text-[var(--accent-gold)] shrink-0" />
            <h2 className="text-xl sm:text-2xl font-headline font-bold text-[var(--text-primary)]">
              2. Information We Collect & Hold
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg space-y-2">
              <span className="font-mono text-xs text-[var(--accent-gold)] uppercase tracking-wider block font-semibold">
                WHAT WE STORE
              </span>
              <ul className="text-xs text-[var(--text-secondary)] space-y-1.5 list-disc list-inside font-sans">
                <li>Your account email address</li>
                <li>Hashed authentication credentials</li>
                <li>Encrypted file blobs (ciphertext only)</li>
                <li>Your personal activity ledger logs</li>
              </ul>
            </div>

            <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg space-y-2">
              <span className="font-mono text-xs text-[var(--status-danger)] uppercase tracking-wider block font-semibold">
                WHAT WE NEVER TOUCH
              </span>
              <ul className="text-xs text-[var(--text-secondary)] space-y-1.5 list-disc list-inside font-sans">
                <li>Your unencrypted document contents</li>
                <li>Your master secret password</li>
                <li>Third-party advertising trackers</li>
                <li>Cross-site browser history profiles</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3: Audit Ledger & Transparency */}
        <section className="space-y-4 text-left">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-[var(--accent-gold)] shrink-0" />
            <h2 className="text-xl sm:text-2xl font-headline font-bold text-[var(--text-primary)]">
              3. Audit Ledger & Activity Logging
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-sans">
            Every access event (login, file seal, file view, or password change) is recorded in your personal <strong>Heartbeat Audit Ledger</strong>. This log exists to provide you with complete transparency and proof of who accessed your files and when.
          </p>
        </section>

        {/* Section 4: Data Portability & Deletion Rights */}
        <section className="space-y-4 text-left">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-[var(--accent-gold)] shrink-0" />
            <h2 className="text-xl sm:text-2xl font-headline font-bold text-[var(--text-primary)]">
              4. Data Portability & Permanent Deletion Rights
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-sans">
            You maintain 100% ownership of your data. Under NDPR and international data protection laws:
          </p>
          <ul className="text-xs sm:text-sm text-[var(--text-secondary)] space-y-2 list-disc list-inside font-sans pl-2">
            <li><strong>Right to Export</strong>: You can download your complete vault history and file metadata at any time from your Account Settings.</li>
            <li><strong>Right to Erasure (Right to be Forgotten)</strong>: You can trigger a permanent account deletion from Settings. Executing this permanently purges all your encrypted files, audit logs, and account credentials from our database with zero recovery capability.</li>
          </ul>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-primary)] bg-[var(--bg-sidebar)] px-4 sm:px-6 py-6 text-xs font-mono text-[var(--text-tertiary)]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <span>Privora — Zero-Knowledge Security Vault</span>
          <span>© {new Date().getFullYear()} Privora. All rights reserved.</span>
        </div>
      </footer>

    </div>
  );
}
