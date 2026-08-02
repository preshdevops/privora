import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import SecurityActionBtn from '../components/SecurityActionBtn';
import PasswordInput from '../components/PasswordInput';
import { ShieldCheck, Download, Trash2, FileText, AlertTriangle, X } from 'lucide-react';

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Password Change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Delete Account Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');

  // Handle Change Password
  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordSuccess('');

    if (!oldPassword) {
      setPasswordError('Current password is required');
      throw new Error('Current password is required');
    }
    if (!newPassword) {
      setPasswordError('New password is required');
      throw new Error('New password is required');
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      throw new Error('New passwords do not match');
    }

    try {
      await axiosInstance.post('/api/users/change-password/', {
        old_password: oldPassword,
        new_password: newPassword,
      });
      setPasswordSuccess('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to update password. Please check current password.';
      setPasswordError(msg);
      throw err;
    }
  };

  // Handle Export Vault Data
  const handleExportData = async () => {
    try {
      const res = await axiosInstance.get('/api/users/export-data/');
      const dataStr = JSON.stringify(res.data, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `privora_vault_export_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      throw err;
    }
  };

  // Handle Permanent Delete Account
  const handleDeleteAccount = async () => {
    setDeleteError('');
    if (!deletePassword) {
      setDeleteError('Password is required to confirm deletion');
      throw new Error('Password required');
    }

    try {
      await axiosInstance.post('/api/users/delete-account/', {
        password: deletePassword,
      });
      logout();
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.error || 'Incorrect password. Account deletion aborted.';
      setDeleteError(msg);
      throw err;
    }
  };

  return (
    <div className="space-y-8 sm:space-y-12 text-left">
      {/* Header */}
      <header className="space-y-2 border-b border-[var(--border-primary)] pb-6 sm:pb-8">
        <span className="text-xs font-mono text-[var(--accent-gold)] tracking-widest uppercase block">
          ACCOUNT & SECURITY CONTROLS
        </span>
        <h1 className="text-2xl sm:text-4xl font-display font-bold text-[var(--text-primary)] mt-1">
          Settings & Account
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-sans leading-relaxed max-w-xl">
          Manage your account credentials, data portability export, and permanent vault deletion options.
        </p>
      </header>

      {/* Section 1: Account Info Profile */}
      <section className="space-y-3 pb-6 border-b border-[var(--border-primary)]">
        <h2 className="text-lg sm:text-xl font-display font-bold text-[var(--text-primary)]">
          Account Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[var(--text-secondary)] bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-primary)] font-sans">
          <div>
            <span className="text-[var(--text-tertiary)] block font-mono text-[10px] uppercase">Full name</span>
            <span className="text-[var(--text-primary)] font-medium text-sm sm:text-base font-sans">{user?.full_name || 'Privora Member'}</span>
          </div>
          <div>
            <span className="text-[var(--text-tertiary)] block font-mono text-[10px] uppercase">Email address</span>
            <span className="text-[var(--text-primary)] font-medium text-sm sm:text-base truncate block font-sans">{user?.email || 'N/A'}</span>
          </div>
        </div>
      </section>

      {/* Section 2: Change Secret Password */}
      <section className="space-y-4 pb-6 border-b border-[var(--border-primary)]">
        <div>
          <h2 className="text-lg sm:text-xl font-display font-bold text-[var(--text-primary)]">
            Change Secret Password
          </h2>
          <p className="text-xs text-[var(--text-secondary)] font-sans mt-0.5">
            Update your master account password. Keep your new password secret.
          </p>
        </div>

        {passwordError && (
          <div className="p-3 rounded bg-[var(--badge-danger-bg)] border border-[var(--status-danger)]/40 text-[var(--badge-danger-text)] text-xs font-mono">
            {passwordError}
          </div>
        )}

        {passwordSuccess && (
          <div className="p-3 rounded bg-[var(--accent-gold-bg)] border border-[var(--accent-gold)] text-[var(--accent-gold)] text-xs font-mono">
            {passwordSuccess}
          </div>
        )}

        <div className="bg-[var(--bg-card)] p-4 sm:p-6 rounded-xl border border-[var(--border-primary)] space-y-4 max-w-md">
          <PasswordInput
            id="settings-old-password"
            label="Current Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />

          <PasswordInput
            id="settings-new-password"
            label="New Secret Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <PasswordInput
            id="settings-confirm-password"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <div className="pt-2">
            <SecurityActionBtn
              onClick={handleChangePassword}
              actionLabel="Updating password…"
              successLabel="Password Updated"
              delayMs={650}
              className="w-full sm:w-auto"
            >
              <span>Update Password</span>
            </SecurityActionBtn>
          </div>
        </div>
      </section>

      {/* Section 3: Data Portability & Legal Policies */}
      <section className="space-y-4 pb-6 border-b border-[var(--border-primary)]">
        <div>
          <h2 className="text-lg sm:text-xl font-display font-bold text-[var(--text-primary)]">
            Data Rights & Privacy Compliance
          </h2>
          <p className="text-xs text-[var(--text-secondary)] font-sans mt-0.5">
            Export a full JSON copy of your vault items and access logs for data portability compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Data Export Box */}
          <div className="p-5 bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-[var(--accent-gold)] font-medium text-sm">
                <Download className="w-4 h-4" />
                <span>Export Vault Data</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
                Download a complete archive containing your profile metadata, encrypted assets, and activity history.
              </p>
            </div>
            <SecurityActionBtn
              onClick={handleExportData}
              actionLabel="Generating export…"
              successLabel="Export Downloaded"
              variant="outline"
              delayMs={600}
              className="text-xs w-full justify-center"
            >
              <span>Download Archive (.json)</span>
            </SecurityActionBtn>
          </div>

          {/* Privacy Policy Link Box */}
          <div className="p-5 bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-[var(--text-primary)] font-medium text-sm">
                <FileText className="w-4 h-4 text-[var(--accent-gold)]" />
                <span>Privacy Standards Policy</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
                Read our zero-knowledge encryption guarantees, NDPR compliance standards, and user rights documentation.
              </p>
            </div>
            <Link
              to="/privacy-policy"
              className="btn-secondary-vault text-xs justify-center w-full py-2.5"
            >
              <span>Read Privacy Policy →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 4: Danger Zone — Permanent Account Deletion */}
      <section className="space-y-4 pt-2">
        <div>
          <h2 className="text-lg sm:text-xl font-display font-bold text-[var(--status-danger)] flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>Danger Zone</span>
          </h2>
          <p className="text-xs text-[var(--text-secondary)] font-sans mt-0.5">
            Permanently delete your account and all associated encrypted vault data.
          </p>
        </div>

        <div className="p-5 bg-[rgba(196,87,63,0.08)] rounded-xl border border-[var(--status-danger)]/30 space-y-3">
          <div className="space-y-1 text-xs text-[var(--text-secondary)] font-sans">
            <p className="font-semibold text-[var(--status-danger)]">Warning: Account deletion is permanent and irreversible.</p>
            <p>Executing account deletion will permanently purge all your encrypted files, audit logs, and authentication records from Privora servers.</p>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2.5 rounded text-xs font-mono font-bold bg-[var(--status-danger)] text-white hover:bg-[var(--status-danger)]/90 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Vault Account</span>
          </button>
        </div>
      </section>

      {/* Permanent Account Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--status-danger)] rounded-xl p-6 space-y-5 relative shadow-2xl">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 text-left">
              <span className="text-xs font-mono text-[var(--status-danger)] tracking-widest uppercase block font-semibold">
                CONFIRM ACCOUNT DELETION
              </span>
              <h3 className="text-xl font-display font-bold text-[var(--text-primary)]">
                Are you absolutely sure?
              </h3>
              <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
                This action cannot be undone. Enter your secret password below to verify your identity and permanently delete your account and files.
              </p>
            </div>

            {deleteError && (
              <div className="p-3 rounded bg-[var(--badge-danger-bg)] border border-[var(--status-danger)]/40 text-[var(--badge-danger-text)] text-xs font-mono">
                {deleteError}
              </div>
            )}

            <PasswordInput
              id="delete-account-password"
              label="Enter Password to Confirm"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                Cancel
              </button>
              <SecurityActionBtn
                onClick={handleDeleteAccount}
                actionLabel="Deleting account…"
                successLabel="Account Deleted"
                delayMs={800}
                className="!bg-[var(--status-danger)] !text-white hover:!bg-[var(--status-danger)]/90"
              >
                <span>Permanently Delete</span>
              </SecurityActionBtn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
