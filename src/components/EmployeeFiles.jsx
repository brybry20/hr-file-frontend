import React, { useState, useEffect } from 'react';
import axios from 'axios';

const STYLES = `
  .ef-container {
    background: #161920;
    border-radius: 16px;
    margin-top: 0;
  }
  
  .ef-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .ef-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'DM Serif Display', serif;
    font-size: 18px;
    color: #e8e4dc;
  }
  
  .ef-upload-area {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
  }
  
  .ef-upload-label {
    padding: 8px 20px;
    background: rgba(110,181,200,0.1);
    border: 1px solid rgba(110,181,200,0.2);
    border-radius: 8px;
    cursor: pointer;
    font-size: 13px;
    color: #6eb5c8;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .ef-upload-label:hover {
    background: rgba(110,181,200,0.2);
    transform: translateY(-2px);
  }
  
  .ef-upload-btn {
    padding: 8px 20px;
    background: #6eb5c8;
    border: none;
    border-radius: 8px;
    color: #0b0d12;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .ef-upload-btn:hover {
    background: #7ec5d8;
    transform: translateY(-2px);
  }
  
  .ef-upload-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  .ef-selected-badge {
    background: #6eb5c8;
    color: #0b0d12;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
  }
  
  /* GALLERY GRID */
  .ef-files-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    max-height: 500px;
    overflow-y: auto;
    padding: 8px 4px;
  }
  
  .ef-file-card {
    background: #1c1f28;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.2s;
    cursor: pointer;
    position: relative;
  }
  
  .ef-file-card:hover {
    border-color: rgba(110,181,200,0.5);
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.3);
  }
  
  /* PREVIEW IMAGE */
  .ef-file-preview {
    width: 100%;
    height: 150px;
    background: #111318;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }
  
  .ef-file-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .ef-file-preview-icon {
    font-size: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 8px;
  }
  
  .ef-file-preview-icon span {
    font-size: 12px;
    color: #6eb5c8;
    background: rgba(110,181,200,0.1);
    padding: 4px 12px;
    border-radius: 20px;
  }
  
  .ef-file-info {
    padding: 12px;
    border-top: 1px solid rgba(255,255,255,0.05);
  }
  
  .ef-file-name {
    font-size: 12px;
    font-weight: 500;
    color: #e8e4dc;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 6px;
  }
  
  .ef-file-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 10px;
    color: #5a5a6a;
  }
  
  .ef-file-size {
    color: #5a5a6a;
  }
  
  .ef-file-date {
    color: #5a5a6a;
  }
  
  .ef-file-actions {
    display: flex;
    gap: 8px;
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid rgba(255,255,255,0.05);
  }
  
  .ef-file-actions a, .ef-file-actions button {
    background: rgba(255,255,255,0.05);
    border: none;
    font-size: 12px;
    cursor: pointer;
    padding: 6px 10px;
    border-radius: 6px;
    transition: all 0.2s;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    flex: 1;
    color: #9a96a0;
  }
  
  .ef-file-actions a:hover, .ef-file-actions button:hover {
    background: rgba(110,181,200,0.2);
    color: #6eb5c8;
  }
  
  .ef-file-actions .ef-delete-btn:hover {
    background: rgba(224,90,90,0.2);
    color: #e05a5a;
  }
  
  /* MODAL FOR LARGE PREVIEW */
  .ef-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.9);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  
  .ef-modal-content {
    max-width: 90vw;
    max-height: 90vh;
    background: #1a1e2a;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    cursor: default;
  }
  
  .ef-modal-content img {
    max-width: 100%;
    max-height: 80vh;
    object-fit: contain;
  }
  
  .ef-modal-content iframe {
    width: 80vw;
    height: 80vh;
    border: none;
    background: white;
  }
  
  .ef-modal-close {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 36px;
    height: 36px;
    background: rgba(0,0,0,0.6);
    border: none;
    border-radius: 50%;
    color: white;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }
  
  .ef-modal-close:hover {
    background: rgba(224,90,90,0.8);
    transform: scale(1.1);
  }
  
  .ef-modal-info {
    padding: 12px 16px;
    background: rgba(0,0,0,0.8);
    color: #e8e4dc;
    font-size: 12px;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
  }
  
  .ef-empty {
    text-align: center;
    padding: 60px 20px;
    color: #5a5a6a;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
  
  .ef-empty-icon {
    font-size: 64px;
    opacity: 0.5;
  }
  
  .ef-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 60px;
    gap: 12px;
  }
  
  .ef-spinner {
    width: 30px;
    height: 30px;
    border: 2px solid rgba(255,255,255,0.1);
    border-top-color: #6eb5c8;
    border-radius: 50%;
    animation: efSpin 0.8s linear infinite;
  }
  
  @keyframes efSpin {
    to { transform: rotate(360deg); }
  }
`;

