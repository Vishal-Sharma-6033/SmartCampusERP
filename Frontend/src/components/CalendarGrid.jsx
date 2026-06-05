import React, { useState } from 'react';

const CalendarGrid = ({ events = [], onDateSelect, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Days in week
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Days in current month
  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  // First day of current month (0 = Sun, 1 = Mon, etc.)
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Generate grid cells
  const cells = [];
  // Padding cells for previous month
  for (let i = 0; i < firstDay; i++) {
    cells.push(null);
  }
  // Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, month, d));
  }

  // Get events on a specific date (ignoring time)
  const getEventsForDate = (date) => {
    if (!date) return [];
    return events.filter(e => {
      if (!e.eventDate) return false;
      const eDate = new Date(e.eventDate);
      return eDate.getFullYear() === date.getFullYear() &&
             eDate.getMonth() === date.getMonth() &&
             eDate.getDate() === date.getDate();
    });
  };

  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  return (
    <div className="calendar-card" style={{
      backgroundColor: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '20px',
      boxShadow: 'var(--shadow)',
      width: '100%'
    }}>
      {/* Calendar Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <h3 style={{ margin: 0, color: 'var(--text)', fontWeight: 600 }}>
          {monthNames[month]} {year}
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={prevMonth} className="btn btn-ghost btn-sm" style={{ padding: '4px 8px' }}>
            &larr;
          </button>
          <button onClick={nextMonth} className="btn btn-ghost btn-sm" style={{ padding: '4px 8px' }}>
            &rarr;
          </button>
        </div>
      </div>

      {/* Weekdays Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: '0.85rem',
        color: 'var(--muted)',
        marginBottom: '10px'
      }}>
        {daysOfWeek.map(d => (
          <div key={d} style={{ padding: '8px 0' }}>{d}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '4px'
      }}>
        {cells.map((date, idx) => {
          if (!date) {
            return <div key={`empty-${idx}`} style={{ aspectRatio: '1', padding: '8px' }} />;
          }

          const dayEvents = getEventsForDate(date);
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, new Date());

          return (
            <button
              key={`day-${date.getDate()}`}
              onClick={() => onDateSelect && onDateSelect(date, dayEvents)}
              style={{
                aspectRatio: '1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: isToday ? '700' : '500',
                position: 'relative',
                transition: 'all 0.2s',
                backgroundColor: isSelected
                  ? 'var(--primary)'
                  : isToday
                  ? 'rgba(79, 70, 229, 0.1)'
                  : 'transparent',
                color: isSelected
                  ? '#ffffff'
                  : isToday
                  ? 'var(--primary)'
                  : 'var(--text)',
                outline: 'none'
              }}
              className="calendar-day-btn"
            >
              <span>{date.getDate()}</span>
              {/* Event Dot */}
              {dayEvents.length > 0 && (
                <div style={{
                  position: 'absolute',
                  bottom: '6px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: isSelected ? '#ffffff' : 'var(--danger)',
                  transition: 'background-color 0.2s'
                }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
