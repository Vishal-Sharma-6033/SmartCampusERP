import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import Toast from '../../components/Toast';

const SubmitAssignment = () => {
  const { assignmentId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Data states
  const [assignment, setAssignment] = useState(null);
  const [text, setText] = useState('');
  
  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isOverdue, setIsOverdue] = useState(false);
  const [penaltyEstimation, setPenaltyEstimation] = useState(0);

  // 1. Fetch assignment details by searching subject feeds
  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const studentId = user._id || user.id;

        // Fetch subjects
        const subjectsRes = await api.get('/academic/subjects');
        const subjects = subjectsRes.data.data || [];
        const enrolled = subjects.filter(sub =>
          sub.students?.includes(studentId) || 
          sub.students?.some(s => s._id === studentId || s === studentId)
        );

        let foundAssign = null;
        
        // Search subjects for the target assignment ID
        await Promise.all(
          enrolled.map(async (sub) => {
            if (foundAssign) return; // Skip if already found
            try {
              const res = await api.get(`/assignments/subject/${sub._id}`);
              const list = res.data.data || [];
              const match = list.find(a => a._id === assignmentId);
              if (match) {
                match.subjectName = sub.name;
                foundAssign = match;
              }
            } catch (e) {
              console.log(`Error checking subject ${sub._id}`);
            }
          })
        );

        if (foundAssign) {
          setAssignment(foundAssign);
          
          // Calculate if overdue
          const now = new Date();
          const deadlineDate = new Date(foundAssign.deadline);
          const overdue = now > deadlineDate;
          setIsOverdue(overdue);

          // Estimate late penalty (2% of total marks per day late, capped at 10% max)
          if (overdue) {
            const hoursLate = (now - deadlineDate) / (1000 * 60 * 60);
            const daysLate = hoursLate / 24;
            const dailyRate = foundAssign.totalMarks * 0.02;
            const maxPenalty = foundAssign.totalMarks * 0.10;
            const estimated = Math.min(daysLate * dailyRate, maxPenalty);
            setPenaltyEstimation(estimated);
          }
        } else {
          setToastMessage('Assignment details could not be found.');
          setToastType('error');
        }
      } catch (err) {
        console.error(err);
        setToastMessage('Failed to load assignment.');
        setToastType('error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignmentDetails();
  }, [assignmentId, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text.length < 50) {
      setToastMessage('Submission text must be at least 50 characters.');
      setToastType('error');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post(`/assignments/${assignmentId}/submit`, { text });
      setToastMessage('Assignment submitted successfully!');
      setToastType('success');
      
      setTimeout(() => {
        navigate('/student/assignments');
      }, 1500);
    } catch (err) {
      console.error(err);
      setToastMessage(err.response?.data?.message || 'Failed to submit assignment');
      setToastType('error');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-col gap-4 w-full" style={{ padding: '20px' }}>
        <div className="skeleton" style={{ height: '40px', width: '200px' }} />
        <div className="skeleton" style={{ height: '200px', marginTop: '20px' }} />
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
        <p className="text-secondary">Assignment not found or you are not authorized to submit it.</p>
        <button onClick={() => navigate('/student/assignments')} className="btn btn-primary mt-4">
          Back to Assignments
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}

      {/* Overdue Warning Banner */}
      {isOverdue && (
        <div className="alert alert-danger" style={{ borderLeft: '4px solid var(--danger)' }}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span className="font-bold">Late Submission Alert</span>
            <span className="text-xs">
              This assignment deadline has passed. A late submission penalty of 2% per day applies (capped at 10%). 
              Estimated Penalty: <span className="font-bold">-{penaltyEstimation.toFixed(1)} Marks</span>
            </span>
          </div>
        </div>
      )}

      {/* Assignment Details */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="badge badge-primary" style={{ alignSelf: 'flex-start', marginBottom: '4px' }}>{assignment.subjectName}</span>
            <h3 className="card-title" style={{ margin: '0' }}>{assignment.title}</h3>
          </div>
          <span className="font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>
            Max Marks: {assignment.totalMarks}
          </span>
        </div>
        <div className="card-body flex-col gap-3">
          <p className="text-secondary text-sm" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
            {assignment.description || 'No instructions provided.'}
          </p>
          <div className="divider" style={{ margin: '10px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--muted)' }}>
            <span>Due Date: {new Date(assignment.deadline).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Submission Form */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">My Text Submission</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="text">Submit your response (Min. 50 characters) *</label>
              <textarea
                id="text"
                className="form-textarea"
                rows="8"
                placeholder="Type your homework answer or research paper here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                disabled={isSubmitting}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '4px' }}>
                <span style={{ color: text.length >= 50 ? 'var(--success)' : 'var(--danger)', fontWeight: '600' }}>
                  Character Count: {text.length} / 50 minimum
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/student/assignments')}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting || text.length < 50}
              >
                {isSubmitting ? <span className="spinner"></span> : 'Submit Answer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitAssignment;
