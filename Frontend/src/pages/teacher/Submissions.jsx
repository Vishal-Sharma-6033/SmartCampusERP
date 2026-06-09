import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Toast from '../../components/Toast';
import StatusBadge from '../../components/StatusBadge';
import GradeForm from '../../components/GradeForm';

const Submissions = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [assignment, setAssignment] = useState(null);
  
  // Plagiarism states
  const [plagiarismResults, setPlagiarismResults] = useState(null);
  const [isCheckingPlagiarism, setIsCheckingPlagiarism] = useState(false);
  
  // UI states
  const [expandedTextId, setExpandedTextId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const fetchSubmissionsData = async () => {
    setIsLoading(true);
    try {
      // 1. Get submissions
      const submissionsRes = await api.get(`/assignments/${assignmentId}/submissions`);
      const subList = submissionsRes.data.data || [];
      setSubmissions(subList);

      // 2. Fetch subject details or use first submission's assignment details
      if (subList.length > 0 && subList[0].assignmentId) {
        setAssignment(subList[0].assignmentId);
      } else {
        // If no submissions exist, we can fetch assignment details by searching
        // (Wait, since we don't have a direct GET /assignments/:id, let's fetch analytics which might give some info or mock details)
        // Let's create a placeholder assignment state
        setAssignment({ title: 'Course Assignment', totalMarks: 100 });
      }
    } catch (err) {
      console.error(err);
      setToastMessage('Failed to load submissions.');
      setToastType('error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissionsData();
  }, [assignmentId]);

  const handleGradeSuccess = (updatedSubmission) => {
    setToastMessage('Grade submitted successfully!');
    setToastType('success');
    // Update local submissions list
    setSubmissions(prev =>
      prev.map(s => (s._id === updatedSubmission._id ? { ...s, ...updatedSubmission } : s))
    );
  };

  const handleCheckPlagiarism = async () => {
    setIsCheckingPlagiarism(true);
    setPlagiarismResults([]);
    try {
      const response = await api.get(`/assignments/${assignmentId}/plagiarism`);
      const results = response.data.data || [];
      setPlagiarismResults(results);
      if (results.length === 0) {
        setToastMessage('No plagiarism detected (All similarities under 40%)');
        setToastType('info');
      } else {
        setToastMessage(`Detected ${results.length} cases of high similarity!`);
        setToastType('warning');
      }
    } catch (err) {
      console.error(err);
      setToastMessage('Plagiarism scan failed.');
      setToastType('error');
    } finally {
      setIsCheckingPlagiarism(false);
    }
  };

  // Helper to map student ID to name from the loaded submissions list
  const getStudentName = (stdId) => {
    const sub = submissions.find(s => s.studentId?._id === stdId || s.studentId === stdId);
    return sub?.studentId?.name || `Student (${stdId.slice(-6)})`;
  };

  if (isLoading) {
    return (
      <div className="flex-col gap-4 w-full" style={{ padding: '20px' }}>
        <div className="skeleton" style={{ height: '40px', width: '200px' }} />
        <div className="skeleton" style={{ height: '300px', marginTop: '20px' }} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}

      {/* Header card with action */}
      <div className="card">
        <div className="card-body flex items-center justify-between" style={{ padding: '16px 20px', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h2 className="font-bold text-lg" style={{ color: 'var(--text)', margin: '0' }}>
              Submissions: {assignment?.title || 'Assignment'}
            </h2>
            <span className="text-muted text-xs">Total Marks: {assignment?.totalMarks || 100}</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleCheckPlagiarism}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              disabled={isCheckingPlagiarism || submissions.length < 2}
            >
              {isCheckingPlagiarism ? <span className="spinner spinner-dark"></span> : 'Scan Plagiarism'}
            </button>
            <button onClick={() => navigate('/teacher/assignments')} className="btn btn-primary">
              Back to List
            </button>
          </div>
        </div>
      </div>

      {/* Plagiarism analysis result banner */}
      {plagiarismResults && plagiarismResults.length > 0 && (
        <div className="card" style={{ borderLeft: '4px solid var(--danger)', backgroundColor: 'var(--danger-light)' }}>
          <div className="card-header">
            <h4 className="card-title" style={{ color: 'var(--danger)', margin: '0', fontSize: '0.9rem' }}>
              🚨 Plagiarism Warning Details (Similarity &gt; 40%)
            </h4>
          </div>
          <div className="card-body" style={{ padding: '0 20px 20px' }}>
            <div className="table-wrapper" style={{ border: '1px solid #FECACA' }}>
              <table style={{ background: 'transparent' }}>
                <thead>
                  <tr>
                    <th style={{ color: '#B91C1C', backgroundColor: 'transparent' }}>Student Pair 1</th>
                    <th style={{ color: '#B91C1C', backgroundColor: 'transparent' }}>Student Pair 2</th>
                    <th style={{ color: '#B91C1C', backgroundColor: 'transparent', textAlign: 'center' }}>Similarity Match</th>
                  </tr>
                </thead>
                <tbody>
                  {plagiarismResults.map((result, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #FECACA' }}>
                      <td className="font-semibold" style={{ color: '#B91C1C' }}>{getStudentName(result.student1)}</td>
                      <td className="font-semibold" style={{ color: '#B91C1C' }}>{getStudentName(result.student2)}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="badge badge-danger" style={{ padding: '4px 10px' }}>
                          {Math.round(result.similarity)}% Match
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* List of submissions */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Student Submissions Log</h3>
          <span className="badge badge-primary">{submissions.length} Submissions</span>
        </div>
        <div className="card-body" style={{ padding: '0' }}>
          {submissions.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }} className="text-sm">
              No submissions received yet for this assignment.
            </div>
          ) : (
            <div className="table-wrapper" style={{ border: 'none', borderRadius: '0' }}>
              <table>
                <thead>
                  <tr>
                    <th>Student Details</th>
                    <th>Submitted On</th>
                    <th>Status / Penalty</th>
                    <th>Submission Text</th>
                    <th>Evaluation / Grading</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => {
                    const student = sub.studentId || {};
                    const isGraded = sub.marks !== null && sub.marks !== undefined;
                    const isExpanded = expandedTextId === sub._id;
                    const cleanText = sub.text || '';
                    const displayText = isExpanded ? cleanText : (cleanText.slice(0, 100) + (cleanText.length > 100 ? '...' : ''));

                    return (
                      <tr key={sub._id} style={{ verticalAlign: 'top' }}>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="font-semibold">{student.name || 'Student'}</span>
                            <span className="text-muted text-xs">{student.email}</span>
                          </div>
                        </td>
                        <td>
                          <span className="text-sm text-secondary">
                            {new Date(sub.createdAt).toLocaleString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                            <StatusBadge status={sub.status} />
                            {sub.latePenalty > 0 && (
                              <span className="text-xs font-semibold" style={{ color: 'var(--danger)' }}>
                                Penalty: -{sub.latePenalty.toFixed(1)} Marks
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxWidth: '300px' }}>
                            <p className="text-sm text-secondary" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: '1.4' }}>
                              "{displayText}"
                            </p>
                            {cleanText.length > 100 && (
                              <button
                                onClick={() => setExpandedTextId(isExpanded ? null : sub._id)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: 'var(--primary)',
                                  fontSize: '0.75rem',
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  fontWeight: '600',
                                  padding: 0
                                }}
                              >
                                {isExpanded ? 'Show Less' : 'Read Full Text'}
                              </button>
                            )}
                          </div>
                        </td>
                        <td>
                          {isGraded ? (
                            <div style={{
                              padding: '10px',
                              borderRadius: 'var(--radius)',
                              border: '1px solid var(--border)',
                              backgroundColor: 'rgba(34, 197, 94, 0.05)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '4px'
                            }}>
                              <span className="font-bold text-sm" style={{ color: 'var(--success)' }}>
                                Graded: {sub.marks} / {assignment?.totalMarks || 100}
                              </span>
                              {sub.feedback && (
                                <span className="text-muted text-xs">
                                  Feedback: "{sub.feedback}"
                                </span>
                              )}
                            </div>
                          ) : (
                            <GradeForm
                              submissionId={sub._id}
                              totalMarks={assignment?.totalMarks || 100}
                              onGraded={handleGradeSuccess}
                            />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Submissions;
