import { useState, useEffect, useRef } from 'react';
import axiosInstance from '../api/axiosInstance';

export default function MyData() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [password, setPassword] = useState('');
  const [assetType, setAssetType] = useState('System Backup');
  const [sensitivity, setSensitivity] = useState('Tier 3 - Critical');
  const [autoRotate, setAutoRotate] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const fileInputRef = useRef(null);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/api/encryption/assets/');
      const data = res.data;
      setAssets(Array.isArray(data) ? data : data.results || []);
    } catch {
      setAssets([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleUpload = async () => {
    if (!selectedFile || uploading) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('password', password);
      await axiosInstance.post('/api/encryption/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setShowModal(false);
      setSelectedFile(null);
      setPassword('');
      fetchAssets();
    } catch {
      // handle error silently
    }
    setUploading(false);
  };

  const handleDelete = async (id) => {
    if (deletingId) return;
    setDeletingId(id);
    try {
      await axiosInstance.delete(`/api/encryption/assets/${id}/`);
      setAssets((prev) => prev.filter((a) => a.id !== id));
    } catch {
      // handle error silently
    }
    setDeletingId(null);
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
    if (e.dataTransfer.files?.[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '--';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const fileIcon = (name) => {
    const ext = (name || '').split('.').pop()?.toLowerCase();
    if (['pdf'].includes(ext)) return '📄';
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return '📦';
    if (['sql', 'db', 'sqlite'].includes(ext)) return '🗃️';
    if (['json', 'xml', 'csv'].includes(ext)) return '📊';
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext)) return '🖼️';
    return '📁';
  };

  const Skeleton = ({ className }) => <div className={`skeleton ${className}`} />;

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase font-bold mb-2" style={{ color: 'var(--text-muted)' }}>
            🔒 Encryption Vault
          </p>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>My Encrypted Data</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Manage your encrypted assets and upload new files for secure storage.
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-accent-blue cursor-pointer hover:bg-accent-glow transition-all duration-200 hover:shadow-lg hover:shadow-accent-blue/25 active:scale-[0.97]"
          onClick={() => setShowModal(true)}
          role="button"
          tabIndex={0}
          id="encrypt-new-file-btn"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Encrypt New File
        </div>
      </div>

      {/* Assets Grid */}
      {loading ? (
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-5 rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
              <Skeleton className="h-5 w-3/4 mb-3" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      ) : assets.length === 0 ? (
        /* Empty State */
        <div
          className="rounded-2xl border p-16 text-center"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center" style={{ background: 'var(--bg-hover)' }}>
            <svg className="w-10 h-10" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No encrypted files yet</h3>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            Upload your first file to start encrypting and securing your data.
          </p>
          <div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-accent-blue cursor-pointer hover:bg-accent-glow transition-all duration-200"
            onClick={() => setShowModal(true)}
            role="button"
            tabIndex={0}
            id="empty-state-upload-btn"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Upload First File
          </div>
        </div>
      ) : (
        /* File Cards */
        <div className="grid grid-cols-3 gap-4">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 group"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)', boxShadow: 'var(--shadow-card)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{fileIcon(asset.file_name || asset.name)}</span>
                  <div>
                    <p className="text-sm font-semibold truncate max-w-[180px]" style={{ color: 'var(--text-primary)' }}>
                      {asset.file_name || asset.name || 'Untitled'}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {formatFileSize(asset.file_size || asset.size)}
                    </p>
                  </div>
                </div>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'var(--badge-danger-bg)' }}
                  onClick={() => handleDelete(asset.id)}
                  role="button"
                  tabIndex={0}
                  id={`delete-asset-${asset.id}`}
                >
                  {deletingId === asset.id ? (
                    <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span
                  className="text-[9px] tracking-wider uppercase font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'var(--badge-success-bg)', color: 'var(--badge-success-text)' }}
                >
                  AES-256
                </span>
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {asset.created_at ? new Date(asset.created_at).toLocaleDateString() : '--'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Upload Modal ─── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
          style={{ background: 'var(--bg-modal-overlay)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div
            className="w-full max-w-lg rounded-2xl p-6 animate-slide-up"
            style={{ background: 'var(--bg-modal)', border: '1px solid var(--border-secondary)' }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Secure Ingestion</h2>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                style={{ background: 'var(--bg-hover)' }}
                onClick={() => setShowModal(false)}
                role="button"
                tabIndex={0}
                id="close-modal-btn"
              >
                <svg className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>

            {/* Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-xl p-10 text-center mb-5 cursor-pointer transition-all ${dragActive ? 'border-accent-blue bg-accent-blue/5' : ''}`}
              style={{
                borderColor: dragActive ? '#2563eb' : 'var(--border-secondary)',
                background: dragActive ? 'rgba(37,99,235,0.05)' : 'var(--bg-input)',
              }}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              id="drop-zone"
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => { if (e.target.files?.[0]) setSelectedFile(e.target.files[0]); }}
                accept=".zip,.sql,.pdf,.json,.csv,.xml,.db,.tar,.gz,.7z,.rar,.txt"
              />
              <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ background: 'var(--bg-hover)' }}>
                <svg className="w-6 h-6" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              {selectedFile ? (
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{selectedFile.name}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{formatFileSize(selectedFile.size)}</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Drag and drop file to encrypt</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Supports .zip, .sql, .pdf, .json up to 2GB</p>
                </div>
              )}
            </div>

            {/* Options Row */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[10px] tracking-[0.15em] uppercase font-bold mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  Asset Type
                </label>
                <select
                  value={assetType}
                  onChange={(e) => setAssetType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm appearance-none cursor-pointer"
                  style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-secondary)',
                    color: 'var(--text-primary)',
                  }}
                  id="asset-type-select"
                >
                  <option>System Backup</option>
                  <option>Database</option>
                  <option>Documents</option>
                  <option>Media</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.15em] uppercase font-bold mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  Sensitivity
                </label>
                <select
                  value={sensitivity}
                  onChange={(e) => setSensitivity(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm appearance-none cursor-pointer"
                  style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-secondary)',
                    color: 'var(--text-primary)',
                  }}
                  id="sensitivity-select"
                >
                  <option>Tier 1 - Low</option>
                  <option>Tier 2 - Medium</option>
                  <option>Tier 3 - Critical</option>
                </select>
              </div>
            </div>

            {/* Auto-Rotate Toggle */}
            <div
              className="flex items-center justify-between p-4 rounded-xl mb-5"
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border-secondary)' }}
            >
              <div className="flex items-center gap-3">
                <span className="text-emerald-400">✅</span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Auto-Rotate Encryption</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Update keys every 30 days automatically</p>
                </div>
              </div>
              <div
                className={`toggle-track ${autoRotate ? 'active' : 'inactive'}`}
                onClick={() => setAutoRotate(!autoRotate)}
                role="switch"
                tabIndex={0}
                id="auto-rotate-toggle"
              >
                <div className="toggle-thumb" />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-5">
              <label className="block text-[10px] tracking-[0.15em] uppercase font-bold mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Encryption Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a strong encryption password"
                className="w-full px-4 py-2.5 rounded-lg text-sm"
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-secondary)',
                  color: 'var(--text-primary)',
                }}
                id="encryption-password"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <div
                className="px-6 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onClick={() => setShowModal(false)}
                role="button"
                tabIndex={0}
                id="cancel-upload-btn"
              >
                Cancel
              </div>
              <div
                className={`px-8 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-200 ${
                  !selectedFile || uploading
                    ? 'bg-accent-blue/50 cursor-not-allowed text-white/60'
                    : 'bg-accent-blue text-white hover:bg-accent-glow hover:shadow-lg hover:shadow-accent-blue/25 active:scale-[0.97]'
                }`}
                onClick={selectedFile && !uploading ? handleUpload : undefined}
                role="button"
                tabIndex={0}
                id="encrypt-upload-btn"
              >
                {uploading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Encrypting...
                  </span>
                ) : (
                  'Encrypt & Upload'
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
