import React from 'react';
import PrivoraSeal from './PrivoraSeal';

/**
 * LoadingState — Unified loading indicator using the Privora Seal.
 * Replaces generic animated spinners with an identity-grounded mark.
 */
export default function LoadingState({ message = "Authenticating…", fullScreen = true }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <div className="relative flex items-center justify-center">
        <PrivoraSeal variant="glyph" size={48} className="animate-spin-slow" />
      </div>
      {message && (
        <span className="font-mono text-xs text-[#9CA3AF] tracking-widest uppercase block">
          {message}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] text-[#F9FAFB]">
        {content}
      </div>
    );
  }

  return <div className="py-12 flex items-center justify-center">{content}</div>;
}
