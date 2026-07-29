import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../api/axiosInstance';
import SecurityActionBtn from '../components/SecurityActionBtn';
import EmptyState from '../components/EmptyState';
import SealStamp from '../components/SealStamp';
import { 
  Lock, 
  Unlock, 
  Trash2, 
  Upload, 
  FileText, 
  FileCode, 
  Archive, 
  Database, 
  Image as ImageIcon,
  X,
  Plus,
  ShieldCheck,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function MyData() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [password, setPassword] = useState('');
  const [downloadModal, setDownloadModal] = useState(null);
  const [downloadPassword, setDownloadPassword] = useState('');
  const [toast, setToast] = useState(null);
  const [sealModal, setSealModal] = useState(null); // File object that was just sealed

  const fileInputRef = useRef(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/api/encryption/assets/');
      setAssets(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch {
      setAssets([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleUpload = async () => {
    if (!selectedFile || !password.trim()) return;
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('password', password);

    try {
      await axiosInstance.post('/api/encryption/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploadedName = selectedFile.name;
      setShowModal(false);
      setSelectedFile(null);
      setPassword('');
      fetchAssets();

      // Trigger Signature Moment: The Ledger Seal
      setSealModal({ name: uploadedName });
      setTimeout(() => setSealModal(null), 2500);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Upload failed — please try again';
      showToast(typeof msg === 'string' ? msg : 'Upload failed', 'error');
      throw err;
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/encryption/assets/${id}/`);
      showToast('Record purged from ledger');
      fetchAssets();
    } catch {
      showToast('Failed to delete file', 'error');
    }
  };

  const handleDownload = async () => {
    if (!downloadModal || !downloadPassword.trim()) return;
    try {
      const res = await axiosInstance.post(
        `/api/encryption/assets/${downloadModal.id}/retrieve/`,
        { password: downloadPassword },
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', downloadModal.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setDownloadModal(null);
      setDownloadPassword('');
      showToast('File unsealed and downloaded');
    } catch (err) {
      const msg = err.response?.status === 403
        ? 'Wrong password — please try again'
        : err.response?.data?.detail || 'Could not unseal file';
      showToast(typeof msg === 'string' ? msg : 'Download failed', 'error');
      throw err;
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) setSelectedFile(e.dataTransfer.files[0]);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '--';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(1)} MB`;
    return `${(bytes / 1073741824).toFixed(2)} GB`;
  };

  const fileIcon = (name) => {
    const ext = (name || '').split('.').pop()?.toLowerCase();
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return <Archive className="w-4 h-4 text-[var(--accent-brass)]" />;
    if (['sql', 'db', 'sqlite'].includes(ext)) return <Database className="w-4 h-4 text-[var(--accent-brass)]" />;
    if (['json', 'xml', 'csv'].includes(ext)) return <FileCode className="w-4 h-4 text-[var(--accent-brass)]" />;
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext)) return <ImageIcon className="w-4 h-4 text-[var(--accent-brass)]" />;
    return <FileText className="w-4 h-4 text-[var(--accent-brass)]" />;
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-[60]"
          >
            <div className={`flex items-center gap-3 px-5 py-3.5 rounded-sm text-xs font-mono border shadow-[var(--shadow-layered)] ${
              toast.type === 'error'
                ? 'bg-[var(--badge-danger-bg)] text-[var(--badge-danger-text)] border-[var(--status-danger)]/40'
                : 'bg-[var(--badge-success-bg)] text-[var(--badge-success-text)] border-[var(--status-success)]/40'
            }`}>
              {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              <span>{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Signature Moment: The Ledger Seal Overlay */}
      <AnimatePresence>
        {sealModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-[var(--bg-modal-overlay)] backdrop-blur-none"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="ledger-sheet p-8 rounded-sm bg-[var(--bg-card)] text-center max-w-sm flex flex-col items-center justify-center space-y-4"
            >
              <SealStamp label="OFFICIALLY SEALED" subtitle="RECORD LOGGED" size="lg" />
              <div className="space-y-1">
                <h3 className="text-xl font-serif text-[var(--text-primary)]">
                  File Sealed & Recorded
                </h3>
                <p className="text-xs text-[var(--text-secondary)] font-mono truncate max-w-xs">
                  {sealModal.name}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[var(--accent-brass)] uppercase tracking-widest flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            Protected File Ledger
          </span>
          <h1 className="text-3xl font-serif font-semibold text-[var(--text-primary)] mt-1">
            Vault Ledger Entries
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Sealed file records protected under zero-knowledge key isolation.
          </p>
        </div>

        <SecurityActionBtn
          onClick={() => setShowModal(true)}
          actionLabel="Opening…"
          delayMs={300}
        >
          <Plus className="w-4 h-4" />
          <span>Protect File</span>
        </SecurityActionBtn>
      </div>

      {/* Vault Assets — Ledger Sheet Layout Primitive */}
      {loading ? (
        <div className="ledger-sheet p-6 rounded-sm space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton h-12 w-full" />
          ))}
        </div>
      ) : assets.length === 0 ? (
        <EmptyState
          title="No file records logged"
          description="Upload your first file to seal and log it in the vault ledger."
          action={
            <SecurityActionBtn
              onClick={() => setShowModal(true)}
              actionLabel="Opening…"
              delayMs={300}
            >
              <Upload className="w-4 h-4" />
              <span>Protect First File</span>
            </SecurityActionBtn>
          }
          iconType="vault"
        />
      ) : (
        <div className="ledger-sheet rounded-sm divide-y divide-[var(--border-primary)] overflow-hidden border border-[var(--border-primary)]">
          {assets.map((asset, idx) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="ledger-entry-row"
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="font-mono text-xs text-[var(--accent-brass)] shrink-0 font-semibold">
                  #{String(idx + 1).padStart(3, '0')}
                </span>

                <div className="p-2 rounded bg-[var(--bg-input)] border border-[var(--border-primary)] shrink-0">
                  {fileIcon(asset.name)}
                </div>

                <div className="min-w-0">
                  <h3 className="text-xs font-medium text-[var(--text-primary)] truncate">
                    {asset.name || 'Untitled File'}
                  </h3>
                  <span className="text-[10px] font-mono text-[var(--text-tertiary)] block mt-0.5">
                    {formatFileSize(asset.file_size)} &middot; Added {asset.created_at ? new Date(asset.created_at).toLocaleDateString() : '--'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="text-[10px] font-mono text-[var(--badge-success-text)] hidden sm:flex items-center gap-1 bg-[var(--badge-success-bg)] px-2 py-0.5 rounded border border-[var(--status-success)]/30">
                  <ShieldCheck className="w-3 h-3" />
                  SEALED
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setDownloadModal(asset); setDownloadPassword(''); }}
                    className="p-1.5 rounded bg-[var(--bg-input)] hover:bg-[var(--bg-hover)] border border-[var(--border-primary)] text-[var(--text-primary)] hover:text-[var(--accent-brass)] transition-colors cursor-pointer"
                    title="Unseal & Download"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                  </button>

                  <SecurityActionBtn
                    onClick={() => handleDelete(asset.id)}
                    actionLabel="Purging…"
                    successLabel="Purged"
                    delayMs={500}
                    variant="danger"
                    className="!p-1.5 !text-xs"
                    title="Delete Record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </SecurityActionBtn>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ─── Encrypt Upload Modal ─── */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--bg-modal-overlay)]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
              className="ledger-sheet p-6 sm:p-8 rounded-sm max-w-lg w-full bg-[var(--bg-card)] relative"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border-primary)]">
                <div>
                  <span className="text-[10px] font-mono text-[var(--accent-brass)] uppercase tracking-wider">
                    Ledger Ingestion
                  </span>
                  <h2 className="text-xl font-serif text-[var(--text-primary)] mt-0.5">
                    Seal & Record File
                  </h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drag & Drop Zone */}
              <div
                className={`border border-dashed rounded-sm p-6 text-center mb-5 cursor-pointer transition-all ${
                  dragActive
                    ? 'border-[var(--accent-brass)] bg-[var(--bg-hover)]'
                    : 'border-[var(--border-secondary)] bg-[var(--bg-input)]'
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => { if (e.target.files?.[0]) setSelectedFile(e.target.files[0]); }}
                />
                <Upload className="w-8 h-8 mx-auto text-[var(--accent-brass)] mb-2" />
                {selectedFile ? (
                  <div>
                    <p className="text-xs font-mono font-medium text-[var(--text-primary)] truncate max-w-xs mx-auto">
                      {selectedFile.name}
                    </p>
                    <p className="text-[10px] font-mono text-[var(--text-tertiary)] mt-1">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-medium text-[var(--text-primary)]">
                      Click to select or drag a file here
                    </p>
                    <p className="text-[10px] text-[var(--text-tertiary)] mt-1 font-mono">
                      File will be encrypted in memory before ledger entry
                    </p>
                  </div>
                )}
              </div>

              {/* Password Input */}
              <div className="mb-6 space-y-2">
                <label className="block text-xs font-mono text-[var(--text-secondary)]">
                  Master Decryption Passphrase
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secret passphrase…"
                  className="w-full px-3.5 py-2.5 rounded-sm bg-[var(--bg-input)] border border-[var(--border-primary)] text-xs text-[var(--text-primary)] outline-none font-mono"
                />
                <p className="text-[10px] text-[var(--text-tertiary)] leading-normal font-mono">
                  Privora never persists your password. Losing this passphrase means the record cannot be unsealed.
                </p>
              </div>

              {/* Action Controls */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-primary)]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  Cancel
                </button>

                <SecurityActionBtn
                  onClick={handleUpload}
                  disabled={!selectedFile || !password.trim()}
                  actionLabel="Encrypting & Sealing…"
                  successLabel="SEALED"
                  delayMs={850}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Seal & Record</span>
                </SecurityActionBtn>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Unlock/Download Modal ─── */}
      <AnimatePresence>
        {downloadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--bg-modal-overlay)]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
              className="ledger-sheet p-6 sm:p-8 rounded-sm max-w-md w-full bg-[var(--bg-card)] relative"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border-primary)]">
                <div>
                  <span className="text-[10px] font-mono text-[var(--accent-brass)] uppercase tracking-wider">
                    Unseal Verification
                  </span>
                  <h2 className="text-xl font-serif text-[var(--text-primary)] mt-0.5">
                    Unseal Ledger Entry
                  </h2>
                </div>
                <button
                  onClick={() => { setDownloadModal(null); setDownloadPassword(''); }}
                  className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 rounded bg-[var(--bg-input)] border border-[var(--border-primary)] flex items-center gap-3 mb-5">
                {fileIcon(downloadModal.name)}
                <div className="min-w-0">
                  <p className="text-xs font-mono font-medium text-[var(--text-primary)] truncate">
                    {downloadModal.name}
                  </p>
                  <p className="text-[10px] font-mono text-[var(--text-tertiary)]">
                    {formatFileSize(downloadModal.file_size)}
                  </p>
                </div>
              </div>

              <div className="mb-6 space-y-2">
                <label className="block text-xs font-mono text-[var(--text-secondary)]">
                  Enter master passphrase to unseal
                </label>
                <input
                  type="password"
                  value={downloadPassword}
                  onChange={(e) => setDownloadPassword(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && downloadPassword.trim()) handleDownload(); }}
                  placeholder="Passphrase…"
                  className="w-full px-3.5 py-2.5 rounded-sm bg-[var(--bg-input)] border border-[var(--border-primary)] text-xs text-[var(--text-primary)] outline-none font-mono"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-primary)]">
                <button
                  type="button"
                  onClick={() => { setDownloadModal(null); setDownloadPassword(''); }}
                  className="px-4 py-2 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  Cancel
                </button>

                <SecurityActionBtn
                  onClick={handleDownload}
                  disabled={!downloadPassword.trim()}
                  actionLabel="Unsealing Key…"
                  successLabel="UNSEALED"
                  delayMs={750}
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Unseal & Download</span>
                </SecurityActionBtn>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
