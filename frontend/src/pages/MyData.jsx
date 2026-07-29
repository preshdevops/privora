import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../api/axiosInstance';
import SecurityActionBtn from '../components/SecurityActionBtn';
import EmptyState from '../components/EmptyState';
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
  AlertCircle,
  Sparkles
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
  const [firstProtection, setFirstProtection] = useState(false);

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

      // Celebratory moment for first file protection
      const wasEmpty = assets.length === 0;
      setShowModal(false);
      setSelectedFile(null);
      setPassword('');
      fetchAssets();

      if (wasEmpty) {
        setFirstProtection(true);
        setTimeout(() => setFirstProtection(false), 3000);
      } else {
        showToast('File protected and stored safely');
      }
    } catch (err) {
      const msg = err.response?.data?.detail || 'Upload failed — please try again';
      showToast(typeof msg === 'string' ? msg : 'Upload failed', 'error');
      throw err;
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/encryption/assets/${id}/`);
      showToast('File permanently deleted');
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
      showToast('File unlocked and downloaded');
    } catch (err) {
      const msg = err.response?.status === 403
        ? 'Wrong password — please try again'
        : err.response?.data?.detail || 'Could not unlock this file';
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
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return <Archive className="w-5 h-5 text-[var(--accent-brass)]" />;
    if (['sql', 'db', 'sqlite'].includes(ext)) return <Database className="w-5 h-5 text-[var(--accent-brass)]" />;
    if (['json', 'xml', 'csv'].includes(ext)) return <FileCode className="w-5 h-5 text-[var(--accent-brass)]" />;
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext)) return <ImageIcon className="w-5 h-5 text-[var(--accent-brass)]" />;
    return <FileText className="w-5 h-5 text-[var(--accent-brass)]" />;
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
            <div className={`flex items-center gap-3 px-5 py-3.5 rounded-sm text-xs border shadow-[var(--shadow-layered)] ${
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

      {/* First Protection Celebration */}
      <AnimatePresence>
        {firstProtection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-[var(--bg-modal-overlay)]"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="layered-card-accent p-8 rounded-sm bg-[var(--bg-card)] text-center max-w-sm"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 12 }}
                className="w-16 h-16 mx-auto rounded-full bg-[var(--accent-brass)] flex items-center justify-center text-[#12141C] mb-4"
              >
                <Sparkles className="w-8 h-8" />
              </motion.div>
              <h3 className="text-xl font-serif text-[var(--text-primary)] mb-2">
                Your first file is protected!
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Only you can access it. That's the Privora promise.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[var(--accent-brass)] uppercase tracking-widest flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            My Files
          </span>
          <h1 className="text-3xl font-serif font-semibold text-[var(--text-primary)] mt-1">
            Protected Files
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Your encrypted files — only you can read them.
          </p>
        </div>

        <SecurityActionBtn
          onClick={() => setShowModal(true)}
          actionLabel="Opening…"
          delayMs={300}
        >
          <Plus className="w-4 h-4" />
          <span>Protect a File</span>
        </SecurityActionBtn>
      </div>

      {/* Vault Assets Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="layered-card p-6 rounded-sm space-y-3">
              <div className="skeleton h-5 w-3/4" />
              <div className="skeleton h-3 w-1/2" />
              <div className="skeleton h-3 w-1/3" />
            </div>
          ))}
        </div>
      ) : assets.length === 0 ? (
        <EmptyState
          title="No files yet"
          description="Upload your first file to protect it. Once encrypted, only you can read it."
          action={
            <SecurityActionBtn
              onClick={() => setShowModal(true)}
              actionLabel="Opening…"
              delayMs={300}
            >
              <Upload className="w-4 h-4" />
              <span>Protect Your First File</span>
            </SecurityActionBtn>
          }
          iconType="vault"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <motion.div
              key={asset.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="layered-card p-5 rounded-sm flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 rounded bg-[var(--bg-input)] border border-[var(--border-primary)] group-hover:border-[var(--accent-brass-dim)] transition-colors">
                      {fileIcon(asset.name)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-medium text-[var(--text-primary)] truncate">
                        {asset.name || 'Untitled'}
                      </h3>
                      <span className="text-[11px] font-mono text-[var(--text-tertiary)] block mt-0.5">
                        {formatFileSize(asset.file_size)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-[var(--bg-input)] border border-[var(--border-primary)] space-y-1 my-3 font-mono text-[10px] text-[var(--text-secondary)]">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-tertiary)]">STATUS:</span>
                    <span className="text-[var(--accent-brass-bright)]">Protected</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-tertiary)]">ADDED:</span>
                    <span>{asset.created_at ? new Date(asset.created_at).toLocaleDateString() : '--'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[var(--border-primary)] mt-2">
                <span className="text-[10px] font-mono text-[var(--badge-success-text)] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  SECURE
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setDownloadModal(asset); setDownloadPassword(''); }}
                    className="p-1.5 rounded bg-[var(--bg-input)] hover:bg-[var(--bg-hover)] border border-[var(--border-primary)] text-[var(--text-primary)] hover:text-[var(--accent-brass)] transition-colors cursor-pointer"
                    title="Unlock & Download"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                  </button>

                  <SecurityActionBtn
                    onClick={() => handleDelete(asset.id)}
                    actionLabel="Deleting…"
                    successLabel="Deleted"
                    delayMs={600}
                    variant="danger"
                    className="!p-1.5 !text-xs"
                    title="Delete"
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
              className="layered-card-accent p-6 sm:p-8 rounded-sm max-w-lg w-full bg-[var(--bg-card)] relative"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border-primary)]">
                <div>
                  <span className="text-[10px] font-mono text-[var(--accent-brass)] uppercase tracking-wider">
                    File Protection
                  </span>
                  <h2 className="text-xl font-serif text-[var(--text-primary)] mt-0.5">
                    Protect a File
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
                    <p className="text-[10px] text-[var(--text-tertiary)] mt-1">
                      Your file will be encrypted before storage
                    </p>
                  </div>
                )}
              </div>

              {/* Password Input */}
              <div className="mb-6 space-y-2">
                <label className="block text-xs text-[var(--text-secondary)]">
                  Choose a password for this file
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a strong password…"
                  className="w-full px-3.5 py-2.5 rounded-sm bg-[var(--bg-input)] border border-[var(--border-primary)] text-xs text-[var(--text-primary)] outline-none"
                />
                <p className="text-[10px] text-[var(--text-tertiary)] leading-normal">
                  Remember this password — it's the only way to unlock this file. We don't store it.
                </p>
              </div>

              {/* Action Controls */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-primary)]">
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
                  actionLabel="Protecting your file…"
                  successLabel="Protected"
                  delayMs={850}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Protect & Upload</span>
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
              className="layered-card-accent p-6 sm:p-8 rounded-sm max-w-md w-full bg-[var(--bg-card)] relative"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border-primary)]">
                <div>
                  <span className="text-[10px] font-mono text-[var(--accent-brass)] uppercase tracking-wider">
                    Unlock File
                  </span>
                  <h2 className="text-xl font-serif text-[var(--text-primary)] mt-0.5">
                    Download Your File
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
                <label className="block text-xs text-[var(--text-secondary)]">
                  Enter the password you used to protect this file
                </label>
                <input
                  type="password"
                  value={downloadPassword}
                  onChange={(e) => setDownloadPassword(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && downloadPassword.trim()) handleDownload(); }}
                  placeholder="File password…"
                  className="w-full px-3.5 py-2.5 rounded-sm bg-[var(--bg-input)] border border-[var(--border-primary)] text-xs text-[var(--text-primary)] outline-none"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-primary)]">
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
                  successLabel="Unlocked"
                  delayMs={750}
                >
                  <Unlock className="w-3.5 h-3.5" />
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
