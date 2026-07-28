import { useState, useEffect, useRef } from 'react';
import axiosInstance from '../api/axiosInstance';

export default function MyData() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [assetType, setAssetType] = useState('System Backup');
  const [sensitivity, setSensitivity] = useState('Tier 1 - Low');
  const [autoRotate, setAutoRotate] = useState(true);
  const [password, setPassword] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [downloadModal, setDownloadModal] = useState(null);
  const [downloadPassword, setDownloadPassword] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [toast, setToast] = useState(null);

  const fileInputRef = useRef(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
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
    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('password', password);

    try {
      await axiosInstance.post('/api/encryption/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      showToast('Asset encrypted and uploaded successfully');
      setShowModal(false);
      setSelectedFile(null);
      setPassword('');
      fetchAssets();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Encryption upload failed';
      showToast(typeof msg === 'string' ? msg : 'Upload failed', 'error');
    }
    setUploading(false);
  };

  const handleDelete = async (id) => {
    if (deletingId) return;
    setDeletingId(id);
    try {
      await axiosInstance.delete(`/api/encryption/assets/${id}/`);
      showToast('Asset deleted successfully');
      fetchAssets();
    } catch (err) {
      showToast('Failed to delete asset', 'error');
    }
    setDeletingId(null);
  };

  const handleDownload = async () => {
    if (!downloadModal || !downloadPassword.trim()) return;
    setDownloading(true);
    try {
      const res = await axiosInstance.post(
        `/api/encryption/assets/${downloadModal.id}/retrieve/`,
        { password: downloadPassword },
        { responseType: 'blob' }
      );

      // Trigger file download in browser
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
      showToast('File downloaded successfully');
    } catch (err) {
      const msg = err.response?.status === 403
        ? 'Incorrect password'
        : err.response?.data?.detail || 'Download failed';
      showToast(typeof msg === 'string' ? msg : 'Download failed', 'error');
    }
    setDownloading(false);
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
    const style = { color: 'var(--accent-gold)' };
    if (ext === 'pdf') return (
      <svg className="w-6 h-6 inline" style={style} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="square" strokeLinejoin="miter" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    );
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return (
      <svg className="w-6 h-6 inline" style={style} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="square" strokeLinejoin="miter" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    );
    if (['sql', 'db', 'sqlite'].includes(ext)) return (
      <svg className="w-6 h-6 inline" style={style} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="square" strokeLinejoin="miter" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    );
    if (['json', 'xml', 'csv'].includes(ext)) return (
      <svg className="w-6 h-6 inline" style={style} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="square" strokeLinejoin="miter" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext)) return (
      <svg className="w-6 h-6 inline" style={style} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="square" strokeLinejoin="miter" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    );
    return (
      <svg className="w-6 h-6 inline" style={style} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="square" strokeLinejoin="miter" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    );
  };

  const Skeleton = ({ className }) => <div className={`skeleton ${className}`} />;

  return (
    <div className="animate-fade-in-up">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-[60] animate-slide-up" style={{ minWidth: 280 }}>
          <div
            className="flex items-center gap-3 px-6 py-4 rounded-none text-sm font-bold shadow-[var(--shadow-card)] border font-mono uppercase tracking-wider"
            style={{
              background: 'var(--bg-modal)',
              borderColor: toast.type === 'error' ? 'var(--status-danger)' : 'var(--status-success)',
              color: toast.type === 'error' ? 'var(--status-danger)' : 'var(--status-success)',
            }}
          >
            <span className="flex items-center">
              {toast.type === 'error' ? (
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeLinejoin="miter" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeLinejoin="miter" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
            {toast.message}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase font-bold font-mono mb-2 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="square" strokeLinejoin="miter" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Encryption Vault
          </p>
          <h1 className="text-3xl font-bold font-display mb-1" style={{ color: 'var(--text-primary)' }}>My Encrypted Data</h1>
          <p className="text-sm font-sans" style={{ color: 'var(--text-secondary)' }}>
            Manage your encrypted assets and upload new files for secure storage.
          </p>
        </div>
        <div
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-none text-sm font-bold cursor-pointer transition-colors border w-full sm:w-auto uppercase tracking-wider"
          style={{
            background: 'var(--text-primary)',
            borderColor: 'var(--text-primary)',
            color: 'var(--bg-primary)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
          onClick={() => setShowModal(true)}
          role="button" tabIndex={0} id="encrypt-new-file-btn"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeLinejoin="miter" d="M12 4v16m8-8H4" />
          </svg>
          Encrypt New File
        </div>
      </div>

      {/* Assets Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-6 rounded-none border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
              <Skeleton className="h-6 w-3/4 mb-4" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      ) : assets.length === 0 ? (
        <div className="rounded-none border p-16 text-center shadow-[var(--shadow-card)]" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
          <div className="w-20 h-20 mx-auto mb-6 rounded-none border flex items-center justify-center" style={{ background: 'var(--bg-hover)', borderColor: 'var(--border-secondary)' }}>
            <svg className="w-10 h-10" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="square" strokeLinejoin="miter" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold font-display mb-2" style={{ color: 'var(--text-primary)' }}>Vault Empty</h3>
          <p className="text-sm mb-6 font-sans" style={{ color: 'var(--text-secondary)' }}>Upload your first file to cryptographically secure your data.</p>
          <div
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-none text-sm font-bold cursor-pointer transition-colors border uppercase tracking-wider"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-primary)',
              color: 'var(--text-primary)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-card)'; }}
            onClick={() => setShowModal(true)} role="button" tabIndex={0} id="empty-state-upload-btn"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="square" strokeLinejoin="miter" d="M12 4v16m8-8H4" />
            </svg>
            Upload File
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="p-6 rounded-none border transition-colors group relative"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)', boxShadow: 'var(--shadow-card)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-gold)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-primary)'; }}
            >
              <div className="flex items-start justify-between mb-4 min-w-0 gap-3">
                <div className="flex items-start gap-4 min-w-0">
                  <span className="text-2xl shrink-0 mt-1">{fileIcon(asset.name)}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold font-sans truncate mb-1" style={{ color: 'var(--text-primary)' }}>{asset.name || 'Untitled'}</p>
                    <div className="flex flex-col gap-1 mt-2 font-mono">
                      <p className="text-[10px] tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
                        SIZE: <span className="font-bold" style={{ color: 'var(--text-secondary)' }}>{formatFileSize(asset.file_size)}</span>
                      </p>
                      <p className="text-[10px] tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
                        TIME: <span className="font-bold" style={{ color: 'var(--text-secondary)' }}>{asset.created_at ? new Date(asset.created_at).toLocaleDateString() : '--'}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-secondary)' }}>
                <span className="text-[10px] tracking-wider uppercase font-bold px-2 py-0.5 rounded-none font-mono" style={{ background: 'var(--status-success)', color: 'var(--bg-primary)' }}>
                  AES-256
                </span>
                <span className="text-[10px] uppercase font-bold font-mono tracking-widest" style={{ color: 'var(--text-muted)' }}>Locked</span>
                
                <div className="flex ml-auto gap-2">
                  <div
                    className="w-8 h-8 rounded-none border flex items-center justify-center cursor-pointer transition-colors"
                    style={{ background: 'var(--bg-card)', borderColor: 'var(--border-secondary)' }}
                    onClick={() => { setDownloadModal(asset); setDownloadPassword(''); }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-card)'; }}
                    role="button" tabIndex={0} id={`download-asset-${asset.id}`}
                    title="Download & Decrypt"
                  >
                    <svg className="w-4 h-4" style={{ color: 'var(--text-primary)' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="square" strokeLinejoin="miter" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div
                    className="w-8 h-8 rounded-none border flex items-center justify-center cursor-pointer transition-colors"
                    style={{ background: 'var(--bg-card)', borderColor: 'var(--border-secondary)' }}
                    onClick={() => handleDelete(asset.id)}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--status-danger)'; e.currentTarget.style.borderColor = 'var(--status-danger)'; e.currentTarget.firstChild.style.color = '#fff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.borderColor = 'var(--border-secondary)'; e.currentTarget.firstChild.style.color = 'var(--status-danger)'; }}
                    role="button" tabIndex={0} id={`delete-asset-${asset.id}`}
                    title="Delete"
                  >
                    {deletingId === asset.id ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" style={{ color: 'var(--status-danger)' }} />
                    ) : (
                      <svg className="w-4 h-4 transition-colors" style={{ color: 'var(--status-danger)' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="square" strokeLinejoin="miter" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Upload Modal ─── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" style={{ background: 'var(--bg-modal-overlay)' }} onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="w-full max-w-lg rounded-none p-6 sm:p-8 animate-slide-up shadow-[var(--shadow-card)]" style={{ background: 'var(--bg-modal)', border: '1px solid var(--border-primary)' }}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>Secure Ingestion</h2>
              <div className="w-8 h-8 rounded-none border flex items-center justify-center cursor-pointer transition-colors" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-secondary)' }} onClick={() => setShowModal(false)} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-card)'; }} role="button" tabIndex={0} id="close-modal-btn">
                <svg className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" d="M6 18L18 6M6 6l12 12" /></svg>
              </div>
            </div>

            <div
              className={`border-2 border-dashed rounded-none p-8 sm:p-12 text-center mb-6 cursor-pointer transition-colors w-full`}
              style={{ borderColor: dragActive ? 'var(--text-primary)' : 'var(--border-secondary)', background: dragActive ? 'var(--bg-hover)' : 'var(--bg-input)' }}
              onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()} role="button" tabIndex={0} id="drop-zone"
            >
              <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => { if (e.target.files?.[0]) setSelectedFile(e.target.files[0]); }} />
              <div className="w-12 h-12 mx-auto mb-4 rounded-none border flex items-center justify-center" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-secondary)' }}>
                <svg className="w-6 h-6" style={{ color: 'var(--text-primary)' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              </div>
              {selectedFile ? (
                <div>
                  <p className="text-sm font-bold font-mono truncate max-w-xs mx-auto" style={{ color: 'var(--text-primary)' }}>{selectedFile.name}</p>
                  <p className="text-xs mt-2 font-mono" style={{ color: 'var(--text-muted)' }}>{formatFileSize(selectedFile.size)}</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-bold font-sans" style={{ color: 'var(--text-primary)' }}>Drop physical file here</p>
                  <p className="text-xs mt-2 font-mono" style={{ color: 'var(--text-muted)' }}>UP TO 2GB (ANY FORMAT)</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase font-bold mb-2 font-mono" style={{ color: 'var(--text-muted)' }}>Asset Type</label>
                <select value={assetType} onChange={(e) => setAssetType(e.target.value)} className="w-full px-4 py-3 rounded-none text-sm appearance-none cursor-pointer border focus:border-[var(--accent-gold)] font-mono" style={{ background: 'var(--bg-input)', borderColor: 'var(--border-secondary)', color: 'var(--text-primary)' }} id="asset-type-select">
                  <option>System Backup</option><option>Database</option><option>Documents</option><option>Media</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase font-bold mb-2 font-mono" style={{ color: 'var(--text-muted)' }}>Sensitivity</label>
                <select value={sensitivity} onChange={(e) => setSensitivity(e.target.value)} className="w-full px-4 py-3 rounded-none text-sm appearance-none cursor-pointer border focus:border-[var(--accent-gold)] font-mono" style={{ background: 'var(--bg-input)', borderColor: 'var(--border-secondary)', color: 'var(--text-primary)' }} id="sensitivity-select">
                  <option>Tier 1 - Low</option><option>Tier 2 - Medium</option><option>Tier 3 - Critical</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between p-5 rounded-none mb-6 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-secondary)' }}>
              <div className="flex items-center gap-4">
                <svg className="w-5 h-5 shrink-0" style={{ color: 'var(--accent-gold)' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeLinejoin="miter" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <div>
                  <p className="text-sm font-bold font-sans" style={{ color: 'var(--text-primary)' }}>Auto-Rotate Encryption</p>
                  <p className="text-[10px] uppercase tracking-widest font-mono mt-1" style={{ color: 'var(--text-muted)' }}>30-DAY CYCLES</p>
                </div>
              </div>
              <div className={`toggle-track ${autoRotate ? 'active' : 'inactive'}`} onClick={() => setAutoRotate(!autoRotate)} role="switch" tabIndex={0} id="auto-rotate-toggle">
                <div className="toggle-thumb" />
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-[10px] tracking-[0.2em] uppercase font-bold mb-2 font-mono" style={{ color: 'var(--text-muted)' }}>Encryption Key</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="ENTER MASTER PASSWORD" className="w-full px-4 py-3 rounded-none text-sm border focus:border-[var(--accent-gold)] font-mono" style={{ background: 'var(--bg-input)', borderColor: 'var(--border-secondary)', color: 'var(--text-primary)' }} id="encryption-password" />
            </div>

            <div className="flex items-center justify-end gap-4">
              <div className="px-6 py-3 rounded-none text-sm font-bold cursor-pointer transition-colors font-sans uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }} onClick={() => setShowModal(false)} role="button" tabIndex={0} id="cancel-upload-btn">Cancel</div>
              <div
                className={`px-8 py-3 rounded-none text-sm font-bold cursor-pointer transition-colors font-sans uppercase tracking-wider ${!selectedFile || !password.trim() || uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}
                onClick={selectedFile && password.trim() && !uploading ? handleUpload : undefined}
                role="button" tabIndex={0} id="encrypt-upload-btn"
              >
                {uploading ? (<span className="flex items-center gap-3"><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />ENCRYPTING...</span>) : ('SEAL & UPLOAD')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Download Password Modal ─── */}
      {downloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" style={{ background: 'var(--bg-modal-overlay)' }} onClick={(e) => { if (e.target === e.currentTarget) { setDownloadModal(null); setDownloadPassword(''); } }}>
          <div className="w-full max-w-md rounded-none p-6 sm:p-8 animate-slide-up shadow-[var(--shadow-card)]" style={{ background: 'var(--bg-modal)', border: '1px solid var(--border-primary)' }}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>Decryption Request</h2>
              <div className="w-8 h-8 rounded-none border flex items-center justify-center cursor-pointer transition-colors" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-secondary)' }} onClick={() => { setDownloadModal(null); setDownloadPassword(''); }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-card)'; }} role="button" tabIndex={0} id="close-download-modal">
                <svg className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" d="M6 18L18 6M6 6l12 12" /></svg>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-none mb-6 border" style={{ background: 'var(--bg-input)', borderColor: 'var(--border-secondary)' }}>
              <span className="text-2xl">{fileIcon(downloadModal.name)}</span>
              <div className="min-w-0">
                <p className="text-sm font-bold font-mono truncate mb-1" style={{ color: 'var(--text-primary)' }}>{downloadModal.name}</p>
                <p className="text-[10px] tracking-widest font-mono" style={{ color: 'var(--text-muted)' }}>{formatFileSize(downloadModal.file_size)}</p>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-[10px] tracking-[0.2em] uppercase font-bold mb-2 font-mono" style={{ color: 'var(--text-muted)' }}>Decryption Key</label>
              <input
                type="password" value={downloadPassword} onChange={(e) => setDownloadPassword(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && downloadPassword.trim()) handleDownload(); }}
                placeholder="ENTER MASTER PASSWORD" className="w-full px-4 py-3 rounded-none text-sm border focus:border-[var(--accent-gold)] font-mono"
                style={{ background: 'var(--bg-input)', borderColor: 'var(--border-secondary)', color: 'var(--text-primary)' }}
                id="download-password" autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-4">
              <div className="px-6 py-3 rounded-none text-sm font-bold cursor-pointer font-sans uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }} onClick={() => { setDownloadModal(null); setDownloadPassword(''); }} role="button" tabIndex={0}>Cancel</div>
              <div
                className={`px-8 py-3 rounded-none text-sm font-bold cursor-pointer transition-colors font-sans uppercase tracking-wider ${!downloadPassword.trim() || downloading ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}
                onClick={downloadPassword.trim() && !downloading ? handleDownload : undefined}
                role="button" tabIndex={0} id="confirm-download-btn"
              >
                {downloading ? (<span className="flex items-center gap-3"><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />DECRYPTING...</span>) : ('UNSEAL')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

