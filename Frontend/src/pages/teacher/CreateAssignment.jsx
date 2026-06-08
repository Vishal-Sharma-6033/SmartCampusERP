import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import Toast from '../../components/Toast';

const CreateAssignment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [isSubjectsLoading, setIsSubjectsLoading] = useState(true);

  // Form Fields
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [description, setDescription] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [deadline, setDeadline] = useState('');

  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await api.get('/academic/subjects');
        const list = response.data.data || [];
        const userId = user?._id || user?.id;

        // Filter subjects taught by this teacher
        const mySubjects = list.filter(sub => 
          sub.teacher?._id === userId || 
          sub.teacher === userId || 
          (typeof sub.teacher === 'object' && sub.teacher?.id === userId)
        );

        setSubjects(mySubjects);
        if (mySubjects.length > 0) {
          setSubjectId(mySubjects[0]._id);
        }
      } catch (err) {
        console.error('Failed to fetch subjects:', err);
        setToastMessage('Failed to load subjects.');
        setToastType('error');
      } finally {
        setIsSubjectsLoading(false);
      }
    };

    fetchSubjects();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !subjectId || !totalMarks || !deadline) {
      setToastMessage('Please fill in all required fields');
      setToastType('error');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/assignments', {
        title,
        description,
        subjectId,
        totalMarks: Number(totalMarks),
        deadline: new Date(deadline).toISOString()
      });
      setToastMessage('Assignment created successfully!');
      setToastType('success');
      
      // Delay navigation slightly so they see the success toast
      setTimeout(() => {
        navigate('/teacher/assignments');
      }, 1500);
    } catch (err) {
      console.error(err);
      setToastMessage(err.response?.data?.message || 'Failed to create assignment');
      setToastType('error');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Create New Student Assignment</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="title">Assignment Title *</label>
              <input
                id="title"
                type="text"
                className="form-input"
                placeholder="e.g. Midterm Lab Report"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="subject">Subject Course *</label>
              {isSubjectsLoading ? (
                <div className="skeleton" style={{ height: '40px' }} />
              ) : (
                <select
                  id="subject"
                  className="form-select"
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  required
                  disabled={isSubmitting}
                >
                  <option value="">-- Select Course --</option>
                  {subjects.map(sub => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name} ({sub.code})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">Detailed Description</label>
              <textarea
                id="description"
                className="form-textarea"
                placeholder="Specify lab instructions, requirements, or reading materials..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="totalMarks">Total Max Marks *</label>
                <input
                  id="totalMarks"
                  type="number"
                  min="1"
                  className="form-input"
                  placeholder="e.g. 100"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="deadline">Submission Deadline *</label>
                <input
                  id="deadline"
                  type="datetime-local"
                  className="form-input"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/teacher/assignments')}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? <span className="spinner"></span> : 'Publish Assignment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAssignment;
