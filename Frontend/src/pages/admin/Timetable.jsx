import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Toast from '../../components/Toast';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const AdminTimetable = () => {
  // Lists fetched on load
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classList, setClassList] = useState([]); // Unique class-section combinations for browser
  
  // Selection for viewing existing timetables
  const [viewClass, setViewClass] = useState('');
  const [viewSection, setViewSection] = useState('');
  const [existingTimetables, setExistingTimetables] = useState([]);
  const [isListLoading, setIsListLoading] = useState(false);

  // Form State for creating a timetable
  const [className, setClassName] = useState('');
  const [section, setSection] = useState('');
  const [day, setDay] = useState('Monday');
  const [periods, setPeriods] = useState([
    { subject: '', teacher: '', startTime: '09:00', endTime: '10:00' }
  ]);

  // Notifications
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch initial subjects and teachers
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [subjectsRes, usersRes] = await Promise.all([
          api.get('/academic/subjects'),
          api.get('/users?role=TEACHER&limit=100')
        ]);
        
        const subjectsList = subjectsRes.data.data || [];
        setSubjects(subjectsList);
        
        // Setup class-section list for viewing based on subjects
        const uniqueClasses = Array.from(new Set(subjectsList.map(s => `${s.className || 'Semester ' + s.semester}|${s.section || 'A'}`)));
        const formattedClasses = uniqueClasses.map(str => {
          const [cName, sec] = str.split('|');
          return { className: cName, section: sec };
        });
        setClassList(formattedClasses);
        if (formattedClasses.length > 0) {
          setViewClass(formattedClasses[0].className);
          setViewSection(formattedClasses[0].section);
        }

        const teachersData = usersRes.data.data?.users || usersRes.data.data || [];
        setTeachers(teachersData);
      } catch (err) {
        console.error('Failed to load dropdown lists:', err);
        setError('Failed to load subjects or teachers for form dropdowns.');
      }
    };
    fetchDropdowns();
  }, []);

  // Fetch existing timetables based on view selection
  const fetchExistingTimetables = async () => {
    if (!viewClass || !viewSection) return;
    setIsListLoading(true);
    try {
      const res = await api.get(`/timetable?className=${viewClass}&section=${viewSection}`);
      setExistingTimetables(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch timetables:', err);
      setExistingTimetables([]);
    } finally {
      setIsListLoading(false);
    }
  };

  useEffect(() => {
    fetchExistingTimetables();
  }, [viewClass, viewSection]);

  // Handle adding/removing periods dynamically
  const addPeriodRow = () => {
    const lastPeriod = periods[periods.length - 1];
    // Suggest next hour slot automatically
    let nextStart = '10:00';
    let nextEnd = '11:00';
    if (lastPeriod) {
      const [sh, sm] = lastPeriod.endTime.split(':').map(Number);
      nextStart = `${String(sh).padStart(2, '0')}:${String(sm).padStart(2, '0')}`;
      nextEnd = `${String(sh + 1).padStart(2, '0')}:${String(sm).padStart(2, '0')}`;
    }
    setPeriods([...periods, { subject: '', teacher: '', startTime: nextStart, endTime: nextEnd }]);
  };

  const removePeriodRow = (index) => {
    if (periods.length === 1) return;
    setPeriods(periods.filter((_, idx) => idx !== index));
  };

  const handlePeriodChange = (index, field, value) => {
    const updated = periods.map((p, idx) => {
      if (idx === index) {
        return { ...p, [field]: value };
      }
      return p;
    });
    setPeriods(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!className || !section || !day) {
      setToastMessage('Please fill class, section, and day details');
      setToastType('error');
      return;
    }

    // Validate that subjects and teachers are selected for all rows
    const invalidRow = periods.find(p => !p.subject || !p.teacher);
    if (invalidRow) {
      setToastMessage('Please select a subject and teacher for all periods');
      setToastType('error');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/timetable', {
        className,
        section,
        day,
        periods
      });
      setToastMessage('Timetable day grid created successfully!');
      setToastType('success');
      
      // Reset form
      setPeriods([{ subject: '', teacher: '', startTime: '09:00', endTime: '10:00' }]);
      
      // Refresh list if the newly created timetable matches view options
      if (className === viewClass && section === viewSection) {
        fetchExistingTimetables();
      } else {
        // Automatically switch view to the created class
        setViewClass(className);
        setViewSection(section);
      }
    } catch (err) {
      console.error(err);
      setToastMessage(err.response?.data?.message || 'Conflict: Check for overlapping period times or teacher clashes.');
      setToastType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this day\'s timetable grid?')) return;
    try {
      await api.delete(`/timetable/${id}`);
      setToastMessage('Timetable grid deleted successfully');
      setToastType('success');
      fetchExistingTimetables();
    } catch (err) {
      console.error('Delete failed:', err);
      setToastMessage('Failed to delete timetable entry.');
      setToastType('error');
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}

      {/* Creation Form Panel */}
      <div className="card" style={{ height: 'fit-content' }}>
        <div className="card-header">
          <h3 className="card-title">Schedule New Timetable Grid</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="form-group">
                <label className="form-label">Class / Sem</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Semester 1"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Section</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. A"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Weekday</label>
              <select className="form-select" value={day} onChange={(e) => setDay(e.target.value)}>
                {daysOfWeek.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="divider" style={{ margin: '10px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="font-semibold text-sm">Periods List</span>
              <button type="button" className="btn btn-secondary btn-sm" onClick={addPeriodRow}>
                + Add Period
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {periods.map((period, idx) => (
                <div key={idx} className="card" style={{ padding: '12px', background: 'var(--bg)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="font-bold text-xs" style={{ color: 'var(--primary)' }}>Period #{idx + 1}</span>
                    {periods.length > 1 && (
                      <button type="button" className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)', padding: '2px' }} onClick={() => removePeriodRow(idx)}>
                        Remove
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div className="form-group">
                      <select
                        className="form-select"
                        value={period.subject}
                        onChange={(e) => handlePeriodChange(idx, 'subject', e.target.value)}
                        required
                      >
                        <option value="">-- Select Subject --</option>
                        {subjects.map(sub => (
                          <option key={sub._id} value={sub.name}>
                            {sub.name} ({sub.code})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <select
                        className="form-select"
                        value={period.teacher}
                        onChange={(e) => handlePeriodChange(idx, 'teacher', e.target.value)}
                        required
                      >
                        <option value="">-- Assign Teacher --</option>
                        {teachers.map(t => (
                          <option key={t._id} value={t.name}>
                            {t.name} ({t.email})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div className="form-group">
                        <label className="text-xs text-secondary">Start Time</label>
                        <input
                          type="time"
                          className="form-input"
                          value={period.startTime}
                          onChange={(e) => handlePeriodChange(idx, 'startTime', e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="text-xs text-secondary">End Time</label>
                        <input
                          type="time"
                          className="form-input"
                          value={period.endTime}
                          onChange={(e) => handlePeriodChange(idx, 'endTime', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button type="submit" className="btn btn-primary w-full" style={{ marginTop: '10px' }} disabled={isSubmitting}>
              {isSubmitting ? 'Scheduling...' : 'Save Weekly Schedule'}
            </button>
          </form>
        </div>
      </div>

      {/* Viewing & Listing Panel */}
      <div className="card" style={{ height: 'fit-content' }}>
        <div className="card-header">
          <h3 className="card-title">Manage Existing Timetables</h3>
        </div>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {/* View Filter dropdowns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group">
              <label className="form-label text-xs">Filter Class</label>
              <select 
                className="form-select" 
                value={viewClass} 
                onChange={(e) => setViewClass(e.target.value)}
              >
                <option value="">-- Select Class --</option>
                {Array.from(new Set(classList.map(c => c.className))).map(cName => (
                  <option key={cName} value={cName}>{cName}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label text-xs">Filter Section</label>
              <select 
                className="form-select" 
                value={viewSection} 
                onChange={(e) => setViewSection(e.target.value)}
              >
                <option value="">-- Select Section --</option>
                {Array.from(new Set(classList.filter(c => c.className === viewClass).map(c => c.section))).map(sec => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="divider" style={{ margin: '5px 0' }} />

          {/* List display */}
          {isListLoading ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <div className="spinner spinner-dark" style={{ margin: '0 auto' }} />
              <p className="text-xs text-muted mt-2">Loading timetable lists...</p>
            </div>
          ) : existingTimetables.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--muted)' }} className="text-sm">
              No timetables configured for this class/section combination.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {existingTimetables.map((item) => (
                <div key={item._id} className="card" style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="font-bold text-sm" style={{ color: 'var(--text)' }}>{item.day}</span>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--danger)', padding: '4px' }}
                    >
                      Delete Grid
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {item.periods?.map((p, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.8rem',
                        padding: '4px 8px',
                        backgroundColor: 'var(--bg)',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        <span className="font-semibold text-secondary">{p.subject}</span>
                        <span className="text-muted text-xs">{p.startTime} - {p.endTime} | {p.teacher}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTimetable;
