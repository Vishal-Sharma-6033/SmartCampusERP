import React from 'react';

const AttendanceCalendar = ({ records = [] }) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed

  // Calendar math
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const monthName = today.toLocaleString('default', { month: 'long' });

  // Create date cells
  const calendarDays = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= totalDays; d++) {
    calendarDays.push(new Date(year, month, d));
  }

  // Helper map for records lookup
  const recordMap = {};
  records.forEach(rec => {
    if (rec.date) {
      const recDate = new Date(rec.date);
      // Strip time
      const key = `${recDate.getFullYear()}-${recDate.getMonth()}-${recDate.getDate()}`;
      recordMap[key] = rec.status?.toLowerCase();
    }
  });

  const getDayColor = (day) => {
    if (!day) return 'transparent';
    const key = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
    const status = recordMap[key];
    
    if (status === 'present') return 'var(--success)';
    if (status === 'absent') return 'var(--danger)';
    
    const dayOfWeek = day.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) return 'var(--surface-hover)'; // Weekend gray
    
    return 'var(--border)'; // Work day with no recorded class
  };

  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '280px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{monthName} {year}</span>
        <div style={{ display: 'flex', gap: '6px', fontSize: '0.65rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--success)' }} /> Present
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--danger)' }} /> Absent
          </span>
        </div>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '6px',
        textAlign: 'center'
      }}>
        {weekdays.map((wd, i) => (
          <span key={i} className="text-muted text-xs font-semibold" style={{ padding: '2px' }}>{wd}</span>
        ))}
        {calendarDays.map((day, idx) => {
          const color = getDayColor(day);
          const isToday = day && day.getDate() === today.getDate() && day.getMonth() === today.getMonth();
          return (
            <div
              key={idx}
              style={{
                aspectRatio: '1',
                borderRadius: '4px',
                backgroundColor: color === 'transparent' ? 'transparent' : color,
                border: isToday ? '1.5px solid var(--primary)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: day ? '500' : 'normal',
                color: day ? (color === 'var(--success)' || color === 'var(--danger)' ? '#fff' : 'var(--text)') : 'transparent',
              }}
            >
              {day ? day.getDate() : ''}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttendanceCalendar;
