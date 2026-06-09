import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const periodIndexes = [0, 1, 2, 3, 4, 5];

const TeacherTimetable = () => {
  const { user } = useAuth();
  const [classesList, setClassesList] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [timetable, setTimetable] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Fetch subjects to determine which classes the teacher teaches
  useEffect(() => {
    const fetchTeacherClasses = async () => {
      setIsLoading(true);
      setError('');
      try {
        const subjectsRes = await api.get('/academic/subjects');
        const allSubjects = subjectsRes.data.data || [];
        const userId = user._id || user.id;

        // Filter subjects taught by this teacher
        const mySubjects = allSubjects.filter(sub => 
          sub.teacher?._id === userId || 
          sub.teacher === userId || 
          (typeof sub.teacher === 'object' && sub.teacher?.id === userId)
        );

        // Derive class combinations (since Subjects in SmartCampus have names, codes, semesters, and sections etc.)
        // Let's create a list of class/sections that exist.
        // Wait, what classes are available? Usually we can let the teacher choose the class name and section.
        // If there's no direct class list on Subject, let's get semesters and create defaults.
        // Or let's fetch timetables or let them input/select.
        // Let's get unique semesters from subjects to form className options (e.g. "Semester 1", "Semester 3")
        // and default sections.
        const classes = mySubjects.map(sub => ({
          className: sub.className || `Semester ${sub.semester}`,
          section: sub.section || 'A' // Default section A
        }));

        // Deduplicate classes
        const uniqueClasses = Array.from(new Set(classes.map(c => `${c.className}-${c.section}`)))
          .map(str => {
            const [className, section] = str.split('-');
            return { className, section };
          });

        setClassesList(uniqueClasses);

        if (uniqueClasses.length > 0) {
          setSelectedClass(uniqueClasses[0].className);
          setSelectedSection(uniqueClasses[0].section);
        } else {
          // If no classes found, set a default search
          setSelectedClass('Semester 1');
          setSelectedSection('A');
        }
      } catch (err) {
        console.error('Failed to resolve teacher subjects:', err);
        setError('Could not retrieve class registry. Using default view.');
        setSelectedClass('Semester 1');
        setSelectedSection('A');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeacherClasses();
  }, [user]);

  // 2. Fetch timetable for selected class/section
  useEffect(() => {
    const fetchTimetable = async () => {
      if (!selectedClass || !selectedSection) return;
      setIsLoading(true);
      setError('');
      try {
        const response = await api.get(`/timetable?className=${selectedClass}&section=${selectedSection}`);
        setTimetable(response.data.data || []);
      } catch (err) {
        console.error('Error fetching class timetable:', err);
        setTimetable([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimetable();
  }, [selectedClass, selectedSection]);

  const getPeriodForDay = (dayName, index) => {
    const dayData = timetable.find(t => t.day.toLowerCase() === dayName.toLowerCase());
    if (!dayData || !dayData.periods) return null;
    const sorted = [...dayData.periods].sort((a, b) => a.startTime.localeCompare(b.startTime));
    return sorted[index] || null;
  };

  const handleClassChange = (e) => {
    const [cName, sec] = e.target.value.split('|');
    setSelectedClass(cName);
    setSelectedSection(sec);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Filters bar */}
      <div className="card">
        <div className="card-body flex items-center justify-between" style={{ padding: '16px 20px', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <span className="form-label" style={{ display: 'block', marginBottom: '4px' }}>Select Class & Section to View</span>
            <select
              className="form-select"
              style={{ minWidth: '220px' }}
              value={selectedClass && selectedSection ? `${selectedClass}|${selectedSection}` : ''}
              onChange={handleClassChange}
            >
              {classesList.length === 0 ? (
                <option value="Semester 1|A">Semester 1 - Section A</option>
              ) : (
                classesList.map((c, idx) => (
                  <option key={idx} value={`${c.className}|${c.section}`}>
                    {c.className} - Section {c.section}
                  </option>
                ))
              )}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--primary-light)', border: '1px solid var(--primary)' }} />
              Lectures Taught by You
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-info" role="alert">
          <span>{error}</span>
        </div>
      )}

      {/* Timetable Weekly Grid */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Class Schedule Grid</h3>
          <span className="badge badge-primary">{selectedClass} - Section {selectedSection}</span>
        </div>
        <div className="card-body" style={{ padding: '0', overflowX: 'auto' }}>
          {isLoading ? (
            <div style={{ padding: '40px' }} className="flex-col items-center">
              <div className="spinner spinner-dark" />
              <span className="text-muted text-xs mt-2">Updating schedule...</span>
            </div>
          ) : timetable.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
              No timetable assigned yet for Class {selectedClass} Section {selectedSection}
            </div>
          ) : (
            <div className="table-wrapper" style={{ border: 'none', borderRadius: '0' }}>
              <table style={{ minWidth: '700px' }}>
                <thead>
                  <tr>
                    <th style={{ width: '100px' }}>Period</th>
                    {daysOfWeek.map((day) => (
                      <th key={day}>{day}</th>
                    ))}
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
                        // Check if the current teacher teaches this period
                        const isMyPeriod = period && (
                          period.teacher === user?.name || 
                          period.teacher === user?.email || 
                          period.teacher === user?._id
                        );

                        return (
                          <td key={day} style={{
                            backgroundColor: isMyPeriod ? 'var(--primary-light)' : '',
                            border: isMyPeriod ? '1px dashed var(--primary)' : '1px solid var(--border)',
                            verticalAlign: 'top',
                            height: '80px',
                            padding: '10px'
                          }}>
                            {period ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                <span className="font-bold text-sm" style={{ color: isMyPeriod ? 'var(--primary)' : 'var(--text)' }}>
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

export default TeacherTimetable;
