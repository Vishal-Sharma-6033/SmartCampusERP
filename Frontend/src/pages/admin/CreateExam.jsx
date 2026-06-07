import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Toast from '../../components/Toast';

const CreateExam = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [isSubjectsLoading, setIsSubjectsLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Internal');
  const [subject, setSubject] = useState('');
  const [className, setClassName] = useState('BCA');
  const [semester, setSemester] = useState(1);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('13:00');
  const [totalMarks, setTotalMarks] = useState('');
  const [passingMarks, setPassingMarks] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get('/academic/subjects');
        const list = res.data.data || [];
        setSubjects(list);
        if (list.length > 0) {
          setSubject(list[0].name); // Store subject name as expected by createExam service schema
        }
      } catch (err) {
        console.error(err);
        setToastMessage('Failed to load courses.');
        setToastType('error');
      } finally {
        setIsSubjectsLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    const tMarks = Number(totalMarks);
    const pMarks = Number(passingMarks);

    if (pMarks > tMarks) {
      setValidationError('Passing marks cannot exceed total marks!');
      return;
    }

    setIsSubmitting(true);
    try {
      // Calculate duration in minutes (e.g. 10:00 to 13:00 = 180 mins)
      const [sh, sm] = startTime.split(':').map(Number);
      const [eh, em] = endTime.split(':').map(Number);
      const duration = (eh * 60 + em) - (sh * 60 + sm);

      await api.post('/exams', {
        title,
        type,
        subject,
        className,
        semester: Number(semester),
        date,
        startTime,
        endTime,
        duration: duration > 0 ? duration : 180,
        totalMarks: tMarks,
        passingMarks: pMarks
      });

      setToastMessage('Exam created and published successfully!');
      setToastType('success');
      setTimeout(() => {
        navigate('/admin/exams');
      }, 1500);
    } catch (err) {
      console.error(err);
      setToastMessage(err.response?.data?.message || 'Failed to create exam schedule.');
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
          <h3 className="card-title">Schedule Term Examination</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {validationError && (
              <div className="alert alert-danger" role="alert">
                <span>{validationError}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="title">Exam Schedule Title *</label>
              <input
                id="title"
                type="text"
                className="form-input"
                placeholder="e.g. Sem 1 Calculus Final"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="type">Exam Type *</label>
                <select
                  id="type"
                  className="form-select"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="Internal">Internal Exam</option>
                  <option value="Final">Final Examination</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="subject">Subject *</label>
                {isSubjectsLoading ? (
                  <div className="skeleton" style={{ height: '40px' }} />
                ) : (
                  <select
                    id="subject"
                    className="form-select"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    disabled={isSubmitting}
                  >
                    {subjects.map(sub => (
                      <option key={sub._id} value={sub.name}>
                        {sub.name} ({sub.code})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="className">Class Name *</label>
                <input
                  id="className"
                  type="text"
                  className="form-input"
                  placeholder="e.g. BCA"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="semester">Semester *</label>
                <input
                  id="semester"
                  type="number"
                  min="1"
                  className="form-input"
                  placeholder="e.g. 1"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="date">Exam Date *</label>
              <input
                id="date"
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="startTime">Start Time *</label>
                <input
                  id="startTime"
                  type="time"
                  className="form-input"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="endTime">End Time *</label>
                <input
                  id="endTime"
                  type="time"
                  className="form-input"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="totalMarks">Total Marks *</label>
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
                <label className="form-label" htmlFor="passingMarks">Passing Marks *</label>
                <input
                  id="passingMarks"
                  type="number"
                  min="1"
                  className="form-input"
                  placeholder="e.g. 40"
                  value={passingMarks}
                  onChange={(e) => setPassingMarks(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/admin/exams')}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? <span className="spinner"></span> : 'Publish Exam'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateExam;
