import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import FileUploadZone from '../../components/FileUploadZone';
import Toast from '../../components/Toast';

const TeacherUploadContent = () => {
  const [subjects, setSubjects] = useState([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [type, setType] = useState('note'); // 'note' | 'video' | 'pdf' | 'syllabus' | 'image'
  const [file, setFile] = useState(null);
  
  // Progress & submission
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toasts
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Fetch subjects list on mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get('/academic/subjects');
        // Check both envelope formats
        const list = res.data?.data || res.data || [];
        setSubjects(list);
        if (list.length > 0) {
          setSubjectId(list[0]._id);
        }
      } catch (err) {
        console.error(err);
        setToastMessage('Failed to load courses.');
        setToastType('error');
      } finally {
        setIsLoadingSubjects(false);
      }
    };
    fetchSubjects();
  }, []);

  // Auto-detect type on file attachment
  useEffect(() => {
    if (!file) return;

    const name = file.name.toLowerCase();
    if (name.endsWith('.pdf')) {
      setType('pdf');
    } else if (name.endsWith('.mp4') || name.endsWith('.webm') || name.endsWith('.mov') || name.endsWith('.mkv')) {
      setType('video');
    } else if (name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.gif') || name.endsWith('.webp')) {
      setType('image');
    } else {
      setType('note');
    }
  }, [file]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setToastMessage('Please select or drop a study material file.');
      setToastType('error');
      return;
    }

    if (!subjectId) {
      setToastMessage('Please assign a subject course.');
      setToastType('error');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(1); // Set to 1% to trigger progress display

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('subjectId', subjectId);
      formData.append('type', type);
      formData.append('file', file);

      await api.post('/content', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent === 100 ? 99 : percent); // Hold at 99% until backend responds
        }
      });

      setUploadProgress(100);
      setToastMessage('Content uploaded successfully!');
      setToastType('success');
      
      // Reset Form
      setTitle('');
      setDescription('');
      setFile(null);
      setUploadProgress(0);
    } catch (err) {
      console.error(err);
      setToastMessage(err.response?.data?.message || 'Upload failed. Cloudinary or DB error.');
      setToastType('error');
      setUploadProgress(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '750px', margin: '0 auto' }}>
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}

      {/* Page Header */}
      <div className="card">
        <div className="card-body">
          <h2 className="font-bold text-lg" style={{ color: 'var(--text)', marginBottom: '4px' }}>Upload LMS Material</h2>
          <p className="text-secondary text-xs">Publish note attachments, video recordings, or PDFs to students enrolled in your courses.</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="card">
        <div className="card-body">
          {isLoadingSubjects ? (
            <div className="flex justify-center p-6"><div className="spinner spinner-dark"></div></div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              <div className="form-group">
                <label className="form-label" htmlFor="title">Content Title</label>
                <input
                  id="title"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Lecture 4: Database Normalization"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="desc">Description (Optional)</label>
                <textarea
                  id="desc"
                  className="form-input"
                  placeholder="Summarize what this attachment covers..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  disabled={isSubmitting}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="subj">Subject Course</label>
                  <select
                    id="subj"
                    className="form-select"
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    required
                    disabled={isSubmitting}
                  >
                    {subjects.map(s => (
                      <option key={s._id} value={s._id}>{s.name} ({s.code})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="type">Material Type</label>
                  <select
                    id="type"
                    className="form-select"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="note">📝 Class Notes</option>
                    <option value="video">🎥 Video Lecture</option>
                    <option value="pdf">📄 PDF Document</option>
                    <option value="syllabus">📋 Syllabus Doc</option>
                    <option value="image">🖼️ Reference Image</option>
                  </select>
                </div>
              </div>

              {/* Drag and drop zone */}
              <FileUploadZone
                file={file}
                setFile={setFile}
                progress={uploadProgress}
              />

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isSubmitting}
                style={{ marginTop: '10px' }}
              >
                {isSubmitting ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <span className="spinner spinner-white"></span>
                    <span>Processing Upload...</span>
                  </span>
                ) : 'Publish Material'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherUploadContent;
