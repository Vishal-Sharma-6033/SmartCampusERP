import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import ProgressBar from '../../components/ProgressBar';
import AttendanceCalendar from '../../components/AttendanceCalendar';

const StudentAttendance = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [subjectBreakdown, setSubjectBreakdown] = useState([]);
  const [overallPercentage, setOverallPercentage] = useState(100);
  const [hasWarning, setHasWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchAttendance = async () => {
      setIsLoading(true);
      setError('');
      try {
        const studentId = user._id || user.id;
        const response = await api.get(`/attendance/student/${studentId}`);
        const list = response.data.data || [];
        setRecords(list);

        // Calculate Overall Percentage
        const total = list.length;
        const present = list.filter(r => r.status?.toLowerCase() === 'present').length;
        const overall = total > 0 ? Math.round((present / total) * 100) : 100;
        setOverallPercentage(overall);

        // Calculate Per-Subject Breakdown
        const breakdownMap = {};
        list.forEach(rec => {
          const subName = rec.subject?.name || 'Unknown Subject';
          const subId = rec.subject?._id || 'unknown';
          const isPresent = rec.status?.toLowerCase() === 'present';

          if (!breakdownMap[subId]) {
            breakdownMap[subId] = {
              subjectName: subName,
              totalClasses: 0,
              present: 0,
              absent: 0
            };
          }

          breakdownMap[subId].totalClasses += 1;
          if (isPresent) {
            breakdownMap[subId].present += 1;
          } else {
            breakdownMap[subId].absent += 1;
          }
        });

        const breakdownList = Object.values(breakdownMap).map(sub => {
          const pct = sub.totalClasses > 0 ? Math.round((sub.present / sub.totalClasses) * 100) : 100;
          return {
            ...sub,
            percentage: pct
          };
        });

        setSubjectBreakdown(breakdownList);

        // Check if any subject has attendance < 75%
        const warning = breakdownList.some(sub => sub.percentage < 75);
        setHasWarning(warning);

      } catch (err) {
        console.error('Error fetching attendance:', err);
        setError('Failed to fetch attendance data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendance();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex-col gap-4 w-full" style={{ padding: '20px' }}>
        <div className="skeleton" style={{ height: '80px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' }}>
          <div className="skeleton" style={{ height: '250px' }} />
          <div className="skeleton" style={{ height: '250px' }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {error && (
        <div className="alert alert-danger" role="alert">
          <span>{error}</span>
        </div>
      )}

      {/* Warning banner if any subject has low attendance */}
      {hasWarning && (
        <div className="alert alert-danger" style={{ borderLeft: '4px solid var(--danger)' }}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span className="font-semibold">Attendance Alert: Action Required</span>
            <span className="text-xs">One or more of your subjects has dropped below the minimum required 75% attendance threshold. Please review your lecture records.</span>
          </div>
        </div>
      )}

      {/* Overall stats progress bar card */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Overall Attendance Summary</h3>
        </div>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <ProgressBar value={overallPercentage} />
          <p className="text-secondary text-xs" style={{ marginTop: '5px' }}>
            A minimum cumulative attendance rate of 75% is required to be eligible for end-of-semester term examinations.
          </p>
        </div>
      </div>

      {/* Detailed metrics & heatmap calendar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        {/* Subject Breakdown Table */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Per-Subject Breakdown</h3>
          </div>
          <div className="card-body" style={{ padding: '0' }}>
            <div className="table-wrapper" style={{ border: 'none', borderRadius: '0' }}>
              <table>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th style={{ textAlign: 'center' }}>Present</th>
                    <th style={{ textAlign: 'center' }}>Total</th>
                    <th style={{ textAlign: 'center' }}>Ratio %</th>
                  </tr>
                </thead>
                <tbody>
                  {subjectBreakdown.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: 'var(--muted)' }}>
                        No class records found.
                      </td>
                    </tr>
                  ) : (
                    subjectBreakdown.map((sub, idx) => (
                      <tr key={idx}>
                        <td className="font-semibold">{sub.subjectName}</td>
                        <td style={{ textAlign: 'center' }}>{sub.present}</td>
                        <td style={{ textAlign: 'center' }}>{sub.totalClasses}</td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={`badge ${sub.percentage >= 75 ? 'badge-success' : sub.percentage >= 60 ? 'badge-warning' : 'badge-danger'}`}>
                            {sub.percentage}%
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Heatmap Calendar card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <h3 className="card-title">Monthly Log History</h3>
          </div>
          <div className="card-body flex items-center justify-center" style={{ padding: '24px' }}>
            <AttendanceCalendar records={records} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;
