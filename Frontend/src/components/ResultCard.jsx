import React, { useState } from 'react';
import StatusBadge from './StatusBadge';

const ResultCard = ({ result }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!result || !result.exam) return null;

  const exam = result.exam;
  const isPass = result.status?.toLowerCase() === 'pass';
  
  // Decide grade colors
  let gradeColor = 'var(--text-secondary)';
  if (result.grade === 'A') gradeColor = 'var(--success)';
  else if (result.grade === 'B') gradeColor = 'var(--info)';
  else if (result.grade === 'C') gradeColor = 'var(--warning)';

  return (
    <div className="card" style={{
      borderLeft: `4px solid ${isPass ? 'var(--success)' : 'var(--danger)'}`,
      width: '100%'
    }}>
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h4 className="font-bold text-base" style={{ color: 'var(--text)', margin: '0' }}>{exam.title}</h4>
            <span className="text-muted text-xs">Exam Date: {new Date(exam.date).toLocaleDateString()}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <StatusBadge status={result.status} />
            <span
              className="badge"
              style={{
                backgroundColor: `${gradeColor}15`,
                color: gradeColor,
                padding: '4px 10px',
                fontWeight: '700'
              }}
            >
              Grade {result.grade}
            </span>
          </div>
        </div>

        {/* Aggregated stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          backgroundColor: 'var(--bg)',
          padding: '10px 14px',
          borderRadius: 'var(--radius)',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="text-muted text-xs">Total Score</span>
            <span className="font-bold" style={{ color: 'var(--text)' }}>{result.total} Marks</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="text-muted text-xs">Average Percentage</span>
            <span className="font-bold" style={{ color: 'var(--text)' }}>{Math.round(result.percentage)}%</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.8rem',
                padding: '2px 0'
              }}
            >
              {isExpanded ? 'Hide Marks ▲' : 'View Breakdown ▼'}
            </button>
          </div>
        </div>

        {/* Expanded subject breakdown table */}
        {isExpanded && (
          <div className="table-wrapper" style={{ marginTop: '5px', animation: 'fadeIn 0.2s ease-out' }}>
            <table>
              <thead>
                <tr>
                  <th>Subject Course</th>
                  <th style={{ textAlign: 'center', width: '120px' }}>Marks Scored</th>
                </tr>
              </thead>
              <tbody>
                {result.subjects?.map((sub, idx) => (
                  <tr key={idx}>
                    <td className="font-semibold">{sub.subject}</td>
                    <td className="font-bold" style={{ textAlign: 'center', color: 'var(--text)' }}>
                      {sub.marks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;
