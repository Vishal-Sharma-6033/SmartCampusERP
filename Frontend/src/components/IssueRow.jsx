import React from 'react';

const IssueRow = ({ issue, isProcessing, onReturn, onPayFine, role = 'STUDENT' }) => {
  const book = issue.bookId || {};
  const student = issue.studentId || {};
  const dueDate = new Date(issue.dueDate);
  const today = new Date();
  
  // Calculate dynamic fine for display if status is still ISSUED and past due date
  let currentFine = issue.fine || 0;
  let isOverdue = false;
  
  if (issue.status === 'ISSUED') {
    if (today > dueDate) {
      isOverdue = true;
      const msDiff = today.getTime() - dueDate.getTime();
      const daysDiff = Math.ceil(msDiff / (1000 * 60 * 60 * 24));
      currentFine = daysDiff * 10; // ₹10/day
    }
  } else if (issue.status === 'RETURNED' && issue.fine > 0) {
    // If returned with fine, check if it's past due (which it was)
    isOverdue = true;
  }

  // Status Badge styling
  let statusBadge = <span className="badge badge-primary">ISSUED</span>;
  if (issue.status === 'RETURNED') {
    statusBadge = <span className="badge badge-success">RETURNED</span>;
  } else if (isOverdue) {
    statusBadge = <span className="badge badge-danger">OVERDUE</span>;
  }

  const isFinePending = currentFine > 0 && issue.paymentStatus !== 'PAID';

  return (
    <tr>
      {role === 'ADMIN' && (
        <td>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="font-semibold" style={{ color: 'var(--text)' }}>{student.name || 'Unknown student'}</span>
            <span className="text-secondary text-xs">{student.email || ''}</span>
          </div>
        </td>
      )}
      <td>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="font-semibold" style={{ color: 'var(--text)' }}>{book.title || 'Unknown book'}</span>
          <span className="text-secondary text-xs">by {book.author || 'Unknown'}</span>
        </div>
      </td>
      <td>{new Date(issue.issueDate).toLocaleDateString()}</td>
      <td>{dueDate.toLocaleDateString()}</td>
      <td>{statusBadge}</td>
      <td>
        {currentFine > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span className="font-bold text-danger">₹{currentFine}</span>
            <span className="text-xs text-muted" style={{ fontWeight: '500' }}>
              {issue.paymentStatus === 'PAID' ? (
                <span className="text-success font-semibold">Paid ✓</span>
              ) : (
                <span className="text-danger font-semibold">Pending Fine</span>
              )}
            </span>
          </div>
        ) : (
          <span className="text-muted text-xs">—</span>
        )}
      </td>
      <td style={{ textAlign: 'right' }}>
        <div style={{ display: 'inline-flex', gap: '8px', justifyContent: 'flex-end' }}>
          {/* Return button: for students or admins when status is ISSUED */}
          {issue.status === 'ISSUED' && (
            <button
              onClick={() => onReturn(book._id || book.id, student._id || student.id)}
              className="btn btn-secondary btn-sm"
              disabled={isProcessing}
            >
              Mark Returned
            </button>
          )}

          {/* Pay Fine button: for students when fine is pending */}
          {role === 'STUDENT' && isFinePending && (
            <button
              onClick={() => onPayFine(issue._id || issue.id, currentFine)}
              className="btn btn-danger btn-sm"
              disabled={isProcessing}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              <span>Pay Fine</span>
            </button>
          )}
          
          {issue.paymentStatus === 'PAID' && currentFine > 0 && (
            <span className="badge badge-success text-xs font-semibold" style={{ padding: '6px 12px' }}>
              Settled
            </span>
          )}
        </div>
      </td>
    </tr>
  );
};

export default IssueRow;
