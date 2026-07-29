import React from 'react';
import { ShieldAlert, CheckCircle2, FileLock, Scale } from 'lucide-react';

export default function ComplianceBadge({ score = 85, unresolvedAlertsCount = 0 }) {
  const isHealthy = score >= 70 && unresolvedAlertsCount === 0;

  const principles = [
    { name: "NDPR 2023 Principles", status: "Compliant", detail: "Data minimization & lawful processing" },
    { name: "GAID 2025 Standard", status: "Protected", detail: "Automated threat detection & access logging" },
    { name: "AES-256 Vault", status: "Enforced", detail: "Zero-knowledge payload isolation" }
  ];

  return (
    <div className="layered-card p-5 rounded-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border-primary)]">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[var(--accent-brass)]" />
            <h3 className="text-sm font-serif text-[var(--text-primary)]">
              Regulatory Compliance Status
            </h3>
          </div>
          <span className={`px-2.5 py-0.5 text-xs font-mono rounded border ${
            isHealthy
              ? 'bg-[var(--badge-success-bg)] text-[var(--badge-success-text)] border-[var(--status-success)]/30'
              : 'bg-[var(--badge-warning-bg)] text-[var(--badge-warning-text)] border-[var(--status-warning)]/30'
          }`}>
            {isHealthy ? 'HEALTHY' : 'ATTENTION REQUIRED'}
          </span>
        </div>

        <div className="space-y-3 mb-4">
          {principles.map((item, i) => (
            <div key={i} className="flex items-start justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-brass)] shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-[var(--text-primary)]">{item.name}</span>
                  <p className="text-[11px] text-[var(--text-tertiary)]">{item.detail}</p>
                </div>
              </div>
              <span className="font-mono text-[11px] text-[var(--accent-brass-bright)]">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 rounded bg-[var(--bg-input)] border border-[var(--border-primary)] flex items-center justify-between text-xs">
        <span className="text-[var(--text-secondary)]">Data Protection Score</span>
        <span className="font-serif text-lg text-[var(--accent-brass)] font-semibold">
          {score} / 100
        </span>
      </div>
    </div>
  );
}
