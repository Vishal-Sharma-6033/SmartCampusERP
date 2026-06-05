import React from 'react';

const HallTicketView = ({ student = {}, exams = [] }) => {
  return (
    <div
      className="card"
      id="printable-hall-ticket"
      style={{
        backgroundColor: '#fff',
        border: '2px solid #1E293B',
        borderRadius: 'var(--radius-lg)',
        padding: '30px',
        maxWidth: '800px',
        margin: '0 auto',
        fontFamily: '"Inter", sans-serif',
        boxShadow: 'var(--shadow-md)'
      }}
    >
      {/* Print-specific style block */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-hall-ticket, #printable-hall-ticket * {
            visibility: visible;
          }
          #printable-hall-ticket {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
        }
      `}} />

      {/* Header Block */}
      <div style={{
        textAlign: 'center',
        borderBottom: '2px double #E2E8F0',
        paddingBottom: '20px',
        marginBottom: '25px'
      }}>
        <h2 style={{ color: 'var(--primary)', margin: '0 0 5px', fontSize: '1.6rem', fontWeight: '800', letterSpacing: '0.05em' }}>
          SMART CAMPUS UNIVERSITY
        </h2>
        <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
          ACADEMIC HALL TICKET / ADMIT CARD
        </span>
      </div>

      {/* Student Registry Details */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px 30px',
        marginBottom: '30px',
        fontSize: '0.9rem',
        backgroundColor: 'var(--bg)',
        padding: '16px 24px',
        borderRadius: 'var(--radius)'
      }}>
        <div>
          <span style={{ color: 'var(--muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '600' }}>Candidate Name</span>
          <strong style={{ color: 'var(--text)', fontSize: '1rem' }}>{student.name}</strong>
        </div>
        <div>
          <span style={{ color: 'var(--muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '600' }}>Roll Number</span>
          <strong style={{ color: 'var(--text)', fontSize: '1rem' }}>{student.studentProfile?.rollNumber || 'S-N/A'}</strong>
        </div>
        <div>
          <span style={{ color: 'var(--muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '600' }}>Email Address</span>
          <strong style={{ color: 'var(--text)' }}>{student.email}</strong>
        </div>
        <div>
          <span style={{ color: 'var(--muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '600' }}>Class / Section</span>
          <strong style={{ color: 'var(--text)' }}>{student.studentProfile?.class || 'N/A'}-{student.studentProfile?.section || 'N/A'}</strong>
        </div>
      </div>

      {/* Seating & Schedule Allocation Table */}
      <div className="table-wrapper" style={{ border: '1px solid #1E293B', borderRadius: 'var(--radius)' }}>
        <table>
          <thead>
            <tr style={{ backgroundColor: '#1E293B' }}>
              <th style={{ color: '#fff', backgroundColor: '#1E293B' }}>Subject / Exam</th>
              <th style={{ color: '#fff', backgroundColor: '#1E293B' }}>Schedule Date</th>
              <th style={{ color: '#fff', backgroundColor: '#1E293B', textAlign: 'center' }}>Room No.</th>
              <th style={{ color: '#fff', backgroundColor: '#1E293B', textAlign: 'center' }}>Block</th>
              <th style={{ color: '#fff', backgroundColor: '#1E293B', textAlign: 'center' }}>Seat ID</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((row, idx) => (
              <tr key={idx}>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="font-semibold text-sm">{row.subject}</span>
                    <span className="text-muted text-xs">{row.exam}</span>
                  </div>
                </td>
                <td>{new Date(row.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                <td style={{ textAlign: 'center', fontWeight: '600' }}>{row.roomNumber}</td>
                <td style={{ textAlign: 'center', fontWeight: '600' }}>{row.block || 'A'}</td>
                <td style={{ textAlign: 'center', fontWeight: '600', color: 'var(--primary)' }}>
                  Seat #{row.seatNumber}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Signature & Disclaimer Footer */}
      <div style={{
        marginTop: '40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        fontSize: '0.75rem',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '300px' }}>
          <strong>Instructions:</strong>
          <span>1. Candidates must arrive at the room 15 minutes early.</span>
          <span>2. Please present a printed copy of this card to the supervisor.</span>
        </div>
        <div style={{ textAlign: 'center', minWidth: '150px' }}>
          <div style={{ height: '40px', borderBottom: '1px solid var(--muted)', marginBottom: '5px' }}></div>
          <span>Registrar / Controller</span>
        </div>
      </div>
    </div>
  );
};

export default HallTicketView;
