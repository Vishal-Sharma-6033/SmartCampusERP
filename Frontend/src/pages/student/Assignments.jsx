import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import Toast from '../../components/Toast';
import DeadlineCountdown from '../../components/DeadlineCountdown';
import StatusBadge from '../../components/StatusBadge';

const StudentAssignments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'submitted'
  
  // Data lists
  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  
  // Loading & error
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const fetchAssignmentsData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const studentId = user._id || user.id;

      // 1. Fetch student's submissions (for "Submitted" tab and to filter out of "Pending")
      const submissionsRes = await api.get(`/assignments/student/${studentId}`);
      const submissions = submissionsRes.data.data || [];
      setSubmittedAssignments(submissions);

      // Create a set of submitted assignment IDs
      const submittedIds = new Set(
        submissions.map(sub => sub.assignmentId?._id || sub.assignmentId || '')
      );

      // 2. Fetch enrolled subjects to get their assignments
      const subjectsRes = await api.get('/academic/subjects');
      const subjects = subjectsRes.data.data || [];

      // Filter subjects that contain this student
      const enrolledSubjects = subjects.filter(sub =>
        sub.students?.includes(studentId) || 
        sub.students?.some(s => s._id === studentId || s === studentId)
      );

      // Fetch assignments for each enrolled subject
      const allSubjectAssignments = [];
      await Promise.all(
        enrolledSubjects.map(async (sub) => {
          try {
            const res = await api.get(`/assignments/subject/${sub._id}`);
            const list = res.data.data || [];
            
            // Tag with subject name for display purposes
            list.forEach(assign => {
              assign.subjectName = sub.name;
            });
            allSubjectAssignments.push(...list);
          } catch (e) {
            console.log(`Failed to fetch assignments for subject ${sub._id}`);
          }
        })
      );

      // Filter out assignments that have already been submitted
      const pending = allSubjectAssignments.filter(assign => !submittedIds.has(assign._id));
      
      // Sort pending: nearest deadline first
      pending.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
      setPendingAssignments(pending);

    } catch (err) {
      console.error(err);
      setToastMessage('Failed to load assignments.');
      setToastType('error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignmentsData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex-col gap-4 w-full" style={{ padding: '20px' }}>
        <div className="skeleton" style={{ height: '40px', width: '250px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' }}>
          <div className="skeleton" style={{ height: '140px' }} />
          <div className="skeleton" style={{ height: '140px' }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}

      {/* Tabs selector */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
        <button
          onClick={() => setActiveTab('pending')}
          style={{
            padding: '12px 24px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'pending' ? '2.5px solid var(--primary)' : 'none',
            color: activeTab === 'pending' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'pending' ? '700' : '500',
            cursor: 'pointer'
          }}
        >
          Pending Assignments ({pendingAssignments.length})
        </button>
        <button
          onClick={() => setActiveTab('submitted')}
          style={{
            padding: '12px 24px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'submitted' ? '2.5px solid var(--primary)' : 'none',
            color: activeTab === 'submitted' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'submitted' ? '700' : '500',
            cursor: 'pointer'
          }}
        >
          Submitted ({submittedAssignments.length})
        </button>
      </div>

      {/* Pending Tab Content */}
      {activeTab === 'pending' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {pendingAssignments.length === 0 ? (
            <div className="card" style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
              No pending assignments. You are all caught up!
            </div>
          ) : (
            pendingAssignments.map((assign) => {
              const isOverdue = new Date(assign.deadline) < new Date();
              return (
                <div key={assign._id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div className="card-body flex-col gap-2" style={{ flex: '1' }}>
                    <span className="badge badge-primary" style={{ alignSelf: 'flex-start' }}>{assign.subjectName}</span>
                    <h4 className="font-bold text-base" style={{ color: 'var(--text)', marginTop: '4px' }}>{assign.title}</h4>
                    <p className="text-secondary text-sm truncate" style={{ WebkitLineClamp: '2', display: '-webkit-box', WebkitBoxOrient: 'vertical', whiteSpace: 'normal', height: '40px' }}>
                      {assign.description || 'No description provided.'}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                      <span className="text-xs text-muted">Marks: {assign.totalMarks}</span>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <span className="text-xs text-muted">Due: {new Date(assign.deadline).toLocaleDateString()}</span>
                        <DeadlineCountdown deadline={assign.deadline} />
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
                    <button
                      onClick={() => navigate(`/student/assignments/${assign._id}/submit`)}
                      className={`btn btn-sm ${isOverdue ? 'btn-danger' : 'btn-primary'}`}
                    >
                      {isOverdue ? 'Submit Late' : 'Submit Assignment'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Submitted Tab Content */}
      {activeTab === 'submitted' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {submittedAssignments.length === 0 ? (
            <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
              You haven't submitted any assignments yet.
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Assignment Title</th>
                    <th>Submission Date</th>
                    <th>Status</th>
                    <th>Late Penalty</th>
                    <th>Marks Obtained</th>
                    <th>Teacher Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {submittedAssignments.map((sub) => {
                    const assign = sub.assignmentId || {};
                    const isGraded = sub.marks !== null && sub.marks !== undefined;
                    return (
                      <tr key={sub._id}>
                        <td className="font-semibold">{assign.title || 'Deleted Assignment'}</td>
                        <td>{new Date(sub.createdAt).toLocaleString()}</td>
                        <td>
                          <StatusBadge status={sub.status} />
                        </td>
                        <td style={{ color: sub.latePenalty > 0 ? 'var(--danger)' : 'var(--text-secondary)' }}>
                          {sub.latePenalty > 0 ? `-${sub.latePenalty.toFixed(1)} Marks` : '—'}
                        </td>
                        <td className="font-bold">
                          {isGraded ? (
                            <span style={{ color: 'var(--success)' }}>
                              {sub.marks} / {assign.totalMarks || 100}
                            </span>
                          ) : (
                            <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Ungraded</span>
                          )}
                        </td>
                        <td className="text-secondary text-sm italic" style={{ maxWidth: '240px' }}>
                          {sub.feedback ? `"${sub.feedback}"` : 'No feedback yet'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentAssignments;