const formatFileSize = (bytes) => {
  if (!bytes) return '';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

const getFileIcon = (fileType, url) => {
  if (fileType?.includes('image')) return '🖼️';
  if (fileType?.includes('pdf')) return '📄';
  if (fileType?.includes('word') || fileType?.includes('document')) return '📝';
  if (fileType?.includes('sheet') || fileType?.includes('excel')) return '📊';
  return '📎';
};

const isImageFile = (fileType, url) => {
  return fileType?.includes('image') || url?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
};

const isPdfFile = (fileType, url) => {
  return fileType?.includes('pdf') || url?.match(/\.pdf$/i);
};

export default function EmployeeFiles({ employeeId, employeeName, onNotify }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewFile, setPreviewFile] = useState(null);

  const fileInputId = `file-input-${employeeId}`;

  useEffect(() => {
    if (employeeId) {
      fetchFiles();
    }
  }, [employeeId]);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/employees/${employeeId}/files`);
      setFiles(res.data);
    } catch {
      onNotify('error', 'Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const filesList = Array.from(e.target.files);
    setSelectedFiles(filesList);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    setUploading(true);
    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('files', file);
    });

    try {
      const res = await axios.post(`/api/employees/${employeeId}/files`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onNotify('success', `Uploaded ${res.data.files?.length || selectedFiles.length} files`);
      fetchFiles();
      setSelectedFiles([]);
      const inputEl = document.getElementById(fileInputId);
      if (inputEl) inputEl.value = '';
    } catch {
      onNotify('error', 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId) => {
    if (window.confirm('Delete this file?')) {
      try {
        await axios.delete(`/api/files/${fileId}`);
        onNotify('success', 'File deleted');
        fetchFiles();
      } catch {
        onNotify('error', 'Delete failed');
      }
    }
  };

  const openPreview = (file) => {
    setPreviewFile(file);
  };

  const closePreview = () => {
    setPreviewFile(null);
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="ef-container">
        <div className="ef-header">
          <div className="ef-title">
            📎 Documents • {employeeName || 'Employee'}
            {files.length > 0 && <span className="ef-selected-badge">{files.length}</span>}
          </div>
          
          <div className="ef-upload-area">
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx"
              style={{ display: 'none' }}
              id={fileInputId}
            />
            <label htmlFor={fileInputId} className="ef-upload-label">
              📎 Choose Files
            </label>
            {selectedFiles.length > 0 && (
              <>
                <span className="ef-selected-badge">{selectedFiles.length} selected</span>
                <button className="ef-upload-btn" onClick={handleUpload} disabled={uploading}>
                  {uploading ? '⏳ Uploading...' : '⬆️ Upload'}
                </button>
              </>
            )}
          </div>
        </div>

        {loading ? (
          <div className="ef-loading">
            <div className="ef-spinner" />
            <span>Loading files...</span>
          </div>
        ) : files.length === 0 ? (
          <div className="ef-empty">
            <div className="ef-empty-icon">📁</div>
            <div>No documents yet</div>
            <div style={{ fontSize: '12px' }}>Upload employee documents (resume, contracts, IDs, etc.)</div>
          </div>
        ) : (
          <div className="ef-files-grid">
            {files.map(file => (
              <div key={file.id} className="ef-file-card" onClick={() => openPreview(file)}>
                <div className="ef-file-preview">
                  {isImageFile(file.file_type, file.cloudinary_url) ? (
                    <img 
                      src={file.cloudinary_url} 
                      alt={file.file_name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `<div class="ef-file-preview-icon">🖼️<span>Image</span></div>`;
                      }}
                    />
                  ) : (
                    <div className="ef-file-preview-icon">
                      {getFileIcon(file.file_type, file.cloudinary_url)}
                      <span>
                        {file.file_type?.includes('pdf') ? 'PDF' : 
                         file.file_type?.includes('word') ? 'DOC' :
                         file.file_type?.includes('sheet') ? 'XLS' : 'File'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="ef-file-info">
                  <div className="ef-file-name" title={file.file_name}>{file.file_name}</div>
                  <div className="ef-file-meta">
                    {file.file_size && <span className="ef-file-size">{formatFileSize(file.file_size)}</span>}
                    <span className="ef-file-date">
                      {new Date(file.uploaded_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="ef-file-actions">
                    <a href={file.cloudinary_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                      👁️ View
                    </a>
                    <button className="ef-delete-btn" onClick={(e) => { e.stopPropagation(); handleDelete(file.id); }}>
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewFile && (
        <div className="ef-modal-overlay" onClick={closePreview}>
          <div className="ef-modal-content" onClick={(e) => e.stopPropagation()}>
            {isImageFile(previewFile.file_type, previewFile.cloudinary_url) ? (
              <img src={previewFile.cloudinary_url} alt={previewFile.file_name} />
            ) : isPdfFile(previewFile.file_type, previewFile.cloudinary_url) ? (
              <iframe src={`${previewFile.cloudinary_url}#toolbar=0`} title={previewFile.file_name} />
            ) : (
              <div style={{ padding: '60px', textAlign: 'center' }}>
                <div style={{ fontSize: '64px', marginBottom: '20px' }}>📄</div>
                <div style={{ color: '#e8e4dc', marginBottom: '10px' }}>{previewFile.file_name}</div>
                <a href={previewFile.cloudinary_url} target="_blank" rel="noopener noreferrer" style={{ color: '#6eb5c8' }}>
                  Click to download
                </a>
              </div>
            )}
            <button className="ef-modal-close" onClick={closePreview}>✕</button>
            <div className="ef-modal-info">
              <span>{previewFile.file_name}</span>
              <span>{formatFileSize(previewFile.file_size)}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}