import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import StatsCard from '../../components/StatsCard';
import { getIcon } from '../../components/Sidebar';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [attendancePercentage, setAttendancePercentage] = useState(100);
  const [pendingAssignments, setPendingAssignments] = useState(0);
  const [upcomingExams, setUpcomingExams] = useState(0);
  const [feeStatus, setFeeStatus] = useState('PAID');
  const [feeDue, setFeeDue] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;
    
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError('');
      try {
        const studentId = user._id || user.id;

        const [
          attendanceRes,
          assignmentsRes,
          examsRes,
          feesRes,
          notificationsRes
        ] = await Promise.all([
          api.get(`/attendance/student/${studentId}`).catch(err => ({ data: { data: [] } })),
          api.get(`/assignments/student/${studentId}`).catch(err => ({ data: { data: [] } })),
          api.get('/exams').catch(err => ({ data: { data: [] } })),
          api.get(`/fees/${studentId}`).catch(err => ({ data: null })),
          api.get('/notifications?limit=3').catch(err => ({ data: { data: { notifications: [] } } }))
        ]);

        // 1. Process Attendance
        const attendanceRecords = attendanceRes.data.data || [];
        const totalClasses = attendanceRecords.length;
        const presentClasses = attendanceRecords.filter(r => r.status?.toLowerCase() === 'present').length;
        const attPct = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 100;
        setAttendancePercentage(attPct);

        // 2. Process Assignments
        const submissions = assignmentsRes.data.data || [];
        // If they have submission but it's not graded, it's submitted. 
        // We can check how many assignments exist overall, but since we retrieve student submissions,
        // we'll simulate the pending assignments based on submissions not yet graded or set a placeholder count.
        // Let's count ungraded submissions as a metric.
        const pendingCount = submissions.filter(s => s.marks === undefined || s.marks === null).length;
        setPendingAssignments(pendingCount);

        // 3. Process Exams
        const examsList = examsRes.data.data || [];
        const upcomingCount = examsList.filter(e => new Date(e.date) >= new Date()).length;
        setUpcomingExams(upcomingCount);

        // 4. Process Fees
        const feeData = feesRes.data?.data || feesRes.data;
        if (feeData) {
          setFeeStatus(feeData.status || 'PENDING');
          setFeeDue(feeData.dueAmount || 0);
        } else {
          setFeeStatus('PENDING');
          setFeeDue(0);
        }

        // 5. Process Notifications
        setRecentNotifications(notificationsRes.data.data?.notifications || []);

      } catch (err) {
        setError('Failed to fetch dashboard metrics. Please reload the page.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex-col gap-4 w-full" style={{ padding: '20px' }}>
        <div className="skeleton" style={{ height: '40px', width: '200px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginTop: '20px' }}>
          <div className="skeleton" style={{ height: '100px' }} />
          <div className="skeleton" style={{ height: '100px' }} />
          <div className="skeleton" style={{ height: '100px' }} />
          <div className="skeleton" style={{ height: '100px' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
          <div className="skeleton" style={{ height: '300px' }} />
          <div className="skeleton" style={{ height: '300px' }} />
        </div>
      </div>
    );
  }

  // Circular progress math
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (attendancePercentage / 100) * circumference;
  const attColor = attendancePercentage >= 75 ? 'var(--success)' : attendancePercentage >= 60 ? 'var(--warning)' : 'var(--danger)';

  // Fee Status Badge Color
  const getFeeBadgeClass = (status) => {
    switch (status) {
      case 'PAID': return 'badge-success';
      case 'PARTIAL': return 'badge-warning';
      default: return 'badge-danger';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 className="font-bold text-2xl" style={{ color: 'var(--text)' }}>
          Welcome back, {user?.name}!
        </h2>
        <p className="text-secondary text-sm">
          Roll Number: <span className="font-semibold text-sm">{user?.studentProfile?.rollNumber || 'N/A'}</span> | Class: <span className="font-semibold text-sm">{user?.studentProfile?.class || 'N/A'}</span>-{user?.studentProfile?.section || 'N/A'}
        </p>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <span>{error}</span>
        </div>
      )}

      {/* Top Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px'
      }}>
        <StatsCard
          title="Attendance"
          value={`${attendancePercentage}%`}
          icon={getIcon('chart')}
          color={attColor}
          subtitle="Requirement: >= 75%"
        />
        <StatsCard
          title="Pending Assignments"
          value={pendingAssignments}
          icon={getIcon('clipboard')}
          color="var(--warning)"
          subtitle="Require grading/action"
        />
        <StatsCard
          title="Upcoming Exams"
          value={upcomingExams}
          icon={getIcon('academic')}
          color="var(--info)"
          subtitle="Scheduled this term"
        />
        <div className="card" style={{ borderLeft: `4px solid ${feeStatus === 'PAID' ? 'var(--success)' : 'var(--danger)'}`, width: '100%' }}>
          <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span className="text-secondary text-sm font-medium">Fee Status</span>
              <span className={`badge ${getFeeBadgeClass(feeStatus)}`} style={{ alignSelf: 'flex-start', padding: '4px 10px', fontSize: '0.75rem', marginTop: '2px' }}>
                {feeStatus}
              </span>
              <span className="text-muted text-xs" style={{ marginTop: '2px' }}>Due Amount: ₹{feeDue.toLocaleString()}</span>
            </div>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius)',
              backgroundColor: 'var(--border)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {getIcon('credit-card')}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Middle Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        {/* Attendance Ring Details */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Attendance Overview</h3>
          </div>
          <div className="card-body flex items-center justify-center" style={{ flexDirection: 'column', gap: '20px', padding: '30px 20px' }}>
            <div style={{ position: 'relative', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifySelf: 'center' }}>
              <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r={radius} fill="transparent" stroke="var(--border)" strokeWidth="6" />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke={attColor}
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                />
              </svg>
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column'
              }}>
                <span className="font-bold text-xl">{attendancePercentage}%</span>
              </div>
            </div>
            <p className="text-secondary text-sm" style={{ textAlign: 'center', maxWidth: '240px' }}>
              {attendancePercentage >= 75 
                ? "Your attendance is in good standing. Keep it up!" 
                : "Your attendance is below the 75% minimum requirement. Actions needed!"}
            </p>
          </div>
        </div>

        {/* Notifications & Announcements */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Notifications</h3>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentNotifications.length === 0 ? (
              <p className="text-muted text-sm" style={{ padding: '20px 0', textAlign: 'center' }}>No recent notifications</p>
            ) : (
              recentNotifications.map((notif) => (
                <div key={notif._id} style={{
                  padding: '12px',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  backgroundColor: notif.isRead ? 'transparent' : 'var(--info-light)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}>
                  <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{notif.title}</span>
                  <span className="text-secondary text-xs">{notif.message}</span>
                  <span className="text-muted text-xs" style={{ alignSelf: 'flex-end', marginTop: '4px' }}>
                    {new Date(notif.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
