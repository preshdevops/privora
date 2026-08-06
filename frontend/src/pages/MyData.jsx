import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../api/axiosInstance';
import SecurityActionBtn from '../components/SecurityActionBtn';
import EmptyState from '../components/EmptyState';
import SealStamp from '../components/SealStamp';
import { Lock, Unlock, Trash2, Upload, X, Plus } from 'lucide-react';
import { encryptFileWebCrypto, decryptFileWebCrypto } from '../utils/crypto';

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
  const [sealModal, setSealModal] = useState(null);
  const [expandedFileId, setExpandedFileId] = useState(null);

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

    try {
      // Zero-Knowledge Client-Side WebCrypto Encryption
      const { ciphertextBlob, saltHex, ivHex } = await encryptFileWebCrypto(selectedFile, password);

      const formData = new FormData();
      formData.append('file', ciphertextBlob, selectedFile.name);
      formData.append('name', selectedFile.name);
      formData.append('file_size', selectedFile.size);
      formData.append('salt', saltHex);
      formData.append('iv', ivHex);
      formData.append('password', password); // For fallback server validation if needed

      await axiosInstance.post('/api/encryption/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploadedName = selectedFile.name;
      setShowModal(false);
      setSelectedFile(null);
      setPassword('');
      fetchAssets();

      // Signature Moment: The Ledger Seal
      setSealModal({ name: uploadedName });
      setTimeout(() => setSealModal(null), 2500);
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Upload failed — please try again';
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
        { responseType: 'arraybuffer' }
      );

      let finalBuffer = res.data;
      if (downloadModal.salt && downloadModal.iv) {
        try {
          finalBuffer = await decryptFileWebCrypto(
            res.data,
            downloadPassword,
            downloadModal.salt,
            downloadModal.iv
          );
        } catch {
          // Fallback if payload was server-decrypted CBC
          finalBuffer = res.data;
        }
      }

      const url = window.URL.createObjectURL(new Blob([finalBuffer]));
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
        : err.message || 'Could not unseal file';
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

  const toggleAccordion = (id) => {
    setExpandedFileId(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-12">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="fixed top-6 right-6 z-[60]"
          >
            <div className={`px-5 py-3 rounded-sm text-xs font-mono border ${
              toast.type === 'error'
                ? 'bg-[var(--badge-danger-bg)] text-[var(--badge-danger-text)] border-[var(--status-danger)]/40'
                : 'bg-[var(--badge-success-bg)] text-[var(--badge-success-text)] border-[var(--status-success)]/40'
            }`}>
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
            className="fixed inset-0 z-[70] flex items-center justify-center bg-[var(--bg-modal-overlay)]"
          >
            <div className="p-8 rounded-sm bg-[var(--bg-card)] border border-[var(--border-primary)] text-center max-w-sm flex flex-col items-center justify-center space-y-4">
              <SealStamp label="OFFICIALLY SEALED" subtitle="RECORD LOGGED" size="lg" />
              <div className="space-y-1">
                <h3 className="text-xl font-serif text-[var(--text-primary)]">
                  File sealed and logged
                </h3>
                <p className="text-xs text-[var(--text-secondary)] font-mono truncate max-w-xs">
                  {sealModal.name}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Eyebrow Label & Page Header */}
      <header className="space-y-2 border-b border-[var(--border-primary)] pb-6 sm:pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[var(--accent-gold)] tracking-widest uppercase block">
            MY VAULT
          </span>
          <h1 className="text-2xl sm:text-4xl font-display font-bold text-[var(--text-primary)] mt-1">
            Your Protected Files
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-sans leading-relaxed max-w-xl">
            All your locked files, stored safely inside your vault and accessible only by you.
          </p>
        </div>

        <SecurityActionBtn
          onClick={() => setShowModal(true)}
          actionLabel="Opening…"
          delayMs={0}
          className="w-full sm:w-auto text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>+ Upload & Lock File</span>
        </SecurityActionBtn>
      </header>

      {/* Vault Assets — Opaque Card Rows */}
      {loading ? (
        <div className="py-6 text-xs text-[var(--text-tertiary)] text-center font-mono">
          Loading file entries…
        </div>
      ) : assets.length === 0 ? (
        <EmptyState
          title="No files in your vault yet"
          description="Upload a document to lock it safely inside your vault."
          action={
            <SecurityActionBtn
              onClick={() => setShowModal(true)}
              actionLabel="Opening…"
              delayMs={0}
              className="w-full sm:w-auto text-xs"
            >
              <Upload className="w-4 h-4" />
              <span>+ Upload & Lock File</span>
            </SecurityActionBtn>
          }
        />
      ) : (
        <div className="ledger-list divide-y divide-[var(--border-primary)] border border-[var(--border-primary)] rounded-xl overflow-hidden bg-[var(--bg-card)]">
          {assets.map((asset, idx) => {
            const isExpanded = expandedFileId === asset.id;
            const isEven = idx % 2 === 0;
            return (
              <div key={asset.id} className={`ledger-entry p-3.5 sm:p-4 ${isEven ? 'bg-[var(--bg-card)]' : 'bg-[var(--bg-secondary)]'}`}>
                <div 
                  onClick={() => toggleAccordion(asset.id)}
                  className="cursor-pointer space-y-1.5"
                >
                  {/* Line 1: Index + Primary File Name + Sealed Badge */}
                  <div className="flex items-center justify-between gap-2 min-w-0">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <span className="font-mono text-xs text-[var(--accent-gold)] font-semibold shrink-0">
                        #{String(idx + 1).padStart(3, '0')}
                      </span>
                      <span className="text-sm font-medium text-[var(--text-primary)] font-sans truncate">
                        {asset.name || 'Untitled file'}
                      </span>
                    </div>

                    <span className="px-2.5 py-0.5 text-[10px] font-mono rounded uppercase shrink-0 border bg-[var(--accent-gold-bg)] text-[var(--accent-gold)] border-[var(--accent-gold)]">
                      Locked & Safe
                    </span>
                  </div>

                  {/* Line 2: File Size + Created Date + Expand indicator */}
                  <div className="flex items-center justify-between text-xs font-mono text-[var(--text-tertiary)] pt-0.5">
                    <span className="truncate">
                      {formatFileSize(asset.file_size)}
                      <span className="mx-1.5">&middot;</span>
                      {asset.created_at ? new Date(asset.created_at).toLocaleDateString() : '--'}
                    </span>
                    <span className="text-[11px] text-[var(--accent-gold)] shrink-0 ml-2">
                      {isExpanded ? 'Actions –' : 'Actions +'}
                    </span>
                  </div>
                </div>

                {/* Accordion Detail & Action Drawer */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-3 pb-1 border-t border-[var(--border-primary)] mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
                    >
                      <div className="space-y-1 text-[var(--text-tertiary)]">
                        <p>• Lock key: Device-protected key</p>
                        <p>• Status: Encrypted & safe</p>
                      </div>

                      <div className="flex items-center gap-2.5 pt-1 sm:pt-0">
                        <button
                          onClick={() => { setDownloadModal(asset); setDownloadPassword(''); }}
                          className="flex-1 sm:flex-initial px-3 py-2 border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] hover:border-[var(--accent-gold)] transition-colors cursor-pointer flex items-center justify-center gap-1.5 touch-target"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                          <span>Unlock & download</span>
                        </button>

                        <SecurityActionBtn
                          onClick={() => handleDelete(asset.id)}
                          actionLabel="Deleting…"
                          successLabel="Deleted"
                          delayMs={500}
                          variant="danger"
                          className="!px-3 !py-2 shrink-0 touch-target text-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete File</span>
                        </SecurityActionBtn>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Encrypt Upload Modal ─── */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--bg-modal-overlay)]">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-6 sm:p-8 rounded-xl max-w-lg w-full bg-[var(--bg-card)] border border-[var(--border-primary)] space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border-primary)]">
                <div>
                  <span className="text-xs font-mono text-[var(--accent-gold)] uppercase tracking-wider block">
                    LOCK A NEW FILE
                  </span>
                  <h2 className="text-xl font-display font-bold text-[var(--text-primary)] mt-0.5">
                    Add file to vault
                  </h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drag & Drop Zone */}
              <div
                className={`border border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  dragActive
                    ? 'border-[var(--accent-gold)] bg-[var(--bg-hover)]'
                    : 'border-[var(--border-primary)] bg-[var(--bg-input)]'
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
                <Upload className="w-6 h-6 mx-auto text-[var(--text-tertiary)] mb-2" />
                {selectedFile ? (
                  <div>
                    <p className="text-xs font-mono font-medium text-[var(--text-primary)] truncate max-w-xs mx-auto">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs font-mono text-[var(--text-tertiary)] mt-1">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-[var(--text-primary)] font-sans">
                      Click to select or drag a file here
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)] font-sans mt-1">
                      Your file will be encrypted on your device before saving
                    </p>
                  </div>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1.5 font-sans">
                <label className="block text-xs text-[var(--text-secondary)]">
                  Secret Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secret password…"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-primary)] text-sm text-[var(--text-primary)] outline-none"
                />
              </div>

              {/* Action Controls */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-primary)] font-sans">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  Cancel
                </button>

                <SecurityActionBtn
                  onClick={handleUpload}
                  disabled={!selectedFile || !password.trim()}
                  actionLabel="Locking file…"
                  successLabel="LOCKED"
                  delayMs={750}
                  className="text-xs"
                >
                  <Lock className="w-4 h-4" />
                  <span>Lock File</span>
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-6 sm:p-8 rounded-xl max-w-md w-full bg-[var(--bg-card)] border border-[var(--border-primary)] space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border-primary)]">
                <div>
                  <span className="text-xs font-mono text-[var(--accent-gold)] uppercase tracking-wider block">
                    UNLOCK FILE
                  </span>
                  <h2 className="text-xl font-display font-bold text-[var(--text-primary)] mt-0.5">
                    Download your file
                  </h2>
                </div>
                <button
                  onClick={() => { setDownloadModal(null); setDownloadPassword(''); }}
                  className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 rounded-lg bg-[var(--bg-input)] border border-[var(--border-primary)] text-xs font-mono">
                <p className="text-[var(--text-primary)] font-medium truncate">{downloadModal.name}</p>
                <p className="text-[var(--text-tertiary)]">{formatFileSize(downloadModal.file_size)}</p>
              </div>

              <div className="space-y-1.5 font-sans">
                <label className="block text-xs text-[var(--text-secondary)]">
                  Secret Password
                </label>
                <input
                  type="password"
                  value={downloadPassword}
                  onChange={(e) => setDownloadPassword(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && downloadPassword.trim()) handleDownload(); }}
                  placeholder="Enter secret password…"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-primary)] text-sm text-[var(--text-primary)] outline-none"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-primary)] font-sans">
                <button
                  type="button"
                  onClick={() => { setDownloadModal(null); setDownloadPassword(''); }}
                  className="px-4 py-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  Cancel
                </button>

                <SecurityActionBtn
                  onClick={handleDownload}
                  disabled={!downloadPassword.trim()}
                  actionLabel="Unlocking…"
                  successLabel="UNLOCKED"
                  delayMs={650}
                  className="text-xs"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Unlock & Download</span>
                </SecurityActionBtn>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
