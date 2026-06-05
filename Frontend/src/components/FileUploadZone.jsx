import React, { useState, useRef } from 'react';

const FileUploadZone = ({ file, setFile, progress = 0 }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;

    // Check size limit: 100MB
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (selectedFile.size > maxSize) {
      alert('File size exceeds the 100MB limit!');
      return;
    }

    // Check type: Images, Videos, PDFs
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/mpeg',
      'video/ogg',
      'video/quicktime',
      'video/webm'
    ];

    if (!allowedTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.pdf')) {
      alert('Unsupported file type! Please upload an Image, Video, or PDF.');
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="form-group flex-col gap-2">
      <label className="form-label">Upload Materials Attachment</label>
      
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        style={{
          border: isDragActive ? '2.5px dashed var(--primary)' : '2px dashed var(--border)',
          borderRadius: 'var(--radius)',
          padding: '30px',
          textAlign: 'center',
          backgroundColor: isDragActive ? 'var(--primary-light)' : 'var(--bg)',
          cursor: 'pointer',
          transition: 'all var(--transition)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,image/*,video/*"
          style={{ display: 'none' }}
          onChange={handleChange}
        />

        {/* Upload Icon */}
        <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke={isDragActive ? 'var(--primary)' : 'var(--muted)'} strokeWidth="1.5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>

        {file ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span className="font-semibold text-sm truncate" style={{ color: 'var(--text)', maxWidth: '280px' }}>
              {file.name}
            </span>
            <span className="text-secondary text-xs">{formatBytes(file.size)}</span>
          </div>
        ) : (
          <div>
            <span className="font-semibold text-sm block" style={{ color: 'var(--text)' }}>
              Drag & Drop file here, or click to browse
            </span>
            <span className="text-muted text-xs block" style={{ marginTop: '2px' }}>
              Accepted: PDF, Images, Videos (Max 100MB)
            </span>
          </div>
        )}
      </div>

      {/* Upload Progress Bar */}
      {progress > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '5px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '600' }}>
            <span className="text-primary">Uploading...</span>
            <span className="text-primary">{progress}%</span>
          </div>
          <div style={{ height: '6px', backgroundColor: 'var(--border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                backgroundColor: 'var(--primary)',
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.1s ease'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;
