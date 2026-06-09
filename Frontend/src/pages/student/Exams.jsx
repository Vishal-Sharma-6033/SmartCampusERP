import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import ExamCard from '../../components/ExamCard';
import Toast from '../../components/Toast';
import HallTicket from './HallTicket';
import Results from './Results';

const Exams = () => {
  const [activeView, setActiveView] = useState('register'); // 'register' | 'hallticket' | 'results'
  const [exams, setExams] = useState([]);
  const [registeredIds, setRegisteredIds] = useState(new Set());
  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Internal' | 'Final'
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState(null);
  
  // Toast notifications
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const fetchExamsData = async () => {
    setIsLoading(true);
    try {
      const [examsRes, registrationsRes] = await Promise.all([
        api.get('/exams'),
        api.get('/exams/registrations').catch(() => ({ data: { data: [] } }))
      ]);

      setExams(examsRes.data.data || []);
      
      const regs = registrationsRes.data.data || [];
      const regSet = new Set(regs.map(r => r.exam || r.examId));
      setRegisteredIds(regSet);
    } catch (err) {
      console.error(err);
      setToastMessage('Failed to fetch exams calendar.');
      setToastType('error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeView === 'register') {
      fetchExamsData();
    }
  }, [activeView]);

  const handleRegister = async (examId) => {
    setRegisteringId(examId);
    try {
      await api.post('/exams/register', { examId });
      setToastMessage('Registered successfully for the exam!');
      setToastType('success');
      setRegisteredIds(prev => {
        const next = new Set(prev);
        next.add(examId);
        return next;
      });
    } catch (err) {
      console.error(err);
      setToastMessage(err.response?.data?.message || 'Failed to register for exam.');
      setToastType('error');
    } finally {
      setRegisteringId(null);
    }
  };

  const filteredExams = exams.filter(exam => {
    if (activeTab === 'All') return true;
    return exam.type?.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}

      {/* Main View Tabs (Register / Hall Ticket / Results) */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', gap: '8px' }}>
        <button
          onClick={() => setActiveView('register')}
          style={{
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeView === 'register' ? '2.5px solid var(--primary)' : 'none',
            color: activeView === 'register' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeView === 'register' ? '700' : '500',
            cursor: 'pointer'
          }}
        >
          Register for Exams
        </button>
        <button
          onClick={() => setActiveView('hallticket')}
          style={{
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeView === 'hallticket' ? '2.5px solid var(--primary)' : 'none',
            color: activeView === 'hallticket' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeView === 'hallticket' ? '700' : '500',
            cursor: 'pointer'
          }}
        >
          My Hall Ticket
        </button>
        <button
          onClick={() => setActiveView('results')}
          style={{
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeView === 'results' ? '2.5px solid var(--primary)' : 'none',
            color: activeView === 'results' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeView === 'results' ? '700' : '500',
            cursor: 'pointer'
          }}
        >
          My Exam Results
        </button>
      </div>

      {/* Tab Render Layout */}
      {activeView === 'register' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Sub Filtering Tabs */}
          <div className="card">
            <div className="card-body flex items-center justify-between" style={{ padding: '16px 20px', flexWrap: 'wrap', gap: '15px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['All', 'Internal', 'Final'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="btn btn-sm"
                    style={{
                      backgroundColor: activeTab === tab ? 'var(--primary)' : 'var(--surface)',
                      color: activeTab === tab ? '#fff' : 'var(--text-secondary)',
                      border: '1px solid var(--border)',
                      fontWeight: '600'
                    }}
                  >
                    {tab} Exams
                  </button>
                ))}
              </div>
              <span className="text-xs text-muted font-semibold">
                {filteredExams.length} Exams Listed
              </span>
            </div>
          </div>

          {/* Grid list of upcoming exams */}
          {isLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div className="skeleton" style={{ height: '220px' }} />
              <div className="skeleton" style={{ height: '220px' }} />
              <div className="skeleton" style={{ height: '220px' }} />
            </div>
          ) : filteredExams.length === 0 ? (
            <div className="card" style={{ padding: '50px', textAlign: 'center', color: 'var(--muted)' }}>
              No upcoming {activeTab !== 'All' ? activeTab.toLowerCase() : ''} exams scheduled.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {filteredExams.map(exam => (
                <ExamCard
                  key={exam._id}
                  exam={exam}
                  isRegistered={registeredIds.has(exam._id)}
                  onRegister={handleRegister}
                  isLoading={registeringId === exam._id}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeView === 'hallticket' && <HallTicket />}
      {activeView === 'results' && <Results />}
    </div>
  );
};

export default Exams;
