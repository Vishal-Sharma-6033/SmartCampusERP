import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import ToggleButton from '../../components/ToggleButton';
import Toast from '../../components/Toast';

const MarkAttendance = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState({}); // { studentId: 'present' | 'absent' }
  const [isSubjectsLoading, setIsSubjectsLoading] = useState(true);
  const [isStudentsLoading, setIsStudentsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [step, setStep] = useState(1); // 1 = Select Subject & Date, 2 = Mark Attendance

  // Fetch subjects taught on mount
  useEffect(() => {
    const fetchSubjects = async () => {
      setIsSubjectsLoading(true);
      try {
        const response = await api.get('/academic/subjects');
        setSubjects(response.data.data || []);
      } catch (err) {
        console.error('Failed to fetch subjects:', err);
        setToastMessage('Failed to load courses.');
        setToastType('error');
      } finally {
        setIsSubjectsLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  // Fetch student roster for the selected subject
  const handleLoadRoster = async () => {
    if (!selectedSubject) {
      setToastMessage('Please select a subject first');
      setToastType('error');
      return;
    }
    setIsStudentsLoading(true);
    try {
      const response = await api.get(`/academic/subjects/${selectedSubject}`);
      const subjectDetail = response.data.data;
      const enrolledStudents = subjectDetail?.students || [];
      
      setStudents(enrolledStudents);
      
      // Default all students to 'present'
      const initialRecords = {};
      enrolledStudents.forEach(std => {
        initialRecords[std._id] = 'present';
      });
      setAttendanceRecords(initialRecords);
      setStep(2);
    } catch (err) {
      console.error('Failed to load student list:', err);
      setToastMessage('Failed to load student roster.');
      setToastType('error');
    } finally {
      setIsStudentsLoading(false);
    }
  };

  const handleStatusChange = (studentId, newStatus) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: newStatus
    }));
  };

  const handleBulkAction = (status) => {
    const updated = {};
    students.forEach(std => {
      updated[std._id] = status;
    });
    setAttendanceRecords(updated);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Map records to backend requirements
      const records = Object.keys(attendanceRecords).map(studentId => ({
        student: studentId,
        status: attendanceRecords[studentId]
      }));

      await api.post('/attendance/bulk', {
        subject: selectedSubject,
        date,
        records
      });

      setToastMessage('Attendance processed and saved successfully!');
      setToastType('success');
      setStep(1); // Return to first step
      setStudents([]);
      setAttendanceRecords({});
    } catch (err) {
      console.error('Attendance submit failed:', err);
      setToastMessage(err.response?.data?.message || 'Failed to submit attendance.');
      setToastType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}

      {step === 1 ? (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Setup Attendance Session</h3>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Subject Course</label>
              {isSubjectsLoading ? (
                <div className="skeleton" style={{ height: '40px' }} />
              ) : (
                <select
                  className="form-select"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  <option value="">-- Choose Subject --</option>
                  {subjects.map(sub => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name} ({sub.code})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Lecture Date</label>
              <input
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <button
              onClick={handleLoadRoster}
              className="btn btn-primary"
              style={{ alignSelf: 'flex-start', marginTop: '10px' }}
              disabled={isStudentsLoading}
            >
              {isStudentsLoading ? <span className="spinner"></span> : 'Load Student Roster'}
            </button>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 className="card-title" style={{ margin: '0' }}>Mark Student Attendance</h3>
              <span className="text-muted text-xs">Date: {new Date(date).toLocaleDateString()}</span>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setStep(1)}>
              Change Subject/Date
            </button>
          </div>

          <div className="card-body flex-col gap-4">
            {/* Bulk Actions Bar */}
            <div style={{
              display: 'flex',
              gap: '12px',
              padding: '12px',
              backgroundColor: 'var(--bg)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)'
            }}>
              <span className="font-semibold text-sm flex items-center" style={{ marginRight: 'auto' }}>
                Bulk Actions:
              </span>
              <button className="btn btn-secondary btn-sm" onClick={() => handleBulkAction('present')}>
                Mark All Present
              </button>
              <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => handleBulkAction('absent')}>
                Mark All Absent
              </button>
            </div>

            {/* Student Grid Table */}
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Email Address</th>
                    <th style={{ width: '150px', textAlign: 'center' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: 'var(--muted)' }}>
                        No students enrolled in this course subject.
                      </td>
                    </tr>
                  ) : (
                    students.map(student => (
                      <tr key={student._id}>
                        <td className="font-semibold">{student.name}</td>
                        <td className="text-secondary text-sm">{student.email}</td>
                        <td style={{ textAlign: 'center' }}>
                          <ToggleButton
                            status={attendanceRecords[student._id] || 'present'}
                            onChange={(newStatus) => handleStatusChange(student._id, newStatus)}
                            disabled={isSubmitting}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
              <button className="btn btn-secondary" onClick={() => setStep(1)} disabled={isSubmitting}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting || students.length === 0}>
                {isSubmitting ? <span className="spinner"></span> : 'Submit Attendance Records'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarkAttendance;
