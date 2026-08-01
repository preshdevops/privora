import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * PasswordInput — Password field component with view/hide toggle.
 */
export default function PasswordInput({
  id,
  value,
  onChange,
  placeholder = '••••••••••••',
  label = 'Master password',
  error,
  className = '',
  autoComplete = 'current-password',
}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={id} className="block text-xs font-sans text-[var(--text-secondary)] select-none">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full px-3.5 py-2.5 pr-10 rounded-sm bg-[var(--bg-input)] border border-[var(--border-primary)] text-sm text-[var(--text-primary)] font-mono-ledger outline-none transition-colors focus:border-[var(--accent-brass)] ${
            error ? 'border-[var(--status-danger)]' : ''
          } ${className}`}
        />

        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 text-[var(--text-tertiary)] hover:text-[var(--accent-brass)] focus:outline-none transition-colors p-1"
          title={showPassword ? 'Hide password' : 'View password'}
          aria-label={showPassword ? 'Hide password' : 'View password'}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>

      {error && (
        <span className="text-xs text-[var(--status-danger)] block">
          {error}
        </span>
      )}
    </div>
  );
}
