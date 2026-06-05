import React from 'react';
import StatusBadge from './StatusBadge';

const ExamCard = ({ exam, isRegistered, onRegister, isLoading }) => {
  const isPast = new Date(exam.date) < new Date();
  
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="card-body flex-col gap-3" style={{ flex: '1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <StatusBadge status={exam.type} />
          <span className="font-semibold text-xs text-muted">Max: {exam.totalMarks} | Pass: {exam.passingMarks}</span>
        </div>

        <div>
          <h4 className="font-bold text-base" style={{ color: 'var(--text)', margin: '4px 0 2px' }}>{exam.title}</h4>
          <span className="text-secondary text-sm font-semibold">{exam.subject}</span>
        </div>

        <div className="divider" style={{ margin: '8px 0' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>Date: {new Date(exam.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>Time: {exam.startTime} - {exam.endTime} ({exam.duration} mins)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
            <span>Class: {exam.className} (Sem {exam.semester})</span>
          </div>
        </div>
      </div>

      <div style={{
        padding: '12px 20px',
        borderTop: '1px solid var(--border)',
        backgroundColor: 'var(--bg)',
        display: 'flex',
        justifyContent: 'flex-end',
        borderRadius: '0 0 var(--radius-lg) var(--radius-lg)'
      }}>
        {isRegistered ? (
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            style={{
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              color: 'var(--success)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              pointerEvents: 'none',
              fontWeight: '600'
            }}
            disabled
          >
            Registered ✓
          </button>
        ) : (
          <button
            type="button"
            className={`btn btn-sm ${isPast ? 'btn-secondary' : 'btn-primary'}`}
            onClick={() => onRegister(exam._id)}
            disabled={isLoading || isPast}
          >
            {isPast ? 'Exam Closed' : isLoading ? <span className="spinner"></span> : 'Register'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ExamCard;
