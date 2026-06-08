import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const periodIndexes = [0, 1, 2, 3, 4, 5]; // Periods 1 to 6

const StudentTimetable = () => {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const studentClass = user?.studentProfile?.class;
  const studentSection = user?.studentProfile?.section;

  useEffect(() => {
    const fetchTimetable = async () => {
      if (!studentClass || !studentSection) {
        setIsLoading(false);
        setError('Class and Section details not found in student profile.');
        return;
      }

      setIsLoading(true);
      setError('');
      try {
        const response = await api.get(`/timetable?className=${studentClass}&section=${studentSection}`);
        setTimetable(response.data.data || []);
      } catch (err) {
        console.error('Error fetching student timetable:', err);
        setError('Failed to fetch timetable records.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimetable();
  }, [studentClass, studentSection]);

  if (isLoading) {
    return (
      <div className="flex-col gap-4 w-full" style={{ padding: '20px' }}>
        <div className="skeleton" style={{ height: '140px' }} />
        <div className="skeleton" style={{ height: '350px', marginTop: '20px' }} />
      </div>
    );
  }

  const todayName = new Date().toLocaleString('en-US', { weekday: 'long' });
  const todaySchedule = timetable.find(t => t.day.toLowerCase() === todayName.toLowerCase());
  const sortedTodayPeriods = todaySchedule?.periods
    ? [...todaySchedule.periods].sort((a, b) => a.startTime.localeCompare(b.startTime))
    : [];

  // Helper to extract period data
  const getPeriodForDay = (dayName, index) => {
    const dayData = timetable.find(t => t.day.toLowerCase() === dayName.toLowerCase());
    if (!dayData || !dayData.periods) return null;
    const sorted = [...dayData.periods].sort((a, b) => a.startTime.localeCompare(b.startTime));
    return sorted[index] || null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {error && (
        <div className="alert alert-danger" role="alert">
          <span>{error}</span>
        </div>
      )}

      {/* Today's Schedule Banner */}
      <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
        <div className="card-header">
          <h3 className="card-title">Today's Schedule ({todayName})</h3>
        </div>
        <div className="card-body">
          {sortedTodayPeriods.length === 0 ? (
            <p className="text-secondary text-sm">No classes scheduled for today. Happy Weekend!</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
              {sortedTodayPeriods.map((period, idx) => (
                <div key={idx} style={{
                  padding: '12px',
                  borderRadius: 'var(--radius)',
                  backgroundColor: 'var(--primary-light)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <span className="text-xs text-muted font-semibold">Period {idx + 1} ({period.startTime} - {period.endTime})</span>
                  <span className="font-bold text-sm" style={{ color: 'var(--primary)' }}>{period.subject}</span>
                  <span className="text-secondary text-xs">{period.teacher || 'Assigned Instructor'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Full Weekly Grid */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Weekly Lecture Grid</h3>
          <span className="badge badge-primary">Class {studentClass}-{studentSection}</span>
        </div>
        <div className="card-body" style={{ padding: '0', overflowX: 'auto' }}>
          {timetable.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
              No timetable assigned yet
            </div>
          ) : (
            <div className="table-wrapper" style={{ border: 'none', borderRadius: '0' }}>
              <table style={{ minWidth: '700px' }}>
                <thead>
                  <tr>
                    <th style={{ width: '100px' }}>Period</th>
                    {daysOfWeek.map((day) => {
                      const isToday = day.toLowerCase() === todayName.toLowerCase();
                      return (
                        <th key={day} style={{
                          backgroundColor: isToday ? 'var(--primary-light)' : '',
                          color: isToday ? 'var(--primary)' : ''
                        }}>
                          {day} {isToday && ' (Today)'}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {periodIndexes.map((pIndex) => (
                    <tr key={pIndex}>
                      <td className="font-bold text-xs" style={{ color: 'var(--muted)', background: 'var(--bg)' }}>
                        Period {pIndex + 1}
                      </td>
                      {daysOfWeek.map((day) => {
                        const period = getPeriodForDay(day, pIndex);
                        const isToday = day.toLowerCase() === todayName.toLowerCase();
                        return (
                          <td key={day} style={{
                            backgroundColor: isToday ? 'rgba(79, 70, 229, 0.04)' : '',
                            verticalAlign: 'top',
                            height: '80px',
                            padding: '10px'
                          }}>
                            {period ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                <span className="font-bold text-sm" style={{ color: 'var(--text)' }}>
                                  {period.subject}
                                </span>
                                <span className="text-muted text-xs">
                                  {period.teacher}
                                </span>
                                <span className="badge badge-neutral text-xs" style={{ alignSelf: 'flex-start', fontSize: '0.65rem', textTransform: 'none', padding: '1px 6px' }}>
                                  {period.startTime}-{period.endTime}
                                </span>
                              </div>
                            ) : (
                              <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentTimetable;
