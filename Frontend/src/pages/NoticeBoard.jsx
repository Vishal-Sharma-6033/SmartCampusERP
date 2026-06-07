import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import CalendarGrid from '../components/CalendarGrid';
import Toast from '../components/Toast';

const NoticeBoard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('notices');
  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Notices filters
  const [audienceFilter, setAudienceFilter] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-12
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Calendar selections
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);

  // Expandable notices state
  const [expandedNoticeIds, setExpandedNoticeIds] = useState(new Set());

  const canCreate = user?.role === 'ADMIN' || user?.role === 'TEACHER';

  const fetchNotices = async () => {
    setIsLoading(true);
    setError('');
    try {
      const params = {
        year: selectedYear,
        month: selectedMonth,
        type: 'notice'
      };
      const response = await api.get('/notices', { params });
      const data = response.data.data || [];
      setNotices(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch notices.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEvents = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await api.get('/notices/events');
      const data = response.data.data || [];
      setEvents(data);

      const today = new Date();
      const todayEvents = data.filter(e => {
        if (!e.eventDate) return false;
        const eDate = new Date(e.eventDate);
        return eDate.getFullYear() === today.getFullYear() &&
               eDate.getMonth() === today.getMonth() &&
               eDate.getDate() === today.getDate();
      });
      setSelectedDate(today);
      setSelectedDateEvents(todayEvents);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch calendar events.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'notices') {
      fetchNotices();
    } else {
      fetchEvents();
    }
  }, [activeTab, selectedMonth, selectedYear]);

  const handleToggleExpand = (id) => {
    setExpandedNoticeIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDateSelect = (date, dayEvents) => {
    setSelectedDate(date);
    setSelectedDateEvents(dayEvents);
  };

  const filteredNotices = notices.filter(n => {
    if (audienceFilter === 'all') return true;
    return n.audience === audienceFilter;
  });

  const yearsList = [];
  const currentYr = new Date().getFullYear();
  for (let y = currentYr - 2; y <= currentYr + 2; y++) {
    yearsList.push(y);
  }

  const monthsList = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  return (
    <div className="container" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {error && <Toast message={error} type="error" onClose={() => setError('')} />}
      {success && <Toast message={success} type="success" onClose={() => setSuccess('')} />}

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{ margin: 0, fontWeight: 700, color: 'var(--text)' }}>Notice Board</h1>
          <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '0.9rem' }}>
            Keep track of latest college notifications and academic events.
          </p>
        </div>

        {canCreate && (
          <button
            className="btn btn-primary"
            onClick={() => navigate('/admin/notices/create')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create Notice / Event
          </button>
        )}
      </div>

      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border)',
        marginBottom: '24px',
        gap: '24px'
      }}>
        <button
          onClick={() => setActiveTab('notices')}
          style={{
            border: 'none',
            background: 'none',
            padding: '12px 4px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            color: activeTab === 'notices' ? 'var(--primary)' : 'var(--muted)',
            borderBottom: activeTab === 'notices' ? '2px solid var(--primary)' : '2px solid transparent',
            transition: 'all 0.2s'
          }}
        >
          Notices
        </button>
        <button
          onClick={() => setActiveTab('events')}
          style={{
            border: 'none',
            background: 'none',
            padding: '12px 4px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            color: activeTab === 'events' ? 'var(--primary)' : 'var(--muted)',
            borderBottom: activeTab === 'events' ? '2px solid var(--primary)' : '2px solid transparent',
            transition: 'all 0.2s'
          }}
        >
          Events & Calendar
        </button>
      </div>

      {activeTab === 'notices' ? (
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '20px',
            padding: '16px',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)' }}>Audience</label>
              <select
                className="form-input"
                value={audienceFilter}
                onChange={(e) => setAudienceFilter(e.target.value)}
                style={{ minWidth: '140px', height: '38px', padding: '0 8px' }}
              >
                <option value="all">All Audiences</option>
                <option value="students">Students Only</option>
                <option value="teachers">Teachers Only</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)' }}>Month</label>
              <select
                className="form-input"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                style={{ minWidth: '140px', height: '38px', padding: '0 8px' }}
              >
                {monthsList.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)' }}>Year</label>
              <select
                className="form-input"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                style={{ minWidth: '100px', height: '38px', padding: '0 8px' }}
              >
                {yearsList.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="spinner"></div>
            </div>
          ) : filteredNotices.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              color: 'var(--muted)'
            }}>
              <p style={{ margin: 0, fontSize: '1.1rem' }}>No notices published for this period.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredNotices.map((notice) => {
                const isExpanded = expandedNoticeIds.has(notice._id);
                return (
                  <div
                    key={notice._id}
                    className="card"
                    style={{
                      padding: '20px',
                      transition: 'all 0.2s',
                      borderLeft: '4px solid var(--primary)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <h3 style={{ margin: 0, fontWeight: 600, color: 'var(--text)' }}>{notice.title}</h3>
                        <span style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '4px', display: 'inline-block' }}>
                          Published on {new Date(notice.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric', month: 'long', day: 'numeric'
                          })} by {notice.createdBy?.name || 'Academic Admin'}
                        </span>
                      </div>
                      <span className={`badge ${
                        notice.audience === 'students' ? 'badge-primary' : notice.audience === 'teachers' ? 'badge-warning' : 'badge-success'
                      }`} style={{ textTransform: 'capitalize' }}>
                        {notice.audience === 'all' ? 'All Roles' : notice.audience}
                      </span>
                    </div>

                    <p style={{
                      color: 'var(--text)',
                      marginTop: '12px',
                      marginBottom: 0,
                      lineHeight: '1.6',
                      whiteSpace: 'pre-line',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: isExpanded ? 'unset' : '3',
                      textOverflow: 'ellipsis'
                    }}>
                      {notice.description}
                    </p>

                    {notice.description && notice.description.length > 200 && (
                      <button
                        onClick={() => handleToggleExpand(notice._id)}
                        className="btn btn-ghost"
                        style={{ padding: 0, marginTop: '8px', color: 'var(--primary)', height: 'auto', fontWeight: 600, fontSize: '0.85rem' }}
                      >
                        {isExpanded ? 'Show Less ↑' : 'Read Full Notice ↓'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.8fr 1.2fr',
          gap: '24px',
          alignItems: 'start'
        }}>
          <div>
            <CalendarGrid
              events={events}
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ padding: '20px' }}>
              <h3 style={{ margin: '0 0 16px', fontWeight: 600, color: 'var(--text)', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                Events on {selectedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </h3>

              {selectedDateEvents.length === 0 ? (
                <p style={{ color: 'var(--muted)', margin: 0, fontSize: '0.9rem', fontStyle: 'italic' }}>
                  No events scheduled for this date.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {selectedDateEvents.map((event, idx) => (
                    <div key={idx} style={{ padding: '12px', backgroundColor: 'var(--bg)', borderRadius: 'var(--radius)', borderLeft: '3px solid var(--danger)' }}>
                      <h4 style={{ margin: '0 0 4px', fontWeight: 600, fontSize: '0.95rem', color: 'var(--text)' }}>{event.title}</h4>
                      <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.85rem', whiteSpace: 'pre-line' }}>{event.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <h3 style={{ margin: '0 0 16px', fontWeight: 600, color: 'var(--text)' }}>
                Upcoming Events
              </h3>
              {isLoading ? (
                <div style={{ textAlign: 'center', padding: '10px' }}><div className="spinner"></div></div>
              ) : events.length === 0 ? (
                <p style={{ color: 'var(--muted)', margin: 0, fontSize: '0.9rem' }}>No events scheduled.</p>
              ) : (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  maxHeight: '350px',
                  overflowY: 'auto',
                  paddingRight: '4px'
                }}>
                  {events
                    .filter(e => e.eventDate && new Date(e.eventDate) >= new Date(new Date().setHours(0,0,0,0)))
                    .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
                    .map((event, idx) => {
                      const eDate = new Date(event.eventDate);
                      return (
                        <div
                          key={idx}
                          onClick={() => handleDateSelect(eDate, [event])}
                          style={{
                            padding: '10px',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            backgroundColor: isSameDay(selectedDate, eDate) ? 'rgba(79, 70, 229, 0.05)' : 'var(--surface)',
                            borderColor: isSameDay(selectedDate, eDate) ? 'var(--primary)' : 'var(--border)'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>{event.title}</span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', backgroundColor: 'rgba(79, 70, 229, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                              {eDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

export default NoticeBoard;
