import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import HallTicketView from '../../components/HallTicketView';
import Toast from '../../components/Toast';

const HallTicket = () => {
  const { user } = useAuth();
  const [ticketData, setTicketData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    const fetchHallTicket = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/exams/hallticket');
        setTicketData(response.data.data);
      } catch (err) {
        console.error(err);
        // Do not throw a red alert unless it's a real failure,
        // since 404 means "not generated yet" which is an expected state.
      } finally {
        setIsLoading(false);
      }
    };
    fetchHallTicket();
  }, []);

  const handleDownloadPDF = async () => {
    setToastMessage('Generating PDF, please wait...');
    setToastType('info');
    try {
      const response = await api.get('/exams/hallticket/download', {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `HallTicket-${user?.name || 'Student'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setToastMessage('Download completed!');
      setToastType('success');
    } catch (err) {
      console.error('Download failed:', err);
      setToastMessage('PDF generation failed. Use the "Print Admit Card" button.');
      setToastType('error');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex-col gap-4 w-full" style={{ padding: '20px' }}>
        <div className="skeleton" style={{ height: '400px' }} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}

      {ticketData ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Action buttons bar */}
          <div className="card">
            <div className="card-body flex items-center justify-between" style={{ padding: '12px 20px', flexWrap: 'wrap', gap: '10px' }}>
              <span className="text-secondary text-sm">
                Candidate Seating: <span className="font-semibold text-sm">{ticketData.exams?.length || 0} exams scheduled</span>
              </span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handlePrint} className="btn btn-secondary">
                  Print Admit Card
                </button>
                <button onClick={handleDownloadPDF} className="btn btn-primary">
                  Download PDF
                </button>
              </div>
            </div>
          </div>

          {/* Ticket Admit Card Card */}
          <HallTicketView student={ticketData.student} exams={ticketData.exams} />
        </div>
      ) : (
        <div className="card" style={{ padding: '50px', textAlign: 'center', color: 'var(--muted)' }}>
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 15px' }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          <h4 className="font-bold text-lg" style={{ color: 'var(--text)', marginBottom: '5px' }}>Hall ticket not generated yet</h4>
          <p className="text-secondary text-sm">Please contact the administration office or exam controller once seating layouts are finalized.</p>
        </div>
      )}
    </div>
  );
};

export default HallTicket;
