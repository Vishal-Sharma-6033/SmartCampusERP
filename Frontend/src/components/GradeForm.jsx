import React, { useState } from 'react';
import api from '../api/axios';

const GradeForm = ({ submissionId, totalMarks, onGraded }) => {
  const [marks, setMarks] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (marks === '') {
      setError('Please provide marks');
      return;
    }

    const marksNum = Number(marks);
    if (isNaN(marksNum) || marksNum < 0 || marksNum > totalMarks) {
      setError(`Marks must be between 0 and ${totalMarks}`);
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      const response = await api.patch(`/assignments/${submissionId}/grade`, {
        marks: marksNum,
        feedback
      });
      if (onGraded) {
        onGraded(response.data.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit grade');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      padding: '12px',
      backgroundColor: 'var(--bg)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      marginTop: '8px',
      maxWidth: '320px'
    }}>
      <span className="font-bold text-xs" style={{ color: 'var(--text-secondary)' }}>Grade Submission</span>
      
      {error && (
        <span className="text-xs font-medium" style={{ color: 'var(--danger)' }}>{error}</span>
      )}

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="number"
          min="0"
          max={totalMarks}
          className="form-input"
          placeholder="Marks"
          style={{ width: '80px', padding: '6px' }}
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
          required
          disabled={isSubmitting}
        />
        <span className="text-xs text-muted">/ {totalMarks}</span>
      </div>

      <textarea
        className="form-textarea"
        placeholder="Provide feedback..."
        style={{ minHeight: '60px', padding: '6px', fontSize: '0.8rem' }}
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        disabled={isSubmitting}
      />

      <button
        type="submit"
        className="btn btn-primary btn-sm"
        style={{ alignSelf: 'flex-start' }}
        disabled={isSubmitting}
      >
        {isSubmitting ? <span className="spinner"></span> : 'Submit Grade'}
      </button>
    </form>
  );
};

export default GradeForm;
