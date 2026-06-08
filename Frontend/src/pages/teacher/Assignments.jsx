import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import Toast from '../../components/Toast';
import DeadlineCountdown from '../../components/DeadlineCountdown';

const TeacherAssignments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [analyticsMap, setAnalyticsMap] = useState({}); // { assignmentId: { totalSubmissions, avgMarks } }
  
  // Loading states
  const [isSubjectsLoading, setIsSubjectsLoading] = useState(true);
  const [isAssignmentsLoading, setIsAssignmentsLoading] = useState(false);
  
  // Notifications
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // 1. Fetch teacher subjects on mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await api.get('/academic/subjects');
        const list = response.data.data || [];
        const userId = user?._id || user?.id;

        // Filter subjects taught by this teacher
        const mySubjects = list.filter(sub => 
          sub.teacher?._id === userId || 
          sub.teacher === userId || 
          (typeof sub.teacher === 'object' && sub.teacher?.id === userId)
        );

        setSubjects(mySubjects);
        if (mySubjects.length > 0) {
          setSelectedSubject(mySubjects[0]._id);
        }
      } catch (err) {
        console.error(err);
        setToastMessage('Failed to load subjects.');
        setToastType('error');
      } finally {
        setIsSubjectsLoading(false);
      }
    };
    fetchSubjects();
  }, [user]);

  // 2. Fetch assignments + analytics whenever selected subject changes
  const fetchAssignments = async () => {
    if (!selectedSubject) return;
    setIsAssignmentsLoading(true);
    try {
      const response = await api.get(`/assignments/subject/${selectedSubject}`);
      const list = response.data.data || [];
      setAssignments(list);

      // Fetch analytics for each assignment in parallel to get real-time submission counts
      const analyticsResults = {};
      await Promise.all(
        list.map(async (assign) => {
          try {
            const res = await api.get(`/assignments/${assign._id}/analytics`);
            analyticsResults[assign._id] = res.data.data;
          } catch (e) {
            analyticsResults[assign._id] = { totalSubmissions: 0 };
          }
        })
      );
      setAnalyticsMap(analyticsResults);
    } catch (err) {
      console.error(err);
      setToastMessage('Failed to fetch assignments.');
      setToastType('error');
      setAssignments([]);
    } finally {
      setIsAssignmentsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [selectedSubject]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assignment? All submissions will be affected.')) return;
    try {
      await api.delete(`/assignments/${id}`);
      setToastMessage('Assignment deleted successfully');
      setToastType('success');
      fetchAssignments();
    } catch (err) {
      console.error(err);
      setToastMessage('Failed to delete assignment');
      setToastType('error');
    }
  };

  const getActiveSubject = () => {
    return subjects.find(s => s._id === selectedSubject);
  };

  const activeSubject = getActiveSubject();
  const totalEnrolled = activeSubject?.students?.length || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}

      {/* Filter and Create Header */}
      <div className="card">
        <div className="card-body flex items-center justify-between" style={{ padding: '16px 20px', flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="form-label" style={{ whiteSpace: 'nowrap' }}>Select Subject:</span>
            {isSubjectsLoading ? (
              <div className="skeleton" style={{ height: '35px', width: '180px' }} />
            ) : (
              <select
                className="form-select"
                style={{ minWidth: '200px' }}
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                {subjects.map(sub => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name} ({sub.code})
                  </option>
                ))}
              </select>
            )}
          </div>
          <button
            onClick={() => navigate('/teacher/assignments/create')}
            className="btn btn-primary"
          >
            + Create Assignment
          </button>
        </div>
      </div>

      {/* Assignments list table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Subject Assignments List</h3>
          {activeSubject && (
            <span className="badge badge-neutral">
              {totalEnrolled} Students Enrolled
            </span>
          )}
        </div>
        <div className="card-body" style={{ padding: '0' }}>
          {isAssignmentsLoading ? (
            <div style={{ padding: '40px' }} className="flex-col items-center">
              <div className="spinner spinner-dark" />
              <span className="text-muted text-xs mt-2">Loading assignments...</span>
            </div>
          ) : assignments.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }} className="text-sm">
              No assignments published for this subject. Click "Create Assignment" to publish one.
            </div>
          ) : (
            <div className="table-wrapper" style={{ border: 'none', borderRadius: '0' }}>
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Deadline</th>
                    <th>Submissions</th>
                    <th>Max Marks</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((assign) => {
                    const stats = analyticsMap[assign._id] || { totalSubmissions: 0 };
                    const isOverdue = new Date(assign.deadline) < new Date();
                    
                    return (
                      <tr key={assign._id}>
                        <td className="font-semibold">{assign.title}</td>
                        <td style={{ color: isOverdue ? 'var(--danger)' : 'var(--text)' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span className="text-sm font-medium">
                              {new Date(assign.deadline).toLocaleString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            <DeadlineCountdown deadline={assign.deadline} />
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${stats.totalSubmissions === totalEnrolled ? 'badge-success' : 'badge-primary'}`}>
                            {stats.totalSubmissions} / {totalEnrolled} submitted
                          </span>
                        </td>
                        <td className="font-medium text-sm">{assign.totalMarks} Marks</td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => navigate(`/teacher/assignments/${assign._id}/submissions`)}
                              className="btn btn-secondary btn-sm"
                            >
                              Submissions
                            </button>
                            <button
                              onClick={() => handleDelete(assign._id)}
                              className="btn btn-ghost btn-sm"
                              style={{ color: 'var(--danger)' }}
                            >
                              Delete
                            </button>
                          </div>
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

export default TeacherAssignments;
