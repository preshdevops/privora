import React from 'react';

/**
 * Clean static status seal indicator
 */
export default function SealStamp({ 
  label = "LOCKED & SAFE", 
  subtitle = "OFFICIAL RECORD", 
  size = "md",
  className = "" 
}) {
  const dimensions = {
    sm: "w-16 h-16 text-[9px]",
    md: "w-20 h-20 text-[10px]",
    lg: "w-24 h-24 text-xs"
  }[size] || "w-20 h-20 text-[10px]";

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <div className={`${dimensions} rounded-full border border-[#10B981] bg-[rgba(16,185,129,0.12)] p-1 flex items-center justify-center relative select-none`}>
        <div className="w-full h-full rounded-full border border-dashed border-[#10B981]/50 flex flex-col items-center justify-center text-center p-1 bg-[#111827]">
          <span className="font-mono text-[8px] font-semibold text-[#10B981] tracking-widest block uppercase">
            PRIVORA
          </span>
          <div className="w-6 h-[1px] bg-[#10B981] my-0.5" />
          <span className="font-sans font-semibold text-[#34D399] tracking-wider block uppercase text-[9px]">
            {label}
          </span>
          {subtitle && (
            <span className="font-mono text-[7px] text-[#9CA3AF] uppercase tracking-tight block mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
